// "c++11" | "c++14" | "c++17" | "c++20" | "c++23" | "tm" | "reflection"
export interface Marks {
  since?: string;
  deprecated?: string;
  removed?: string;
}

interface IndexBase<Type extends string> {
  type: Type;
  name: string;
  link: string;
  marks: Marks;
}

export type DetailedSymbolType =
  | "concept"
  | "class"
  | "classTemplate"
  | "classTemplateSpecialization"
  | "typeAlias"
  | "typeAliasTemplate"
  | "function"
  | "functionTemplate"
  | "enumeration"
  | "enumerator"
  | "macro"
  | "functionLikeMacro"
  | "constant"
  | "niebloid"
  | "object"
  | "variableTemplate"
  | "namespace"
  | "other";
export interface SymbolIndex extends IndexBase<"symbol"> {
  symbolType: DetailedSymbolType;
  note?: string;
  description?: string;
}
export interface HeaderIndex extends IndexBase<"header"> {
  description: string;
}
export interface KeywordIndex extends IndexBase<"keyword"> {
  canBeUsedAsIdentifier: boolean;
}
export interface AttributeIndex extends IndexBase<"attribute"> {
  namespace: string;
}
export interface PreprocessorTokenIndex extends IndexBase<"preprocessorToken"> {
  tokenType:
    | "directiveName"
    | "operator"
    | "replacement"
    | "operatorOutsideDirective";
}

export type Index =
  | SymbolIndex
  | HeaderIndex
  | KeywordIndex
  | AttributeIndex
  | PreprocessorTokenIndex;
