const path = require('path');
const fs = require('fs');
const os = require('os');

const { ipcMain } = require('electron');
const sqlite = require('sqlite');
const uuid = require('uuid/v4');
const express = require('express');

let expressServer;
let expressServerHandler;
const serverAddressList = [];

async function prepare() {
    db = await sqlite.open(path.resolve(__dirname, '..', 'data', 'db.sqlite'), { Promise });
    await sqlite.migrate();
}

function listen() {
    ipcMain.on('fetch-settings', (event) => {
        new Promise((resolve, reject) => {
            db.all('SELECT * FROM setting').then(resolve).catch(reject);
        }).then((settings) => {
            event.reply('fetch-settings-reply', settings);
        }).catch(console.error);
    });

    ipcMain.on('note-list-drawns', (event) => {
        new Promise((resolve, reject) => {
            db.all('SELECT * FROM note ORDER BY id DESC').then(resolve).catch(reject);
        }).then((list) => {
            event.reply('note-list-drawns-reply', list);
        }).catch(console.error);
    });

    ipcMain.on('note-rename', (event, arg) => {
        new Promise((resolve, reject) => {
            db.run(
                'UPDATE note SET title = ? WHERE id = ?',
                arg.title,
                arg.id,
            ).then(() => {
                resolve();
            }).catch(reject);
        }).then(() => {
            event.reply('note-rename-reply');
        }).catch(console.error);
    });

    ipcMain.on('note-get', (event, id) => {
        new Promise((resolve, reject) => {
            db.get('SELECT * FROM note WHERE id = ?', id).then(resolve).catch(reject);
        }).then((note) => {
            const fileContent = fs.readFileSync(
                path.resolve('.', 'data', 'note', note.path),
                { encoding: 'base64' },
            );

            event.reply(
                'note-get-reply',
                {
                    ...note,
                    content: `data:image/png;base64,${fileContent}`,
                },
            );
        }).catch(console.error);
    });

    ipcMain.on('note-drawn-save', (event, arg) => {
        new Promise((resolve, reject) => {
            const updated = new Date().toISOString();

            if (!arg.id) {
                const filePath = `${uuid()}.png`;

                fs.writeFileSync(
                    path.resolve('.', 'data', 'note', filePath),
                    arg.content.replace(/.*;base64,/, ''),
                    { encoding: 'base64' },
                );

                db.run(
                    'INSERT INTO note(title, path, created, updated) VALUES(?, ?, ?, ?)',
                    updated.substr(0, 19).replace(/T/, ' '), filePath, updated, updated,
                ).then((stmt) => {
                    resolve(stmt.lastID);
                }).catch(reject);
            } else {
                db.get('SELECT path FROM note WHERE id = ?', arg.id).then((note) => {
                    fs.writeFileSync(
                        path.resolve('.', 'data', 'note', note.path),
                        arg.content.replace(/.*;base64,/, ''),
                        { encoding: 'base64' },
                    );

                    db.run(
                        'UPDATE note SET updated = ? WHERE id = ?',
                        updated,
                        arg.id,
                    ).then(() => {
                        resolve(arg.id);
                    }).catch(reject);
                }).catch(reject);
            }
        }).then((id) => {
            event.reply('note-drawn-save-reply', id);
        }).catch(console.error);
    });

    ipcMain.on('note-drawn-duplicate', (event, id) => {
        new Promise((resolve, reject) => {
            const updated = new Date().toISOString();

            db.get('SELECT * FROM note WHERE id = ?', id).then((note) => {
                const filePath = `${uuid()}.png`;

                fs.copyFileSync(
                    path.resolve('.', 'data', 'note', note.path),
                    path.resolve('.', 'data', 'note', filePath),
                );

                db.run(
                    'INSERT INTO note(title, path, created, updated) VALUES(?, ?, ?, ?)',
                    `Copy of ${note.title}`, filePath, updated, updated,
                ).then((stmt) => {
                    db.get('SELECT * FROM note WHERE id = ?', stmt.lastID).then((note) => {
                        resolve(note);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        }).then((note) => {
            event.reply('note-drawn-duplicate-reply', note);
        }).catch(console.error);
    });

    ipcMain.on('note-remove', (event, id) => {
        new Promise((resolve, reject) => {
            db.get('SELECT path FROM note WHERE id = ?', id).then((note) => {
                fs.unlinkSync(path.resolve('.', 'data', 'note', note.path));

                db.run('DELETE FROM note WHERE id = ?', id).then(() => {
                    resolve();
                }).catch(reject);
            }).catch(reject);
        }).then(() => {
            event.reply('note-remove-reply');
        }).catch(console.error);
    });

    ipcMain.on('media-server-start', (event) => {
        (() => {
            if (expressServer) {
                return Promise.resolve();
            }

            expressServer = express();

            return new Promise((resolve) => {
                expressServer.get('/configure', (req, res) => {
                    res.send('Hello World!');
                });

                expressServer.post('/configure', (req, res) => {
                    res.send('Hello World!');
                });

                expressServer.get('/add-torrent', (req, res) => {
                    res.send('Hello World!');
                });

                expressServer.post('/add-torrent', (req, res) => {
                    res.send('Hello World!');
                });

                expressServerHandler = expressServer.listen(8000, () => {
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

                        serverAddressList.push(address);
                    });
                });
            }

            event.reply('media-server-start-reply', serverAddressList);
        });
    });

    ipcMain.on('media-server-close', (event, arg) => {
        (() => {
            if (!expressServer || !expressServerHandler) {
                return Promise.resolve();
            }

            return new Promise((resolve) => {
                expressServerHandler.close(() => {
                    expressServer = null;
                    expressServerHandler = null;
                    resolve();
                });
            });
        })().then(() => {
            event.reply('media-server-close-reply');
        });
    });

    // ipcMain.on('asynchronous-message', (event, arg) => {
    //     console.log(arg) // prints "ping"
    //     event.reply('asynchronous-reply', 'pong')
    // });

    // ipcMain.on('synchronous-message', (event, arg) => {
    //     console.log(arg) // prints "ping"
    //     event.returnValue = 'pong'
    // });
}

module.exports = {
    prepare,
    listen,
};
