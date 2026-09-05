import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";

const outDir = process.env.SCREENSHOT_DIR ?? "evidence/screenshots";
const sections = [
  "top",
  "proof",
  "problem",
  "how-it-works",
  "features",
  "pricing",
  "promise",
  "faq",
  "cta",
] as const;

test.describe("section screenshots", () => {
  test("390 and 1440", async ({ page }) => {
    mkdirSync(outDir, { recursive: true });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [390, 1440] as const) {
      await page.setViewportSize({
        width,
        height: width === 390 ? 844 : 900,
      });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `${outDir}/home-full-${width}.png`,
        fullPage: true,
      });
      await page.locator("header").screenshot({
        path: `${outDir}/nav-${width}.png`,
      });
      for (const id of sections) {
        const section = page.locator(`#${id}`);
        await section.scrollIntoViewIfNeeded();
        await section.screenshot({
          path: `${outDir}/${id}-${width}.png`,
        });
      }
    }
    for (const path of ["terms", "privacy"] as const) {
      await page.goto(`/${path}`);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: `${outDir}/${path}-390.png`, fullPage: true });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: `${outDir}/${path}-1440.png`, fullPage: true });
    }
  });
});
