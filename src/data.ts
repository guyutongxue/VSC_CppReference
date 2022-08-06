import vscode from "vscode";
import * as fs from "node:fs";
import * as path from "node:path";

import { Index } from "./typing";
import { getIcon, getDescription, UserCancelledError } from "./utils";
import { fetch } from "./fetch";

let data: Index[];

export async function getPath(word: string): Promise<string | null> {
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
          label: `$(${getIcon(e)}) ${e.name}`,
          description: "note" in e ? e.note : undefined,
          detail: getDescription(e),
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
    if (typeof result === "undefined") throw new UserCancelledError();
    if (result.index !== null) path = filtered[result.index].link;
    else path = null;
  }
  return path;
}

function getStoragePath(context: vscode.ExtensionContext) {
  return vscode.Uri.joinPath(context.globalStorageUri, "linkmap.json");
}

const textDecoder = new TextDecoder();

export async function updateData(context: vscode.ExtensionContext) {
  const content = await fetch(
    `https://cdn.jsdelivr.net/npm/@gytx/cppreference-index/dist/generated.json`
  ).then((r) => r.arrayBuffer());
  const storagePath = getStoragePath(context);
  await vscode.workspace.fs.writeFile(storagePath, new Uint8Array(content));
  data = JSON.parse(textDecoder.decode(content));
}

export async function initData(context: vscode.ExtensionContext) {
  await vscode.workspace.fs.createDirectory(context.globalStorageUri);
  const storagePath = getStoragePath(context);
  if (!fs.existsSync(storagePath.fsPath)) {
    const bundled = vscode.Uri.file(
      path.join(
        __dirname,
        "../node_modules/@gytx/cppreference-index/dist/generated.json"
      )
    );
    vscode.workspace.fs.copy(bundled, storagePath);
  }
  const content = await vscode.workspace.fs.readFile(storagePath);
  data = JSON.parse(textDecoder.decode(content));
}
