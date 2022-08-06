// @ts-expect-error Importing ESM type to CJS package, see https://github.com/microsoft/TypeScript/issues/46213
export type Index = import("@gytx/cppreference-index").Index<true>;
