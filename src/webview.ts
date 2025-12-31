import vscode from "vscode";

import { getLink, getSearchEnginePath, shouldInvert, isDarkModeEnabled } from "./settings";
import { getPath } from "./data";
import { UserCancelledError } from "./utils";

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

export async function getWvUri(context: vscode.ExtensionContext, manually: boolean): Promise<vscode.Uri> {
  const word = manually ? "" : getCurrentWord();
  const path = await getPath(context, word);
  if (path === null) {
    vscode.env.openExternal(vscode.Uri.parse(getSearchEnginePath(word)));
    throw new UserCancelledError();
  }
  return vscode.Uri.parse(getLink(path));
}

const DARK_MODE_CSS = `
  :root {
    --dark-bg: #1e1e1e;
    --dark-text: #e0e0e0;
    --dark-link: #64b5f6;
    --dark-border: #3c3c3c;
    --dark-code-bg: #2d2d2d;
    --dark-code-text: #c8c8c8;
    --dark-table-border: #404040;
    --dark-table-bg: #252525;
  }

  body {
    background-color: var(--dark-bg) !important;
    color: var(--dark-text) !important;
  }

  a {
    color: var(--dark-link) !important;
  }

  a:visited {
    color: #9575cd !important;
  }

  code, pre {
    background-color: var(--dark-code-bg) !important;
    color: var(--dark-code-text) !important;
    border-color: var(--dark-border) !important;
  }

  table {
    background-color: var(--dark-table-bg) !important;
    border-color: var(--dark-table-border) !important;
  }

  table td, table th {
    border-color: var(--dark-table-border) !important;
    background-color: var(--dark-table-bg) !important;
    color: var(--dark-text) !important;
  }

  table th {
    background-color: #363636 !important;
  }

  tr:nth-child(even) {
    background-color: #2a2a2a !important;
  }

  hr {
    border-color: var(--dark-border) !important;
  }

  blockquote {
    border-left-color: var(--dark-link) !important;
    background-color: var(--dark-code-bg) !important;
    color: var(--dark-text) !important;
  }

  input, textarea, select {
    background-color: var(--dark-code-bg) !important;
    color: var(--dark-text) !important;
    border-color: var(--dark-border) !important;
  }

  button {
    background-color: #404040 !important;
    color: var(--dark-text) !important;
    border-color: var(--dark-border) !important;
  }

  button:hover {
    background-color: #505050 !important;
  }

  .mw-body {
    background-color: var(--dark-bg) !important;
    color: var(--dark-text) !important;
  }

  .mw-editsection {
    color: var(--dark-text) !important;
  }

  .navbox {
    background-color: var(--dark-table-bg) !important;
    border-color: var(--dark-border) !important;
  }

  .navbox-inner {
    background-color: var(--dark-code-bg) !important;
  }

  .navbox-list {
    background-color: var(--dark-table-bg) !important;
  }
`;

export async function setWvContent(webview: vscode.Webview, uri: vscode.Uri): Promise<void> {
  if (uri.scheme === "file") {
    uri = webview.asWebviewUri(vscode.Uri.file(uri.fsPath + ".html"));
  }
  const invertColor = shouldInvert();
  const enableDarkMode = isDarkModeEnabled();
  
  webview.html = `<!DOCTYPE html>
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
  ${
    invertColor
      ? `
  body.vscode-dark,
  body.vscode-high-contrast {
    filter: invert(100%) hue-rotate(180deg) brightness(150%) contrast(80%);
  }`
      : ""
  }
  iframe
  {
    border: 0px;
  }
  
  #theme-toggle {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    padding: 8px 16px;
    background-color: #2d2d2d;
    color: #e0e0e0;
    border: 1px solid #404040;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    transition: background-color 0.2s, transform 0.1s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
  
  #theme-toggle:hover {
    background-color: #3d3d3d;
    transform: translateY(-1px);
  }
  
  #theme-toggle:active {
    transform: translateY(0);
  }
  
  #theme-toggle.light-mode {
    background-color: #f0f0f0;
    color: #2d2d2d;
    border-color: #c0c0c0;
  }
  
  #theme-toggle.light-mode:hover {
    background-color: #e0e0e0;
  }
  
  iframe.dark-mode {
    filter: invert(0.9) hue-rotate(180deg) contrast(0.85) brightness(1.1);
  }
</style> 
<button id="theme-toggle" title="Toggle Dark/Light Mode">🌙 Dark Mode</button>
<iframe id="content-frame" src="${uri}" width="100%" height="100%"${enableDarkMode ? ' class="dark-mode"' : ''}></iframe>
<script>
  let isDarkMode = ${enableDarkMode ? 'true' : 'false'};
  const toggleBtn = document.getElementById('theme-toggle');
  const frame = document.getElementById('content-frame');
  
  function applyDarkMode() {
    if (isDarkMode) {
      frame.classList.add('dark-mode');
    } else {
      frame.classList.remove('dark-mode');
    }
  }
  
  function updateToggleButton() {
    if (isDarkMode) {
      toggleBtn.textContent = 'Dark 🌙';
      toggleBtn.classList.remove('light-mode');
    } else {
      toggleBtn.textContent = 'Light ☀️';
      toggleBtn.classList.add('light-mode');
    }
  }
  
  toggleBtn.addEventListener('click', function() {
    isDarkMode = !isDarkMode;
    updateToggleButton();
    applyDarkMode();
  });
  
  updateToggleButton();
  applyDarkMode();
</script>`;
}
