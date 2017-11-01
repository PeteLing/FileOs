/**
 * 磁盘
 */
class Disk {

    constructor () {
        this.length = BLOCK_NUM;
        this.blocks = new Array(this.length);
        let desktopItem = new DirItem('Desktop', FILE_TYPE_DIR, 8, 2, 0);
        this.blocks[1] = [desktopItem]; //根目录
        this.blocks[2] = [];
        fat.setBlock(1, -1);
        fat.setBlock(2, -1);
    }

    getContent (num) {
        return this.blocks[num];
    }

    setContent (num, buffer) {
        if (num < 1 || num >= this.length)
            return false;
        this.blocks[num] = buffer;
    }

    setDir (num) {
        this.blocks[num] = [];
    }
}

module.exports = Disk;