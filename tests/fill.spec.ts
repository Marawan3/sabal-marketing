import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { builtProducts, bySlug, productHref, products, secondaryProducts, solutionHref, solutions } from "../src/lib/catalog";
import { copy } from "../src/lib/copy";
import { demoHref, demoStorefront } from "../src/lib/site";

/**
 * Filling the dead ends (owner, 2026-10-13): six secondary product pages,
 * Works with that always links, founding restaurants on the homepage, the
 * /pricing comparison, the demo link behind its flag, and /how-it-works'
 * new stage visuals.
 */

const secondary = ["online-menu", "upsells", "loyalty", "kitchen-display", "menu-management", "payments"];

test("the six secondary pages exist, stay out of the mega-menu, and are in the footer and their parents' Works with", async ({ page, request }) => {
  expect([...secondaryProducts].sort()).toEqual([...secondary].sort());
  for (const slug of secondary) {
    expect(builtProducts as readonly string[], slug).toContain(slug);
    expect((await request.get(`/${slug}`)).status(), slug).toBe(200);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const nav = page.locator('header nav[aria-label="Primary"]');
  await nav.getByRole("button", { name: "Product" }).hover();
  for (const slug of secondary) await expect(nav.locator(`a[href="/${slug}"]`), slug).toHaveCount(0);
  for (const slug of secondary) await expect(page.locator(`footer a[href="/${slug}"]`), slug).toHaveCount(1);
  // Each is linked from at least one other page's Works with.
  for (const slug of secondary) {
    const parents = products.filter((p) => productHref(p.slug) && p.slug !== slug && p.related.includes(slug));
    expect(parents.length, slug).toBeGreaterThan(0);
  }
});

test("Works with: every item on every page links to a page, and Restaurant Listings is gone", async ({ page }) => {
  const paths = [...builtProducts.map((s) => `/${s}`), ...solutions.map((s) => solutionHref(s.slug)), "/how-it-works"];
  for (const path of paths) {
    await page.goto(path);
    // No chip without a link.
    expect(await page.locator("#works-with li:not(:has(a))").count(), path).toBe(0);
    for (const href of await page.locator("#works-with a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!))) {
      expect(builtProducts.map((s) => `/${s}`), `${path} → ${href}`).toContain(href);
    }
    await expect(page.locator("main"), path).not.toContainText("Restaurant Listings");
  }
  for (const p of products) expect(p.related, p.slug).not.toContain("listings");
});

test("the secondary pages say only what the product does", async ({ page }) => {
  await page.goto("/upsells");
  const upsells = (await page.locator("main").innerText()).toLowerCase();
  expect(upsells).toContain("goes well with");
  expect(upsells).not.toMatch(/\bai\b|smart|machine learning|personaliz/);
  expect(bySlug.upsells.name).toBe("Recommended Add-ons");

  await page.goto("/loyalty");
  const loyalty = (await page.locator("main").innerText()).toLowerCase();
  expect(loyalty).not.toMatch(/\bpoints?\b|\btiers?\b|\bapp\b|download/);
  const register = readFileSync(join(process.cwd(), "docs/marketing-site/REGISTER.md"), "utf8");
  expect(register).toMatch(/Loyalty \/ rewards \| \/loyalty \|[^\n]*build commitment/);

  await page.goto("/payments");
  const payments = await page.locator("main").innerText();
  expect(payments).toContain("never reach WunTab");
  expect(payments).toContain("card brand and last four digits");
  // Money settles to one platform account today (REGISTER.md, Conflict 2): no "your account" here.
  expect(payments.toLowerCase()).not.toMatch(/your (own )?(bank|payment)? ?account|merchant of record/);

  await page.goto("/menu-management");
  const menu = await page.locator("main").innerText();
  expect(menu).not.toMatch(/kiosk|table ordering|day and time/i);

  await page.goto("/online-menu");
  await expect(page.locator("main")).toContainText("comes off the menu until you put it back");
});

test("founding restaurants: in the customer row's slot, three points and one Get Started", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const ids = await page.locator("main > section").evaluateAll((els) => els.map((el) => el.id));
    expect(ids.slice(0, 3)).toEqual(["top", "founding", "outcomes"]);
    const founding = page.locator("#founding");
    await expect(founding.locator("h2")).toHaveText(copy.founding.heading);
    expect(await founding.locator("li").allTextContents()).toEqual(copy.founding.points);
    const links = founding.locator("a");
    await expect(links).toHaveCount(1);
    await expect(links).toHaveText(copy.cta.primary);
    await expect(links).toHaveAttribute("href", demoHref);
  }
  // The homepage FAQ left to make room; its questions are on /pricing and the product pages.
  const html = await (await page.request.get("/")).text();
  expect(html).not.toContain(copy.faq.heading);
});

test("/pricing: WunTab next to a delivery app, under the $0 card, no app named, no sideways scroll", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/pricing");
    const ids = await page.locator("main > section").evaluateAll((els) => els.map((el) => el.id));
    expect(ids.indexOf("compare")).toBe(2);
    // The receipt sits beside the card.
    await expect(page.locator('main [data-visual="receipt"]')).toHaveCount(1);
    const table = page.locator("[data-compare]");
    await expect(table.locator("thead th")).toContainText([copy.pricing.compare.us, copy.pricing.compare.them]);
    expect(await table.locator("tbody th").allTextContents()).toEqual(copy.pricing.compare.rows.map((r) => r.label));
    for (const row of copy.pricing.compare.rows) {
      await expect(table).toContainText(row.us);
      await expect(table).toContainText(row.them);
    }
    const text = await table.innerText();
    expect(text).not.toMatch(/doordash|uber|grubhub|postmates|caviar/i);
    const box = (await table.boundingBox())!;
    expect(box.x + box.width, `fits at ${width}`).toBeLessThanOrEqual(width);
  }
  // Every cell is sourced in COPY.md.
  const copyMd = readFileSync(join(process.cwd(), "COPY.md"), "utf8");
  for (const row of copy.pricing.compare.rows) expect(copyMd, row.label).toContain(row.label);
});

test("the demo link stays off until its flag is on", async ({ page }) => {
  expect(demoStorefront.on).toBe(false);
  expect(demoStorefront.href).toBe("https://demo.wuntab.com");
  for (const path of ["/", "/restaurant-websites"]) {
    await page.goto(path);
    await expect(page.getByText(demoStorefront.label), path).toHaveCount(0);
  }
});

test("/how-it-works: the reward card builds the relationship; the confirmation text brings them back", async ({ page }) => {
  await page.goto("/how-it-works");
  const rows = page.locator("main ol > li");
  await expect(rows.nth(4).locator('[data-visual="loyalty"]')).toHaveCount(1);
  await expect(rows.nth(5).locator('[data-visual="sms"]')).toHaveCount(1);
  // The product's own text: it has no "ready" text.
  await expect(rows.nth(5)).toContainText("is confirmed.");
  await expect(rows.nth(5)).not.toContainText(/ready/i);
});
