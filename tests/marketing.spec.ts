import { expect, test } from "@playwright/test";
import { copy } from "../src/lib/copy";
import { demoHref } from "../src/lib/site";

const pages = ["/", "/terms", "/privacy"] as const;

test("first-response HTML contains the hero headline and all three proof stats", async ({
  request,
}) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain(copy.hero.headline);
  for (const card of copy.proof.cards) {
    expect(html).toContain(card.body);
  }
  expect(html).toContain(copy.proof.aiLine);
});

test("nav anchors exist and the demo CTA uses the placeholder href", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#how-it-works")).toBeVisible();
  await expect(page.locator("#proof")).toBeVisible();
  await expect(page.locator("#pricing")).toBeVisible();
  await expect(page.locator("#faq")).toBeVisible();

  await page.locator('header a[href="/#proof"]').first().click();
  await expect(page.locator("#proof")).toBeInViewport();

  await expect(page.locator(`header a[href="${demoHref}"]`).first()).toBeVisible();
});

test("legal pages return 200", async ({ request }) => {
  for (const path of ["/terms", "/privacy"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html).toContain("coming soon");
  }
});

test("rendered HTML never contains Sabal", async ({ request }) => {
  for (const path of pages) {
    const html = await (await request.get(path)).text();
    expect(html, path).not.toMatch(/sabal/i);
  }
});
