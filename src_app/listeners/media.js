const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

const uuid = require('uuid/v4');
const MD5 = require('md5.js');
const express = require('express');
const PlexAPI = require('plex-api');
// const PlexCredentials = require('plex-api-credentials');
const OpenSubtitlesAPI = require('opensubtitles-api');

const settingsService = require('../services/settings');
const projectInfo = require('../../package.json');

const SETTINGS = settingsService.keys;

const projectName = projectInfo.name.split('-').map((v) => `${v.charAt(0).toUpperCase()}${v.slice(1)}`).join('');
const projectVersion = projectInfo.version;

let expressServer;
let expressServerHandler;
const serverAddressList = [];

let plexClient;
let plexDirectories;
// TODO: remove the next comment when OpenSubtitles is being used
// eslint-disable-next-line no-unused-vars
let openSubtitlesClient;
let downloadSubForLocale = 'none';
let mediaDirs;
let waitConfigCallback;


const resolveViewFile = (...view) => path.resolve(__dirname, '..', 'views', ...view);

// TODO: change this to accept others OS
const listMediaDirs = () => {
    if (mediaDirs) {
        return mediaDirs;
    }

    // const userBaseDir = execSync('echo $HOME').toString('UTF-8').trim();
    const userBaseDir = execSync('getent passwd "$USER" | cut -d: -f6').toString('UTF-8').trim();

    mediaDirs = {};

    const dirs = {};

    execSync('lsblk').toString('UTF-8').trim().split('\n')
        .slice(1)
        .forEach((line) => {
            const match = line.match(/(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(?<type>\S+)\s+(?<mount>\S+)/);

            if (!match) {
                return;
            }

            const { type, mount } = match.groups;

            if (type !== 'part' || /^\/boot\//.test(mount)) {
                return;
            }

            dirs[mount] = {
                mount,
                dir: `${mount === '/' ? userBaseDir : mount}/plex`,
            };
        });

    execSync('df').toString('UTF-8').trim().split('\n')
        .slice(1)
        .forEach((line) => {
            const match = line.match(/(\S+)\s+(\S+)\s+(\S+)\s+(?<available>\S+)\s+(?<usage>\S+)%\s+(?<mount>\S+)/);

            if (!match) {
                return;
            }

            const { available, usage, mount } = match.groups;

            // doesn't consider a partition with less tha 50mb of free space
            if (typeof dirs[mount] === 'undefined' || available < 50 * 1024) {
                return;
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
        });

    // order by the mount with more free space
    Object.values(dirs).sort((a, b) => {
        if (a.available > b.available) {
            return -1;
        }

        return a.available === b.available ? 0 : 1;
    }).forEach((v) => {
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
            plexDirectories = { movies: null, shows: null };

            result.MediaContainer.Directory.forEach((directory) => {
                if (!plexDirectories.movies && directory.type === 'movie') {
                    plexDirectories.movies = directory;
                } else if (!plexDirectories.shows && directory.type === 'show') {
                    plexDirectories.shows = directory;
                }

                if (plexDirectories.movies && plexDirectories.shows) {
                    return true;
                }

                return false;
            });

            resolve(plexDirectories);
        });
    });
};

