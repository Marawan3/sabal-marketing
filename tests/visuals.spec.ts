import { expect, test, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { copy } from "../src/lib/copy";
import { demoDashboard, demoDelivery, demoKitchen, demoOrders, demoSettings, demoSite } from "../src/lib/demo-data";
import { demoOrder, SERVICE_FEE_PERCENT } from "../src/lib/demo-order";

/**
 * The built visuals (src/components/visuals): real text and shapes, played
 * once when scrolled into view, one moving at a time, still with reduced
 * motion. Where each one lives (owner, 2026-10-13):
 */
const home: Record<string, string> = {
  delivery: "/delivery",
  catering: "/catering",
  storefront: "/restaurant-websites",
  kitchen: "/order-management",
  dashboard: "/how-it-works",
  search: "/restaurant-seo",
  receipt: "/pricing",
  flow: "/delivery",
  orders: "/order-management",
  settings: "/order-management",
};
const names = Object.keys(home) as (keyof typeof copy.visuals)[];
const pages = ["/", "/how-it-works", "/pricing", "/online-ordering", "/delivery", "/catering", "/restaurant-websites", "/restaurant-seo", "/order-management"];
const NOON = new Date("2026-10-13T16:40:00-04:00");

test.use({ timezoneId: "America/New_York" });

const visual = (page: Page, name: string) => page.locator(`main [data-visual="${name}"]`).first();

async function intoView(el: Locator) {
  await el.evaluate((n) => n.scrollIntoView({ block: "center", behavior: "instant" }));
}

/** Opacity all the way up the tree, and whether the element sits inside its visual's box (not slid away). */
async function shown(el: Locator) {
  return el.evaluate((node) => {
    let opacity = 1;
    for (let n: Element | null = node; n && !n.hasAttribute("data-demo"); n = n.parentElement) opacity *= Number(getComputedStyle(n).opacity);
    const root = node.closest("[data-demo]")!.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    const inside = r.left >= root.left - 1 && r.right <= root.right + 1;
    return opacity > 0.99 && inside;
  });
}

test("each visual is built: real text, decorative for screen readers with one sentence, no screenshots or photos", async ({ page }) => {
  for (const name of names) {
    await page.goto(home[name]);
    const el = visual(page, name);
    await expect(el, name).toHaveCount(1);
    await expect(el.locator(":scope > [aria-hidden='true']")).toHaveCount(1);
    await expect(el.locator(":scope > .sr-only")).toHaveText(copy.visuals[name] as string);
    await expect(el.locator("img, video, canvas, figure, iframe, picture"), name).toHaveCount(0);
    expect((await el.innerText()).trim().length, name).toBeGreaterThan(20);
  }
});

test("a visual waits until it's on screen, plays once, then holds its last step", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.clock.install({ time: NOON });
  await page.goto("/delivery");
  const flow = visual(page, "flow");
  // Below the fold: nothing happens.
  await page.clock.runFor(12_000);
  expect(await flow.getAttribute("data-s")).toBe("0");
  await intoView(flow);
  await page.waitForTimeout(200);
  await page.clock.runFor(12_000);
  await expect(flow).toHaveAttribute("data-done", "");
  const last = await flow.getAttribute("data-s");
  expect(last!.split(" ").length).toBeGreaterThan(5);
  await page.clock.runFor(20_000);
  expect(await flow.getAttribute("data-s")).toBe(last);
  // Held on the end: all six steps lit. (The last fade runs on the real clock.)
  await page.waitForTimeout(600);
  for (const step of await flow.locator("li").all()) expect(await shown(step)).toBe(true);
});

test("one thing moves at a time", async ({ page }) => {
  // A tall window shows several visuals at once; they take turns.
  await page.setViewportSize({ width: 1440, height: 2600 });
  await page.clock.install({ time: NOON });
  await page.goto("/how-it-works");
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(200);
  let maxMoving = 0;
  let finished = 0;
  let before: { s: string | null; done: boolean }[] = [];
  for (let i = 0; i < 300; i++) {
    await page.clock.runFor(100);
    const states = await page.locator("main [data-demo]").evaluateAll((els) =>
      els.map((el) => ({ s: el.getAttribute("data-s"), done: el.hasAttribute("data-done") })),
    );
    // Moving: stepped forward since the last look. One that just finished hands over, so it doesn't count.
    const moving = states.filter((st, k) => before[k] && st.s !== before[k].s && !st.done).length;
    maxMoving = Math.max(maxMoving, moving);
    finished = states.filter((st) => st.done).length;
    before = states;
  }
  expect(maxMoving).toBe(1);
  expect(finished).toBeGreaterThanOrEqual(2);
});

