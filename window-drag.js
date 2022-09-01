const main = document.getElementsByTagName('html')[0];
const icon = document.querySelector('.window.setting>.titbar');
const wd = document.querySelector('.window.setting');
let move = false;
let deltaLeft = 0, deltaTop = 0;
function setting_move(e) {
    wd.setAttribute('style', `left:${e.clientX - deltaLeft}px;top:${e.clientY - deltaTop}px`)
}

icon.addEventListener('mousedown', function (e) {
    deltaLeft = e.clientX - wd.offsetLeft;
    deltaTop = e.clientY - wd.offsetTop;
    main.addEventListener('mousemove', setting_move)
})
main.addEventListener('mouseup', function (e) {
    main.removeEventListener('mousemove', setting_move);
})