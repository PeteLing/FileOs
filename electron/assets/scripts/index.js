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
        fs.style.display = 'block';
    } else {
        fs.style.display = 'none';
    }
}
var cmdbt = document.getElementById('cmdbt');
cmdbt.onclick = function() {

}

//文件系统
var minbt = document.getElementById('file-system').getElementsByClassName('minbt')[0];
minbt.onclick = function () { min('file-system')}

var maxbt = document.getElementById('file-system').getElementsByClassName('maxbt')[0];
maxbt.onclick = function () { max('file-system') };

var closebt = document.getElementById('file-system').getElementsByClassName('closebt')[0];
closebt.onclick = function () { closewindow('file-system'); }


//最小化
function min(id) {
    var obj = document.getElementById(id);
    if (obj.style.display == 'none') {
        obj.style.display = 'block';
    } else {
        obj.style.display = 'none';
    }
}
//最大化
function fullscreen(id) {

}

//关闭
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

//终端回车处理
document.getElementById('terminal').onkeydown=keyDownQuery; 
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

        let content = document.getElementById('terminal').getElementsByClassName('content')[0];
        content.appendChild(box);

        let inputs = document.getElementById('terminal').getElementsByTagName('input');
        inputs[inputs.length - 2].setAttribute('disabled', 'disabled');
        inputs[inputs.length - 1].focus();

        
        return false;  
    }  
    return true;  
} 