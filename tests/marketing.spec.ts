import { expect, test } from "@playwright/test";
import { builtProducts, products } from "../src/lib/catalog";
import { copy } from "../src/lib/copy";
import { SERVICE_FEE_CLAUSE } from "../src/lib/legal";
import { allRoutes, demoHref, demoStorefront } from "../src/lib/site";

/** Phase 1 (SPEC section 15): the pages this release publishes. */
const phase1 = [
  "/",
  "/how-it-works",
  "/pricing",
  "/online-ordering",
  "/delivery",
  "/catering",
  "/restaurant-websites",
  "/restaurant-seo",
  "/order-management",
  "/integrations",
  "/solutions/independent-restaurants",
  "/solutions/quick-service",
  "/solutions/full-service",
  "/solutions/multi-location",
  "/about",
  "/contact",
] as const;

const marketingPages = phase1;

test("every phase-1 page returns 200 and nothing else is a product route", async ({ request }) => {
  for (const path of phase1) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
  }
  expect([...builtProducts].sort()).toEqual(
    [
      "catering",
      "delivery",
      "integrations",
      "kitchen-display",
      "loyalty",
      "menu-management",
      "online-menu",
      "online-ordering",
      "order-management",
      "payments",
      "restaurant-seo",
      "restaurant-websites",
      "upsells",
    ],
  );
  // A product without a page in this release is a 404, not a half-built page.
  for (const product of products) {
    if ((builtProducts as readonly string[]).includes(product.slug)) continue;
    const response = await request.get(`/${product.slug}`, { maxRedirects: 0 });
    expect(response.status(), product.slug).toBe(404);
  }
});

test("homepage carries the headline; the lifecycle walkthrough lives on /how-it-works", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText(copy.hero.headline);
  const home = await page.locator("main").innerText();
  const how = await (await request.get("/how-it-works")).text();
  for (const name of ["Discover", "Fulfill", "Understand", "Build the relationship", "Bring them back"]) {
    expect(home, `homepage repeats ${name}`).not.toContain(name);
    expect(how).toContain(name);
  }
  // Integrations moved off the homepage too.
  expect(home).not.toContain(copy.integrations.heading);
  expect(how).toContain(copy.integrations.heading.replace(/'/g, "&#x27;"));
});

test("pricing copy matches the service fee clause in /terms", async ({ request }) => {
  // SPEC section 2, rule 1: diners pay 5%, restaurants pay $0, copy matches /terms.
  expect(SERVICE_FEE_CLAUSE).toContain(copy.pricing.body);
  const pricing = await (await request.get("/pricing")).text();
  expect(pricing).toContain(copy.pricing.body);
  // The homepage card is the short form. Each of its points restates the clause.
  const clause = SERVICE_FEE_CLAUSE.toLowerCase();
  expect(clause).toContain("free to the restaurant");
  expect(clause).toContain("no monthly charge, no setup fee, and no per-order commission charged to the restaurant");
  expect(clause).toContain("the customer pays a service fee of 5% of the order");
  expect(clause).toContain("shown to the customer at checkout before payment is taken");
  expect(copy.pricing.points).toEqual([
    "No monthly charge, no setup fee, no commission.",
    "Customers pay a 5% service fee, shown at checkout before they pay.",
  ]);
  const home = await (await request.get("/")).text();
  expect(home).toContain(copy.pricing.line);
  for (const point of copy.pricing.points) expect(home).toContain(point);
});

test("no Coming Soon labels anywhere", async ({ request }) => {
  for (const path of marketingPages) {
    const html = (await (await request.get(path)).text()).toLowerCase();
    expect(html, path).not.toContain("coming soon");
    expect(html, path).not.toContain("not available yet");
  }
});

test("no delivery provider or POS system is named, and WunTab is never the processor", async ({
  request,
}) => {
  const banned = [/doordash/i, /\bburq\b/i, /uber ?eats/i, /clover/i, /\btoast\b/i, /square/i, /\bnmi\b/i, /twilio/i];
  for (const path of marketingPages) {
    const html = await (await request.get(path)).text();
    for (const pattern of banned) {
      expect(html, `${path} names ${pattern}`).not.toMatch(pattern);
    }
    expect(html, path).not.toMatch(/WunTab(?:&#x27;|')s payment processor/i);
    expect(html, path).not.toMatch(/processed by WunTab/i);
  }
});

test("SEO copy makes no guarantees and never says Google can't read JavaScript", async ({ request }) => {
  for (const path of marketingPages) {
    const html = await (await request.get(path)).text();
    expect(html, path).not.toMatch(/guarantee/i);
    expect(html, path).not.toMatch(/Google (?:can(?:no|&#x27;|')t|cannot) (?:read|run|see)/i);
  }
});

test("the unsourced 220 vs 0 proof stays off every page", async ({ page }) => {
  for (const path of marketingPages) {
    await page.goto(path);
    const text = await page.locator("body").innerText();
    expect(text, path).not.toMatch(/\b220\b/);
    expect(text, path).not.toContain("Measured September 2026");
  }
});

test("no link points at a page that does not exist", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of marketingPages) {
    await page.goto(path);
    const hrefs = await page.locator("a[href^='/']").evaluateAll((els) =>
      els.map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? ""),
    );
    for (const href of hrefs) seen.add(href.split("#")[0] || "/");
  }
  for (const href of seen) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

test("titles, descriptions and canonicals are unique per page", async ({ request }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of phase1) {
    const html = await (await request.get(path)).text();
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
    expect(title, `${path} title`).not.toBe("");
    expect(description, `${path} description`).not.toBe("");
    expect(new URL(canonical).pathname.replace(/\/$/, "") || "/", `${path} canonical`).toBe(path);
    expect(titles.has(title), `${path} duplicate title`).toBe(false);
    expect(descriptions.has(description), `${path} duplicate description`).toBe(false);
    titles.add(title);
    descriptions.add(description);
  }
});

test("the sitemap lists published pages only", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/",
  );
  expect(locs.sort()).toEqual([...allRoutes].sort());
  for (const loc of locs) {
    const response = await request.get(loc, { maxRedirects: 0 });
    expect(response.status(), loc).toBe(200);
  }
});

test("redirects: old one-page paths are real pages now; legal aliases still 301", async ({ request }) => {
  for (const [from, to, status] of [
    ["/demo", "/", 308],
    ["/dpa", "/privacy", 308],
    ["/privacy-policy", "/privacy", 301],
    ["/terms-of-service", "/terms", 301],
    ["/platform-terms", "/terms", 301],
  ] as const) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(status);
    expect(response.headers()["location"], from).toBe(to);
  }
  // /about is a page again (owner, 2026-10-13).
  expect((await request.get("/about", { maxRedirects: 0 })).status()).toBe(200);
  const accessibility = await request.get("/accessibility", { maxRedirects: 0 });
  expect(accessibility.status()).toBe(404);
});

test("cut products do not exist as routes", async ({ request }) => {
  for (const route of ["/grader", "/pos", "/inventory", "/crm", "/developers", "/api-docs"]) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status(), route).toBe(404);
  }
});

