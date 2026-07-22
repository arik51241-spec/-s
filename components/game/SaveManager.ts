import type { GameSettings } from "./types";

const KEY = "sweet16-pixel-arena-v2";
const defaults: GameSettings = { p1Car: "city", p2Car: "monster", p1Color: "#b9ff45", p2Color: "#a875ff", map: "flat", sound: true, difficulty: "normal" };

export function loadSettings(): GameSettings {
  if (typeof window === "undefined") return defaults;
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; }
  catch { return defaults; }
}

export function saveSettings(settings: GameSettings) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(settings));
}

export function saveResult(winner: number, mode: string) {
  if (typeof window === "undefined") return;
  const key = `${KEY}-results`;
  const results = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
  results.unshift({ winner, mode, at: Date.now() });
  localStorage.setItem(key, JSON.stringify(results.slice(0, 20)));
}
