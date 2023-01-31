# Cpp Reference - VS Code 扩展

受 [Cpp Reference and Documentation](https://marketplace.visualstudio.com/items?itemName=FederAndInk.cpp-reference-and-documentation) 启发

此扩展可在 VS Code 内直接浏览 [cppreference.com](https://cppreference.com) 而无需跳转到浏览器。你可以通过它快速地查阅 C++ 标准文档。

## 使用方法

将光标置于你想要搜索的文本上，然后按下 <kbd>Ctrl+Shift+A</kbd> (Linux/Windows) <kbd>Command+Shift+A</kbd> (macOS) 即可。

![](https://s1.ax1x.com/2020/09/02/w9nkKf.gif)

你也可以手动搜索。按下 <kbd>Ctrl+Shift+P</kbd>（<kbd>Command+Shift+P</kbd>），随后输入 `Cpp Reference: Search manually` 即可。

> **注意**
> C 语言部分的页面未被索引，无法搜索到。

## 选项

### `cppref.lang`

选择 cppreference.com 的语言。例如，将此项设置为 `zh` 来浏览 [cppreference.com](https://zh.cppreference.com) 的中文版本。

### `cppref.alternative.enabled`

如果您想使用其它版本的 cppreference.com （如镜像或线上的“离线版本”），您可以将此开关启用。您还需要输入 URL（见下文）。

### `cppref.alternative.url`

配置您想使用的其它版本的 cppreference.com 的基 URL，如 `https://guyutongxue.gitee.io/cppref/zh/` （这在中国大陆地区访问较快）。

### `cppref.invertColorInDarkTheme`

当 VS Code 使用暗色主题或暗色高对比度主题时，翻转页面颜色。

**警告** 此功能使用 CSS filter 实现，可能导致文本边缘更尖锐从而影响文本阅读。

## 关于搜索索引

仓库 [Guyutongxue/cppreference-index](https://github.com/Guyutongxue/cppreference-index) 存储生成搜索索引的相关代码。
