const path = require('path');
const fs = require('fs');
const os = require('os');

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

const resolveViewFile = (...view) => path.resolve(__dirname, '..', 'views', ...view);

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

                    plexClient = new PlexAPI(plexConfig);

                    if (!token) {
                        plexClient.authenticator.on('token', (authToken) => {
                            token = authToken;
                        });
                    }

                    plexClient.query('/').then((result) => {
                        console.log("%s running Plex Media Server v%s", result.MediaContainer.friendlyName, result.MediaContainer.version);
                        settingsService.set(SETTINGS.PLEX_TOKEN, token).then(resolve);
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
                getLibrarySections().then((directories) => {

                    const data = {
                        dir: {
                            movies: directories.movies ? directories.movies.title : null,
                            shows: directories.shows ? directories.shows.title : null,
                        },
                    };

                    const view = fs.readFileSync(resolveViewFile('configure', 'step-2.html'))
                        .toString('UTF-8').replace(/\{\/\*\{\{data\}\}\*\/\}/, JSON.stringify(data));

                    res.send(view);
                });
            });

            expressServer.post('/configure/step-2', (req, res) => {
                const moviesDir = req.body['movies-dir'];
                const showsDir = req.body['shows-dir'];
                const subLocale = req.body['sub-locale'];
                const opensubUsername = req.body['opensub-username'];
                let opensubPassword = req.body['opensub-password'];

                new Promise((resolve, reject) => {
                    getLibrarySections().then((directories) => {
                        console.log(directories);

                        if (!directories.movies && (!moviesDir || moviesDir.length < 3)) {
                            return reject(new Error('Movies directory name is required!'));
                        }

                        if (!directories.shows && (!showsDir || showsDir.length < 3)) {
                            return reject(new Error('Shows directory name is required!'));
                        }

                        (() => {
                            if (!subLocale || !opensubUsername || !opensubPassword) {
                                return Promise.resolve();
                            }

                            return new Promise((resolve) => {
                                settingsService.set(SETTINGS.SUBTITLES_LOCALE, subLocale).then(() => {
                                    if (opensubUsername && opensubPassword) {
                                        opensubPassword = new MD5().update(opensubPassword).digest('hex');

                                        openSubtitlesClient = new OpenSubtitlesAPI({
                                            useragent: `${projectName} v1.0`,
                                            username: opensubUsername,
                                            password: opensubPassword,
                                        });

                                        openSubtitlesClient.login().then((res) => {
                                            console.log('Logged in on OpenSubtitles');
                                            console.log(res.userinfo);

                                            Promise.all(
                                                [
                                                    settingsService.set(SETTINGS.OS_USERNAME, opensubUsername),
                                                    settingsService.set(SETTINGS.OS_PASSWORD, opensubPassword),
                                                ]
                                            ).then(resolve);
                                        }).catch(err => reject(new Error(`Can't connect to OpenSubtitles: ${err.message}`)));
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                        })().then(() => {
                            resolve();
                        });
                    });
                }).then(() => {
                    res.send('Hello World!');
                }).catch((e) => {
                    res.redirect(`/configure/step-2?error=${encodeURIComponent(e.message)}`);
                });

                // const { username, password } = req.body;

                // name: Filmes 2
                // type: movie
                // agent: com.plexapp.agents.imdb
                // scanner: Plex Movie Scanner
                // language: en
                // importFromiTunes:
                // enableAutoPhotoTags:
                // location: /home/elton/Público

                // name: Series
                // type: show
                // agent: com.plexapp.agents.thetvdb
                // scanner: Plex Series Scanner
                // language: en
                // importFromiTunes:
                // enableAutoPhotoTags:
                // location: /home/elton/Público
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

            listenerResolve(serverAddressList);
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
                    resolve();
                });
            });
        })().then(listenerResolve);
    });
};

module.exports = {
    // prepare,
    serverOpen,
    serverClose,
};
