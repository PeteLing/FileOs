/**
 * Fat表
 * 对应于磁盘块 数组长度为128
 * 每一个块1024字节
 */

const BLOCK_NUM = 128;    //磁盘块数量
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
        for (let i = 1 ; i < this.blocksArr.length ; ++i) {
            if (ct >= num) {
                break;
            }
            if (this.blocksArr[i] == 0) {
                rst.push(i);
                ct++;
            }
        }
        return rst;
    }

    setBlock(blockIndex, value){
        if (blockIndex < 1 || blockIndex >= this.length)
            return false;
        this.blocksArr[blockIndex] = value;
    }

    getFileBlocks (begin_num) {
        let index = begin_num;
        let rst = [begin_num];
        while (this.blocksArr[index] != -1) {
            index = this.blocksArr[index];
            rst.push(index);
        }
        return rst;
    }

    //释放文件占用的空间
    freeFileBlocks(begin_num) {
        let index = begin_num;
        let next_i = ''
        while (this.blocksArr[index] != -1) {
            next_i = this.blocksArr[index];
            this.blocksArr[index] = 0;
            index = next_i;
        }
        this.blocksArr[index] = 0;
    }
}


module.exports = Fat;