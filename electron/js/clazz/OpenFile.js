const n = 5; //实验中系统允许打开文件的最大数量


/**
 * @param name 文件绝对路径名
 * @param attribute 文件的属性，用1个字节表示
 * @param number 文件起始盘块号
 * @param length 文件长度，文件占用的字节数
 * @param flag 操作类型，用“0”表示以读操作方式打开文件，用“1”表示以写操作方式打开文件
 */
let OFTLE = function (name, attribute, number, length, flag) {  //已打开文件表项类型定义
    this.name = name; 
    this.attribute = attribute; 
    this.number = number; 
    this.length = length; 
    this.flag = flag; 
}

let openfile = function () {
    this.OFTLE = []; //已打开文件登记表
    this.maxlength = n;  //最大打开文件数
    this.length = 0; //已打开文件登记表中登记的文件数量

    this.push = function (oftle) {
        if (this.length >= this.maxlength) {
            return false;
        } else {
            this.OFTLE.push(oftle);
            this.length++;
            return true;
        }
    }

    this.remove = function (oftle) {
        let index = this.OFTLE.indexOf(oftle);
        this.OFTLE.splice(index, 1);
        return true;
    }

    this.createOFTLE = function (name, attribute, number, length, flag) {
        return new OFTLE(name, attribute, number, length, flag);
    }

    this.getOFTLE = function (name) {
        for (let i = 0 ; i < this.OFTLE.length ; ++i) {
            if (this.OFTLE[i].name == name) {
                return this.OFTLE[i];
            }
        }
        return false;
    }
}

module.exports = openfile;