TextMate grammars are famously undocumented, so here is a dump of some useful links.

## Documentation

Official documentation:
- [12 Language Grammars](https://macromates.com/manual/en/language_grammars) - contains a list of all available scope names.
- [13 Scope Selectors](https://macromates.com/manual/en/scope_selectors) - includes the important “13.3 Excluding Element” section.
- [Blog post](https://macromates.com/blog/2005/language-grammars/) that introduces:
  - `repository`
  - recursion with `$self`
  - back references
  - captures/`beginCaptures`/`endCaptures`/`contentName`

[Oniguruma documentation](https://github.com/kkos/oniguruma/blob/master/doc/RE) - regex engine used by TextMate.

Community resources:
- [A guide to writing a language grammar (TextMate) in Atom by Benjamin Gray](https://gist.github.com/Aerijo/b8c82d647db783187804e86fa0a604a1) - must read!
- [Blog post by Matt Neuburg](https://www.apeth.com/nonblog/stories/textmatebundle.html) - another must read!

- [Github 1](https://github.com/textmate/markdown.tmbundle/issues/15#issuecomment-18321960), [Github 2](https://github.com/microsoft/vscode-textmate/issues/41#issuecomment-347146256) - meaning of the `L:` in `"injectionSelector": "L:source …"`

  > Set Injection Selector to `L:text.html.markdown`. This means the above is injected into Markdown documents, using `L:…` is to make it “left” of existing rules (i.e. before any other rules).

- [StackOverflow](https://stackoverflow.com/a/63876618) - meaning of the ` -comment -string.quoted.double` in `"injectionSelector": "L:source -comment -string.quoted.double"`

  > `injectionScope` controls where the main grammar from a file is injected. `"injectionSelector": L:source.js -comment -string` for example injects the file's main grammar into JavaScript code that is not a string or comment.

- [StackOverflow](https://stackoverflow.com/a/48995978) - meaning of `"include": "text.html.basic"`

  > Syntax highlighting is easy, just include the top level scope of the language to be embeded. Html for example uses "include": "source.js" to add js syntax highlighting inside script blocks.

## VSCode extension

[TextMate Syntax Highlighting and Intellisense](https://marketplace.visualstudio.com/items?itemName=RedCMD.tmlanguage-syntax-highlighter) - use this for formatting and IntelliSense.

## Grammar examples

Official VSCode grammars:
- [html](https://github.com/microsoft/vscode/blob/main/extensions/html/syntaxes)
  - `html.tmLanguage.json` (scope name: `text.html.basic`) is the full grammar
  - `html-derivative.tmLanguage.json` (scope name: `text.html.derivative`) is the grammar that [does not highlight invalid tags as red](https://github.com/textmate/html.tmbundle/issues/92)
- [javascript](https://github.com/microsoft/vscode/blob/main/extensions/javascript/package.json)
- [swift](https://github.com/microsoft/vscode/blob/main/extensions/swift/syntaxes/swift.tmLanguage.json)
- [markdown](https://github.com/microsoft/vscode/blob/main/extensions/markdown-basics/syntaxes/markdown.tmLanguage.json)

[Vapor leaf grammar](https://github.com/franciscoamado/vscode-html-leaf/blob/master/syntaxes/leaf.tmLanguage.json)

[Rust extension to highlight inline SQL strings](https://github.com/barklan/inline_sql_syntax/tree/main) - they use `injectionSelector: "L:source -comment -string"`:

```json
{
  "scopeName": "c-sharp-multiline.injection",
  "fileTypes": [ "cs" ],
  "injectionSelector": [ "L:source -comment -string" ],
  "patterns": [
    {
      "comment": "C# multi-lines strings",
      "begin": "(@\")(--\\s*sql)",
      "beginCaptures": { "2": { "name": "comment.sql" } },
      "end": "(\")",
      "patterns": [ { "include": "source.sql" } ]
    },
    {
      "comment": "C# multi-lines strings",
      "begin": "(@\")(SELECT |INSERT INTO |DELETE |UPDATE |CREATE TABLE |CREATE INDEX)",
      "beginCaptures": { "2": { "name": "keyword.sql" } },
      "end": "(\")",
      "patterns": [ { "include": "source.sql" } ]
    }
  ]
}
```
