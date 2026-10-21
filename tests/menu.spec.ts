import { expect, test, type Locator, type Page } from "@playwright/test";
import { builtProducts, productGroups, productMenu, solutionHref, solutions } from "../src/lib/catalog";
import { copy } from "../src/lib/copy";
import { demoOrder } from "../src/lib/demo-order";
import { demoStorefront } from "../src/lib/site";

/**
 * The header menus, option A (owner, 2026-10-20): every built product page
 * in the Product menu, each with a navy line icon, under three outcome
 * headings, then the demo restaurant's card; Solutions with icons and its
 * lines. One list (productGroups) behind the menus and both footers.
 */

/** The owner's icons, exactly as sent (2026-10-20). */
const OWNER_ICONS: Record<string, string> = {
  "online-ordering": '<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  "online-menu": '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
  delivery:
    '<circle cx="6" cy="18" r="2"/><path d="M8 18h5a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h3"/><path d="M18 3.5a3 3 0 0 0-3 3c0 2.2 3 5 3 5s3-2.8 3-5a3 3 0 0 0-3-3z"/>',
  catering: '<path d="M5 17a7 7 0 0 1 14 0"/><path d="M12 10V8.5"/><path d="M3 17h18"/><path d="M4 20h16"/>',
  upsells: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8.5v7M8.5 12h7"/>',
  "restaurant-websites": '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3 9h18"/><path d="M6.5 6.75h.01M9 6.75h.01"/>',
  "restaurant-seo": '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
  loyalty: '<path d="M12 19.5s-7-4.3-7-9.5a4 4 0 0 1 7-2.6 4 4 0 0 1 7 2.6c0 5.2-7 9.5-7 9.5z"/>',
  "order-management": '<path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  "menu-management": '<path d="M4 6h10M4 11h7M4 16h4"/><path d="M14 20l.6-2.6 5-5a1.4 1.4 0 0 1 2 2l-5 5z"/>',
  "kitchen-display": '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M8 8v4M12 8v4M16 8v4"/>',
  payments: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/>',
  integrations: '<path d="M9 7V3.5M15 7V3.5"/><path d="M7 7h10v4a5 5 0 0 1-10 0z"/><path d="M12 16v4.5"/>',
  "sol-independent": '<path d="M4 10v10h16V10"/><path d="M3 10l1.5-5.5h15L21 10z"/><path d="M10 20v-5h4v5"/>',
  "sol-quick-service": '<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.5l2.5 1.5"/><path d="M10 3h4"/>',
  "sol-full-service": '<path d="M6 3v6a2 2 0 0 0 4 0V3M8 11v10"/><path d="M17 21V3c-2 1-3 3.5-3 7h3"/>',
  "sol-multi-location":
    '<path d="M8.5 20s-5-4.5-5-9a5 5 0 0 1 10 0c0 4.5-5 9-5 9z"/><circle cx="8.5" cy="11" r="1.75"/><path d="M15.5 6.2a5 5 0 0 1 5 4.8c0 3-2.2 5.9-3.6 7.5"/>',
};

/** Storefront, stopwatch, fork and knife, two pins (owner, 2026-10-20). */
const SOLUTION_ICONS: Record<string, string> = {
  "independent-restaurants": "sol-independent",
  "quick-service": "sol-quick-service",
  "full-service": "sol-full-service",
  "multi-location": "sol-multi-location",
};

/** An icon's shapes as "tag a=1 b=2", attributes sorted, so markup order and quoting don't matter. */
function shapes(svg: string) {
  return [...svg.matchAll(/<(path|rect|circle)([^>]*?)\/?>/g)].map(([, tag, attrs]) =>
    [tag, ...[...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, k, v]) => `${k}=${v}`).sort()].join(" "),
  );
}

const NAVY = "rgb(19, 33, 60)";

async function openMenu(page: Page, name: "Product" | "Solutions" | "Company") {
  const trigger = page.locator('header nav[aria-label="Primary"]').getByRole("button", { name, exact: true });
  // From outside the header first, so the hover is a real pointer entry even where the trigger sits where the mouse was.
  await page.mouse.move(0, 700);
  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  return page.locator(`[id="${await trigger.getAttribute("aria-controls")}"]`);
}

/** Each icon in `scope`: its name, size, color, attributes and shapes. */
async function icons(scope: Locator) {
  return scope.locator("svg[data-icon]").evaluateAll((svgs) =>
    svgs.map((svg) => ({
      name: svg.getAttribute("data-icon")!,
      href: svg.closest("a")?.getAttribute("href") ?? null,
      attrs: ["viewBox", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "aria-hidden", "width", "height"].map(
        (a) => svg.getAttribute(a),
      ),
      color: getComputedStyle(svg).color,
      shapes: [...svg.children].map((el) =>
        [el.tagName.toLowerCase(), ...[...el.attributes].map((a) => `${a.name}=${a.value}`).sort()].join(" "),
      ),
    })),
  );
}

