import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type SiteState = {
  countdownOnly: boolean;
  boostVersion: number;
  updatedAt: string;
};

const statePath = path.join(process.cwd(), "data", "site-state.json");
const defaultState: SiteState = {
  countdownOnly: false,
  boostVersion: 1,
  updatedAt: new Date(0).toISOString(),
};

declare global {
  var birthdaySiteState: SiteState | undefined;
}

export async function getSiteState(): Promise<SiteState> {
  if (globalThis.birthdaySiteState) return globalThis.birthdaySiteState;

  try {
    const stored = JSON.parse(await readFile(statePath, "utf8")) as SiteState;
    globalThis.birthdaySiteState = { ...defaultState, ...stored };
  } catch {
    globalThis.birthdaySiteState = { ...defaultState };
  }

  return globalThis.birthdaySiteState;
}

export async function updateSiteState(patch: Partial<SiteState>): Promise<SiteState> {
  const next = { ...(await getSiteState()), ...patch, updatedAt: new Date().toISOString() };
  globalThis.birthdaySiteState = next;

  try {
    await mkdir(path.dirname(statePath), { recursive: true });
    await writeFile(statePath, JSON.stringify(next, null, 2), "utf8");
  } catch {
    // Railway can use a read-only image; in that case state remains live in the server process.
  }

  return next;
}
