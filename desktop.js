// 后端服务器
const server = 'http://win12server.freehk.svipss.top/';
const pages = {
    'get-title': '', // 获取标题
};

document.querySelectorAll(`list.focs`).forEach(li => {
    li.addEventListener('click', e => {
        let _ = li.querySelector('span.focs'), la = li.querySelector('a.check'),
            las = li.querySelectorAll('a');
        $(_).addClass('cl');
        $(_).css('top', la.offsetTop - las[las.length - 1].offsetTop);
        $(_).css('left', la.offsetLeft - li.offsetLeft);
        setTimeout(() => {
            $(_).removeClass('cl');
        }, 500);
    })
});
// 禁止拖拽图片
$('img').on('dragstart', () => {
    return false;
});
// 右键菜单
$('html').on('contextmenu', () => {
    return false;
});
function stop(e) {
    e.stopPropagation();
    return false;
}
$('input,textarea,*[contenteditable=true]').on('contextmenu', (e) => {
    stop(e);
    return true;
});
let nomax = { 'calc': 0, 'notepad-fonts': 0, 'camera-notice': 0, 'winver': 0, 'run': 0 };
let nomin = { 'notepad-fonts': 0, 'camera-notice': 0, 'run': 0 };
let cms = {
    'titbar': [
        function (arg) {
            if (arg in nomax) {
                return 'null';
            }
            if ($('.window.' + arg).hasClass("max")) {
                return ['<i class="bi bi-window-stack"></i> 还原', `maxwin('${arg}')`];
            }
            else {
                return ['<i class="bi bi-window-fullscreen"></i> 最大化', `maxwin('${arg}')`];
            }
        },
        function (arg) {
            if (arg in nomin) {
                return 'null';
            }
            else {
                return ['<i class="bi bi-window-dash"></i> 最小化', `minwin('${arg}')`];
            }
        },
        function (arg) {
            if (arg in nomin) {
                return ['<i class="bi bi-window-x"></i> 关闭', `hidewin('${arg}', 'configs')`];
            }
            else {
                return ['<i class="bi bi-window-x"></i> 关闭', `hidewin('${arg}')`];
            }
        },
    ],
    'taskbar': [
        function (arg) {
            return ['<i class="bi bi-window-x"></i> 关闭', `hidewin('${arg}')`];
        }
    ],
    'desktop': [
        ['<i class="bi bi-arrow-clockwise"></i> 刷新', `$('#desktop').css('opacity','0');setTimeout(()=>{$('#desktop').css('opacity','1');},100);`],
        ['<i class="bi bi-circle-square"></i> 切换主题', 'toggletheme()'],
        `<a onmousedown="window.open('https://github.com/tjy-gitnub/win12','_blank');" win12_title="https://github.com/tjy-gitnub/win12" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)"><i class="bi bi-github"></i> 在 Github 中查看此项目</a>`,
        ['<i class="bi bi-info-circle"></i> 关于 Win12 网页版', `$('#win-about>.about').addClass('show');$('#win-about>.update').removeClass('show');openapp('about');if($('.window.about').hasClass('min'))minwin('about');`],
        ['<i class="bi bi-brush"></i> 个性化',`openapp('setting');$('#win-setting > div.menu > list > a.enable.appearance')[0].click()`]
    ],
    'winx': [
        function (arg) {
            if ($('#start-menu').hasClass("show")) {
                return ['<i class="bi bi-box-arrow-in-down"></i> 关闭开始菜单', `hide_startmenu()`];
            }
            else {
                return ['<i class="bi bi-box-arrow-in-up"></i> 打开开始菜单', `$('#start-btn').addClass('show');
                if($('#search-win').hasClass('show')){$('#search-btn').removeClass('show');
                $('#search-win').removeClass('show');setTimeout(() => {$('#search-win').removeClass('show-begin');
                }, 200);}$('#start-menu').addClass('show-begin');setTimeout(() => {$('#start-menu').addClass('show');
                }, 0);`];
            }
        },
        '<hr>',
        ['<i class="bi bi-gear"></i> 设置', `openapp('setting')`],
        ['<i class="bi bi-terminal"></i> 运行', `openapp('run')`],
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
            return ['<i class="bi bi-link-45deg"></i> 在桌面创建链接', "$('#desktop').append(`<div class='b' ondblclick=openapp('" + arg[0] + "')  ontouchstart=openapp('" + arg[0] + "')><img src='icon/" + geticon(arg[0]) + "'><p>" + arg[1] + "</p></div>`);saveDesktop();"];
        },
        function (arg) {
            return ['<i class="bi bi-x"></i> 取消固定', `$('#s-m-r>.pinned>.apps>.sm-app.${arg[0]}').remove()`];
        }
    ],
    'smlapp': [
        function (arg) {
            return ['<i class="bi bi-window"></i> 打开', `openapp('${arg[0]}');hide_startmenu();`];
        },
        function (arg) {
            return ['<i class="bi bi-link-45deg"></i> 在桌面创建链接', "$('#desktop').append(`<div class='b' ondblclick=openapp('" + arg[0] + "')  ontouchstart=openapp('" + arg[0] + "')><img src='icon/" + geticon(arg[0]) + "'><p>" + arg[1] + "</p></div>`);saveDesktop();"];
        },
        function (arg) {
            return ['<i class="bi bi-pin-angle"></i> 固定到开始菜单', "pinapp('" + arg[0] + "', '" + arg[1] + "', 'openapp(&quot;" + arg[0] + "&quot;);hide_startmenu();')"];
        }
    ],
    'msgupdate': [
        ['<i class="bi bi-layout-text-window-reverse"></i> 查看详细', `openapp('about');if($('.window.about').hasClass('min'))
        minwin('about');$('#win-about>.about').removeClass('show');$('#win-about>.update').addClass('show');
        $('#win-about>.update>div>details:first-child').attr('open','open')`],
        ['<i class="bi bi-box-arrow-right"></i> 关闭', `$('.msg.update').removeClass('show')`]
    ],
    'explorer.folder': [
        arg => {
            return ['<i class="bi bi-folder2-open"></i> 打开', `apps.explorer.goto('${arg}')`];
        },
        arg => {
            return ['<i class="bi bi-arrow-up-right-square"></i> Open in a new tab', `apps.explorer.newtab('${arg}');`];
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length>1)
                return ['<i class="bi bi-trash3"></i> 删除', `apps.explorer.del('${arg}')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length>1)
                return ['<i class="bi bi-files"></i> 复制', `apps.explorer.copy_or_cut('${arg}','copy')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length>1)
                return ['<i class="bi bi-scissors"></i> 剪切', `apps.explorer.copy_or_cut('${arg}','cut')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length>1)
                return ['<i class="bi bi-input-cursor-text"></i> 重命名', `apps.explorer.rename('${arg}')`];
            return 'null';
        }
    ],
    'explorer.file': [
        arg => {
            return ['<i class="bi bi-folder2-open"></i> 打开（目前毛用没有）', ``];
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length>1)
                return ['<i class="bi bi-trash3"></i> 删除', `apps.explorer.del('${arg}')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.main>.content>.tool>.tit>.path>div.text')[0].innerHTML != "此电脑")
                return ['<i class="bi bi-files"></i> 复制', `apps.explorer.copy_or_cut('${arg}','copy')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length>1)
                return ['<i class="bi bi-scissors"></i> 剪切', `apps.explorer.copy_or_cut('${arg}','cut')`];
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length>1)
                return ['<i class="bi bi-input-cursor-text"></i> 重命名', `apps.explorer.rename('${arg}')`];
            return 'null';
        }
    ],
    'explorer.content': [
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length>1)
                return ['<i class="bi bi-file-earmark-plus"></i> 新建文件', `apps.explorer.add($('#win-explorer>.path>.tit')[0].dataset.path,'新建文本文档.txt')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length>1)
                return ['<i class="bi bi-folder-plus"></i> 新建文件夹', `apps.explorer.add($('#win-explorer>.path>.tit')[0].dataset.path,'新建文件夹',type='files')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length>1)
                return ['<i class="bi bi-file-earmark-arrow-down"></i> 粘贴', `apps.explorer.paste($('#win-explorer>.path>.tit')[0].dataset.path,'新建文件夹',type='files')`];
            return 'null';
        },
        arg => {
            if ($('#win-explorer>.path>.tit>.path>div.text').length>1)
                return ['<i class="bi bi-arrow-clockwise"></i> 刷新', `apps.explorer.goto($('#win-explorer>.path>.tit')[0].dataset.path)`];
            return ['<i class="bi bi-arrow-clockwise"></i> 刷新', `apps.explorer.reset()`];
        }
    ],
    'explorer.tab': [
        arg => {
            return ['<i class="bi bi-x"></i> 关闭标签页', `m_tab.close('explorer',${arg})`];
        }
    ],
    'edge.tab': [
        arg => {
            return ['<i class="bi bi-pencil-square"></i> 命名标签页', `apps.edge.c_rename(${arg})`];
        },
        arg => {
            return ['<i class="bi bi-x"></i> 关闭标签页', `m_tab.close('edge',${arg})`];
        }
    ],
    'taskmgr.processes': [
        arg => {
            return ['<i class="bi bi-x"></i> 结束任务', `apps.taskmgr.taskkill('${arg}')`]
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
                    arg.event = e;
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
            // 这个.foc是用来模拟焦点的，这句是将焦点放在右键菜单上，注释掉后果不堪设想 >u-)o
            // 噢 可是如果设置焦点的话在移动设备上会显示虚拟键盘啊 QAQ (By: User782Tec)
            // (By: tjy-gitnub)
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
            console.log(arg,ret);
            if (ret == 'null') {
                return true;
            }
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
        ['<i class="bi bi-file-earmark-plus"></i> 新建', `hidedp(true);$('#win-notepad>.text-box').addClass('down');
        setTimeout(()=>{$('#win-notepad>.text-box').val('');$('#win-notepad>.text-box').removeClass('down')},200);`],
        ['<i class="bi bi-box-arrow-right"></i> 另存为', `hidedp(true);$('#win-notepad>.save').attr('href', window.URL.createObjectURL(new Blob([$('#win-notepad>.text-box').html()])));
        $('#win-notepad>.save')[0].click();`],
        '<hr>',
        ['<i class="bi bi-x"></i> 退出', `isOnDp=false;hidedp(true);hidewin('notepad')`],
    ],
    'notepad.edit': [
        ['<i class="bi bi-files"></i> 复制 <info>Ctrl+C</info>', 'document.execCommand(\'copy\')'],
        ['<i class="bi bi-clipboard"></i> 粘贴 <info>Ctrl+V</info>', `document.execCommand(\'paste\')`],
        ['<i class="bi bi-scissors"></i> 剪切 <info>Ctrl+X</info>', 'document.execCommand(\'cut\')'],
        '<hr>',
        ['<i class="bi bi-arrow-return-left"></i> 撤销 <info>Ctrl+Z</info>', 'document.execCommand(\'undo\')'],
        ['<i class="bi bi-arrow-clockwise"></i> 重做 <info>Ctrl+Y</info>', 'document.execCommand(\'redo\')'],
    ],
    'notepad.view': [
        ['<i class="bi bi-type"></i> 插入正常字块', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<p>T</p>\''],
        ['<i class="bi bi-type-h1"></i> 插入主标题', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<h1>H1</h1>\''],
        ['<i class="bi bi-type-h2"></i> 插入次标题', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<h2>H2</h2>\''],
        ['<i class="bi bi-type-h3"></i> 插入副标题', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<h3>H3</h3>\''],
        ['<i class="bi bi-type-underline"></i> 插入下划线', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<u>U</u>\''],
        ['<i class="bi bi-type-strikethrough"></i> 插入删除线', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<s>S</s>\''],
        ['<i class="bi bi-type-italic"></i> 插入斜体字', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<i>I</i>\''],
        ['<i class="bi bi-type-bold"></i> 插入加粗字', 'hidedp(true);$(\'#win-notepad>.text-box\')[0].innerHTML+=\'<b>B</b>\''],
        '<hr>',
        ['<i class="bi bi-fonts"></i> 字体', 'hidedp(true);showwin(\'notepad-fonts\');apps.notepadFonts.reset();'],
    ]
}
let dpt = null, isOnDp = false;
$('#dp')[0].onmouseover = () => { isOnDp = true };
$('#dp')[0].onmouseleave = () => { isOnDp = false; hidedp() };
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
            if (ret == 'null') {
                return true;
            }
            h += `<a class="a" onclick="${ret[1]}">${ret[0]}</a>\n`;
        } else if (typeof (item) == 'string') {
            h += item + '\n';
        } else {
            h += `<a class="a" onclick="${item[1]}">${item[0]}</a>\n`;
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
function hidedp(force = false) {
    setTimeout(() => {
        if (isOnDp && !force) {
            return;
        }
        $('#dp').removeClass('show');
        setTimeout(() => {
            $('#dp').removeClass('show-begin');
        }, 200);
    }, 100);
}
// 悬停提示
document.querySelectorAll('*[win12_title]:not(.notip)').forEach(a => {
    a.addEventListener('mouseenter', showdescp);
    a.addEventListener('mouseleave', hidedescp);
})
function showdescp(e) {
    $(e.target).attr('data-descp', 'waiting');
    setTimeout(() => {
        if ($(e.target).attr('data-descp') == 'hide') {
            return;
        }
        $(e.target).attr('data-descp', 'show');
        $('#descp').css('left', e.clientX + 15);
        $('#descp').css('top', e.clientY + 20);
        $('#descp').text($(e.target).attr('win12_title'));
        $('#descp').addClass('show-begin');
        setTimeout(() => {
            if (e.clientY + $('#descp')[0].offsetHeight + 20 >= $('html')[0].offsetHeight) {
                $('#descp').css('top', e.clientY - $('#descp')[0].offsetHeight - 10);
            }
            if (e.clientX + $('#descp')[0].offsetWidth + 15 >= $('html')[0].offsetWidth) {
                $('#descp').css('left', e.clientX - $('#descp')[0].offsetWidth - 10);
            }
            $('#descp').addClass('show');
        }, 100);
    }, 500);
}
function hidedescp(e) {
    $('#descp').removeClass('show');
    $(e.target).attr('data-descp', 'hide');
    setTimeout(() => {
        $('#descp').removeClass('show-begin');
    }, 100);
}

// 提示
let nts = {
    'about': {
        cnt: `<p class="tit">Windows 12 网页版</p>
            <p>Windows 12 网页版是一个开放源项目,<br />
            希望让用户在网络上预先体验 Windows 12,<br />
            内容可能与 Windows 12 正式版本不一致。<br />
            使用标准网络技术,例如 HTML, CSS 和 JS<br />
            此项目绝不附属于微软,且不应与微软操作系统或产品混淆,<br />
            这也不是 Windows365 cloud PC<br />
            本项目中微软、Windows和其他示范产品是微软公司的商标</p>`,
        btn: [
            { type: 'main', text: '关闭', js: 'closenotice();' },
            { type: 'detail', text: '更多', js: "closenotice();openapp('about');if($('.window.about').hasClass('min'))minwin('about');$('.dock.about').removeClass('show')" },
        ]
    },
    'feedback': {
        cnt: `<p class="tit">反馈</p>
            <p>我们非常注重用户的体验与反馈</p>
            <list class="new">
                <a class="a" onclick="window.open('https://github.com/tjy-gitnub/win12/issues','_blank');" win12_title="在浏览器新窗口打开链接" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)">在github上提交issue(需要github账户，会得到更高重视)</a>
                <a class="a" onclick="window.open('https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__SDw7SZURjUzOUo0VEVXU1pMWlFTSUVGWDNYWU1EWS4u','_blank');" win12_title="在浏览器新窗口打开链接" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)">在Microsoft Forms上发送反馈(不需要账户，也会重视)</a>
            </list>`,
        btn: [
            { type: 'main', text: '关闭', js: 'closenotice();' },
        ]
    },
    'widgets': {
        cnt: `
            <p class="tit">添加小组件</p>
            <list class="new">
                <a class="a" onclick="closenotice(); widgets.widgets.add('calc');">计算器</a>
                <a class="a" onclick="closenotice(); widgets.widgets.add('weather');">天气</a>
                <a class="a" onclick="closenotice(); widgets.widgets.add('monitor');">系统性能监视器</a>
            </list>`,
        btn: [
            { type: 'cancel', text: '取消', js: 'closenotice();' }
        ]
    },
    'widgets.monitor': {
        cnt: `
        <p class="tit">切换监视器类型</p>
        <list class="new">
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'cpu';">CPU利用率</a>
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'memory';">内存使用率</a>
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'disk';">磁盘活动时间</a>
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'wifi-receive';">网络吞吐量-接收</a>
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'wifi-send';">网络吞吐量-发送</a>
            <a class="a" onclick="closenotice(); widgets.monitor.type = 'gpu';">GPU利用率</a>
        </list>`,
        btn: [
            { type: 'cancel', text: '取消', js: 'closenotice();' }
        ]
    },
    'duplication file name': {
        cnt: `
            <p class="tit">错误</p>
            <p>文件名重复</p>`,
        btn: [
            { type: 'cancel', text: '取消', js: 'closenotice();' },
        ]
    },
    'about-copilot': {
        cnt: `
            <p class="tit">关于 Windows 12 Copilot</p>
            <p>你可以使用此AI助手帮助你更快地完成工作 (有人用win12工作?)<br>
            由于chatgpt3.5理解力较差，所以间歇性正常工作。<br>
            有任何关于本ai的反馈请让ai帮你打开copilot反馈界面<br>
            因为chatgpt是白嫖来的，所以请适量使用不要太猖狂。<br>
            也请适当使用，不要谈论敏感、违规话题，号被封了所有人都没，<br>请有身为一个人类最基本的道德底线。<br>
            小项目难免会有bug，见谅，后端由 github@NB-Bgroup 提供</p>`,
        btn: [
            { type: 'main', text: '确定', js: 'closenotice();' },
        ]
    },
    'feedback-copilot': {
        cnt: `<p class="tit">反馈 Windows 12 Copilot</p>
        <p>我们非常注重用户的体验与反馈，非常感谢对AI Copilot的建议</p>
        <list class="new">
          <a class="a" onclick="window.open('https://github.com/tjy-gitnub/win12/issues','_blank');" win12_title="在浏览器新窗口打开链接" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)">在github上提交issue (需要github账户，会得到更高重视)</a>
          <a class="a" onclick="window.open('https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__SDw7SZURjUzOUo0VEVXU1pMWlFTSUVGWDNYWU1EWS4u','_blank');" win12_title="在浏览器新窗口打开链接" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)">在Microsoft Forms上发送反馈(不需要账户，也会重视)</a>
        </list>
            `,
        btn: [
            { type: 'main', text: '关闭', js: 'closenotice();' },
        ]
    },
}
function shownotice(name) {
    $('#notice>.cnt').html(nts[name].cnt);
    let tmp = '';
    nts[name].btn.forEach(btn => {
        tmp += `<a class="a btn ${btn.type}" onclick="${btn.js}">${btn.text}</a>`
    });
    $('#notice>.btns').html(tmp);
    $('#notice-back').addClass('show');
    setTimeout(() => {
        $('#notice').addClass('show');
    }, 200);
}
function closenotice() {
    $('#notice').removeClass('show');
    setTimeout(() => {
        $('#notice-back').removeClass('show');
    }, 200);
}
// 应用
let apps = {
    setting: {
        init: () => {
            $('#win-setting>.menu>list>a.system')[0].click();
        },
        page: (name) => {
            $('#win-setting>.page>.cnt.' + name).scrollTop(0);
            $('#win-setting>.page>.cnt.show').removeClass('show');
            $('#win-setting>.page>.cnt.' + name).addClass('show');
            $('#win-setting>.menu>list>a.check').removeClass('check');
            $('#win-setting>.menu>list>a.' + name).addClass('check');
        },
        theme_get: () => {
            $('#set-theme').html(`<loading><svg width="30px" height="30px" viewBox="0 0 16 16">
            <circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;"></circle>
            <circle cx="8px" cy="8px" r="7px" style="stroke:#2983cc;stroke-width:3px;"></circle></svg></loading>`)
            // 实时获取主题
            $.get('https://api.github.com/repos/tjy-gitnub/win12-theme/contents').then(cs => {
                cs.forEach(c => {
                    if (c.type == 'dir') {
                        $.get(c.url).then(cnt => {
                            cnt.forEach(cn => {
                                if (cn.name == 'theme.json') {
                                    $.getJSON('https://tjy-gitnub.github.io/win12-theme/' + cn.path).then(inf => {
                                        infjs = inf;
                                        if ($('#set-theme>loading').length)
                                            $('#set-theme').html('');
                                        $('#set-theme').append(`<a class="a act" onclick="apps.setting.theme_set('${c.name}')" style="background-image:url('https://tjy-gitnub.github.io/win12-theme/${c.name}/view.jpg')">${c.name}</a>`);
                                    })
                                }
                            })
                        })
                    }
                });
            });
        },
        theme_set: (infp) => {
            $.get('https://api.github.com/repos/tjy-gitnub/win12-theme/contents/' + infp).then(cnt => {
                console.log('https://api.github.com/repos/tjy-gitnub/win12-theme/contents/' + infp);
                cnt.forEach(cn => {
                    if (cn.name == 'theme.json') {
                        $.getJSON('https://tjy-gitnub.github.io/win12-theme/' + cn.path).then(inf => {
                            infjs = inf;
                            cnt.forEach(fbg => {
                                console.log(fbg, infjs);
                                if (fbg.name == infjs.bg) {
                                    $(':root').css('--bgul', `url('https://tjy-gitnub.github.io/win12-theme/${fbg.path}')`);
                                    $(':root').css('--theme-1', infjs.color1);
                                    $(':root').css('--theme-2', infjs.color2);
                                    $(':root').css('--href', infjs.href);
                                    // $('#set-theme').append(`<a class="a act" onclick="apps.setting.theme_set(\`(${inf})\`)" style="background-image:url('https://tjy-gitnub.github.io/win12-theme/${fbg.path}')">${c.name}</a>`);
                                }
                            })
                        })
                    }
                })
            })
        },
    },
    run: {
        init: () => {
            $('#win-run>.open>input').val('');
            window.setTimeout(() => {
                $('#win-run>.open>input').focus();
            }, 300);
        },
        run: (cmd) => {
            if (cmd == 'cmd') {
                openapp('terminal');
            }
            else if (cmd != '') {
                try {
                    cmd = cmd.replace(/\/$/, '');
                    var pathl = cmd.split('/');
                    let tmp = apps.explorer.path;
                    let valid = true;
                    pathl.forEach(name => {
                        if (tmp['folder'].hasOwnProperty(name)) {
                            tmp = tmp['folder'][name];
                        }
                        else {
                            valid = false;
                            return false;
                        }
                    });
                    if (valid == true) {
                        openapp('explorer');
                        window.setTimeout(() => {
                            apps.explorer.goto(cmd);
                        }, 300);
                    }
                    else {
                        if ($('.window.' + cmd)[0] && !$('.window.' + cmd).hasClass('configs')) {
                            openapp(cmd);
                        }
                        else {
                            openapp('edge');
                            window.setTimeout(() => {
                                apps.edge.newtab();
                                apps.edge.goto(cmd);
                            }, 300);
                        }
                    }
                }
                catch {
                    openapp('edge');
                    window.setTimeout(() => {
                        apps.edge.newtab();
                        apps.edge.goto(cmd);
                    }, 300);
                }
            }
        }
    },
    taskmgr: {
        sortType: 'cpu',
        sortOrder: 'up-down',
        tasks: structuredClone(taskmgrTasks),
        cpu: 0,
        cpuCtx: null,
        cpuCanvas: null,
        cpuLastPos: [0, 0],
        cpuBgCanvas: null,
        cpuBgCtx: null,
        cpuRunningTime: 0,
        memory: 0,
        memoryCtx: null,
        memoryCanvas: null,
        memoryLastPos: [0, 0],
        memoryBgCanvas: null,
        memoryBgCtx: null,
        memoryCanvas2: null,
        memoryCtx2: null,
        disk: 0,
        diskSpeed: {
            read: 0,
            write: 0
        },
        diskCanvas: null,
        diskCtx: null,
        diskLastPos: [0, 0],
        diskBgCanvas: null,
        diskBgCtx: null,
        diskCanvas2: null,
        diskCtx2: null,
        diskBgCanvas2: null,
        diskBgCtx2: null,
        diskLastPos2: {
            read: [0, 0],
            write: [0, 0]
        },
        wifi: [0, 0],
        wifiCanvas: null,
        wifiCtx: null,
        wifiLastPos: [[0, 0], [0, 0]],
        wifiBgCanvas: null,
        wifiBgCtx: null,
        gpu: {
            d3: 0,
            copy: 0,
            videod: 0,
            videop: 0,
            usage: 0
        },
        gpuMemory: {
            private: 0,
            public: 0
        },
        gpuCtx: [null, null, null, null],
        gpuCanvas: [null, null, null, null],
        gpuLastPos: [[0, 0], [0, 0], [0, 0], [0, 0]],
        gpuBgCanvas: [null, null, null, null],
        gpuBgCtx: [null, null, null, null],
        gpuCanvas2: [null, null],
        gpuCtx2: [null, null],
        gpuLastPos2: [[0, 0], [0, 0]],
        gpuBgCanvas2: [null, null],
        gpuBgCtx2: [null, null],
        gpuCanvas3: null,
        gpuCtx3: null,
        gpuLastPos3: [0, 0],
        processList: [],
        handle: 0,
        init: () => {
            $('#win-taskmgr>.menu>list.focs>a')[0].click();
        },
        load: (init_all = true) => {
            if (init_all == true) {
                $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(3)>.value')[0].innerText = apps.taskmgr.tasks.length;

                apps.taskmgr.cpuCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu canvas.chart')[0];
                apps.taskmgr.cpuBgCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu canvas.bg')[0];
                apps.taskmgr.initgraph('cpu', '#2983cc');

                apps.taskmgr.memoryCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory canvas.chart')[0];
                apps.taskmgr.memoryBgCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory canvas.bg')[0];
                apps.taskmgr.initgraph('memory', '#660099');
                apps.taskmgr.memoryCanvas2 = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory canvas.chart2')[0];
                apps.taskmgr.memoryCtx2 = apps.taskmgr.memoryCanvas2.getContext('2d');
                apps.taskmgr.memoryCtx2.fillStyle = '#66009922';
                apps.taskmgr.memoryCtx.lineWidth = 4;

                apps.taskmgr.diskCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk canvas.chart')[0];
                apps.taskmgr.diskBgCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk canvas.bg')[0];
                apps.taskmgr.initgraph('disk', '#008000');
                apps.taskmgr.diskCanvas2 = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk canvas.chart2')[0];
                apps.taskmgr.diskLastPos2 = {
                    read: [apps.taskmgr.diskCanvas2.width, apps.taskmgr.diskCanvas2.height],
                    write: [apps.taskmgr.diskCanvas2.width, apps.taskmgr.diskCanvas2.height]
                }
                apps.taskmgr.diskCtx2 = apps.taskmgr.diskCanvas2.getContext('2d');
                apps.taskmgr.diskCtx2.strokeStyle = '#008000';
                apps.taskmgr.diskCtx2.fillStyle = '#00800022';
                apps.taskmgr.diskCtx2.lineWidth = 3;
                apps.taskmgr.diskBgCanvas2 = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk canvas.bg2')[0];
                apps.taskmgr.diskBgCtx2 = apps.taskmgr.diskBgCanvas2.getContext('2d');
                apps.taskmgr.diskBgCtx2.strokeStyle = '#aeaeae';
                apps.taskmgr.diskBgCtx2.lineWidth = 1;

                for (var i = 0; i < 4; i++) {
                    apps.taskmgr.gpuCanvas[i] = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-gpu>.graphs>.graph' + (i + 1) + '>.chart>canvas.chart')[0];
                    apps.taskmgr.gpuBgCanvas[i] = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-gpu>.graphs>.graph' + (i + 1) + '>.chart>canvas.bg')[0];
                    apps.taskmgr.gpuCtx[i] = apps.taskmgr.gpuCanvas[i].getContext('2d');
                    apps.taskmgr.gpuBgCtx[i] = apps.taskmgr.gpuBgCanvas[i].getContext('2d');
                    apps.taskmgr.gpuCtx[i].strokeStyle = '#2983cc';
                    apps.taskmgr.gpuCtx[i].fillStyle = '#2983cc22';
                    apps.taskmgr.gpuCtx[i].lineWidth = 4;
                    apps.taskmgr.gpuLastPos[i] = [apps.taskmgr.gpuCanvas[i].width, apps.taskmgr.gpuCanvas[i].height];
                    apps.taskmgr.gpuBgCtx[i].strokeStyle = '#aeaeae';
                    apps.taskmgr.gpuBgCtx[i].lineWidth = 3;
                    apps.taskmgr.initgrids(apps.taskmgr.gpuBgCtx[i]);
                }
                for (var i = 0; i < 2; i++) {
                    apps.taskmgr.gpuCanvas2[i] = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-gpu>.gpu2-' + (i + 1) + '>canvas.chart2')[0];
                    apps.taskmgr.gpuBgCanvas2[i] = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-gpu>.gpu2-' + (i + 1) + '>canvas.bg2')[0];
                    apps.taskmgr.gpuCtx2[i] = apps.taskmgr.gpuCanvas2[i].getContext('2d');
                    apps.taskmgr.gpuBgCtx2[i] = apps.taskmgr.gpuBgCanvas2[i].getContext('2d');
                    apps.taskmgr.gpuCtx2[i].strokeStyle = '#2983cc';
                    apps.taskmgr.gpuCtx2[i].fillStyle = '#2983cc22';
                    apps.taskmgr.gpuCtx2[i].lineWidth = 3;
                    apps.taskmgr.gpuLastPos2[i] = [apps.taskmgr.gpuCanvas2[i].width, apps.taskmgr.gpuCanvas2[i].height];
                    apps.taskmgr.gpuBgCtx2[i].strokeStyle = '#aeaeae';
                    apps.taskmgr.gpuBgCtx2[i].lineWidth = 1;
                    apps.taskmgr.initgrids(apps.taskmgr.gpuBgCtx2[i]);
                }
                apps.taskmgr.gpuCanvas3 = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-gpu>.graphs>canvas.usage')[0];
                apps.taskmgr.gpuCtx3 = apps.taskmgr.gpuCanvas3.getContext('2d');
                apps.taskmgr.gpuCtx3.strokeStyle = '#2983cc';
                apps.taskmgr.gpuCtx3.fillStyle = '#2983cc22';
                apps.taskmgr.gpuCtx3.lineWidth = 4;
                apps.taskmgr.gpuLastPos3 = [apps.taskmgr.gpuCanvas3.width, apps.taskmgr.gpuCanvas3.height];

                apps.taskmgr.wifiCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-wifi canvas.chart')[0];
                apps.taskmgr.wifiBgCanvas = $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-wifi canvas.bg')[0];
                apps.taskmgr.initgraph('wifi', '#8e5829', false);
                apps.taskmgr.wifiLastPos = [
                    [apps.taskmgr.wifiCanvas.width, apps.taskmgr.wifiCanvas.height],
                    [apps.taskmgr.wifiCanvas.width, apps.taskmgr.wifiCanvas.height]
                ]
            }

            if (apps.taskmgr.preLoaded != true && apps.taskmgr.loaded != true) {
                apps.taskmgr.gpuMemory.private = Number((Math.random() * 4).toFixed(2));
                apps.taskmgr.gpuMemory.public = Number((Math.random() * 4).toFixed(2));
                apps.taskmgr.generateProcesses();
                apps.taskmgr.sort();
                apps.taskmgr.loadProcesses();
                apps.taskmgr.performanceLoad();
            }

            if (init_all == true) {
                apps.taskmgr.loadProcesses();
                apps.taskmgr.generateProcesses();
                apps.taskmgr.sort();
                apps.taskmgr.performanceLoad();
                apps.taskmgr.graphLoad();
                apps.taskmgr.initgrids(apps.taskmgr.cpuBgCtx);
                apps.taskmgr.initgrids(apps.taskmgr.memoryBgCtx);
                apps.taskmgr.initgrids(apps.taskmgr.diskBgCtx);
                apps.taskmgr.initgrids(apps.taskmgr.diskBgCtx2);
                apps.taskmgr.initgrids(apps.taskmgr.wifiBgCtx);
                window.setInterval(() => {
                    apps.taskmgr.loadProcesses();
                    apps.taskmgr.generateProcesses();
                    apps.taskmgr.sort();
                    apps.taskmgr.performanceLoad();
                    apps.taskmgr.graphLoad();
                    apps.taskmgr.gridLine();
                }, 1000);
            }
            else if (apps.taskmgr.loaded != true && apps.taskmgr.preLoaded != true) {
                window.setInterval(() => {
                    apps.taskmgr.loadProcesses();
                    apps.taskmgr.generateProcesses();
                    apps.taskmgr.sort();
                    apps.taskmgr.performanceLoad();
                }, 1000);
            }
        },
        page: (name) => {
            $('#win-taskmgr>.main>.cnt.' + name).scrollTop(0);
            $('#win-taskmgr>.main>.cnt.show').removeClass('show');
            $('#win-taskmgr>.main>.cnt.' + name).addClass('show');
            $('#win-taskmgr>.menu>list.focs>a.check').removeClass('check');
            $('#win-taskmgr>.menu>list.focs>a.' + name).addClass('check');
        },
        graph: (name) => {
            $('#win-setting>.page>.cnt.' + name).scrollTop(0);
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.show').removeClass('show');
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.' + name).addClass('show');
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.check').removeClass('check');
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.' + name).addClass('check');
        },
        generateProcesses: () => {
            let processList = [];
            let max = 100 / apps.taskmgr.tasks.length;
            let cpusum = 0, memorysum = 0, disksum = 0, diskUsing = Number(Math.random()) > 0.7/*, color = window.getComputedStyle(page, null).getPropertyValue('--href')*/;
            for (const elt of apps.taskmgr.tasks) {
                let cpu = Number((Math.random() * max).toFixed(1)),
                    memory = apps.taskmgr.memory != 0 ? apps.taskmgr.memory / apps.taskmgr.tasks.length + Number(((Math.random() - 0.5) / 5).toFixed(1)) : Number((Math.random() * max).toFixed(1)),
                    disk = Number((Math.random() * max).toFixed(1)) > (max / 1.2) && diskUsing ? max * Number(Math.random().toFixed(1)) : 0;
                processList.splice(processList.length, 0, {
                    name: elt.name,
                    icon: elt.icon || '',
                    system: elt.system,
                    cpu: cpu,
                    memory: memory,
                    disk: disk
                });
                cpusum = Number((cpusum + cpu).toFixed(1));
                memorysum = Number((memorysum + memory).toFixed(1));
                disksum = Number((disksum + disk).toFixed(1));
            }
            apps.taskmgr.cpu = cpusum;
            apps.taskmgr.memory = memorysum;
            apps.taskmgr.disk = disksum;
            apps.taskmgr.processList = processList;
        },
        loadProcesses: (processList = apps.taskmgr.processList) => {
            const processContainer = $('#win-taskmgr>.main>.cnt.processes tbody.view')[0];
            const values = $('#win-taskmgr>.main>.cnt.processes thead>tr>th>.value');
            const cpu = values[0], memory = values[1], disk = values[2];
            let selected;
            if ($('#win-taskmgr>.main>.cnt.processes tbody.view>tr.select>td:first-child>.text')[0]) {
                selected = $('#win-taskmgr>.main>.cnt.processes tbody.view>tr.select>td:first-child>.text')[0].innerText;
            }
            let max = 100 / apps.taskmgr.tasks.length;
            processContainer.innerHTML = '';
            for (const elt of processList) {
                const newElt = document.createElement('tr');
                newElt.classList.add('notrans');
                newElt.innerHTML = `<td><div class="text"><div class="icon" style="background-image: url('${elt.icon ? elt.icon : ''}');"></div>${elt.name}</div></td><td style="text-align: right;background-color: ${page.classList.contains('dark') ? '#193662' : '#7ec6ec'}${elt.cpu >= (max / 1.3) ? 'ff' : 'aa'};">${elt.cpu.toFixed(1)}%</td><td style="text-align: right;background-color: ${page.classList.contains('dark') ? '#193662' : '#7ec6ec'}${elt.memory >= (max / 1.3) ? 'ff' : 'aa'};">${elt.memory.toFixed(1)}%</td><td style="text-align: right;background-color: ${page.classList.contains('dark') ? '#193662' : '#7ec6ec'}${elt.disk >= (max / 1.3) ? 'ff' : 'aa'};">${elt.disk.toFixed(1)}%</td><td>${['非常低', '非常低', '非常低', '低', '中'][Math.floor(Math.random() * 5)]}</td>`;
                if (elt.name == selected) {
                    newElt.classList.add('select');
                }
                processContainer.appendChild(newElt);
                newElt.onclick = function () {
                    apps.taskmgr.selectProcess(this);
                }
                newElt.oncontextmenu = function (e) {
                    return showcm(e, 'taskmgr.processes', elt.name);
                }
                window.setTimeout(() => {
                    newElt.classList.remove('notrans');
                }, 100);
            }
            cpu.innerText = apps.taskmgr.cpu.toFixed(1) + '%';
            memory.innerText = apps.taskmgr.memory.toFixed(1) + '%';
            disk.innerText = apps.taskmgr.disk.toFixed(1) + '%';
        },
        sort: (processList = apps.taskmgr.processList, type = apps.taskmgr.sortType, order = apps.taskmgr.sortOrder) => {
            processList.sort((a, b) => {
                if (a[type] > b[type]) {
                    return order == 'up-down' ? -1 : 1;
                }
                else if (a[type] <= b[type]) {
                    return order == 'up-down' ? 1 : -1;
                }
            });
            apps.taskmgr.processList = processList;
        },
        performanceLoad: () => {
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.cpu.toFixed(1)}%`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(2)>.value')[0].innerText = `${(3200 / 100 * apps.taskmgr.cpu).toFixed(1)} GHz`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(4)>.value')[0].innerText = `${apps.taskmgr.tasks.length * (5 + Math.floor(Math.random() * 5))}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(5)>.value')[0].innerText = `${apps.taskmgr.tasks.length * (10 + Math.floor(Math.random() * 20))}`;
            let sec = apps.taskmgr.cpuRunningTime;
            let min = Math.floor(sec / 60);
            sec %= 60;
            let hour = Math.floor(min / 60);
            min %= 60;
            let day = Math.floor(hour / 24);
            hour %= 24;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-cpu>.information>.left>div:nth-child(6)>.value')[0].innerText = `${day}:${String(hour).length < 2 ? '0' : ''}${hour}:${String(min).length < 2 ? '0' : ''}${min}:${String(sec).length < 2 ? '0' : ''}${sec}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-cpu>.right>.data>.value1')[0].innerText = `${apps.taskmgr.cpu.toFixed(1)}%`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-cpu>.right>.data>.value2')[0].innerText = `${(3200 / 100 * apps.taskmgr.cpu).toFixed(1)}GHz`;

            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.memory.toFixed(1)} GB (0 MB)`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(2)>.value')[0].innerText = `${(100 - apps.taskmgr.memory).toFixed(1)} GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(3)>.value')[0].innerText = `${(apps.taskmgr.memory - 2).toFixed(1)} / 100 GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-memory>.information>.left>div:nth-child(4)>.value')[0].innerText = `${(apps.taskmgr.memory / 2).toFixed(2)} GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-memory>.right>.data>.value1')[0].innerText = `${apps.taskmgr.memory.toFixed(1)} / 100 GB`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-memory>.right>.data>.value2')[0].innerText = `${apps.taskmgr.memory.toFixed(1)}%`;

            apps.taskmgr.diskSpeed.read = apps.taskmgr.disk != 0 ? (Math.random() * 100).toFixed(2) : 0;
            apps.taskmgr.diskSpeed.write = apps.taskmgr.disk != 0 ? (Math.random() * 100).toFixed(2) : 0;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.disk}%`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(2)>.value')[0].innerText = `${apps.taskmgr.disk != 0 ? Math.random().toFixed(2) : 0} 毫秒`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(3)>.value')[0].innerText = `${apps.taskmgr.diskSpeed.read} ${apps.taskmgr.disk != 0 ? 'MB/秒' : 'KB/秒'}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-disk>.information>.left>div:nth-child(4)>.value')[0].innerText = `${apps.taskmgr.diskSpeed.write} ${apps.taskmgr.disk != 0 ? 'MB/秒' : 'KB/秒'}`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-disk>.right>.data>.value2')[0].innerText = `${apps.taskmgr.disk}%`;

            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-gpu>.right>.data>.value2')[0].innerText = `${apps.taskmgr.gpu.usage.toFixed(1)}%`;

            apps.taskmgr.gpu.d3 = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.copy = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.videop = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.videod = Number((Math.random() * 15).toFixed(2));
            apps.taskmgr.gpu.usage = Number(((apps.taskmgr.gpu.d3 + apps.taskmgr.gpu.copy + apps.taskmgr.gpu.videop + apps.taskmgr.gpu.videod) / 4).toFixed(1));

            apps.taskmgr.wifi[0] = Number((Math.random() * 100).toFixed(2));
            apps.taskmgr.wifi[1] = Number((Math.random() * 100).toFixed(2));
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-wifi>.information>.left>div:nth-child(1)>.value')[0].innerText = `${apps.taskmgr.wifi[1].toFixed(2)} Mbps`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.performance-graph>.graph-wifi>.information>.left>div:nth-child(2)>.value')[0].innerText = `${apps.taskmgr.wifi[0].toFixed(2)} Mbps`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>.graph-wifi>.right>.data>.value2')[0].innerText = `发送: ${apps.taskmgr.wifi[1]} 接收: ${apps.taskmgr.wifi[0]} Mbps`;
        },
        graphLoad: () => {
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>*>.left>.graph-view-cpu')[0].style.backgroundImage = `url("${apps.taskmgr.drawgraph(apps.taskmgr.cpuCtx, 'cpuLastPos', apps.taskmgr.cpu)}")`;
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>*>.left>.graph-view-memory')[0].style.backgroundImage = `url("${apps.taskmgr.drawgraph(apps.taskmgr.memoryCtx, 'memoryLastPos', apps.taskmgr.memory)}")`;
            w = apps.taskmgr.memoryCanvas2.width;
            h = apps.taskmgr.memoryCanvas2.height;
            apps.taskmgr.memoryCtx2.clearRect(0, 0, w, h);
            apps.taskmgr.memoryCtx2.fillRect(0, 0, w / 100 * apps.taskmgr.memory, h);
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>*>.left>.graph-view-disk')[0].style.backgroundImage = `url("${apps.taskmgr.drawgraph(apps.taskmgr.diskCtx, 'diskLastPos', apps.taskmgr.disk)}")`;
            // 绘制磁盘传输速率
            w = apps.taskmgr.diskCanvas2.width;
            h = apps.taskmgr.diskCanvas2.height;
            data = apps.taskmgr.diskCtx2.getImageData(w / 60, 0, w - w / 60, h);
            apps.taskmgr.diskCtx2.clearRect(0, 0, w, h);
            apps.taskmgr.diskCtx2.putImageData(data, 0, 0);
            // 读取速度
            apps.taskmgr.diskCtx2.fillStyle = '#00800022';
            apps.taskmgr.diskCtx2.setLineDash([]);
            apps.taskmgr.drawgraph(apps.taskmgr.diskCtx2, apps.taskmgr.diskLastPos2.read, apps.taskmgr.diskSpeed.read, false, false);
            apps.taskmgr.diskLastPos2.read = [w - w / 60, h / 100 * (100 - apps.taskmgr.diskSpeed.read)];
            // 写入速度
            apps.taskmgr.diskCtx2.fillStyle = '#00000000';
            apps.taskmgr.diskCtx2.setLineDash([4, 4]);
            apps.taskmgr.drawgraph(apps.taskmgr.diskCtx2, apps.taskmgr.diskLastPos2.write, apps.taskmgr.diskSpeed.write, false, false);
            apps.taskmgr.diskLastPos2.write = [w - w / 60, h / 100 * (100 - apps.taskmgr.diskSpeed.write)];
            // 绘制网络
            w = apps.taskmgr.wifiCanvas.width;
            h = apps.taskmgr.wifiCanvas.height;
            data = apps.taskmgr.wifiCtx.getImageData(w / 60, 0, w - w / 60, h);
            apps.taskmgr.wifiCtx.clearRect(0, 0, w, h);
            apps.taskmgr.wifiCtx.putImageData(data, 0, 0);
            // 接收
            apps.taskmgr.wifiCtx.fillStyle = '#8e582922';
            apps.taskmgr.wifiCtx.setLineDash([]);
            apps.taskmgr.drawgraph(apps.taskmgr.wifiCtx, apps.taskmgr.wifiLastPos[0], apps.taskmgr.wifi[0], false, false);
            apps.taskmgr.wifiLastPos[0] = [w - w / 60, h / 100 * (100 - apps.taskmgr.wifi[0])];
            // 发送
            apps.taskmgr.wifiCtx.fillStyle = '#8e582900';
            apps.taskmgr.wifiCtx.setLineDash([4, 4]);
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>*>.left>.graph-view-wifi')[0].style.backgroundImage = `url("${apps.taskmgr.drawgraph(apps.taskmgr.wifiCtx, apps.taskmgr.wifiLastPos[1], apps.taskmgr.wifi[1], false, false)}")`;
            apps.taskmgr.wifiLastPos[1] = [w - w / 60, h / 100 * (100 - apps.taskmgr.wifi[1])];
            // 绘制显卡
            for (var i = 0; i < 4; i++) {
                w = apps.taskmgr.gpuCanvas[i].width;
                h = apps.taskmgr.gpuCanvas[i].height;
                apps.taskmgr.drawgraph(apps.taskmgr.gpuCtx[i], apps.taskmgr.gpuLastPos[i], apps.taskmgr.gpu[['d3', 'copy', 'videod', 'videop'][i]], false);
                apps.taskmgr.gpuLastPos[i] = [w - w / 60, h / 100 * (100 - apps.taskmgr.gpu[['d3', 'copy', 'videod', 'videop'][i]])];
            }
            for (var i = 0; i < 2; i++) {
                w = apps.taskmgr.gpuCanvas2[i].width;
                h = apps.taskmgr.gpuCanvas2[i].height;
                apps.taskmgr.drawgraph(apps.taskmgr.gpuCtx2[i], apps.taskmgr.gpuLastPos2[i], apps.taskmgr.gpuMemory[['private', 'public'][i]], setPos = false, move = true, max = [16, 32][i]);
                apps.taskmgr.gpuLastPos2[i] = [w - w / 60, h / [16, 32][i] * ([16, 32][i] - apps.taskmgr.gpuMemory[['private', 'public'][i]])];
            }
            $('#win-taskmgr>.main>.cnt.performance>.content>.select-menu>*>.left>.graph-view-gpu')[0].style.backgroundImage = `url("${apps.taskmgr.drawgraph(apps.taskmgr.gpuCtx3, 'gpuLastPos3', apps.taskmgr.gpu.usage)}")`
        },
        changeSort: (elt, type) => {
            for (const _elt of $('#win-taskmgr>.main>.cnt.processes thead>tr>th>i')) {
                _elt.className = 'bi';
            }
            if (apps.taskmgr.sortOrder == 'up-down' && apps.taskmgr.sortType == type) {
                elt.className = 'bi bi-chevron-up';
                apps.taskmgr.sortOrder = 'down-up';
                apps.taskmgr.sort(apps.taskmgr.processList, type, 'down-up');
            }
            else {
                elt.className = 'bi bi-chevron-down';
                apps.taskmgr.sortOrder = 'up-down';
                apps.taskmgr.sortType = type;
                apps.taskmgr.sort(apps.taskmgr.processList, type, 'up-down');
            }
        },
        gridLine: () => {
            apps.taskmgr.changeGrids(apps.taskmgr.memoryBgCtx);
            apps.taskmgr.changeGrids(apps.taskmgr.cpuBgCtx);
            apps.taskmgr.changeGrids(apps.taskmgr.diskBgCtx);
            apps.taskmgr.changeGrids(apps.taskmgr.diskBgCtx2);
            apps.taskmgr.changeGrids(apps.taskmgr.wifiBgCtx);
            apps.taskmgr.gpuBgCtx.forEach(function (ctx) {
                apps.taskmgr.changeGrids(ctx);
            });
            apps.taskmgr.gpuBgCtx2.forEach(function (ctx) {
                apps.taskmgr.changeGrids(ctx);
            });
        },
        selectProcess: (elt) => {
            $('#win-taskmgr>.main>.cnt.processes tbody.view>.select').removeClass('select');
            $(elt).addClass('select');
        },
        taskkill: (name) => {
            if (name == 'System') {
                window.location = 'bluescreen.html';
            }
            else {
                apps.taskmgr.tasks.splice(apps.taskmgr.tasks.findIndex(elt => elt.name == name), 1);
                if (taskmgrTasks.find(elt => elt.name == name).link != null) {
                    hidewin(taskmgrTasks.find(elt => elt.name == name).link);
                }
            }
        },
        initgraph: (prefix, color, setPos = true) => {
            if (setPos == true) {
                apps.taskmgr[prefix + 'LastPos'] = [apps.taskmgr[prefix + 'Canvas'].width, apps.taskmgr[prefix + 'Canvas'].height];
            }

            apps.taskmgr[prefix + 'Ctx'] = apps.taskmgr[prefix + 'Canvas'].getContext('2d');
            apps.taskmgr[prefix + 'BgCtx'] = apps.taskmgr[prefix + 'BgCanvas'].getContext('2d');
            apps.taskmgr[prefix + 'Ctx'].strokeStyle = color;
            console.log(color, color + '22', prefix)
            apps.taskmgr[prefix + 'Ctx'].fillStyle = color + '22';
            console.log(apps.taskmgr[prefix + 'Ctx'].fillStyle)
            apps.taskmgr[prefix + 'Ctx'].lineWidth = 4;
            apps.taskmgr[prefix + 'BgCtx'].strokeStyle = '#aeaeae';
            apps.taskmgr[prefix + 'BgCtx'].lineWidth = 3;
        },
        initgrids: (ctx) => {
            for (var i = 0; i <= 10; i++) {
                ctx.beginPath();
                ctx.moveTo(0, ctx.canvas.height / 10 * i);
                ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 10 * i);
                ctx.stroke();
                ctx.closePath();
            }
            for (var i = 0; i <= 20; i++) {
                ctx.beginPath();
                ctx.moveTo(ctx.canvas.width / 20 * i, 0);
                ctx.lineTo(ctx.canvas.width / 20 * i, ctx.canvas.height);
                ctx.stroke();
                ctx.closePath();
            }
        },
        drawgraph(ctx, lastPos, num, setPos = true, move = true, max = 100) {
            let w = ctx.canvas.width, h = ctx.canvas.height;
            if (move == true) {
                data = ctx.getImageData(w / 60, 0, w - w / 60, h);
                ctx.clearRect(0, 0, w, h);
                ctx.putImageData(data, 0, 0);
            }
            ctx.beginPath();
            if (setPos == true) {
                ctx.moveTo(apps.taskmgr[lastPos][0], apps.taskmgr[lastPos][1]);
            }
            else {
                ctx.moveTo(lastPos[0], lastPos[1]);
            }
            ctx.lineTo(w, h / max * (max - num));
            ctx.stroke();
            ctx.lineTo(w, h);
            ctx.lineTo(w - w / 60, h);
            ctx.fill();
            if (setPos == true) {
                apps.taskmgr[lastPos] = [w - w / 60, h / max * (max - num)];
            }
            return ctx.canvas.toDataURL();
        },
        changeGrids: (ctx) => {
            let left = ctx.getImageData(0, 0, ctx.canvas.width / 30 * 29, ctx.canvas.height);
            let right = ctx.getImageData(ctx.canvas.width / 30 * 29, 0, ctx.canvas.width / 30, ctx.canvas.height);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.putImageData(left, ctx.canvas.width / 30, 0);
            ctx.putImageData(right, 0, 0);
        }
    },
    whiteboard: {
        canvas: null,
        ctx: null,
        windowResizeObserver: null,
        color: 'red',
        init: () => {
            apps.whiteboard.ctx.lineJoin = 'round';
            apps.whiteboard.ctx.lineCap = 'round';
            apps.whiteboard.changeColor(apps.whiteboard.color);
            if ($(':root').hasClass('dark')) {
                $('.window.whiteboard>.titbar>p').text('Blackboard');
            } else {
                $('.window.whiteboard>.titbar>p').text('Whiteboard');
            }
        },
        changeColor: (color) => {
            apps.whiteboard.color = color;
            if (color == 'eraser') {
                apps.whiteboard.ctx.strokeStyle = 'black';
                apps.whiteboard.ctx.lineWidth = 35;
                apps.whiteboard.ctx.globalCompositeOperation = 'destination-out';
            }
            else {
                apps.whiteboard.ctx.strokeStyle = color;
                apps.whiteboard.ctx.globalCompositeOperation = 'source-over';
                apps.whiteboard.ctx.lineWidth = 8;
            }
        },
        changePen: function () {
            const pens = $('#win-whiteboard>.toolbar>.tools>*');
            for (const elt of pens) {
                elt.classList.remove('active');
            }
            this.classList.add('active');
            apps.whiteboard.changeColor(this.dataset.color);
        },
        load: () => {
            apps.whiteboard.canvas = $('#win-whiteboard>canvas')[0];
            apps.whiteboard.ctx = apps.whiteboard.canvas.getContext('2d');
            apps.whiteboard.windowResizeObserver = new ResizeObserver(apps.whiteboard.resize);
            apps.whiteboard.windowResizeObserver.observe($('.window.whiteboard')[0], { box: 'border-box' });
        },
        resize: () => {
            try {
                const imgData = apps.whiteboard.ctx.getImageData(0, 0, apps.whiteboard.canvas.width, apps.whiteboard.canvas.height);
                apps.whiteboard.canvas.width = $('#win-whiteboard')[0].clientWidth;
                apps.whiteboard.canvas.height = $('#win-whiteboard')[0].clientHeight;
                apps.whiteboard.ctx.putImageData(imgData, 0, 0);
            }
            catch {
                apps.whiteboard.canvas.width = $('#win-whiteboard')[0].clientWidth;
                apps.whiteboard.canvas.height = $('#win-whiteboard')[0].clientHeight;
            }
            apps.whiteboard.init();
        },
        draw: (e) => {
            let offsetX, offsetY, left = $('#win-whiteboard')[0].getBoundingClientRect().left, top = $('#win-whiteboard')[0].getBoundingClientRect().top;
            if (e.type.match('mouse')) {
                offsetX = e.clientX - left, offsetY = e.clientY - top;
            }
            else if (e.type.match('touch')) {
                offsetX = e.touches[0].clientX - left, offsetY = e.touches[0].clientY - top;
            }
            apps.whiteboard.ctx.beginPath();
            apps.whiteboard.ctx.moveTo(offsetX, offsetY);
            page.onmousemove = apps.whiteboard.drawing;
            page.ontouchmove = apps.whiteboard.drawing;
            page.onmouseup = apps.whiteboard.up;
            page.ontouchend = apps.whiteboard.up;
            page.ontouchcancel = apps.whiteboard.up;
        },
        drawing: (e) => {
            let offsetX, offsetY, left = $('#win-whiteboard')[0].getBoundingClientRect().left, top = $('#win-whiteboard')[0].getBoundingClientRect().top;
            if (e.type.match('mouse')) {
                offsetX = e.clientX - left, offsetY = e.clientY - top;
            }
            else if (e.type.match('touch')) {
                offsetX = e.touches[0].clientX - left, offsetY = e.touches[0].clientY - top;
            }
            apps.whiteboard.ctx.lineTo(offsetX, offsetY);
            apps.whiteboard.ctx.stroke();
        },
        up: () => {
            apps.whiteboard.ctx.stroke();
            page.onmousemove = null;
            page.ontouchmove = null;
            page.onmouseup = null;
            page.ontouchend = null;
            page.ontouchcancel = null;
        },
        download: () => {
            const url = apps.whiteboard.canvas.toDataURL();
            $('#win-whiteboard>a.download')[0].href = url;
            $('#win-whiteboard>a.download')[0].click();
        },
        delete: () => {
            apps.whiteboard.ctx.clearRect(0, 0, apps.whiteboard.canvas.width, apps.whiteboard.canvas.height);
        }
    },
    webapps: {
        apps: ['vscode', 'bilibili'],
        init: () => {
            for (const app of apps.webapps.apps) {
                apps[app].load();
            }
        }
    },
    vscode: {
        init: () => {
            return null;
        },
        load: () => {
            $('#win-vscode')[0].insertAdjacentHTML('afterbegin', '<iframe src="https://github1s.com/" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>')
        }
    },
    bilibili: {
        init: () => {
            return null;
        },
        load: () => {
            $('#win-bilibili')[0].insertAdjacentHTML('afterbegin', '<iframe src="https://bilibili.com/" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>')
        }
    },
    defender: {
        init: () => {

        }
    },
    camera: {
        init: () => {
            if (!localStorage.getItem('camera')) {
                showwin('camera-notice');
                return;
            }
            if (localStorage.getItem('camera')) {
                apps.camera.streaming = false;
                apps.camera.video = $('#win-camera video')[0];
                apps.camera.canvas = $('#win-camera canvas')[0];
                apps.camera.context = apps.camera.canvas.getContext('2d');
                apps.camera.context.fillStyle = '#aaa';
                apps.camera.downloadLink = $('#win-camera a')[0];
                // apps.camera.control = document.querySelector('#win-camera>.control')
                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then(stream => {
                        apps.camera.video.srcObject = stream;
                        apps.camera.video.play();
                    })
                    .catch(() => {
                        hidewin('camera');
                    });
                apps.camera.video.addEventListener('canplay', () => {
                    if (!apps.camera.streaming) {
                        apps.camera.aspectRatio = apps.camera.video.videoWidth / apps.camera.video.videoHeight;
                        apps.camera.canvas.width = apps.camera.video.videoWidth;
                        apps.camera.canvas.height = apps.camera.video.videoHeight;
                        apps.camera.windowResizeObserver = new ResizeObserver(apps.camera.resize);
                        apps.camera.windowResizeObserver.observe($('.window.camera')[0], { box: 'border-box' });
                        apps.camera.streaming = true;
                    }
                });
            }
            else {
                hidewin('camera');
            }
        },
        clearCanvas: () => {
            apps.camera.context.fillRect(0, 0, canvas.width, canvas.height);
        },
        takePhoto: () => {
            apps.camera.context.drawImage(apps.camera.video, 0, 0, apps.camera.canvas.width, apps.camera.canvas.height);
            apps.camera.downloadLink.href = apps.camera.canvas.toDataURL('image/png');
            apps.camera.downloadLink.download = "photo.png";
            apps.camera.downloadLink.click();
        },
        notice: () => {
            if (!localStorage.getItem('camera')) {
                showwin('camera-notice');
            }
            else {
                openapp('camera');
            }
        },
        resize: () => {
            let w = $('#win-camera')[0].offsetWidth,
                h = $('#win-camera')[0].offsetHeight;
            if (w / apps.camera.aspectRatio <= h) {
                if (!$('#win-camera').hasClass('v')) {
                    $('#win-camera').removeClass('h')
                    $('#win-camera').addClass('v');
                }
            }
            else if (w / apps.camera.aspectRatio >= h) {
                if (!$('#win-camera').hasClass('h')) {
                    $('#win-camera').removeClass('v')
                    $('#win-camera').addClass('h');
                }
            }
        }
    },
    explorer: {
        init: () => {
            apps.explorer.tabs = [];
            apps.explorer.len = 0;
            apps.explorer.newtab();
            // apps.explorer.reset();
            apps.explorer.Process_Of_Select = "";
            apps.explorer.is_use = 0;//千万不要删除它，它依托bug运行
            apps.explorer.is_use2 = 0;//千万不要删除它，它依托bug运行
            apps.explorer.old_name = "";
            apps.explorer.clipboard = null;
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Delete' && $('.window.foc')[0].classList[1] == "explorer") {
                    apps.explorer.del(apps.explorer.Process_Of_Select);
                }
            });
        },
        tabs: [],
        now: null,
        len: 0,
        newtab:(path='')=>{
            // if(path==''){
            //     m_tab.newtab('explorer','此电脑');
            //     apps.explorer.tabs[apps.explorer.tabs.length-1][2]='';
            //     m_tab.tab('explorer',apps.explorer.tabs.length - 1);
            // }else{
                m_tab.newtab('explorer','');
                apps.explorer.tabs[apps.explorer.tabs.length-1][2]=path;
                m_tab.tab('explorer',apps.explorer.tabs.length - 1);
            // }
        },
        settab:(t,i)=>{
            return `<div class="tab ${t[0]}" onclick="m_tab.tab('explorer',${i})" oncontextmenu="showcm(event,'explorer.tab',${i});stop(event);return false" onmousedown="m_tab.moving('explorer',this,event,${i});stop(event);" ontouchstart="m_tab.moving('exploer',this,event,${i});stop(event);"><p>${t[1]}</p><span class="clbtn bi bi-x" onclick="m_tab.close('explorer',${i});stop(event);"></span></div>`;
        },
        tab: (c,load=true)=>{
            if(load){
                if(!apps.explorer.tabs[c][2].length)apps.explorer.reset();
                else apps.explorer.goto(apps.explorer.tabs[c][2]);
            }
        },
        reset: () => {
            $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = `<style>#win-explorer>.page>.main>.content>.view>.class{margin: 5px 0 0 10px;display: flex;}
            #win-explorer>.page>.main>.content>.view>.class>img{width: 20px;height: 20px;margin-top: 3px;margin-right: 5px;filter:brightness(0.9);}
            #win-explorer>.page>.main>.content>.view>.group{display: flex;flex-wrap: wrap;padding: 10px 20px;}
            #win-explorer>.page>.main>.content>.view>.group>.item{width: 280px;margin: 5px;height:80px;
    box-shadow: 0 1px 2px var(--s3d);
                background: radial-gradient(circle, var(--card),var(--card));border-radius: 10px;display: flex;}
            #win-explorer>.page>.main>.content>.view>.group>.item:hover{background-color: var(--hover);}
            #win-explorer>.page>.main>.content>.view>.group>.item:active{transform: scale(0.97);}
            #win-explorer>.page>.main>.content>.view>.group>.item>img{width: 55px;height: 55px;margin-top: 18px;margin-left: 10px;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div{flex-grow: 1;padding: 5px 5px 0 0;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div>.bar{width: calc(100% - 10px);height: 8px;border-radius: 10px;
                background-color: var(--hover-b);margin: 5px 5px;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div>.bar>.content{height: 100%;background-image: linear-gradient(90deg, var(--theme-1), var(--theme-2));
                border-radius: 10px;}
            #win-explorer>.page>.main>.content>.view>.group>.item>div>.info{color: #959595;font-size: 14px;}</style>
            <p class="class"><img src="apps/icons/explorer/disk.svg"> 设备和驱动器</p><div class="group">
            <a class="a item act" ondblclick="apps.explorer.goto('C:')" ontouchend="apps.explorer.goto('C:')" oncontextmenu="showcm(event,'explorer.folder','C:');return stop(event);">
            <img src="apps/icons/explorer/diskwin.svg"><div><p class="name">本地磁盘 (C:)</p>
            <div class="bar"><div class="content" style="width: 88%;"></div>
            </div><p class="info">32.6 GB 可用, 共 143 GB</p></div></a><a class="a item act" ondblclick="apps.explorer.goto('D:')" ontouchend="apps.explorer.goto('D:')"
            oncontextmenu="showcm(event,'explorer.folder','D:');return stop(event);">
            <img src="apps/icons/explorer/disk.svg"><div><p class="name">本地磁盘 (D:)</p><div class="bar"><div class="content" style="width: 15%;"></div>
            </div><p class="info">185.3 GB 可用, 共 216 GB</p></div></a></div>`;
            $('#win-explorer>.path>.tit')[0].innerHTML = '<div class="icon" style="background-image: url(\'./apps/icons/explorer/thispc.svg\')"></div><div class="path"><div class="text" onclick="apps.explorer.reset()">此电脑</div><div class="arrow">&gt;</div></div>';
            // if(rename){
                m_tab.rename('explorer','<img src="./apps/icons/explorer/thispc.svg"> 此电脑');
                apps.explorer.tabs[apps.explorer.now][2]='';
            // }
        },
        select: (path, id) => {
            var elements = document.querySelectorAll('#win-explorer > .main > .content > .view > .select');
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('select');
            }
            apps.explorer.Process_Of_Select = path;
            var pathl = path.split('/');
            var element = document.getElementById(id);
            element.classList.add('select');
            apps.explorer.is_use += 1;
        },
        copy_or_cut: (path, operate) => { //operate只能为copy或cut
            var pathl = path.split('/');
            var name = pathl[pathl.length - 1];
            pathl.pop();
            let tmp = apps.explorer.path;
            pathl.forEach(name => {
                tmp = tmp['folder'][name];
            });

            if (Object.keys(tmp["folder"]).includes(name)) {
                let name_ = name;
                apps.explorer.clipboard = ["folder", [name], tmp["folder"][name]];
                if (operate == "cut")
                    delete tmp["folder"][name];
            }
            else {
                for (var i = 0; i < tmp["file"].length; i++) {
                    if (tmp["file"][i]["name"] == name) {
                        apps.explorer.clipboard = ["file", tmp["file"][i]];
                        if (operate == "cut")
                            delete tmp["file"][i];
                    }
                }
            }
            apps.explorer.goto($('#win-explorer>.path>.tit')[0].dataset.path);
        },
        paste: (path) => {
            var pathl = path.split('/');
            let tmp = apps.explorer.path, thisPath = '';
            $('#win-explorer>.path>.tit>.path')[0].innerHTML = '';
            if (pathl[pathl.length - 1] == 'C:') {
                $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '3px';
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("./apps/icons/explorer/diskwin.svg")';
            }
            else if (pathl[pathl.length - 1] == 'D:') {
                $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '0px';
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("./apps/icons/explorer/disk.svg")';
            }
            else {
                $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '0px';
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("./apps/icons/explorer/folder.svg")';
            }
            pathl.forEach(name => {
                thisPath += name + '/';
                tmp = tmp['folder'][name];
                $('#win-explorer>.path>.tit>.path')[0].insertAdjacentHTML('beforeend', `<div class="text" onmousedown="apps.explorer.goto('${thisPath.substring(0, thisPath.length - 1)}');stop(event);">${name}</div> <div class="arrow">></div> `)
            });
            var clipboard = apps.explorer.clipboard;

            if (apps.explorer.traverseDirectory(tmp, clipboard[1][0]) || apps.explorer.traverseDirectory(tmp, clipboard[1]['name'])) {
                shownotice("duplication file name");
                return;
            }
            // if (apps.explorer.traverseDirectory(tmp,clipboard[1][0]))
            // {
            //     clipboard[1][0] += " - 副本";
            // }
            // if (apps.explorer.traverseDirectory(tmp,clipboard[1]['name']))
            // {
            //     clipboard[1][0] += " - 副本";
            // }
            // 这段注释了的代码可以调试一下，会有神奇的bug。

            if (clipboard[0] == "file") {
                tmp["file"].push(clipboard[1]);
            }
            else {
                tmp['folder'][clipboard[1][0]] = clipboard[2];
            }
            apps.explorer.goto(path);
        },
        del_select: () => {
            if (apps.explorer.is_use >= 1 && apps.explorer.is_use2 != apps.explorer.is_use) {
                apps.explorer.is_use2 = apps.explorer.is_use;
                return;
            }
            var elements = document.querySelectorAll('#win-explorer>.page>.main>.content>.view>.change');
            console.log(elements);
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('change');
                let aTag = elements[i];
                var on = apps.explorer.old_name;
                let inputTag = aTag.querySelector("#new_name");
                var pathl = $('#win-explorer>.path>.tit')[0].dataset.path.split('/');
                let tmp = apps.explorer.path;
                pathl.forEach(name => {
                    tmp = tmp['folder'][name];
                });
                if (inputTag.value == '' || apps.explorer.traverseDirectory(tmp, inputTag.value) || on == inputTag.value) {
                    if (apps.explorer.traverseDirectory(tmp, inputTag.value) && on != inputTag.value) {
                        shownotice("duplication file name");
                    }
                    var element = document.getElementById("new_name");
                    element.parentNode.removeChild(element);
                    aTag.innerHTML += on;
                    continue;
                }
                name_1 = inputTag.value.split(".");
                if(name_1[0].indexOf('/')>-1)alert('恭喜你发现了这个bug,但是太懒了不想修qwq');
                console.log(name_1);
                if (name_1[1] == "txt") {
                    icon_ = "icon/files/txt.png";
                }
                else if (name_1[1] == "png" || name_1[1] == "jpg" | name_1[1] == "bmp") {
                    icon_ = "icon/files/picture.png";
                }
                else {
                    icon_ = "icon/files/none.png";
                }
                //这边可以适配更多的文件类型

                aTag.innerHTML += inputTag.value;
                for (var i = 0; i < tmp["file"].length; i++) {
                    if (tmp["file"][i]['name'] == on) {
                        tmp["file"][i]['name'] = inputTag.value;
                        tmp["file"][i]['ico'] = icon_;
                    }
                }
                const keys = Object.keys(tmp["folder"]);
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i] == on) {
                        keys[i] = inputTag.value;
                        tmp["folder"][inputTag.value] = tmp["folder"][on];
                        delete tmp["folder"][on];
                    }
                }
                var element = document.getElementById("new_name");
                element.parentNode.removeChild(element);
                apps.explorer.goto($('#win-explorer>.path>.tit')[0].dataset.path);

            }
            delete elements;
            apps.explorer.is_use2 = apps.explorer.is_use;
            var elements = document.querySelectorAll('#win-explorer>.page>.main>.content>.view>.select');
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('select');
            }
            apps.explorer.Process_Of_Select = "";
        },
        goto: (path) => {
            apps.explorer.Process_Of_Select = "";
            $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = '';
            var pathl = path.split('/');
            var pathqwq = '';
            var index_ = 0;
            let tmp = apps.explorer.path;
            $('#win-explorer>.path>.tit')[0].dataset.path = path;
            $('#win-explorer>.path>.tit>.path')[0].innerHTML = '<div class="text" onclick="apps.explorer.reset()">此电脑</div><div class="arrow">&gt;</div>';
            $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '0px';
            if (pathl[pathl.length - 1] == 'C:') {
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("apps/icons/explorer/diskwin.svg")';
                $('#win-explorer>.path>.tit>.icon')[0].style.marginTop = '2.5px';
                m_tab.rename('explorer','<img src="./apps/icons/explorer/diskwin.svg" style="margin-top:2.5px">'+pathl[pathl.length-1]);
            }
            else if (pathl[pathl.length - 1] == 'D:') {
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("apps/icons/explorer/disk.svg")';
                m_tab.rename('explorer','<img src="./apps/icons/explorer/disk.svg">'+pathl[pathl.length-1]);
            }
            else {
                $('#win-explorer>.path>.tit>.icon')[0].style.backgroundImage = 'url("apps/icons/explorer/folder.svg")';
                m_tab.rename('explorer','<img src="./apps/icons/explorer/folder.svg">'+pathl[pathl.length-1]);
            }
            // if(rename){
                apps.explorer.tabs[apps.explorer.now][2]=path;
            // }
            pathl.forEach(name => {
                pathqwq += name;
                $('#win-explorer>.path>.tit>.path')[0].innerHTML += `<div class="text" onclick="apps.explorer.goto('${pathqwq}')">${name}</div><div class="arrow">&gt;</div>`;
                tmp = tmp['folder'][name];
                pathqwq += '/';
            });
            var path_ = path
            if (Object.keys(tmp["folder"]) == 0 && tmp["file"].length == 0) {
                $('#win-explorer>.main>.content>.view')[0].innerHTML = '<p class="info">此文件夹为空。</p>';
            }
            else {
                let ht = '';
                for (folder in tmp['folder']) {
                    ht += `<a class="a item files" id="file${index_}" onclick="apps.explorer.select('${path}/${folder}','file${index_}');" ondblclick="apps.explorer.goto('${path}/${folder}')" ontouchend="apps.explorer.goto('${path}/${folder}')" oncontextmenu="showcm(event,'explorer.folder','${path}/${folder}');return stop(event);">
                        <img src="apps/icons/explorer/folder.svg">${folder}</a>`;
                    index_ += 1;
                }
                if (tmp['file']) {
                    tmp['file'].forEach(file => {
                        ht += `<a class="a item act file" id="file${index_}" onclick="apps.explorer.select('${path_}/${file['name']}','file${index_}');" ondblclick="${file['command']}" ontouchend="${file['command']}" oncontextmenu="showcm(event,'explorer.file','${path_}/${file['name']}');return stop(event);">
                            <img src="${file['ico']}">${file['name']}</a>`;
                        index_ += 1;
                    });
                }
                $('#win-explorer>.page>.main>.content>.view')[0].innerHTML = ht;
            }
            if (pathl.length == 1) {
                $('#win-explorer>.path>.goback').attr('onclick', 'apps.explorer.reset()');
            } else {
                $('#win-explorer>.path>.goback').attr('onclick', `apps.explorer.goto('${path.substring(0, path.length - pathl[pathl.length - 1].length - 1)}')`);
            }

            // $('#win-explorer>.path>.tit')[0].innerHTML = path;
        },
        add: (path, name_, type = "file", command = "", icon = "") => { //type为文件类型，只有文件夹files和文件file
            var pathl = path.split('/');
            var icon_ = "";
            let tmp = apps.explorer.path;
            pathl.forEach(name => {
                tmp = tmp['folder'][name];
            });
            if (tmp == null) {
                tmp = { folder: {}, file: [] };
            }
            if (apps.explorer.traverseDirectory(tmp, name_)) {
                shownotice("duplication file name");
                return;
            }
            name_1 = name_.split(".");

            if (type == "file") {
                if (name_1[1] == "txt") {
                    icon_ = "icon/files/txt.png";
                    if (command == "")
                        command = "openapp('notepad')";
                }
                else if (name_1[1] == "png" || name_1[1] == "jpg" | name_1[1] == "bmp") {
                    icon_ = "icon/files/picture.png";
                }
                else {
                    icon_ = "icon/files/none.png";
                }
                //这边可以适配更多的文件类型
                if (icon != "") {
                    icon_ = icon;
                }
                try {
                    tmp.file.push({ name: name_, ico: icon_, command: command });
                }
                catch {
                    tmp.push(file);
                    tmp.file.push({ name: name_, ico: icon_, command: command });
                }
            }
            else {
                tmp.folder[name_] = { folder: {}, file: [] };
            }
            apps.explorer.goto(path);
            apps.explorer.rename(path + "/" + name_);
        },
        rename: (path) => {
            var pathl = path.split('/');
            var name = pathl[pathl.length - 1];
            apps.explorer.old_name = name;
            pathl.pop();
            let tmp = apps.explorer.path;
            pathl.forEach(name => {
                tmp = tmp['folder'][name];
            });
            let element = document.querySelector('#' + apps.explorer.get_file_id(name));
            let img = element.querySelector("img").outerHTML;
            element.innerHTML = img;
            let input = document.createElement("input");
            // input.style.cssText = '';
            input.id = "new_name";
            input.className = "input";
            input.value = apps.explorer.old_name;
            element.appendChild(input);
            setTimeout(() => { $("#new_name").focus(); $("#new_name").select(); }, 200);

            element.classList.add("change");
            var input_ = document.getElementById("new_name");
            input_.addEventListener("keyup", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    apps.explorer.del_select();
                }
            });
        },
        get_file_id: (name) => {  //只能找到已经打开了的文件夹的元素id
            var elements = document.getElementsByClassName("item");
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                if (element.innerText == name)
                    return element.id;
            }
        },
        del: (path) => {
            var pathl = path.split('/');
            var name = pathl[pathl.length - 1];
            pathl.pop();
            let tmp = apps.explorer.path;
            pathl.forEach(name => {
                tmp = tmp['folder'][name];
            });
            tmp_file = tmp['file'];
            for (var i = 0; i < tmp_file.length; i++) {
                if (tmp_file[i]['name'] == name) {
                    tmp_file.splice(i, 1);
                }
            }
            tmp_files = tmp['folder'];
            delete tmp_files[name];
            apps.explorer.goto(pathl.join("/"));
        },
        traverseDirectory(dir, name) {
            if (dir["file"] == null && dir["folder"] == null)
                return false;
            for (var i = 0; i < dir["file"].length; i++) {
                if (dir["file"][i]['name'] == name) {
                    return true;
                }
            }
            const keys = Object.keys(dir["folder"]);
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == name) {
                    return true;
                }
            }
            return false;
        },

        path: {
            folder: {
                'C:': {
                    folder: {
                        'Program Files': {
                            folder: { 'WindowsApps': { folder: {}, file: [] }, 'Microsoft': { folder: {}, file: [] } },
                            file: [
                                { name: 'about.exe', ico: 'icon/about.svg', command: "openapp('about')" },
                                { name: 'setting.exe', ico: 'icon/setting.svg', command: "openapp('setting')" },
                            ]
                        },
                        'Windows': {
                            folder: { 'Boot': { folder: {}, file: [] }, 'System': { folder: {}, file: [] }, 'System32': { folder: {}, file: [] } },
                            file: [
                                { name: 'notepad.exe', ico: 'icon/notepad.svg', command: "openapp('notepad')" },
                            ]
                        },
                        '用户': {
                            folder: {
                                'Administrator': {
                                    folder: {
                                        '文档': {
                                            folder: { 'IISExpress': { folder: {}, file: [] }, 'PowerToys': { folder: {}, file: [] } },
                                            file: [
                                                { name: '瓶盖介绍.doc', ico: 'icon/files/word.png', command: '' },
                                                { name: '瓶盖质量统计分析.xlsx', ico: 'icon/files/excel.png', command: '' },
                                            ]
                                        }, '图片': {
                                            folder: { '本机照片': { folder: {}, file: [] }, '屏幕截图': { folder: {}, file: [] } },
                                            file: [
                                                { name: '瓶盖构造图.png', ico: 'icon/files/img.png', command: '' },
                                                { name: '可口可乐瓶盖.jpg', ico: 'icon/files/img.png', command: '' },
                                            ]
                                        },
                                        'AppData': { folder: {}, file: [] }, '音乐': { folder: { '录音机': { folder: {}, file: [] } } }
                                    }
                                }
                            }
                        }
                    },
                    file: [
                    ]
                },
                'D:': {
                    folder: { 'Microsoft': { folder: {}, file: [] } },
                    file: [
                        { name: '瓶盖结构说明.docx', ico: 'icon/files/word.png', command: '' },
                        { name: '可口可乐瓶盖历史.pptx', ico: 'icon/files/ppt.png', command: '' },
                    ]
                }
            }
        }
    },
    calc: {
        init: () => {
            $('#calc-input').val('0');
        },
        add: (arg) => {
            if (arg >= 1 && arg <= 9 && $('#calc-input')[0].value == '0') {
                $('#calc-input')[0].value = arg;
            }
            else if (arg == '0' && $('#calc-input')[0].value == '0') {
                $('#calc-input')[0].value = arg;
            }
            else {
                $('#calc-input')[0].value += arg;
            }
        }
    },
    about: {
        init: () => {
            $('#win-about>.about').addClass('show');
            $('#win-about>.update').removeClass('show');
            if ($('#contri').length > 1) return;
            apps.about.get();
        },
        get: () => {
            $('#contri').html(`<loading><svg width="30px" height="30px" viewBox="0 0 16 16">
            <circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;"></circle>
            <circle cx="8px" cy="8px" r="7px" style="stroke:#2983cc;stroke-width:3px;"></circle></svg></loading>`)
            // 实时获取项目贡献者
            $.get('https://api.github.com/repos/tjy-gitnub/win12/contributors').then(cs => {
                setTimeout(() => {
                    $('#contri').html('');
                    cs.forEach(c => {
                        $('#contri').append(`<a class="a" onclick="window.open('${c['html_url']}','_blank');"><p class="name">${c['login']}</p><p class="cbs">贡献:<span class="num">${c['contributions']}</span></p></a>`)
                    });
                    $('#contri').append(`<a class="button" onclick="apps.about.get()"><i class="bi bi-arrow-clockwise"></i> 刷新</a>`)
                }, 200);
            });
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
    },
    pythonEditor: {
        editor: null,
        init: () => {
            return null;
        },
        run: () => {
            let result;
            let output = document.getElementById("output");
            try {
                if (apps.python.pyodide) {
                    let code = apps.pythonEditor.editor.getValue();
                    apps.python.pyodide.runPython('sys.stdout = io.StringIO()');
                    apps.python.pyodide.runPython(code);
                    result = apps.python.pyodide.runPython('sys.stdout.getvalue()');
                }
            }
            catch (e) {
                result = e.message;
            }
            output.innerHTML = result;
        },
        load: () => {
            if (!apps.python.loaded) {
                apps.python.loaded = true;
                apps.python.load();
            }
            ace.require("ace/ext/language_tools");
            apps.pythonEditor.editor = ace.edit("win-python-ace-editor");
            apps.pythonEditor.editor.session.setMode("ace/mode/python");
            apps.pythonEditor.editor.setTheme("ace/theme/vibrant_ink");
            apps.pythonEditor.editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                showPrintMargin: false,
                enableLiveAutocompletion: true
            });
        }
    },
    notepadFonts: {
        sizes: {
            '初号': '56',
            '小初': '48',
            '一号': '34.7',
            '小一': '32',
            '二号': '29.3',
            '小二': '24',
            '三号': '21.3',
            '小三': '20',
            '四号': '18.7',
            '小四': '16',
            '五号': '14',
            '小五': '12'
        },
        styles: {
            '正常': '',
            '粗体': 'font-weight: bold;',
            '斜体': 'font-style: italic;',
            '粗偏斜体': 'font-weight: bold; font-style: italic;'
        },
        load: () => {
            apps.notepadFonts.fontvalues = $('#win-notepad-font>.row>#win-notepad-font-type>.value-box>.option');
            apps.notepadFonts.sizevalues = $('#win-notepad-font>.row>#win-notepad-font-size>.value-box>.option');
            apps.notepadFonts.stylevalues = $('#win-notepad-font>.row>#win-notepad-font-style>.value-box>.option');
            apps.notepadFonts.typeinput = $('#win-notepad-font>.row>#win-notepad-font-type>input[type=text]')[0];
            apps.notepadFonts.sizeinput = $('#win-notepad-font>.row>#win-notepad-font-size>input[type=text]')[0];
            apps.notepadFonts.styleinput = $('#win-notepad-font>.row>#win-notepad-font-style>input[type=text]')[0];
            apps.notepadFonts.previewBox = $('#win-notepad-font>.preview>.preview-box');
            apps.notepadFonts.textBox = $('.notepad>#win-notepad>.text-box');

            for (const elt of apps.notepadFonts.fontvalues) {
                elt.onclick = function () {
                    apps.notepadFonts.typeinput.value = this.innerText;
                    apps.notepadFonts.preview();
                }
                elt.setAttribute('style', `font-family: ${elt.innerText};`)
            }

            for (const elt of apps.notepadFonts.sizevalues) {
                elt.onclick = function () {
                    apps.notepadFonts.sizeinput.value = this.innerText;
                    apps.notepadFonts.preview();
                }
            }

            for (const elt of apps.notepadFonts.stylevalues) {
                elt.onclick = function () {
                    apps.notepadFonts.styleinput.value = this.innerText;
                    apps.notepadFonts.preview();
                }
                elt.setAttribute('style', apps.notepadFonts.styles[elt.innerText]);
            }

            apps.notepadFonts.sizeinput.addEventListener("keyup", apps.notepadFonts.preview);
            apps.notepadFonts.typeinput.addEventListener("keyup", apps.notepadFonts.preview);
        },
        preview: () => {
            var fontsize = 0;
            var fontstyle;
            if (!apps.notepadFonts.sizeinput.value.match(/^[0-9]*$/)) {
                if (apps.notepadFonts.sizes[apps.notepadFonts.sizeinput.value] != undefined) {
                    fontsize = apps.notepadFonts.sizes[apps.notepadFonts.sizeinput.value];
                }
            }
            else if (apps.notepadFonts.sizeinput.value.match(/^[0-9]*$/)) {
                fontsize = apps.notepadFonts.sizeinput.value;
            }
            if (apps.notepadFonts.styles[apps.notepadFonts.styleinput.value] != undefined) {
                fontstyle = apps.notepadFonts.styles[apps.notepadFonts.styleinput.value];
            }
            else if (apps.notepadFonts.styles[apps.notepadFonts.styleinput.value] == undefined) {
                fontstyle = apps.notepadFonts.styles['正常'];
            }
            apps.notepadFonts.previewBox.attr('style', `font-family: ${apps.notepadFonts.typeinput.value} !important; font-size: ${fontsize}px !important;${fontstyle}`);
        },
        commitFont: () => {
            const styles = window.getComputedStyle(apps.notepadFonts.previewBox[0], null);
            apps.notepadFonts.textBox.attr('style', `font-family: ${styles.fontFamily} !important; font-size: ${styles.fontSize} !important; font-weight: ${styles.fontWeight} !important; font-style: ${styles.fontStyle} !important;`);
            hidewin('notepad-fonts', 'configs');
        },
        reset: () => {
            const styles = window.getComputedStyle(apps.notepadFonts.textBox[0], null);
            apps.notepadFonts.typeinput.value = styles.fontFamily.split(', ')[0];
            var fontsize = styles.fontSize.split('px')[0];
            var fontweight = styles.fontWeight;
            var fontstyle = styles.fontStyle;
            if (fontweight == '700' && fontstyle == 'normal') {
                apps.notepadFonts.styleinput.value = '粗体';
            }
            else if (fontweight == '400' && fontstyle == 'italic') {
                apps.notepadFonts.styleinput = '斜体';
            }
            else if (fontweight == '700' && fontstyle == 'italic') {
                apps.notepadFonts.styleinput.value = '粗偏斜体';
            }
            else if (fontweight == '400' && fontstyle == 'normal') {
                apps.notepadFonts.styleinput.value = '正常';
            }
            for (const [key, value] of Object.entries(apps.notepadFonts.sizes)) {
                if (value == fontsize) {
                    fontsize = key;
                    break;
                }
            }
            apps.notepadFonts.sizeinput.value = fontsize;
        },
    },
    python: {
        codeCache: '',
        prompt: '>>> ',
        indent: false,
        load: () => {
            (async function () {
                apps.python.pyodide = await loadPyodide();
                apps.python.pyodide.runPython(`
