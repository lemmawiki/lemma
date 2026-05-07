// Renders the brand kit's PNG outputs from the SVG sources at /brand/, and
// copies the site-served assets into apps/web/public/.
//
// Run from the workspace root:  pnpm run build:brand
//
// Master sources live at /brand/ (repo root). The Astro app only carries the
// two assets actually referenced from <head>: favicon.svg and og.png. Anything
// else — wordmark PNGs, avatar variants, presentation-size mark PNGs — is a
// derivative produced here and stays under /brand/.
//
// Re-run when any /brand/*.svg changes.

import { readFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..", "..", "..");
const BRAND = join(REPO, "brand");
const PUBLIC = join(REPO, "apps", "web", "public");

mkdirSync(BRAND, { recursive: true });

async function render(svgFile, outFile, { width, height } = {}) {
  const svg = readFileSync(join(BRAND, svgFile));
  let pipe = sharp(svg, { density: 600 });
  if (width || height)
    pipe = pipe.resize(width, height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  await pipe.png({ compressionLevel: 9 }).toFile(outFile);
  console.log(`  ${svgFile.padEnd(24)} → ${outFile.replace(REPO + "/", "")}`);
}

// PNG renders kept at /brand/ as derivatives of the SVG masters.
console.log("[brand] rendering PNG derivatives in /brand/");
await render("mark.svg", join(BRAND, "mark-1024.png"), { width: 1024, height: 1024 });
await render("og.svg", join(BRAND, "og.png"), { width: 1200, height: 630 });
await render("avatar.svg", join(BRAND, "avatar.png"), { width: 1024, height: 1024 });

// Site-served assets — exactly what apps/web references from <head>.
console.log("[brand] syncing site assets in apps/web/public/");
copyFileSync(join(BRAND, "mark.svg"), join(PUBLIC, "favicon.svg"));
console.log(`  mark.svg                 → apps/web/public/favicon.svg`);
copyFileSync(join(BRAND, "og.png"), join(PUBLIC, "og.png"));
console.log(`  og.png                   → apps/web/public/og.png`);

console.log("\n[brand] done.");
