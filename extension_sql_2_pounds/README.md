# Swift + SQL

This extension adds SQL syntax highlighting in `String` literals.

![example](https://raw.githubusercontent.com/LiarPrincess/VSCode-Swift-syntax-highlighting/refs/heads/main/extension_sql/example.png)

## Extension content

- SQL injection grammar (`syntaxes/injection.tmLanguage.json`) that adds syntax highlighting in `String` literals.

- Extension that overrides the `middleware.provideDocumentSemanticTokens` in the official Swift extension to remove the `tokenType` from `String` literals (other token types stay the same). This way the TextMate grammar (including our injection) takes over.

## Q&A

### Does it work alongside the [official Swift extension](https://marketplace.visualstudio.com/items?itemName=swiftlang.swift-vscode)?

Yes.

### Which SQL dialect?

This extension uses the official SQL grammar provided by the VSCode. You will get exactly the same result as if you pasted the code in a separate editor/tab.

### How `String` interpolation works?

Following the [SE-0200 -> Customized Escape Delimiters](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0200-raw-string-escaping.md#customized-escape-delimiters):

> Like Swift today, the escape delimiter begins with a backslash (Reverse Solidus, U+005C), but it is now followed by zero or more pound signs (Number Sign, U+0023). An escape delimiter in a string literal must match the number of pound signs used to delimit either end of the string.
>
> ```
> #"This string has an \#(interpolated) item"#
>
> ####"This string has an \####(interpolated) item"####
> ```

TLDR; Use `\##(…)` instead of `\(…)`.

### How does it prevent SQL Injection?

It doesn't. This extension only adds syntax highlighting, there is no Swift runtime component. Please read your database driver documentaition.

### Why "comment" keyboard shortcut inserts a Swift comment?

Pressing `⌘+/` (`Ctrl+/`) when writing SQL inserts a Swift comment (`//`) instead of `-- $1`. Workarounds:
- Type it manually
- Add a custom snippet - `⚙️ -> Snippets -> swift`:

  ```json
  "SQL_comment": {
    "prefix": "sql_comment",
    "body": "-- $1"
  },
  ```

### What is the difference between `Swift+SQL #` and `Swift+SQL ##` extensions?

The number of `#` required to trigger syntax highlighting:
- `Swift+SQL #` uses `#`
- `Swift+SQL ##` uses `##`

### Can you select the `#` count?

Ideally, we would have our own settings where users can select how `#` count corresponds to the highlighted language. For example:

|# count|Language|
|-------|--------|
| #     | HTML   |
| ##    | SQL    |
| ###   | GraphQL|

Unfortunately, changing the grammar file may fail the extension integrity check. See [Allow dynamic location of textmate grammar (vscode#68647)](https://github.com/microsoft/vscode/issues/68647) for details.

Workaround: publish multiple extensions, each with different `#` count, for example: `Swift+SQL #`, `Swift+SQL ##` etc.
