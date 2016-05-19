'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {
  let iconPath = __dirname + '/build/glitch192x192.png';
  console.log(iconPath)
  mainWindow = new BrowserWindow({
    width: 640,
    height: 480,
    icon: iconPath,
    backgroundColor: '#333333',
  });

  mainWindow.loadURL('file://' + __dirname + '/build/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
