import { expect, test } from "@playwright/test";
import { LEGAL_PLACEHOLDER, legalDocList, legalDocs } from "../src/lib/legal";

/**
 * The hosting contract for the Clover App Market submission.
 * These assertions are the spec: exact routes, 301 aliases, placeholder-only
 * content until the real text lands, noindex and no sitemap entry until then.
 */

test("/privacy and /terms return 200 at the exact path", async ({ request }) => {
  for (const path of ["/privacy", "/terms"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
  }
});

test("aliases 301 to the canonical paths", async ({ request }) => {
  const aliases = [
    ["/privacy-policy", "/privacy"],
    ["/terms-of-service", "/terms"],
  ] as const;
  for (const [from, to] of aliases) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(301);
    expect(response.headers()["location"], from).toBe(to);
  }
});

test("placeholder pages show the title and one line, nothing else", async ({ page }) => {
  for (const doc of legalDocList) {
    test.skip(doc.final, "document is published; placeholder no longer applies");
    await page.goto(`/${doc.slug}`);
    await expect(page.locator("h1")).toHaveText(doc.title);
    const article = page.locator("main article");
    await expect(article.locator("p")).toHaveCount(1);
    await expect(article.locator("p")).toHaveText(LEGAL_PLACEHOLDER);
    await expect(article.locator("h2")).toHaveCount(0);
    await expect(article.locator("img")).toHaveCount(0);
  }
});

test("legal pages are noindex and absent from the sitemap while unpublished", async ({
  request,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const doc of legalDocList) {
    const html = await (await request.get(`/${doc.slug}`)).text();
    if (doc.final) continue;
    expect(html, doc.slug).toMatch(/<meta name="robots" content="noindex/);
    expect(sitemap, doc.slug).not.toContain(`/${doc.slug}</loc>`);
  }
});

test("body text is at least 16px and readable at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const doc of legalDocList) {
    await page.goto(`/${doc.slug}`);
    const size = await page
      .locator("main article p")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size, doc.slug).toBeGreaterThanOrEqual(16);
    // No horizontal overflow on a phone.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, doc.slug).toBeLessThanOrEqual(1);
  }
});

test("every page footer links to both legal routes", async ({ page }) => {
  for (const path of ["/", "/online-ordering", "/pricing", "/terms", "/privacy"]) {
    await page.goto(path);
    await expect(page.locator('footer a[href="/privacy"]'), path).toHaveCount(1);
    await expect(page.locator('footer a[href="/terms"]'), path).toHaveCount(1);
  }
});

test("no cookie banner on the legal pages", async ({ request }) => {
  for (const doc of legalDocList) {
    const html = await (await request.get(`/${doc.slug}`)).text();
    expect(html.toLowerCase(), doc.slug).not.toContain("cookie");
  }
});

test("a published document carries its date, contact email, and cross-link", async () => {
  // Guards the publish checklist: these must all be true the day the text lands.
  for (const doc of legalDocList) {
    if (!doc.final) continue;
    expect(doc.lastUpdated, `${doc.slug} lastUpdated`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(doc.contactEmail, `${doc.slug} contactEmail`).toBeTruthy();
    expect(doc.sections.length, `${doc.slug} sections`).toBeGreaterThan(0);
  }
  if (legalDocs.terms.final) {
    const body = legalDocs.terms.sections.flatMap((s) => s.body).join(" ");
    expect(body, "terms must link to /privacy").toContain("|/privacy]]");
  }
});
