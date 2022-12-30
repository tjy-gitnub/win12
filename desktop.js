let updated = false, aftload = false;
// 列表点击 + 边框发光
let lists = document.querySelectorAll(`#s-m-l>list>a,#win-setting>.menu>list>a`);
lists.forEach(la => {
    la.addEventListener('mousemove', (e) => {
        x = e.clientX - $(la).offset()['left'];
        y = e.clientY - $(la).offset()['top'];
        $(la).css('cssText', `background:radial-gradient(circle at ${x}px ${y}px,var(--hover) 20px, #00000000) center;background-size:110% 100%;border-image:radial-gradient(circle at ${x}px ${y}px,var(--hover) 20px, #00000000 40px) 2;`)
    });
    la.addEventListener('mouseout', () => {
        $(la).css('cssText', `background-image:radial-gradient(#00000000,#00000000),radial-gradient(#00000000,#00000000);`)
    });
});
// 禁止拖拽图片
$('img').on('dragstart', () => { return false; });
// 右键菜单
$('html').on('contextmenu', () => {
    return false;
});
function stop(e) {
    e.stopPropagation();
}
$('input,textarea').on('contextmenu', (e) => {
    stop(e);
    return true;
});
let cms = {
    'titbar': [
        function (arg) {
            if (arg == 'calc')
                return 'null'
            if ($('.window.' + arg).hasClass("max"))
                return ['<i class="bi bi-window-stack"></i> 还原', `maxwin('${arg}')`];
            else
                return ['<i class="bi bi-window-fullscreen"></i> 最大化', `maxwin('${arg}')`];
        },
        function (arg) {
            return ['<i class="bi bi-window-dash"></i> 最小化', `minwin('${arg}')`];
        },
        function (arg) {
            return ['<i class="bi bi-window-x"></i> 关闭', `hidewin('${arg}')`];
        },
    ],
    'desktop': [
        ['<i class="bi bi-arrow-clockwise"></i> 刷新', `$('#desktop').css('opacity','0');setTimeout(()=>{$('#desktop').css('opacity','1');},100);`],
        ['<i class="bi bi-circle-square"></i> 切换主题', 'toggletheme()'],
        `<a onclick="window.open('https://github.com/tjy-gitnub/win12','_blank');" title="https://github.com/tjy-gitnub/win12"><i class="bi bi-github"></i> 在 Github 中查看此项目</a>`,
        `<a onclick="window.open('https://github.com/tjy-gitnub/win12/issues','_blank');" title="https://github.com/tjy-gitnub/win12/issues"><i class="bi bi-chat-left-text"></i> 发送反馈</a>`,
        ['<i class="bi bi-info-circle"></i> 关于 Win12 网页版', `$('#win-about>.about').show(200);$('#win-about>.update').hide();openapp('about');if($('.window.about').hasClass('min'))minwin('about');`],
    ],
    'winx': [
        function (arg) {
            if ($('#start-menu').hasClass("show"))
                return ['<i class="bi bi-box-arrow-in-down"></i> 关闭开始菜单', `hide_startmenu()`];
            else
                return ['<i class="bi bi-box-arrow-in-up"></i> 打开开始菜单', `$('#start-btn').addClass('show');
                if($('#search-win').hasClass('show')){$('#search-btn').removeClass('show');
                $('#search-win').removeClass('show');setTimeout(() => {$('#search-win').removeClass('show-begin');
                }, 200);}$('#start-menu').addClass('show-begin');setTimeout(() => {$('#start-menu').addClass('show');
                }, 0);`];
        },
        '<hr>',
        ['<i class="bi bi-gear"></i> 设置', `openapp('setting')`],
        ['<i class="bi bi-folder2-open"></i> 文件资源管理器', `openapp('explorer')`],
        ['<i class="bi bi-search"></i> 搜索', `$('#search-btn').addClass('show');hide_startmenu();
        $('#search-win').addClass('show-begin');setTimeout(() => {$('#search-win').addClass('show');
        $('#search-input').focus();}, 0);`],
        '<hr>',
        ['<i class="bi bi-power"></i> 关机', `window.location='shutdown.html'`],
        ['<i class="bi bi-arrow-counterclockwise"></i> 重启', `window.location='reload.html'`],
    ],
    'smapp': [
        function (arg) {
            return ['<i class="bi bi-window"></i> 打开', `openapp('${arg[0]}');hide_startmenu();`];
        },
        function (arg) {
            return ['<i class="bi bi-link-45deg"></i> 在桌面创建链接', "$('#desktop').append(`<div class='b' ondblclick=openapp('" + arg[0] + "')  ontouchstart=openapp('" + arg[0] + "')><img src='icon/" + arg[0] + ".png'><p>" + arg[1] + "</p></div>`)"];
        }
    ],
    'dockabout': [
        function (arg) {
            if (arg)
                return ['<i class="bi bi-arrow-bar-down"></i> 收起', `$('.dock.about').removeClass('show')`];
            else
                return ['<i class="bi bi-arrow-bar-up"></i> 展开', `$('.dock.about').addClass('show')`];
        },
        ['<i class="bi bi-info-circle"></i> 更多信息', `$('#win-about>.about').show(200);$('#win-about>.update').hide();
        openapp('about');if($('.window.about').hasClass('min'))minwin('about');`]
    ],
    'msgupdate': [
        ['<i class="bi bi-layout-text-window-reverse"></i> 查看详细', `openapp('about');if($('.window.about').hasClass('min'))
        minwin('about');$('#win-about>.update').show(200);$('#win-about>.about').hide();
        $('#win-about>.update>div>details:first-child').attr('open','open')`],
        ['<i class="bi bi-box-arrow-right"></i> 关闭', `$('.msg.update').removeClass('show')`]
    ],
    'explorer.content': [
        ['<i class="bi bi-arrow-clockwise"></i> 刷新', `$('#win-explorer>.main>.content>.view').css('opacity','0');setTimeout(()=>{$('#win-explorer>.main>.content>.view').css('opacity','1');},100);`],
    ],
    'explorer.folder': [
        (arg) => {
            return ['<i class="bi bi-folder2-open"></i> 打开', `apps.explorer.goto('${arg}')`];
        }
    ]
}
function showcm(e, cl, arg) {
    if ($('#cm').hasClass('show-begin')) {
        setTimeout(() => {
            $('#cm').css('left', e.clientX);
            $('#cm').css('top', e.clientY);
            let h = '';
            cms[cl].forEach(item => {
                if (typeof (item) == 'function') {
                    ret = item(arg);
                    if (ret == 'null') return true;
                    h += `<a class="a" onmousedown="${ret[1]}">${ret[0]}</a>\n`;
                } else if (typeof (item) == 'string') {
                    h += item + '\n';
                } else {
                    h += `<a class="a" onmousedown="${item[1]}">${item[0]}</a>\n`;
                }
            })
            $('#cm>list')[0].innerHTML = h;
            $('#cm').addClass('show-begin');
            $('#cm>.foc').focus();
            setTimeout(() => {
                $('#cm').addClass('show');
            }, 0);
            setTimeout(() => {
                if (e.clientY + $('#cm')[0].offsetHeight > $('html')[0].offsetHeight) {
                    $('#cm').css('top', e.clientY - $('#cm')[0].offsetHeight);
                }
                if (e.clientX + $('#cm')[0].offsetWidth > $('html')[0].offsetWidth) {
                    $('#cm').css('left', $('html')[0].offsetWidth - $('#cm')[0].offsetWidth - 5);
                }
            }, 200);
        }, 200);
        return;
    }
    $('#cm').css('left', e.clientX);
    $('#cm').css('top', e.clientY);
    let h = '';
    cms[cl].forEach(item => {
        if (typeof (item) == 'function') {
            ret = item(arg);
            if (ret == 'null') return true;
            h += `<a class="a" onmousedown="${ret[1]}">${ret[0]}</a>\n`;
        } else if (typeof (item) == 'string') {
            h += item + '\n';
        } else {
            h += `<a class="a" onmousedown="${item[1]}">${item[0]}</a>\n`;
        }
    })
    $('#cm>list')[0].innerHTML = h;
    $('#cm').addClass('show-begin');
    $('#cm>.foc').focus();
    setTimeout(() => {
        $('#cm').addClass('show');
    }, 0);
    setTimeout(() => {
        if (e.clientY + $('#cm')[0].offsetHeight > $('html')[0].offsetHeight) {
            $('#cm').css('top', e.clientY - $('#cm')[0].offsetHeight);
        }
        if (e.clientX + $('#cm')[0].offsetWidth > $('html')[0].offsetWidth) {
            $('#cm').css('left', $('html')[0].offsetWidth - $('#cm')[0].offsetWidth - 5);
        }
    }, 200);
    return false;
}
$('#cm>.foc').blur(() => {
    let x = event.target.parentNode;
    $(x).removeClass('show');
    setTimeout(() => {
        $(x).removeClass('show-begin');
    }, 200);
});
// 下拉菜单
dps = {
    'notepad.file': [
        ['<i class="bi bi-file-earmark-plus"></i> 新建', `hidedp();$('#win-notepad>.text-box').addClass('down');
        setTimeout(()=>{$('#win-notepad>.text-box').val('');$('#win-notepad>.text-box').removeClass('down')},200);`],
        ['<i class="bi bi-box-arrow-right"></i> 另存为', `hidedp();$('#win-notepad>.save').attr('href','data:text/txt;,'+encodeURIComponent($('#win-notepad>.text-box').val()));
        $('#win-notepad>.save')[0].click();`],
        '<hr>',
        ['<i class="bi bi-x"></i> 退出', `hidedp();hidewin('notepad')`],
    ],
    'notepad.edit': [
        ['<i class="bi bi-files"></i> 复制 <info>Ctrl+C</info>', ''],
        ['<i class="bi bi-clipboard"></i> 粘贴 <info>Ctrl+V</info>', ''],
        ['<i class="bi bi-scissors"></i> 剪切 <info>Ctrl+X</info>', ''],
        '<hr>',
        ['<i class="bi bi-arrow-return-left"></i> 撤销 <info>Ctrl+Z</info>', ''],
        ['<i class="bi bi-arrow-clockwise"></i> 重做 <info>Ctrl+Y</info>', ''],
    ]
}
let dpt = null,isOnDp=false;
$('#dp')[0].onmouseover = ()=>{ isOnDp = true };
$('#dp')[0].onmouseleave = ()=>{ isOnDp = false;hidedp() };
function showdp(e, cl, arg) {
    if ($('#dp').hasClass('show-begin')) {
        $('#dp').removeClass('show');
        setTimeout(() => {
            $('#dp').removeClass('show-begin');
        }, 200);
        if (e != dpt) {
            setTimeout(() => {
                showdp(e, cl, arg);
            }, 400);
        }
        return;
    }
    // dpt = e;
    let off = $(e).offset();
    $('#dp').css('left', off.left);
    $('#dp').css('top', off.top + e.offsetHeight);
    let h = '';
    dps[cl].forEach(item => {
        if (typeof (item) == 'function') {
            ret = item(arg);
            if (ret == 'null') return true;
            h += `<a class="a" onmousedown="${ret[1]}">${ret[0]}</a>\n`;
        } else if (typeof (item) == 'string') {
            h += item + '\n';
        } else {
            h += `<a class="a" onmousedown="${item[1]}">${item[0]}</a>\n`;
        }
    })
    $('#dp>list')[0].innerHTML = h;
    $('#dp').addClass('show-begin');
    setTimeout(() => {
        $('#dp').addClass('show');
    }, 0);
    setTimeout(() => {
        if (off.top + e.offsetHeight + $('#dp')[0].offsetHeight > $('html')[0].offsetHeight) {
            $('#dp').css('top', off.top - $('#dp')[0].offsetHeight);
        }
        if (off.left + $('#dp')[0].offsetWidth > $('html')[0].offsetWidth) {
            $('#dp').css('left', $('html')[0].offsetWidth - $('#dp')[0].offsetWidth - 5);
        }
    }, 200);
}
function hidedp() {
    setTimeout(() => {
        if(isOnDp)return;
        $('#dp').removeClass('show');
        setTimeout(() => {
            $('#dp').removeClass('show-begin');
        }, 200);
    }, 100);
}
// 应用
let apps = {
    setting: {
        init: () => { }
    },
    explorer: {
        init: () => {
            apps.explorer.reset();
        },
        reset: () => {
            $('#win-explorer>.main>.content>.view')[0].innerHTML = `<style>#win-explorer>.main>.content>.view>.class{margin-left: 20px;display: flex;}
            #win-explorer>.main>.content>.view>.class>img{width: 20px;height: 20px;margin-top: 3px;margin-right: 5px;filter:brightness(0.9);}
            #win-explorer>.main>.content>.view>.group{display: flex;flex-wrap: wrap;padding: 10px 20px;}
            #win-explorer>.main>.content>.view>.group>.item{width: 280px;margin: 5px;height:  80px;
                background: radial-gradient(circle, var(--card),var(--card));border-radius: 10px;display: flex;}
            #win-explorer>.main>.content>.view>.group>.item:hover{background-color: var(--hover);}
            #win-explorer>.main>.content>.view>.group>.item>img{width: 55px;height: 55px;margin-top: 18px;margin-left: 10px;}
            #win-explorer>.main>.content>.view>.group>.item>div{flex-grow: 1;padding: 5px 5px 0 0;}
            #win-explorer>.main>.content>.view>.group>.item>div>.bar{width: calc(100% - 10px);height: 8px;border-radius: 10px;
                background-color: var(--hover-b);margin: 5px 5px;}
            #win-explorer>.main>.content>.view>.group>.item>div>.bar>.content{height: 100%;background-image: linear-gradient(90deg, #ad6eca, #4998d9);
                border-radius: 10px;}
            #win-explorer>.main>.content>.view>.group>.item>div>.info{color: #959595;font-size: 14px;}</style>
            <p class="class"><img src="apps/icons/explorer/disk.png"> 设备和驱动器</p><div class="group">
            <a class="a item act" ondblclick="apps.explorer.goto('C:')" ontouchend="apps.explorer.goto('C:')" oncontextmenu="stop(event);return showcm(event,'explorer.folder','C:')">
            <img src="apps/icons/explorer/diskwin.png"><div><p class="name">本地磁盘 (C:)</p>
            <div class="bar"><div class="content" style="width: 88%;"></div>
            </div><p class="info">32.6 GB 可用, 共 143 GB</p></div></a><a class="a item act" ondblclick="apps.explorer.goto('D:')" ontouchend="apps.explorer.goto('D:')"
            oncontextmenu="stop(event);return showcm(event,'explorer.folder','D:')">
            <img src="apps/icons/explorer/disk.png"><div><p class="name">本地磁盘 (D:)</p><div class="bar"><div class="content" style="width: 15%;"></div>
            </div><p class="info">185.3 GB 可用, 共 216 GB</p></div></a></div>`;
            $('#win-explorer>.main>.content>.tool>.tit')[0].innerHTML = '此电脑';
        },
        goto: (path) => {
            $('#win-explorer>.main>.content>.view')[0].innerHTML = '';
            pathl = path.split('/');
            let tmp = apps.explorer.path;
            pathl.forEach(name => {
                tmp = tmp[name];
            });
            if (tmp == null) {
                $('#win-explorer>.main>.content>.view')[0].innerHTML = '<p class="info">此文件夹为空。</p>';
            } else {
                let ht = '';
                for (folder in tmp) {
                    ht += `<a class="a item" ondblclick="apps.explorer.goto('${path}/${folder}')" ontouchend="apps.explorer.goto('${path}/${folder}')" oncontextmenu="stop(event);return showcm(event,'explorer.folder','${path}/${folder}')">
                        <img src="apps/icons/explorer/folder.png">${folder}</a>`;
                }
                $('#win-explorer>.main>.content>.view')[0].innerHTML = ht;
            }
            if (pathl.length == 1) {
                $('#win-explorer>.main>.content>.tool>.goback').attr('onclick', 'apps.explorer.reset()');
            } else {
                $('#win-explorer>.main>.content>.tool>.goback').attr('onclick', `apps.explorer.goto('${path.substring(0, path.length - pathl[pathl.length - 1].length - 1)}')`);
            }
            $('#win-explorer>.main>.content>.tool>.tit')[0].innerHTML = path;
        },
        path: {
            'C:': {
                'Program Files': {
                    'WindowsApps': null, 'Microsoft': null,
                },
                'Windows': {
                    'Boot': null, 'System': null, 'System32': null
                },
                '用户': {
                    'Administrator': {
                        '文档': { 'IISExpress': null, 'PowerToys': null }, '图片': { '本机照片': null, '屏幕截图': null },
                        'AppData': null, '音乐': { '录音机': null }
                    }
                }
            },
            'D:': {
                'Microsoft': null,
            }
        }
    },
    calc: {
        init: () => {
            $('#calc-input').val('');
        },
        add: (arg) => {
            $('#calc-input')[0].value += arg;
        }
    },
    about: {
        init: () => {
            $('#win-about>.about').show();
            $('#win-about>.update').hide();
        }
    },
    notepad: {
        init: () => {
            $('#win-notepad>.text-box').addClass('down');
            setTimeout(() => {
                $('#win-notepad>.text-box').val('');
                $('#win-notepad>.text-box').removeClass('down')
            }, 200);
        }
    }
}


