import { expect, test, type Page } from "@playwright/test";
import { beliefs, OWNER_TO_WRITE, publishedBeliefs } from "../src/lib/beliefs";
import { builtProducts } from "../src/lib/catalog";
import { copy } from "../src/lib/copy";
import { demoHrefWithName } from "../src/lib/demo-href";
import { customerStories } from "../src/lib/stories";

/**
 * The design pass of 2026-10-07, as checks: five text sizes, 44px tap
 * targets, the mobile header and menu, swipeable rows, the homepage order and
 * height, and the sections that wait on the owner.
 */
const pages = ["/", "/how-it-works", "/pricing", ...builtProducts.map((slug) => `/${slug}`)];

/** Every distinct computed font size of visible text, outside the logo. */
async function fontSizes(page: Page) {
  return page.evaluate(() => {
    const sizes = new Set<string>();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const el = node.parentElement;
      if (!el || !node.textContent?.trim() || el.closest("[data-logo], script, style, noscript, .sr-only")) continue;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height || getComputedStyle(el).visibility === "hidden") continue;
      sizes.add(getComputedStyle(el).fontSize);
    }
    for (const input of document.querySelectorAll("input")) sizes.add(getComputedStyle(input).fontSize);
    return [...sizes].sort();
  });
}

test("no more than five text sizes site-wide, at 390 and 1440", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const all = new Set<string>();
    for (const path of [...pages, "/terms", "/privacy"]) {
      await page.goto(path);
      for (const size of await fontSizes(page)) all.add(size);
    }
    expect([...all].sort(), `text sizes at ${width}`).toHaveLength(5);
  }
});

test("headline sizes follow the brief", async ({ page }) => {
  for (const [width, h1, h2] of [
    [390, [34, 38], [30, 36]],
    [1440, [72, 80], [48, 64]],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const size = (sel: string) => page.locator(sel).first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    const weight = await page.locator("h1").evaluate((el) => getComputedStyle(el).fontWeight);
    expect(weight).toBe("600");
    const one = await size("h1");
    const two = await size("main h2");
    expect(one, `h1 at ${width}`).toBeGreaterThanOrEqual(h1[0]);
    expect(one, `h1 at ${width}`).toBeLessThanOrEqual(h1[1]);
    expect(two, `h2 at ${width}`).toBeGreaterThanOrEqual(h2[0]);
    expect(two, `h2 at ${width}`).toBeLessThanOrEqual(h2[1]);
  }
});

test("tap targets are at least 44px tall on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of pages) {
    await page.goto(path);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll("a, button, summary, input")]
        .filter((el) => !el.closest("p") && !el.classList.contains("skip-link"))
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width > 0 && rect.height > 0 && rect.height < 44)
        .map(({ el, rect }) => `${el.tagName} "${(el.textContent ?? "").trim().slice(0, 40)}" ${Math.round(rect.height)}px`),
    );
    expect(small, path).toEqual([]);
  }
});

test("the phone header shows the logo, Get Started and a menu that opens full screen by pillar", async ({ page }) => {
  for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 780 });
    await page.goto("/");
    const header = page.locator("header");
    await expect(header.locator('a[aria-label="WunTab home"]')).toBeVisible();
    await expect(header.getByRole("link", { name: copy.cta.primary })).toBeVisible();
    const menu = header.locator("summary", { hasText: "Menu" });
    await expect(menu).toBeVisible();
    await menu.click();
    const nav = page.locator('nav[aria-label="Mobile"]');
    const box = await nav.boundingBox();
    expect(box!.width, `menu width at ${width}`).toBe(width);
    expect(box!.y + box!.height, `menu reaches the bottom at ${width}`).toBeGreaterThanOrEqual(779);
    for (const pillar of ["Sell", "Grow", "Operate"]) {
      await expect(nav.locator("summary", { hasText: pillar })).toBeVisible();
    }
  }
});

