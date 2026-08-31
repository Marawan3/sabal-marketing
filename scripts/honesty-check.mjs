import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "src");
const BANNED =
  /\b(trusted by|game-changing|revolutionary|ranks #1|#1 in|aggregateRating|"Review"|star rating)\b/gi;
const WATCH = /(%|guarantee|#1|trusted by|reviews)/gi;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(tsx|ts|md)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const files = await walk(ROOT);
let bannedHits = 0;
const watchHits = [];

for (const file of files) {
  const text = await readFile(file, "utf8");
  const rel = path.relative(process.cwd(), file);
  for (const match of text.matchAll(BANNED)) {
    bannedHits += 1;
    console.error(`BANNED ${rel}: ${match[0]}`);
  }
  for (const match of text.matchAll(WATCH)) {
    watchHits.push(`${rel}: ${match[0]}`);
  }
}

if (watchHits.length) {
  console.log("Review these hits (allowed if they are honest or UI chrome):");
  for (const hit of watchHits) console.log(`  ${hit}`);
}

if (bannedHits > 0) {
  process.exit(1);
}

console.log("Honesty check passed.");
