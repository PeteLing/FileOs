
//name : 121 bytes;
//type : 2 bytes;
//attribute : 1 byte;
//begin_num : 3 byte;
//size : 1 byte (文件长度单位为盘块)
//total : 128 bytes;
class DirItem {
    
    constructor (name, type, attr, begin_num, size) {
        this.name = name;
        this.type = type;
        this.attr = attr;
        this.begin_num = begin_num;
        this.size = size;
    }
}

module.exports = DirItem;