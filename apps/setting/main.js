const main = document.getElementsByTagName('body')[0];
const icon = document.querySelector('.window.setting>.titbar');
const wd = document.querySelector('.window.setting');
let move = false;
let deltaLeft = 0, deltaTop = 0;

icon.addEventListener('mousedown', function (e) {
    deltaLeft = e.clientX - wd.offsetLeft;
    deltaTop = e.clientY - wd.offsetTop;
    move = true;
})

main.addEventListener('mousemove', function (e) {
    if (move) {
        const cx = e.clientX;
        const cy = e.clientY;
        let dx = cx - deltaLeft
        let dy = cy - deltaTop
        if (dx < 0) dx = 0
        if (dy < 0) dy = 0
        if (dx > 500) dx = 500
        if (dy > 300) dy = 300
        wd.setAttribute('style', `left:${dx}px;top:${dy}px`)
    }
})
main.addEventListener('mouseup', function (e) {
    move = false;
    console.log('mouseup');
})