const n = 5; //实验中系统允许打开文件的最大数量

let pointer = function (){  //已打开文件表中读、写指针的结构
    this.dnum = 0;       //磁盘盘块号
    this.bnum = 0;       //磁盘盘块内第几个字节
};

let OFTLE = function () {  //已打开文件表项类型定义
    this.name = null; //文件绝对路径名
    this.attribute = null; //文件的属性，用1 个字节表示，所以此用char 类型
    this.number = null; //文件起始盘块号
    this.length = null; //文件长度，文件占用的字节数
    this.flag = null; //操作类型，用“0”表示以读操作方式打开文件，用“1”表示以写操作方式打开文件
    this.read = new pointer(); //读文件的位置，文件打开时dnum 为文件起始盘块号，bnum 为“0”
    this.write = new pointer(); //写文件的位置，文件刚建立时dnum 为文件起始盘块号，bnum 为“0 ，打开文件时dnum 和bnum 为文件的末尾位置
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
}