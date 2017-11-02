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
