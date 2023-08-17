var num1 = 0, num2 = 0;
var c = 0;

function get_num(id) {
    return Number(document.getElementById(id).value);
}


function on_click_number_key(key, id) {
    //key:按下的数字键，int
    //id:显示区的id
    if (document.getElementById(id).value == "0") {
        document.getElementById(id).value = ""
    }
    document.getElementById(id).value += key;
}

function on_click_fun_key(key, id) {
    //key:按下的功能键，int,加1，减2，乘3，除4
    num1 = Number(document.getElementById(id).value);
    c = key;
    document.getElementById(id).value = "0"
}

function on_click_point(id) {
    if (document.getElementById(id).value == "") {
        document.getElementById(id).value = "0"
    }
    if (!(document.getElementById(id).value.includes('.'))) {
        document.getElementById(id).value += "."
    }
}

function kernel_Square(id) {
    document.getElementById(id).value = Math.pow(get_num(id), 2)
}

function kernel_SquareRoot(id) {
    document.getElementById(id).value = Math.sqrt(get_num(id))
}

function backspace(id) {
    if (document.getElementById(id).value.length > 0) {
        document.getElementById(id).value = document.getElementById(id).value.substring(0, document.getElementById(id).value.length - 1)
    }
    if (document.getElementById(id).value == "") {
        document.getElementById(id).value = "0"
    }
}


function clear_num(id) {
    document.getElementById(id).value = "0"
    num1 = 0, num2 = 0, c = 0;
}

function on_click_eq(id) {
    if (c == 0) {
        return true;
    }
    num2 = Number(document.getElementById(id).value);
    var num = _calc(num1, num2, c);
    if (num != null) {
        document.getElementById(id).value = num.toString()
        return true;
    }
    return false;
}

function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}


function _calc(n1, n2, c) {
    switch (c) {
        case 1:
            return accAdd(n1, n2);
        case 2:
            return accSub(n1, n2);
        case 3:
            return accMul(n1, n2);
        case 4:
            return (n2 != 0) ? accDiv(n1, n2) : null;
    }
}