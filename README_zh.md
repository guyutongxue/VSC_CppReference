# Cpp Reference - VS Code 扩展

受 [Cpp Reference and Documentation](https://marketplace.visualstudio.com/items?itemName=FederAndInk.cpp-reference-and-documentation) 启发

此扩展可在 VS Code 内直接浏览 [cppreference.com](https://cppreference.com) 而无需跳转到浏览器。你可以通过它快速地查阅 C++ 标准文档。

## 使用方法

将光标置于你想要搜索的文本上，然后按下 <kbd>Ctrl+Shift+A</kbd> (Linux/Windows) <kbd>Command+Shift+A</kbd> (macOS) 即可。

![](https://s1.ax1x.com/2020/09/02/w9nkKf.gif)

你也可以手动搜索。按下 <kbd>Ctrl+Shift+P</kbd>（<kbd>Command+Shift+P</kbd>），随后输入 `Cpp Reference: Search manually` 即可。

> 仅前 50 个搜索结果会被显示。
>
> C 语言相关的页面无法被搜索到。

## 选项

### `cppref.lang`

选择 cppreference.com 的语言。例如，将此项设置为 `zh` 来浏览 [cppreference.com](https://zh.cppreference.com) 的中文版本。

### `cppref.useSearch`

默认地，此扩展会试图在 cppreference.com 上搜索你的文本，并返回搜索结果。但是搜索的速度取决于您的网络环境。

如果您将此选项设置为 `false`（取消勾选），则扩展会在一个预先生成的符号列表（来自[此处](https://en.cppreference.com/w/cpp/symbol_index)）中搜索。然而，这个列表可能是有疏漏和错误的。此时，您只能搜索到 `std` 命名空间中的内容和宏，因此您将获得更少的结果；但这可能在某些场合下比较适用。

### `cppref.alternative.enabled`

如果您想使用其它版本的 cppreference.com （如镜像或线上的“离线版本”），您可以将此开关启用。您还需要输入 URL（见下文）。

### `cppref.alternative.url`

配置您想使用的其它版本的 cppreference.com 的基 URL，如 `https://guyutongxue.gitee.io/cppref/zh/` （这在中国大陆地区访问较快）。