import { expect, test, type Locator, type Page } from "@playwright/test";
import { builtProducts, bySlug, productGroups, productHref, solutionHref, solutions } from "../src/lib/catalog";
import { copy } from "../src/lib/copy";
import { demoOrder } from "../src/lib/demo-order";
import { companyLinks, demoHref, demoStorefront, legalNav, primaryLinks } from "../src/lib/site";
import { expectTrustLineBreaks } from "./trust-line";

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

/** The homepage at 375 in Chromium before the brand pass (2026-10-20, `main` at 8efd2a9). It must not grow either. */
const HOMEPAGE_BEFORE_BRAND_PASS = 6_496;

/**
 * The closed footer at 375: the owner's target, 520px (2026-10-20), once the
 * $0 line, Get Started and the demo link left the top of it. (The first
 * target, 450px, couldn't hold those too: 766px before, 655px with them.)
 */
const FOOTER_CLOSED_MAX = 520;

/** The footer's groups (owner, 2026-10-20): the Product menu's three, then Solutions and Company. */
const groupTitles = [...productGroups.map((g) => g.title), "Solutions", "Company"];

async function noSideScroll(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
}

test("phone footer: six closed groups, each opens and closes, every link still in the page", async ({ page, browserName }) => {
  await page.setViewportSize(phone);
  // /contact last: the checks after the loop run on it.
  for (const path of ["/", "/pricing", "/contact"]) {
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
  // Above the groups, only the logo (owner, 2026-10-20): the final band right above has Get Started and the demo link.
  await expect(top.locator("[data-logo]").first()).toBeVisible();
  await expect(top.getByRole("link", { name: copy.cta.primary })).toHaveCount(0);
  await expect(top).not.toContainText("Customers pay 5% at checkout");
  await expect(top).not.toContainText(demoStorefront.label);
  // /contact has no final band, and Get Started is still in its header.
  await expect(page.locator("#cta")).toHaveCount(0);
  const headerStart = page.locator("header").getByRole("link", { name: copy.cta.primary });
  await expect(headerStart).toBeVisible();
  await expect(headerStart).toHaveAttribute("href", demoHref);

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

  // Company ends with the demo restaurant, in a new tab, with the new-tab icon.
  const company = groups.nth(groupTitles.indexOf("Company"));
  await company.locator("summary").click();
  const demo = company.locator("a").last();
  await expect(demo).toHaveText(new RegExp(`^${demoStorefront.footerLabel}`));
  await expect(demo).toHaveAttribute("href", "https://demo.wuntab.com");
  await expect(demo).toHaveAttribute("target", "_blank");
  await expect(demo).toHaveAttribute("rel", /\bnoopener\b/);
  await expect(demo.locator('svg[aria-hidden="true"]')).toHaveCount(1);
  await expect(top.locator("[data-demo-link]")).toHaveCount(1);
  await company.locator("summary").click();

  // Closed, every page the footer links to is still in the groups (they're crawl paths).
  const hrefs = await groups.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  const expected = [
    ...builtProducts.map((slug) => productHref(slug)!),
    ...solutions.map((s) => solutionHref(s.slug)),
    ...primaryLinks.map((l) => l.href),
    ...companyLinks.map((l) => l.href),
    demoStorefront.href,
  ];
  expect([...hrefs].sort()).toEqual([...expected].sort());
  // Each product sits under its Product menu group.
  for (const group of productGroups) {
    for (const slug of group.slugs) await expect(groups.nth(groupTitles.indexOf(group.title)).locator(`a[href="/${slug}"]`), slug).toHaveCount(1);
  }

  // Below: the address, then Terms · Privacy · © year WunTab. No "Or send a message" (Contact is in Company).
  await expect(footer.getByRole("link", { name: "hello@wuntab.com" })).toHaveAttribute("href", "mailto:hello@wuntab.com");
  const legal = footer.getByRole("link", { name: "Terms" });
  await expect(legal).toBeVisible();
  const row = legal.locator("xpath=ancestor::div[1]");
  expect((await row.innerText()).replace(/\s+/g, " ").trim()).toBe(`Terms · Privacy · © ${new Date().getFullYear()} WunTab`);
  await expect(footer.getByRole("link", { name: copy.footer.message })).toHaveCount(0);
});

/** The footer at 1280 before the desktop rebuild (2026-10-20, `main` at d4c25f9): one "Product" column of 15 links. */
const FOOTER_1280_BEFORE = 1_013;

test("from 768px the footer is the same five groups as columns, then the bottom bar", async ({ page }) => {
  for (const width of [768, 900, 1023, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const footer = page.locator("footer");
    const columns = footer.locator('[data-footer="desktop"] [data-footer-column]');
    await expect(footer.locator('[data-footer="phone"]')).toBeHidden();
    await expect(columns.locator("p")).toHaveText(groupTitles);
    await expect(footer.getByText("Legal", { exact: true })).toHaveCount(0);

    // Each column has the phone group's links, in its order: both come from one list (site-footer.tsx).
    const read = (links: ReturnType<Page["locator"]>) =>
      links.evaluateAll((as) => as.map((a) => `${a.getAttribute("href")} ${(a.firstChild?.textContent ?? "").trim()}`));
    const groups = footer.locator("[data-footer-group]");
    for (const [i, title] of groupTitles.entries()) {
      expect(await read(columns.nth(i).locator("a")), `${title} at ${width}`).toEqual(await read(groups.nth(i).locator("a")));
    }
    // What shows: those links, plus Terms, Privacy, the address and the contact form. Nothing else.
    const shown = await footer.locator("a:visible").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    const expected = [
      ...(await groups.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href")))),
      ...legalNav.map((l) => l.href),
      "mailto:hello@wuntab.com",
      "/contact",
    ];
    expect([...shown].sort(), `${width}`).toEqual([...expected].sort());

    // Headings white at 75%, links white on 44px rows, one per line, and no name wraps.
    const layout = await columns.evaluateAll((cols) => {
      // A computed color as [r, g, b, a], whatever notation the browser reports it in.
      const ctx = document.createElement("canvas").getContext("2d")!;
      const rgba = (color: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        return [...ctx.getImageData(0, 0, 1, 1).data];
      };
      return cols.map((col) => {
        const heading = col.querySelector("p")!;
        const links = [...col.querySelectorAll("a")].map((a) => {
          const range = document.createRange();
          range.selectNodeContents(a.firstChild!);
          const lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
          const box = a.getBoundingClientRect();
          return { label: a.firstChild!.textContent, lines, top: box.top, height: box.height, right: box.right, color: rgba(getComputedStyle(a).color) };
        });
        return { top: col.getBoundingClientRect().top, left: col.getBoundingClientRect().left, heading: rgba(getComputedStyle(heading).color), links };
      });
    });
    for (const [i, col] of layout.entries()) {
      expect(col.heading.slice(0, 3), groupTitles[i]).toEqual([255, 255, 255]);
      expect(Math.abs(col.heading[3] - 0.75 * 255), groupTitles[i]).toBeLessThanOrEqual(1);
      for (const [j, link] of col.links.entries()) {
        expect(link.lines, `"${link.label}" wraps at ${width}`).toBe(1);
        expect(link.height, `${link.label}`).toBeGreaterThanOrEqual(44);
        expect(link.color, `${link.label}`).toEqual([255, 255, 255, 255]);
        if (j > 0) expect(link.top, "one link per line").toBeGreaterThanOrEqual(col.links[j - 1].top + col.links[j - 1].height - 1);
      }
      // No column runs into the next one in its row.
      const next = layout[i + 1];
      if (next && Math.abs(next.top - col.top) < 1) expect(Math.max(...col.links.map((l) => l.right)), groupTitles[i]).toBeLessThanOrEqual(next.left);
    }
    // One row of five from 1024px; below, the three Product groups, then Solutions and Company.
    const rows = [...new Set(layout.map((c) => Math.round(c.top)))];
    expect(rows.length, `rows at ${width}`).toBe(width >= 1024 ? 1 : 2);
    if (width < 1024) expect(layout.map((c) => rows.indexOf(Math.round(c.top)))).toEqual([0, 0, 0, 1, 1]);

    // Company ends with the demo restaurant, in a new tab, with the new-tab icon, as on phones.
    const demo = columns.nth(groupTitles.indexOf("Company")).locator("a").last();
    await expect(demo).toHaveText(new RegExp(`^${demoStorefront.footerLabel}`));
    await expect(demo).toHaveAttribute("href", demoStorefront.href);
    await expect(demo).toHaveAttribute("target", "_blank");
    await expect(demo).toHaveAttribute("rel", /\bnoopener\b/);
    await expect(demo.locator('svg[aria-hidden="true"]')).toHaveCount(1);

    // The bottom bar, under a hairline: the logo, the address and "Send a message" on the left; Terms · Privacy · © on the right.
    const logo = footer.locator("[data-logo]:visible");
    const email = footer.getByRole("link", { name: "hello@wuntab.com" });
    const message = footer.getByRole("link", { name: copy.footer.message });
    const terms = footer.getByRole("link", { name: "Terms" });
    await expect(message).toHaveAttribute("href", "/contact");
    await expect(email).toHaveAttribute("href", "mailto:hello@wuntab.com");
    const legalRow = terms.locator("xpath=ancestor::div[1]");
    expect((await legalRow.innerText()).replace(/\s+/g, " ").trim()).toBe(`Terms · Privacy · © ${new Date().getFullYear()} WunTab`);
    const bar = legalRow.locator("xpath=..");
    expect(await bar.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe("1px");
    const [logoBox, emailBox, messageBox, legalBox, barBox, lastColumn] = await Promise.all([
      logo.boundingBox(), email.boundingBox(), message.boundingBox(), legalRow.boundingBox(), bar.boundingBox(), columns.last().boundingBox(),
    ]);
    expect(barBox!.y).toBeGreaterThanOrEqual(lastColumn!.y + lastColumn!.height);
    expect(logoBox!.x).toBeCloseTo(barBox!.x, 0);
    expect(emailBox!.x).toBeGreaterThan(logoBox!.x + logoBox!.width);
    expect(messageBox!.x).toBeGreaterThan(emailBox!.x + emailBox!.width);
    expect(legalBox!.x + legalBox!.width).toBeCloseTo(barBox!.x + barBox!.width, 0);
    // All on one line.
    const middle = (b: { y: number; height: number }) => b.y + b.height / 2;
    for (const box of [emailBox!, messageBox!, legalBox!]) expect(Math.abs(middle(box) - middle(logoBox!)), `${width}`).toBeLessThanOrEqual(2);

    await noSideScroll(page);
    if (width === 1280) {
      const height = (await footer.boundingBox())!.height;
      test.info().annotations.push({ type: "footer at 1280", description: `${Math.round(height)}px, was ${FOOTER_1280_BEFORE}px` });
      // The owner's aim: about 550px (2026-10-20).
      expect(height).toBeLessThanOrEqual(560);
    }
  }
});

test("the phone menu: the Product groups as accordions, 22px icons on 48px rows, then the demo row above Get Started", async ({ page }) => {
  for (const width of [320, 360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto("/");
    await page.locator("header summary", { hasText: "Menu" }).click();
    const nav = page.locator('header nav[aria-label="Mobile"]');
    const groups = nav.locator("details");
    await expect(groups.locator("summary")).toHaveText([...productGroups.map((g) => g.title), "Solutions", "Company"]);
    for (const [i, group] of productGroups.entries()) {
      const details = groups.nth(i);
      await details.locator("summary").click();
      const rows = details.locator("a");
      expect(await rows.evaluateAll((as) => as.map((a) => a.getAttribute("href")))).toEqual(group.slugs.map((slug) => `/${slug}`));
      for (const row of await rows.all()) {
        await expect(row.locator("svg[data-icon]")).toHaveCount(1);
        expect((await row.boundingBox())!.height, `${await row.textContent()} at ${width}`).toBeGreaterThanOrEqual(48);
        const icon = (await row.locator("svg").boundingBox())!;
        expect([Math.round(icon.width), Math.round(icon.height)]).toEqual([22, 22]);
      }
      await details.locator("summary").click();
    }
    // Solutions and Company stay as they were: no icons.
    await expect(groups.nth(3).locator("svg[data-icon]")).toHaveCount(0);
    await expect(groups.nth(4).locator("svg[data-icon]")).toHaveCount(0);
    if (!demoStorefront.on) continue;

    // The demo row, last before Get Started: the photo at 88px, "Demo restaurant · Palm&Stone Pizza", and the link.
    const row = nav.locator("[data-demo-link]");
    await row.scrollIntoViewIfNeeded();
    const img = row.locator("img");
    await expect(img).toHaveAttribute("src", "/demo/photos/pepperoni-pizza-360.webp");
    await expect(img).toHaveAttribute("loading", "lazy");
    const photo = (await img.boundingBox())!;
    expect([Math.round(photo.width), Math.round(photo.height)]).toEqual([88, 88]);
    await expect(row).toContainText(demoStorefront.label);
    await expect(row.locator("[data-demo-names]")).toHaveText(`${demoStorefront.tag} · ${demoOrder.restaurant}`);
    // One line where it fits; narrower, two lines with the dot hidden. Never a break inside a name, never a dot at a line's end.
    const names = await row.locator("[data-demo-names]").evaluate((el) => {
      const [tag, sep, , name] = [...el.children] as HTMLElement[];
      const lines = (n: Element) => {
        const range = document.createRange();
        range.selectNodeContents(n);
        return [...range.getClientRects()].map((r) => Math.round(r.top));
      };
      return { tag: lines(tag), name: lines(name), sep: sep.getBoundingClientRect().width > 0 ? lines(sep) : null };
    });
    expect(new Set(names.tag).size, `${width}`).toBe(1);
    expect(new Set(names.name).size, `${width}`).toBe(1);
    if (names.sep) expect([...new Set([...names.tag, ...names.sep, ...names.name])], `the dot's line at ${width}`).toHaveLength(1);
    else expect(names.name[0], `${width}`).toBeGreaterThan(names.tag[0]);
    if (width >= 430) expect(names.sep, `one line at ${width}`).not.toBeNull();
    const button = (await nav.getByRole("link", { name: copy.cta.primary }).boundingBox())!;
    const rowBox = (await row.boundingBox())!;
    expect(rowBox.y + rowBox.height).toBeLessThanOrEqual(button.y);
  }
});

/** Opens the phone menu if it's closed. */
async function openPhoneMenu(page: Page) {
  const menu = page.locator("header details.mobile-nav");
  if (!(await menu.evaluate((el) => (el as HTMLDetailsElement).open))) await menu.locator(":scope > summary").click();
  await expect(menu).toHaveJSProperty("open", true);
  return { menu, nav: page.locator('header nav[aria-label="Mobile"]') };
}

/** The phone menu is shut, with no group left open, and the page isn't locked. */
async function expectMenuClosed(page: Page, menu: Locator) {
  await expect(menu).toHaveJSProperty("open", false);
  expect(await menu.evaluate((el) => el.querySelectorAll("details[open]").length), "an open group").toBe(0);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflowY), "html locked").not.toBe("hidden");
}

test("tapping a page in the phone menu closes the menu, shows the new page and lets it scroll", async ({ page, browserName }) => {
  await page.setViewportSize(phone);
  await page.goto("/");
  const { menu, nav } = await openPhoneMenu(page);
  await nav.locator("summary", { hasText: "Your website" }).click();
  await nav.locator('a[href="/restaurant-seo"]').click();
  await expect(page).toHaveURL(/\/restaurant-seo$/);
  await expectMenuClosed(page, menu);
  // The H1 is the thing on screen, not the menu over it.
  const h1 = page.locator("main h1");
  await expect(h1).toHaveText(bySlug["restaurant-seo"].headline);
  const onTop = await h1.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + Math.min(r.width / 2, 40), r.top + Math.min(r.height / 2, 20));
    return !!hit && el.contains(hit);
  });
  expect(onTop, "the H1 is covered").toBe(true);
  // The page scrolls (a wheel in Chromium; mobile WebKit has no wheel, so there the lock check above stands in).
  if (browserName === "chromium") {
    await page.mouse.move(phone.width / 2, phone.height / 2);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  }
});

