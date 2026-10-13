import { expect, test, type Page } from "@playwright/test";
import { beliefs, OWNER_TO_WRITE, publishedBeliefs } from "../src/lib/beliefs";
import { builtProducts } from "../src/lib/catalog";
import { copy } from "../src/lib/copy";
import { demoDashboard } from "../src/lib/demo-data";
import { demoHrefWithName } from "../src/lib/demo-href";
import { customerStories } from "../src/lib/stories";

/**
 * The design pass of 2026-10-07, as checks: five text sizes, 44px tap
 * targets, the mobile header and menu, swipeable rows, the homepage order and
 * height, and the sections that wait on the owner.
 */
const pages = ["/", "/how-it-works", "/pricing", ...builtProducts.map((slug) => `/${slug}`)];

/** Every distinct computed font size of visible text, outside the logo and the hero's drawn phone (its type is the storefront's). */
async function fontSizes(page: Page) {
  return page.evaluate(() => {
    const sizes = new Set<string>();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const el = node.parentElement;
      if (!el || !node.textContent?.trim() || el.closest("[data-logo], [data-demo], script, style, noscript, .sr-only")) continue;
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
  // Archivo at 110% width runs large, so headlines are set smaller than they were in Bricolage.
  for (const [width, h1, h2] of [
    [390, [33, 35], [30, 36]],
    [1440, [68, 72], [48, 64]],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const size = (sel: string) => page.locator(sel).first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    const one = await size("h1");
    const two = await size("main h2");
    expect(one, `h1 at ${width}`).toBeGreaterThanOrEqual(h1[0]);
    expect(one, `h1 at ${width}`).toBeLessThanOrEqual(h1[1]);
    expect(two, `h2 at ${width}`).toBeGreaterThanOrEqual(h2[0]);
    expect(two, `h2 at ${width}`).toBeLessThanOrEqual(h2[1]);
  }
});

test("Archivo is the only font, with the brief's weight, width and tracking per role", async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const style = (sel: string) =>
    page.locator(sel).first().evaluate((el) => {
      const cs = getComputedStyle(el);
      const px = parseFloat(cs.fontSize);
      return {
        family: cs.fontFamily.split(",")[0].replace(/"/g, "").trim(),
        weight: cs.fontWeight,
        stretch: cs.fontStretch,
        tracking: cs.letterSpacing === "normal" ? 0 : +(parseFloat(cs.letterSpacing) / px).toFixed(3),
        leading: +(parseFloat(cs.lineHeight) / px).toFixed(2),
      };
    });
  expect(await style("h1")).toEqual({ family: "Archivo", weight: "750", stretch: "110%", tracking: -0.025, leading: 1.02 });
  expect(await style("main h2")).toEqual({ family: "Archivo", weight: "750", stretch: "110%", tracking: -0.025, leading: 1.05 });
  expect(await style("main h3")).toMatchObject({ family: "Archivo", weight: "650", stretch: "104%", tracking: -0.01 });
  expect(await style("main p")).toEqual({ family: "Archivo", weight: "400", stretch: "100%", tracking: 0, leading: 1.5 });
  for (const sel of ["main button[type=submit]", "header nav a:visible", "main summary"]) {
    const s = await style(sel);
    expect(s.family, sel).toBe("Archivo");
    expect(s.stretch, sel).toBe("100%");
    expect(s.tracking, sel).toBe(0);
    expect(Number(s.weight), sel).toBeGreaterThanOrEqual(500);
    expect(Number(s.weight), sel).toBeLessThanOrEqual(600);
  }
  expect(await page.evaluate(() => document.fonts.check("750 16px Archivo"))).toBe(true);
  // Bricolage is gone from the page and its stylesheets.
  const html = await (await request.get("/")).text();
  expect(html.toLowerCase()).not.toContain("bricolage");
  const sheets = await page.evaluate(() =>
    Promise.all([...document.querySelectorAll<HTMLLinkElement>("link[rel=stylesheet]")].map((l) => fetch(l.href).then((r) => r.text()))),
  );
  for (const css of sheets) expect(css.toLowerCase()).not.toContain("bricolage");
});

test("H1s fit: at most 4 lines at 360 and 3 at 1440; no headline is wider than its container", async ({ page }) => {
  for (const [width, maxLines] of [
    [360, 4],
    [390, 4],
    [1440, 3],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const lines = await page
        .locator("h1")
        .evaluate((h) => Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight)));
      expect(lines, `${path} H1 at ${width}`).toBeLessThanOrEqual(maxLines);
      const wide = await page.evaluate(() =>
        [...document.querySelectorAll("h1, h2, h3")]
          .filter((h) => {
            const box = h.getBoundingClientRect();
            if (!box.width) return false;
            const parent = h.parentElement!.getBoundingClientRect();
            return h.scrollWidth > h.clientWidth + 1 || box.right > parent.right + 1 || box.left < parent.left - 1;
          })
          .map((h) => h.textContent),
      );
      expect(wide, `${path} at ${width}`).toEqual([]);
    }
  }
});

