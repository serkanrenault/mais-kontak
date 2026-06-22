import { copyFile, mkdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("dist/pages");
const nestedIndex = path.join(outDir, "pages/index.html");
const rootIndex = path.join(outDir, "index.html");
const fallback = path.join(outDir, "404.html");
const pagesBasePath = "/mais-kontak/";
const routePaths = ["login", "send", "templates", "history", "profile", "logs"];

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

for (const routePath of routePaths) {
  const routeDir = path.join(outDir, routePath);
  await mkdir(routeDir, { recursive: true });
  await copyFile(rootIndex, path.join(routeDir, "index.html"));
}

const fallbackHtml = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mais Kontak</title>
    <script>
      (function () {
        var basePath = ${JSON.stringify(pagesBasePath)};
        var pathname = window.location.pathname;
        var relativePath = pathname.indexOf(basePath) === 0 ? pathname.slice(basePath.length) : "";
        var hashPath = relativePath ? "/" + relativePath.replace(/^\\/+|\\/+$/g, "") : "/";
        window.location.replace(basePath + "#" + hashPath + window.location.search + window.location.hash);
      })();
    </script>
  </head>
  <body></body>
</html>
`;

await writeFile(fallback, fallbackHtml);
