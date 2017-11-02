'use strict';
const {remote} = require('electron')
const {Menu, MenuItem} = remote
// const ipcRenderer = electron.ipcRenderer; //进程通信

let shutdown = document.getElementById('shutdown');
shutdown.addEventListener('click',()=>{
    if (confirm('是否关机?')){
        ipcRenderer.send('shutdown');
    }
});
<<<<<<< HEAD
=======

// let file_manager = document.getElementById('file_manager');
// file_manager.addEventListener('click', ()=>{
//     ipcRenderer.send('file_manager');
// });

const contextMenu = document.getElementById('file-system');
contextMenu.addEventListener('contextmenu', function(){
    ipcRenderer.send('show-context-menu')
});

const isFile = document.getElementsByClassName('');
isFile.addEventListener('contextmenu', function(){
    ipcRenderer.send('show-menuFileEdit')
});

const isFolder = document.getElementsByClassName('');
isFolder.addEventListener('contextmenu', function () {
    ipcRenderer.send('show-menuFolderEdit')
});
>>>>>>> e58583a8c15942716edd433274d6bb40cb190a88