test("the WUNTAB wordmark is drawn as outlines, not set in the page font", async ({ page }) => {
  await page.goto("/");
  for (const logo of await page.locator("[data-logo]").all()) {
    const mark = logo.locator('svg[aria-label="WunTab"]');
    await expect(mark).toHaveCount(1);
    expect(await mark.locator("path").count()).toBe(1);
    // Same box the live text had: 94.5 × 27.9 at logo size 28.
    const box = await mark.boundingBox();
    expect(box!.width).toBeCloseTo(94.5, 1);
    expect(box!.height).toBeCloseTo(27.9, 1);
    expect(await logo.evaluate((el) => (el as HTMLElement).innerText.trim())).toBe("");
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

test("nothing swipes sideways: no horizontal scroller in any page's content on phones", async ({ page }) => {
  for (const width of [360, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of pages) {
      await page.goto(path);
      const scrollers = await page.evaluate(() =>
        [...document.querySelectorAll("main *")]
          .filter((el) => /(auto|scroll)/.test(getComputedStyle(el).overflowX) && el.scrollWidth > el.clientWidth + 1)
          .map((el) => el.className.toString().slice(0, 60)),
      );
      expect(scrollers, `${path} at ${width}`).toEqual([]);
    }
  }
});

test("outcome tabs switch on desktop; on phones each outcome is its label, its lines, then its visual", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const labels = copy.outcomes.items.map((item) => item.label);
  await expect(page.getByRole("tab")).toHaveText(labels);
  await page.getByRole("tab", { name: labels[2] }).click();
  await expect(page.getByRole("tab", { name: labels[2] })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[role="tabpanel"]:visible')).toHaveCount(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("tablist", { includeHidden: true })).toBeHidden();
  const panels = page.locator('[role="tabpanel"]');
  await expect(panels).toHaveCount(labels.length);
  for (const [index, label] of labels.entries()) {
    const panel = panels.nth(index);
    await expect(panel).toBeVisible();
    await expect(panel.locator("h3")).toHaveText(label);
    // label above lines, lines above the visual
    const order = await panel.evaluate((el) => {
      const y = (sel: string) => el.querySelector(sel)?.getBoundingClientRect().top ?? null;
      return [y("h3"), y("ul"), y("[data-demo]")];
    });
    expect(order[0]!).toBeLessThan(order[1]!);
    expect(order[1]!).toBeLessThan(order[2]!);
    // At most two short lines per section (2026-10-13).
    expect(await panel.locator("li").count()).toBeLessThanOrEqual(2);
  }
});


test("palette: no beige anywhere, and no shadows on cards or frames", async ({ page }) => {
  for (const path of [...pages, "/terms", "/privacy"]) {
    await page.goto(path);
    const found = await page.evaluate(() => {
      const beige = [...document.querySelectorAll("body *")].filter((el) => {
        const cs = getComputedStyle(el);
        return [cs.backgroundColor, cs.borderTopColor, cs.color].some((c) => c.replace(/\s/g, "").startsWith("rgb(245,239,230"));
      }).length;
      const shadows = [...document.querySelectorAll("main *")].filter((el) => getComputedStyle(el).boxShadow !== "none").length;
      return { beige, shadows };
    });
    expect(found, path).toEqual({ beige: 0, shadows: 0 });
  }
  const css = await page.evaluate(() =>
    Promise.all([...document.querySelectorAll<HTMLLinkElement>("link[rel=stylesheet]")].map((l) => fetch(l.href).then((r) => r.text()))),
  );
  for (const sheet of css) expect(sheet.toLowerCase()).not.toContain("f5efe6");
});


test("steps: a row on desktop, a vertical list on phones, with saffron markers", async ({ page }) => {
  // The homepage's three steps. Product pages ask their steps in the FAQ since 2026-10-13 (/delivery draws them).
  for (const path of ["/"]) {
    const list = page.locator("#how-it-works ol").first();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);
    const desktop = await list.locator(":scope > li").evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top));
    expect(new Set(desktop.map(Math.round)).size, `${path} desktop row`).toBe(1);
    const marker = await list.locator(":scope > li > span:not([aria-hidden])").first().evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(marker.replace(/\s/g, "")).toBe("rgb(244,168,58)");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    const phone = await list.locator(":scope > li").evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
    for (let i = 1; i < phone.length; i++) {
      expect(phone[i].top, `${path} phone list`).toBeGreaterThan(phone[i - 1].top);
      expect(Math.round(phone[i].left)).toBe(Math.round(phone[0].left));
    }
  }
});


