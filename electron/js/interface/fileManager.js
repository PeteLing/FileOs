'use strict';

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const DiskClass = require('./js/clazz/Disk');
const DirStruClass = require('./js/clazz/DirStru');
const FileClass = require('./js/clazz/File');
const FolderClass = require('./js/clazz/Folder');
const Fat = require('./js/clazz/Fat');
const storage = require('./js/clazz/localStorage');
const stringBytes = require('./js/util/stringBytes');
const Ram = require('./js/clazz/Ram');

const dirStru = new DirStruClass();
const disk = new DiskClass();



