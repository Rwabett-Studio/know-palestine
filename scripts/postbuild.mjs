/**
 * postbuild.mjs
 * Generates dist/client/index.html after `vite build`.
 *
 * TanStack Start with target:"static" outside the Lovable sandbox skips the
 * Nitro pre-render step, so no index.html is produced. This script fills that
 * gap: it scans dist/client/assets/ for the main bundle + CSS, then writes a
 * minimal HTML shell that Vercel (and any static host) can serve.
 */

import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const assetsDir = "dist/client/assets";
const outFile = "dist/client/index.html";

// ── 1. find the CSS file ────────────────────────────────────────────────────
const allFiles = readdirSync(assetsDir);
const cssFile = allFiles.find((f) => f.endsWith(".css"));

// ── 2. find the main JS bundle (largest index-*.js) ────────────────────────
const mainBundle = allFiles
  .filter((f) => f.startsWith("index-") && f.endsWith(".js"))
  .map((f) => ({ name: f, size: statSync(join(assetsDir, f)).size }))
  .sort((a, b) => b.size - a.size)[0];

if (!mainBundle) {
  throw new Error("postbuild: could not find main JS bundle in " + assetsDir);
}

console.log(`postbuild: main bundle  → /assets/${mainBundle.name} (${(mainBundle.size / 1024).toFixed(0)} KB)`);
if (cssFile) console.log(`postbuild: stylesheet   → /assets/${cssFile}`);

// ── 3. write index.html ─────────────────────────────────────────────────────
const html = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>إعرف فلسطين — Know Palestine</title>
    <meta name="description" content="منصة رقمية لتوثيق فلسطين: مدنها وتاريخها وشخصياتها." />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
    />
  </head>
  <body>
    <script type="module" src="/assets/${mainBundle.name}"></script>
  </body>
</html>
`;

writeFileSync(outFile, html, "utf-8");
console.log(`postbuild: ✅ wrote ${outFile}`);
