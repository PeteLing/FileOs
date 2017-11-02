window.fs = require('../../js/interface/fileManager.js');

const FILE_TYPE_TXT = 0; //文件类型：txt文件
const FILE_TYPE_DIR = 1;  //文件类型：子目录

fs.createFile('test', 4);
drawAFatTable();
drawAOpenFileTable();
setWinCurrentPath();
showDirView('/');

function setWinCurrentPath(path = '/') {
    let pathviw = document.getElementById('path');
    pathviw.innerText = path;
    fs.setCurrentPath(path);
}

function getWinCurrentPath() {
    return document.getElementById('path').innerText;
}

function showDirView(dir) {
    let content = document.getElementById('file-system').getElementsByClassName('content')[0];
    content.innerHTML = '';
    let ary = fs.ls(dir);
    for (let i = 0 ; i < ary.length ; ++i) {
        let article = document.createElement('article');
        article.setAttribute('title', ary[i].name);
        let img = '';
        if(ary[i].type == FILE_TYPE_DIR) {
            article.setAttribute('type', 'dir');
            img = document.createElement('img');
            img.setAttribute('src', './assets/images/file.png');
        } else {
            article.setAttribute('type', 'txt');
            img = document.createElement('img');
            img.setAttribute('src', './assets/images/TXT.png');
        }
        let p = document.createElement('p');
        p.innerText = ary[i].name;
        article.appendChild(img);
        article.appendChild(p);
        content.appendChild(article);
    }
}

