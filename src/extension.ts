import * as vscode from "vscode";
import type { Index } from "./typing";
import * as fs from "node:fs";
import * as path from "node:path";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let data: Index[];

export function activate(context: vscode.ExtensionContext) {
  let wvPanel: vscode.WebviewPanel | undefined = undefined;
  async function main(manually: boolean): Promise<void> {
    try {
      const content: string = await getWvContent(manually);
      if (wvPanel) {
        wvPanel.reveal(vscode.ViewColumn.Beside);
      } else {
        wvPanel = vscode.window.createWebviewPanel(
          "docs",
          "C++ Reference",
          {
            viewColumn: vscode.ViewColumn.Beside,
            preserveFocus: false,
          },
          {
            enableScripts: true,
            enableFindWidget: true,
            retainContextWhenHidden: true,
          }
        );
        wvPanel.onDidDispose(
          () => {
            wvPanel = undefined;
          },
          null,
          context.subscriptions
        );
      }
      wvPanel.webview.html = content;
    } catch (error) {
      vscode.window.setStatusBarMessage("");
      if ((error as Error).message != "")
        vscode.window.showInformationMessage((error as Error).message);
    }
  }
  const open = vscode.commands.registerCommand("cppref.open", () => {
    main(false);
  });
  const search = vscode.commands.registerCommand("cppref.search", () => {
    main(true);
  });
  data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../linkmap.json"), "utf-8")
  );
  context.subscriptions.push(open, search);
}

function getLink(): string {
  const alternative = vscode.workspace
    .getConfiguration("cppref.alternative")
    .get("enabled");
  if (alternative) {
    return vscode.workspace.getConfiguration("cppref.alternative").get("url")!;
  }
  const lang: string = vscode.workspace.getConfiguration("cppref").get("lang")!;
  return `https://${lang}.cppreference.com/w/`;
}

function getCurrentWord(): string {
  const active = vscode.window.activeTextEditor;
  if (!active) {
    throw new Error("No active text editor");
  }
  const range = active.selection.isEmpty
    ? active.document.getWordRangeAtPosition(active.selection.active)
    : active.selection;
  if (range) {
    const word = active.document.getText(range);
    return word;
  } else {
    throw new Error("No identifier found.");
  }
}

async function searchManually(): Promise<string> {
  const word = await vscode.window.showInputBox({
    prompt: "Type what you want to search",
  });
  if (typeof word === "undefined") throw new Error("");
  else return word;
}

function getSearchEnginePath(word: string) {
  const encodedWord = encodeURIComponent("site:cppreference.com " + word);
  type SearchEngineEnum = "Google" | "Bing" | "DuckDuckGo" | "Baidu";
  const searchEngine: SearchEngineEnum = vscode.workspace
    .getConfiguration("cppref")
    .get("searchEngine") as SearchEngineEnum;
  switch (searchEngine) {
    case "DuckDuckGo":
      return `https://duckduckgo.com/${encodedWord}`;
    case "Google":
      return `https://google.com/search?q=${encodedWord}`;
    case "Bing":
      return `https://www.bing.com/search?q=${encodedWord}`;
    case "Baidu":
      return `https://www.baidu.com/s?wd=${encodedWord}`;
  }
}

async function getPath(word: string): Promise<string | null> {
  const icon = (x: Index) => {
    switch (x.type) {
      case "symbol": {
        if (x.symbolType === "macro" || x.symbolType === "functionLikeMacro") {
          return "symbol-constant";
        }
        if (
          x.symbolType === "function" ||
          x.symbolType === "functionTemplate"
        ) {
          return "symbol-method";
        }
        if (x.symbolType === "namespace") {
          return "symbol-namespace";
        }
        if (x.symbolType === "template") {
          return "symbol-class";
        }
        return "symbol-variable";
      }
      case "attribute":
        return "symbol-property";
      case "header":
        return "symbol-file";
      case "keyword":
        return "symbol-keyword";
      case "preprocessorToken":
        return "symbol-misc";
    }
  };
  const description = (x: Index) => {
    switch (x.type) {
      case "symbol":
        return x.description;
      case "attribute":
        return `[Attribute]`;
      case "header":
        return `[Header]`;
      case "keyword":
        return `[Keyword]`;
      case "preprocessorToken":
        return `[Preprocessor Token]`;
    }
  };
  let path: string | null = "about:blank";
  const filtered = data
    .filter((i) => i.name.includes(word))
    .sort((a, b) => a.name.length - b.name.length);
  if (filtered.length == 1) {
    path = filtered[0].link;
  } else {
    interface MyItem extends vscode.QuickPickItem {
      index: number | null;
    }
    const result = await vscode.window.showQuickPick<MyItem>(
      [
        ...filtered.map<MyItem>((e, i) => ({
          label: `$(${icon(e)}) ${e.name}`,
          description: description(e),
          index: i,
        })),
        {
          label: "$(globe) More results provided by search engine...",
          index: null,
        },
      ],
      {
        canPickMany: false,
      }
    );
    if (typeof result === "undefined") throw new Error("");
    if (result.index !== null) path = filtered[result.index].link;
    else path = null;
  }
  return path;
}

async function getWvContent(manually: boolean): Promise<string> {
  const host: string = getLink();
  let path: string | null;
  console.log("host: ", host);
  let link: string;
  const word = manually ? await searchManually() : getCurrentWord();
  console.log("word: ", word);
  path = await getPath(word);
  if (path !== null) {
    link = host + path;
    console.log("final link: ", link);
  } else {
    link = getSearchEnginePath(word);
    vscode.env.openExternal(vscode.Uri.parse(link));
    throw new Error("");
  }
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>C++ Reference</title>
    <style>
        body, html
        {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            background-color: #fff;
        }
        iframe
        {
            border: 0px;
        }
      </style>
</head>
<body>    
<iframe src="${link}" width="100%" height="100%"></iframe>
</body>
</html>`;
}
