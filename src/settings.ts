import vscode from "vscode";

export function getLink(path: string): string {
  const alternative = vscode.workspace
    .getConfiguration("cppref.alternative")
    .get("enabled");
  if (alternative) {
    const url = vscode.workspace.getConfiguration("cppref.alternative").get("url")!;
    return url + path;
  } else {
    const lang: string = vscode.workspace.getConfiguration("cppref").get("lang")!;
    return `https://${lang}.cppreference.com/w/${path}`
  }
}

export function getSearchEnginePath(word: string) {
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
