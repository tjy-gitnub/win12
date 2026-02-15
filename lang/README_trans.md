# trans.py 使用说明
## 简介 / Introduction
这是一个简单的交互式标注工具，用来给 HTML 标签插入 `data-i18n` 属性，并把翻译键值写入属性文件（`.properties`）。

This is a simple interactive annotation tool used to insert the `data-i18n` attribute into HTML tags and write translation key-value pairs to a properties file (`.properties`).
## 用法 / Usage

- 启动后会询问起始行号（1-based），直接回车从第 1 行开始。<br>After startup, you will be prompted for the starting line number (1‑based). Press Enter directly to start from line 1.
- 上下方向键：切换行。<br>Up/down arrow keys: Switch lines.
- 左右方向键：移动光标位置（插入位置）。<br>Left/right arrow keys: Move the cursor position (insertion point).
- 回车：跳到下一行。<br>Enter: Jump to the next line.
- 按 `Space` 或 `/`：进入输入模式，写入 `data-i18n`。<br>Press Space or /: Enter input mode and write data-i18n.
- 按 `Esc`：保存并退出。<br>Press Esc: Save and exit.

## 输入模式 / Input Mode

输入格式支持两种 Two input formats are supported:

- `key=value`：在当前行插入 `data-i18n="key"`，并把 `key=value` 追加写入属性文件。<br>`key=value`: Inserts `data-i18n="key"` at the current line, and appends `key=value` to the properties file.
- `key`：只插入 `data-i18n="key"`，不写入属性文件。<br>`key`: Only inserts `data-i18n="key"` without writing to the properties file.

输入完成后会自动跳到下一行。<br>
After completing the input, it will automatically jump to the next line.

## 示例 / Examples

在光标处输入 Enter the following at the cursor position:

```
app.title=Windows 12
```

会把当前 HTML 行改为 This will modify the current HTML line to:

```html
... data-i18n="app.title" ...
```

并在属性文件追加 And append the following to the properties file:

```
app.title=Windows 12
```
## 反馈 / Feedback
如若发现任何问题，欢迎通过提交issues向我们提交反馈。
<br>If you find any issues, feel free to submit feedback to us via GitHub Issues.