test("the Product menu opens on hover and lists every built page, and only those", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const product = page.getByRole("button", { name: "Product" });
  await product.hover();
  await expect(product).toHaveAttribute("aria-expanded", "true");
  const panel = page.locator(`[id="${await product.getAttribute("aria-controls")}"]`);
  // Every built page since 2026-10-20 (owner), the six secondary pages too.
  for (const slug of builtProducts) {
    await expect(panel.locator(`a[href="/${slug}"]`), slug).toBeVisible();
  }
  // Those, the demo card (while the demo link is on), and How it works and Pricing under the hairline.
  await expect(panel.locator("a")).toHaveCount(builtProducts.length + (demoStorefront.on ? 1 : 0) + 2);
  // Hovering Pricing closes the menu.
  // The top-level Pricing link (the panel has its own under "New to WunTab?").
  await page.locator('header nav[aria-label="Primary"] > div > a[href="/pricing"]').hover();
  await expect(product).toHaveAttribute("aria-expanded", "false");
});

test("mega-menu works from the keyboard and Escape returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const product = page.getByRole("button", { name: "Product" });
  await product.focus();
  await expect(product).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(product).toHaveAttribute("aria-expanded", "false");
  await expect(product).toBeFocused();
});

test("the header Get Started stays visible on a phone and books a call (the /contact form, as a call request)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const cta = page.locator(`header a[href="${demoHref}"]`).first();
  await expect(cta).toBeVisible();
  await expect(cta).toHaveText(copy.cta.primary);
  expect(demoHref).toBe("/contact?intent=call");
});

test("no page has horizontal scroll at 360, 390 or 430", async ({ page }) => {
  for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of [...marketingPages, "/terms", "/privacy"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${path} at ${width}`).toBeLessThanOrEqual(0);
    }
  }
});

test("rendered HTML never contains Sabal, except the entity name on legal pages", async ({
  request,
}) => {
  for (const path of marketingPages) {
    const html = await (await request.get(path)).text();
    expect(html, path).not.toMatch(/sabal/i);
  }
  for (const path of ["/terms", "/privacy"]) {
    const html = await (await request.get(path)).text();
    const all = html.match(/sabal[a-z]*/gi) ?? [];
    const entity = html.match(/Sabal Pay LLC/g) ?? [];
    expect(entity.length, `${path} must name the entity`).toBeGreaterThan(0);
    expect(all.length, `${path} has a stray Sabal: ${all.join(", ")}`).toBe(entity.length);
  }
});

test("legal pages return 200 and icons are served", async ({ request }) => {
  for (const path of ["/terms", "/privacy", "/favicon.ico", "/apple-icon.png", "/icon.svg"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});
