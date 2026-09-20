import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "src");
const BANNED = [
  /\bsabal\b/i,
  /owner\.com/i,
  /ubereats/i,
  /uber eats/i,
  /doordash/i,
  /grubhub/i,
  /chownow/i,
  /square online/i,
  /\btrusted by\b/i,
  /game-changing/i,
  /revolutionary/i,
  /ranks #1/i,
  /#1 in/i,
  /aggregateRating/i,
  /"@type":\s*"Review"/,
];

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

/**
 * The competitor-name ban protects marketing copy. A privacy policy has the
 * opposite duty: it must name the subprocessors that receive personal data.
 * DoorDash is the delivery provider we actually use, named as such in
 * src/lib/legal.ts. Every other banned pattern, "sabal" included, still
 * applies to that file.
 */
const EXEMPT = new Map([[path.join("src", "lib", "legal.ts"), [/doordash/i]]]);

const files = await walk(ROOT);
let bannedHits = 0;

for (const file of files) {
  const text = await readFile(file, "utf8");
  const rel = path.relative(process.cwd(), file);
  const exempt = EXEMPT.get(rel) ?? [];
  for (const pattern of BANNED) {
    if (exempt.some((e) => e.source === pattern.source)) continue;
    for (const match of text.matchAll(new RegExp(pattern, "gi"))) {
      bannedHits += 1;
      console.error(`BANNED ${rel}: ${match[0]}`);
    }
  }
}

if (bannedHits > 0) {
  process.exit(1);
}

console.log("Honesty check passed.");
