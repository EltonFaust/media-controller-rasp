// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path   = require('path');
const fs     = require('fs');
const sqlite = require('sqlite');
const md5    = require('md5');

let db = null;

async function main() {
    db = await sqlite.open(path.resolve('.', 'data', 'db.sqlite'), { Promise });
    await sqlite.migrate();
}

main();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // fullscreen: true,
        darkTheme: true,

        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // and load the index.html of the app.
    mainWindow.loadURL('http://192.168.0.13:8080');
    // mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
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
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('list-drawns', (event) => {
    new Promise((resolve, reject) => {
        db.all('SELECT * FROM note').then(resolve).catch(reject);
    }).then((list) => {
        event.reply('list-drawns-reply', list);
    }).catch(e => console.log);
});

ipcMain.on('drawn-save', (event, arg) => {
    new Promise((resolve, reject) => {
        const updated = new Date().toISOString();

        if (!arg.id) {
            const filePath = `${md5(`${updated}>>${arg.content}`)}.png`;

            fs.writeFileSync(
                path.resolve('.', 'data', 'note', filePath),
                arg.content.replace(/.*;base64,/, ''),
                { encoding: 'base64' }
            );

            db.run(
                'INSERT INTO note(title, path, created, updated) VALUES(?, ?, ?, ?)',
                updated.substr(0, 19).replace(/T/, ' '), filePath, updated, updated
            ).then((stmt) => {
                resolve(stmt.lastID);
            }).catch(reject);
        } else {
            db.run(
                'UPDATE note SET updated = ? WHERE id = ?',
                updated,
                arg.id
            ).then(() => {
                resolve(arg.id);
            }).catch(reject);
        }
    }).then((id) => {
        event.reply('drawn-save-reply', id);
    }).catch(e => console.log);
});

// ipcMain.on('asynchronous-message', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.reply('asynchronous-reply', 'pong')
// })

// ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.returnValue = 'pong'
// })