const serverOpen = () => new Promise((listenerResolve) => {
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

        expressServer.post('/configure', (req, res) => new Promise((resolve, reject) => {
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
                console.log('%s running Plex Media Server v%s', result.MediaContainer.friendlyName, result.MediaContainer.version);

                Promise.all(
                    [
                        settingsService.set(SETTINGS.PLEX_TOKEN, token),
                        settingsService.set(SETTINGS.PLEX_SESSION_ID, plexSessionIdentifier),
                    ],
                ).then(resolve);
            }).catch((e) => {
                reject(e);
            });
        }).then(() => {
            res.redirect('/configure/step-2');
        }).catch((e) => {
            res.redirect(`/configure?error=${encodeURIComponent(e.message)}`);
        }));

        expressServer.get('/configure/step-2', (req, res) => {
            if (!plexClient) {
                return res.redirect('/configure');
            }

            return Promise.all([
                getLibrarySections(),
                settingsService.get(SETTINGS.SUBTITLES_LOCALE, SETTINGS.OS_USERNAME),
            ]).then(([directories, [subLocale, osUsername]]) => {
                const data = {
                    dirs: listMediaDirs(),
                    dir: {
                        movies: directories.movies ? `${directories.movies.title} (${directories.movies.Location[0].path})` : null,
                        shows: directories.shows ? `${directories.shows.title} (${directories.shows.Location[0].path})` : null,
                    },
                    subLocale,
                    osUsername,
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

            const useSavedOpensub = !!parseInt(req.body['use-saved-opensub'], 10);
            const opensubUsername = req.body['opensub-username'];
            let opensubPassword = req.body['opensub-password'];

            return new Promise((resolve, reject) => getLibrarySections().then((directories) => {
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

                return (() => {
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

                        createPromises.push(new Promise((resolveCreate) => {
                            plexClient.postQuery(`/library/sections?${query}`).then(({ MediaContainer }) => {
                                plexClient.query(`/library/sections/${MediaContainer.Directory[0].key}/refresh`).then(resolveCreate).catch(reject);
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

                        createPromises.push(new Promise((resolveCreate) => {
                            plexClient.postQuery(`/library/sections?${query}`).then(({ MediaContainer }) => {
                                plexClient.query(`/library/sections/${MediaContainer.Directory[0].key}/refresh`).then(resolveCreate).catch(reject);
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

                        return new Promise((resolveFinish) => {
                            settingsService.set(SETTINGS.SUBTITLES_LOCALE, subLocale).then(() => {
                                if (useSavedOpensub) {
                                    resolveFinish();
                                } else if (opensubUsername && opensubPassword) {
                                    opensubPassword = new MD5().update(opensubPassword).digest('hex');

                                    const configOpenSubtitlesClient = new OpenSubtitlesAPI({
                                        useragent: `${projectName} v1.0`,
                                        username: opensubUsername,
                                        password: opensubPassword,
                                    });

                                    configOpenSubtitlesClient.login().then((resOS) => {
                                        openSubtitlesClient = configOpenSubtitlesClient;

                                        console.log(`Logged in on OpenSubtitles as ${resOS.userinfo.UserNickName} (ID: ${resOS.userinfo.IDUser}) - <${resOS.userinfo.UserRank}>`);

                                        Promise.all(
                                            [
                                                settingsService.set(SETTINGS.OS_USERNAME, opensubUsername),
                                                settingsService.set(SETTINGS.OS_PASSWORD, opensubPassword),
                                            ],
                                        ).then(resolveFinish);
                                    }).catch((err) => reject(new Error(`Can't connect to OpenSubtitles: ${err.message}`)));
                                } else {
                                    openSubtitlesClient = null;

                                    Promise.all(
                                        [
                                            settingsService.rm(SETTINGS.OS_USERNAME),
                                            settingsService.rm(SETTINGS.OS_PASSWORD),
                                        ],
                                    ).then(resolveFinish);
                                }
                            });
                        });
                    })().then(resolve);
                });
            })).then(() => {
                res.redirect('/configure/complete');
            }).catch((e) => {
                res.redirect(`/configure/step-2?error=${encodeURIComponent(e.message)}`);
            });
        });

        expressServer.get('/configure/complete', (req, res) => {
            if (!plexClient) {
                return res.redirect('/configure');
            }

            return getLibrarySections().then((directories) => {
                if (!directories.movies || !directories.shows) {
                    return res.redirect('/configure/step-2');
                }

                return settingsService.get(SETTINGS.SUBTITLES_LOCALE).then((subLocale) => {
                    if (!subLocale) {
                        return res.redirect('/configure/step-2');
                    }

                    if (waitConfigCallback) {
                        waitConfigCallback();
                        waitConfigCallback = null;
                    }

                    return res.sendFile(resolveViewFile('configure', 'step-complete.html'));
                });
            });
        });

        // Torrent
        expressServer.get('/add-torrent', (req, res) => res.send('Hello World!'));

        expressServer.post('/add-torrent', (req, res) => res.send('Hello World!'));

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
                    if (family !== 'IPv4' || internal !== false) {
                        return;
                    }

                    serverAddressList.push(`http://${address}:8686`);
                });
            });
        }

        return new Promise((resolve) => {
            if (plexClient && downloadSubForLocale) {
                return resolve(true);
            }

            return settingsService.get(
                SETTINGS.PLEX_TOKEN,
                SETTINGS.PLEX_SESSION_ID,
                SETTINGS.SUBTITLES_LOCALE,
                SETTINGS.OS_USERNAME,
                SETTINGS.OS_PASSWORD,
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

                return configPlexClient.query('/').then((result) => {
                    plexClient = configPlexClient;
                    console.log('%s running Plex Media Server v%s', result.MediaContainer.friendlyName, result.MediaContainer.version);

                    // TODO: remove
                    // listMedia('all');
                    // listMedia('shows');
                    // listMedia('movies');

                    // OpenSubtitles not configured
                    if (subLocale === 'none' || !opensubUsername) {
                        return resolve(true);
                    }

                    const configOpenSubtitlesClient = new OpenSubtitlesAPI({
                        useragent: `${projectName} v1.0`,
                        username: opensubUsername,
                        password: opensubPassword,
                    });

                    return configOpenSubtitlesClient.login().then((res) => {
                        openSubtitlesClient = configOpenSubtitlesClient;
                        console.log(`Logged in on OpenSubtitles as ${res.userinfo.UserNickName} (ID: ${res.userinfo.IDUser}) - <${res.userinfo.UserRank}>`);
                        resolve(true);
                    }).catch(() => resolve(true));
                }).catch(() => resolve(false));
            });
        }).then((isConfigured) => listenerResolve([serverAddressList, isConfigured]));
    });
});

const serverClose = () => new Promise((listenerResolve) => {
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

const waitConfigure = (waitCallback) => {
    waitConfigCallback = waitCallback;
};

const listMedia = (type) => {
    if (type === 'all') {
        return Promise.all([listMedia('movies'), listMedia('shows')]);
    }

    if (type !== 'movies' && type !== 'shows') {
        return Promise.reject(new Error('Type must be "movies" or "shows"'));
    }

    return new Promise((resolve) => {
        getLibrarySections(true).then((directories) => {
            const query = new URLSearchParams({
                type: type === 'movies' ? 1 : 2,
                includeCollections: 1,
                includeAdvanced: 1,
                includeMeta: 0,
                'X-Plex-Container-Start': 0,
                'X-Plex-Container-Size': 100,
            });

            const sectionId = directories[type].key;

            plexClient.query(`/library/sections/${sectionId}/all?${query}`).then(({ MediaContainer: { Metadata: subSections } }) => {
                const result = [];
                const showPromises = [];

                subSections.forEach((item) => {
                    const resultItem = {
                        key: item.ratingKey,
                        title: item.title,
                        summary: item.summary,
                        thumb: item.thumb ? `http://127.0.0.1:32400${item.thumb}?X-Plex-Token=${plexClient.authToken}` : null,
                    };

                    if (type === 'movies') {
                        resultItem.duration = item.duration;

                        if (downloadSubForLocale !== 'none') {
                            // consider the first file to check the subtitles
                            const fileName = item.Media[0].Part[0].file;
                            // srt file location
                            const strFileName = `${fileName.substr(0, fileName.length - path.extname(fileName).length)}.${downloadSubForLocale}.srt`;
                            // subtitle found for the saved locale
                            resultItem.subtitle = fs.existsSync(strFileName) ? downloadSubForLocale : null;
                        } else {
                            resultItem.subtitle = false;
                        }

                        result.push(resultItem);
                    } else {
                        resultItem.episodeCount = subSections.leafCount;
                        resultItem.seasons = [];

                        // list all seasons basic information
                        showPromises.push(new Promise((resolveShow) => {
                            plexClient.query(`/library/metadata/${item.ratingKey}/children`).then(({ MediaContainer: { Metadata: seasons } }) => {
                                seasons.forEach((season) => {
                                    if (season.type !== 'season') {
                                        return;
                                    }

                                    const thumb = season.thumb || season.parentThumb;

                                    resultItem.seasons.push({
                                        key: season.ratingKey,
                                        title: season.title,
                                        thumb: thumb ? `http://127.0.0.1:32400${thumb}?X-Plex-Token=${plexClient.authToken}` : null,
                                        episodeCount: season.leafCount,
                                        episodes: null,
                                    });
                                });

                                resolveShow(resultItem);
                            });
                        }));
                    }
                });

                if (type === 'movies') {
                    resolve(result);
                } else {
                    Promise.all(showPromises).then(resolve);
                }
            });
        });
    });
};

const detailShowSeason = (seasonKey) => new Promise((resolve) => {
    plexClient.query(`/library/metadata/${seasonKey}/children`).then(({ MediaContainer: { Metadata } }) => {
        const episodes = [];

        Metadata.forEach((episode) => {
            if (episode.type !== 'episode') {
                return;
            }

            const thumb = episode.thumb || episode.parentThumb || episode.grandparentThumb;
            let subtitle;

            if (downloadSubForLocale !== 'none') {
                // consider the first file to check the subtitles
                const fileName = episode.Media[0].Part[0].file;
                // srt file location
                const strFileName = `${fileName.substr(0, fileName.length - path.extname(fileName).length)}.${downloadSubForLocale}.srt`;
                // subtitle found for the saved locale
                subtitle = fs.existsSync(strFileName) ? downloadSubForLocale : null;
            } else {
                subtitle = false;
            }

            episodes.push({
                key: episode.ratingKey,
                identifier: `S${`0${episode.parentIndex}`.substr(-2)}E${`0${episode.index}`.substr(-2)}`,
                title: episode.title,
                duration: episode.duration,
                summary: episode.summary,
                thumb: thumb ? `http://127.0.0.1:32400${thumb}?X-Plex-Token=${plexClient.authToken}` : null,
                subtitle,
            });
        });

        resolve(episodes);
    });
});

module.exports = {
    serverOpen,
    serverClose,
    waitConfigure,
    listMedia,
    detailShowSeason,
};
