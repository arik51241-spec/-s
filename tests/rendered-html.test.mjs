import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("server-renders the birthday site and game", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
  ]);
  assert.match(layout, /Мифический уровень 16/);
  assert.match(page, /PixelArena/);
  assert.match(page, /her-photo\.jpg/);
  assert.doesNotMatch(page + layout, /codex-preview|react-loading-skeleton/);
});

test("arena uses layout-independent two-direction controls", async () => {
  const source = await readFile(new URL("components/PixelArena.tsx", root), "utf8");
  assert.match(source, /event\.code === "KeyA"/);
  assert.match(source, /event\.code === "KeyD"/);
  assert.match(source, /event\.code === "ArrowLeft"/);
  assert.match(source, /event\.code === "ArrowRight"/);
  assert.doesNotMatch(source, /KeyW|KeyF|jump|fire|nitro/i);
});

test("arena ships expanded content and one-time boost", async () => {
  const [config, engine, packageJson] = await Promise.all([
    readFile(new URL("components/game/config.ts", root), "utf8"),
    readFile(new URL("components/game/ArenaEngine.ts", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);
  assert.equal((config.match(/id: "/g) ?? []).length, 27);
  assert.match(engine, /boostTaken = true/);
  assert.match(engine, /лови один буст, тебе хватит/);
  assert.match(packageJson, /"matter-js"/);
});
