const Disk = require('./Disk');
const Fat = require('./Fat');
const DirStru = require('./DirStru');
const Block = require('./Block');


class File {
    /**
     * 文件类
     * @param index 所在目录的索引
     * @param name 文件名
     * @param type 文件类型
     * @param property 文件属性
     * @param startBlock 起始盘块
     * @param length 文件长度
     */
    constructor(index, name='新建文件', type='txt', property='00000100', startBlock=Fat.userFreeBlock(),
                length=Block.blockLength){
        if(startBlock !== -2){
            this.startBlock = startBlock;
        }else{
            console.log('硬盘内存不足');
            alert('硬盘内存不足');
        }
        this.name = name + index + '.' + type;
        this.content = '';
        this.isSaved = 1;
        this.index = index;
        this.type = type;
        this.property = property;
        this.length = length;
    }

    get dirStruIndex() {
        return this.index;
    }

    set dirStruIndex(value) {
        this.index = value;
    }

    get fileName() {
        return this.name;
    }

    set fileName(value) {
        this.name = value;
    }

    get fileType() {
        return this.type;
    }

    set fileType(value) {
        this.type = value;
    }

    get fileProperty() {
        return this.property;
    }

    set fileProperty(value) {
        this.property = value;
    }

    get sBlock() {
        return this.startBlock;
    }

    set sBlock(value) {
        this.startBlock = value;
    }

    get fileLength() {
        return this.length;
    }

    set fileLength(value) {
        this.length = value;
    }

    get fileContent() {
        return this.content;
    }

    set fileContent(value) {
        this.content = value;
    }

}

module.exports = File;