test("one list: the Product menu, the phone menu and both footers have the same groups and pages", async ({ page }) => {
  // The three groups hold every built page, once each, in the owner's order.
  expect(productGroups.map((g) => g.title)).toEqual(["Sell directly", "Get found and come back", "Run the restaurant"]);
  expect(productGroups.map((g) => g.slugs)).toEqual([
    ["online-ordering", "online-menu", "delivery", "catering", "upsells"],
    ["restaurant-websites", "restaurant-seo", "loyalty"],
    ["order-management", "menu-management", "kitchen-display", "payments", "integrations"],
  ]);
  const listed = productMenu.flatMap((g) => g.items.map((i) => i.slug));
  expect([...listed].sort()).toEqual([...builtProducts].sort());
  expect(new Set(listed).size).toBe(listed.length);
  const expected = productMenu.map((g) => ({ title: g.title, hrefs: g.items.map((i) => i.href) }));

  const read = (groups: Locator, title: string) =>
    groups.evaluateAll(
      (els, title) =>
        els.map((el) => ({
          title: el.querySelector(title)!.textContent!.trim(),
          hrefs: [...el.querySelectorAll("a")].map((a) => a.getAttribute("href")!),
        })),
      title,
    );

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const panel = await openMenu(page, "Product");
  expect(await read(panel.locator("[data-menu-group]"), "p"), "Product menu").toEqual(expected);
  const columns = await read(page.locator('footer [data-footer="desktop"] [data-footer-column]'), "p");
  expect(columns.slice(0, 3), "desktop footer").toEqual(expected);
  expect(columns.map((c) => c.title)).toEqual([...expected.map((g) => g.title), "Solutions", "Company"]);

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const groups = await read(page.locator('header nav[aria-label="Mobile"] details'), "summary");
  expect(groups.slice(0, 3), "phone menu").toEqual(expected);
  expect(groups.map((g) => g.title)).toEqual([...expected.map((g) => g.title), "Solutions", "Company"]);
  const phoneFooter = await read(page.locator("footer [data-footer-group]"), "summary");
  expect(phoneFooter.slice(0, 3), "phone footer").toEqual(expected);
  expect(phoneFooter.map((g) => g.title)).toEqual([...expected.map((g) => g.title), "Solutions", "Company"]);
});

test("every menu item has one navy icon, the owner's, and the right page link", async ({ page }) => {
  const check = (found: Awaited<ReturnType<typeof icons>>, size: string, where: string) => {
    for (const icon of found) {
      expect(icon.attrs, `${where}: ${icon.name}`).toEqual(["0 0 24 24", "none", "currentColor", "1.75", "round", "round", "true", size, size]);
      expect(icon.color, `${where}: ${icon.name}`).toBe(NAVY);
      expect([...icon.shapes].sort(), `${where}: ${icon.name}`).toEqual([...shapes(OWNER_ICONS[icon.name])].sort());
    }
  };
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  // Product: 13 rows, each a link to its page with exactly one icon, named by the page.
  const product = await openMenu(page, "Product");
  const rows = product.locator("[data-menu-group] a");
  await expect(rows).toHaveCount(builtProducts.length);
  for (const row of await rows.all()) {
    const href = (await row.getAttribute("href"))!;
    const slug = href.slice(1);
    await expect(row.locator("svg"), href).toHaveCount(1);
    await expect(row.locator(`svg[data-icon="${slug}"]`), href).toHaveCount(1);
    // No badges, no numbers: the icon and the name.
    expect((await row.innerText()).trim(), href).toBe(productMenu.flatMap((g) => g.items).find((i) => i.href === href)!.name);
  }
  check(await icons(product.locator("[data-menu-group]")), "20", "Product");
  expect(await product.innerText()).not.toMatch(/\d/);

  // Solutions: the four pages, each with its icon and its one line.
  await page.mouse.move(5, 700);
  const sol = await openMenu(page, "Solutions");
  await expect(sol.locator("a")).toHaveCount(solutions.length);
  for (const s of solutions) {
    const row = sol.locator(`a[href="${solutionHref(s.slug)}"]`);
    await expect(row.locator("svg"), s.slug).toHaveCount(1);
    await expect(row.locator(`svg[data-icon="${SOLUTION_ICONS[s.slug]}"]`), s.slug).toHaveCount(1);
    await expect(row).toContainText(s.name);
    await expect(row).toContainText(s.blurb);
  }
  check(await icons(sol), "20", "Solutions");

  // The phone menu: the same icons at 22px.
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const mobile = page.locator('header nav[aria-label="Mobile"]');
  const found = await icons(mobile);
  expect(found.map((i) => `${i.href} ${i.name}`)).toEqual(productMenu.flatMap((g) => g.items.map((i) => `${i.href} ${i.slug}`)));
  check(found, "22", "phone menu");
  // Never saffron, anywhere an icon is drawn.
  for (const icon of found) expect(icon.color).not.toBe("rgb(244, 168, 58)");
});

