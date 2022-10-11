var version='2.0';

// 日期、时间
function loadtime() {
    let d=new Date();
    $('#s-m-r>.row1>.tool>.date').text(`星期${[null,'一','二','三','四','五','六','日'][d.getDay()]}, ${
        d.getFullYear()}年${d.getMonth().toString().padStart(2,'0')}月${
        d.getDate().toString().padStart(2,'0')}日`);
    $('#s-m-r>.row1>.tool>.time').text(`${d.getHours().toString().padStart(2,'0')}:${
        d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`);
    $('.dock.date>.date').text(`${d.getFullYear()}/${d.getMonth().toString().padStart(2,'0')}/${
        d.getDate().toString().padStart(2,'0')}`);
    $('.dock.date>.time').text(`${d.getHours().toString().padStart(2,'0')}:${
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
let deltaLeft = 0, deltaTop = 0, fil=false;
for (let i = 0; i < wins.length; i++) {
    const win = wins[i];
    const titbar = titbars[i];
    function win_move(e) {
        if(e.clientY-deltaTop<0){
            win.setAttribute('style', `left:${e.clientX-deltaLeft}px;top:0px`);
            if(win.classList[1]!='calc'){
                $('#window-fill').addClass('top');
                setTimeout(() => {
                    $('#window-fill').addClass('fill');
                }, 0);
                fil=win;
            }
        }else if(fil){
            $('#window-fill').removeClass('fill');
            setTimeout(() => {
                $('#window-fill').removeClass('top');
            }, 200);
            fil=false;
        }else{
            win.setAttribute('style', `left:${e.clientX-deltaLeft}px;top:${e.clientY-deltaTop}px`);
        }
    }
    titbar.addEventListener('mousedown', (e) => {
        deltaLeft = e.clientX - win.offsetLeft;
        deltaTop = e.clientY - win.offsetTop;
        page.addEventListener('mousemove', win_move);
    })
    page.addEventListener('mouseup', () => {
        page.removeEventListener('mousemove', win_move);
        if(fil){
            maxwin(fil.classList[1]);
            fil=false;
            setTimeout(() => {
                $('#window-fill').removeClass('fill');
                $('#window-fill').removeClass('top');
            }, 200);
        }
    })
}
showwin('about');
var ca = document.cookie.split(';');
for(var i=0; i<ca.length; i++) 
{
    var c = ca[i].trim();
    var vi=c.substring('version='.length,c.length);
    if (vi!=version || c.indexOf('version=')!=0) {
        console.log('!=');
        $('.msg.update>.main>.tit').html('<strong>新版本</strong> '+$('#win-about>.cnt.update>div>details:first-child>summary').text());
        $('.msg.update>.main>.cont').html($('#win-about>.cnt.update>div>details:first-child>p').html());
        document.cookie="version="+version+";expires=Thu, 18 Dec 9999 12:00:00 GMT";
        $(()=>{
            setTimeout(() => {
                $('.msg.update').addClass('show');
            }, 2000);
        });
    }
}
console.log(document.cookie);