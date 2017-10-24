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

}
var cmdbt = document.getElementById('cmdbt');
cmdbt.onclick = function() {

}

window.onload = function () {

    function DragDiv(event, id) {
        var adiv = document.getElementById(id);
        var intX = event.screenX;
        var intY = event.clientY;
        console.log(event.screenX);
        adiv.ondrag = function (event) {
            // console.log(event.clientX,intX);
            adiv.sytle.left = (event.clientX - intX) + 'px';
            adiv.sytle.top = (event.clientY - intY) + 'px';
        }(adiv,intX, intY)
    }

    var fs = document.getElementById('file-system');
    fs.onmousedown = function (event) {
        var adiv = document.getElementById('file-system');
        var intX = event.clientX;
        var intY = event.clientY;
        adiv.ondrag = function (e) {
            // console.log(e);
            adiv.sytle.left = (e.clientX - intX) + 'px';
            adiv.sytle.top = (e.clientY - intY) + 'px';
        }
    }
    // fs.ondrag = DragDiv('file-system');
    // fs.onmouseup = mouseUp();
  };