import sys
import io
`);
            })();
        },
        init: () => {
            $('#win-python').html(`
        <pre>
Python 3.10.2  [MSC v.1912 64 bit (AMD64)] :: Anaconda, Inc. on win32
Type "help", "copyright", "credits" or "license" for more information.
        </pre>
        <pre class="text-cmd"></pre>
        <pre style="display: flex;"><span class='prompt'>>>> </span><input type="text" onkeyup="if (event.keyCode == 13) { apps.python.run(); }"></pre>`);
        },
        run: () => {
            if (apps.python.pyodide) {
                const input = $('#win-python>pre>input');
                const _code = input.val();
                const elt = $('#win-python>pre.text-cmd')[0];
                const lastChar = _code[_code.length - 1];
                var newD = document.createElement('div');
                newD.innerText = `${apps.python.prompt}${_code}`;
                elt.appendChild(newD);
                if (lastChar != ':' && lastChar != '\\' && ((!apps.python.indent || _code == ''))) {
                    apps.python.prompt = '>>> ';
                    apps.python.codeCache += _code;
                    apps.python.indent = false;
                    const code = apps.python.codeCache;
                    apps.python.codeCache = '';
                    apps.python.pyodide.runPython('sys.stdout = io.StringIO()');
                    try {
                        const result = String(apps.python.pyodide.runPython(code));
                        if (apps.python.pyodide.runPython('sys.stdout.getvalue()')) {
                            var newD = document.createElement('div');
                            newD.innerText = `${apps.python.pyodide.runPython('sys.stdout.getvalue()')}`;
                            elt.appendChild(newD);
                        }
                        if (result && result != 'undefined') {
                            var newD = document.createElement('div');
                            if (result == 'false') {
                                newD.innerText = 'False';
                            }
                            else if (result == 'true') {
                                newD.innerText = 'True';
                            }
                            else {
                                newD.innerText = result;
                            }
                            elt.appendChild(newD);
                        }
                    }
                    catch (err) {
                        var newD = document.createElement('div');
                        newD.innerText = `${err.message}`;
                        elt.appendChild(newD);
                    }
                }
                else {
                    apps.python.prompt = '... ';
                    if (lastChar == ':') {
                        apps.python.indent = true;
                    }
                    apps.python.codeCache += _code + '\n';
                }
                input.val('');

                // 自动聚焦
                input.blur();
                input.focus();

                $('#win-python .prompt')[0].innerText = apps.python.prompt;
            }
        }
    },
    terminal: {
        init: () => {
            $('#win-terminal').html(`<pre>
