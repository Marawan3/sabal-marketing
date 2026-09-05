import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";

const outDir = "/opt/cursor/artifacts/screenshots";
const sections = [
  "top",
  "proof",
  "how-it-works",
  "features",
  "pricing",
  "faq",
] as const;

test.describe("section screenshots", () => {
  test("390 and 1440", async ({ page }) => {
    mkdirSync(outDir, { recursive: true });
    for (const width of [390, 1440] as const) {
      await page.setViewportSize({
        width,
        height: width === 390 ? 844 : 900,
      });
      await page.goto("/");
      await page.screenshot({
        path: `${outDir}/home-full-${width}.png`,
        fullPage: true,
      });
      for (const id of sections) {
        const section = page.locator(`#${id}`);
        await section.scrollIntoViewIfNeeded();
        await section.screenshot({
          path: `${outDir}/${id}-${width}.png`,
        });
      }
    }
    await page.goto("/terms");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `${outDir}/terms-390.png`, fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: `${outDir}/terms-1440.png`, fullPage: true });
    await page.goto("/privacy");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `${outDir}/privacy-390.png`, fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: `${outDir}/privacy-1440.png`, fullPage: true });
  });
});
