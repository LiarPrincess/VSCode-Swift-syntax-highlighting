#!/usr/bin/env node

// This script generates the extensions from the 'extension_TEMPLATE' directory.

import * as fs from "node:fs/promises";
import * as path from "node:path";

const languages = [
  {
    name: "HTML",
    pounds: "#",
    injectedGrammarName: "text.html.basic",
    embeddedLanguages: {
      "text.html": "html",
      "source.css": "css",
      "source.js": "javascript",
    },
    exampleImageURL: "https://raw.githubusercontent.com/LiarPrincess/VSCode-Swift-syntax-highlighting/refs/heads/main/extension_html/example.png",
    commentExample: "<!-- $1 -->",
  },
  {
    name: "SQL",
    pounds: "##",
    injectedGrammarName: "source.sql",
    embeddedLanguages: {
      "source.sql": "sql",
    },
    exampleImageURL: "https://raw.githubusercontent.com/LiarPrincess/VSCode-Swift-syntax-highlighting/refs/heads/main/extension_sql/example.png",
    commentExample: "-- $1",
  }
];

for (const lang of languages) {
  console.log(`Generating: Swift+${lang.name}`);

  const nameLower = lang.name.toLocaleLowerCase();

  lang.extensionDir = `extension_${nameLower}`;
  lang.replacements = [
    ["LANGUAGE_NAME_LOWER", nameLower],
    ["LANGUAGE_NAME", lang.name],
    // syntaxes/injection.tmLanguage.json
    ["POUNDS", lang.pounds],
    ["INJECTED_GRAMMAR_NAME", lang.injectedGrammarName],
    // Readme.md
    ["README_EXAMPLE_IMAGE_URL", lang.exampleImageURL],
    ["README_COMMENT_EXAMPLE", lang.commentExample],
    // package.json
    // This one is in quotes, so that the 'template/package.json' is a valid JSON.
    ['"PACKAGE_JSON_EMBEDDED_LANGUAGES"', JSON.stringify(lang.embeddedLanguages, null, "  ")],
    // Github
    ["GITHUB_USERNAME", "LiarPrincess"],
    ["GITHUB_URL", "https://github.com/LiarPrincess/VSCode-Swift-syntax-highlighting"],
    ["GITHUB_SPONSOR_URL", "https://github.com/LiarPrincess"],
  ];

  await createDir(lang.extensionDir);
  await copyFile(lang, "package.json");
  await copyFile(lang, "tsconfig.json");
  await copyFile(lang, ".vscodeignore");
  await copyFile(lang, "README.md");
  await copyFile(lang, "CHANGELOG.md");
  await copyFile(lang, "LICENSE");
  await copyDirectory(lang, "src");
  await copyDirectory(lang, "syntaxes");
}

console.log();
console.log("Remember to:");
console.log("- npm i");
console.log("- add 'icon.png' - use 'extension_TEMPLATE/icon.svg' as a template");
console.log("- add 'example.png'");
console.log("- add custom launch/task for running your extension");


// MARK: Copy

/**
 * @param {Object} lang
 * @param {string} dirPathRelative
 */
async function copyDirectory(lang, dirPathRelative) {
  const inDirPath = path.join("extension_TEMPLATE", dirPathRelative);
  const inFiles = await fs.readdir(inDirPath, { recursive: true });

  for (const filePathRelative of inFiles) {
    const inPath = path.join(inDirPath, filePathRelative);
    const inIsFile = await isFile(inPath);

    if (inIsFile) {
      const outPath = path.join(dirPathRelative, filePathRelative);
      await copyFile(lang, outPath);
    }
  }
}

/**
 * @param {Object} lang
 * @param {string} pathRelative
 */
async function copyFile(lang, pathRelative) {
  const inPath = path.join("extension_TEMPLATE", pathRelative);
  const template = await readFile(inPath);
  let content = template;

  if (!!lang.replacements) {
    for (const [before, after] of lang.replacements) {
      content = content.replaceAll(before, after);
    }
  }

  const outPath = path.join(lang.extensionDir, pathRelative);
  const outDir = path.dirname(outPath);
  await createDir(outDir);
  await writeFile(outPath, content);
}

// MARK: Helpers

/**
 * @param {string} path
 */
async function createDir(path) {
  await fs.mkdir(path, { recursive: true });
}

/**
 * @param {string} path
 * @returns {Promise<string>}
 */
async function readFile(path) {
  return await fs.readFile(path, { encoding: "utf8" });
}

/**
 * @param {string} path
 * @param {string} content
 */
async function writeFile(path, content) {
  await fs.writeFile(path, content, { encoding: "utf8" });
}

/**
 * @param {string} path
 * @param {string} content
 * @returns {Promise<boolean>}
 */
async function canReplaceExitingFile(path, content) {
  try {
    const current = await readFile(path);
    return current === content;
  } catch (error) {
    // File does not exist.
    if (error.code === "ENOENT") {
      return true;
    }

    throw error;
  }
}

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function isFile(path) {
  const stat = await fs.stat(path);
  return stat.isFile();
}

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function isDirectory(path) {
  const stat = await fs.stat(path);
  return stat.isDirectory();
}
