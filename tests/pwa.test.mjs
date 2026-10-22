import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("PWA metadata defines a standalone mobile app", async () => {
  const manifest = await read("app/manifest.ts");
  const layout = await read("app/layout.tsx");
  const icon = await read("public/icon.svg");
  assert.match(manifest, /id:\s*"\/"/);
  assert.match(manifest, /scope:\s*"\/"/);
  assert.match(manifest, /display:\s*"standalone"/);
  assert.match(manifest, /icons:/);
  assert.match(manifest, /src:\s*"\/icon\.svg"/);
  assert.match(layout, /manifest:\s*"\/manifest\.webmanifest"/);
  assert.match(layout, /url:\s*"\/icon\.svg"/);
  assert.match(layout, /appleWebApp:/);
  assert.match(icon, />onWard<\/title>/);
  assert.match(icon, />o<\/text>/);
  assert.match(icon, />nWard<\/text>/);
});

test("PWA service worker registers during ordinary app use and updates safely", async () => {
  const page = await read("app/page.tsx");
  const worker = await read("public/sw.js");
  assert.match(page, /navigator\.serviceWorker\.register\("\/sw\.js"\)/);
  assert.match(worker, /self\.skipWaiting\(\)/);
  assert.match(worker, /self\.clients\.claim\(\)/);
  assert.match(worker, /caches\.match/);
});
