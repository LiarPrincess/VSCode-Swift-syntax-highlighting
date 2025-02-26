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
    commentExample: "<!-- $1 -->",
  },
  {
    name: "SQL",
    pounds: "##",
    injectedGrammarName: "source.sql",
    embeddedLanguages: {
      "source.sql": "sql",
    },
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
    ["POUNDS", lang.pounds],
    ["INJECTED_GRAMMAR_NAME", lang.injectedGrammarName],
    ["README_COMMENT_EXAMPLE", lang.commentExample],
    // This one is in quotes, so that the 'template/package.json' is a valid JSON!
    ['"PACKAGE_JSON_EMBEDDED_LANGUAGES"', JSON.stringify(lang.embeddedLanguages, null, "  ")],
    // Github
    ["GITHUB_USERNAME", "LiarPrincess"],
    ["GITHUB_REPOSITORY_NAME", "VSCode-Swift-syntax-highlighting"],
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
