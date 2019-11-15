const path = require('path');
const fs = require('fs');
const os = require('os');
const child_process = require('child_process');

const uuid = require('uuid/v4');
const MD5 = require('md5.js');
const express = require('express');
const PlexAPI = require('plex-api');
const PlexCredentials = require('plex-api-credentials');
const OpenSubtitlesAPI = require('opensubtitles-api');

const settingsService = require('../services/settings');
const SETTINGS = settingsService.keys;

const projectInfo = require('../../package.json');
const projectName = projectInfo.name.split('-').map((v) => `${v.charAt(0).toUpperCase()}${v.slice(1)}`).join('');
const projectVersion = projectInfo.version;

let expressServer;
let expressServerHandler;
const serverAddressList = [];

let plexClient;
let plexDirectories;
let openSubtitlesClient;
let downloadSubForLocale;
let mediaDirs;
let waitConfigCallback;

const resolveViewFile = (...view) => path.resolve(__dirname, '..', 'views', ...view);

// TODO: change this to accept others OS
const listMediaDirs = () => {
    if (mediaDirs) {
        return mediaDirs;
    }

    // const userBaseDir = child_process.execSync('echo $HOME').toString('UTF-8').trim();
    const userBaseDir = child_process.execSync('getent passwd "$USER" | cut -d: -f6').toString('UTF-8').trim();

    mediaDirs = {};

    const dirs = {};

    for (const line of child_process.execSync('lsblk').toString('UTF-8').trim().split("\n").slice(1)) {
        const match = line.match(/(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(?<type>\S+)\s+(?<mount>\S+)/);

        if (!match) {
            continue;
        }

        const { type, mount } = match.groups;

        if (type !== 'part' || /^\/boot\//.test(mount)) {
            continue;
        }

        dirs[mount] = {
            mount,
            dir: `${mount === '/' ? userBaseDir : mount}/plex`,
        };
    }

    for (const line of child_process.execSync('df').toString('UTF-8').trim().split("\n").slice(1)) {
        const match = line.match(/(\S+)\s+(\S+)\s+(\S+)\s+(?<available>\S+)\s+(?<usage>\S+)\%\s+(?<mount>\S+)/);

        if (!match) {
            continue;
        }

        const { available, usage, mount } = match.groups;

        // doesn't consider a partition with less tha 50mb of free space
        if (typeof dirs[mount] === 'undefined' || available < 50 * 1024) {
            continue;
        }

        const freePercentage = 100 - parseInt(usage, 10);
        let free = available / 1024;
        let freeScale = '';

        if (free > 1000) {
            free /= 1024;

            if (free > 1000) {
                free /= 1024;
                freeScale = 'TB';
            } else {
                freeScale = 'GB';
            }
        } else {
            freeScale = 'MB';
        }

        dirs[mount].available = available;
        dirs[mount].label = `${dirs[mount].dir} (free: ${Math.round(free * 100) / 100}${freeScale} / ${freePercentage}%)`;
    }

    // order by the mount with more free space
    Object.values(dirs).sort((a, b) => a.available > b.available ? -1 : (a.available === b.available ? 0 : 1)).forEach((v) => {
        mediaDirs[v.mount] = v;
    });

    return mediaDirs;
};

const getLibrarySections = (reuse) => {
    if (!plexClient) {
        throw new Error('Plex client not defined');
    }

    if (reuse && plexDirectories) {
        return Promise.resolve(plexDirectories);
    }

    return new Promise((resolve) => {
        plexClient.query('/library/sections').then((result) => {
            plexDirectories = { movies: null, shows: null}

            for (const directory of result.MediaContainer.Directory) {
                if (!plexDirectories.movies && directory.type === 'movie') {
                    plexDirectories.movies = directory;
                } else if (!plexDirectories.shows && directory.type === 'show') {
                    plexDirectories.shows = directory;
                }

                if (plexDirectories.movies && plexDirectories.shows) {
                    break
                }
            }

            resolve(plexDirectories);
        });
    });
};

const serverOpen = () => {
    return new Promise((listenerResolve) => {
        (() => {
            if (expressServer) {
                return Promise.resolve();
            }

            expressServer = express();

            expressServer.use('/assets', express.static(path.resolve(__dirname, '..', 'assets')));

            expressServer.use(express.json());
            expressServer.use(express.urlencoded({ extended: true }));

            expressServer.get('/configure', (req, res) => {
                settingsService.get(SETTINGS.PLEX_TOKEN).then((savedToken) => {
                    const view = fs.readFileSync(resolveViewFile('configure', 'step-1.html'))
                        .toString('UTF-8').replace(/\{\/\*\{\{data\}\}\*\/\}/, JSON.stringify({ savedToken }));

                    res.send(view);
                });
            });

            expressServer.post('/configure', (req, res) => {
                new Promise((resolve, reject) => {
                    const plexSessionIdentifier = uuid();

                    const plexConfig = {
                        hostname: '127.0.0.1',
                        options: {
                            identifier: plexSessionIdentifier,
                            product: projectName,
                            version: projectVersion,
                        },
                    };

                    const { username, password } = req.body;
                    let { token } = req.body;

                    if (token) {
                        plexConfig.token = token;
                    } else if (username && password) {
                        plexConfig.username = username;
                        plexConfig.password = password;
                    } else {
                        reject(new Error('Token or username and password must be informed!'));
                        return;
                    }

                    const configPlexClient = new PlexAPI(plexConfig);

                    if (!token) {
                        configPlexClient.authenticator.on('token', (authToken) => {
                            token = authToken;
                        });
                    }

                    configPlexClient.query('/').then((result) => {
                        plexClient = configPlexClient;
                        console.log("%s running Plex Media Server v%s", result.MediaContainer.friendlyName, result.MediaContainer.version);

                        Promise.all(
                            [
                                settingsService.set(SETTINGS.PLEX_TOKEN, token),
                                settingsService.set(SETTINGS.PLEX_SESSION_ID, plexSessionIdentifier),
                            ]
                        ).then(resolve);
                    }).catch((e) => {
                        reject(e);
                    });
                }).then(() => {
                    res.redirect('/configure/step-2');
                }).catch((e) => {
                    res.redirect(`/configure?error=${encodeURIComponent(e.message)}`);
                });
            });

            expressServer.get('/configure/step-2', (req, res) => {
                if (!plexClient) {
                    return res.redirect('/configure');
                }

                Promise.all([
                    getLibrarySections(),
                    settingsService.get(SETTINGS.SUBTITLES_LOCALE, SETTINGS.OS_USERNAME)
                ]).then(([directories, [subLocale, osUsername]]) => {
                    const data = {
                        dirs: listMediaDirs(),
                        dir: {
                            movies: directories.movies ? `${directories.movies.title} (${directories.movies.Location[0].path})` : null,
                            shows: directories.shows ? `${directories.shows.title} (${directories.shows.Location[0].path})` : null,
                        },
                        subLocale, osUsername,
                    };

                    const view = fs.readFileSync(resolveViewFile('configure', 'step-2.html'))
                        .toString('UTF-8').replace(/\{\/\*\{\{data\}\}\*\/\}/, JSON.stringify(data));

                    res.send(view);
                });
            });

            expressServer.post('/configure/step-2', (req, res) => {
                if (!plexClient) {
                    return res.redirect('/configure');
                }

                const saveToDir = req.body['save-to'];
                const moviesDir = req.body['movies-dir'];
                const showsDir = req.body['shows-dir'];
                const subLocale = req.body['sub-locale'];

                const useSavedOpensub = !!parseInt(req.body['use-saved-opensub']);
                const opensubUsername = req.body['opensub-username'];
                let opensubPassword = req.body['opensub-password'];

                new Promise((resolve, reject) => {
                    getLibrarySections().then((directories) => {
                        if (!directories.movies && (!moviesDir || moviesDir.length < 3)) {
                            return reject(new Error('Movies directory name is required!'));
                        }

                        if (!directories.shows && (!showsDir || showsDir.length < 3)) {
                            return reject(new Error('Shows directory name is required!'));
                        }

                        const saveTo = listMediaDirs()[saveToDir];

                        if ((!directories.movies || !directories.shows) && !saveTo) {
                            return reject(new Error('Select a valid directory to save the media files!'));
                        }

                        const saveMoviesTo = path.join(saveTo.dir, 'movies');
                        const saveShowsTo = path.join(saveTo.dir, 'shows');

                        (() => {
                            if (directories.movies && directories.shows) {
                                return Promise.resolve();
                            }

                            if (!directories.movies) {
                                fs.mkdirSync(saveMoviesTo, { recursive: true });

                                if (!fs.existsSync(saveMoviesTo)) {
                                    return reject(new Error(`Can't create movies diretory (${saveMoviesTo}), try other diretory`));
                                }
                            }

                            if (!directories.shows) {
                                fs.mkdirSync(saveShowsTo, { recursive: true });

                                if (!fs.existsSync(saveShowsTo)) {
                                    return reject(new Error(`Can't create shows diretory (${saveShowsTo}), try other diretory`));
                                }
                            }

                            const createPromises = [];

                            plexDirectories = null;

                            if (!directories.movies) {
                                const query = new URLSearchParams({
                                    name: moviesDir,
                                    type: 'movie',
                                    agent: 'com.plexapp.agents.imdb',
                                    scanner: 'Plex Movie Scanner',
                                    language: 'en',
                                    importFromiTunes: '',
                                    enableAutoPhotoTags: '',
                                    location: saveMoviesTo,
                                });

                                createPromises.push(new Promise((resolve) => {
                                    plexClient.postQuery(`/library/sections?${query}`).then(({ MediaContainer }) => {
                                        plexClient.query(`/library/sections/${MediaContainer.Directory[0].key}/refresh`).then(resolve).catch(reject);
                                    }).catch(reject);
                                }));
                            }

                            if (!directories.shows) {
                                const query = new URLSearchParams({
                                    name: showsDir,
                                    type: 'show',
                                    agent: 'com.plexapp.agents.thetvdb',
                                    scanner: 'Plex Series Scanner',
                                    language: 'en',
                                    importFromiTunes: '',
                                    enableAutoPhotoTags: '',
                                    location: saveShowsTo,
                                });

                                createPromises.push(new Promise((resolve) => {
                                    plexClient.postQuery(`/library/sections?${query}`).then(({ MediaContainer }) => {
                                        plexClient.query(`/library/sections/${MediaContainer.Directory[0].key}/refresh`).then(resolve).catch(reject);
                                    }).catch(reject);
                                }));
                            }

                            return Promise.all(createPromises);
                        })().then(() => {
                            (() => {
                                downloadSubForLocale = subLocale;

                                if (subLocale === 'none') {
                                    openSubtitlesClient = null;

                                    return Promise.all([
                                        settingsService.set(SETTINGS.SUBTITLES_LOCALE, subLocale),
                                        settingsService.rm(SETTINGS.OS_USERNAME),
                                        settingsService.rm(SETTINGS.OS_PASSWORD),
                                    ]);
                                }

                                return new Promise((resolve) => {
                                    settingsService.set(SETTINGS.SUBTITLES_LOCALE, subLocale).then(() => {
                                        if (useSavedOpensub) {
                                            resolve();
                                        } else if (opensubUsername && opensubPassword) {
                                            opensubPassword = new MD5().update(opensubPassword).digest('hex');

                                            const configOpenSubtitlesClient = new OpenSubtitlesAPI({
                                                useragent: `${projectName} v1.0`,
                                                username: opensubUsername,
                                                password: opensubPassword,
                                            });

                                            configOpenSubtitlesClient.login().then((res) => {
                                                openSubtitlesClient = configOpenSubtitlesClient;

                                                console.log(`Logged in on OpenSubtitles as ${res.userinfo.UserNickName} (ID: ${res.userinfo.IDUser}) - <${res.userinfo.UserRank}>`);

                                                Promise.all(
                                                    [
                                                        settingsService.set(SETTINGS.OS_USERNAME, opensubUsername),
                                                        settingsService.set(SETTINGS.OS_PASSWORD, opensubPassword),
                                                    ]
                                                ).then(resolve);
                                            }).catch(err => reject(new Error(`Can't connect to OpenSubtitles: ${err.message}`)));
                                        } else {
                                            openSubtitlesClient = null;

                                            Promise.all(
                                                [
                                                    settingsService.rm(SETTINGS.OS_USERNAME),
                                                    settingsService.rm(SETTINGS.OS_PASSWORD),
                                                ]
                                            ).then(resolve);
                                        }
                                    });
                                });
                            })().then(resolve);
                        });
                    });
                }).then(() => {
                    res.redirect('/configure/complete');
                }).catch((e) => {
                    res.redirect(`/configure/step-2?error=${encodeURIComponent(e.message)}`);
                });
            });

            expressServer.get('/configure/complete', (req, res) => {
                if (!plexClient) {
                    return res.redirect('/configure');
                }

                getLibrarySections().then((directories) => {
                    if (!directories.movies || !directories.shows) {
                        return res.redirect('/configure/step-2');
                    }

                    settingsService.get(SETTINGS.SUBTITLES_LOCALE).then((subLocale) => {
                        if (!subLocale) {
                            return res.redirect('/configure/step-2');
                        }

                        if (waitConfigCallback) {
                            waitConfigCallback();
                            waitConfigCallback = null;
                        }

                        res.sendFile(resolveViewFile('configure', 'step-complete.html'));
                    });
                });
            });

            expressServer.get('/add-torrent', (req, res) => {
                res.send('Hello World!');
            });

            expressServer.post('/add-torrent', (req, res) => {
                res.send('Hello World!');
            });

            return new Promise((resolve) => {
                expressServerHandler = expressServer.listen(8686, () => {
                    resolve();
                });
            });
        })().then(() => {
            if (serverAddressList.length === 0) {
                const ifaces = os.networkInterfaces();

                Object.values(ifaces).forEach((ifaceList) => {
                    ifaceList.forEach(({ family, internal, address }) => {
                        if ('IPv4' !== family || internal !== false) {
                            return;
                        }

                        serverAddressList.push(`http://${address}:8686`);
                    });
                });
            }

            new Promise((resolve) => {
                if (plexClient && downloadSubForLocale) {
                    return resolve(true);
                }

                settingsService.get(
                    SETTINGS.PLEX_TOKEN,
                    SETTINGS.PLEX_SESSION_ID,
                    SETTINGS.SUBTITLES_LOCALE,
                    SETTINGS.OS_USERNAME,
                    SETTINGS.OS_PASSWORD
                ).then(([token, plexSessionIdentifier, subLocale, opensubUsername, opensubPassword]) => {
                    if (!token || !plexSessionIdentifier || !subLocale) {
                        return resolve(false);
                    }

                    downloadSubForLocale = subLocale;

                    const configPlexClient = new PlexAPI({
                        hostname: '127.0.0.1',
                        token,
                        options: {
                            identifier: plexSessionIdentifier,
                            product: projectName,
                            version: projectVersion,
                        },
                    });

                    configPlexClient.query('/').then((result) => {
                        plexClient = configPlexClient;
                        console.log("%s running Plex Media Server v%s", result.MediaContainer.friendlyName, result.MediaContainer.version);

                        // OpenSubtitles not configured
                        if (subLocale == 'none' || !opensubUsername) {
                            return resolve(true);
                        }

                        const configOpenSubtitlesClient = new OpenSubtitlesAPI({
                            useragent: `${projectName} v1.0`,
                            username: opensubUsername,
                            password: opensubPassword,
                        });

                        configOpenSubtitlesClient.login().then((res) => {
                            openSubtitlesClient = configOpenSubtitlesClient;
                            console.log(`Logged in on OpenSubtitles as ${res.userinfo.UserNickName} (ID: ${res.userinfo.IDUser}) - <${res.userinfo.UserRank}>`);
                            resolve(true);
                        }).catch(() => resolve(true));
                    }).catch(() => resolve(false));
                });
            }).then(isConfigured => listenerResolve([serverAddressList, isConfigured]));
        });
    });
};

const serverClose = () => {
    return new Promise((listenerResolve) => {
        (() => {
            if (!expressServer || !expressServerHandler) {
                return Promise.resolve();
            }

            return new Promise((resolve) => {
                expressServerHandler.close(() => {
                    expressServer = null;
                    expressServerHandler = null;
                    plexClient = null;
                    plexDirectories = null;
                    openSubtitlesClient = null;
                    waitConfigCallback = null;
                    resolve();
                });
            });
        })().then(listenerResolve);
    });
};

const waitConfigure = (waitCallback) => {
    waitConfigCallback = waitCallback;
};

module.exports = {
    // prepare,
    serverOpen,
    serverClose,
    waitConfigure,
};
