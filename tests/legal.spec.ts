import { expect, test } from "@playwright/test";
import {
  DATA_CLAUSE,
  ENTITY,
  EXIT_EXPORT,
  LEGAL_PLACEHOLDER,
  legalDocList,
  legalDocs,
  SERVICE_FEE_CLAUSE,
  UNBUILT_FEATURES,
  unresolvedMarkers,
} from "../src/lib/legal";

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

test("indexing and sitemap follow the published state", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const doc of legalDocList) {
    const html = await (await request.get(`/${doc.slug}`)).text();
    if (doc.final) {
      // Published: no forced noindex, and in the sitemap.
      expect(html, doc.slug).not.toMatch(/<meta name="robots" content="noindex/);
      expect(sitemap, doc.slug).toContain(`/${doc.slug}</loc>`);
    } else {
      expect(html, doc.slug).toMatch(/<meta name="robots" content="noindex/);
      expect(sitemap, doc.slug).not.toContain(`/${doc.slug}</loc>`);
    }
  }
});

test("a published document renders its date, headings and contact details", async ({
  request,
}) => {
  for (const doc of legalDocList) {
    if (!doc.final) continue;
    const html = await (await request.get(`/${doc.slug}`)).text();
    expect(html, `${doc.slug} last updated`).toContain("Last updated");
    expect(html, `${doc.slug} date`).toContain("September 20, 2026");
    expect(html, `${doc.slug} entity`).toContain("Sabal Pay LLC");
    expect(html, `${doc.slug} address`).toContain("1802 N Alafaya Trail");
    expect(html, `${doc.slug} phone`).toContain("(407) 655-8761");
    expect(html, `${doc.slug} email`).toContain("support@wuntab.com");
    expect(html, `${doc.slug} placeholder gone`).not.toContain(LEGAL_PLACEHOLDER);
  }
  const terms = await (await request.get("/terms")).text();
  expect(terms, "governing law").toContain("Orange County, Florida");
  expect(terms, "links to the privacy policy").toContain('href="/privacy"');
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
  for (const path of ["/", "/terms", "/privacy"]) {
    await page.goto(path);
    await expect(page.locator('footer a[href="/privacy"]'), path).toHaveCount(1);
    await expect(page.locator('footer a[href="/terms"]'), path).toHaveCount(1);
  }
});

test("no cookie banner on the legal pages", async ({ request }) => {
  // The privacy policy legitimately says the word "cookie": it discloses that
  // request cookies are stripped before anything reaches error monitoring.
  // What must not exist is a consent banner, so look for that, not the word.
  const banner = [
    "accept cookies",
    "accept all cookies",
    "we use cookies",
    "cookie consent",
    "cookie preferences",
    "manage cookies",
    "cookie settings",
  ];
  for (const doc of legalDocList) {
    const html = (await (await request.get(`/${doc.slug}`)).text()).toLowerCase();
    for (const phrase of banner) {
      expect(html, `${doc.slug}: "${phrase}"`).not.toContain(phrase);
    }
  }
});

const textOf = (doc: (typeof legalDocList)[number]) =>
  doc.sections.flatMap((s) => [s.heading, ...s.body]).join("\n");

test("a published document carries its date and has no unresolved markers", async () => {
  // Guards the publish checklist: these must all be true the day the text lands.
  for (const doc of legalDocList) {
    if (!doc.final) continue;
    expect(doc.lastUpdated, `${doc.slug} lastUpdated`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(doc.sections.length, `${doc.slug} sections`).toBeGreaterThan(0);
    // [ENTITY NAME], [TO SET], [REVIEW BEFORE TENANT 3] must all be gone first.
    expect(unresolvedMarkers(doc), `${doc.slug} unresolved markers`).toEqual([]);
  }
});

test("both documents carry the data clause word for word", async () => {
  for (const doc of legalDocList) {
    expect(textOf(doc), `${doc.slug} data clause`).toContain(DATA_CLAUSE);
  }
});

test("both documents state the service fee and never call it a surcharge", async () => {
  for (const doc of legalDocList) {
    const text = textOf(doc);
    expect(text, `${doc.slug} service fee`).toContain(SERVICE_FEE_CLAUSE);
    expect(text, `${doc.slug} fee wording`).toContain("service fee of 5%");
    expect(text.toLowerCase(), `${doc.slug} surcharge`).not.toContain("surcharge");
  }
});

test("both documents carry the contact email, and the terms link to the privacy policy", async () => {
  for (const doc of legalDocList) {
    expect(textOf(doc), `${doc.slug} contact email`).toContain(ENTITY.email);
  }
  expect(textOf(legalDocs.terms), "terms must link to /privacy").toContain("|/privacy]]");
});

test("the documents describe only features that exist today", async () => {
  for (const doc of legalDocList) {
    const text = textOf(doc).toLowerCase();
    for (const feature of UNBUILT_FEATURES) {
      expect(text, `${doc.slug} must not describe "${feature}"`).not.toContain(feature);
    }
  }
});

test("internal review notes never reach the page", async ({ request }) => {
  for (const doc of legalDocList) {
    if (!doc.review) continue;
    expect(textOf(doc), `${doc.slug} review note in body`).not.toContain(doc.review);
    const html = await (await request.get(`/${doc.slug}`)).text();
    expect(html, `${doc.slug} review note in html`).not.toContain("REVIEW BEFORE TENANT");
  }
});

test("tax is described as calculated and passed through, but not filed", async () => {
  const text = textOf(legalDocs.terms);
  expect(text, "calculates").toContain("works out the sales tax on each online order");
  expect(text, "uses the location rate").toContain("using the tax rate set for the location");
  expect(text, "passes through").toContain("passes it through to you");
  expect(text, "rate is theirs").toContain("You set that rate");
  expect(text, "we do not file").toContain("We do not file or remit sales tax");
  // The old, wrong sentence must not come back.
  expect(text, "stale claim").not.toContain("We do not calculate, collect or remit");
});

test("ownership on termination says what is theirs, what is ours, and what they get", async () => {
  const text = textOf(legalDocs.terms);
  expect(text, "theirs").toContain("What is yours: your menu and your prices");
  expect(text, "ours").toContain("What is ours: Wuntab itself");
  expect(text, "no website on exit").toContain(
    "You do not keep the website, its templates or its design",
  );
  expect(text, "own domain stays theirs").toContain("it is yours and we make no claim to it");
  expect(text, "our domain stays ours").toContain("that domain name belongs to us");
  expect(text, "exit export").toContain(EXIT_EXPORT);
  expect(EXIT_EXPORT, "menu export").toContain("export of your menu");
  expect(EXIT_EXPORT, "customer export").toContain("export of your customer list");
  // The old, wrong sentence must not come back.
  expect(text, "stale claim").not.toContain("your domain name remains yours");
});

test("card wording follows the inventory override: brand and last four stored, numbers not", async () => {
  const text = textOf(legalDocs.privacy);
  expect(text).toContain("We do not store card numbers, expiry dates or security codes");
  expect(text).toContain("the last four digits");
});
