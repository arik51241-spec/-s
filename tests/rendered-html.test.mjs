import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("birthday story contains the personal content and correct date", async () => {
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

test("the vehicle game is removed from the visible site", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  assert.doesNotMatch(page, /PixelArena|Drive Ahead|онлайн-комнат/i);
  assert.match(page, /16 ПРИЧИН/);
  assert.match(page, /16 КРИСТАЛЛОВ/);
  assert.match(page, /ПОДАРКИ, КОТОРЫЕ НЕ ЗАКАНЧИВАЮТСЯ/);
});

test("mood boost is one-time and remembered on the device", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  assert.match(page, /birthday-boost-13-08-2026/);
  assert.match(page, /localStorage\.setItem/);
  assert.match(page, /disabled=\{boostUsed\}/);
  assert.match(page, /Одного буста тебе хватит/);
});
