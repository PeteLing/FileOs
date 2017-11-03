/**
 * 磁盘
 */
const BLOCK_NUM = 128;    //磁盘块数量
const FILE_TYPE_TXT = 0; //文件类型：txt文件
const FILE_TYPE_DIR = 1;  //文件类型：子目录
const DirItem = require('../clazz/DirItem');
class Disk {

    constructor () {
        this.length = BLOCK_NUM;
        this.blocks = new Array(this.length);
    }

    //取得第num号块的内容
    getContent (num) {
        return this.blocks[num];
    }

    //对第num号块的写入内容
    setContent (num, buffer) {
        if (num < 1 || num >= this.length)
            return false;
        this.blocks[num] = buffer;
    }

    //写入目录项到第num号块的目录
    setDir (num) {
        if (num < 1 || num >= this.length)
        return false;
        this.blocks[num] = [];
    }

    //取出第num号块的所有目录项
    getDir (num) {
        if (num < 1 || num >= this.length)
        return false;
        return this.blocks[num];
    }
}

module.exports = Disk;