import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";

const outDir = process.env.SCREENSHOT_DIR ?? "evidence/screenshots";
const pages = [
  "",
  "how-it-works",
  "pricing",
  "online-ordering",
  "delivery",
  "catering",
  "restaurant-websites",
  "restaurant-seo",
  "order-management",
] as const;

test.describe("screenshots", () => {
  test("every phase-1 page and the menus at 390 and 1440", async ({ page }) => {
    test.setTimeout(120_000);
    mkdirSync(outDir, { recursive: true });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [390, 1440] as const) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const path of pages) {
        await page.goto(`/${path}`);
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: `${outDir}/${path || "home"}-${width}.png`,
          fullPage: true,
        });
      }
      await page.goto("/");
      if (width === 1440) {
        await page.getByRole("button", { name: "Product" }).hover();
        await page.waitForTimeout(200);
        await page.screenshot({
          path: `${outDir}/mega-menu-${width}.png`,
          clip: { x: 0, y: 0, width: 1440, height: 460 },
        });
      } else {
        await page.locator("header summary", { hasText: "Menu" }).click();
        await page.locator("header summary", { hasText: "Sell" }).click();
        await page.screenshot({ path: `${outDir}/mobile-menu-${width}.png` });
      }
    }
  });
});
