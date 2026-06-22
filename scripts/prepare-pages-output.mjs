import { copyFile, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("dist/pages");
const nestedIndex = path.join(outDir, "pages/index.html");
const rootIndex = path.join(outDir, "index.html");
const fallback = path.join(outDir, "404.html");

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

if (await exists(nestedIndex)) {
  await mkdir(outDir, { recursive: true });
  await copyFile(nestedIndex, rootIndex);
  await rm(path.join(outDir, "pages"), { recursive: true, force: true });
}

if (!(await exists(rootIndex))) {
  throw new Error("GitHub Pages index.html was not generated");
}

await copyFile(rootIndex, fallback);
