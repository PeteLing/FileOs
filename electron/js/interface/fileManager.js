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
const DIRITEM_SIZE = 128;
const DIRITEM_MAX_LENGTH = BLOCK_SIZE / DIRITEM_SIZE;
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

const getLength = require('../utils/stringBytes');

let disk = new Disk();
let fat = new Fat();
let openfile = new OpenFile();
let currentPath = '/';

//disk初始化 
let desktopItem = new DirItem('Desktop', FILE_TYPE_DIR, 8, 2, 0);
disk.blocks[1] = [desktopItem]; //根目录加入desktop目录项
disk.blocks[2] = [];
fat.setBlock(0, -1);
fat.setBlock(1, -1);
fat.setBlock(2, -1);
// window.fat = fat;
module.exports.getCurrentPath = function() {
    return currentPath;
}

module.exports.setCurrentPath = function(path) {
    currentPath = path;
}

//判断一个文件是否存在
function checkItem(path, name, file_type) {
    //返回信息
    let rst = [{
        code : FILE_CHECK_NOT_EXIST,
        msg : 'the file does not exist',
        diritems: null
    }, {
        code : FILE_CHECK_EXIST,
        msg : 'the file existed!',
        diritem: null,
        diritems: null,
    }, {
        code : FILE_CHECK_PARENT_NOT_EXIST,
        msg : 'parent dir doesnot exist'
    }]
    let currentPath = path.split('/');
    //从根目录开始寻找
    let diritems = disk.blocks[1];
    for (let i = 1 ; i < currentPath.length - 1 ; ++i) {
        if (currentPath[i] == '') {
            for (let j = 0 ; j < diritems.length ; ++j) {
                if (diritems[j].type == file_type && diritems[j].name == name) {
                    rst[FILE_CHECK_EXIST].diritem = diritems[j];
                    rst[FILE_CHECK_EXIST].diritems = diritems;
                    return rst[FILE_CHECK_EXIST];
                }
            }
            rst[FILE_CHECK_NOT_EXIST].diritems = diritems;
            return rst[FILE_CHECK_NOT_EXIST];
        }
        for (let j = 0 ; j < diritems.length ; ++j) {
            if (diritems[j].type == FILE_TYPE_DIR && diritems[j].name == currentPath[i]) {
                diritems = disk.blocks[diritems[j].begin_num];
                break;
            }
        }
        //父目录不存在
        if (j >= diritems.length) {
            return rst[FILE_CHECK_PARENT_NOT_EXIST];
        }
    }
    //是根目录
    if (name == '/') {
        rst[FILE_CHECK_EXIST].diritems = diritems;
        return rst[FILE_CHECK_EXIST];
    }
    for (let i = 0 ; i < diritems.length ; ++i) {
        if (diritems[i].type == file_type && diritems[i].name == name) {
            rst[FILE_CHECK_EXIST].diritem = diritems[i];
            rst[FILE_CHECK_EXIST].diritems = diritems;
            return rst[FILE_CHECK_EXIST];
        }
    }
    rst[FILE_CHECK_NOT_EXIST].diritems = diritems;
    return rst[FILE_CHECK_NOT_EXIST];
}

module.exports.createFile = function(name, attr) {
    //判断文件属性是否只读
    let attr_bin = attr.toString(2);
    if (attr_bin[attr_bin.length - 1] == 1) {
        alert('只读文件，无法新建');
        return false;
    }
    //判断是否父目录存在，是否文件重名
    let rstOfRegister = checkItem(this.getCurrentPath(), name, FILE_TYPE_TXT);
    if (rstOfRegister.code != FILE_CHECK_NOT_EXIST) {
        console.log(rstOfRegister.msg);
        alert(rstOfRegister.msg);
        return false;
    }
    //判断是否有有空闲
    let diritems = rstOfRegister.diritems;
    if (diritems.length > 8) {
        alert('目录满啦！');
        return false;
    }
    //寻找空闲块
    let freeBlocks = fat.getFreeBlocks(1);
    if (freeBlocks.length < 1) {
        console.log('磁盘空间不足！');
        alert('磁盘空间不足！');
        return false;
    }
    fat.setBlock(freeBlocks[0], -1);
    disk.setContent(freeBlocks[0], '');

    //登记到目录项
    let file = new DirItem(name, FILE_TYPE_TXT, attr, freeBlocks[0], 0);
    diritems.push(file);

    //填写已打开文件表
    let absoluteName = this.getCurrentPath() + name;
    let oftle = openfile.createOFTLE(absoluteName, attr, freeBlocks[0], 0, FILE_FLAG_WIRTE);
    openfile.push(oftle);
}

/**
 *
 * @param {*文件名} name
 * @param {*操作类型：读/写} flag
 */
module.exports.openFile = function(name, flag) {
    let rst = checkItem(this.getCurrentPath(), name, FILE_TYPE_TXT);
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
    let absoluteName = this.getCurrentPath() + name;
    if (openfile.getOFTLE(absoluteName))
        return true;
    let oftle = openfile.createOFTLE(absoluteName, rst.diritem.attr, rst.diritem.begin_num, 1, flag);
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
module.exports.readFile = function(name, length) {
    let absoluteName = this.getCurrentPath() + name;
    if (!openfile.getOFTLE(absoluteName)) {
        if(!this.openFile(name, FILE_FLAG_READ))
            return false;
    }
    let oftle = openfile.getOFTLE(absoluteName);
    if (oftle == false)
        return false;
    // if (oftle.flag == FILE_FLAG_WIRTE) {
    //     alert('不能已写方式打开文件');
    //     return false;
    // }
    let fileblocks = fat.getFileBlocks(oftle.number);
    let content = '';
    for (let i = 0 ; i < fileblocks.length ; ++i) {
        content += disk.getContent(fileblocks[i]);
    }
    return content;
}

//返回val的字节长度
function getByteLen(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) //全角或汉字
            len += 2;
        else
            len += 1;
    }
    return len;
}
//（通过Buffer返回二进制数据的字节长度而不考虑各种编码）
function getBytesLen(val){
    return getLength(val);
}

