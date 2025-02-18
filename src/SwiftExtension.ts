import * as vscode from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

// It seems that the official Swift extension is not on NPM,
// so we have to copy the declarations.

export const id = "swiftlang.swift-vscode";

/**
 * External API as exposed by the extension. Can be queried by other extensions
 * or by the integration test runner for VS Code extensions.
 */
export interface Api {
  workspaceContext?: WorkspaceContext;
  outputChannel: SwiftOutputChannel;
  // activate(): Promise<Api>;
  // deactivate(): Promise<void>;
}

// MARK: OutputChannel

export declare class SwiftOutputChannel /* implements vscode.OutputChannel */ {
  // name: string;
  // private logToConsole;
  // private channel;
  // private logStore;
  // constructor(name: string, logToConsole?: boolean, logStoreLinesSize?: number);
  // append(value: string): void;
  // appendLine(value: string): void;
  // replace(value: string): void;
  // clear(): void;
  // show(_column?: unknown, preserveFocus?: boolean | undefined): void;
  // hide(): void;
  // dispose(): void;
  log(message: string, label?: string): void;
  logDiagnostic(message: string, label?: string): void;
  // get nowFormatted(): string;
  // get logs(): string[];
}

// MARK: WorkspaceContext

/**
 * Context for whole workspace. Holds array of contexts for each workspace folder
 * and the ExtensionContext
 */
export declare class WorkspaceContext /* implements vscode.Disposable */ {
  // tempFolder: TemporaryFolder;
  // outputChannel: SwiftOutputChannel;
  // toolchain: SwiftToolchain;
  // folders: FolderContext[];
  // currentFolder: FolderContext | null | undefined;
  // currentDocument: vscode.Uri | null;
  // statusItem: StatusItem;
  // buildStatus: SwiftBuildStatus;
  languageClientManager: LanguageClientManager;
  // tasks: TaskManager;
  // diagnostics: DiagnosticsManager;
  // subscriptions: vscode.Disposable[];
  // commentCompletionProvider: CommentCompletionProviders;
  // documentation: DocumentationManager;
  // private lastFocusUri;
  // private initialisationFinished;
  // private constructor();
  // stop(): Promise<void>;
  // dispose(): void;
  get swiftVersion(): Version;
  // static create(extensionContext: vscode.ExtensionContext, outputChannel: SwiftOutputChannel, toolchain: SwiftToolchain): Promise<WorkspaceContext>;
  // updateContextKeys(folderContext: FolderContext | null): void;
  // updateContextKeysForFile(): void;
  // updatePluginContextKey(): void;
  // setupEventListeners(): void;
  // addWorkspaceFolders(): Promise<void>;
  // fireEvent(folder: FolderContext | null, operation: FolderOperation): Promise<void>;
  // focusFolder(folderContext: FolderContext | null): Promise<void>;
  // onDidChangeWorkspaceFolders(event: vscode.WorkspaceFoldersChangeEvent): Promise<void>;
  // addWorkspaceFolder(workspaceFolder: vscode.WorkspaceFolder): Promise<void>;
  // searchForPackages(folder: vscode.Uri, workspaceFolder: vscode.WorkspaceFolder): Promise<void>;
  // addPackageFolder(folder: vscode.Uri, workspaceFolder: vscode.WorkspaceFolder): Promise<FolderContext>;
  // removeWorkspaceFolder(workspaceFolder: vscode.WorkspaceFolder): Promise<void>;
  // onDidChangeFolders(listener: (event: FolderEvent) => unknown): vscode.Disposable;
  // onDidChangeSwiftFiles(listener: (event: SwiftFileEvent) => unknown): vscode.Disposable;
  // focusTextEditor(editor?: vscode.TextEditor): Promise<void>;
  // focusUri(uri?: vscode.Uri): Promise<void>;
  // focusPackageUri(uri: vscode.Uri): Promise<void>;
  // private initialisationComplete;
  // private getWorkspaceFolder;
  // private getActiveWorkspaceFolder;
  // private getPackageFolder;
  // isValidWorkspaceFolder(folder: string): Promise<boolean>;
  // private unfocusCurrentFolder;
  // private needToAutoGenerateLaunchConfig;
  // private observers;
  // private swiftFileObservers;
}

export interface VersionInterface {
  major: number;
  minor: number;
  patch: number;
}

export declare class Version implements VersionInterface {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  constructor(major: number, minor: number, patch: number);
  static fromString(s: string): Version | undefined;
  toString(): string;
  isLessThan(rhs: VersionInterface): boolean;
  isGreaterThan(rhs: VersionInterface): boolean;
  isLessThanOrEqual(rhs: VersionInterface): boolean;
  isGreaterThanOrEqual(rhs: VersionInterface): boolean;
}

// MARK: LanguageClient

/**
 * Manages the creation and destruction of Language clients as we move between
 * workspace folders
 */
export declare class LanguageClientManager /* implements vscode.Disposable */ {
  // workspaceContext: WorkspaceContext;
  // private languageClientFactory;
  // static indexingLogName: string;
  // static appleLangDocumentSelector: SourceKitDocumentSelector;
  // static cFamilyDocumentSelector: SourceKitDocumentSelector;
  // static documentationDocumentSelector: SourceKitDocumentSelector;
  // static get documentSelector(): vscode.DocumentSelector;
  // static buildArgumentFilter: ArgumentFilter[];
  /**
   * current running client
   *
   * undefined means not setup
   * null means in the process of restarting
   */
  // private languageClient;
  // private cancellationToken?;
  // private legacyInlayHints?;
  // private peekDocuments?;
  // private getReferenceDocument?;
  // private restartedPromise?;
  // private currentWorkspaceFolder?;
  // private waitingOnRestartCount;
  // private clientReadyPromise?;
  // documentSymbolWatcher?: (document: vscode.TextDocument, symbols: vscode.DocumentSymbol[] | null | undefined) => void;
  // private subscriptions;
  // private singleServerSupport;
  // subFolderWorkspaces: vscode.Uri[];
  // private namedOutputChannels;
  // private swiftVersion;
  /** Get the current state of the underlying LanguageClient */
  // get state(): State;
  // constructor(workspaceContext: WorkspaceContext, languageClientFactory?: LanguageClientFactory);
  // stop(): Promise<void>;
  // dispose(): void;

  /**
   * Use language client safely. Provides a cancellation token to the function
   * which can be used to safely ensure language client request are cancelled
   * if the language is shutdown.
   * @param process process using language client
   * @returns result of process
   */
  useLanguageClient<Return>(process: {
    (
      client: LanguageClient,
      cancellationToken: vscode.CancellationToken
    ): Promise<Return>;
  }): Promise<Return>;

  /** Restart language client */
  // restart(): Promise<void>;
  // get languageClientOutputChannel(): SwiftOutputChannel | undefined;
  // private addFolder;
  // private removeFolder;
  // private addSubFolderWorkspaces;
  // private setLanguageClientFolder;
  // private restartLanguageClient;
  // private isActiveFileInFolder;
  // private setupLanguageClient;
  // private createLSPClient;
  // private initializationOptions;
  // private startClient;
  // private logMessage;
}