test("a pause button only on what moves for more than five seconds, and it pauses", async ({ page }) => {
  const pausable = ["delivery", "flow"];
  for (const name of names) {
    await page.goto(home[name]);
    await expect(visual(page, name).getByRole("button"), name).toHaveCount(pausable.includes(name) ? 1 : 0);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.clock.install({ time: NOON });
  await page.goto("/delivery");
  const phone = visual(page, "delivery");
  await page.clock.runFor(1_600);
  await phone.getByRole("button", { name: copy.hero.demo.pause }).click();
  const at = await phone.getAttribute("data-s");
  await page.clock.runFor(6_000);
  expect(await phone.getAttribute("data-s")).toBe(at);
  await phone.getByRole("button", { name: copy.hero.demo.play }).click();
  await page.clock.runFor(2_000);
  expect(await phone.getAttribute("data-s")).not.toBe(at);
});

for (const width of [390, 1440]) {
  test(`with reduced motion at ${width} every visual is its final state, still, with no button`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    await page.clock.install({ time: NOON });
    // The thing that shows each story's end.
    const end: Record<string, (el: Locator) => Locator> = {
      delivery: (el) => el.locator('[data-cur="7"]').last(),
      catering: (el) => el.getByText("Thank you.", { exact: true }),
      storefront: (el) => el.getByText(`${demoOrder.restaurant} · Miami`, { exact: true }),
      kitchen: (el) => el.locator('[data-part="in"]'),
      dashboard: (el) => el.getByText("Average order", { exact: true }),
      search: (el) => el.getByText("Hummus & Warm Pita", { exact: true }),
      receipt: (el) => el.getByText("Paid by card", { exact: true }),
      flow: (el) => el.getByText("Customer receives it", { exact: true }),
      // Desktop: the drawer is open. Phones: the focal crop of the list.
      orders: (el) => (width >= 1024 ? el.getByText("Mark ready", { exact: true }) : el.locator('[data-row="1930"]')),
      settings: (el) => el.getByText(demoSettings.prep[1], { exact: true }),
    };
    for (const name of names) {
      await page.goto(home[name]);
      const el = visual(page, name);
      await intoView(el);
      await page.clock.runFor(10_000);
      expect(await el.getAttribute("data-s"), name).toBe("0");
      await expect(el.getByRole("button"), name).toBeHidden();
      expect(await shown(end[name](el)), name).toBe(true);
    }
    // The kitchen board's started ticket has left New.
    await page.goto(home.kitchen);
    expect(await shown(visual(page, "kitchen").locator('[data-part="out"]'))).toBe(false);
  });
}

test("on phones every visual is full width with 16px gutters, and its text renders at 9px or more", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of pages) {
    await page.goto(path);
    const found = await page.locator("main [data-demo]").evaluateAll((els) =>
      // Visuals hidden on phones (the homepage product rows) aren't checked.
      els.filter((el) => el.getBoundingClientRect().width > 0).map((el) => {
        const ground = (el.closest('[class*="ground"], [class*="rounded-[20px]"]') ?? el) as HTMLElement;
        let smallest = 99;
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const parent = n.parentElement!;
          if (!n.textContent?.trim() || parent.closest(".sr-only")) continue;
          const r = parent.getBoundingClientRect();
          if (!r.width || !r.height || getComputedStyle(parent).display === "none") continue;
          smallest = Math.min(smallest, parseFloat(getComputedStyle(parent).fontSize));
        }
        return { name: el.getAttribute("data-visual"), width: ground.getBoundingClientRect().width, smallest };
      }),
    );
    expect(found.length, path).toBeGreaterThan(0);
    for (const v of found) {
      expect(v.width, `${v.name} on ${path}`).toBeGreaterThanOrEqual(354);
      expect(v.smallest, `${v.name} on ${path}`).toBeGreaterThanOrEqual(9);
    }
  }
});

