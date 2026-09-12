/**
 * Capture real WunTab screens into public/shots/ so the site's frames fill.
 *
 *   1. Copy shots.config.example.json to shots.config.json and put a URL on
 *      each key you want captured (leave the rest empty).
 *   2. npm run capture
 *   3. A Chrome window opens. Log in to the dashboard if a URL needs it,
 *      then press Enter in the terminal. Each URL is captured at the right
 *      size and saved as public/shots/<key>.webp.
 *
 * The Chrome profile lives in .capture-profile/ (gitignored) so logins persist.
 * Only capture screens that show real, existing functionality. Blur or avoid
 * real customer names and phone numbers before capturing.
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");
const sharp = require("sharp");

const root = process.cwd();
const configPath = join(root, "shots.config.json");
if (!existsSync(configPath)) {
  console.error("No shots.config.json. Copy shots.config.example.json and add URLs.");
  process.exit(1);
}
const config = JSON.parse(readFileSync(configPath, "utf8"));
const jobs = config.shots.filter((s) => s.url);
if (!jobs.length) {
  console.error("No shots have a url yet.");
  process.exit(1);
}

const outDir = join(root, "public", "shots");
mkdirSync(outDir, { recursive: true });

const context = await chromium.launchPersistentContext(join(root, ".capture-profile"), {
  channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome",
  headless: false,
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
});

const rl = readline.createInterface({ input: stdin, output: stdout });
const first = await context.newPage();
await first.goto(jobs[0].url);
await rl.question("Log in if needed, get the screen looking right, then press Enter to capture all... ");

for (const job of jobs) {
  const phone = job.kind === "phone";
  const page = await context.newPage();
  await page.setViewportSize(phone ? { width: 390, height: 844 } : { width: 1280, height: 800 });
  await page.goto(job.url, { waitUntil: "networkidle" });
  if (job.waitFor) await page.locator(job.waitFor).first().waitFor();
  if (job.settleMs) await page.waitForTimeout(job.settleMs);
  const target = job.selector ? page.locator(job.selector).first() : page;
  const png = await target.screenshot({ type: "png" });
  const out = join(outDir, `${job.key}.webp`);
  await sharp(png).webp({ quality: 84 }).toFile(out);
  console.log(`saved ${out}`);
  await page.close();
}

rl.close();
await context.close();
console.log("Done. Run `npm run build` to see the frames fill, and `npm run docs` to update ASSETS.md.");
