// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const sqlite = require('sqlite');
const md5 = require('md5');

let db = null;

async function main() {
    db = await sqlite.open(path.resolve('.', 'data', 'db.sqlite'), { Promise });
    await sqlite.migrate();
}

main();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    let windowData = {};

    if (process.env.NODE_ENV === 'development') {
        windowData = {
            width: 800,
            height: 600,
        };
    } else {
        windowData = {
            fullscreen: true,
        };
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
        ...windowData,
        darkTheme: true,

        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (process.env.NODE_ENV === 'development') {
        // load url for vue serve
        mainWindow.loadURL('http://localhost:8080');

        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    } else {
        // load the index.html of the app.
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

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
        event.reply('note-rename-reply', arg.title);
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
            const filePath = `${md5(`${updated}>>${arg.content}`)}.png`;

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

// ipcMain.on('asynchronous-message', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.reply('asynchronous-reply', 'pong')
// })

// ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.returnValue = 'pong'
// })
