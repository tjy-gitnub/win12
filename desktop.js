function showwin(name) {
    if ($('#taskbar>.' + name).length != 0) return;
    $('.window.' + name).addClass('show-begin');
    $('#taskbar').attr('count', Number($('#taskbar').attr('count')) + 1)
    $('#taskbar').html(`${$('#taskbar').html()}<a class="${name}" onclick="minwin(\'${name}\')"><img src="icon/${name}.png"></a>`);
    if ($('#taskbar').attr('count') == '1') $('#taskbar').show();
    setTimeout(() => { $('.window.' + name).addClass('show'); }, 0);
    setTimeout(() => { $('.window.' + name).addClass('notrans'); }, 200);
    $('.window.' + name).attr('style', `top: 10%;left: 15%;`);
}
function hidewin(name) {
    $('.window.' + name).removeClass('notrans');
    $('.window.' + name).removeClass('max');
    $('.window.' + name).removeClass('show');
    $('#taskbar').attr('count', Number($('#taskbar').attr('count')) - 1)
    $('#taskbar>.' + name).remove();
    if ($('#taskbar').attr('count') == '0') $('#taskbar').hide();
    setTimeout(() => { $('.window.' + name).removeClass('show-begin'); }, 200);
}
function maxwin(name) {
    if ($('.window.' + name).hasClass('max')) {
        $('.window.' + name).removeClass('max');
        $('.window.' + name + '>.titbar>div>.wbtg.max').html('<i class="bi bi-app"></i>');
        setTimeout(() => { $('.window.' + name).addClass('notrans'); }, 200);
        $('.window.' + name).attr('style', `top: 10%;left: 15%;`);
    } else {
        $('.window.' + name).removeClass('notrans');
        $('.window.' + name).addClass('max');
        $('.window.' + name + '>.titbar>div>.wbtg.max').html('<svg version="1.1" width="12" height="12" viewBox="0,0,37.65105,35.84556" style="margin-top:4px;"><g transform="translate(-221.17804,-161.33903)"><g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill="none" fill-rule="nonzero" stroke="#000000" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><path d="M224.68734,195.6846c-2.07955,-2.10903 -2.00902,-6.3576 -2.00902,-6.3576l0,-13.72831c0,0 -0.23986,-1.64534 2.00902,-4.69202c1.97975,-2.68208 4.91067,-2.00902 4.91067,-2.00902h14.06315c0,0 3.77086,-0.23314 5.80411,1.67418c2.03325,1.90732 1.33935,5.02685 1.33935,5.02685v13.39347c0,0 0.74377,4.01543 -1.33935,6.3576c-2.08312,2.34217 -5.80411,1.67418 -5.80411,1.67418h-13.39347c0,0 -3.50079,0.76968 -5.58035,-1.33935z"/><path d="M229.7952,162.85325h16.06111c0,0 5.96092,-0.36854 9.17505,2.64653c3.21412,3.01506 2.11723,7.94638 2.11723,7.94638v18.55642"/></g></g></svg>')
    }
}
function minwin(name) {
    if ($('.window.' + name).hasClass('min')) {
        $('.window.' + name).addClass('show-begin');
        setTimeout(() => {
            $('#taskbar>.' + name).removeClass('min');
            $('.window.' + name).removeClass('min');
            $('.window.' + name).addClass('show');
            if ($('.window.' + name).hasClass('min-max')) $('.window.' + name).addClass('max');
            $('.window.' + name).removeClass('min-max');
        }, 0);
        setTimeout(() => {
            if (!$('.window.' + name).hasClass('max')) $('.window.' + name).addClass('notrans');
        }, 200);
    } else {
        if ($('.window.' + name).hasClass('max')) $('.window.' + name).addClass('min-max');
        $('.window.' + name).removeClass('max');
        $('#taskbar>.' + name).addClass('min');
        $('.window.' + name).addClass('min');
        $('.window.' + name).removeClass('notrans');
        $('.window.' + name).removeClass('show');
        setTimeout(() => { $('.window.' + name).removeClass('show-begin'); }, 200);
    }
}
function hide_startmenu(params) {
    $('#start-menu').removeClass('show');
    $('#start-btn').removeClass('show');
    setTimeout(() => { $('#start-menu').removeClass('show-begin'); }, 200);
}
const page = document.getElementsByTagName('html')[0];
const titbars = document.querySelectorAll('.window>.titbar');
const wins = document.querySelectorAll('.window');
let deltaLeft = 0, deltaTop = 0;
for (let i = 0; i < wins.length; i++) {
    const win = wins[i];
    const titbar = titbars[i];
    function win_move(e) {
        win.setAttribute('style', `left:${e.clientX - deltaLeft}px;top:${e.clientY - deltaTop}px`)
    }
    titbar.addEventListener('mousedown', (e) => {
        deltaLeft = e.clientX - win.offsetLeft;
        deltaTop = e.clientY - win.offsetTop;
        page.addEventListener('mousemove', win_move);
    })
    page.addEventListener('mouseup', () => {
        page.removeEventListener('mousemove', win_move);
    })
}
showwin('about');