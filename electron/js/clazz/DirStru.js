const FileClass = require('./File');
const FolderClass = require('./Folder');

class DirStru{

    static getCurrDir(){
        return DirStru.currDir;
    }
    constructor(){
        this.dirStru = [];
        this.dirStruIndex = 0;
    }
    get dirStruArray(){
        return this.dirStru;
    }
    set dirStruArray(value){
        this.dirStru = value;
    }
    get dirStruArrayIndex(){
        return this.dirStruIndex;
    }
    set dirStruArrayIndex(value){
        this.dirStruIndex = value;
    }
    addFile(){
        let file = new FileClass(this.dirStruIndex);
        this.dirStru.push(file);
        this.dirStruIndex += 1;
        return file;
    }
    delFile(dirStruArrIndex){
        this.dirStru[dirStruIndex] = null;
        this.dirStru.splice(dirStruIndex, 1);
    }
    addFolder(){
        let folder = new FolderClass(DirStru, this.dirStruIndex);
        this.dirStru.push(folder);
        this.dirStruIndex += 1;
        return folder;
    }
    delFolder(dirStruIndex){
        this.dirStru[this.dirStruIndex] = null;
        this.dirStru.splice(dirStruIndex, 1);
    }
}

DirStru.currDir = '/';
module.exports = DirStru;