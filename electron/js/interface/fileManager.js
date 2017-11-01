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

const getLength = require('../utils/getContentBytesLength');

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
function checkItem(name, file_type) {
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
    let currentPath = getCurrentPath().split('/');
    //从根目录开始寻找
    let diritems = disk.blocks[1];
    for (let i = 1 ; i < path.length - 1 ; ++i) {
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
    for (let i = 0 ; i < diritems.length ; ++i) {
        if (diritems[i].type == file_type && diritems[i].name == name) {
            rst[FILE_CHECK_EXIST].diritem = diritems[j];
            rst[FILE_CHECK_EXIST].diritems = diritems;
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
    //判断是否父目录存在，是否文件重名
    let rstOfRegister = checkItem(name, FILE_TYPE_TXT);
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
    let rst = checkItem(name, FILE_TYPE_TXT);
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
function readFile(name, length) {
    let absoluteName = getCurrentPath() + name;
    if (!openfile.existOFTLE(absoluteName)) {
        if(!this.openFile(name, FILE_FLAG_READ))
            return false;
    }
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
        temp = this.getByteVal(size)
        rst.push(temp);
        val = val.substr(temp.length);
    }
}

/**
 * 
 * @param {*文件名} name 
 * @param {*缓冲} buffer 
 * @param {*写长度} length 
 */
function writeFile(name, buffer, length) {
    let absoluteName = getCurrentPath() + name;
    if (!openfile.existOFTLE(absoluteName)) {
        if(!this.openFile(name, FILE_FLAG_READ))
            return false;
    }
    let oftle = openfile.getOFTLE(absoluteName);
    if (oftle.flag != FILE_FLAG_WIRTE) {
        alert('不能以读方式写文件');
        return false;
    }
    let byteLen = this.getByteLen(buffer);
    let size = Math.ceil(byteLen / BLOCK_SIZE)
    let freeBlocks = fat.getFreeBlocks(size);
    if (freeBlocks.length < size) {
        alert('磁盘空间不足!');
        return false;
    }
    freeBlocks.push(-1);
    let contentAry = this.sliceStr2Array(buffer, BLOCK_SIZE);
    for (let i = 0 ; i < size ; ++i) {
        fat.setBlock(freeBlocks[i], freeBlocks[i + 1]);
        disk.setContent(freeBlocks[i], contentAry[i]);
    }
    //修改已打开文件表
    oftle.length = byteLen;
    //修改目录项
    let item = checkItem(name, FILE_TYPE_TXT);
    item.setSize(size);
    return true;
}

function closeFile(name) {
    let absoluteName = getCurrentPath() + name;
    let oftle = openfile.getOFTLE(absoluteName);
    if (oftle == false)
        return true;
    openfile.remove(oftle);
    return true;
}

function deleteFile(name) {
    let checkitem = checkItem(name, FILE_TYPE_TXT);
    if (checkitem.code != FILE_CHECK_EXIST) {
        alert('文件不存在');
        return false;
    }
    let absoluteName = getCurrentPath() + name;
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

function mkdir(name) {
    let rstOfItem = checkItem(name);
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

function ls(name) {
    let rstOfItem = checkItem(name);
    if (rstOfItem != FILE_CHECK_EXIST) {
        alert(rstOfItem.msg);
        return false;
    }
    let diritems = disk.getDir(rstOfItem.diritem.begin_num);
    return diritems;
}

function rd() {
    
}
