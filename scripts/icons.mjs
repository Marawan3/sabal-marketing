/**
 * Generate raster icons from the locked tile geometry (wuntab-rebrand-spec.md §2).
 * Uses sharp, which ships with Next. Run: node scripts/icons.mjs
 * Writes src/app/favicon.ico (16/32/48), src/app/apple-icon.png (180).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const INK = "#17352A";
const SAFFRON = "#F2B33D";

function tileSvg(size) {
  // §2b: stroke 6 at ≤24px, 5 at ≤40px, else 4.5. rx scales with the viewBox.
  const stroke = size <= 24 ? 6 : size <= 40 ? 5 : 4.5;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="${size}" height="${size}">
  <rect x="0" y="0" width="56" height="56" rx="14" fill="${INK}"/>
  <polyline points="11,22 18,39 28,12 38,39 45,22" fill="none" stroke="${SAFFRON}"
    stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  );
}

async function png(size) {
  return sharp(tileSvg(size), { density: 384 }).resize(size, size).png().toBuffer();
}

/** ICO container with PNG-encoded entries (supported by every current browser). */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  entries.forEach(({ size, buf }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.buf)]);
}

const appDir = join(process.cwd(), "src", "app");
const outDir = process.argv[2] ?? appDir;
mkdirSync(outDir, { recursive: true });

const sizes = [16, 32, 48];
const entries = [];
for (const size of sizes) {
  const buf = await png(size);
  entries.push({ size, buf });
  if (outDir !== appDir) writeFileSync(join(outDir, `favicon-${size}.png`), buf);
}
writeFileSync(join(outDir, "favicon.ico"), ico(entries));
writeFileSync(join(outDir, "apple-icon.png"), await png(180));
console.log(`icons written to ${outDir}`);