test("homepage sections come in the owner's order, and nothing else", async ({ page }) => {
  await page.goto("/");
  const ids = await page.locator("main > section").evaluateAll((els) => els.map((el) => el.id));
  // Customer stories and beliefs render only once their data is real.
  const expected = ["top", "outcomes", "kitchen", "products", "how-it-works", "pricing", "faq", "cta"];
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

test("no panel is empty, and every section's visual is a built one", async ({ page }) => {
  for (const width of [360, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto(path);
      // No screenshots or photos anywhere: no figure, and the only picture is the hero phone's dish photo.
      expect(await page.locator("main figure").count(), `${path} at ${width}`).toBe(0);
      const images = await page.locator("main img").evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src") ?? ""));
      for (const src of images) expect(src, `${path} at ${width}`).toContain("/hero-demo/");
      // Every panel carries something to read or look at.
      const empty = await page.locator("main [class*='rounded-[20px]']").evaluateAll((els) =>
        els.filter((el) => el.getBoundingClientRect().height > 0 && !el.textContent?.trim() && !el.querySelector("img")).length,
      );
      expect(empty, `${path} at ${width}`).toBe(0);
    }
  }
});

test("shape: panels 20px, buttons and inputs 12px, list rows square; pricing is the only card", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const radius = (sel: string) => page.locator(sel).first().evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  expect(await radius("#top [class*='rounded-[20px]']")).toBe("20px");
  expect(await radius("#top input")).toBe("12px");
  expect(await radius("#top button[type=submit]")).toBe("12px");
  expect(await radius("#products li")).toBe("0px");
  expect(await radius("#faq details")).toBe("0px");
  // A card: a box with a border on all four sides and rounded corners, that isn't a visual, button, input or link.
  const cards = await page.evaluate(() =>
    [...document.querySelectorAll("main *")]
      .filter((el) => !el.closest("[data-demo]") && !["A", "BUTTON", "INPUT", "SUMMARY"].includes(el.tagName))
      .filter((el) => {
        const cs = getComputedStyle(el);
        const all = ["Top", "Right", "Bottom", "Left"].every((side) => parseFloat(cs.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0);
        return all && parseFloat(cs.borderTopLeftRadius) > 0;
      })
      .map((el) => el.closest("section")?.id),
  );
  expect(cards).toEqual(["pricing"]);
});

test("bands: the kitchen display on navy, the final call to action on saffron", async ({ page }) => {
  await page.goto("/");
  const bg = (sel: string) => page.locator(sel).evaluate((el) => getComputedStyle(el).backgroundColor.replace(/\s/g, ""));
  expect(await bg("#kitchen")).toBe("rgb(19,33,60)");
  expect(await bg("#cta")).toBe("rgb(244,168,58)");
  await expect(page.locator("#kitchen h2")).toHaveText(copy.kitchen.heading);
  await expect(page.locator("#kitchen [data-demo]")).toHaveCount(1);
  await expect(page.locator("#kitchen [data-demo]")).toContainText("Preparing");
});

test("the dashboard card says Demo restaurant, and no copy quotes its figures", async ({ page }) => {
  let cards = 0;
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto(path);
      for (const card of await page.locator("main [data-demo]").filter({ hasText: demoDashboard.netSales }).all()) {
        cards++;
        await expect(card.getByText(copy.visuals.demoCaption, { exact: true })).toBeAttached();
      }
      // Page copy, title and description, with the visuals left out.
      const copyText = await page.evaluate(() => {
        const main = document.querySelector("main")!.cloneNode(true) as HTMLElement;
        main.querySelectorAll("[data-demo]").forEach((f) => f.remove());
        return [main.textContent, document.title, document.querySelector('meta[name="description"]')?.getAttribute("content")].join(" ");
      });
      for (const figure of demoDashboard.figures) expect(copyText.includes(figure), `${path} quotes ${figure}`).toBe(false);
    }
  }
  // The card is on the homepage and /how-it-works, at both widths.
  expect(cards).toBeGreaterThanOrEqual(4);
});
