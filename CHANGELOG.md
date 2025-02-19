# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- HTML injection grammar (`syntaxes/injection.json`) that adds HTML syntax highlighting inside the Swift `String` literals.
- Extension that overrides the `middleware.provideDocumentSemanticTokens` in the official Swift extension to remove the `tokenType` from all of the `String` literals. This way the TextMate grammar (with our `syntaxes/injection.json`) will take over.
