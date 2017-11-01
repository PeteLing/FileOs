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
const FILE_CHECK_NOT_EXIST = 0;
const FILE_CHECK_EXIST = 1;
const FILE_CHECK_PARENT_NOT_EXIST = 2;
const FILE_CHECK_BUSY = 3;

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
function checkItem(name) {
    //返回信息
    let rst = [{
        code : FILE_CHECK_NOT_EXIST,
        msg : 'the file does not exist',
        diritems: null
    }, {
        code : FILE_CHECK_EXIST,
        msg : 'the file existed!',
        diritem: null
    }, {
        code : FILE_CHECK_PARENT_NOT_EXIST,
        msg : 'parent dir doesnot exist'
    }, {
        code : FILE_CHECK_BUSY,
        msg : 'there is no free block'
    }]
    let currentPath = getCurrentPath().split('/');
    //从根目录开始寻找
    let diritems = disk.blocks[1];
    for (let i = 1 ; i < path.length ; ++i) {
        if (currentPath[i] == '') {
            if (diritems.length >= 8)
                return rst[FILE_CHECK_BUSY];
            for (let j = 0 ; j < diritems.length ; ++j) {
                if (diritems[j].attr != 8 && diritems[j].name == name) {
                    rst[FILE_CHECK_EXIST].diritem = diritems[j];
                    return rst[FILE_CHECK_EXIST];
                }
            }
            rst[FILE_CHECK_NOT_EXIST].diritems = diritems;
            return rst[FILE_CHECK_NOT_EXIST];
        }
        for (let j = 0 ; j < diritems.length ; ++j) {
            if (diritems[j].attr == 8 && diritems[j].name == currentPath[i]) {
                diritems = disk.blocks[diritems[j].begin_num];
                break;
            }
        }
        //父目录不存在
        if (j >= diritems.length) {
            return rst[FILE_CHECK_PARENT_NOT_EXIST];
        }
    }
    if (diritems.length >= 8) {
        return rst[FILE_CHECK_BUSY];
    }
    for (let i = 0 ; i < diritems.length ; ++i) {
        if (diritems[i].attr != 8 && diritems[i].name == name) {
            rst[FILE_CHECK_EXIST].diritem = diritems[j];
            return rst[FILE_CHECK_EXIST];
        }
    }
    rst[FILE_CHECK_NOT_EXIST].diritems = diritems;
    return rst[FILE_CHECK_NOT_EXIST];
}

function createFile(name, attr) {
    //判断文件属性是否只读
    let attr_bin = attr.toString(2);
    if (attr.bin[attr_bin.length - 1] == 1) {
        alert('只读文件，无法新建');
        return false;
    }
    //判断是否父目录存在，是否文件重名,是否存在空闲登记项
    let rstOfRegister = checkItem(name);
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

/**
 * 
 * @param {*文件名} name 
 * @param {*操作类型：读/写} flag 
 */
function openFile(name, flag) {
    let rst = checkItem(name);
    if (rst.code != FILE_CHECK_EXIST) {
        alert(rst.msg);
        return false;
    }
    if (flag == FILE_FLAG_WIRTE) {
        let attr_bin = rst.diritem.attr.toString(2);
        if (attr_bin[attr_bin.length - 1] == 1) {
            alert('只读文件，无法以写方式打开');
            return false;
        }
    }
    let absoluteName = getCurrentPath() + name;
    if (openfile.existOFTLE(absoluteName))
        return true;
    let oftle = openfile.createOFTLE(absoluteName, rst.diritem.attr, rst.diritem.begin_num, rst.diritem.size, flag);
    if(openfile.push(oftle)) {
        return true;
    } else {
        alert('已达到最大打开文件上限');
        return false;
    }   
}

/**
 * 
 * @param {*文件名} name 
 * @param {*读取长度} length 
 */
function readFile(name, length) {
    if (!openfile.existOFTLE(absoluteName)) {
        this.openFile(name, FILE_FLAG_READ);
    }
    let absoluteName = getCurrentPath() + name;
    let oftle = openfile.getOFTLE(absoluteName);
    if (oftle == false)
        return false;
    if (oftle.flag == FILE_FLAG_WIRTE) {
        alert('不能已写方式打开文件');
        return false;
    }
    let fileblocks = fat.getFileBlocks(oftle.number);
    let content = '';
    for (let i = 0 ; i < fileblocks.length ; ++i) {
        content += disk.getContent(fileblocks[i]);
    }
    return content;

}