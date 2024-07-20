function addZero(i) {
    return i < 10 ? ('0' + i) : i;
}
function timeChange() {
    d = new Date();
    $('#time')[0].innerText = '[' + addZero(d.getHours()) + ':' + addZero(d.getMinutes()) + ':' + addZero(d.getSeconds()) + ']';
    $('#date')[0].innerText = '[' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ']';
}
function toBoot() {
    setTimeout(() => {
        $('#body').html('');
        $('#body').css('cssText', 'background-color: black;');
    }, 500);
    setTimeout(() => {
        location.href = './boot.html';
    }, 1000); //Boot延迟
}
function BIOS_confirm(tit, func) {
    $('#confirm-tit')[0].innerText = tit;
    $('#confirmContainer').css('display', 'flex');
    $('#confirm').attr('data-show', 'true');
    $('#confirm>.btns>*:first-child').attr('click', func);
    $('#confirm>.btns>*:first-child').attr('ontouchstart', func);
}
setTimeout(() => {
    timeChange();
    setInterval(timeChange, 1000);
}, 1000 - (new Date()).getMilliseconds());

var tab = 0, tab_back = tab;
var btn = 0, btn_back = btn;
var foc = 0, foc_back = foc;
timeChange();
function changePage(t) {
    $('.tab.show').removeClass('show');
    $('.tab.foc').removeClass('foc');
    $('.tab' + t).addClass('show');
    $('.tab' + t).addClass('foc');
    $('.page.show').removeClass('show');
    $('.page' + t).addClass('show');
    tab = t;
}
changePage(0);
document.oncontextmenu = function () {
    return false;
};
var tabs = ['main', 'exit'];
window.onkeydown = function (event) {
    event = event || window.event;
    tab_back = tab;
    if ($('#confirm').attr('data-show') != 'true') {
        if (event.keyCode == 9) {
            tab++;
            foc = 0;
            tab = tab % 2;
            changePage(tab);
        }
        if (event.keyCode == 121/*F10=退出*/) {
            eval($('#e1').attr('click'));
        }
        if (event.keyCode == 39) {
            event.preventDefault();
            tab++;
        } else if (event.keyCode == 37) {
            event.preventDefault();
            tab--;
        }
        if (tab + 1 > 0 && tab + 1 <= tabs.length && foc == 0) {
            if ([37, 39].includes(event.keyCode)) {
                changePage(tab);
            }
        } else {
            tab = tab_back;
        }
        foc_back = foc;
        if (event.keyCode == 40) {
            event.preventDefault();
            foc++;
        } else if (event.keyCode == 38) {
            event.preventDefault();
            foc--;
        }
        if (tab == 1 && foc <= 3 && foc >= 0) {
            if (!foc) { //0
                if (tab)
                    $('#exit').addClass('foc');
                else
                    $('#main').addClass('foc');
                for (var i = 1; i <= 3; i++)
                    $('#e' + i).css('color', '#0100a2');
            } else {
                if (tab) {
                    $('#exit').removeClass('foc');
                }
                else {
                    $('#main').removeClass('foc');
                }
                for (var i = 1; i <= 3; i++) {
                    $('#e' + i).css('color', '#0100a2');
                }
                $('#e' + foc).css('color', '#ffffff');
                if (event.keyCode == 13) {
                    eval($('#e' + foc).attr('click'));
                }
            }
        } else {
            foc = foc_back;
        }
    } else {
        btn_back = btn;
        if (event.keyCode == 39) {
            event.preventDefault();
            btn++;
        } else if (event.keyCode == 37) {
            event.preventDefault();
            btn--;
        }
        if ([0, 1].includes(btn)) {
            if (btn) {//1
                $('#cancel-btn').css('cssText', 'background-color: #000; color: #fff;');
                $('#ok-btn').css('cssText', 'color: #000; background-color: #fff;');
            } else {//0
                $('#ok-btn').css('cssText', 'background-color: #000;color: #fff;');
                $('#cancel-btn').css('cssText', 'color: #000;background-color: #fff;');
            }
        } else {
            btn = btn_back;
        }
        if (event.keyCode == 13) {
            event.preventDefault();
            if (btn) {
                eval($('#cancel-btn').attr('click'));
            } else {
                eval($('#ok-btn').attr('click'));
            }
            btn = 0;
            $('#ok-btn').css('cssText', 'background-color: #000;color: #fff;');
            $('#cancel-btn').css('cssText', 'color: #000;background-color: #fff;');
        }
    }
};