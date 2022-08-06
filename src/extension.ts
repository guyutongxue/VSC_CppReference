import * as vscode from "vscode";

import { getWvContent } from "./webview";
import { initData, updateData } from "./data";
import { UserCancelledError } from "./utils";

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
      if (error instanceof Error) {
        if (!(error instanceof UserCancelledError))
          vscode.window.showInformationMessage(error.message);
      }
    }
  }
  const open = vscode.commands.registerCommand("cppref.open", () => {
    main(false);
  });
  const search = vscode.commands.registerCommand("cppref.search", () => {
    main(true);
  });
  const updateIndex = vscode.commands.registerCommand(
    "cppref.updateIndex",
    () => {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Fetching latest index from cdn.jsdelivr.net...",
        },
        async (progress) => {
          try {
            await updateData(context);
          } catch (err) {
            vscode.window.showErrorMessage(err.message);
          }
        }
      );
    }
  );
  context.subscriptions.push(open, search, updateIndex);
  initData(context);
}