test("only transform and opacity animate in the visuals", () => {
  const css = readFileSync(join(process.cwd(), "src/components/visuals/visuals.module.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const moved = new Set<string>();
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (selector.includes(".btn")) continue; // the pause button's hover colour, like every button on the site
    for (const [, value] of body.matchAll(/transition(?:-property)?:\s*([^;]+);/g)) {
      for (const part of value.split(/,(?![^(]*\))/)) moved.add(part.trim().split(/\s+/)[0]);
    }
  }
  expect([...moved].sort()).toEqual(["opacity", "transform"]);
});

test("no layout shift while the visuals play", async ({ page }) => {
  test.setTimeout(120_000);
  for (const width of [390, 1440]) {
    for (const path of ["/", "/delivery"]) {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(() => {
        (window as unknown as { cls: number }).cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
            if (!e.hadRecentInput) (window as unknown as { cls: number }).cls += e.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(path);
      const height = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < height; y += 800) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(700);
      }
      expect(await page.evaluate(() => (window as unknown as { cls: number }).cls), `${path} at ${width}`).toBe(0);
    }
  }
});

test("the visuals tell the truth: the demo's dishes, prices, labels and arithmetic", async ({ page }) => {
  // The receipt carries the hero's order, with the 5% fee on the subtotal.
  await page.goto("/pricing");
  const receipt = visual(page, "receipt");
  await expect(receipt).toContainText(`Service fee (${SERVICE_FEE_PERCENT}%)`);
  await expect(receipt).toContainText(demoOrder.checkout.fee);
  await expect(receipt).toContainText(demoOrder.total);
  // The delivery phone: the storefront's own labels and the tracking stages, in order.
  await page.goto("/delivery");
  const delivery = visual(page, "delivery");
  for (const label of ["Deliver to", "Delivery time", "Taxes and fees", "Delivery available", "Order received", "Track your order", ...demoDelivery.deliveryStages]) {
    await expect(delivery).toContainText(label);
  }
  await expect(delivery).toContainText(demoDelivery.total);
  // No delivery provider is named, not even its word for a driver.
  expect((await delivery.innerText()).toLowerCase()).not.toContain("dasher");
  // The search result: the demo site's address and its own title; no search engine named.
  await page.goto("/restaurant-seo");
  const search = visual(page, "search");
  await expect(search).toContainText(demoSite.host);
  await expect(search).toContainText(demoSite.menuTitle);
  expect((await search.innerText()).toLowerCase()).not.toContain("google");
  await expect(search).toContainText(copy.visuals.searchCaption);
  // The catering page is the product's enquiry form, as it is today.
  await page.goto("/catering");
  const catering = visual(page, "catering");
  for (const label of ["Ask about catering", "Event date", "Guests", "Send", "Thank you."]) await expect(catering).toContainText(label);
  // The dashboard's seeded figures and labels.
  await page.goto("/how-it-works");
  const dash = visual(page, "dashboard");
  for (const text of ["Net sales", demoDashboard.netSales, demoDashboard.change, "Orders", demoDashboard.orders, "Average order", demoDashboard.averageOrder, "Last 30 days"]) {
    await expect(dash).toContainText(text);
  }
});

test("the orders dashboard and the kitchen board show the same orders; the settings card moves prep time from 20 to 25", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/order-management");
  const orders = visual(page, "orders");
  const kitchen = visual(page, "kitchen");
  const tickets = [demoKitchen.moving, ...demoKitchen.new, ...demoKitchen.preparing, ...demoKitchen.ready];
  expect(new Set(demoOrders.rows.map((r) => r.number))).toEqual(new Set(tickets.map((t) => t.number)));
  for (const row of demoOrders.rows) {
    const ticket = tickets.find((t) => t.number === row.number)!;
    await expect(orders.locator(`[data-row="${row.number}"]`)).toContainText(row.who);
    expect(row.who.startsWith(ticket.who), `#${row.number}`).toBe(true);
    await expect(kitchen).toContainText(`#${row.number}`);
  }
  // The drawer adds up, with the hero's service fee line.
  const cents = (t: string) => Math.round(Number(t.replace(/[$,]/g, "")) * 100);
  const o = demoOrders.open;
  expect(cents(o.total)).toBe(cents(o.subtotal) + cents(o.fee) + cents(o.tax) + cents(o.tip));
  expect(o.items.reduce((sum, item) => sum + cents(item.price), 0)).toBe(cents(o.subtotal));
  await expect(orders).toContainText("Mark ready");
  await expect(orders).toContainText(o.total);
  // The tabs and the sidebar are there on desktop.
  for (const tab of ["Active", "Scheduled", "Completed"]) await expect(orders).toContainText(tab);
  await expect(orders).toContainText("Overview");
  // Settings: the real labels, and prep time and the ASAP quote both end five minutes up.
  const settings = visual(page, "settings");
  for (const label of ["Accepting orders", "Current prep", "ASAP quote", "Closes at", "Pause online ordering", "Adjust prep time"]) {
    await expect(settings).toContainText(label);
  }
  expect(demoSettings.prep).toEqual(["20 min", "25 min"]);
  expect(demoSettings.quote).toEqual(["20–30 min", "25–35 min"]);
});

test("the kitchen board shows only in the homepage kitchen band and /order-management's steps", async ({ page }) => {
  const where: Record<string, string[]> = { "/": ["kitchen"], "/order-management": [""] };
  for (const path of pages) {
    await page.goto(path);
    const sections = await page.locator('main [data-visual="kitchen"]').evaluateAll((els) => els.map((el) => el.closest("section")?.id ?? ""));
    expect(sections, path).toEqual(where[path] ?? []);
  }
});
