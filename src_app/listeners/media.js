const path = require('path');
const fs = require('fs');
const os = require('os');

const uuid = require('uuid/v4');
const express = require('express');
const PlexAPI = require('plex-api');
const PlexCredentials = require('plex-api-credentials');

let expressServer;
let expressServerHandler;
const serverAddressList = [];

let plexClient;
let plexDirectories;

const resolveViewFile = (view) => path.resolve(__dirname, '..', 'views', view);

const getLibrarySections = () => {
    if (!plexClient) {
        throw new Error('Plex client not defined');
    }

    if (plexDirectories) {
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


            // directories type would be "movie" OR "shows"
            // console.log(result.MediaContainer);

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

            expressServer.use(express.json());
            expressServer.use(express.urlencoded({ extended: true }));

            expressServer.get('/configure', (req, res) => {
                res.sendFile(resolveViewFile(`configure.html`));
            });

            expressServer.post('/configure', (req, res) => {
                new Promise((resolve, reject) => {
                    const plexSessionIdentifier = uuid();

                    const plexConfig = {
                        hostname: '127.0.0.1',
                        options: {
                            identifier: plexSessionIdentifier,
                            product: 'RaspMediaController',
                            version: require('../../package.json').version,
                        },
                    };

                    const { username, password } = req.body;
                    let { token } = req.body;

                    if (token) {
                        // plexConfig.username = username;
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
                        resolve();
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
                    console.log(directories);

                    const data = {
                        dir: {
                            movies: directories.movies ? directories.movies.title : null,
                            shows: directories.shows ? directories.shows.title : null,
                        },
                    };

                    const view = fs.readFileSync(resolveViewFile(`configure-step-2.html`))
                        .toString('UTF-8').replace(/\{\/\*\{\{data\}\}\*\/\}/, JSON.stringify(data));

                    // res.sendFile(resolveViewFile(`configure-step-2.html`));
                    res.send(view);
                });

            });

            expressServer.post('/configure/step-2', (req, res) => {

                // name: Filmes 2
                // type: movie
                // agent: com.plexapp.agents.imdb
                // scanner: Plex Movie Scanner
                // language: pt
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
