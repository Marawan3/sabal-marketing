import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";

const outDir = process.env.SCREENSHOT_DIR ?? "evidence/screenshots";
const homeSections = [
  "top",
  "proof",
  "sell",
  "discovery",
  "delivery",
  "catering",
  "guest",
  "growth",
  "operations",
  "analytics",
  "scale",
  "integrations",
  "pricing",
  "customer-proof",
  "faq",
  "cta",
] as const;
const pages = [
  "online-ordering",
  "delivery",
  "guest-feedback",
  "restaurant-seo",
  "order-management",
  "menu-check",
  "pricing",
  "how-it-works",
  "solutions/independent-restaurants",
  "privacy",
  "terms",
] as const;

test.describe("screenshots", () => {
  test("home sections, mega-menu, and key pages at 390 and 1440", async ({ page }) => {
    mkdirSync(outDir, { recursive: true });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [390, 1440] as const) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${outDir}/home-full-${width}.png`, fullPage: true });
      for (const id of homeSections) {
        const section = page.locator(`#${id}`);
        await section.scrollIntoViewIfNeeded();
        await section.screenshot({ path: `${outDir}/home-${id}-${width}.png` });
      }
      if (width === 1440) {
        await page.getByRole("button", { name: "Product" }).hover();
        await page.waitForTimeout(200);
        await page.screenshot({
          path: `${outDir}/mega-menu-${width}.png`,
          clip: { x: 0, y: 0, width: 1440, height: 520 },
        });
        await page.getByRole("button", { name: "Solutions" }).hover();
        await page.waitForTimeout(200);
        await page.screenshot({
          path: `${outDir}/solutions-menu-${width}.png`,
          clip: { x: 0, y: 0, width: 1440, height: 320 },
        });
        await page.mouse.move(720, 700);
        await page.waitForTimeout(300);
      } else {
        await page.locator("header summary", { hasText: "Menu" }).click();
        await page.locator("header summary", { hasText: "Product" }).click();
        await page.screenshot({ path: `${outDir}/mobile-menu-${width}.png` });
      }
      for (const path of pages) {
        await page.goto(`/${path}`);
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: `${outDir}/${path.replace("/", "-")}-${width}.png`,
          fullPage: true,
        });
      }
    }
  });
});
