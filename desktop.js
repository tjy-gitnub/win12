class FileSystem {
    constructor() {
        if (localStorage.getItem('fileSystem')) {
            this.root = JSON.parse(localStorage.getItem('fileSystem'));
            this.convertToMap(this.root);
        } else {
            this.root = { type: 'dir', children: new Map() };
        }
        this.currentDir = this.root;
        this.directoryMap = new Map();
        this.directoryMap.set('/', this.root);
    }

    convertToObj(dir) {
        if (dir.type === 'dir') {
            const children = Array.from(dir.children);
            dir.children = {};
            for (const [name, child] of children) {
                dir.children[name] = child;
                convertToObj(child);
            }
        }
    }


    convertToMap(dir) {
        if (dir.type === 'dir') {
            dir.children = new Map(Object.entries(dir.children));
            for (let child of dir.children.values()) {
                convertToMap(child);
            }
        }
    }

    mkdir(path) {
        let dirs = path.split('/').filter(Boolean);
        let currentDir = this.currentDir;
        let currentPath = '';
        for (let dir of dirs) {
            currentPath += `/${dir}`;
            let found = currentDir.children.get(dir);
            if (!found) {
                found = { name: dir, type: 'dir', children: new Map() };
                currentDir.children.set(dir, found);
                this.directoryMap.set(currentPath, found);
            }
            currentDir = found;
        }
    }

    touch(path, content) {
        let dirs = path.split('/').filter(Boolean);
        let fileName = dirs.pop();
        let currentDir = this.currentDir;
        let currentPath = '';
        for (let dir of dirs) {
            currentPath += `/${dir}`;
            let found = currentDir.children.get(dir);
            if (!found) {
                found = { name: dir, type: 'dir', children: new Map() };
                currentDir.children.set(dir, found);
                this.directoryMap.set(currentPath, found);
            }
            currentDir = found;
        }
        let file = currentDir.children.get(fileName);
        if (!file) {
            file = { name: fileName, type: 'file' };
            currentDir.children.set(fileName, file);
        }
        file.content = content;
    }
    cat(path) {
        let dirs = path.split('/').filter(Boolean);
        let fileName = dirs.pop();
        let currentDir = this.currentDir;
        for (let dir of dirs) {
            let found = currentDir.children.get(dir);
            if (!found) {
                return null;
            }
            currentDir = found;
        }
        let file = currentDir.children.get(fileName);
        return file && file.content;
    }

    rm(path) {
        let dirs = path.split('/').filter(Boolean);
        let fileName = dirs.pop();
        let currentDir = this.currentDir;
        for (let dir of dirs) {
            let found = currentDir.children.get(dir);
            if (!found) {
                return null;
            }
            currentDir = found;
        }
        currentDir.children.delete(fileName);
    }

    ls() {
        return Array.from(this.currentDir.children.keys());
    }

    cd(path) {
        let dirs = path.split('/').filter(Boolean);
        let currentDir = this.currentDir;
        for (let dir of dirs) {
            let found = currentDir.children.get(dir);
            if (!found) {
                return null;
            }
            currentDir = found;
        }
        this.currentDir = currentDir;
    }

    mv(oldPath, newPath) {
        let oldDirs = oldPath.split('/').filter(Boolean);
        let oldFileName = oldDirs.pop();
        let oldCurrentDir = this.currentDir;
        for (let dir of oldDirs) {
            let found = oldCurrentDir.children.get(dir);
            if (!found) {
                return null;
            }
            oldCurrentDir = found;
        }
        let file = oldCurrentDir.children.get(oldFileName);
        if (!file) {
            return null;
        }
        this.rm(oldPath);
        this.touch(newPath, file.content);
    }

    rename(oldPath, newName) {
        let oldDirs = oldPath.split('/').filter(Boolean);
        let oldFileName = oldDirs.pop();
        let oldCurrentDir = this.currentDir;
        for (let dir of oldDirs) {
            let found = oldCurrentDir.children.get(dir);
            if (!found) {
                return null;
            }
            oldCurrentDir = found;
        }
        let file = oldCurrentDir.children.get(oldFileName);
        if (!file) {
            return null;
        }
        file.name = newName;
    }

    cp(oldPath, newPath) {
        let oldDirs = oldPath.split('/').filter(Boolean);
        let oldFileName = oldDirs.pop();
        let oldCurrentDir = this.currentDir;
        for (let dir of oldDirs) {
            let found = oldCurrentDir.children.get(dir);
            if (!found) {
                return null;
            }
            oldCurrentDir = found;
        }
        let file = oldCurrentDir.children.get(oldFileName);
        if (!file) {
            return null;
        }
        this.touch(newPath, file.content);
    }

    renameDir(oldPath, newName) {
        let oldDirs = oldPath.split('/').filter(Boolean);
        let oldDirName = oldDirs.pop();
        let currentPath = '';
        for (let dir of dirs) {
            currentPath += `/${dir}`;
            currentDir = this.directoryMap.get(currentPath);
            if (!currentDir) {
                return null;
            }
        }
    }
    getDirectory(path) {
        let dirs = path.split('/').filter(Boolean);
        let currentDir = this.root;
        let currentPath = '';
        for (let dir of dirs) {
            currentPath += `/${dir}`;
            currentDir = this.directoryMap.get(currentPath);
            if (!currentDir) {
                return null;
            }
        }
        return currentDir;
    }

    getFile(dir, fileName) {
        return this.getDirectory(dir).children.get(fileName);
    }

    getParentDir(path) {
        const dirs = path.split('/').filter(Boolean);
        dirs.pop();
        return `/${dirs.join('/')}`;
    }

    getFilesRecursively(directory = '/') {
        let files = [];
        const traverse = (dir, path = '') => {
            for (const [name, item] of dir.children.entries()) {
                const newPath = `${path}/${name}`;
                if (item.type === 'dir') {
                    files.push(newPath);
                    traverse(item, newPath);
                } else {
                    files.push(newPath);
                }
            }
        };
        traverse(this.getDirectory(directory), directory);
        return files;
    }
    mv(oldPath, newPath) {
        let oldDirs = oldPath.split('/').filter(Boolean);
        let oldFileName = oldDirs.pop();
        let currentPath = '';
        for (let dir of oldDirs) {
            currentPath += `/${dir}`;
            currentDir = this.directoryMap.get(currentPath);
            if (!currentDir) {
                return null;
            }
        }
        let file = currentDir.children.get(oldFileName);
        if (!file) {
            return null;
        }
        this.rm(oldPath);
        this.touch(newPath, file.content);
    }

    listAll(dir = this.root, path = '', result = {}) {
        for (let [name, item] of dir.children.entries()) {
            if (item.type === 'file') {
                result[`${path}/${name}`] = 'file';
            } else {
                result[`${path}/${name}`] = 'dir';
                this.listAll(item, `${path}/${name}`, result);
            }
        }
        return result;
    }
    save() {
        let rootCopy = JSON.parse(JSON.stringify(this.root));
        this.convertToObj(rootCopy);
        localStorage.setItem('fileSystem', JSON.stringify(rootCopy));
    }

}
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
    'explorer.content': [
        ['<i class="bi bi-arrow-clockwise"></i> 刷新', `$('#win-explorer>.main>.content>.view').css('opacity','0');setTimeout(()=>{$('#win-explorer>.main>.content>.view').css('opacity','1');},100);`],
    ],
    'explorer.folder': [
        (arg) => {
            return ['<i class="bi bi-folder2-open"></i> 打开', `apps.explorer.goto('${arg}')`];
        }
    ],
    'edge.tab': [
        arg => {
            return ['<i class="bi bi-pencil-square"></i> 命名标签页', `apps.edge.c_rename(${arg})`];
        },
        arg => {
            return ['<i class="bi bi-x"></i> 关闭标签页', `apps.edge.close(${arg})`];
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
              <a class="a" onclick="closenotice();widgets.widgets.add('calc')">计算器</a>
              <a class="a" onclick="closenotice();widgets.widgets.add('weather')">天气</a>
            </list>`,
        btn: [
            { type: 'cancel', text: '取消', js: 'closenotice();' },
        ]
    }
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
            apps.explorer.reset();
        },
        reset: () => {
            $('#win-explorer>.main>.content>.view')[0].innerHTML = `<style>#win-explorer>.main>.content>.view>.class{margin-left: 20px;display: flex;}
            #win-explorer>.main>.content>.view>.class>img{width: 20px;height: 20px;margin-top: 3px;margin-right: 5px;filter:brightness(0.9);}
            #win-explorer>.main>.content>.view>.group{display: flex;flex-wrap: wrap;padding: 10px 20px;}
            #win-explorer>.main>.content>.view>.group>.item{width: 280px;margin: 5px;height:80px;
    box-shadow: 0 1px 2px var(--s3d);
                background: radial-gradient(circle, var(--card),var(--card));border-radius: 10px;display: flex;}
            #win-explorer>.main>.content>.view>.group>.item:hover{background-color: var(--hover);}
            #win-explorer>.main>.content>.view>.group>.item:active{transform: scale(0.97);}
            #win-explorer>.main>.content>.view>.group>.item>img{width: 55px;height: 55px;margin-top: 18px;margin-left: 10px;}
            #win-explorer>.main>.content>.view>.group>.item>div{flex-grow: 1;padding: 5px 5px 0 0;}
            #win-explorer>.main>.content>.view>.group>.item>div>.bar{width: calc(100% - 10px);height: 8px;border-radius: 10px;
                background-color: var(--hover-b);margin: 5px 5px;}
            #win-explorer>.main>.content>.view>.group>.item>div>.bar>.content{height: 100%;background-image: linear-gradient(90deg, var(--theme-1), var(--theme-2));
                border-radius: 10px;}
            #win-explorer>.main>.content>.view>.group>.item>div>.info{color: #959595;font-size: 14px;}</style>
            <p class="class"><img src="apps/icons/explorer/disk.svg"> 设备和驱动器</p><div class="group">
            <a class="a item act" ondblclick="apps.explorer.goto('C:')" ontouchend="apps.explorer.goto('C:')" oncontextmenu="showcm(event,'explorer.folder','C:');return stop(event);">
            <img src="apps/icons/explorer/diskwin.svg"><div><p class="name">本地磁盘 (C:)</p>
            <div class="bar"><div class="content" style="width: 88%;"></div>
            </div><p class="info">32.6 GB 可用, 共 143 GB</p></div></a><a class="a item act" ondblclick="apps.explorer.goto('D:')" ontouchend="apps.explorer.goto('D:')"
            oncontextmenu="showcm(event,'explorer.folder','D:');return stop(event);">
            <img src="apps/icons/explorer/disk.svg"><div><p class="name">本地磁盘 (D:)</p><div class="bar"><div class="content" style="width: 15%;"></div>
            </div><p class="info">185.3 GB 可用, 共 216 GB</p></div></a></div>`;
            $('#win-explorer>.main>.content>.tool>.tit')[0].innerHTML = '此电脑';
        },
        goto: (path) => {
            $('#win-explorer>.main>.content>.view')[0].innerHTML = '';
            var pathl = path.split('/');
            let tmp = apps.explorer.path;
            pathl.forEach(name => {
                tmp = tmp['folder'][name];
            });
            if (tmp == null) {
                $('#win-explorer>.main>.content>.view')[0].innerHTML = '<p class="info">此文件夹为空。</p>';
            }
            else {
                let ht = '';
                for (folder in tmp['folder']) {
                    ht += `<a class="a item" ondblclick="apps.explorer.goto('${path}/${folder}')" ontouchend="apps.explorer.goto('${path}/${folder}')" oncontextmenu="showcm(event,'explorer.folder','${path}/${folder}');return stop(event);">
                        <img src="apps/icons/explorer/folder.svg">${folder}</a>`;
                }
                if (tmp['file']) {
                    tmp['file'].forEach(file => {
                        ht += `<a class="a item act file" ondblclick="${file['command']}" ontouchend="${file['command']}" oncontextmenu="return stop(event);">
                            <img src="${file['ico']}">${file['name']}</a>`;
                    });
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
            folder: {
                'C:': {
                    folder: {
                        'Program Files': {
                            folder: { 'WindowsApps': null, 'Microsoft': null },
                            file: [
                                { name: 'about.exe', ico: 'icon/about.svg', command: "openapp('about')" },
                                { name: 'setting.exe', ico: 'icon/setting.svg', command: "openapp('setting')" },
                            ]
                        },
                        'Windows': {
                            folder: { 'Boot': null, 'System': null, 'System32': null },
                            file: [
                                { name: 'notepad.exe', ico: 'icon/notepad.svg', command: "openapp('notepad')" },
                            ]
                        },
                        '用户': {
                            folder: {
                                'Administrator': {
                                    folder: {
                                        '文档': {
                                            folder: { 'IISExpress': null, 'PowerToys': null },
                                            file: [
                                                { name: '瓶盖介绍.doc', ico: 'icon/files/word.png', command: '' },
                                                { name: '瓶盖质量统计分析.xlsx', ico: 'icon/files/excel.png', command: '' },
                                            ]
                                        }, '图片': {
                                            folder: { '本机照片': null, '屏幕截图': null },
                                            file: [
                                                { name: '瓶盖构造图.png', ico: 'icon/files/img.png', command: '' },
                                                { name: '可口可乐瓶盖.jpg', ico: 'icon/files/img.png', command: '' },
                                            ]
                                        },
                                        'AppData': null, '音乐': { folder: { '录音机': null } }
                                    }
                                }
                            }
                        }
                    }
                },
                'D:': {
                    folder: { 'Microsoft': null },
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
            const input = $('#win-terminal>pre>input');
            const command = input.val();
            var newD = document.createElement('div');
            newD.innerText = `C:\\Windows\\System32> ${command}`;
            elt.appendChild(newD);
            if (command != '') {
                try {
                    if ($('.window.' + command)[0] && !$('.window.' + cmd)[0].classList.contains('configs')) {
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
        newtab: () => {
            apps.edge.tabs.push([apps.edge.len++, '新建标签页']);
            $('#win-edge').append(`<iframe src="mainpage.html" frameborder="0" class="${apps.edge.tabs[apps.edge.tabs.length - 1][0]}">`)
            apps.edge.settabs();
            apps.edge.tab(apps.edge.tabs.length - 1);
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
            }
        },
        settabs: () => {
            let html = '';
            for (let i = 0; i < apps.edge.tabs.length; i++) {
                const t = apps.edge.tabs[i];
                if ($('.window.edge>.titbar>.tabs>.tab.' + t[0] + '>.reloading')[0]) {
                    html += `<div class="tab ${t[0]}" onclick="apps.edge.tab(${i})" oncontextmenu="showcm(event,'edge.tab',${i});stop(event);return false" onmousedown="apps.edge.moving(this,event,${i});stop(event);" ontouchstart="apps.edge.moving(this,event,${i});stop(event);">${apps.edge.reloadElt}<p>${t[1]}</p><span class="clbtn bi bi-x" onclick="apps.edge.close(${i})"></span></div>`;
                }
                else {
                    html += `<div class="tab ${t[0]}" onclick="apps.edge.tab(${i})" oncontextmenu="showcm(event,'edge.tab',${i});stop(event);return false" onmousedown="apps.edge.moving(this,event,${i});stop(event);" ontouchstart="apps.edge.moving(this,event,${i});stop(event);"><p>${t[1]}</p><span class="clbtn bi bi-x" onclick="apps.edge.close(${i})"></span></div>`;
                }
            }
            $('.window.edge>.titbar>.tabs')[0].innerHTML = html;
            $('.window.edge>.titbar>.tabs')[0].innerHTML += '<a class="new bi bi-plus" onclick="apps.edge.newtab();"></a>';
            // $('.window.edge>.titbar>.tabs>.tab.'+apps.edge.tabs[apps.edge.now][0]).addClass('show');
        },
        moving: (t, ev, np) => {
            let deltaLeft, pos;
            if (ev.type.match('mouse')) {
                deltaLeft = ev.clientX;
            }
            else if (ev.type.match('touch')) {
                deltaLeft = ev.touches[0].clientX;
            }
            function move_f(e) {
                let x;
                if (e.type.match('mouse')) {
                    x = e.clientX;
                }
                else if (e.type.match('touch')) {
                    x = e.touches[0].clientX;
                }
                $(this).css('transform', `translateX(${x - deltaLeft}px)`);
                pos = Math.floor((this.offsetLeft + x - deltaLeft - 36 + (this.offsetWidth / 2)) / this.offsetWidth);
                if (pos > apps.edge.tabs.length - 1) {
                    pos = apps.edge.tabs.length - 1;
                }
                $('.window.edge>.titbar>.tabs>.tab.left').removeClass('left');
                $('.window.edge>.titbar>.tabs>.tab.right').removeClass('right');
                if (np < pos) {
                    for (let i = np + 1; i <= pos; i++) {
                        const ta = apps.edge.tabs[i];
                        if (ta) {
                            $('.window.edge>.titbar>.tabs>.tab.' + ta[0]).addClass('left');
                        }
                    }
                }
                else if (np > pos) {
                    for (let i = pos; i < np; i++) {
                        const ta = apps.edge.tabs[i];
                        if (ta) {
                            $('.window.edge>.titbar>.tabs>.tab.' + ta[0]).addClass('right');
                        }
                    }
                }
            };
            page.onmousemove = move_f.bind(t);
            page.ontouchmove = move_f.bind(t);
            function up_f(e) {
                page.onmousemove = null;
                page.onmouseup = null;
                page.ontouchmove = null;
                page.ontouchend = null;
                let x;
                if (e.type.match('mouse')) {
                    x = e.clientX;
                    pos = Math.floor((this.offsetLeft + x - deltaLeft - 36 + (this.offsetWidth / 2)) / this.offsetWidth);
                    if (pos > apps.edge.tabs.length - 1) {
                        pos = apps.edge.tabs.length - 1;
                    }
                }
                if (pos == np || pos > apps.edge.tabs.length || pos < 0) {
                    $(this).css('transform', 'none');
                    $(this).removeClass('moving');
                    $('.window.edge>.titbar>.tabs>.tab.left').removeClass('left');
                    $('.window.edge>.titbar>.tabs>.tab.right').removeClass('right');
                }
                else {
                    apps.edge.tabs.splice(np < pos ? pos + 1 : pos, 0, apps.edge.tabs[np]);
                    apps.edge.tabs.splice(np < pos ? np : (np + 1), 1);
                    apps.edge.settabs();
                    apps.edge.tab(pos);
                }
            }
            page.onmouseup = up_f.bind(t);
            page.ontouchend = up_f.bind(t);
            page.ontouchcancel = up_f.bind(t);
            $(t).addClass('moving');
        },
        close: (c) => {
            $('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[c][0]).addClass('close');
            for (let i = c + 1; i < apps.edge.tabs.length; i++) {
                const _id = apps.edge.tabs[i][0];
                $('.window.edge>.titbar>.tabs>.tab.' + _id).addClass('left');
            }
            setTimeout(() => {
                $('#win-edge>iframe.' + apps.edge.tabs[c][0]).remove();
                apps.edge.tabs.splice(c, 1);
                apps.edge.settabs();
                if (apps.edge.tabs.length == 0) {
                    hidewin('edge');
                }
                else {
                    apps.edge.tab(apps.edge.tabs.length - 1);
                }
            }, 200);
        },
        tab: (c) => {
            console.log(c, apps.edge.tabs[c][0])
            $('#win-edge>iframe.show').removeClass('show');
            $('#win-edge>iframe.' + apps.edge.tabs[c][0]).addClass('show');
            $('#win-edge>.tool>input.url').val($('#win-edge>iframe.' + apps.edge.tabs[c][0]).attr('src') == 'mainpage.html' ? '' : $('#win-edge>iframe.' + apps.edge.tabs[c][0]).attr('src'));
            $('#win-edge>.tool>input.rename').removeClass('show');
            apps.edge.now = c;
            $('.window.edge>.titbar>.tabs>.tab.show').removeClass('show');
            $('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[c][0]).addClass('show');
        },
        c_rename: (c) => {
            apps.edge.tab(c);
            $('#win-edge>.tool>input.rename').val(apps.edge.tabs[apps.edge.now][1]);
            $('#win-edge>.tool>input.rename').addClass('show');
            setTimeout(() => {
                $('#win-edge>.tool>input.rename').focus();
            }, 300);
        },
        rename: (n) => {
            apps.edge.tabs[apps.edge.now][1] = n;
            apps.edge.settabs();
            apps.edge.tab(apps.edge.now);
        },
        reload: () => {
            $('#win-edge>iframe.show').attr('src', $('#win-edge>iframe.show').attr('src'));
            if (!$('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0] + '>.reloading')[0]) {
                $('.window.edge>.titbar>.tabs>.tab.' + apps.edge.tabs[apps.edge.now][0])[0].insertAdjacentHTML('afterbegin', apps.edge.reloadElt);
                $('#win-edge>iframe.' + apps.edge.tabs[apps.edge.now][0])[0].onload = function () {
                    $('.window.edge>.titbar>.tabs>.tab.' + this.classList[0])[0].removeChild($('.window.edge>.titbar>.tabs>.tab.' + this.classList[0] + '>.reloading')[0]);
                }
            }
        },
        getTitle: async (url, np) => {
            const response = await fetch(server + pages['get-title'] + `?url=${url}`);
            if (response.ok == true) {
                const text = await response.text();
                apps.edge.tabs[np][1] = text;
                apps.edge.settabs();
                apps.edge.tab(np);
            }
        },
        goto: (u) => {
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
            widgets.weather.handle = setInterval(widgets.weather.update, 30000);
        },
        remove: () => {
            clearInterval(widgets.weather.handle);
        },
        update: () => {
            let wic = {
                23: "HeavyDrizzle",
                40: "HeavyDrizzle",
                26: "SnowShowersDayV2",
                6: "BlowingHailV2",
                5: "CloudyV3",
                20: "LightSnowV2",
                91: "WindyV2",
                27: "ThunderstormsV2",
                10: "FreezingRainV2",
                77: "RainSnowV2",
                12: "Haze",
                13: "HeavyDrizzle",
                39: "Fair",
                24: "RainSnowV2",
                78: "RainSnowShowersNightV2",
                9: "FogV2",
                3: "PartlyCloudyDayV3",
                43: "IcePelletsV2",
                16: "IcePellets",
                8: "LightRainV2",
                15: "HeavySnowV2",
                28: "ClearNightV3",
                30: "PartlyCloudyNightV2",
                14: "ModerateRainV2",
                1: "SunnyDayV3",
                7: "BlowingSnowV2",
                50: "RainShowersNightV2",
                82: "LightSnowShowersNight",
                81: "LightSnowShowersDay",
                2: "MostlySunnyDay",
                29: "MostlyClearNight",
                4: "MostlyCloudyDayV2",
                31: "MostlyCloudyNightV2",
                19: "LightRainV3",
                17: "LightRainShowerDay",
                53: "N422Snow",
                52: "Snow",
                25: "Snow",
                44: "LightRainShowerNight",
                65: "HailDayV2",
                73: "HailDayV2",
                74: "HailNightV2",
                79: "RainShowersDayV2",
                89: "HazySmokeV2",
                90: "HazeSmokeNightV2_106",
                66: "HailNightV2",
                59: "WindyV2",
                56: "ThunderstormsV2",
                58: "FogV2",
                54: "HazySmokeV2",
                55: "Dust1",
                57: "Haze"
            };
            $.getJSON('https://assets.msn.cn/service/weatherfalcon/weather/overview?locale=zh-cn&ocid=msftweather').then(r => {
                let inf = r.value[0].responses[0].weather[0].current;
                $('.wg.weather>.content>.img').attr('src', `https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/${wic[inf.icon]}.svg`);
                $('.wg.weather>.content>.text>.temperature').text(`${inf.temp}℃`);
                $('.wg.weather>.content>.text>.detail').text(`${inf.cap} 体感温度${inf.feels}℃`);
            })
        },
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
    whiteboard: 'whiteboard.png'
}
function geticon(name) {
    if (icon[name]) return icon[name];
    else return name + '.svg';
}

// 应用与窗口
function openapp(name) {
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

function controlStatus() {
    if (this.classList.contains('active')) {
        this.classList.remove('active')
    }
    else if (!this.classList.contains('active')) {
        this.classList.add('active')
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
    $('#loginback').css('opacity', '1');
    $('#loginback').css('display', 'flex');
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
    shownotice('about');
};

// PWA 应用
if (!location.href.match(/((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))/) && !location.href.match('localhost') && !(new URL(location.href)).searchParams.get('develop')) {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none', scope: './' });
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
}
