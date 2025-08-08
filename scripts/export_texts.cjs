/*
  Exporter brødtekst fra i18n JSON-filer til flade .txt filer for nem redigering.
  Kør: node scripts/export_texts.cjs
*/

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, "src", "locales");
const OUTPUT_DA = path.join(ROOT, "content_da.txt");
const OUTPUT_EN = path.join(ROOT, "content_en.txt");

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function flatten(obj, prefix = "") {
  const lines = [];

  const helper = (value, currentPath) => {
    if (typeof value === "string") {
      lines.push({ key: currentPath, value });
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        helper(item, `${currentPath}[${index}]`);
      });
      return;
    }

    if (isPlainObject(value)) {
      for (const k of Object.keys(value)) {
        const nextPath = currentPath ? `${currentPath}.${k}` : k;
        helper(value[k], nextPath);
      }
      return;
    }

    // Ignore non-string primitives/null/undefined, but keep a placeholder if needed
    // lines.push({ key: currentPath, value: String(value) });
  };

  helper(obj, prefix);
  return lines;
}

function writeTxt(filePath, flatPairs, header) {
  const content = [
    `# ${header}`,
    `# Auto-genereret ${new Date().toISOString()}`,
    `# Format: sti.nøgle[optionalIndex]: værdi`,
    "",
    ...flatPairs.map(({ key, value }) => `${key}: ${value}`),
    "",
  ].join("\n");
  fs.writeFileSync(filePath, content, "utf8");
}

function main() {
  const daPath = path.join(LOCALES_DIR, "da.json");
  const enPath = path.join(LOCALES_DIR, "en.json");

  if (!fs.existsSync(daPath)) {
    console.error("Mangler src/locales/da.json");
    process.exit(1);
  }
  if (!fs.existsSync(enPath)) {
    console.error("Mangler src/locales/en.json");
    process.exit(1);
  }

  const da = loadJson(daPath);
  const en = loadJson(enPath);

  const flatDa = flatten(da);
  const flatEn = flatten(en);

  writeTxt(OUTPUT_DA, flatDa, "Dansk brødtekst (content_da.txt)");
  writeTxt(OUTPUT_EN, flatEn, "Engelsk brødtekst (content_en.txt)");

  console.log("Skrev:", OUTPUT_DA, "og", OUTPUT_EN);
}

main();
