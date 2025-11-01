# 翻译贡献指南
开始翻译前，**务必[联系我们](https://teams.live.com/l/invite/FEA0yrNkE_bAn-ddwI)，并征得同意**，以了解是否还有其他人正在翻译，避免重复劳动和合并冲突。

## 条件
1. 有中文基础
2. 有一定的目标语言的基础 / 愿意将自己的 Windows 11 系统调成目标语言
3. 有代码基础

## 方法
项目使用 i18n 库实现多语言，可上网查阅，或自行研究已有翻译的部分

### 已有成果
0. 务必理解 `desktop.js` 开头语言处理部分，熟悉原理
1. 此目录下 `trans.py`，有 Python 基础者自行研究
2. `desktop.js` 中有 `lang(txt,id)`，详见注释

### 注意
部分代码形如
```html
<a class="btn">
    <i class="bi"></i> 文本
</a>
```
可能不便于设置属性，可对纯文本部分添加 `<span>` 标签，例可改为

```html
<a class="btn">
    <i class="bi"></i>
    <span data-i18n="sth">文本</span>
</a>
```

顺便把 `lang_zh_cn` 文件一同完善，感激不尽。

### 加分项
1. 与 Windows 11 一致的部分，应符合(尽量)最新版的原生语言内容
2. 不一致的，应避免机器翻译

## 酬劳
有且仅有
1. Github 贡献点
2. 来自开发者的由衷感谢 >u-)o