# Cpp Reference - VS Code Extension

[中文版本](README_zh.md)

This extension is inspired by [Cpp Reference and Documentation](https://marketplace.visualstudio.com/items?itemName=FederAndInk.cpp-reference-and-documentation).

This is a tool to browse [cppreference.com](https://cppreference.com) from within vscode, instead of going to the browser to do so. You can use this extension to search for library and methods documentation of the C++ standard.

## Usage

Set your cursor position onto the word you want search for, then press <kbd>Ctrl+Shift+A</kbd> on Linux/Windows or <kbd>Command+Shift+A</kbd> on macOS.

![](https://s1.ax1x.com/2020/09/02/w9nkKf.gif)

You can also search manually by opening Command Palette (<kbd>Ctrl+Shift+P</kbd>, <kbd>Command+Shift+P</kbd>) and execute command `Cpp Reference: Search manually`.

> **Warning**
> Only pages in "C++" part (not "C" part) will be indexed and shown in search results.

## Settings

### `cppref.lang`

Choose the language of online version cppreference.com. For example, use `zh` for Chinese version of [cppreference.com](https://zh.cppreference.com).

### `cppref.alternative.enabled`

Switch this on to use an alternative version of cppreference.com. You should input a URL for it, see below:

### `cppref.alternative.url`

The base URL for alternative version of cppreference.com. For example, `https://guyutongxue.gitee.io/cppref/zh/` is easier to visit for some Chinese users.

### `cppref.invertColorInDarkTheme`

When using vscode's Dark Theme or Dark High Contrast Theme, invert the page's color. 

**Warning**: This feature is implemented using CSS filter and may result in sharper text edges, making it difficult to read.

## About indexing

Repo [Guyutongxue/cppreference-index](https://github.com/Guyutongxue/cppreference-index) stores code for generating search index.
