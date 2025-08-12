#!/usr/bin/env node
/*
  Simple link validator for src/data/sources.ts
  - Extracts all URLs via regex
  - Requests HEAD (falls back to GET if HEAD not allowed)
  - Prints status table and non-200 codes
*/
import fs from "fs";
import https from "https";
import http from "http";

const file = new URL("../src/data/sources.ts", import.meta.url);
const code = fs.readFileSync(file, "utf8");
const urlRegex = /https?:\/\/[\w\-._~:/?#\[\]@!$&'()*+,;=%]+/g;
const urls = Array.from(new Set(code.match(urlRegex) || []));

function fetchStatus(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith("https:") ? https : http;
    const timeoutMs = 12000;
    const req = mod.request(url, { method: "HEAD" }, (res) => {
      resolve({ url, status: res.statusCode, location: res.headers.location });
    });
    req.on("error", () => {
      // Retry with GET
      const req2 = mod.request(url, { method: "GET" }, (res2) => {
        resolve({
          url,
          status: res2.statusCode,
          location: res2.headers.location,
        });
      });
      req2.on("error", (e2) => resolve({ url, status: 0, error: String(e2) }));
      req2.setTimeout(timeoutMs, () => {
        req2.destroy();
        resolve({ url, status: 0, error: "timeout" });
      });
      req2.end();
    });
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      resolve({ url, status: 0, error: "timeout" });
    });
    req.end();
  });
}

const run = async () => {
  console.log(`Validating ${urls.length} URLs from src/data/sources.ts...`);
  const results = await Promise.all(urls.map(fetchStatus));
  const bad = results.filter(
    (r) => r.status < 200 || r.status >= 400 || r.status === 0
  );
  for (const r of results) {
    console.log(
      `${r.status}\t${r.url}${r.location ? ` -> ${r.location}` : ""}${
        r.error ? ` (${r.error})` : ""
      }`
    );
  }
  console.log("\nSummary:");
  console.log(`OK: ${results.length - bad.length} / ${results.length}`);
  if (bad.length) {
    console.log("Bad/redirect/error:");
    bad.forEach((r) =>
      console.log(` - ${r.status}\t${r.url} ${r.error ? `(${r.error})` : ""}`)
    );
    process.exitCode = 1;
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
