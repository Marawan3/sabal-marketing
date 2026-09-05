import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..", "src");
const banned = [
  /trusted by/i,
  /game-changing/i,
  /revolutionary/i,
  /AI-powered/i,
  /ranks #1/i,
  /\bsabal\b/i,
  /owner\.com/i,
  /AggregateRating/,
  /"@type":\s*"Review"/,
  /"@type":\s*"AggregateRating"/,
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(tsx|ts)$/.test(entry.name)) out.push(full);
  }
  return out;
}

let failed = false;
for (const file of walk(root)) {
  const text = readFileSync(file, "utf8");
  for (const pattern of banned) {
    if (pattern.test(text)) {
      console.error(`BANNED ${pattern} in ${relative(root, file)}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("copy-lint: no banned claims");
