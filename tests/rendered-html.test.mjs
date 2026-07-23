import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("birthday world has the personal content and correct date", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
  ]);
  assert.match(page, /13\.08\.2026/);
  assert.match(page, /13 августа/);
  assert.match(page, /her-photo\.jpg/);
  assert.match(page, /gacha-oc\.png/);
  assert.match(layout, /Твоя глава 16/);
});

test("the expanded site contains all interactive birthday chapters", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  for (const text of ["16 ПРИЧИН", "16 КРИСТАЛЛОВ", "СОЗВЕЗДИЕ НАШИХ МОМЕНТОВ", "ПАСПОРТ ТВОЕГО ОС", "ШЕСТЬ ОБЕЩАНИЙ", "ПОДАРКИ, КОТОРЫЕ НЕ ЗАКАНЧИВАЮТСЯ"]) assert.match(page, new RegExp(text));
  assert.doesNotMatch(page, /PixelArena|Drive Ahead|онлайн-комнат/i);
});

test("mood boost is one-time, remembered and has the safe joke", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  assert.match(page, /birthday-boost-13-08-2026/);
  assert.match(page, /localStorage\.setItem/);
  assert.match(page, /disabled=\{boostUsed\}/);
  assert.match(page, /Соси… чупа-чупс/);
  assert.match(page, /Одного буста тебе хватит/);
});

test("mobile layouts are explicitly supported", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  assert.match(css, /@media \(max-width:700px\)/);
  assert.match(css, /@media \(max-width:380px\)/);
  assert.match(css, /-webkit-tap-highlight-color/);
});
