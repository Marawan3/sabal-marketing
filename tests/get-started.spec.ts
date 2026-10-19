import { expect, test } from "@playwright/test";
import { copy } from "../src/lib/copy";

/**
 * Get Started goes to the /contact form as a call request (owner,
 * 2026-10-19): a mailto link did nothing on phones without a mail app. These
 * run in WebKit on an iPhone profile too (playwright.config.ts). Nothing is
 * sent here; tests/upgrade.spec.ts sends, to a stand-in email server.
 */

const c = copy.contact;

test("the hero's Get Started carries the name to the form, which asks for a call", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel(copy.hero.inputLabel).fill("Palm & Stone");
  await page.locator("#top form").getByRole("button", { name: copy.cta.primary }).click();
  await page.waitForURL(/\/contact\?/);
  const url = new URL(page.url());
  expect(url.searchParams.get("intent")).toBe("call");
  expect(url.searchParams.get("restaurant")).toBe("Palm & Stone");
  await expect(page.locator("h1")).toHaveText(c.callIntent.headline);
  await expect(page.locator("main")).toContainText(c.callIntent.line);
  await expect(page.getByLabel(c.fields.restaurant)).toHaveValue("Palm & Stone");
  await expect(page.getByLabel(c.fields.message)).toHaveValue(c.callIntent.message);
  await expect(page.getByLabel(c.callIntent.phone, { exact: true })).toBeVisible();
  await expect(page.locator('main input[name="intent"]')).toHaveValue("call");
});

test("with no name typed, the hero's Get Started goes to the call form with the Restaurant field empty", async ({ page }) => {
  await page.goto("/");
  await page.locator("#top form").getByRole("button", { name: copy.cta.primary }).click();
  await page.waitForURL(/\/contact\?intent=call$/);
  await expect(page.locator("h1")).toHaveText(c.callIntent.headline);
  await expect(page.getByLabel(c.fields.restaurant)).toHaveValue("");
});

test("the header's Get Started goes to the form as a call request", async ({ page }) => {
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/pricing");
    await page.locator("header").getByRole("link", { name: copy.cta.primary }).first().click();
    await page.waitForURL(/\/contact\?intent=call$/);
    await expect(page.locator("h1")).toHaveText(c.callIntent.headline);
    await expect(page.getByLabel(c.fields.restaurant)).toHaveValue("");
  }
});

test("the final band's Get Started goes to the form as a call request", async ({ page }) => {
  await page.goto("/delivery");
  await page.locator("#cta").getByRole("link", { name: copy.cta.primary }).click();
  await page.waitForURL(/\/contact\?intent=call$/);
  await expect(page.locator("h1")).toHaveText(c.callIntent.headline);
});
