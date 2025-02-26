# Swift + LANGUAGE_NAME

This extension adds LANGUAGE_NAME syntax highlighting in `String` literals.

![example](example.png)

## Requirements

[The official Swift extension](https://marketplace.visualstudio.com/items?itemName=swiftlang.swift-vscode) is not required, but you probably want it anyway.

## Extension content

- LANGUAGE_NAME injection grammar (`syntaxes/injection.tmLanguage.json`) that adds syntax highlighting in `String` literals.

- Extension that overrides the `middleware.provideDocumentSemanticTokens` in the official Swift extension to remove the `tokenType` from `String` literals (other token types stay the same). This way the TextMate grammar (including our injection) will take over over.

## Known Issues

### Keyboard shortcut inserts a Swift comment

Pressing `⌘+/` (`Ctrl+/`) when writing LANGUAGE_NAME inserts a Swift comment: `//` instead of `README_COMMENT_EXAMPLE`. There is probably a way to avoid this using [Syntax Highlight Guide -> Injection grammars](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide#injection-grammars).

Workarounds:
- Type it manually
- Add a custom snippet - `⚙️ -> Snippets -> LANGUAGE_NAME_LOWER`:

  ```json
  "Comment": {
    "prefix": "comment",
    "body": "README_COMMENT_EXAMPLE"
  },
  ```

### User defined `#` count

Ideally we would have our own settings where users can select how `#` count corresponds to the highlighted language. For example:

|# count|Language|
|-------|--------|
| #     | HTML   |
| ##    | SQL    |
| ###   | GraphQL|

Unfortunately changing the grammar file may fail the extension integrity check.
See [Allow dynamic location of textmate grammar (vscode#68647)](https://github.com/microsoft/vscode/issues/68647) for details.

Workaround: publish multiple extensions each with different `#` count, for example: `Swift+LANGUAGE_NAME#`, `Swift+LANGUAGE_NAME##` etc.