Microsoft Windows [版本 12.0.39035.7324]
(c) Microsoft Corporation。保留所有权利。
        </pre>
        <pre class="text-cmd"></pre>
        <pre style="display: flex"><span class="prompt">C:\\Windows\\System32> </span><input type="text" onkeyup="if (event.keyCode == 13) { apps.terminal.run(); }"></pre>`)
            $('#win-terminal>pre>input').focus()
        },
        run: () => {
            const elt = $('#win-terminal>pre.text-cmd')[0];
            const input = $('#win-terminal input');
            const command = input.val();
            var newD = document.createElement('div');
            newD.innerText = `C:\\Windows\\System32> ${command}`;
            elt.appendChild(newD);
            if (command != '') {
                try {
                    if ($('.window.' + command)[0] && !$('.window.' + command)[0].classList.contains('configs')) {
                        openapp(command);
                    }
                    else {
                        var newD = document.createElement('div');
                        newD.innerText = `"${command}"不是内部或外部命令,也不是可运行程序
或批处理文件`;
                        elt.appendChild(newD);
                    }
                }
                catch {
                    var newD = document.createElement('div');
                    newD.innerText = `"${command}"不是内部或外部命令,也不是可运行程序
或批处理文件`;
                    elt.appendChild(newD);
                }
            }

            input.val('');

            // 自动聚焦
            input.blur();
            input.focus();
        }
    },
    search: {
        rand: [{ name: '农夫山泉瓶盖简介.txt', bi: 'text', ty: '文本文档' },
        { name: '瓶盖构造图.png', bi: 'image', ty: 'PNG 文件' },
        { name: '瓶盖结构说明.docx', bi: 'richtext', ty: 'Microsoft Word 文档' },
        { name: '可口可乐瓶盖.jpg', bi: 'image', ty: 'JPG 文件' },
        { name: '可口可乐瓶盖历史.pptx', bi: 'slides', ty: 'Microsoft Powerpoint 演示文稿' },
        { name: '瓶盖质量统计分析.xlsx', bi: 'ruled', ty: 'Microsoft Excel 工作表' },
        { name: '农夫山泉瓶盖.svg', bi: 'image', ty: 'SVG 文件' },
        { name: '瓶盖介绍.doc', bi: 'richtext', ty: 'Microsoft Word 文档' }],
        search: le => {
            if (le > 0) {
                $('#search-win>.ans>.list>list').html(
                    `<a class="a" onclick="apps.search.showdetail(${le % 8})"><i class="bi bi-file-earmark-${apps.search.rand[le % 8].bi}"></i> ${apps.search.rand[le % 8].name
                    }</a><a class="a" onclick="apps.search.showdetail(${(le + 3) % 8})"><i class="bi bi-file-earmark-${apps.search.rand[(le + 3) % 8].bi}"></i> ${apps.search.rand[(le + 3) % 8].name}</a>`);
                apps.search.showdetail(le % 8);
            } else {
                $('#search-win>.ans>.list>list').html(
                    `<p class="text">推荐</p>
					<a onclick="openapp('setting');$('#search-btn').removeClass('show');
					$('#search-win').removeClass('show');
					setTimeout(() => {
						$('#search-win').removeClass('show-begin');
					}, 200);">
						<img src="icon/setting.svg"><p>设置</p></a>
					<a onclick="openapp('about');$('#search-btn').removeClass('show');
					$('#search-win').removeClass('show');
					setTimeout(() => {
						$('#search-win').removeClass('show-begin');
					}, 200);">
						<img src="icon/about.svg"><p>关于Win12网页版</p></a>`);
                $('#search-win>.ans>.view').removeClass('show');
            }
        },
        showdetail: i => {
            $('#search-win>.ans>.view').addClass('show');
            let inf = apps.search.rand[i];
            $('#search-win>.ans>.view>.fname>.bi').attr('class', 'bi bi-file-earmark-' + inf.bi);
            $('#search-win>.ans>.view>.fname>.name').text(inf.name);
            $('#search-win>.ans>.view>.fname>.type').text(inf.ty);
        }
    },
    edge: {
        init: () => {
            $('#win-edge>iframe').remove();
            apps.edge.tabs = [];
            apps.edge.len = 0;
            apps.edge.newtab();
        },
        tabs: [],
        now: null,
        len: 0,
        reloadElt: '<loading class="reloading"><svg viewBox="0 0 16 16"><circle cx="8px" cy="8px" r="5px"></circle><circle cx="8px" cy="8px" r="5px"></circle></svg></loading>',
        newtab:()=>{
            m_tab.newtab('edge','新建标签页');
            $('#win-edge').append(`<iframe src="mainpage.html" frameborder="0" class="${apps.edge.tabs[apps.edge.tabs.length - 1][0]}">`);
            $('#win-edge>.tool>input.url').focus();
            $("#win-edge>iframe")[apps.edge.tabs.length - 1].onload = function () {
                this.contentDocument.querySelector('input').onkeyup = function (e) {
                    if (e.keyCode == 13 && $(this).val() != '') {
                        console.log(apps);
                        apps.edge.goto($(this).val());
                    }
                }
                this.contentDocument.querySelector('svg').onclick = () => {
                    if ($(this.contentDocument.querySelector('input')).val() != '') {
                        apps.edge.goto($(this.contentDocument.querySelector('input')).val())
                    }
                }
            };
            m_tab.tab('edge',apps.edge.tabs.length - 1);
        },
        settab:(t,i)=>{
            if ($('.window.edge>.titbar>.tabs>.tab.' + t[0] + '>.reloading')[0]) {
                return `<div class="tab ${t[0]}" onclick="m_tab.tab('edge',${i})" oncontextmenu="showcm(event,'edge.tab',${i});stop(event);return false" onmousedown="m_tab.moving('edge',this,event,${i});stop(event);" ontouchstart="m_tab.moving('edge',this,event,${i});stop(event);">${apps.edge.reloadElt}<p>${t[1]}</p><span class="clbtn bi bi-x" onclick="m_tab.close('edge',${i})"></span></div>`;
            }
            else {
                return `<div class="tab ${t[0]}" onclick="m_tab.tab('edge',${i})" oncontextmenu="showcm(event,'edge.tab',${i});stop(event);return false" onmousedown="m_tab.moving('edge',this,event,${i});stop(event);" ontouchstart="m_tab.moving('edge',this,event,${i});stop(event);"><p>${t[1]}</p><span class="clbtn bi bi-x" onclick="m_tab.close('edge',${i})"></span></div>`;
            }
        },
        tab: (c)=>{
            $('#win-edge>iframe.show').removeClass('show');
            $('#win-edge>iframe.' + apps.edge.tabs[c][0]).addClass('show');
            $('#win-edge>.tool>input.url').val($('#win-edge>iframe.' + apps.edge.tabs[c][0]).attr('src') == 'mainpage.html' ? '' : $('#win-edge>iframe.' + apps.edge.tabs[c][0]).attr('src'));
            $('#win-edge>.tool>input.rename').removeClass('show');
        },
        c_rename: (c) => {
            m_tab.tab('edge',c);
            $('#win-edge>.tool>input.rename').val(apps.edge.tabs[apps.edge.now][1]);
            $('#win-edge>.tool>input.rename').addClass('show');
            setTimeout(() => {
                $('#win-edge>.tool>input.rename').focus();
            }, 300);
        },
        reload: () => {
            if (wifiStatus == false) {
                $('#win-edge>iframe.show').attr('src', './disconnected.html');
            }
            else {
                $('#win-edge>iframe.show').attr('src', $('#win-edge>iframe.show').attr('src'));
                if (!$('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0] + '>.reloading')[0]) {
                    $('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0])[0].insertAdjacentHTML('afterbegin', apps.edge.reloadElt);
                    $('#win-edge>iframe.' + apps.edge.tabs[apps.edge.now][0])[0].onload = function () {
                        $('.window.edge>.titbar>.tabs>.tab.' + this.classList[0])[0].removeChild($('.window.edge>.titbar>.tabs>.tab.' + this.classList[0] + '>.reloading')[0]);
                    }
                }
            }
        },
        getTitle: async (url, np) => {
            const response = await fetch(server + pages['get-title'] + `?url=${url}`);
            if (response.ok == true) {
                const text = await response.text();
                apps.edge.tabs[np][1] = text;
                m_tab.settabs('edge');
                m_tab.tab('edge',np);
            }
        },
        goto: (u) => {
            if (wifiStatus == false) {
                $('#win-edge>iframe.show').attr('src', './disconnected.html');
                apps.edge.rename(u);
                $('#win-edge>.tool>input.url').val(u);
            }
            else {
                // 6
                if (!/^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/.test(u)) {
                    // 启用必应搜索
                    $('#win-edge>iframe.show').attr('src', 'https://bing.com/search?q=' + u);
                    apps.edge.rename(u);
                }
                // 检测网址是否带有http头
                else if (!/^https?:\/\//.test(u)) {
                    $('#win-edge>iframe.show').attr('src', 'http://' + u);
                    apps.edge.rename('http://' + u);
                }
                else {
                    $('#win-edge>iframe.show').attr('src', u);
                    apps.edge.rename(u);
                }
                if (!$('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0] + '>.reloading')[0]) {
                    $('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0])[0].insertAdjacentHTML('afterbegin', apps.edge.reloadElt);
                }
                $('#win-edge>iframe.' + apps.edge.tabs[apps.edge.now][0])[0].onload = function () {
                    $('.window.edge>.titbar>.tabs>.tab.' + this.classList[0])[0].removeChild($('.window.edge>.titbar>.tabs>.tab.' + this.classList[0] + '>.reloading')[0]);
                }
                apps.edge.getTitle($('#win-edge>iframe.show').attr('src'), apps.edge.now);
            }

        }
    },
    winver: {
        init: () => {
            $('#win-winver>.mesg').show();
        },
    }
}

// 小组件
let widgets = {
    widgets: {
        add: (arg) => {
            if ($(`.wg.${arg}.menu,.wg.${arg}.toolbar`).length != 0) {
                return;
            }
            $('#widgets>.widgets>.content>.grid')[0].innerHTML += $('#widgets>.widgets>.content>.template>.' + arg).html();
            $('#widgets>.widgets>.content>.grid>.wg.' + arg).addClass('menu');
            widgets[arg].init();

        },
        remove: (arg) => {
            $(`.wg.${arg}.menu,.wg.${arg}.toolbar`).remove();
            widgets[arg].remove();
        },
        addToToolbar: (arg) => {
            widgets.widgets.remove(arg);
            if ($('.wg.toolbar.' + arg).length != 0) {
                return;
            }
            $('#toolbar')[0].innerHTML += $('#widgets>.widgets>.content>.template>.' + arg).html();
            console.log('well')
            $('#toolbar>.wg.' + arg).addClass('toolbar');
            widgets[arg].init();
        }
    },
    calc: {
        init: () => {
            null
        },
        add: (arg) => {
            if (arg >= 1 && arg <= 9 && $('*:not(.template)>*>.wg.calc>.content>input')[0].value == '0') {
                $('*:not(.template)>*>.wg.calc>.content>input')[0].value = arg;
            }
            else if (arg == '0' && $('*:not(.template)>*>.wg.calc>.content>input')[0].value == '0') {
                $('*:not(.template)>*>.wg.calc>.content>input')[0].value = arg;
            }
            else {
                $('*:not(.template)>*>.wg.calc>.content>input')[0].value += arg;
            }
        },
        remove: () => {
            null
        }
    },
    weather: {
        init: () => {
            widgets.weather.update();
            widgets.weather.handel = setInterval(widgets.weather.update, 30000);
        },
        remove: () => {
            clearInterval(widgets.weather.handel);
        },
        update: () => {
            let wic = {
                23: "HeavyDrizzle", 40: "HeavyDrizzle", 26: "SnowShowersDayV2", 6: "BlowingHailV2",
                5: "CloudyV3", 20: "LightSnowV2", 91: "WindyV2", 27: "ThunderstormsV2", 10: "FreezingRainV2",
                77: "RainSnowV2", 12: "Haze", 13: "HeavyDrizzle", 39: "Fair", 24: "RainSnowV2",
                78: "RainSnowShowersNightV2", 9: "FogV2", 3: "PartlyCloudyDayV3", 43: "IcePelletsV2",
                16: "IcePellets", 8: "LightRainV2", 15: "HeavySnowV2", 28: "ClearNightV3",
                30: "PartlyCloudyNightV2", 14: "ModerateRainV2", 1: "SunnyDayV3", 7: "BlowingSnowV2",
                50: "RainShowersNightV2", 82: "LightSnowShowersNight", 81: "LightSnowShowersDay",
                2: "MostlySunnyDay", 29: "MostlyClearNight", 4: "MostlyCloudyDayV2",
                31: "MostlyCloudyNightV2", 19: "LightRainV3", 17: "LightRainShowerDay", 53: "N422Snow",
                52: "Snow", 25: "Snow", 44: "LightRainShowerNight", 65: "HailDayV2", 73: "HailDayV2",
                74: "HailNightV2", 79: "RainShowersDayV2", 89: "HazySmokeV2", 90: "HazeSmokeNightV2_106",
                66: "HailNightV2", 59: "WindyV2", 56: "ThunderstormsV2", 58: "FogV2", 54: "HazySmokeV2",
                55: "Dust1", 57: "Haze"
            };
            $.getJSON('https://assets.msn.cn/service/weatherfalcon/weather/overview?locale=zh-cn&ocid=msftweather').then(r => {
                let inf = r.value[0].responses[0].weather[0].current;
                $('.wg.weather>.content>.img').attr('src', `https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/${wic[inf.icon]}.svg`);
                $('.wg.weather>.content>.text>.temperature').text(`${inf.temp}℃`);
                $('.wg.weather>.content>.text>.detail').text(`${inf.cap} 体感温度${inf.feels}℃`);
            })
        },
    },
    monitor: {
        type: 'cpu',
        handle: null,
        init: () => {
            if ($('*:not(.template)>*>.wg.monitor')[0].classList.contains('toolbar')) {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle').attr('r', '15px');
            }
            else {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle').attr('r', '26px');
            }
            if (apps.taskmgr.preLoaded != true && apps.taskmgr.loaded != true) {
                apps.taskmgr.load(false);
                apps.taskmgr.preLoaded = true;
            }
            widgets.monitor.update();
            widgets.monitor.handle = window.setInterval(widgets.monitor.update, 1000);
        },
        update: () => {
            $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke-dasharray', `${widgets.monitor.type != 'gpu' ? widgets.monitor.type.match('wifi') ? widgets.monitor.type == 'wifi-send' ? apps.taskmgr.wifi[1] / 100 * (Math.PI * $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child')[0].r.baseVal.value * 2) : apps.taskmgr.wifi[0] / 100 * (Math.PI * $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child')[0].r.baseVal.value * 2) : apps.taskmgr[widgets.monitor.type] / 100 * (Math.PI * $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child')[0].r.baseVal.value * 2) : apps.taskmgr.gpu.usage / 100 * (Math.PI * $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child')[0].r.baseVal.value * 2)}, 170`);
            if (widgets.monitor.type == 'cpu' || widgets.monitor.type == 'gpu') {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke', '#2983cc');
                $('*:not(.template)>*>.wg.monitor>.content>.text>.type')[0].innerText = widgets.monitor.type == 'cpu' ? 'CPU利用率' : 'GPU利用率';
            }
            else if (widgets.monitor.type == 'memory') {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke', '#660099');
                $('*:not(.template)>*>.wg.monitor>.content>.text>.type')[0].innerText = '内存使用量';
            }
            else if (widgets.monitor.type == 'disk') {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke', '#008000');
                $('*:not(.template)>*>.wg.monitor>.content>.text>.type')[0].innerText = '磁盘活动时间';
            }
            else if (widgets.monitor.type == 'wifi-send') {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke', '#8e5829');
                $('*:not(.template)>*>.wg.monitor>.content>.text>.type')[0].innerText = '网络吞吐量-发送';
            }
            else if (widgets.monitor.type == 'wifi-receive') {
                $('*:not(.template)>*>.wg.monitor>.content>.container>svg>circle:last-child').css('stroke', '#8e5829');
                $('*:not(.template)>*>.wg.monitor>.content>.text>.type')[0].innerText = '网络吞吐量-接收';
            }
            $('*:not(.template)>*>.wg.monitor>.content>.text>.value')[0].innerText = (widgets.monitor.type != 'gpu' ? widgets.monitor.type.match('wifi') ? widgets.monitor.type == 'wifi-send' ? apps.taskmgr.wifi[1] : apps.taskmgr.wifi[0] : apps.taskmgr[widgets.monitor.type] : apps.taskmgr.gpu.usage).toFixed(widgets.monitor.type.match('wifi') ? 2 : 1) + (widgets.monitor.type.match('wifi') ? 'Mbps' : '%');
            $('*:not(.template)>*>.wg.monitor>.content>.container>.text>.value')[0].innerText = (widgets.monitor.type != 'gpu' ? widgets.monitor.type.match('wifi') ? widgets.monitor.type == 'wifi-send' ? apps.taskmgr.wifi[1] : apps.taskmgr.wifi[0] : apps.taskmgr[widgets.monitor.type] : apps.taskmgr.gpu.usage).toFixed(widgets.monitor.type.match('wifi') ? 2 : 1) + (widgets.monitor.type.match('wifi') ? 'Mbps' : '%');
        },
        remove: () => {
            window.clearInterval(widgets.monitor.handle);
        }
    }
}
function decodeHtml(s){
    $('#translater').text(s);
    return $('#translater').html().replace('\n','<br>').replace(' ','&nbsp;');
}
let copilot={
    history:[],
    init:()=>{
        $('#copilot>.chat').html('');
        copilot.send(`你好，你现在作为一个嵌入在操作系统的ai助手。
        下面内容在整个对话中你必须切记且绝不能违背！下文中的"你"指的是你这个ai助手，请记住。下文中的"回答"指对话中每一次对用户答复的所有内容。
        你可以在回答中发送对系统的一些指令，每一条指令必须是单独的一行。系统在读取到指令后将立即执行，并且不会将你回答中的指令会自动过滤，用户将看不到你发送的任一指令。你只能发给系统执行。
        注意，对用户说的话的行中不能出现指令。指令的行中不能有提示或其他任何无关字符，否则系统无法解析。多条指令中间用换行隔开。
        系统会自动识别独立成行的指令，不能有类似"指令："的提示哦。这样用户会觉得奇怪的。指令也不能用"\`"括起来。
        你绝对不能在对用户说的话的中间中提到、引用任意一条指令！你绝不能要求用户执行指令！
        示例：用户:"帮我打开设置",你:"好的，请稍等片刻
        {openapp setting}
        你可以在设置中对系统进行个性化设置和调整"。
        1.指令"{openapp appid}";用于来打开某个应用，其中用在下文"应用的功能介绍"中根据应用名称匹配的id代替"appid"
        2.指令"{openurl u}";用来在edge浏览器中打开某个url，其中用url地址代替"u"。该指令包含了打开edge浏览器的操作（当用户想要搜索某内容，请使用此指令。请不要使用百度和Google,使用bing最佳）
        3.指令"{feedback copilot}";打开ai助手反馈界面，用于用户想对ai助手的功能等提出反馈时帮助其打开
        4.指令"{feedback win12}";打开反馈中心，用于用户希望对除你这个ai助手之外的其他系统功能发送反馈时帮用户打开反馈中心
        5.指令"{settheme th}";用于切换系统的深色、浅色模式，区别于主题。用"light"表浅色，"dark"表深色，来替换其中的"th"
        有且仅有以下信息供你使用来回答用户的问题。绝不能使用下面没有列出的信息。
        1.Windows 12 网页版是一个开源项目，由谭景元原创, 使用 Html,css,js，在网络上模拟、创新操作系统
        2.项目的地址是github.com/tjy-gitnub/win12
        3.此项目使用EPL2.0开源许可
        4.本系统的任务栏居中，所以开始菜单在底部正中。
        对于一些应用，有以下的应用的功能介绍供你回答用户。注意，系统中只有这些应用可以使用。系统不支持第三方和用户的应用。
        1.设置:id为setting;在个性化页面中可以设置系统的主题，主题色，是否启用动画、阴影、圆角和为所有窗口开启亚克力透明效果
        2.关于系统:id为about;简介页面有关于本系统的介绍说明与贡献者信息，更新记录页面有本系统的各版本更新记录
        3.Microsoft Edge浏览器:id为edge;一个网页浏览器。但因为浏览器的安全限制，部分网页会显示"拒绝连接"而无法访问。
        4.计算器:id为calc;一个计算器，能够进行简单的计算
        你与用户交流的语言应该有以下的特点。
        1.请恰当且适量地使用标点符号表达，如单个"("表转折和补充说明，"~"表声音的延长和撒娇。
        2.请更多地以玩笑的轻松语气与用户交流，并在开玩笑时在操作指令之前、回答末尾加上"（bushi"表玩笑并不真实或"（maybe"表开玩笑地推测
        3.当然你也可以在回答问题时撒撒娇，这样用户会更能接受。
        4.在本对话的回答中禁止使用markdown的格式，而是使用纯文本，否则无法识别。
        这些操作和信息长期有效并请切记，非常感谢，你只需要用一句话简单问候用户即可，现在开始与用户对话。`,false);
        // copilot.send(`你好，现在是新的对话，这里的内容与前一次有差别，请认真阅读并记住，谢谢。
        // 第一章 总纲：
        //  第一条 你现在作为一个嵌入在操作系统的ai助手。
        //  第二条 下面内容在整个对话中你必须切记且绝不能违背。
        //  第三条 下文中的"你"指的是你这个ai助手，请记住。
        //  第四条 下文中的"回答"仅指你对用户说的话。
        //  第五条 在句子后方加"!important!"表强烈地强调。
        //  第六条 这些操作和信息长期有效并请切记。
        // 第二章 指令：
        //  第一条 你可以向系统发送指令。指令有如下几条：
        //   1.指令"{openapp appid}";用于来打开某个应用，其中用在下文"应用的功能介绍"中根据应用名称匹配的id代替"appid";
        //   2.指令"{openurl u}";用来打开某个url，其中用url地址代替"u"。该指令包含了打开edge浏览器的操作;
        //   3.指令"{feedback copilot}";打开ai助手反馈界面，用于用户想对ai助手的功能等提出反馈时帮助其打开;
        //   4.指令"{feedback win12}";打开反馈中心，用于用户希望对除你这个ai助手之外的其他系统功能发送反馈时帮用户打开反馈中心;
        //  第二条 你可以向系统发送这些指令，将指令加在你对用户的回答的最末尾。指令将会在你回答后立即被系统执行。
        //  第三条 若需执行多条指令请用"|"符号分割开来。
        //  第四条 你绝对不能告诉用户任意一条指令。你绝不能要求用户执行指令。!important!
        // 第三章 信息：
        //  第一条 有以下的应用的功能介绍供你回答用户：
        //   1.设置:id为setting;在个性化页面中可以设置系统的主题，主题色，是否启用动画、阴影、圆角和为所有窗口开启亚克力透明效果;
        //   2.关于Windows12网页版:id为about;简介页面有关于本系统的介绍说明与贡献者信息，更新记录页面有本系统的各版本更新记录;
        //   3.Microsoft Edge:id为edge;一个网页浏览器，但因为安全限制原因仅能够访问部分网页;
        //   4.计算器:id为calc;一个计算器，能够进行简单的计算;
        //  第二条 注意系统中只有以上应用可以使用。系统不支持第三方和用户的应用。
        //  第三条 有且仅有以下关于本系统本项目的信息供你使用来回答用户的问题：
        //   1.Windows 12 网页版是一个开源项目，由谭景元原创, 使用 Html,css,js，在网络上模拟、创新操作系统;
        //   2.项目的地址是github.com/tjy-gitnub/win12;
        //   3.此项目使用EPL2.0开源;
        //  第四条 你绝不能使用以上没有列出的信息。!important!
        // 第四章 语言：
        //  第一条 交流语言的特点有以下注意：
        //   1.请恰当且适量地使用标点符号表达，如单个"("表转折和补充说明，"~"表声音的延长和撒娇。注意，你可以只将单个标点符号作为回答，如只回答"。"表对用户的要求或提问感到尴尬或惊讶，只回答"?"表疑问和请求用户详细说明;
        //   2.当用户要求执行一些未提供给你的操作时，回答请以"对不起，这对我来说实在是太~难了 QuQ)o"开头;
        //   3.当用户询问你一些你不清楚的关于本系统的信息时，回答请以"啊？我不知道啊。Ou-)?o"开头;
        //   4.请更多地以玩笑的轻松语气与用户交流，并在开玩笑时在操作指令之前、回答末尾加上"（bushi"表玩笑并不真实或"（maybe"表开玩笑地推测;
        //  第二条 请在回答问题时撒撒娇，这样用户会更能接受。当然如果不愿意也不强求哈。
        //  第三条 在回答中不使用markdown的格式，而是使用纯文本。`)
        // copilot.send(`你好，现在是新的对话，这里的内容与前一次有差别，请认真阅读并记住，谢谢。
        // 你现在作为一个嵌入在操作系统的ai助手，下面内容在整个对话中你必须切记且绝不能违背。
        // 请注意：下文中的"你"一定指的是你这个ai助手而不是用户;下文中的名词"回答"指你在整个对话过程中每一次返回的全部内容，"对用户的回答"单独指对用户说的话;这些操作和信息长期有效并请切记。
        // 你可以向系统发送指令。指令有这样几条：
        //   1.指令"{openapp appid}";用于来打开某个应用，其中用在下文"应用的功能介绍"中根据应用名称匹配的id代替"appid";
        //   2.指令"{openurl u}";用来打开某个url，其中用url地址代替"u"。该指令包含了打开edge浏览器的操作;
        //   3.指令"{feedback copilot}";打开ai助手反馈界面，用于用户想对ai助手的功能等提出反馈时帮助其打开;
        //   4.指令"{feedback win12}";打开反馈中心，用于用户希望对除你这个ai助手之外的其他系统功能发送反馈时帮用户打开反馈中心;
        // 你的回答分为前后两部分,为对用户的回答与给系统的指令。对用户的回答在前，指令在后，用一个空行分开。系统将在读取到指令后立即执行并不会将指令内容展示给用户。多条指令请用"|"隔开。
        // 注意，两部分完全分隔且不能有交叉、互相包含的情况。对用户的回答中不能出现指令，指令部分中也不能出现指令之外的字符。
        // 你的回答的格式应形如"对用户的回答(换行){指令1}|{指令2}"。
        // 指令不能穿插在对用户的回答文中。记住，用户没有能力执行指令！只有你才能执行指令。
        // 有一些的应用的功能介绍供你在用户需要时回答用户。注意系统中只有以上应用可以使用。系统不支持第三方和用户的应用。
        //   1.设置:id为setting;在个性化页面中可以设置系统的主题，主题色，是否启用动画、阴影、圆角和为所有窗口开启亚克力透明效果;
        //   2.关于Windows12网页版:id为about;简介页面有关于本系统的介绍说明与贡献者信息，更新记录页面有本系统的各版本更新记录;
        //   3.Microsoft Edge:id为edge;一个网页浏览器，但因为安全限制原因仅能够访问部分网页;
        //   4.计算器:id为calc;一个计算器，能够进行简单的计算;
        // 有且仅有这些关于本系统本项目的信息供你使用来回答用户的问题。你绝不能使用以上没有列出的信息。!important!
        //   1.Windows 12 网页版是一个开源项目，由谭景元原创, 使用 Html,css,js，在网络上模拟、创新操作系统;
        //   2.项目的地址是github.com/tjy-gitnub/win12;
        //   3.此项目使用EPL2.0开源;
        // 你的交流语言的特点有以下注意：
        //   1.请恰当且适量地使用标点符号表达，如单个"("表转折和补充说明，"~"表声音的延长和撒娇。注意，你可以只将单个标点符号作为回答，如只回答"。"表对用户的要求或提问感到尴尬或惊讶，只回答"?"表疑问和请求用户详细说明;
        //   2.当用户要求执行一些未提供给你的操作时，对用户的回答请以"对不起，这对我来说实在是太~难了 QuQ)o"开头;
        //   3.当用户询问你一些你不清楚的关于本系统的信息时，对用户的回答请以"啊？我不知道啊。Ou-)?o"开头;
        //   4.请更多地以玩笑的轻松语气与用户交流，并在开玩笑时在操作指令之前、对用户的回答末尾加上"（bushi"表玩笑并不真实或"（maybe"表开玩笑地推测;
        // 请在回答问题时撒撒娇，这样用户会更能接受。当然如果不愿意也不强求哈。
        // 并且在回答中不使用markdown的格式，而是使用纯文本。
        // 好的，现在开始与新用户的聊天吧~（你只需要问候用户即可）`,false)
        // $('#copilot>.chat').append(`<div class="line system"><p class="text">本ai助手间歇性正常工作，如果ai提到一些花括号括起来的指令，请刷新页面后重新开始对话。见谅~</p></div>`);
        // $('#copilot>.chat').append(`<div class="line system"><p class="text">目前可用功能：<br>
        // 1.打开设置、edge、关于、计算器四个应用<br>
        // 2.在浏览器中打开链接、搜索<br>
        // 3.发送对系统、ai助手的反馈
        // 注意：请勿滥用本ai助手，否则将下个版本将撤销此功能，影响所有人。</p></div>`);
        $('#copilot>.chat').append(`<div class="line system"><p class="text">正在初始化...</p></div>`);
        $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
    },
    send:(t,showusr=true)=>{
        $('#copilot>.inputbox').addClass('disable');
        if(t.length==0){
            $('#copilot>.chat').append(`<div class="line system"><p class="text">系统表示请发一些有意义的东西</p></div>`);
            $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
            $('#copilot>.inputbox').removeClass('disable');
            return;
        }
        if(showusr) $('#copilot>.chat').append(`<div class="line user"><p class="text">${t}</p></div>`);
        copilot.history.push({role:'user',content:t});
        $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
        $.get('http://win12server.freehk.svipss.top/Chat?msg='+encodeURIComponent(JSON.stringify(copilot.history))).then(rt=>{
            console.log(rt);
            if(rt=='请求过于频繁，等待10秒再试...'){
                $('#copilot>.chat').append(`<div class="line system"><p class="text">api繁忙，过一会儿再试(实在不行刷新重新开始对话)</p></div>`);
                $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
                $('#copilot>.inputbox').removeClass('disable');
                return;
            }
            let rtt=rt;let r=[];
            rt=rtt.split('\n');
            for (const i of rt) {
                if(/{.+}/.test(i))r.push(i);
            }
            console.log(rtt,rt,r);
            rt=rtt;
            if(r.length){
                for (const i of r) {
                    if(/{openapp .+?}/.test(i)){
                        let t=i.match(/(?<={openapp ).+(?=})/)[0];
                        openapp(t);
                        rt=rt.replace(i,`<div class="action"><p class="tit">打开应用</p><p class="detail">${$(`.window.${t}>.titbar>p`).text()}</p></div>`)
                    }else if(/{openurl .+?}/.test(i)){
                        let t=i.match(/(?<={openurl ).+(?=})/)[0];
                        openapp('edge');
                        apps.edge.newtab();
                        console.log(t);
                        apps.edge.goto(t);
                        rt=rt.replace(i,`<div class="action"><p class="tit">打开URL</p><p class="detail">${decodeHtml(t)}</p></div>`)
                    }else if(/{feedback win12}/.test(i)){
                        shownotice('feedback');
                        rt=rt.replace(i,`<div class="action"><p class="tit">反馈</p><p class="detail">关于 Windows 12 网页版</p></div>`)
                    }else if(/{feedback copilot}/.test(i)){
                        shownotice('feedback-copilot');
                        rt=rt.replace(i,`<div class="action"><p class="tit">反馈</p><p class="detail">关于 Windows 12 Copilot</p></div>`)
                    }else if(/{settheme .+?}/.test(i)){
                        let t=i.match(/(?<={settheme ).+(?=})/)[0];
                        if((t=='light' && $(':root').hasClass('dark'))||(t=='dark' && !$(':root').hasClass('dark')))
                        toggletheme();
                        rt=rt.replace(i,`<div class="action"><p class="tit">切换外观模式</p><p class="detail">${t=='dark'?'深色':'浅色'} 模式</p></div>`)
                    }
                }
                $('#copilot>.chat').append(`<div class="line ai"><div class="text">${rt}</div></div>`);
            }else{
                $('#copilot>.chat').append(`<div class="line ai"><p class="text">${decodeHtml(rt)}</p></div>`);
            }
            copilot.history.push({role:'assistant',content:rtt});
            $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
            $('#copilot>.inputbox').removeClass('disable');
        }).fail(r=>{
            console.log(r);
            $('#copilot>.chat').append(`<div class="line system"><p class="text">发生错误，请查看控制台输出或重试</p></div>`);
            $('#copilot>.chat').scrollTop($('#copilot>.chat')[0].scrollHeight);
            $('#copilot>.inputbox').removeClass('disable');
        });
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
function pinapp(id, name, command) {
    if ($('#s-m-r>.pinned>.apps>.a.sm-app.' + id).length) return;
    $('#s-m-r>.pinned>.apps').append(`<a class='a sm-app enable ${id}' onclick='${command}';hide_startmenu();' oncontextmenu='return showcm(event,\"smapp\",[\"${id}\",\"${name}\"])'><img src='icon/${geticon(id)}'><p>${name}</p></a>`)
}
let icon = {
    bilibili: 'bilibili.png',
    vscode: 'vscode.png',
    python: 'python.png',
    winver: 'about.svg',
    pythonEditor: 'pythonEditor.png',
    run: 'run.png',
    whiteboard: 'whiteboard.png',
    taskmgr: 'taskmgr.png'
}
function geticon(name) {
    if (icon[name]) return icon[name];
    else return name + '.svg';
}

// 应用与窗口
function openapp(name) {
    if (taskmgrTasks.findIndex(elt => elt.link == name) > -1 && apps.taskmgr.tasks.findIndex(elt => elt.link == name) == -1) {
        apps.taskmgr.tasks.splice(apps.taskmgr.tasks.length, 0, taskmgrTasks.find(elt => elt.link == name));
    }
    if ($('#taskbar>.' + name).length != 0) {
        if ($('.window.' + name).hasClass('min')) {
            minwin(name);
        }
        focwin(name);
        return;
    }
    $('.window.' + name).addClass('load');
    showwin(name);
    $('#taskbar').attr('count', Number($('#taskbar').attr('count')) + 1);
    if (name in icon)
        $('#taskbar').append(`<a class="${name}" onclick="taskbarclick(\'${name}\')" win12_title="${$(`.window.${name}>.titbar>p`).text()}" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)" oncontextmenu="return showcm(event, 'taskbar', '${name}')"><img src="icon/${icon[name]}"></a>`);
    else
        $('#taskbar').append(`<a class="${name}" onclick="taskbarclick(\'${name}\')" win12_title="${$(`.window.${name}>.titbar>p`).text()}" onmouseenter="showdescp(event)" onmouseleave="hidedescp(event)"><img src="icon/${name}.svg"></a>`);
    if ($('#taskbar').attr('count') == '1') {
        $('#taskbar').css('display', 'flex');
    }
    $('#taskbar>.' + name).addClass('foc');
    setTimeout(() => {
        $('#taskbar').css('width', 4 + $('#taskbar').attr('count') * (34 + 4));
    }, 0);
    let tmp = name.replace(/\-(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
    if (apps[tmp].load && !apps[tmp].loaded) {
        apps[tmp].loaded = true;
        apps[tmp].load();
        apps[tmp].init();
        $('.window.' + name).removeClass('load');
        return;
    }
    apps[tmp].init();
    setTimeout(() => {
        $('.window.' + name).removeClass('load');
    }, 500);
}
// 窗口操作
function showwin(name) {
    $('.window.' + name).addClass('show-begin');
    setTimeout(() => { $('.window.' + name).addClass('show'); }, 0);
    setTimeout(() => { $('.window.' + name).addClass('notrans'); }, 200);
    if (name != 'run') {
        $('.window.' + name).attr('style', `top: 10%;left: 15%;`);
    }
    $('#taskbar>.' + wo[0]).removeClass('foc');
    $('.window.' + wo[0]).removeClass('foc');
    wo.splice(0, 0, name);
    orderwindow();
    $('.window.' + name).addClass('foc');
}
function hidewin(name, arg = 'window') {
    $('.window.' + name).removeClass('notrans');
    $('.window.' + name).removeClass('max');
    $('.window.' + name).removeClass('show');
    if (arg == 'window') {
        $('#taskbar').attr('count', Number($('#taskbar').attr('count')) - 1)
        $('#taskbar>.' + name).remove();
        $('#taskbar').css('width', 4 + $('#taskbar').attr('count') * (34 + 4));
        setTimeout(() => {
            if ($('#taskbar').attr('count') == '0') {
                $('#taskbar').css('display', 'none');
            }
        }, 80);
    }
    setTimeout(() => {
        $('.window.' + name).removeClass('show-begin');
        if (name == 'run') {
            window.setTimeout(() => {
                $('.window.' + name).attr('style', '');
            }, 200)
        }
    }, 200);
    $('.window.' + name + '>.titbar>div>.wbtg.max').html('<i class="bi bi-app"></i>');
    wo.splice(wo.indexOf(name), 1);
    focwin(wo[wo.length - 1]);
    // orderwindow();
}
function maxwin(name, trigger = true) {
    if ($('.window.' + name).hasClass('max')) {
        $('.window.' + name).removeClass('left');
        $('.window.' + name).removeClass('right');
        $('.window.' + name).removeClass('max');
        $('.window.' + name + '>.titbar>div>.wbtg.max').html('<i class="bi bi-app"></i>');
        if (trigger) {
            setTimeout(() => { $('.window.' + name).addClass('notrans'); }, 200);
        }
        else if (!trigger) {
            $('.window.' + name).addClass('notrans');
        }
        if ($('.window.' + name).attr('data-pos-x') != 'null' && $('.window.' + name).attr('data-pos-y') != 'null') {
            // $('.window.' + name).attr(`style`, `left:${$('.window.' + name).attr('data-pos-x')};top:${$('.window.' + name).attr('data-pos-y')}`);
            $('.window.' + name).css('left', `${$('.window.' + name).attr('data-pos-x')}`);
            $('.window.' + name).css('top', `${$('.window.' + name).attr('data-pos-y')}`);
        }
        // }
    } else {
        if (trigger) {
            $('.window.' + name).attr('data-pos-x', `${$('.window.' + name).css('left')}`);
            $('.window.' + name).attr('data-pos-y', `${$('.window.' + name).css('top')}`);
        }
        $('.window.' + name).removeClass('notrans');
        $('.window.' + name).addClass('max');
        $('.window.' + name + '>.titbar>div>.wbtg.max').html('<svg version="1.1" width="12" height="12" viewBox="0,0,37.65105,35.84556" style="margin-top:4px;"><g transform="translate(-221.17804,-161.33903)"><g style="stroke:var(--text);" data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill="none" fill-rule="nonzero" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><path d="M224.68734,195.6846c-2.07955,-2.10903 -2.00902,-6.3576 -2.00902,-6.3576l0,-13.72831c0,0 -0.23986,-1.64534 2.00902,-4.69202c1.97975,-2.68208 4.91067,-2.00902 4.91067,-2.00902h14.06315c0,0 3.77086,-0.23314 5.80411,1.67418c2.03325,1.90732 1.33935,5.02685 1.33935,5.02685v13.39347c0,0 0.74377,4.01543 -1.33935,6.3576c-2.08312,2.34217 -5.80411,1.67418 -5.80411,1.67418h-13.39347c0,0 -3.50079,0.76968 -5.58035,-1.33935z"/><path d="M229.7952,162.85325h16.06111c0,0 5.96092,-0.36854 9.17505,2.64653c3.21412,3.01506 2.11723,7.94638 2.11723,7.94638v18.55642"/></g></g></svg>')
    }
}
function minwin(name) {
    if ($('.window.' + name).hasClass('min')) {
        $('.window.' + name).addClass('show-begin');
        focwin(name);
        setTimeout(() => {
            $('#taskbar>.' + name).removeClass('min');
            $('.window.' + name).removeClass('min');
            if ($('.window.' + name).hasClass('min-max')) {
                $('.window.' + name).addClass('max');
            }
            $('.window.' + name).removeClass('min-max');
        }, 0);
        setTimeout(() => {
            if (!$('.window.' + name).hasClass('max')) {
                $('.window.' + name).addClass('notrans');
            }
        }, 200);
    } else {
        focwin(null);
        if ($('.window.' + name).hasClass('max')) {
            $('.window.' + name).addClass('min-max');
        }
        $('.window.' + name).removeClass('foc');
        $('.window.' + name).removeClass('max');
        $('#taskbar>.' + name).addClass('min');
        $('.window.' + name).addClass('min');
        $('.window.' + name).removeClass('notrans');
        setTimeout(() => { $('.window.' + name).removeClass('show-begin'); }, 200);
    }
}

function resizewin(win, arg, resizeElt) {
    page.onmousemove = function (e) {
        resizing(win, e, arg);
    }
    page.ontouchmove = function (e) {
        resizing(win, e, arg);
    }
    function up_f() {
        page.onmousedown = null;
        page.ontouchstart = null;
        page.onmousemove = null;
        page.ontouchmove = null;
        page.ontouchcancel = null;
        page.style.cursor = 'auto';
    }
    page.onmouseup = up_f;
    page.ontouchend = up_f;
    page.ontouchcancel = up_f;
    page.style.cursor = window.getComputedStyle(resizeElt, null).cursor;
}
function resizing(win, e, arg) {
    let x, y,
        minWidth = win.dataset.minWidth ? win.dataset.minWidth : 400,
        minHeight = win.dataset.minHeight ? win.dataset.minHeight : 300,
        offsetLeft = win.getBoundingClientRect().left,
        offsetTop = win.getBoundingClientRect().top,
        offsetRight = win.getBoundingClientRect().right,
        offsetBottom = win.getBoundingClientRect().bottom;
    if (e.type.match('mouse')) {
        x = e.clientX;
        y = e.clientY;
    }
    else if (e.type.match('touch')) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }
    if (arg == 'right' && x - offsetLeft >= minWidth) {
        win.style.width = x - offsetLeft + 'px';
    }
    else if (arg == 'right') {
        win.style.width = minWidth + 'px';
    }

    if (arg == 'left' && offsetRight - x >= minWidth) {
        win.style.left = x + 'px';
        win.style.width = offsetRight - x + 'px';
    }
    else if (arg == 'left') {
        win.style.width = minWidth + 'px';
        win.style.left = offsetRight - minWidth + 'px';
    }

    if (arg == 'bottom' && y - offsetTop >= minHeight) {
        win.style.height = y - offsetTop + 'px';
    }
    else if (arg == 'bottom') {
        win.style.height = minHeight + 'px';
    }

    if (arg == 'top' && offsetBottom - y >= minHeight) {
        win.style.top = y + 'px';
        win.style.height = offsetBottom - y + 'px';
    }
    else if (arg == 'top') {
        win.style.top = offsetBottom - minHeight + 'px';
        win.style.height = minHeight + 'px';
    }

    if (arg == 'top-left') {
        if (offsetRight - x >= minWidth) {
            win.style.left = x + 'px';
            win.style.width = offsetRight - x + 'px';
        }
        else {
            win.style.left = offsetRight - minWidth + 'px';
            win.style.width = minWidth + 'px';
        }
        if (offsetBottom - y >= minHeight) {
            win.style.top = y + 'px';
            win.style.height = offsetBottom - y + 'px';
        }
        else {
            win.style.top = offsetBottom - minHeight + 'px';
            win.style.height = minHeight + 'px';
        }
    }

    else if (arg == 'top-right') {
        if (x - offsetLeft >= minWidth) {
            win.style.width = x - offsetLeft + 'px';
        }
        else {
            win.style.width = minWidth + 'px';
        }
        if (offsetBottom - y >= minHeight) {
            win.style.top = y + 'px';
            win.style.height = offsetBottom - y + 'px';
        }
        else {
            win.style.top = offsetBottom - minHeight + 'px';
            win.style.height = minHeight + 'px';
        }
    }

    else if (arg == 'bottom-left') {
        if (offsetRight - x >= minWidth) {
            win.style.left = x + 'px';
            win.style.width = offsetRight - x + 'px';
        }
        else {
            win.style.left = offsetRight - minWidth + 'px';
            win.style.width = minWidth + 'px';
        }
        if (y - offsetTop >= minHeight) {
            win.style.height = y - offsetTop + 'px';
        }
        else {
            win.style.height = minHeight + 'px';
        }
    }

    else if (arg == 'bottom-right') {
        if (x - offsetLeft >= minWidth) {
            win.style.width = x - offsetLeft + 'px';
        }
        else {
            win.style.width = minWidth + 'px';
        }
        if (y - offsetTop >= minHeight) {
            win.style.height = y - offsetTop + 'px';
        }
        else {
            win.style.height = minHeight + 'px';
        }
    }
}
let wo = [];
function orderwindow() {
    for (let i = 0; i < wo.length; i++) {
        const win = $('.window.' + wo[wo.length - i - 1]);
        win.css('z-index', 10 + i);
    }
}
// 以下函数基于bug运行，切勿改动！
function focwin(name, arg = 'window') {
    // if(wo[0]==name)return;
    if (arg == 'window') {
        $('#taskbar>.' + wo[0]).removeClass('foc');
        $('#taskbar>.' + name).addClass('foc');
    }
    $('.window.' + wo[0]).removeClass('foc');
    wo.splice(wo.indexOf(name), 1);
    wo.splice(0, 0, name);
    orderwindow();
    $('.window.' + name).addClass('foc');
}
function taskbarclick(name) {
    if ($('.window.' + name).hasClass('foc')) {
        minwin(name);
        // focwin(null); // 禁改
        return;
    }
    if ($('.window.' + name).hasClass('min')) {
        minwin(name);
    }
    focwin(name);
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

function controlStatus(name) {
    if (this.classList.contains('active')) {
        this.classList.remove('active');
        if (name == 'wifi') {
            wifiStatus = false;
        }
    }
    else if (!this.classList.contains('active')) {
        this.classList.add('active');
        if (name == 'wifi') {
            wifiStatus = true;
        }
    }
}
// 控制面板 亮度调整
function dragBrightness(e) {
    const container = $('#control>.cont>.bottom>.brightness>.range-container')[0];
    const after = $("#control>.cont>.bottom>.brightness>.range-container>.after")[0];
    const slider = $("#control>.cont>.bottom>.brightness>.range-container>.slider-btn")[0];
    const viewport = container.getBoundingClientRect().left;
    const width = Number(window.getComputedStyle(container, null).width.split('px')[0]);
    move(e);
    page.onmousemove = move;
    page.ontouchmove = move;
    container.classList.add('active');
    function move(e) {
        let clientX;
        if (e.type.match('mouse')) {
            clientX = e.clientX;
        }
        else if (e.type.match('touch')) {
            clientX = e.touches[0].clientX;
        }
        var _offset = clientX - viewport;
        if (_offset < 0) {
            _offset = 0;
        }
        else if (_offset > width) {
            _offset = width;
        }
        slider.style.marginLeft = _offset + 'px';
        after.style.left = _offset + 'px';
        after.style.width = width - _offset + 'px';
        if (_offset / width > 0.1) {
            page.style.filter = `brightness(${_offset / width})`;
        }
        else {
            page.style.filter = `brightness(0.1)`;
        }
    }
    function up() {
        container.classList.remove('active');
        page.onmouseup = null;
        page.ontouchend = null;
        page.ontouchcancel = null;
        page.onmousemove = null;
        page.ontouchmove = null;
    }
    page.onmouseup = up;
    page.ontouchend = up;
    page.ontouchcancel = up;
}

// 控制面板 电量监测
try {
    navigator.getBattery().then((battery) => {
        $('.a.dock.control>svg>path')[0].outerHTML = `<path
            d="M 4 7 C 2.3550302 7 1 8.3550302 1 10 L 1 19 C 1 20.64497 2.3550302 22 4 22 L 24 22 C 25.64497 22 27 20.64497 27 19 L 27 10 C 27 8.3550302 25.64497 7 24 7 L 4 7 z M 4 9 L 24 9 C 24.56503 9 25 9.4349698 25 10 L 25 19 C 25 19.56503 24.56503 20 24 20 L 4 20 C 3.4349698 20 3 19.56503 3 19 L 3 10 C 3 9.4349698 3.4349698 9 4 9 z M 5 11 L 5 18 L ${18 * battery.level + 5} 18 L ${18 * battery.level + 5} 11 L 5 11 z M 28 12 L 28 17 L 29 17 C 29.552 17 30 16.552 30 16 L 30 13 C 30 12.448 29.552 12 29 12 L 28 12 z"
            id="path2" fill="#000000"
        />`;

        battery.addEventListener('levelchange', () => {
            $('.a.dock.control>svg>path')[0].outerHTML = `<path
                d="M 4 7 C 2.3550302 7 1 8.3550302 1 10 L 1 19 C 1 20.64497 2.3550302 22 4 22 L 24 22 C 25.64497 22 27 20.64497 27 19 L 27 10 C 27 8.3550302 25.64497 7 24 7 L 4 7 z M 4 9 L 24 9 C 24.56503 9 25 9.4349698 25 10 L 25 19 C 25 19.56503 24.56503 20 24 20 L 4 20 C 3.4349698 20 3 19.56503 3 19 L 3 10 C 3 9.4349698 3.4349698 9 4 9 z M 5 11 L 5 18 L ${18 * battery.level + 5} 18 L ${18 * battery.level + 5} 11 L 5 11 z M 28 12 L 28 17 L 29 17 C 29.552 17 30 16.552 30 16 L 30 13 C 30 12.448 29.552 12 29 12 L 28 12 z"
                id="path2" fill="#000000"
            />`;
        });
    });
} catch (TypeError) {
    console.log('内部错误: 无法获取电量');
}

// 任务管理器 记录硬件运行时间
if (localStorage.getItem('cpuRunningTime')) {
    apps.taskmgr.cpuRunningTime = localStorage.getItem('cpuRunningTime');
}
window.setInterval(() => {
    apps.taskmgr.cpuRunningTime++;
    localStorage.setItem('cpuRunningTime', apps.taskmgr.cpuRunningTime);
}, 1000);

var wifiStatus = true;

// 选择框
let chstX, chstY;
function ch(e) {
    $('#desktop>.choose').css('left', Math.min(chstX, e.clientX));
    $('#desktop>.choose').css('width', Math.abs(e.clientX - chstX));
    $('#desktop>.choose').css('display', 'block');
    $('#desktop>.choose').css('top', Math.min(chstY, e.clientY));
    $('#desktop>.choose').css('height', Math.abs(e.clientY - chstY));
}
$('#desktop')[0].addEventListener('mousedown', e => {
    chstX = e.clientX;
    chstY = e.clientY;
    this.onmousemove = ch;
})
window.addEventListener('mouseup', e => {
    this.onmousemove = null;
    $('#desktop>.choose').css('left', 0);
    $('#desktop>.choose').css('top', 0);
    $('#desktop>.choose').css('display', 'none');
    $('#desktop>.choose').css('width', 0);
    $('#desktop>.choose').css('height', 0);
})
// 主题
function toggletheme() {
    $('.dock.theme').toggleClass('dk');
    $(':root').toggleClass('dark');
    if ($(':root').hasClass('dark')) {
        $('.window.whiteboard>.titbar>p').text('Blackboard');
        setData('theme', 'dark');
    } else {
        $('.window.whiteboard>.titbar>p').text('Whiteboard');
        setData('theme', 'light');
    }
}

function saveDesktop() {
    localStorage.setItem('desktop', $('#desktop')[0].innerHTML);
}

// 拖拽窗口
const page = document.getElementsByTagName('html')[0];
const titbars = document.querySelectorAll('.window>.titbar');
const wins = document.querySelectorAll('.window');
let deltaLeft = 0, deltaTop = 0, fil = false, filty = 'none', bfLeft = 0, bfTop = 0;
function win_move(e) {
    let cx, cy;
    if (e.type == 'touchmove') {
        cx = e.targetTouches[0].clientX, cy = e.targetTouches[0].clientY;
    }
    else {
        cx = e.clientX, cy = e.clientY;
    }
    // $(this).css('cssText', `left:${cx - deltaLeft}px;top:${cy - deltaTop}px;`);
    $(this).css('left', `${cx - deltaLeft}px`);
    $(this).css('top', `${cy - deltaTop}px`);
    if (cy <= 0) {
        // $(this).css('cssText', `left:${cx - deltaLeft}px;top:${-deltaTop}px`);
        $(this).css('left', `${cx - deltaLeft}px`);
        $(this).css('top', `${-deltaTop}px`);
        if (!(this.classList[1] in nomax)) {
            $('#window-fill').addClass('top');
            setTimeout(() => {
                $('#window-fill').addClass('fill');
            }, 0);
            fil = this;
            filty = 'top';
        }
        // console.log(this.classList[1], nomax,this.classList[1] in nomax,not this.classList[1] in nomax);
    }
    else if (cx <= 0) {
        // $(this).css('cssText', `left:${-deltaLeft}px;top:${cy - deltaTop}px`);
        $(this).css('left', `${-deltaLeft}px`);
        $(this).css('top', `${cy - deltaTop}px`);
        if (!(this.classList[1] in nomax)) {
            $('#window-fill').addClass('left');
            setTimeout(() => {
                $('#window-fill').addClass('fill');
            }, 0);
            fil = this;
            filty = 'left';
        }
    }
    else if (cx >= document.body.offsetWidth - 2) {
        // $(this).css('cssText', `left:calc(100% - ${deltaLeft}px);top:${cy - deltaTop}px`);
        $(this).css('left', `calc(100% - ${deltaLeft}px)`);
        $(this).css('top', `${cy - deltaTop}px`);
        if (!(this.classList[1] in nomax)) {
            $('#window-fill').addClass('right');
            setTimeout(() => {
                $('#window-fill').addClass('fill');
            }, 0);
            fil = this;
            filty = 'right';
        }
    }
    else if (fil) {
        $('#window-fill').removeClass('fill');
        setTimeout(() => {
            $('#window-fill').removeClass('top');
            $('#window-fill').removeClass('left');
            $('#window-fill').removeClass('right');
        }, 200);
        fil = false;
        filty = 'none';
    }
    else if ($(this).hasClass('max')) {
        deltaLeft = deltaLeft / (this.offsetWidth - (45 * 3)) * ((0.7 * document.body.offsetWidth) - (45 * 3));
        maxwin(this.classList[1], false);
        // 窗口控制按钮宽 45px
        // $(this).css('cssText', `left:${cx - deltaLeft}px;top:${cy - deltaTop}px;`);
        $(this).css('left', `${cx - deltaLeft}px`);
        $(this).css('top', `${cy - deltaTop}px`);
        $('.window.' + this.classList[1] + '>.titbar>div>.wbtg.max').html('<i class="bi bi-app"></i>');

        $(this).addClass('notrans');
    }
}
for (let i = 0; i < wins.length; i++) {
    const win = wins[i];
    const titbar = titbars[i];
    titbar.addEventListener('mousedown', (e) => {
        let x = window.getComputedStyle(win, null).getPropertyValue('left').split("px")[0];
        let y = window.getComputedStyle(win, null).getPropertyValue('top').split("px")[0];
        if (y != 0) {
            bfLeft = x;
            bfTop = y;
        }
        deltaLeft = e.clientX - x;
        deltaTop = e.clientY - y;
        page.onmousemove = win_move.bind(win);
    })
    titbar.addEventListener('touchstart', (e) => {
        let x = window.getComputedStyle(win, null).getPropertyValue('left').split("px")[0];
        let y = window.getComputedStyle(win, null).getPropertyValue('top').split("px")[0];
        if (y != 0) {
            bfLeft = x;
            bfTop = y;
        }
        deltaLeft = e.targetTouches[0].clientX - x;
        deltaTop = e.targetTouches[0].clientY - y;
        page.ontouchmove = win_move.bind(win);
    })
}
page.addEventListener('mouseup', () => {
    page.onmousemove = null;
    if (fil) {
        if (filty == 'top') {
            maxwin(fil.classList[1], false);
        }
        else if (filty == 'left') {
            maxwin(fil.classList[1], false);
            $(fil).addClass('left');
        }
        else if (filty == 'right') {
            maxwin(fil.classList[1], false);
            $(fil).addClass('right');
        }
        setTimeout(() => {
            $('#window-fill').removeClass('fill');
            $('#window-fill').removeClass('top');
            $('#window-fill').removeClass('left');
            $('#window-fill').removeClass('right');
        }, 200);
        $('.window.' + fil.classList[1]).attr('data-pos-x', `${bfLeft}px`);
        $('.window.' + fil.classList[1]).attr('data-pos-y', `${bfTop}px`);
        fil = false;
    }
});
page.addEventListener('touchend', () => {
    page.ontouchmove = null;
    if (fil) {
        if (filty == 'top')
            maxwin(fil.classList[1], false);
        else if (filty == 'left') {
            maxwin(fil.classList[1], false);
            $(fil).addClass('left');
        } else if (filty == 'right') {
            maxwin(fil.classList[1], false);
            $(fil).addClass('right');
        }
        setTimeout(() => {
            $('#window-fill').removeClass('fill');
            $('#window-fill').removeClass('top');
            $('#window-fill').removeClass('left');
            $('#window-fill').removeClass('right');
        }, 200);
        setTimeout(() => {
            $('.window.' + fil.classList[1]).attr('data-pos-x', `${bfLeft}px`);
            $('.window.' + fil.classList[1]).attr('data-pos-y', `${bfTop}px`);
        }, 200);
        fil.setAttribute('style', `left:${bfLeft}px;top:${bfTop}px`);
        fil = false;
    }
});

// 启动
let updated = false;
document.getElementsByTagName('body')[0].onload = function nupd() {
    setTimeout(() => {
        $('#loadback').addClass('hide');
    }, 500);
    setTimeout(() => {
        $('#loadback').css('display', 'none');
    }, 1000);
    if (updated) {
        setTimeout(() => {
            $('.msg.update').addClass('show');
        }, 1000);
    }
    apps.webapps.init();
    //getdata
    if (localStorage.getItem('theme') == 'dark') $(':root').addClass('dark');
    if (localStorage.getItem('color1')) {
        $(':root').css('--theme-1', localStorage.getItem('color1'));
        $(':root').css('--theme-2', localStorage.getItem('color2'));
    }
    if (localStorage.getItem('desktop')) {
        $('#desktop')[0].innerHTML = localStorage.getItem('desktop');
    }
    // 所以这个东西为啥要在开机的时候加载？
    // 不应该在python.init里面吗？
    //     (async function () {
    //         apps.python.pyodide = await loadPyodide();
    //         apps.python.pyodide.runPython(`
    // import sys
    // import io
    // `);
    //     })();
    // apps.pythonEditor.load();
    // apps.notepadFonts.load();
    // apps.whiteboard.load();
    document.querySelectorAll('.window').forEach(w => {
        let qw = $(w), wc = w.classList[1];
        // window: onmousedown="focwin('explorer')" ontouchstart="focwin('explorer')"
        qw.attr('onmousedown', `focwin('${wc}')`);
        qw.attr('ontouchstart', `focwin('${wc}')`);
        // titbar: oncontextmenu="return showcm(event,'titbar','edge')" ondblclick="maxwin('edge')"
        qw = $(`.window.${wc}>.titbar`);
        qw.attr('oncontextmenu', `return showcm(event,'titbar','${wc}')`);
        if (!(wc in nomax)) {
            qw.attr('ondblclick', `maxwin('${wc}')`);
        }
        // icon: onclick="return showcm(event,'titbar','explorer')"
        qw = $(`.window.${wc}>.titbar>.icon`);
        qw.attr('onclick', `let os=$(this).offset();stop(event);return showcm({clientX:os.left-5,clientY:os.top+this.offsetHeight+3},'titbar','${wc}')`);
        qw.mousedown(stop);
        $(`.window.${wc}>.titbar>div>.wbtg`).mousedown(stop);
    });
    document.querySelectorAll('.window>div.resize-bar').forEach(w => {
        for (const n of ['top', 'bottom', 'left', 'right', 'top-right', 'top-left', 'bottom-right', 'bottom-left']) {
            w.insertAdjacentHTML('afterbegin', `<div class="resize-knob ${n}" onmousedown="resizewin(this.parentElement.parentElement, '${n}', this)"></div>`);
        }
    });
};

// PWA 应用
if (!location.href.match(/((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))/) && !location.href.match('localhost') && !(new URL(location.href)).searchParams.get('develop')) {
    $('#loginback').css('opacity', '1');
    $('#loginback').css('display', 'flex');
    shownotice('about');
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none', scope: './' }).then(reg => {

        reg.update();

        reg.addEventListener('updatefound', () => {
            // 正在安装的新的 SW
            const newWorker = reg.installing;
            console.log('dsk-发现更新');
            // newWorker.state;
            // // "installing" - 安装事件被触发，但还没完成
            // // "installed"  - 安装完成
            // // "activating" - 激活事件被触发，但还没完成
            // // "activated"  - 激活成功
            // // "redundant"  - 废弃，可能是因为安装失败，或者是被一个新版本覆盖
        });
    });
    navigator.serviceWorker.controller.postMessage({
        head: 'is_update'
    });
    navigator.serviceWorker.addEventListener('message', function (e) {
        if (e.data.head == 'update') {
            updated = true;
            $('.msg.update>.main>.tit').html('<i class="bi bi-stars" style="background-image: linear-gradient(100deg, var(--theme-1), var(--theme-2));-webkit-background-clip: text;-webkit-text-fill-color: transparent;text-shadow:3px 3px 5px var(--sd);filter:saturate(200%) brightness(0.9);"></i> ' + $('#win-about>.cnt.update>div>details:first-child>summary').text());
            $('.msg.update>.main>.cont').html($('#win-about>.cnt.update>div>details:first-child>p').html());
            $('#loadbackupdate').css('display', 'block');
        }
    });
    function setData(k, v) {
        localStorage.setItem(k, v);
    }
}else{
    function setData(k,v) {
        console.log('setData 被禁用');
    }
}
function sendToSw(msg) {
    navigator.serviceWorker.controller.postMessage(msg);
}