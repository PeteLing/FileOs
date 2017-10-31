/**
 * Fat表
 * 对应于磁盘块 数组长度为128
 * 每一个块1024字节
 */
class Fat {

    constructor () {
        this.length = BLOCK_NUM; //有128个块
        this.blocksArr = new Array(this.length);  //128个块
        this.blocksArr[0] = -1; //FAT占用
        for (let i = 1 ; i < this.length ; ++i){
            this.blocksArr[i] = 0; //空闲
        }
    }

    /**
     * 遍历Fat表，返回num个空闲块的序号数组
     * @param value
     * @returns {number}
     */
    getFreeBlocks (num) {
        let rst = [];
        let ct = 0;
        for (let i = 1 ; ct < num && i < this.length ; ++i) {
            if (this.blocksArr[i] === 0) {
                rst.push[i];
                ct++;
            }
        }
        return rst;
    }

    setBlock(blockIndex, value){
        this.blocksArr[blockIndex] = value;
    }
}


module.exports = Fat;