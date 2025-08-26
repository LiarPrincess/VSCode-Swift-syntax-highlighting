# Swift + LANGUAGE_NAME

This extension adds LANGUAGE_NAME syntax highlighting in `String` literals.

![example](README_EXAMPLE_IMAGE_URL)

## Extension content

- LANGUAGE_NAME injection grammar (`syntaxes/injection.tmLanguage.json`) that adds syntax highlighting in `String` literals.

- Extension that overrides the `middleware.provideDocumentSemanticTokens` in the official Swift extension to remove the `tokenType` from `String` literals (other token types stay the same). This way the TextMate grammar (including our injection) takes over.

## Q&A

### Why "comment" keyboard shortcut inserts a Swift comment?

Pressing `⌘+/` (`Ctrl+/`) when writing LANGUAGE_NAME inserts a Swift comment (`//`) instead of `README_COMMENT_EXAMPLE`. Workarounds:
- Type it manually
- Add a custom snippet - `⚙️ -> Snippets -> swift`:

  ```json
  "LANGUAGE_NAME_comment": {
    "prefix": "LANGUAGE_NAME_LOWER_comment",
    "body": "README_COMMENT_EXAMPLE"
  },
  ```

### Can you select the `#` count?

Ideally, we would have our own settings where users can select how `#` count corresponds to the highlighted language. For example:

|# count|Language|
|-------|--------|
| #     | HTML   |
| ##    | SQL    |
| ###   | GraphQL|

Unfortunately, changing the grammar file may fail the extension integrity check. See [Allow dynamic location of textmate grammar (vscode#68647)](https://github.com/microsoft/vscode/issues/68647) for details.

Workaround: publish multiple extensions, each with different `#` count, for example: `Swift+LANGUAGE_NAME #`, `Swift+LANGUAGE_NAME ##` etc.