// 小组件
let widgets={
    widgets: {
        add: (arg)=>{
            if($('#widgets>.widgets>.content>.grid>.wg.'+arg).length!=0)return;
            $('#widgets>.widgets>.content>.grid')[0].innerHTML+=$('#widgets>.widgets>.content>.template>.'+arg).html();
        },
        remove: (arg)=>{
            $('#widgets>.widgets>.content>.grid>.wg.'+arg).remove();
        }
    },
    calc:{
        add: (arg) => {
            $('*:not(.template)>*>.wg.calc>.content>input')[0].value += arg;
        }
    }
}


// 日期、时间
let da = new Date();
let date = `星期${['日', '一', '二', '三', '四', '五', '六'][da.getDay()]}, ${da.getFullYear()}年${(da.getMonth() + 1).toString().padStart(2, '0')}月${da.getDate().toString().padStart(2, '0')}日`
$('#s-m-r>.row1>.tool>.date').text(date);
$('.dock.date>.date').text(`${da.getFullYear()}/${(da.getMonth() + 1).toString().padStart(2, '0')}/${da.getDate().toString().padStart(2, '0')}`);
$('#datebox>.tit>.date').text(date);
function loadtime() {
    let d = new Date();
    let time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
    $('#s-m-r>.row1>.tool>.time').text(time);
    $('.dock.date>.time').text(time);
    $('#datebox>.tit>.time').text(time);
}
setInterval(loadtime, 1000);
let d = new Date();
let today = new Date().getDate();
let start = 7 - ((d.getDate() - d.getDay()) % 7) + 1;
let daysum = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
for (let i = 1; i < start; i++) {
    $('#datebox>.cont>.body')[0].innerHTML += '<span></span>';
}
for (let i = 1; i <= daysum; i++) {
    if (i == today) {
        $('#datebox>.cont>.body')[0].innerHTML += `<p class="today">${i}</p>`;
        continue;
    }
    $('#datebox>.cont>.body')[0].innerHTML += `<p>${i}</p>`;
}
function openapp(name) {
    if ($('#taskbar>.' + name).length != 0) return;
    wo.push(name);
    $('.window.' + name).addClass('load');
    showwin(name);
    $('#taskbar').attr('count', Number($('#taskbar').attr('count')) + 1)
    $('#taskbar').html(`${$('#taskbar').html()}<a class="${name}" onclick="minwin(\'${name}\')"><img src="icon/${name}.png"></a>`);
    if ($('#taskbar').attr('count') == '1') $('#taskbar').css('display', 'flex');
    setTimeout(() => {
        $('#taskbar').css('width', 10 + $('#taskbar').attr('count') * 34);
    }, 0);
    apps[name].init();
    setTimeout(() => {
        $('.window.' + name).removeClass('load');
    }, 1000);

}
// 窗口操作
function showwin(name) {
    $('.window.' + name).addClass('show-begin');
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
    $('#taskbar').css('width', 10 + $('#taskbar').attr('count') * 34);
    setTimeout(() => {

        if ($('#taskbar').attr('count') == '0') $('#taskbar').css('display', 'none');
    }, 80);
    setTimeout(() => { $('.window.' + name).removeClass('show-begin'); }, 200);
    $('.window.' + name + '>.titbar>div>.wbtg.max').html('<i class="bi bi-app"></i>');
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
        }, 200);
    } else {
        if ($('.window.' + name).hasClass('max')) $('.window.' + name).addClass('min-max');
        $('.window.' + name).removeClass('max');
        $('#taskbar>.' + name).addClass('min');
        $('.window.' + name).addClass('min');
        $('.window.' + name).removeClass('notrans');
        setTimeout(() => { $('.window.' + name).removeClass('show-begin'); }, 200);
    }
}
let wo=[];
function orderwindow() {
    
}
// 菜单隐藏
function hide_startmenu() {
    $('#start-menu').removeClass('show');
    $('#start-btn').removeClass('show');
    setTimeout(() => { $('#start-menu').removeClass('show-begin'); }, 200);
}
function hide_widgets() {
    $('#widgets').removeClass('show');
    $('#widgets-btn').removeClass('show');
    setTimeout(() => { $('#widgets').removeClass('show-begin'); }, 200);
}
// 主题
function toggletheme() {
    $('.dock.theme').toggleClass('dk');
    $(':root').toggleClass('dark');
}
// 拖拽窗口
const page = document.getElementsByTagName('html')[0];
const titbars = document.querySelectorAll('.window>.titbar');
const wins = document.querySelectorAll('.window');
let deltaLeft = 0, deltaTop = 0, fil = false;
for (let i = 0; i < wins.length; i++) {
    const win = wins[i];
    const titbar = titbars[i];
    function win_move(e) {
        let cx,cy;
        if(e.type=='touchmove'){
            cx=e.targetTouches[0].clientX,cy=e.targetTouches[0].clientY;
        }else{
            cx=e.clientX,cy=e.clientY;
        }
        
        if (cy - deltaTop < 0) {
            win.setAttribute('style', `left:${cx - deltaLeft}px;top:0px`);
            if (win.classList[1] != 'calc') {
                $('#window-fill').addClass('top');
                setTimeout(() => {
                    $('#window-fill').addClass('fill');
                }, 0);
                fil = win;
            }
        } else if (fil) {
            $('#window-fill').removeClass('fill');
            setTimeout(() => {
                $('#window-fill').removeClass('top');
            }, 200);
            fil = false;
        } else {
            win.setAttribute('style', `left:${cx - deltaLeft}px;top:${cy - deltaTop}px`);
        }
    }
    titbar.addEventListener('mousedown', (e) => {
        deltaLeft = e.clientX - win.offsetLeft;
        deltaTop = e.clientY - win.offsetTop;
        page.onmousemove=win_move;
    })
    titbar.addEventListener('touchstart', (e) => {
        deltaLeft = e.targetTouches[0].clientX - win.offsetLeft;
        deltaTop = e.targetTouches[0].clientY - win.offsetTop;
        page.ontouchmove=win_move;
    })
}
page.addEventListener('mouseup', () => {
    page.onmousemove=null;
    if (fil) {
        maxwin(fil.classList[1]);
        fil = false;
        setTimeout(() => {
            $('#window-fill').removeClass('fill');
            $('#window-fill').removeClass('top');
        }, 200);
    }
})
page.addEventListener('touchend', () => {
    page.ontouchmove=null;
    if (fil) {
        maxwin(fil.classList[1]);
        fil = false;
        setTimeout(() => {
            $('#window-fill').removeClass('fill');
            $('#window-fill').removeClass('top');
        }, 200);
    }
})

