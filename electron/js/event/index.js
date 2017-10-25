'use strict';
const electron = require('electron/js/main');
const ipcRenderer = electron.ipcRenderer; //进程通信

let shutdown = document.getElementById('shutdown');

showdown.addEventListener('click', ()=>{
    if(confirm('是否关机?')){
        ipcRenderer.send('shutdown');
    }
});