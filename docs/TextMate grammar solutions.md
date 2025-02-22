# Data

Swift `String` scopes:
- `string.quoted.double.single-line.swift`
- `string.quoted.double.single-line.raw.swift`
- `string.quoted.double.block.swift`
- `string.quoted.double.block.raw.swift`

HTML scopes:
- `text.html.basic` - the full grammar
- `text.html.derivative` - the grammar that [does not highlight invalid tags as red](https://github.com/textmate/html.tmbundle/issues/92)

# Alternative solutions for `injection.tmLanguage.json`.

## Inject into the `String`, include HTML

Wit this all of the tokens not colored by HTML will have the `String` color (for example yellow).

```json
{
  "scopeName": "injection.block.raw.swift-html",
  "injectionSelector": "R:string.quoted.double",
  "patterns": [
    {
      "include": "text.html.derivative"
    }
  ],
  "repository": { }
}
```

## Inject into the `String`, replace fg, include HTML

1. Inject into the `String`
2. Replace the foreground color with white
3. Include HTML

```json
{
  "scopeName": "injection.block.raw.swift-html",
  "injectionSelector": "R:string.quoted.double.block.raw.swift",
  "patterns": [
    {
      "comment":"'begin' is back reference, 'end' is forward reference",
      "name": "punctuation.section.embedded.begin.jsx",
      "begin": "(?<=#+\"\"\")",
      "end": "(?=\"\"\"#+)",
      "patterns": [ { "include": "text.html.basic" } ]
    }
  ],
  "repository": { }
}
```

Problems: there is no uniform “foreground color” among the styles, we would have to approximate it with some scope:

- White
  - `"storage.modifier.import.java"`
  - `"variable.other"`
- Violet
  - `"constant.character"`
  - `"support.variable"`
- Light blue
  - `"entity.name.type"`
  - `"entity.other.inherited-class"`
  - `"support.function"`
  - `"support.class"`
  - `"support.type"`
  - `"support.other"`
- Yellow
  - `"entity.name.section"`
- Orange
  - `"markup.changed"`
  - `"variable.parameter"`


## Inject HTML grammar with fg override

1. Inject into the `String`
2. Use custom HTML grammar to get the correct fg color

```json
{
  "information_for_contributors": [
    "Based on https://github.com/microsoft/vscode/tree/main/extensions/html/syntaxes",
    "",
    "Changes done to remove the 'string' color:",
    "- 'punctuation.definition.tag.begin.html' -> 'variable.other.tag.begin.html'",
    "- 'punctuation.definition.tag.end.html' -> 'variable.other.tag.end.html'"
  ],
  "scopeName": "source.swift.html",
  "injectionSelector": "R:string.quoted.double",
  "patterns": [
    {
      "comment": "<?xml #attribute ?> See https://en.wikipedia.org/wiki/XHTML#XML_declaration",
      "include": "#xml-processing"
    },
    {
      "comment": "<!--…-->",
      "include": "#comment"
    },
    {
      "comment": "<!DOCTYPE html>",
      "include": "#doctype"
    },
    {
      "comment": "<![CDATA[…]]>",
      "include": "#cdata"
    },
    {
      "comment": "<style #attribute>#source.css</style> || <script #attribute>#source.js</script> || <div #attribute> || </div>",
      "include": "#tags-valid"
    },
    {
      "comment": "</?\\w/?>",
      "include": "#tags-invalid"
    },
    {
      "comment": "&amp; || &#38; || &#x38;",
      "include": "#entities"
    }
  ],
  "repository": {
    "HTML_GRAMMAR_GOES_HERE": ""
  }
}
```

Problems:
- there is no uniform “foreground color” among the styles, we would have to approximate it with some scope
- changing the color of the inner text (`<div>THIS</div>`) is very difficult

## Replace the whole Swift grammar

Replace the whole Swift grammar to remove the String literal color and inject HTML.

```json
{
  "information_for_contributors": [
    "Based on https://github.com/microsoft/vscode/blob/main/extensions/swift/syntaxes/swift.tmLanguage.json",
    "",
    "Changes:",
    "- 'string.quoted.double.*' became 'meta.tag.string.quoted.double.*' to remove the 'string' color",
    "- 'string.quoted.double.*' gained 'include: text.html.basic' to highlight HTML"
  ],
  "version": "https://github.com/microsoft/vscode/blob/c9948b69ee93cebd049925aa9d6176589863644c/extensions/swift/syntaxes/swift.tmLanguage.json",
  "name": "Swift",
  "scopeName": "source.swift+html",
  "patterns": [
    { "include": "#root" }
  ],
  "repository": {
    "SWIFT_GRAMMAR_GOES_HERE": "",
    "literals-string": {
      "patterns": [
        {
          "comment": "SE-0168: Multi-Line String Literals",
          "name": "meta.tag.string.quoted.double.block.swift",
          "begin": "\"\"\"",
          "end": "\"\"\"(#*)",
          "beginCaptures": {
            "0": {
              "name": "punctuation.definition.string.begin.swift"
            }
          },
          "endCaptures": {
            "0": {
              "name": "punctuation.definition.string.end.swift"
            },
            "1": {
              "name": "invalid.illegal.extra-closing-delimiter.swift"
            }
          },
          "patterns": [
            {
              "name": "invalid.illegal.content-after-opening-delimiter.swift",
              "match": "\\G.+(?=\"\"\")|\\G.+"
            },
            {
              "name": "constant.character.escape.newline.swift",
              "match": "\\\\\\s*\\n"
            },
            {
              "include": "source.swift#literals-string-string-guts"
            },
            {
              "comment": "Allow \\(\"\"\"...\"\"\") to appear inside a block string",
              "name": "invalid.illegal.content-before-closing-delimiter.swift",
              "match": "\\S((?!\\\\\\().)*(?=\"\"\")"
            },
            {
              "include": "text.html.derivative"
            }
          ]
        },
        {
          "name": "meta.tag.string.quoted.double.single-line.swift",
          "begin": "\"",
          "end": "\"(#*)",
          "beginCaptures": {
            "0": {
              "name": "punctuation.definition.string.begin.swift"
            }
          },
          "endCaptures": {
            "0": {
              "name": "punctuation.definition.string.end.swift"
            },
            "1": {
              "name": "invalid.illegal.extra-closing-delimiter.swift"
            }
          },
          "patterns": [
            {
              "name": "invalid.illegal.returns-not-allowed.swift",
              "match": "\\r|\\n"
            },
            {
              "include": "source.swift#literals-string-string-guts"
            },
            {
              "include": "text.html.derivative"
            }
          ]
        }
      ]
    }
  }
}
```

Problems:
- user hat to manually select the language associated wit the file which disables the official Swift extension.
