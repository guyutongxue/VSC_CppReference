import * as vscode from 'vscode';
import fetch from 'node-fetch';
import xml2js = require('xml2js');

import { linkMap } from './linkmap';

export function activate(context: vscode.ExtensionContext) {
    let wvPanel: vscode.WebviewPanel | undefined = undefined;

    context.subscriptions.push(
        vscode.commands.registerCommand('cppref.open', async () => {
            if (typeof(vscode.window.activeTextEditor) === "undefined" || vscode.window.activeTextEditor.document.languageId !== "cpp") return;
            try {
                if (wvPanel) {
                    wvPanel.reveal(vscode.ViewColumn.Beside);
                    wvPanel.webview.html = await getWvContent();
                } else {
                    let content: string = await getWvContent();
                    wvPanel = vscode.window.createWebviewPanel(
                        'docs',
                        'C++ Reference',
                        {
                            viewColumn: vscode.ViewColumn.Beside,
                            preserveFocus: false
                        },
                        {
                            enableScripts: true,
                            enableFindWidget: true,
                            retainContextWhenHidden: true
                        }
                    );
                    wvPanel.webview.html = content;
                    wvPanel.onDidDispose(() => {
                        wvPanel = undefined;
                    }, null, context.subscriptions);
                }
            } catch (error) {
                vscode.window.setStatusBarMessage("");
                if ((error as Error).message != "")
                    vscode.window.showInformationMessage((error as Error).message);
            }
        })
    );
}

function getLink(): string {
    let alternative: boolean = vscode.workspace.getConfiguration('cppref.alternative').get('enabled');
    if (alternative) {
        return vscode.workspace.getConfiguration('cppref.alternative').get('url');
    }
    let lang: string = vscode.workspace.getConfiguration('cppref').get('lang');
    return `https://${lang}.cppreference.com/w/`;
}

function getCurrentWord(): string {
    const active = vscode.window.activeTextEditor;
    const range = active.document.getWordRangeAtPosition(active.selection.active);
    if (range) {
        const word = active.document.getText(range);
        return word;
    } else {
        throw new Error("No identifier found.");
    }
}



async function getPath(word: string): Promise<string> {
    interface Symbol {
        namespaceName: string;
        path: string;
        name: string;
        comment: string;
    };
    let path: string = "about:blank";
    let matches: Symbol[] = [];
    for (let i in linkMap) {
        if (linkMap[i].name === word) {
            matches.push(linkMap[i]);
        }
    }
    if (matches.length == 0) {
        throw new Error("No matched symbol found.");
    }
    if (matches.length == 1) {
        path = matches[0].path;
    } else {
        interface MyItem extends vscode.QuickPickItem {
            index: number;
        }
        const result = (await vscode.window.showQuickPick<MyItem>(
            matches.map<MyItem>((e, i) => ({
                label: e.namespaceName + "::" + e.name,
                description: e.comment == null ? "" : e.comment,
                index: i
            })), {
            canPickMany: false
        }
        ));
        if (typeof result === "undefined") throw new Error("");
        path = matches[result.index].path;
    }
    return path;
}

async function getPathBySearch(word: string): Promise<string> {
    interface PageInfo {
        ns: string,
        title: string,
        titlesnippet: string
    };
    interface MyItem extends vscode.QuickPickItem {
        path: string
    };
    vscode.window.setStatusBarMessage("Searching cppreference.com...");
    let result: PageInfo[] = undefined;
    await fetch(`https://en.cppreference.com/mwiki/api.php?action=query&list=search&srsearch=${encodeURI(word)}&format=xml&srlimit=50&srprop=titlesnippet`)
        .then(response => response.text())
        .then(str => new Promise(
            (resolve) => (new xml2js.Parser())
                .parseString(str, (err, res) => {
                    resolve(res);
                }
                ))
        ).then(json => {
            console.log(json);
            let rawArr: {$: PageInfo}[] = json['api']['query'][0]['search'][0]['p'];
            if (typeof rawArr === "undefined")
                throw new Error("No result.");
            result = rawArr.map(i => i.$);
        })
    vscode.window.setStatusBarMessage("");
    if (result.length == 1) {
        return encodeURI(result[0].title);
    }
    const selected = await vscode.window.showQuickPick<MyItem>(
        result.map<MyItem>(i => ({
            label: i.titlesnippet.replace('&amp;','&').replace('&gt;','>').replace('&lt;','<').replace('&quot;','"'),
            path: encodeURI(i.title)
        })),
        {
            canPickMany: false
        }
    );
    if (typeof selected === "undefined")
        throw new Error("");
    return selected.path;
}

async function getWvContent(): Promise<string> {
    const host: string = getLink();
    console.log("host: ", host);
    const word = getCurrentWord();
    console.log("word: ", word);
    let link: string = host + (vscode.workspace.getConfiguration('cppref').get('useSearch') ? await getPathBySearch(word): await getPath(word));
    console.log("final link: ", link);
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
<iframe src="${link}" width="100%" height="100%" ></iframe>
</body>
</html>`;
} 