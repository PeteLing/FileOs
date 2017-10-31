/**
 * Fat表
 * 对应于磁盘块 数组长度为128
 * 每一个块1024字节
 */
class Fat{


    constructor () {
        this.length = 128; //有128个块
        this.blocksArr = new Array(this.length);  //128个块
        this.blocksArr[0] = 255; //FAT占用
        this.blocksArr[1] = 255; //FAT占用
        this.blocksArr[2] = 255; //根目录占用
        this.blocksArr[3] = 255; //Desktop目录占用
        for (let i = 4 ; i < this.length ; ++i){
            this.blocksArr[i] = 0; //空闲
        }
    }

    /**
     * 遍历Fat表，返回第一个空闲块的序号
     * 返回-2 则没有空闲块
     * @param value
     * @returns {number}
     */
    getFreeBlock () {
        for (let i = 4 ; i < this.length ; ++i) {
            if (this.blocksArr[i] === 0) {
                return i;
            }
        }
        return -2;
    }

    setBlock(blockIndex, value){
        this.blocksArr[blockIndex] = value;
    }
}


module.exports = Fat;