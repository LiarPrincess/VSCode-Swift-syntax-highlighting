Alternative solutions for `extension.ts`.

## Remove the `String` tokens

This way the `SemanticTokens` will only contain the relevant highlights.

Problems:
- This requires recalculation of [`deltaLine/deltaStart`](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_semanticTokens) for all of the tokens. Pretty complicated.
- This extension strives to be “0 cost” and token removal means an array allocation via `vscode.SemanticTokensBuilder`.

## Use the [`vscode.languages.registerDocumentSemanticTokensProvider`](https://vscode-api.js.org/interfaces/vscode.DocumentSemanticTokensProvider.html)

This will fight with the official Swift extension as both would have the same `languages.match` score.

```js
  const documents: vscode.DocumentFilter[] = [
    { scheme: "file", language: "swift" },
    { scheme: "untitled", language: "swift" },
    { scheme: "sourcekit-lsp", language: "swift" },
  ];

  const provider: vscode.DocumentSemanticTokensProvider = {
    async provideDocumentSemanticTokens(
      document: vscode.TextDocument,
      token: vscode.CancellationToken
    ): Promise<vscode.SemanticTokens | undefined | null> {
      // Try if this even works.
      // const builder = new vscode.SemanticTokensBuilder();
      // builder.push(0, 0, 6, 15);
      // return builder.build();

      const clientManager = extensionApi.workspaceContext?.languageClientManager;

      try {
        const XXXXXX = await clientManager?.useLanguageClient(async (client, _) => {
          const params = {
            textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document)
          };

          const raw = await client.sendRequest(protocol.SemanticTokensRequest.type, params, token);
          const tokens = await client.protocol2CodeConverter.asSemanticTokens(raw, token);
          return tokens;
        });

        // Do something with 'XXXXXX'.
      } catch (error) {
        console.log(error);
      }

      return null;
    }
  };

  const legend = SwiftLSP.tokensLegend;
  const disposable = vscode.languages.registerDocumentSemanticTokensProvider(documents, provider, legend);
  context.subscriptions.push(disposable);
```


## Create our own `vscode-languageclient.LanguageClient`

This would entail writing our own client for the SwiftLSP and then wiring the delegation to the official extension for all of the features we have not implemented. This is not a practical solution.

```js
const clientOptions: LanguageClientOptions = {
  documentSelector: documentSelector,
  // Avoid attempting to reinitialize multiple times. If we fail to initialize
  // we aren't doing anything different the second time and so will fail again.
  initializationFailedHandler: () => false,

  middleware: {
    provideDocumentSemanticTokens: async (
      document: vscode.TextDocument,
      token: vscode.CancellationToken,
      next: DocumentSemanticsTokensSignature
    ) => /* vscode.ProviderResult<vscode.SemanticTokens> */ {
      const result = await next(document, token);
      dumpSemanticTokens(result);
      return result;
    }
  }
};

const client = new LanguageClient(
  "swift.sourcekit-lsp",
  "SourceKit Language Server",
  {}, // Can we do this without the server?
  clientOptions
);

return {
  client: this.languageClientFactory.createLanguageClient(
    "swift.sourcekit-lsp",
    "SourceKit Language Server",
    serverOptions,
    clientOptions
  ),
  errorHandler,
};
```
