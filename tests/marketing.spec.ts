import { expect, test } from "@playwright/test";
import { copy } from "../src/lib/copy";
import { demoHref } from "../src/lib/site";

const pages = ["/", "/terms", "/privacy"] as const;

test("first-response HTML contains the headline and the proof tickets", async ({
  request,
}) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain(copy.hero.headline);
  expect(html).toContain(copy.proof.left.title);
  expect(html).toContain(copy.proof.right.title);
  for (const dish of copy.proof.right.dishes) {
    expect(html).toContain(dish);
  }
  expect(html).toContain(String(copy.proof.right.total));
  expect(html).toContain(copy.proof.aiLine);
  expect(html).toContain(copy.pricing.body);
});

test("nav anchors exist and the book-a-call CTA is in the header", async ({
  page,
}) => {
  await page.goto("/");
  for (const id of ["proof", "how-it-works", "pricing", "faq", "cta"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }

  await page.locator('header a[href="/#proof"]').first().click();
  await expect(page.locator("#proof")).toBeInViewport();

  await expect(page.locator(`header a[href="${demoHref}"]`).first()).toBeVisible();
});

test("the header CTA stays visible on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(`header a[href="${demoHref}"]`).first()).toBeVisible();
});

test("legal pages return 200", async ({ request }) => {
  for (const path of ["/terms", "/privacy"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html).toContain("This document is being finalized.");
  }
});

test("rendered HTML never contains Sabal", async ({ request }) => {
  for (const path of pages) {
    const html = await (await request.get(path)).text();
    expect(html, path).not.toMatch(/sabal/i);
  }
});

test("favicon and apple icon are served", async ({ request }) => {
  for (const path of ["/favicon.ico", "/apple-icon.png", "/icon.svg"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});
