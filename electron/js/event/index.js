'use strict';
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer; //进程通信

let shutdown = document.getElementById('shutdown');
shutdown.addEventListener('click',()=>{
    if (confirm('是否关机?')){
        ipcRenderer.send('shutdown');
    }
});

let file_manager = document.getElementById('file_manager');
file_manager.addEventListener('dblclick', ()=>{
    ipcRenderer.send('file_manager');
});

