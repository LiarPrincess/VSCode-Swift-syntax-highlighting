/**
 * Source: LSP/Sources/LanguageServerProtocol/SupportTypes/SemanticTokens.swift
 */
export const tokenType_string = 18;

/**
 * This will remove the `tokenType`.
 */
export const tokenType_unassigned = 666;

/**
 * Source: LSP/Sources/LanguageServerProtocol/SupportTypes/SemanticTokens.swift
 */
export const tokenTypes = [
  "namespace", // 0
  "type", // 1
  "class", // 2
  "enum", // 3
  "interface", // 4
  "struct",  // 5
  "typeParameter",  // 6
  "parameter",  // 7
  "variable",  // 8
  "property",  // 9
  "enumMember",  // 10
  "event",  // 11
  "function",  // 12
  "method",  // 13
  "macro",  // 14
  "keyword",  // 15
  "modifier",  // 16
  "comment",  // 17
  "string",  // 18
  "number",  // 19
  "regexp",  // 20
  "operator",  // 21
  "decorator",  // 22
  "bracket",  // 23
  "label",  // 24
  "concept",  // 25
  "unknown",  // 26
  "identifier",  // 27
];

/**
 * Source: LSP/Sources/LanguageServerProtocol/SupportTypes/SemanticTokens.swift
 */
export const tokenModifiers = [
  "declaration",
  "definition",
  "readonly",
  "static",
  "deprecated",
  "abstract",
  "async",
  "modification",
  "documentation",
  "defaultLibrary",
  "deduced",
  "virtual",
  "dependentName",
  "usedAsMutableReference",
  "usedAsMutablePointer",
  "constructorOrDestructor",
  "userDefined",
  "functionScope",
  "classScope",
  "fileScope",
  "globalScope",
];