test("the Product panel: three columns, the card, then New to WunTab, and no name wraps from 1024 to 1440", async ({ page }) => {
  for (const width of [1024, 1100, 1199, 1200, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const panel = await openMenu(page, "Product");
    const layout = await panel.evaluate((el) => {
      const box = (n: Element) => n.getBoundingClientRect();
      const groups = [...el.querySelectorAll("[data-menu-group]")].map((g) => ({
        left: box(g).left,
        right: box(g).right,
        top: box(g).top,
        heading: (() => {
          const p = g.querySelector("p")!;
          const cs = getComputedStyle(p);
          return { size: cs.fontSize, weight: cs.fontWeight, color: cs.color };
        })(),
        rows: [...g.querySelectorAll("a")].map((a) => {
          const name = a.querySelector("[data-name]")!;
          const range = document.createRange();
          range.selectNodeContents(name);
          const cs = getComputedStyle(name);
          const icon = a.querySelector("svg")!;
          return {
            label: name.textContent,
            lines: new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size,
            height: box(a).height,
            right: Math.max(...[...range.getClientRects()].map((r) => r.right)),
            size: cs.fontSize,
            weight: cs.fontWeight,
            gap: box(name).left - box(icon).right,
          };
        }),
      }));
      const card = el.querySelector("[data-demo-card]");
      return { panel: box(el), groups, card: card ? { left: box(card).left, width: box(card).width } : null };
    });
    expect(layout.groups.length, `${width}`).toBe(3);
    // One row: the three columns side by side, the card to their right.
    expect(new Set(layout.groups.map((g) => Math.round(g.top))).size).toBe(1);
    for (const [i, g] of layout.groups.entries()) {
      expect(g.heading, `heading at ${width}`).toEqual({ size: "14px", weight: "600", color: "rgb(110, 110, 109)" });
      for (const row of g.rows) {
        expect(row.lines, `"${row.label}" wraps at ${width}`).toBe(1);
        expect(row.height, `${row.label} at ${width}`).toBeGreaterThanOrEqual(44);
        expect([row.size, row.weight], `${row.label}`).toEqual(["14px", "500"]);
        expect(Math.round(row.gap), `${row.label}: 12px from its icon`).toBe(12);
        const next = layout.groups[i + 1];
        const limit = next?.left ?? layout.card?.left ?? layout.panel.right;
        expect(row.right, `${row.label} runs into the next column at ${width}`).toBeLessThanOrEqual(limit);
      }
    }
    if (demoStorefront.on) {
      expect(layout.card, `${width}`).not.toBeNull();
      // 300px from 1200; 240px from 1024 to 1199, so the columns keep room for their names.
      expect(layout.card!.width, `card at ${width}`).toBe(width >= 1200 ? 300 : 240);
    } else expect(layout.card).toBeNull();
    // The panel fits the window.
    expect(layout.panel.left).toBeGreaterThanOrEqual(0);
    expect(layout.panel.right).toBeLessThanOrEqual(width);
    // Under a hairline: New to WunTab?, then How it works and Pricing.
    const more = panel.locator("[data-menu-more]");
    expect(await more.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe("1px");
    await expect(more).toContainText(copy.nav.newTo);
    await expect(more.locator("a")).toHaveText([copy.nav.howItWorks, copy.nav.pricing]);
    expect(await more.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href")))).toEqual(["/how-it-works", "/pricing"]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

/** The site's five text sizes at this width, read from the classes themselves. */
async function scale(page: Page) {
  return page.evaluate(() =>
    ["text-small", "text-body", "text-h3", "text-h2", "text-display"].map((cls) => {
      const el = Object.assign(document.createElement("span"), { className: cls, textContent: "x" });
      document.body.appendChild(el);
      const size = getComputedStyle(el).fontSize;
      el.remove();
      return size;
    }),
  );
}

/** Every distinct font size of the visible text in `scope`, with an example of each. */
async function textSizes(scope: Locator) {
  return scope.evaluate((root) => {
    const found: Record<string, string> = {};
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const el = node.parentElement!;
      const text = node.textContent?.trim();
      if (!text || el.closest(".sr-only")) continue;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      found[getComputedStyle(el).fontSize] ??= text.slice(0, 30);
    }
    return found;
  });
}

test("every piece of menu text is on the site's five sizes (owner, 2026-10-20)", async ({ page }) => {
  for (const width of [1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const sizes = await scale(page);
    for (const name of ["Product", "Solutions"] as const) {
      const found = await textSizes(await openMenu(page, name));
      for (const [size, example] of Object.entries(found)) expect(sizes, `${name} at ${width}: "${example}" is ${size}`).toContain(size);
    }
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const sizes = await scale(page);
  await page.locator("header summary", { hasText: "Menu" }).click();
  const nav = page.locator('header nav[aria-label="Mobile"]');
  for (const summary of await nav.locator("details > summary").all()) {
    await summary.click();
    const found = await textSizes(nav);
    for (const [size, example] of Object.entries(found)) expect(sizes, `phone menu: "${example}" is ${size}`).toContain(size);
    await summary.click();
  }
});

test("the demo card: the restaurant's photo, its name and the link in a new tab; absent when the demo link is off", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const card = page.locator("header [data-demo-card]");
  // NEXT_PUBLIC_SHOW_DEMO_LINK=false at build time turns every demo link off, this card included.
  if (!demoStorefront.on) {
    await expect(card).toHaveCount(0);
    const panel = await openMenu(page, "Product");
    await expect(panel.locator('a[href^="https://demo."]')).toHaveCount(0);
    return;
  }
  await expect(card).toHaveCount(1);
  // The photo waits for the menu: lazy, and the panel is hidden until it opens.
  const img = card.locator("img");
  await expect(img).toHaveAttribute("src", "/demo/photos/pepperoni-pizza-900.webp");
  await expect(img).toHaveAttribute("loading", "lazy");
  await expect(img).toHaveAttribute("alt", "");
  await openMenu(page, "Product");
  await expect(card).toBeVisible();
  const box = (await img.boundingBox())!;
  expect([Math.round(box.width), Math.round(box.height)]).toEqual([300, 150]);
  expect(await card.evaluate((el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el).borderRadius])).toEqual([
    "rgb(247, 243, 236)",
    "16px",
  ]);
  const lines = (await card.innerText()).split("\n").map((l) => l.trim());
  expect(lines.filter((l) => l && l !== "(opens in a new tab)")).toEqual([
    demoStorefront.tag,
    demoOrder.restaurant,
    copy.nav.demoCard,
    demoStorefront.label,
  ]);
  expect(demoOrder.restaurant).toBe("Palm&Stone Pizza");
  await expect(card).toHaveAttribute("href", demoStorefront.href);
  await expect(card).toHaveAttribute("target", "_blank");
  await expect(card).toHaveAttribute("rel", /\bnoopener\b/);
  await expect(card.locator(".sr-only")).toHaveText("(opens in a new tab)");
  // The new-tab icon after "See a live restaurant".
  await expect(card.getByText(demoStorefront.label).locator("svg")).toHaveCount(1);
});

test("the keyboard still works the menu: focus opens it, Tab goes in, Escape closes it and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const product = page.getByRole("button", { name: "Product" });
  await product.focus();
  await expect(product).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  const first = productMenu[0].items[0];
  await expect(page.locator(`header a[href="${first.href}"]`).first()).toBeFocused();
  await expect(product).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(product).toHaveAttribute("aria-expanded", "false");
  await expect(product).toBeFocused();
});

test("choosing an item in Product, Solutions or Company closes the panel, and focus stays off the menu button", async ({ page }) => {
  // The header stays mounted across client-side navigation (owner, 2026-10-21: the panel stayed open on the new page).
  const picks = [
    ["Product", "/restaurant-seo"],
    ["Solutions", solutionHref("quick-service")],
    ["Company", "/about"],
  ] as const;
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const [name, href] of picks) {
    await page.goto("/");
    const trigger = page.locator('header nav[aria-label="Primary"]').getByRole("button", { name, exact: true });
    const panel = await openMenu(page, name);
    await panel.locator(`a[href="${href}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(trigger, name).toHaveAttribute("aria-expanded", "false");
    await expect(panel, name).toBeHidden();
    // Focus goes back to the button only after Escape, never after a link.
    await expect(trigger, name).not.toBeFocused();
  }
});

test.describe("on a touch screen from 1024px", () => {
  test.use({ hasTouch: true });

  test("tapping an item closes the panel", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");
    const trigger = page.locator('header nav[aria-label="Primary"]').getByRole("button", { name: "Product", exact: true });
    await trigger.tap();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator(`[id="${await trigger.getAttribute("aria-controls")}"]`);
    await panel.locator('a[href="/restaurant-seo"]').tap();
    await expect(page).toHaveURL(/\/restaurant-seo$/);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
  });
});
