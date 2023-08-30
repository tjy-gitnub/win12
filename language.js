function loadlang() {
    let h=document.documentElement;
    let c=h.innerHTML;
    let l={
        this:{
            name:'Windows 12 网页版'
        },
        ldb:{
            updating:'正在更新',
            login:'登录',
        },
        sys:{
            power:'电源',
            shtd:'关机',
            rest:'重启',
            start:'开始',
            search:'搜索',
            widgets:'小组件',
            srchp:'在这里输入你要搜索的内容',
            tgltheme:'切换主题',
            thispc:'此电脑'
        },
        sm:{
            lab1:'可用',
            labweb:'Web 应用',
            toglfullscrn:'切换全屏',
            allapp:'所有应用',
            pinned:'已固定',
            tj:'推荐的项目',
            more:'更多',
            minago:'分钟前'
        },
        sch:{
            all:'全部',
            app:'应用',
            doc:'文档',
            web:'网页',
            mail:'电子邮件',
            pep:'人员',
            stig:'设置',
            vido:'视频',
            fld:'文件夹',
            msc:'音乐',
            pic:'照片',
            tj:'推荐',
            open:'打开',
            opinloc:'打开文件所在位置',
            cpypath:'复制路径',
        },
        wid:{
            // 别忘了
        },
        widmenu:{
            widget:'小组件',
            add:'添加',
            news:'新闻',
            ation:'注意: 新闻内容均不属实',
            detail:'详细信息 &gt;',
        },
        copilot:{
            start:'开始对话',
            send:'发送',
        },
        ctrol:{
            blteeth:'蓝牙',
            airpl:'飞行模式',
            nightl:'夜间模式',
            hotspot:'移动热点',
            access:'辅助功能',
        },
        time:{
            // abb:{
            //     '1':'Mo','2':'Tu','3':'We','4':'Th',
            //     '5':'Fr','6':'Sa','7':'Su'
            // },
            wabb:{
                '1':'一','2':'二','3':'三','4':'四',
                '5':'五','6':'六','7':'日'
            },
            wful:{
                '1':'星期一','2':'星期二','3':'星期三','4':'星期四',
                '5':'星期五','6':'星期六','7':'星期日'
            }
        },
        editmode:{
            add:'添加小组件',
            exit:'退出编辑模式',
        },
        setting:{
            name:'设置',
            usr:'瓶盖',
            srchp:'查找设置',
            sys:'系统',
            blue:'蓝牙和其他设备',
            netw:'网络和 Internet',
            appr:'个性化',
            app:'应用',
            acc:'账户',
            time:'时间和语言',
            game:'游戏',
            hlp:'辅助功能',
            safe:'隐私与安全性',
            upd:'Windows 更新',
            system:{
                disp:'显示',
                dispd:'显示器、亮度、夜间模式、显示描述',
                sond:'声音',
                sondd:'声音级别、输入、输出、声音设备',
                noti:'通知',
                notid:'来自系统和应用的警报',
                focs:'专注助手',
                focsd:'通知、自动规则',
                powr:'电源',
                powrd:'睡眠、电池使用情况、节电模式',
                strg:'存储',
                strgd:'存储空间、驱动器、配置规则',
                mult:'多任务处理',
                multd:'贴靠窗口、桌面、任务切换',
                actv:'激活',
                actvd:'激活状态、订阅、产品密钥',
                trbl:'疑难解答',
                trbld:'建议的疑难解答、首选项和历史记录',
                recv:'恢复',
                recvd:'重置、高级启动、返回',
                prjc:'投影到此电脑',
                prjcd:'权限、配对 PIN、可发现性',
                remt:'远程桌面',
                remtd:'远程桌面用户、连接权限',
                clpb:'剪贴板',
                clpbd:'剪贴和复制历史记录、同步、清除',
                abot:'关于',
                abotd:'设备规格、重命名电脑、Windows 规格',
            },
            appearance:{
                color:'颜色',
                colord:'设置 Windows 的主题色',
                colornow:'当前颜色',
                colorset:'自定义颜色',
                apply:'应用',
                theme:'主题',
                themed:`设置 Windows 的主题 想要<span class="a jump" win12_title="https://github.com/tjy-gitnub/win12-theme" onclick="window.open('https://github.com/tjy-gitnub/win12-theme','_blank')">上传自己的主题</span>?`,
                bdrd:'圆角',
                bdrdd:'设置系统界面中是否启用圆角',
                animn:'动画',
                animnd:'系统界面元素过渡动画',
                shadow:'阴影',
                shadowd:'为系统界面元素添加阴影效果',
                blurall:'多窗口透明',
                bluralld:'为所有窗口开启透明效果，而不是仅用于焦点窗口 <span class="a jump" win12_title="开启后将占用大量GPU,可能造成卡顿">详细</span>',
                mica:'Mica效果 (试验)',
                micad:'为焦点窗口开启mica效果',
                feedback:'反馈',
                music:'开机音乐',
                musicd:'是否启用开机音乐'
            }
        },
        explorer:{
            name:'文件资源管理器',
            folder:{
                docs:'文档',
                pics:'图片',
                music:'音乐',
            }
        },
        calc:{
            name:'计算器',
        },
        run:{
            name:'运行',
        },
        about:{
            stname:'关于Win12网页版',
            midname:'关于 Wn12 网页版',
        },
        taskmgr:{
            name:'任务管理器',
        },
        notepad:{
            name:'计算器',
        },
        edge:{
        },
        camera:{
            name:'相机',
        },
        terminal:{
            name:'终端',
        },
        defender:{
            name:'Windows 安全中心',
            home:'主页',
            viru:'病毒威胁与防护',
            acct:'账户防护',
            fiwnet:'防火墙和网络防护',
            dvic:'设备安全性',
            aqxgl:'安全性概览',
            wlllsy:'网络流量使用',
            wlsd:'网络速度',
            rqbdqc:'入侵病毒清除',
            sgjpl:'电脑受病毒攻击频率',
            gq30t:'过去 30 天',
            wltxbl:'网络通信比例',
            zgy:'这个月',
            qqcg:'请求成功',
            qqsb:'请求失败',
            qqwxy:'请求发出后无响应',
            hybd:'含有病毒',
            qqjl:'请求记录',
            jt5qq:'今天 仅展示最近5次请求'
        },
        webapp:{
            bilibili:'哔哩哔哩',
            wsa:'适用于 Android™️ 的 Windows 子系统',
        },
        x:{
            feedback:'反馈中心'
        }
    }
    for(let i=0;i<c.length;i++){
        if(c[i]!='{')continue;
        else if(c[i+1]=='{' && c[i+2]==' '){
            let j=i+3;
            for(;j<c.length;j++){
                if(c[j]==' '){
                    if(c[j+1]=='}' && c[j+2]=='}'){
                        break;
                    }else{
                        console.log('谁tm写的什么鬼啊(恼');
                    }
                    break;
                }
            }
            let s=c.substring(i+3,j).split('.'),lst=l;
            // console.log(lst);
            for(let it of s){
                try{
                    lst=lst[it];
                    // console.log(it,lst);
                }catch(e){
                    console.log('谁tm写的什么鬼啊(恼');
                }
            }
            c=c.slice(0,i)+lst+c.slice(j+3);
        }
    }
    // console.log(c);
    h.innerHTML=c;
}

lang={
    ldb:{
        logining:'登录中',
    },
    defender:{
        gjcs:'病毒攻击次数',
    }
}

// function loadlang_() {
//     let h=document.documentElement;
//     let hl=h.innerHTML.split('\n');
//     let tl={};
//     for (let i=0;i<hl.length;i++) {
//         const li=hl[i];
//         if(li[0]=='#' && li[1]==' '){
//             if(typeof tl[li.substring(2)]=='undefined')
//                 tl[li.substring(2)]=[i];
//             else
//                 tl[li.substring(2)].push(i);
//         }
//     }
//     function dfs(k,s) {
//         for(let ke in k){
//             if(typeof(k[ke])=='object'){
//                 if(s=='')
//                     dfs(k[ke],ke);
//                 else
//                     dfs(k[ke],s+'.'+ke);
//             }else{
//                 for(let i in tl){
//                     if(i==s+'.'+ke){
//                         for (const it of tl[i]) {
//                             hl[it]=k[ke];
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     dfs(l,'');
//     console.log(hl);
//     // $(h).html(hl.join('\n'));
//     h.innerHTML=hl.join('\n')
// }