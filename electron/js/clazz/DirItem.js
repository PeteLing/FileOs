
//name : 119bytes;
//type : 2 bytes;
//attribute : 1 byte;
//begin_num : 3 byte;
//size : 3 bytes (文件长度单位为盘块)
//total : 128 bytes;
class DirItem {
    
    constructor (name, type, attr, begin_num, size) {
        this.name = name;
        this.type = type;
        this.attr = attr;
        this.begin_num = begin_num;
        this.size = size;
    }

    setSize(size) {
        size = parseInt(size);
        if (size < 0 || size > 128)
            return false;
        this.size = size;
    }
}

module.exports = DirItem;