import { expect, test, type Page } from "@playwright/test";
import { builtProducts, bySlug, productHref, solutionHref, solutions } from "../src/lib/catalog";
import { copy } from "../src/lib/copy";
import { companyLinks, demoHref, demoStorefront, primaryLinks } from "../src/lib/site";

/**
 * Mobile polish (owner, 2026-10-19), measured at 375px: the footer as six
 * closed groups, the demo restaurant's link in every place it belongs, the
 * products as cards to swipe, and the homepage no taller than before. Runs in
 * Chromium and in WebKit on an iPhone profile, with and without reduced
 * motion (playwright.config.ts).
 */

const phone = { width: 375, height: 812 };

/**
 * The homepage at 375 before this change: 6,692px on wuntab.com
 * (2026-10-19). It must not grow.
 */
const HOMEPAGE_BEFORE = 6_692;

/**
 * The closed footer at 375. The owner's target was 450px; six 48px group
 * rows, the 48px Get Started button and three 44px tap rows (the demo link,
 * the address and Terms and Privacy) are 474px on their own, before the logo
 * and the line, so the footer is held at what it measured instead (655px,
 * from 766px).
 */
const FOOTER_CLOSED_MAX = 660;

const groupTitles = ["Sell", "Grow", "Operate", "Scale", "Solutions", "Company"];

async function noSideScroll(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
}

