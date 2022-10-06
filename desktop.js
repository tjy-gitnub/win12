// 列表 悬停、点击 效果
let lista=document.querySelectorAll('#s-m-l>list>a,.sm-app.enable,#win-about>.menu>list>a,.tj-obj');
lista.forEach(la => {
    la.addEventListener('mousemove',(e)=>{
        la.style.background=`radial-gradient(circle at ${e.clientX - $(la).offset()['left']}px ${e.clientY - $(la).offset()['top']}px,#ffffff70,#00000000)`;
    });
    la.addEventListener('mouseleave',(e)=>{
        la.style.background='';
    });
    la.addEventListener('mousedown',(e)=>{
        lt=e.clientX - $(la).offset()['left']
        rt=e.clientY - $(la).offset()['top']
        la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffff10 0%,#ffffff70 50%,#00000000)`;
        setTimeout(() => {
            la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffff15 25%,#ffffff70 25%,#00000000)`;
        }, 50);
        setTimeout(() => {
            la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffff25 40%,#ffffff70 10%,#00000000)`;
        }, 100);
        setTimeout(() => {
            la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffff40 45%,#ffffff50 5%,#00000000)`;
        }, 150);
        setTimeout(() => {
            la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffff60 48%,#ffffff30 2%,#00000000)`;
        }, 200);
        setTimeout(() => {
            la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffff70 50%,#00000000)`;
        }, 250);
    });
});
lista=document.querySelectorAll('.setting-list>a,#win-explorer>.main>.content>.group>.item,#win-calc>.keyb>.b:not(.ans)');
lista.forEach(la => {
    la.addEventListener('mousemove',(e)=>{
        la.style.background=`radial-gradient(circle at ${e.clientX - $(la).offset()['left']}px ${e.clientY - $(la).offset()['top']}px,#ffffffa5,var(--card))`;
    });
    la.addEventListener('mouseleave',(e)=>{
        la.style.background='';
    });
    la.addEventListener('click',(e)=>{
        lt=e.clientX - $(la).offset()['left']
        rt=e.clientY - $(la).offset()['top']
        setTimeout(() => {
            la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffff20 2%,#ffffffa5 10%,var(--card))`;
        }, 0);
        setTimeout(() => {
            la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffff55 10%,#ffffffa3 15%,var(--card))`;
        }, 70);
        setTimeout(() => {
            la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffff70 30%,#ffffffa0 5%,var(--card))`;
        }, 130);
        setTimeout(() => {
            la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffff95 50%,#ffffff80 3%,var(--card))`;
        }, 180);
        setTimeout(() => {
            la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffff9e 80%,#ffffff70 2%,var(--card))`;
        }, 210);
        setTimeout(() => {
            la.style.background=`radial-gradient(circle at ${lt}px ${rt}px,#ffffffa5 20%,var(--card))`;
        }, 220);
    });
});
// 日期、时间
function loadtime() {
    let d=new Date();
    $('#s-m-r>.row1>.tool>.date').text(`星期${[null,'一','二','三','四','五','六','日'][d.getDay()]}, ${
        d.getFullYear()}年${d.getMonth().toString().padStart(2,'0')}月${
        d.getDate().toString().padStart(2,'0')}日`);
    $('#s-m-r>.row1>.tool>.time').text(`${d.getHours().toString().padStart(2,'0')}:${
        d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`);
}
setInterval(loadtime,1000);
// 窗口操作
function showwin(name) {
    if ($('#taskbar>.' + name).length != 0) return;
    $('.window.' + name).addClass('show-begin');
    $('#taskbar').attr('count', Number($('#taskbar').attr('count')) + 1)
    $('#taskbar').html(`${$('#taskbar').html()}<a class="${name}" onclick="minwin(\'${name}\')"><img src="icon/${name}.png"></a>`);
    if ($('#taskbar').attr('count') == '1') $('#taskbar').show();
    setTimeout(() => { $('.window.' + name).addClass('show'); }, 0);
    setTimeout(() => { $('.window.' + name).addClass('notrans'); }, 400);
    $('.window.' + name).attr('style', `top: 10%;left: 15%;`);
}
function hidewin(name) {
    $('.window.' + name).removeClass('notrans');
    $('.window.' + name).removeClass('max');
    $('.window.' + name).removeClass('show');
    $('#taskbar').attr('count', Number($('#taskbar').attr('count')) - 1)
    $('#taskbar>.' + name).remove();
    if ($('#taskbar').attr('count') == '0') $('#taskbar').hide();
    setTimeout(() => { $('.window.' + name).removeClass('show-begin'); }, 400);
    $('.window.' + name + '>.titbar>div>.wbtg.max').html('<i class="bi bi-app"></i>');
}
function maxwin(name) {
    if ($('.window.' + name).hasClass('max')) {
        $('.window.' + name).removeClass('max');
        $('.window.' + name + '>.titbar>div>.wbtg.max').html('<i class="bi bi-app"></i>');
        setTimeout(() => { $('.window.' + name).addClass('notrans'); }, 400);
        $('.window.' + name).attr('style', `top: 10%;left: 15%;`);
    } else {
        $('.window.' + name).removeClass('notrans');
        $('.window.' + name).addClass('max');
        $('.window.' + name + '>.titbar>div>.wbtg.max').html('<svg version="1.1" width="12" height="12" viewBox="0,0,37.65105,35.84556" style="margin-top:4px;"><g transform="translate(-221.17804,-161.33903)"><g style="stroke:var(--text);" data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill="none" fill-rule="nonzero" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><path d="M224.68734,195.6846c-2.07955,-2.10903 -2.00902,-6.3576 -2.00902,-6.3576l0,-13.72831c0,0 -0.23986,-1.64534 2.00902,-4.69202c1.97975,-2.68208 4.91067,-2.00902 4.91067,-2.00902h14.06315c0,0 3.77086,-0.23314 5.80411,1.67418c2.03325,1.90732 1.33935,5.02685 1.33935,5.02685v13.39347c0,0 0.74377,4.01543 -1.33935,6.3576c-2.08312,2.34217 -5.80411,1.67418 -5.80411,1.67418h-13.39347c0,0 -3.50079,0.76968 -5.58035,-1.33935z"/><path d="M229.7952,162.85325h16.06111c0,0 5.96092,-0.36854 9.17505,2.64653c3.21412,3.01506 2.11723,7.94638 2.11723,7.94638v18.55642"/></g></g></svg>')
    }
}
function minwin(name) {
    if ($('.window.' + name).hasClass('min')) {
        $('.window.' + name).addClass('show-begin');
        setTimeout(() => {
            $('#taskbar>.' + name).removeClass('min');
            $('.window.' + name).removeClass('min');
            if ($('.window.' + name).hasClass('min-max')) $('.window.' + name).addClass('max');
            $('.window.' + name).removeClass('min-max');
        }, 0);
        setTimeout(() => {
            if (!$('.window.' + name).hasClass('max')) $('.window.' + name).addClass('notrans');
        }, 400);
    } else {
        if ($('.window.' + name).hasClass('max')) $('.window.' + name).addClass('min-max');
        $('.window.' + name).removeClass('max');
        $('#taskbar>.' + name).addClass('min');
        $('.window.' + name).addClass('min');
        $('.window.' + name).removeClass('notrans');
        setTimeout(() => { $('.window.' + name).removeClass('show-begin'); }, 400);
    }
}
// 开始菜单
function hide_startmenu(params) {
    $('#start-menu').removeClass('show');
    $('#start-btn').removeClass('show');
    setTimeout(() => { $('#start-menu').removeClass('show-begin'); }, 200);
}
// 拖拽窗口
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
setTimeout(() => {
    $('.msg').addClass('show');
}, 2000);