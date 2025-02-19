import * as vscode from "vscode";
import * as SwiftLSP from "./SwiftLSP";
import * as SwiftExtension from "./SwiftExtension";
import { DocumentSemanticsTokensSignature } from "vscode-languageclient";

// MARK: Activate

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const swiftExtension = vscode.extensions.getExtension(SwiftExtension.id);

  if (swiftExtension === undefined) {
    return;
  }

  if (!swiftExtension.isActive) {
    await swiftExtension.activate();
  }

  const swiftExtensionApi: SwiftExtension.Api = swiftExtension.exports;
  const workspaceContext = swiftExtensionApi.workspaceContext;

  if (workspaceContext === undefined) {
    return;
  }

  // Override the 'middleware.provideDocumentSemanticTokens' in the official Swift
  // extension to remove the 'tokenType' from all of the 'String' literals.
  // This way the TextMate grammar (with our 'syntaxes/injection.json') will take over.
  await workspaceContext.languageClientManager.useLanguageClient(async (client, _) => {
    const middleware = client.middleware;
    const original = middleware.provideDocumentSemanticTokens;

    middleware.provideDocumentSemanticTokens = async (
      document: vscode.TextDocument,
      token: vscode.CancellationToken,
      next: DocumentSemanticsTokensSignature
    ): Promise<vscode.SemanticTokens | undefined | null> => {
      let result: vscode.SemanticTokens | undefined | null;

      if (original !== undefined) {
        result = await original(document, token, next);
      } else {
        // This will call the SwiftLSP with 'textDocument/semanticTokens/full'.
        result = await next(document, token);
      }

      if (result !== null && result !== undefined) {
        // https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_semanticTokens
        const tokenTypeOffset = 3;
        const data = result.data;

        for (let index = tokenTypeOffset; index < data.length; index += 5) {
          const tokenType = data[index];

          if (tokenType == SwiftLSP.tokenType_string) {
            data[index] = SwiftLSP.tokenType_unassigned;
          }
        }
      }

      return result;
    };
  });
};

// MARK: Deactivate

// This method is called when your extension is deactivated
export function deactivate() { }

// MARK: Dump

function dumpTokens(tokens: vscode.SemanticTokens | null | undefined) {
  if (tokens === null || tokens === undefined) {
    return;
  }

  const data = tokens.data;
  console.log(`SemanticTokens.length: ${data.length} (mod 5 = ${data.length % 5})`);
  console.log(`Δ line|Δ start|length|Type           |Modifiers`);

  for (let index = 0; index < data.length; index += 5) {
    // Prevent out of bounds.
    // Should not happen under normal conditions.
    //
    // length = 10
    // iter 0: 0 1 2 3 4
    // iter 5: 5 6 7 8 9
    if (index + 4 >= data.length) { break; }

    // https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_semanticTokens
    // Token line number, relative to the start of the previous token
    // Encoded using the encoding the client and server agrees on during the initialize request.
    const deltaLine = data[index];
    // Token start character, relative to the start of the previous token
    // (relative to 0 or the previous token’s start if they are on the same line)
    const deltaStart = data[index + 1];
    // The length of the token.
    // Encoded using the encoding the client and server agrees on during the initialize request.
    const length = data[index + 2];
    // Will be looked up in SemanticTokensLegend.tokenTypes.
    // We currently ask that tokenType < 65536.
    const tokenType = data[index + 3];
    // Each set bit will be looked up in SemanticTokensLegend.tokenModifiers
    const tokenModifiers = data[index + 4];

    const deltaLineStr = String(deltaLine).padStart(6);
    const deltaStartStr = String(deltaStart).padStart(7);
    const lengthStr = String(length).padStart(6);
    const tokenTypeStr = SwiftLSP.tokenTypes[tokenType].padEnd(15);
    const tokenModifiersStr = String(tokenModifiers).padEnd(20);
    console.log(`${deltaLineStr}|${deltaStartStr}|${lengthStr}|${tokenTypeStr}|${tokenModifiersStr}`);
  }
}