//自动绘制fat表格
function drawAFatTable() {
    let blocks = fs.fat.getBlocks();
    let table = document.getElementById('fat');
    for (let i = 0 ; i < 16 ; ++i) {
        let tr = document.createElement('tr');
        for (let j = 0 ; j < 8 ; ++j) {
            let td = document.createElement('td');
            td.innerHTML= blocks[i * 8 + j];
            if (td.innerHTML != 0) {
                td.setAttribute('class', 'busy');
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

//自动绘制已打开文件表格
function drawAOpenFileTable() {
    let openfiles = fs.openfile.getAll();
    let table = document.getElementById('openfile');
    let tr = document.createElement('tr');
    tr.innerHTML = '<th>name</th><th>attr</th><th>num</th><th>flag</th>'
    table.appendChild(tr);
    for (let i = 0 ; i < openfiles.length ; ++i) {
        tr = document.createElement('tr');
        tr.innerHTML = "<td>" + openfiles[i].name + "</td>" +
        "<td>" + openfiles[i].attribute + "</td>" +
        "<td>" + openfiles[i].number + "</td>" +
        "<td>" + openfiles[i].flag + "</td>"
        table.appendChild(tr);
    }
}


var winbt = document.getElementById('winbt');
winbt.onclick = function () {
    var win_menu = document.getElementById('win-menu');
    if (win_menu.className == 'hidden') {
        win_menu.setAttribute('class', null);
        document.getElementsByClassName('warp')[0].style.display = 'block';
    } else {
        win_menu.setAttribute('class', 'hidden');
        document.getElementsByClassName('warp')[0].style.display = 'none';
    }
}

var warp = document.getElementsByClassName('warp')[0];
warp.onclick = function () {
    var win_menu = document.getElementById('win-menu');
    win_menu.setAttribute('class', 'hidden');
    this.style.display = 'none';
}

var filebt = document.getElementById('filebt');
filebt.onclick = function () {
    var fs = document.getElementById('file-system');
    if (fs.style.display == 'none') {
        fs.onclick();
        fs.style.display = 'block';
    } else {
        fs.style.display = 'none';
    }
}
var cmdbt = document.getElementById('cmdbt');
cmdbt.onclick = function() {
    var cmd = document.getElementById('terminal');
    if (cmd.style.display == 'none') {
        cmd.onclick();
        cmd.style.display = 'block';
        let inputs = cmd.getElementsByTagName('input');
        inputs[inputs.length - 1].focus();
    } else {
        cmd.style.display = 'none';
    }
}


//最小化
var minbts = document.getElementsByClassName('minbt');
for (let i = 0 ; i < minbts.length ; ++i) {
    minbts[i].onclick = function () {
        min(this.parentNode.parentNode.parentNode.parentNode)
    }
}
function min(obj) {
    // var obj = document.getElementById(id);
    if (obj.style.display == 'none') {
        obj.style.display = 'block';
    } else {
        obj.style.display = 'none';
    }
}
//最大化
var maxbts = document.getElementsByClassName('maxbt');
for (let i = 0 ; i < maxbts.length; ++i) {
    maxbts[i].onclick = function () {
        fullscreen(this.parentElement.parentElement.parentElement.parentElement);
    }
}
function fullscreen(obj) {
    if (getComputedStyle(obj)['width'] == '800px') {
        obj.style.top = "0";
        obj.style.left = "0";
        obj.style.width = "100%";
        obj.style.height = "calc(100% - 46px)";
    } else {
        obj.style.width = "800px";
        obj.style.height = "600px";
        obj.style.top = "30px";
        obj.style.left = "30px";
    }
}

//关闭
var closebts = document.getElementsByClassName('closebt');
for (let i = 0 ; i < closebts.length ; ++i) {
    closebts[i].onclick = function () {
        closewindow(this.parentNode.parentNode.parentNode.parentNode)
    }
}
function closewindow(id) {
    min(id);
}



//拖动div
var lastX,lastY,curX,curY,minusX,minusY;
var oa = document.getElementsByClassName("window-head");
for(var i = 0 ; i < oa.length;i++){
    (function () {
        var tmp = i;
        oa[i].onmousedown = function(e){
            e.preventDefault();
            lastX = e.clientX;
            lastY = e.clientY;
            window.onmousemove = function(event){
                var e1 = event || window.event;
                curX = e1.clientX;
                curY = e1.clientY;
    
                minusX = curX - lastX;
                minusY = curY - lastY;
    
                var ob = oa[tmp].parentNode;
    
                var left = parseInt(ob.style.left);
                var top = parseInt(ob.style.top);
    
                ob.style.left = left + minusX + 'px'; 
                ob.style.top = top + minusY + 'px';
    
                lastX = curX;
                lastY = curY;
            }
            this.onmouseup = function(ev){
                window.onmousemove = null;
                this.onmouseup = null;
            }
        }
    })()
    
}

//点击某个窗口时窗口自动置顶
let windows = document.getElementsByClassName('windows');
for (let index = 0 ; index < windows.length ; ++index) {
    windows[index].onclick = function() {
        let all = document.getElementsByClassName('windows');
        let max = 0;
        for (let j = 0 ; j < all.length ; ++j) {
            max = max > getComputedStyle(all[j])['zIndex'] ? max : getComputedStyle(all[j])['zIndex'];
        }
        this.style.zIndex = parseInt(max) + 1;
        if (this.getAttribute('id') == 'terminal') {
            let inputs = this.getElementsByTagName('input');
            inputs[inputs.length - 1].focus();
        }
    }
}

//终端回车处理
var terminal = document.getElementById('terminal');
terminal.onkeydown=keyDownQuery; 
function keyDownQuery(e) {  
    // 兼容FF和IE和Opera  
    var theEvent = e || window.event;  
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;  
    if (code == 13) {   
        // console.log('enter');
        let box = document.createElement('article');
        box.innerHTML = "there's nothing" +
        "<br><br>" +
        "<span class='pc-name'>Peter@pc</span>" +
        "<span class='path'>C:/Desktop</span><br>" +
        "$&nbsp;<input class='command focus'></input>" 

        let terminal = document.getElementById('terminal'); 
        let content = terminal.getElementsByClassName('content')[0];
        content.appendChild(box);

        let inputs = terminal.getElementsByTagName('input');
        inputs[inputs.length - 2].setAttribute('disabled', 'disabled');
        terminal.onclick();

        
        return false;  
    }  
    return true;  
}


//文件或文件夹双击，单击事件
let content = document.getElementById('file-system').getElementsByClassName('content')[0];
content.ondblclick = function (e) {
    if (e.target.parentElement.getAttribute('type') != 'dir')
        return;
    let title = e.target.parentElement.getAttribute('title');
    if (title == '' || title == null)
        return;
    let oldpath = getWinCurrentPath();
    let newpath = '';
    if (oldpath[oldpath.length - 1] == '/') {
        newpath = oldpath + title;
    } else {
        newpath = oldpath + '/' + title;
    }
    setWinCurrentPath(newpath);
    showDirView(title);
}
content.onclick = function (e) {
    // console.log(e.target.parentElement.tagName);
    // if (e.target.parentElement.tagName != 'ARTICLE')
    //     return;
    let arts = document.getElementById('file-system').getElementsByClassName('content')[0].getElementsByTagName('article');
    for (let i = 0 ; i < arts.length ; ++i) {
        arts[i].setAttribute('class', '');
    }
    if (e.target.parentElement.tagName == 'ARTICLE')
        e.target.parentElement.setAttribute('class', 'selected');
}


//返回上一层目录
let leftbt = document.getElementById('leftbt');
leftbt.onclick = function () {
    let currentpath = getWinCurrentPath();
    if (currentpath == '/')
        return;
    let index = currentpath.lastIndexOf('/');
    let pre = currentpath.substr(0, index);
    if (pre == '')
        pre = '/';
    setWinCurrentPath('/');
    showDirView('/');
    
}