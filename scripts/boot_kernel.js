function setProgress(n) {
    $('#load').css('width', (400 / 20 * n) + 'px');
    $('#back').css('width', (400 / 20 * (20 - n)) + 'px');
}
setProgress(0);
var i = 0;
var progress = [0, 0, 1, 3, 7, 17, 20];
var timer;
timer = setInterval(function () {
    setProgress(progress[i]);
    i++;
    if (i >= progress.length) {
        if (timer != undefined) {
            clearInterval(timer);
        }
        window.location.href = './desktop.html';
    }
}, 300);
function toBIOS() {
    if (timer != undefined) {
        clearInterval(timer);
    }
    setTimeout(() => {
        $('body').html('');
        $('body').css('cssText', 'background-color: black;');
    }, 500);
    setTimeout(() => {
        window.location.href = './bios.html';
    }, 1000);
}
window.onkeydown = (event) => {
    if (event.keyCode == 113) {
        toBIOS();
    }
};
window.ontouchstart = toBIOS;
document.oncontextmenu = function () {
    return false;
};