test("on /pricing, tapping Pricing in the phone menu closes it, and so does the demo link", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto("/pricing");
  const { menu, nav } = await openPhoneMenu(page);
  await nav.locator('a[href="/pricing"]').click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expectMenuClosed(page, menu);
  // The demo restaurant, in a new tab, closes it too (the tab itself is stopped: tests don't leave this site).
  if (!demoStorefront.on) return;
  await page.context().route(`${demoStorefront.href}/**`, (route) => route.abort());
  await openPhoneMenu(page);
  const tab = page.context().waitForEvent("page");
  await nav.locator("[data-demo-link]").click();
  await (await tab).close();
  await expectMenuClosed(page, menu);
});

test("back after a menu tap: the phone menu is closed on the page before", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto("/");
  const first = await openPhoneMenu(page);
  await first.nav.locator("summary", { hasText: "Your website" }).click();
  await first.nav.locator('a[href="/restaurant-seo"]').click();
  await expect(page).toHaveURL(/\/restaurant-seo$/);
  // Open it again on the new page, then go back: the route change closes it.
  const { menu } = await openPhoneMenu(page);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expectMenuClosed(page, menu);
});

test("Escape closes the phone menu and puts focus on the menu button", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto("/");
  const { menu, nav } = await openPhoneMenu(page);
  await nav.locator("summary", { hasText: "Your orders" }).click();
  await page.keyboard.press("Escape");
  await expectMenuClosed(page, menu);
  await expect(menu.locator(":scope > summary")).toBeFocused();
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
  // Under the hero signup: centred, below the name box (the $0 card that sat between them went on 2026-10-20).
  const hero = page.locator("#top [data-demo-link]");
  await check(hero, "hero");
  const form = (await page.locator("#top form").boundingBox())!;
  const heroBox = (await hero.boundingBox())!;
  expect(heroBox.y).toBeGreaterThanOrEqual(form.y + form.height);
  const text = (await hero.locator("span").first().boundingBox())!;
  const tag = (await hero.locator("span", { hasText: "Demo restaurant" }).boundingBox())!;
  expect(Math.abs((text.x + tag.x + tag.width) / 2 - (form.x + form.width / 2)), "centred under the name box").toBeLessThanOrEqual(2);
  // The products section and the final band, under its button.
  await check(page.locator("#products [data-demo-link]"), "products");
  const band = page.locator("#cta [data-demo-link]");
  await check(band, "final band");
  const bandButton = (await page.locator("#cta").getByRole("link", { name: copy.cta.primary }).boundingBox())!;
  expect((await band.boundingBox())!.y).toBeGreaterThanOrEqual(bandButton.y + bandButton.height);
  // The phone footer: the last link in Company, "Live demo restaurant" (owner, 2026-10-20).
  const company = page.locator('footer [data-footer="phone"] details', { hasText: "Company" });
  await company.locator("summary").click();
  const inFooter = company.locator("[data-demo-link]");
  await expect(inFooter).toBeVisible();
  await expect(inFooter).toHaveAttribute("href", "https://demo.wuntab.com");
  await expect(inFooter).toHaveAttribute("target", "_blank");
  await expect(inFooter).toHaveAttribute("rel", /\bnoopener\b/);
  await expect(inFooter).toContainText(demoStorefront.footerLabel);
  await company.locator("summary").click();
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

test("the hero's trust line: each fact whole, and a dot never starts or ends a line, from 320 to 1280", async ({ page }) => {
  await page.goto("/");
  await expectTrustLineBreaks(page, page.locator("#top").getByText(copy.hero.trust));
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
  // Each still is its visual's first screen only (owner, 2026-10-20): none of the later ones are in the page.
  const later: Record<string, string> = {
    "online-ordering": demoOrder.tabs[1], // the menu the website opens
    delivery: "Delivered", // the tracking page
    catering: "Thank you.", // the sent form
    "order-management": "Mark ready", // the order drawer
  };
  for (const [i, slug] of copy.products.slugs.entries()) {
    expect(await cards.nth(i).locator("[data-still]").textContent(), slug).not.toContain(later[slug]);
    // The same visual, playing on the wider rows, has it.
    expect(await page.locator("#products > div > ul:not([data-product-cards]) > li").nth(i).locator("[data-demo]").textContent(), slug).toContain(later[slug]);
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
  test(`the homepage at 375 is no taller than before (${reducedMotion})`, async ({ page, browserName }) => {
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize(phone);
    await page.goto("/");
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    test.info().annotations.push({ type: "homepage at 375", description: `${height}px` });
    expect(height).toBeLessThanOrEqual(HOMEPAGE_BEFORE);
    if (browserName === "chromium") expect(height).toBeLessThanOrEqual(HOMEPAGE_BEFORE_BRAND_PASS);
    // The stills hold still with reduced motion too.
    expect(await page.locator("[data-still]").evaluateAll((els) => els.flatMap((el) => el.getAnimations({ subtree: true })).filter((a) => a.playState === "running").length)).toBe(0);
  });
}
