const Disk = require('./Disk');
const Fat = require('./Fat');
const Block = require('./Block');


class Folder{
    /**
     *
     * @param dependency 目录结构类（依赖）
     * @param index 所在目录下的索引
     * @param name 文件夹名
     * @param type 文件夹属性
     * @param startBlock 起始盘块
     * @param length 文件夹长度
     */
    constructor(dependency, index, name='新建文件夹', type='00001000', startBlock=Fat.userFreeBlock(),
                length=Block.blockLength){
        this.index = index;
        this.name = name + index;
        this.type = type;
        if(startBlock !== -2){
            this.startBlock = startBlock;
        }else{
            console.log('硬盘内存不足');
            alert('硬盘内存不足');
        }
        this.length = length;
        this.folderContent = new dependency(); //Todo
    }

    get dirStruIndex(){
        return this.index;
    }
    set dirStruIndex(value){
        this.index = value;
    }
    get folderName(){
        return this.name;
    }
    set folderName(value){
        this.name = value;
    }
    get folderType(){
        return this.type;
    }
    set folderType(value){
        this.type = value;
    }
    get sBlock(){
        return this.startBlock;
    }
    get folderLength(){
        return this.length;
    }
    get folderStru(){
        return this.folderContent;
    }
    set folderStru(value){
        this.folderContent = value;
    }
}
module.exports = Folder;