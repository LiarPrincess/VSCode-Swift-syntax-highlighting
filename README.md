# Swift+HTML

## Features

Add HTML syntax highlighting in Swift `String` literals.

## Requirements

The official Swift extension ([swiftlang.swift-vscode](https://marketplace.visualstudio.com/items?itemName=swiftlang.swift-vscode)) is not required, as VSCode has its own syntax highlighting engine, but you probably want it anyway.

## How does it work?

This extension adds:

- HTML injection grammar (`syntaxes/injection.json`) that adds HTML syntax highlighting inside the Swift `String` literals. We cannot use a simple `"include": "text.html.base"` because the `String` literals are already marked as `String` (yellow in the [Dracula theme](https://draculatheme.com/)). Instead we modify [the official HTML grammar](https://github.com/microsoft/vscode/tree/main/extensions/html/syntaxes) to revert the highlight back to “normal” text (white in the [Dracula theme](https://draculatheme.com/)).

- Extension that overrides the `middleware.provideDocumentSemanticTokens` in the official Swift extension to remove the `tokenType` from all of the `String` literals. This way the TextMate grammar (with our `syntaxes/injection.json`) will take over.

Alternatives:

- Remove the `String` tokens, so that the `SemanticTokens` only contain the relevant highlights.
  - This requires recalculation of [`deltaLine/deltaStart`](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_semanticTokens) for all of the tokens. Doable, but not easy.
  - This extension strives to be “0 cost” and token removal means an array allocation via `vscode.SemanticTokensBuilder`.

- Use the [`vscode.languages.registerDocumentSemanticTokensProvider`](https://vscode-api.js.org/interfaces/vscode.DocumentSemanticTokensProvider.html) - this will fight with the official Swift extension as both would have the same `languages.match` score.

- Create our own `vscode-languageclient.LanguageClient` - this would entail writing our own client for the SwiftLSP and then wiring the delegation to the official extension for all of the features we have not implemented. This is not a practical solution.

## Known Issues

None.
