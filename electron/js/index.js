'use strict';

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
// const open = require('open');

let shutdownDom = document.getElementById('shutdown');
shutdownDom.addEventListener('click', ()=>{
    if(confirm('是否关机?')){
        ipcRenderer.send('shutdown');
    }
});
