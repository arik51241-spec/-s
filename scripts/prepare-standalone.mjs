import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const standalone = resolve(root, ".next", "standalone");

if (!existsSync(standalone)) throw new Error("Standalone build was not created");

mkdirSync(resolve(standalone, ".next"), { recursive: true });
cpSync(resolve(root, ".next", "static"), resolve(standalone, ".next", "static"), { recursive: true });
cpSync(resolve(root, "public"), resolve(standalone, "public"), { recursive: true });
