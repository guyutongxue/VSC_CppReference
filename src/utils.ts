import { Index } from "./typing";

export function getIcon(x: Index) {
  switch (x.type) {
    case "symbol": {
      switch (x.symbolType) {
        case "function":
        case "functionTemplate":
        case "niebloid":
          return "symbol-method";
        case "constant":
        case "variableTemplate":
          return "symbol-constant";
        case "macro":
        case "functionLikeMacro":
          return "symbol-numeric";
        case "class":
        case "classTemplate":
        case "classTemplateSpecialization":
          return "symbol-class";
        case "enumeration":
          return "symbol-enum";
        case "enumerator":
          return "symbol-enum-member";
        case "object":
          return "symbol-variable";
        case "namespace":
          return "symbol-namespace";
        case "concept":
          return "symbol-boolean";
        case "typeAlias":
        case "typeAliasTemplate":
          return "symbol-interface";
        case "other":
        default:
          return "symbol-misc";
      }
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
}

export function getDescription(x: Index) {
  switch (x.type) {
    case "symbol":
      if (x.description) return x.description;
      else if (x.symbolType === "macro" && x.name.startsWith("__cpp_"))
        return "[Feature Test Macro]";
      else return " ";
    case "attribute":
      return `[Attribute]`;
    case "header":
      return `[Header] ${x.description}`;
    case "keyword":
      return `[Keyword]`;
    case "preprocessorToken":
      return `[Preprocessor Token]`;
  }
}

export class UserCancelledError extends Error {}