//（通过Buffer返回二进制数据的字节长度而不考虑各种编码）
function getBytesLen(val){
    return getLength(val);
}

//返回val在规定字节长度max内的值
function getByteVal(val, max) {
    var returnValue = '';
    var byteValLen = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null)
            byteValLen += 2;
        else
            byteValLen += 1;
        if (byteValLen > max)
            break;
        returnValue += val[i];
    }
    return returnValue;
}

function sliceStr2Array(val, size) {
    let rst = [];
    let temp = '';
    while (val.length > 0) {
        temp = getByteVal(val, size)
        rst.push(temp);
        val = val.substr(temp.length);
    }
    return rst;
}

/**
 *
 * @param {*文件名} name
 * @param {*缓冲} buffer
 * @param {*写长度} length
 */
module.exports.writeFile = function(name, buffer, length) {
    let absoluteName = this.getCurrentPath() + name;
    if (!openfile.getOFTLE(absoluteName)) {
        if(!this.openFile(name, FILE_FLAG_WIRTE))
            return false;
    }
    let oftle = openfile.getOFTLE(absoluteName);
    // if (oftle.flag != FILE_FLAG_WIRTE) {
    //     alert('不能以读方式写文件');
    //     return false;
    // }
    let byteLen = getByteLen(buffer);
    let size = Math.ceil(byteLen / BLOCK_SIZE)
    let fileBlocks = fat.getFileBlocks(oftle.number);
    let freeBlocks = [];
    if (fileBlocks.length <= size) {
        freeBlocks = fat.getFreeBlocks(size - fileBlocks.length);
        if (freeBlocks.length < size - fileBlocks.length) {
            alert('磁盘空间不足!');
            return false;
        }

    } else {
        fat.freeFileBlocks(oftle.number);
        fileBlocks.splice(0, size);
    }
    let newBlocks = fileBlocks.concat(freeBlocks);
    newBlocks.push(-1);
    let contentAry = sliceStr2Array(buffer, BLOCK_SIZE);
    for (let i = 0 ; i < size ; ++i) {
        fat.setBlock(newBlocks[i], newBlocks[i + 1]);
        disk.setContent(newBlocks[i], contentAry[i]);
    }
    //修改已打开文件表
    oftle.length = byteLen;
    //修改目录项
    let item = checkItem(this.getCurrentPath(), name, FILE_TYPE_TXT);
    item.diritem.setSize(size);
    return true;
}

module.exports.closeFile = function(name) {
    let absoluteName = this.getCurrentPath() + name;
    let oftle = openfile.getOFTLE(absoluteName);
    if (oftle == false)
        return true;
    openfile.remove(oftle);
    return true;
}

module.exports.deleteFile = function(name) {
    let checkitem = checkItem(this.getCurrentPath(), name, FILE_TYPE_TXT);
    if (checkitem.code != FILE_CHECK_EXIST) {
        alert(checkitem.msg);
        return false;
    }
    let absoluteName = this.getCurrentPath() + name;
    let oftle = openfile.getOFTLE(absoluteName);
    if (oftle != false) {
        alert('文件已经打开');
        return false;
    }
    //删除目录项
    let index = checkitem.diritems.indexOf(checkitem.diritem);
    checkitem.diritems.splice(index, 1);
    //归还磁盘空间;
    fat.freeFileBlocks(checkitem.diritem.begin_num);
    return true;
}

module.exports.mkdir = function(name) {
    let rstOfItem = checkItem(this.getCurrentPath(), name, FILE_TYPE_DIR);
    if (rstOfItem.code != FILE_CHECK_NOT_EXIST) {
        alert(rstOfItem.msg);
        return false;
    }
    if (rstOfItem.diritems >= DIRITEM_MAX_LENGTH) {
        alert('目录满啦！');
        return false;
    }
    let freeBlock = fat.getFreeBlocks(1);
    if (freeBlock.length < 1) {
        alert('磁盘空间不足');
        return false;
    }
    fat.setBlock(freeBlock[0], -1);
    disk.setDir(freeBlock[0]);
    let diritem = new DirItem(name, FILE_TYPE_DIR, 8, freeBlock[0], 0);
    rstOfItem.diritems.push(diritem);
}

module.exports.ls = function(name) {
    let rstOfItem = checkItem(this.getCurrentPath(), name, FILE_TYPE_DIR);
    if (rstOfItem.code != FILE_CHECK_EXIST) {
        alert(rstOfItem.msg);
        return false;
    }
    let diritems = '';
    if (name != '/') 
        diritems = disk.getDir(rstOfItem.diritem.begin_num);
    else 
        diritems = rstOfItem.diritems;
    return diritems;
}

module.exports.rd = function(name) {
    let rstOfItem = checkItem(this.getCurrentPath(), name, FILE_TYPE_DIR);
    if (rstOfItem.code != FILE_CHECK_EXIST) {
        alert(rstOfItem.msg);
        return false;
    }
    let diritem = disk.getDir(rstOfItem.diritem.begin_num);
    if (diritem.length > 0) {
        alert('目录非空');
        return false;
    }
    //删除目录项
    let index = rstOfItem.diritems.indexOf(rstOfItem.diritem);
    rstOfItem.diritems.splice(index, 1);
    //归还磁盘空间;
    fat.freeFileBlocks(rstOfItem.diritem.begin_num);
    return true;
}

module.exports.fat = fat;
module.exports.disk = disk;
module.exports.openfile = openfile;
