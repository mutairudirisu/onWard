import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("theme preference is persisted and has dark-mode styling", async () => {
  const page = await read("app/page.tsx");
  const styles = await read("app/globals.css");

  assert.match(page, /localStorage\.getItem\("onward-theme"\)/);
  assert.match(page, /document\.documentElement\.dataset\.theme = theme/);
  assert.match(page, /localStorage\.setItem\("onward-theme", theme\)/);
  assert.match(styles, /:root\[data-theme="dark"\]/);
  assert.match(styles, /journey-dashboard/);
});
