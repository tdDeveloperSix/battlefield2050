#!/usr/bin/env node
/*
  Checks locale JSON files for broken $t(...) references.
  - Scans src/locales/*.json
  - Flattens keys (arrays become dot-indices: a.b.0)
  - Extracts all $t(path.to.key) references in string values
  - Verifies each target exists in the same locale
  - Prints a report and exits 1 if any are missing
*/

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, 'src', 'locales');

function readJson(p) {
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

function flatten(obj, prefix = [], out = {}) {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, prefix.concat(String(i)), out));
  } else if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) flatten(obj[k], prefix.concat(k), out);
  } else if (typeof obj === 'string') {
    out[prefix.join('.')] = obj;
  }
  return out;
}

function extractRefs(map) {
  const refs = [];
  const rx = /\$t\(([^)]+)\)/g; // captures inside $t(...)
  for (const [k, v] of Object.entries(map)) {
    const str = String(v || '');
    let m;
    while ((m = rx.exec(str))) {
      const raw = m[1].trim().replace(/["']/g, '');
      // normalize bracket indices like foo.[0].bar -> foo.0.bar
      const target = raw.replace(/\[(\d+)\]/g, '.$1').replace(/\.\./g, '.');
      refs.push({ from: k, to: target });
    }
  }
  return refs;
}

function main() {
  if (!fs.existsSync(LOCALES_DIR)) {
    console.error('No locales directory at', LOCALES_DIR);
    process.exit(1);
  }
  const files = fs
    .readdirSync(LOCALES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.join(LOCALES_DIR, f));

  let missing = [];
  for (const file of files) {
    const data = readJson(file);
    const flat = flatten(data);
    const keys = new Set(Object.keys(flat));
    const refs = extractRefs(flat);
    const localMissing = refs.filter((r) => !keys.has(r.to));
    if (localMissing.length) {
      console.log(`Missing $t targets in ${path.basename(file)}:`);
      for (const r of localMissing) {
        console.log(` - from ${r.from} -> ${r.to}`);
      }
      missing = missing.concat(localMissing.map((r) => ({ ...r, file })));
    }
  }

  if (missing.length) {
    console.log(`\nSummary: ${missing.length} missing $t reference(s).`);
    process.exit(1);
  } else {
    console.log('All $t references resolve.');
  }
}

main();

