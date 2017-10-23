/**
 * Fat表
 * 对应于磁盘块 数组长度为128
 */
class Fat{
    /**
     * 遍历Fat表，返回空闲块的序号
     * 返回-2 则没有空闲块
     * @param value
     * @returns {number}
     */
    static userFreeBlock(value = 255){
        for (let i = 2; i < Fat.fatArr.length; i++){
            if (Fat.fatArr[i] === 0){
                Fat.fatArr[i] = value;
                return i;
            }
        }
        return -2;
    }

    static setBlock(blockIndex, value){
        Fat.fatArr[blockIndex] = value;
    }

    constructor(){
    }
}

Fat.fatArr = new Array(128);
Fat.fatArr[0] = 255;
Fat.fatArr[0] = 255;
for (let i = 2; i < Fat.fatArr.length; i++){
    Fat.fatArr[i] = 0;
    // todo: 可随机设置Fat.fatArr[i] = 254表示损坏块
}

module.exports = Fat;