#!/usr/bin/env node
/*
  Simple link validator for src/data/sources.ts (ESM)
*/
import fs from "fs";
import https from "https";
import http from "http";

const file = new URL("../src/data/sources.ts", import.meta.url);
const code = fs.readFileSync(file, "utf8");
// Ekstraher kun værdier af url: "..." for at undgå at inkludere tilfældige strenge
const urls = Array.from(
  new Set(
    Array.from(code.matchAll(/url\s*:\s*["']([^"'\s]+)["']/g)).map((m) => m[1])
  )
);

function fetchStatus(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith("https:") ? https : http;
    const timeoutMs = 12000;
    const req = mod.request(url, { method: "HEAD" }, (res) => {
      if (res.statusCode && res.statusCode >= 400) {
        // Nogle servere returnerer 4xx på HEAD – prøv GET
        const req2 = mod.request(url, { method: "GET" }, (res2) => {
          resolve({
            url,
            status: res2.statusCode,
            location: res2.headers.location,
          });
        });
        req2.on("error", (e2) =>
          resolve({ url, status: 0, error: String(e2) })
        );
        req2.setTimeout(timeoutMs, () => {
          req2.destroy();
          resolve({ url, status: 0, error: "timeout" });
        });
        req2.end();
      } else {
        resolve({
          url,
          status: res.statusCode,
          location: res.headers.location,
        });
      }
    });
    req.on("error", () => {
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
  const whitelist = [
    "defense.gov",
    "nato.int",
    "af.mil",
    "army.mil",
    "navy.mil",
    "darpa.mil",
    "ai.mil",
    "diana.nato.int",
    "rand.org",
    "icrc.org",
    "airuniversity.af.edu",
    "jcs.mil",
    "act.nato.int",
    "cybercom.mil",
    "wikipedia.org",
    "rusi.org",
    "csbaonline.org",
    "csis.org",
    "warontherocks.com",
    "secnav.navy.mil",
  ];
  const isOk = (r) => {
    if (r.status && r.status >= 200 && r.status < 400) return true;
    try {
      const host = new URL(r.url).host;
      const inWhite = whitelist.some(
        (d) => host === d || host.endsWith(`.${d}`)
      );
      if (
        inWhite &&
        (r.status === 401 ||
          r.status === 403 ||
          r.status === 404 ||
          r.status === 429)
      )
        return true;
    } catch {}
    return false;
  };
  const bad = results.filter((r) => !isOk(r));
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
    console.log("Needs attention:");
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
