'use strict';
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer; //进程通信

const Vue = require('vue/dist/vue.min'); //引入Vuejs

let shutdown = document.getElementById('shutdown');
shutdown.addEventListener('click',()=>{
    if (confirm('是否关机?')){
        ipcRenderer.send('shutdown');
    }
});

//右键文件或者文件夹的时候保存当前点击的元素
let fileNow = null;
let folderNow = null;

/*界面右键菜单*/
const {
    remote
} = require('electron');
const {
    Menu,
    MenuItem
} = remote;

// let file_manager = document.getElementById('file_manager');
// file_manager.addEventListener('click', ()=>{
//     ipcRenderer.send('file_manager');
// });

// const contextMenu = document.getElementById('file-system');
// contextMenu.addEventListener('contextmenu', function(){
//     ipcRenderer.send('show-context-menu')
// });

//创建新文件或者新文件夹菜单
let files_show = new Vue({
    el: '#files_show',
    data: {
        folders: [],
        files: [],
        fileNow:{},
        folderNow:{},
        rename:0
    },
    methods: {
        //右键空白区域出现新建文件或文件夹菜单
        showMenu: (event) => {
            if (event.button === 2) {
                menuCreate.popup(remote.getCurrentWindow());
            }
        },
        //新建文件
        addFile: (file) => {
            files_show.files.push(file);
        },
        //编辑文件
        editFile: (file) => {

        },
        renameFile: (file) => {

        },
        renameSuccess: (arrIndex,event) =>{
            let value = event.target.value;
            files_show.files[arrIndex].name = value;
            files_show.rename = 0;
        },
        deleteFile: (file) =>{

        },
        showFileProperty: (file) => {

        },
        //右键某个文件，出现菜单
        showFileMenu: (event, file) => {
            if (event.button === 2) {
                event.stopPropagation();
                fileNow = file;
                menuFileEdit.popup(remote.getCurrentWindow());
            }
        },
        //添加文件夹
        addFolder: (folder) => {
            files_show.folders.push(folder);
        },
        //双击文件夹进入文件夹
        enterFolder: (folder) => {
            folderNow = folder;
            //改变当前路径

        },
        //文件夹菜单
        showFolderMenu: (event, folder) => {
            if (event.button === 2) {
                event.stopPropagation();
                folderNow = folder;
                menuFolderEdit.popup(remote.getCurrentWindow());
            }
        }
    }
});


/*新建文件或文件夹的菜单*/
const menuCreate = new Menu();
menuCreate.append(new MenuItem({
    label: '新建文件',
    click() {

    }
}));
menuCreate.append(new MenuItem({
    label: '新建文件夹',
    click() {

    }
}));

/*文件的菜单*/
const menuFileEdit = new Menu();
menuFileEdit.append(new MenuItem({
    label: '编辑',
    click() {

    }
}));
menuFileEdit.append(new MenuItem({
    label: '重命名',
    click() {

    }
}));
menuFileEdit.append(new MenuItem({
    label: '删除',
    click() {

    }
}));
menuFileEdit.append(new MenuItem({
    label: '属性',
    click() {

    }
}));

/*文件夹的菜单*/
const menuFolderEdit = new Menu();
menuFolderEdit.append(new MenuItem({
    label: '打开',
    click() {
        files_show.enterFolder(folderNow);
    }
}));
menuFolderEdit.append(new MenuItem({
    label: '重命名',
    click() {
        //files_show.editFile(folderNow);
    }
}));
menuFolderEdit.append(new MenuItem({
    label: '删除',
    click() {

    }
}));
menuFolderEdit.append(new MenuItem({
    label: '属性',
    click() {

    }
}));