test("rows swipe sideways with the next card peeking in at 390", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const rows = page.locator(".snap-row");
  expect(await rows.count()).toBeGreaterThanOrEqual(3);
  for (const row of await rows.all()) {
    const style = await row.evaluate((el) => getComputedStyle(el).scrollSnapType);
    expect(style).toContain("x");
    expect(style).toContain("mandatory");
    const second = await row.locator(":scope > *").nth(1).boundingBox();
    expect(second!.x, "second card starts on screen").toBeLessThan(390);
    expect(second!.x + second!.width, "second card runs off screen").toBeGreaterThan(390);
  }
});

test("outcome tabs switch on desktop and follow the swipe on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const labels = copy.outcomes.items.map((item) => item.label);
  await expect(page.getByRole("tab")).toHaveText(labels);
  await page.getByRole("tab", { name: labels[2] }).click();
  await expect(page.getByRole("tab", { name: labels[2] })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[role="tabpanel"]:visible')).toHaveCount(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const row = page.locator('[role="tabpanel"]').first().locator("..");
  await row.evaluate((el) => el.scrollTo({ left: el.scrollWidth }));
  await expect(page.getByRole("tab", { name: labels[2] })).toHaveAttribute("aria-selected", "true");
});

test("homepage sections come in the owner's order, and nothing else", async ({ page }) => {
  await page.goto("/");
  const ids = await page.locator("main > section").evaluateAll((els) => els.map((el) => el.id));
  // Customer stories and beliefs render only once their data is real.
  const expected = ["top", "outcomes", "products", "how-it-works", "pricing", "faq", "cta"];
  if (customerStories.length) expected.splice(1, 0, "stories");
  if (publishedBeliefs().length) expected.splice(expected.indexOf("faq"), 0, "beliefs");
  expect(ids).toEqual(expected);
  await expect(page.getByLabel(copy.hero.inputLabel)).toBeVisible();
  for (const slug of copy.products.slugs) {
    await expect(page.locator(`#products a[href="/${slug}"]`)).toBeVisible();
  }
});

test("homepage is under 10,000px tall at 390", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(height).toBeLessThan(10_000);
});

test("What we believe stays hidden until the owner writes it", async ({ request }) => {
  expect(beliefs.some((b) => b.title === OWNER_TO_WRITE)).toBe(true);
  expect(publishedBeliefs()).toEqual([]);
  const written = beliefs.map((_, i) => ({ title: `Belief ${i}`, body: ["One.", "Two."] }));
  expect(publishedBeliefs(written)).toEqual(written);
  expect(publishedBeliefs([...written.slice(0, 2), { title: "Belief", body: [OWNER_TO_WRITE] }])).toEqual([]);
  const html = await (await request.get("/")).text();
  expect(html).not.toContain(OWNER_TO_WRITE);
  expect(html).not.toContain(copy.beliefs.heading);
});

test("customer stories render nothing while there are none", async ({ request }) => {
  expect(customerStories).toEqual([]);
  const html = await (await request.get("/")).text();
  expect(html).not.toContain(copy.stories.heading);
});

test("Get Started carries the restaurant name into Book a call", () => {
  const mail = "mailto:hello@wuntab.com?subject=Book%20a%20call%20with%20WunTab";
  expect(demoHrefWithName(mail, "  Saffron & Co ")).toBe(
    "mailto:hello@wuntab.com?subject=Book%20a%20call%20with%20WunTab%3A%20Saffron%20%26%20Co&body=Restaurant%3A%20Saffron%20%26%20Co%0A%0A",
  );
  expect(demoHrefWithName(mail, "")).toBe(mail);
  expect(demoHrefWithName("https://cal.example.com/wuntab", "Saffron")).toBe(
    "https://cal.example.com/wuntab?restaurant=Saffron",
  );
  expect(demoHrefWithName("https://cal.example.com/wuntab", "Saffron", "a1")).toBe(
    "https://cal.example.com/wuntab?a1=Saffron",
  );
});
