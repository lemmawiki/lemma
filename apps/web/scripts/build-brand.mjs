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

async function render(svgFile, outFile, { width, height, background } = {}) {
  const svg = readFileSync(join(BRAND, svgFile));
  const bg = background ?? { r: 0, g: 0, b: 0, alpha: 0 };
  let pipe = sharp(svg, { density: 600 });
  if (width || height) pipe = pipe.resize(width, height, { fit: "contain", background: bg });
  if (background) pipe = pipe.flatten({ background: bg });
  await pipe.png({ compressionLevel: 9 }).toFile(outFile);
  console.log(`  ${svgFile.padEnd(24)} → ${outFile.replace(REPO + "/", "")}`);
}

// Renders mark.svg padded onto a solid square — for iOS/Android home-screen
// icons, which want opaque squares (and a safe area for "maskable" on Android).
async function renderHomeIcon(outFile, size, { padding = 0.12 } = {}) {
  const svg = readFileSync(join(BRAND, "mark.svg"));
  const inner = Math.round(size * (1 - 2 * padding));
  const mark = await sharp(svg, { density: 600 })
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 3, background: BG },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(outFile);
  console.log(`  mark.svg @${size}            → ${outFile.replace(REPO + "/", "")}`);
}

// Site bg `--color-bg: #faf7f2` (apps/web/src/styles/global.css) — keep these
// in sync so the home-screen icon blends with the site chrome on launch.
const BG = { r: 0xfa, g: 0xf7, b: 0xf2 };

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

// PWA icons — referenced from Base.astro (apple-touch-icon link + manifest).
await renderHomeIcon(join(PUBLIC, "apple-touch-icon.png"), 180);
await renderHomeIcon(join(PUBLIC, "icon-192.png"), 192);
await renderHomeIcon(join(PUBLIC, "icon-512.png"), 512);
// Maskable variant uses extra padding so Android's adaptive-icon mask never
// crops the mark; the spec asks for a 20% safe area on every side.
await renderHomeIcon(join(PUBLIC, "icon-maskable-512.png"), 512, { padding: 0.22 });

console.log("\n[brand] done.");
