import { expect, test } from "@playwright/test";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { allRoutes } from "../src/lib/site";
import { products } from "../src/lib/catalog";
import { copy } from "../src/lib/copy";
import { findShot, isHeld, isShotVisible } from "../src/lib/shot-files";
import { FITS, homeShots } from "../src/lib/shot-placements";


/**
 * A screenshot frame with no real file in public/shots/ renders nothing.
 * Placeholder boxes went live on wuntab.com on 2026-10-07; this keeps them off.
 */
const PHRASE = "Screenshot placeholder";

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

test("no built page contains a screenshot placeholder", async () => {
  const files = htmlFiles(join(process.cwd(), ".next", "server", "app"));
  expect(files.length, "the build wrote prerendered pages").toBeGreaterThan(10);
  for (const file of files) {
    const html = readFileSync(file, "utf8");
    expect(html, file).not.toContain(PHRASE);
    expect(html, file).not.toContain("data-placeholder");
  }
});

test("no served page contains a screenshot placeholder", async ({ request }) => {
  for (const path of [...allRoutes, "/terms", "/privacy"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).not.toContain(PHRASE);
    expect(html, path).not.toContain("data-placeholder");
  }
});

test("docs/marketing-site/SHOTS.md matches the shot catalog", () => {
  const result = spawnSync(process.execPath, ["scripts/shots-doc.mjs", "--check"], { encoding: "utf8" });
  expect(result.status, result.stderr || result.stdout).toBe(0);
});

/**
 * Screenshots too low-resolution for their frames (1x captures) are held off
 * production until their 3x retakes land (src/lib/shot-files.ts), and leave
 * nothing behind: no image, no empty frame, no saffron hero block, no kitchen
 * band. When a sharper file replaces one, it shows again without a change here.
 */
test("held screenshots render nothing on production, and leave no empty containers", async ({ page }) => {
  const shots = new Map(products.flatMap((p) => p.shots).map((s) => [s.key, s]));
  const held = [...shots.values()].filter(isHeld).map((s) => s.key);
  const allHeld = [...shots.values()].every((s) => !findShot(s.key) || isHeld(s));
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of allRoutes) {
      await page.goto(path);
      const shown = await page.locator("main figure img").evaluateAll((imgs) =>
        imgs.map((img) => decodeURIComponent(img.getAttribute("src") ?? "").match(/shots\/([a-z0-9-]+)\./)?.[1]),
      );
      for (const key of held) expect(shown, `${key} is held but shows on ${path} at ${width}`).not.toContain(key);
      if (allHeld) expect(shown, `${path} at ${width}`).toEqual([]);
      // Nothing empty left behind: no figure without its image, no "Demo restaurant" caption on its own.
      expect(await page.locator("main figure:not(:has(img))").count(), `${path} at ${width}`).toBe(0);
      if (!shown.length) expect(await page.locator("main figcaption").count(), `caption left behind on ${path}`).toBe(0);
    }
    await page.goto("/");
    // Hero: text, the name field and Get Started; no saffron block without its board.
    if (!isShotVisible(homeShots.hero.shots[1], FITS.heroBoard)) {
      await expect(page.locator("#top div.bg-saffron")).toHaveCount(0);
      await expect(page.getByLabel(copy.hero.inputLabel)).toBeVisible();
    }
    // The kitchen band goes with its screenshot.
    if (!isShotVisible(homeShots.kitchen.shots[0], FITS.kitchen)) await expect(page.locator("#kitchen")).toHaveCount(0);
  }
});
