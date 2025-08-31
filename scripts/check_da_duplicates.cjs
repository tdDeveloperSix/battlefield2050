const fs = require("fs");
const path = require("path");

function getAllStringValues(node, currentPath = []) {
  const results = [];
  if (node === null || node === undefined) return results;

  if (typeof node === "string") {
    results.push({
      path: currentPath.join("."),
      value: node,
      norm: node.trim(),
    });
    return results;
  }

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i += 1) {
      results.push(
        ...getAllStringValues(node[i], currentPath.concat(String(i)))
      );
    }
    return results;
  }

  if (typeof node === "object") {
    for (const [key, val] of Object.entries(node)) {
      results.push(...getAllStringValues(val, currentPath.concat(key)));
    }
    return results;
  }

  return results;
}

(function main() {
  const argPath = process.argv[2] || "src/locales/da.json";
  const filePath = path.resolve(process.cwd(), argPath);
  if (!fs.existsSync(filePath)) {
    console.error("MISSING_FILE", filePath);
    process.exit(2);
  }

  const raw = fs.readFileSync(filePath, "utf8");

  // Best-effort dupe key detection from raw text
  const keyRegex = /\"([^\"\\]*(?:\\.[^\"\\]*)*)\"\s*:/g;
  const keyCounts = new Map();
  let m;
  while ((m = keyRegex.exec(raw))) {
    const k = m[1];
    keyCounts.set(k, (keyCounts.get(k) || 0) + 1);
  }
  const dupKeys = [...keyCounts.entries()]
    .filter(([, c]) => c > 1)
    .sort((a, b) => b[1] - a[1]);

  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    console.error("JSON_PARSE_ERROR", e.message);
    process.exit(1);
  }

  const strings = getAllStringValues(json);
  const byValue = new Map();
  const byNorm = new Map();

  for (const item of strings) {
    if (!item.norm) continue;
    // Ignore alias references like $t(path)
    if (/^\$t\(/.test(item.norm)) continue;

    if (!byValue.has(item.value)) byValue.set(item.value, []);
    byValue.get(item.value).push(item.path);

    if (!byNorm.has(item.norm)) byNorm.set(item.norm, []);
    byNorm.get(item.norm).push(item.path);
  }

  const dupValues = [...byValue.entries()]
    .filter(([, arr]) => arr.length > 1)
    .sort((a, b) => b[1].length - a[1].length);
  const dupNorms = [...byNorm.entries()]
    .filter(([, arr]) => arr.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  console.log("RESULT_START");
  console.log("FILE=" + argPath);
  console.log("DUP_KEY_COUNT=" + dupKeys.length);
  console.log("DUP_VALUE_COUNT=" + dupValues.length);
  console.log("DUP_VALUE_TRIMMED_COUNT=" + dupNorms.length);

  const LIMIT = 25;

  console.log("TOP_DUP_VALUES");
  for (const [val, paths] of dupValues.slice(0, LIMIT)) {
    const header = `VAL\t${paths.length}\t` + val.replace(/\n/g, "\\n");
    console.log(header);
    for (const p of paths.slice(0, 10)) console.log("\t" + p);
  }

  console.log("TOP_DUP_VALUES_TRIMMED");
  for (const [val, paths] of dupNorms.slice(0, LIMIT)) {
    const header = `VAL_TRIM\t${paths.length}\t` + val.replace(/\n/g, "\\n");
    console.log(header);
    for (const p of paths.slice(0, 10)) console.log("\t" + p);
  }

  console.log("RESULT_END");
})();
