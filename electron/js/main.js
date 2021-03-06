'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const path = require('path');
const url = require('url');

let mainWindow;


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1000, height: 800, resizable: false});

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});


ipcMain.on('shutdown', ()=>{
  app.quit();
});


let file_manager = null;
ipcMain.on('file_manager', ()=>{
  file_manager = new BrowserWindow({
      width:100,
      height:100,
      show:true
  });
    file_manager.loadURL(url.format({
        pathname: path.join(__dirname, '../fileManager.html'),
        protocol: 'file:',
        slashes: true
    }));
});

let edit_file = null;
ipcMain.on('edit_file', ()=>{
  edit_file = new BrowserWindow({
      width:800,
      height:800,
      show:true
  });
    file_manager.loadURL(url.format({
        pathname: path.join(__dirname, '../editFile.html'),
        protocol: 'file:',
        slashes: true
    }));
});
