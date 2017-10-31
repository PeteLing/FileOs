'use strict';

/* const electron = require('electron');
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


const newFile = function () {
    file = new FileClass()

};
 */

const BLOCK_SIZE = 1024;   //磁盘块大小
const BLOCK_NUM = 128;    //磁盘块数量
const FILE_TYPE_TXT = 0; //文件类型：txt文件
const FILE_TYPE_DIR = 1;  //文件类型：子目录
const FILE_FLAG_READ = 0 
const FILE_FLAG_WIRTE = 1;

const path = require('path');
const DirItem = require('../clazz/DirItem');
const Fat = require('../clazz/Fat');
const OpenFile = require('../clazz/OpenFile');
const Disk = require('../clazz/Disk');

let disk = new Disk();
let fat = new Fat();
let openfile = new OpenFile();

function getCurrentPath() {
    let currentPath = '/';
    return currentPath;
}

//判断一个文件是否存在
function registerItem(name) {
    //返回信息
    let rst = [{
        code : 0,
        msg : 'successfully',
        diritems: null
    }, {
        code : 1,
        msg : 'the file existed!'
    }, {
        code : 2,
        msg : 'parent dir doesnot exist'
    }, {
        code : 3,
        msg : 'there is no free block'
    }]
    let currentPath = getCurrentPath().split('/');
    //从根目录开始寻找
    let diritems = disk.blocks[1];
    for (let i = 1 ; i < path.length ; ++i) {
        if (currentPath[i] == '') {
            if (diritems.length >= 8)
                return rst[3];
            for (let j = 0 ; j < diritems.length ; ++j) {
                if (diritems[j].attr != 8 && diritems[j].name == name) {
                    return rst[1];
                }
            }
            rst[0].diritems = diritems;
            return rst[0];
        }
        for (let j = 0 ; j < diritems.length ; ++j) {
            if (diritems[j].attr == 8 && diritems[j].name == currentPath[i]) {
                diritems = disk.blocks[diritems[j].begin_num];
                break;
            }
        }
        //父目录不存在
        if (j >= diritems.length) {
            return rst[2];
        }
    }
    if (diritems.length >= 8) {
        return rst[3];
    }
    for (let i = 0 ; i < diritems.length ; ++i) {
        if (diritems[i].attr != 8 && diritems[i].name == name) {
            return rst[1];
        }
    }
    rst[0].diritems = diritems;
    return rst[0];
}

function createFile(name, attr) {
    //判断文件属性是否只读
    let attr_bin = attr.toString(2);
    if (attr.bin[attr_bin.length - 1] == 1) {
        alert('只读文件，无法新建');
        return false;
    }
    //判断是否父目录存在，是否文件重名,是否存在空闲登记项
    let rstOfRegister = registerItem(name);
    if (rstOfRegister.code != 0) {
        console.log(rstOfRegister.msg);
        alert(rstOfRegister.msg);
        return false;
    }
    let diritems = rstOfRegister.diritems;
    //寻找空闲块
    let freeBlocks = fat.getFreeBlocks(1);
    if (freeBlocks.length <= 0) {
        console.log('磁盘空间不足！');
        alert('磁盘空间不足！');
        return false;
    }
    fat.setBlock(freeBlocks[0], -1);

    //登记到目录项
    let file = new DirItem(name, FILE_TYPE_TXT, attr, freeBlocks[0], 0);
    diritems.push(file);
    
    //填写已打开文件表
    let absoluteName = getCurrentPath() + name;
    oftle = openfile.createOFTLE(absoluteName, attr, freeBlocks[0], 0, FILE_FLAG_WIRTE);
}