// 启动
document.getElementsByTagName('body')[0].onload = function nupd() {
    $('#loadback').addClass('hide'); setTimeout(() => { $('#loadback').css('display', 'none') }, 200);
    if (updated) {
        setTimeout(() => {
            $('.msg.update').addClass('show');
        }, 1000);
    }
    aftload = true;
};

// PWA 应用
navigator.serviceWorker.register('sw.js', { updateViaCache: 'none', scope: './' });

navigator.serviceWorker.controller.postMessage('update?');

navigator.serviceWorker.addEventListener('message', function (e) {
    if (e.data == 'update') {
        updated = true;
        $('.msg.update>.main>.tit').html('<i class="bi bi-stars" style="background-image: linear-gradient(100deg, #ad6eca, #3b91d8);-webkit-background-clip: text;-webkit-text-fill-color: transparent;text-shadow:3px 3px 5px var(--sd);filter:saturate(200%) brightness(0.9);"></i> ' + $('#win-about>.cnt.update>div>details:first-child>summary').text());
        $('.msg.update>.main>.cont').html($('#win-about>.cnt.update>div>details:first-child>p').html());
        $('#loadbackupdate').css('display', 'block');
        if (aftload) {
            console.log('aftload');
        }
    }
});

// 清除cookie
if (document.cookie != '') {
    document.cookie = 'version=0.0.0;expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    $('.msg.update>.main>.tit').html('<i class="bi bi-stars" style="background-image: linear-gradient(100deg, #ad6eca, #3b91d8);-webkit-background-clip: text;-webkit-text-fill-color: transparent;text-shadow:3px 3px 5px var(--sd);filter:saturate(200%) brightness(0.9);"></i> ' + $('#win-about>.cnt.update>div>details:first-child>summary').text());
    $('.msg.update>.main>.cont').html($('#win-about>.cnt.update>div>details:first-child>p').html());
    $('#loadbackupdate').css('display', 'block');
    updated = true;
}