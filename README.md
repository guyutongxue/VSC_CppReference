# Cpp Reference - VS Code Extension

[中文版本](README_zh.md)

This extension is inspired by [Cpp Reference and Documentation](https://marketplace.visualstudio.com/items?itemName=FederAndInk.cpp-reference-and-documentation).

This is a tool to browse [cppreference.com](https://cppreference.com) from within vscode, instead of going to the browser to do so. You can use this extension to search for library and methods documentation of the C++ standard.

## Usage

Set your cursor position onto the word you want search for, then press <kbd>Ctrl+Shift+A</kbd> on Linux/Windows or <kbd>Command+Shift+A</kbd> on macOS.

![](https://s1.ax1x.com/2020/09/02/w9nkKf.gif)

## Settings

### `cppref.lang`

Choose the language of online version cppreference.com. For example, use `zh` for Chinese version of [cppreference.com](https://zh.cppreference.com).

### `cppref.useSearch`

By default, this extension will try to execute searching on cppreference.com, and return the search result for you. But it may takes a long time when your Internet connection is not so well.

If you set this value to `false`, you will get result by pre-generated symbol list (from [here](https://en.cppreference.com/w/cpp/symbol_index)) which may be incomplet and incorrekt. Here, you can only search `std::` names and macros, so you will get fewer result, which may be convenient in some cases.

### `cppref.alternative.enabled`

Switch this on to use an alternative version of cppreference.com. You should input a URL for it, see below:

### `cppref.alternative.url`

The base URL for alternative version of cppreference.com. For example, `https://guyutongxue.gitee.io/cppref/zh/` is easier to visit for some Chinese users.