test("phone footer: six closed groups, each opens and closes, every link still in the page", async ({ page, browserName }) => {
  await page.setViewportSize(phone);
  for (const path of ["/", "/contact", "/pricing"]) {
    await page.goto(path);
    const footer = page.locator("footer");
    const top = footer.locator('[data-footer="phone"]');
    await expect(top).toBeVisible();
    const groups = top.locator("details[data-footer-group]");
    await expect(groups.locator("summary")).toHaveText(groupTitles);
    // Closed, the footer is short and nothing scrolls sideways.
    for (const group of await groups.all()) await expect(group).toHaveJSProperty("open", false);
    const height = (await footer.boundingBox())!.height;
    test.info().annotations.push({ type: `footer closed ${path}`, description: `${Math.round(height)}px` });
    expect(height, path).toBeLessThanOrEqual(FOOTER_CLOSED_MAX);
    await noSideScroll(page);
  }

  const footer = page.locator("footer");
  const top = footer.locator('[data-footer="phone"]');
  // Above the groups: the logo, the line, Get Started full width and the demo restaurant.
  await expect(top.locator("[data-logo]").first()).toBeVisible();
  await expect(top).toContainText(copy.footer.line);
  const start = top.getByRole("link", { name: copy.cta.primary });
  await expect(start).toHaveAttribute("href", demoHref);
  const startBox = (await start.boundingBox())!;
  const groupsBox = (await top.locator("details").first().boundingBox())!;
  expect(Math.round(startBox.width)).toBe(Math.round(groupsBox.width));
  expect(startBox.height).toBeGreaterThanOrEqual(48);
  await expect(top.locator("[data-demo-link]")).toBeVisible();

  // Each group: a 48px row; open, one link per row at 44px or more; closed again, hidden but still in the page.
  const groups = top.locator("details[data-footer-group]");
  for (const [i, title] of groupTitles.entries()) {
    const group = groups.nth(i);
    const summary = group.locator("summary");
    const links = group.locator("a");
    expect((await summary.boundingBox())!.height, title).toBeGreaterThanOrEqual(48);
    expect(await links.count(), title).toBeGreaterThan(0);
    await expect(links.first()).toBeHidden();
    await summary.click();
    await expect(group).toHaveJSProperty("open", true);
    let last = -1;
    for (const link of await links.all()) {
      await expect(link).toBeVisible();
      const box = (await link.boundingBox())!;
      expect(box.height, `${title}: ${await link.textContent()}`).toBeGreaterThanOrEqual(44);
      expect(box.y, "one link per row").toBeGreaterThanOrEqual(last);
      last = box.y + box.height - 1;
    }
    await summary.click();
    await expect(group).toHaveJSProperty("open", false);
    await expect(links.first()).toBeHidden();
    await expect(links.first()).toBeAttached();
  }
  // The keyboard opens and closes a group too (the native disclosure).
  if (browserName === "chromium") {
    const summary = groups.first().locator("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(groups.first()).toHaveJSProperty("open", true);
    await page.keyboard.press(" ");
    await expect(groups.first()).toHaveJSProperty("open", false);
  }

  // Closed, every page the footer links to is still in the groups (they're crawl paths).
  const hrefs = await groups.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  const expected = [
    ...builtProducts.map((slug) => productHref(slug)!),
    ...solutions.map((s) => solutionHref(s.slug)),
    ...primaryLinks.map((l) => l.href),
    ...companyLinks.map((l) => l.href),
  ];
  expect([...hrefs].sort()).toEqual([...expected].sort());
  // Each product sits under its own pillar.
  for (const slug of builtProducts) {
    const title = { sell: "Sell", grow: "Grow", operate: "Operate", scale: "Scale" }[bySlug[slug].pillar as string];
    await expect(groups.nth(groupTitles.indexOf(title!)).locator(`a[href="/${slug}"]`), slug).toHaveCount(1);
  }

  // Below: the address, then Terms · Privacy · © year WunTab. No "Or send a message" (Contact is in Company).
  await expect(footer.getByRole("link", { name: "hello@wuntab.com" })).toHaveAttribute("href", "mailto:hello@wuntab.com");
  const legal = footer.getByRole("link", { name: "Terms" });
  await expect(legal).toBeVisible();
  const row = legal.locator("xpath=ancestor::div[1]");
  expect((await row.innerText()).replace(/\s+/g, " ").trim()).toBe(`Terms · Privacy · © ${new Date().getFullYear()} WunTab`);
  await expect(footer.getByRole("link", { name: copy.finalCta.message })).toHaveCount(0);
});

test("from 768px the footer is the four columns, unchanged", async ({ page }) => {
  for (const width of [768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.locator('[data-footer="phone"]')).toBeHidden();
    await expect(footer.locator("p.font-medium")).toHaveText(["Product", "Solutions", "Company", "Legal"]);
    for (const title of await footer.locator("p.font-medium").all()) await expect(title).toBeVisible();
    await expect(footer.getByRole("link", { name: copy.finalCta.message })).toHaveAttribute("href", "/contact");
    for (const href of ["/privacy", "/terms"]) await expect(footer.locator(`a[href="${href}"]`)).toBeVisible();
  }
});

test("See a live restaurant: on by default, in every place, to demo.wuntab.com in a new tab", async ({ page }) => {
  expect(demoStorefront.on).toBe(true);
  expect(demoStorefront.href).toBe("https://demo.wuntab.com");
  expect(demoStorefront.label).toBe("See a live restaurant");
  const check = async (link: ReturnType<Page["locator"]>, where: string) => {
    await expect(link, where).toHaveCount(1);
    await expect(link, where).toBeVisible();
    await expect(link, where).toHaveAttribute("href", "https://demo.wuntab.com");
    await expect(link, where).toHaveAttribute("target", "_blank");
    await expect(link, where).toHaveAttribute("rel", /\bnoopener\b/);
    await expect(link, where).toContainText(demoStorefront.label);
    // Nobody takes it for a customer's site.
    await expect(link, where).toContainText("Demo restaurant");
    expect((await link.boundingBox())!.height, where).toBeGreaterThanOrEqual(44);
  };

  await page.setViewportSize(phone);
  await page.goto("/");
  // Under the hero signup: centred, below the $0 card.
  const hero = page.locator("#top [data-demo-link]");
  await check(hero, "hero");
  const card = (await page.locator("#top p", { hasText: copy.hero.price.rest }).boundingBox())!;
  const heroBox = (await hero.boundingBox())!;
  expect(heroBox.y).toBeGreaterThanOrEqual(card.y + card.height);
  const text = (await hero.locator("span").first().boundingBox())!;
  const tag = (await hero.locator("span", { hasText: "Demo restaurant" }).boundingBox())!;
  expect(Math.abs((text.x + tag.x + tag.width) / 2 - (card.x + card.width / 2)), "centred under the card").toBeLessThanOrEqual(2);
  // The products section and the final band, under its button.
  await check(page.locator("#products [data-demo-link]"), "products");
  const band = page.locator("#cta [data-demo-link]");
  await check(band, "final band");
  const bandButton = (await page.locator("#cta").getByRole("link", { name: copy.cta.primary }).boundingBox())!;
  expect((await band.boundingBox())!.y).toBeGreaterThanOrEqual(bandButton.y + bandButton.height);
  // The footer.
  await check(page.locator('footer [data-footer="phone"] [data-demo-link]'), "footer");
  // The mobile menu, above Get Started.
  await page.locator("header summary", { hasText: "Menu" }).click();
  const menu = page.locator('header nav[aria-label="Mobile"]');
  const inMenu = menu.locator("[data-demo-link]");
  await check(inMenu, "mobile menu");
  const menuButton = (await menu.getByRole("link", { name: copy.cta.primary }).boundingBox())!;
  expect((await inMenu.boundingBox())!.y + (await inMenu.boundingBox())!.height).toBeLessThanOrEqual(menuButton.y);
  // /restaurant-websites keeps its own.
  await page.goto("/restaurant-websites");
  await check(page.locator("main section").first().locator("[data-demo-link]"), "/restaurant-websites");
});

test("products on phones: cards to swipe, each a still of its visual, its name, its line and Learn more", async ({ page, browserName }) => {
  await page.setViewportSize(phone);
  await page.goto("/");
  const row = page.locator("#products [data-product-cards]");
  await expect(row).toBeVisible();
  const cards = row.locator("[data-product-card]");
  await expect(cards).toHaveCount(copy.products.slugs.length);
  for (const [i, slug] of copy.products.slugs.entries()) {
    const card = cards.nth(i);
    await expect(card).toHaveAttribute("href", `/${slug}`);
    await expect(card.locator("h3")).toHaveText(bySlug[slug].name);
    await expect(card).toContainText(bySlug[slug].headline);
    await expect(card).toContainText(copy.products.more);
    await expect(card.locator('span[aria-hidden="true"]', { hasText: "→" })).toHaveCount(1);
    // The still: the product's own visual, aria-hidden, about 160px tall, never running.
    const still = card.locator("[data-still]");
    await expect(still).toHaveCount(1);
    await expect(still).toHaveAttribute("aria-hidden", "true");
    expect(await still.evaluate((el) => el.hasAttribute("data-run"))).toBe(false);
    await expect(still.locator("button")).toHaveCount(0);
    expect(await still.evaluate((el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length)).toBe(0);
    expect(Math.round((await card.locator(":scope > div").first().boundingBox())!.height)).toBe(160);
  }
  // The first card sits on the gutter; the next one peeks about 24px.
  const first = (await cards.nth(0).boundingBox())!;
  const second = (await cards.nth(1).boundingBox())!;
  expect(Math.round(first.x)).toBe(16);
  expect(Math.abs(phone.width - second.x - 24)).toBeLessThanOrEqual(2);
  // Snapping, no scrollbar, nothing else scrolls sideways.
  const css = await row.evaluate((el: HTMLElement) => ({
    snap: getComputedStyle(el).scrollSnapType,
    align: getComputedStyle(el.firstElementChild!).scrollSnapAlign,
    bar: el.offsetHeight - el.clientHeight,
  }));
  expect(css.snap).toMatch(/x mandatory/);
  expect(css.align).toMatch(/start/);
  expect(css.bar).toBe(0);
  await noSideScroll(page);
  if (browserName === "chromium") {
    // A part swipe settles on the next card.
    await row.evaluate((el) => el.scrollBy({ left: 200, behavior: "instant" }));
    await expect.poll(async () => Math.round((await cards.nth(1).boundingBox())!.x)).toBe(16);
  }
  // The rows (and their running visuals) are for 768px and up.
  const rows = page.locator("#products > div > ul:not([data-product-cards])");
  await expect(rows).toBeHidden();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(row).toBeHidden();
  await expect(rows).toBeVisible();
  for (const li of await rows.locator(":scope > li").all()) {
    await expect(li.locator("[data-demo]:not([data-still])")).toBeVisible();
  }
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`the homepage at 375 is no taller than before (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize(phone);
    await page.goto("/");
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    test.info().annotations.push({ type: "homepage at 375", description: `${height}px` });
    expect(height).toBeLessThanOrEqual(HOMEPAGE_BEFORE);
    // The stills hold still with reduced motion too.
    expect(await page.locator("[data-still]").evaluateAll((els) => els.flatMap((el) => el.getAnimations({ subtree: true })).filter((a) => a.playState === "running").length)).toBe(0);
  });
}
