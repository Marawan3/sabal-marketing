import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { copy } from "../src/lib/copy";
import { demoDashboard, demoDelivery, demoKitchen, demoOrders, demoReward, demoSettings, demoSite, demoSms } from "../src/lib/demo-data";
import { demoOrder, SERVICE_FEE_PERCENT } from "../src/lib/demo-order";
import { clock, seek, speed, transformsWhileShown } from "./motion";

/**
 * The built visuals (src/components/visuals): real text and shapes, played
 * once on the browser's own clock (paused while off screen); with reduced
 * motion the same stories as opacity crossfades. The chromium-reduced-motion
 * project runs this whole file with reduced motion emulated. Where each one lives (owner, 2026-10-13):
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
  // The secondary pages and /how-it-works (2026-10-13).
  menu: "/online-menu",
  upsell: "/upsells",
  loyalty: "/loyalty",
  editor: "/menu-management",
  sms: "/how-it-works",
};
/** Visuals that show the hero's one dish photo (the only picture any visual carries). */
const withDishPhoto = ["menu", "upsell", "editor"];
const names = Object.keys(home) as (keyof typeof copy.visuals)[];
const pages = [
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
  "/online-menu",
  "/upsells",
  "/loyalty",
  "/kitchen-display",
  "/menu-management",
  "/payments",
  "/solutions/independent-restaurants",
  "/solutions/quick-service",
  "/solutions/full-service",
  "/solutions/multi-location",
  "/about",
  "/contact",
];
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
    await expect(el.locator("video, canvas, figure, iframe, picture"), name).toHaveCount(0);
    const imgs = await el.locator("img").evaluateAll((els) => els.map((img) => img.getAttribute("src") ?? ""));
    if (withDishPhoto.includes(name)) for (const src of imgs) expect(src, name).toBe(demoOrder.dish.photo);
    else expect(imgs, name).toEqual([]);
    expect((await el.innerText()).trim().length, name).toBeGreaterThan(20);
  }
});

test("a visual runs from mount, pauses only while fully off screen, plays once, then holds its last frame", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/delivery");
  const flow = visual(page, "flow");
  // Below the fold: held at the start (it runs from mount until the observer's first report, a frame or two).
  // data-seen is that report: the server's markup has no data-run either, so wait for the observer itself.
  await expect(flow).toHaveAttribute("data-seen", "false");
  await expect(flow).not.toHaveAttribute("data-run");
  const held = await clock(flow);
  expect(held.state).toBe("paused");
  expect(held.t).toBeLessThan(100);
  await page.waitForTimeout(800);
  expect(await clock(flow)).toEqual(held);
  await intoView(flow);
  await expect(flow).toHaveAttribute("data-run", "");
  await expect.poll(async () => (await clock(flow)).state).toBe("running");
  // Played through (ten times faster), it ends and holds: all six steps lit.
  await speed(flow, 10);
  await expect(flow).toHaveAttribute("data-done", "", { timeout: 5_000 });
  await page.waitForTimeout(600);
  expect(await clock(flow)).toEqual({ t: 6200, state: "finished" });
  for (const step of await flow.locator("li").all()) expect(await shown(step)).toBe(true);
});

test("no site-wide lock: two visuals on screen run at the same time", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 2600 });
  await page.goto("/order-management");
  const both = [visual(page, "orders"), visual(page, "settings")];
  for (const el of both) await expect(el).toBeInViewport();
  for (const el of both) await expect.poll(async () => (await clock(el)).state).toBe("running");
});

test("a pause button only on what moves for more than five seconds, and it pauses", async ({ page }) => {
  const pausable = ["delivery", "flow"];
  for (const name of names) {
    await page.goto(home[name]);
    await expect(visual(page, name).getByRole("button"), name).toHaveCount(pausable.includes(name) ? 1 : 0);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/delivery");
  const phone = visual(page, "delivery");
  await expect.poll(async () => (await clock(phone)).t).toBeGreaterThan(300);
  await phone.getByRole("button", { name: copy.hero.demo.pause }).click();
  await expect(phone).toHaveAttribute("data-hold", "");
  const at = (await clock(phone)).t;
  await page.waitForTimeout(1_000);
  expect(await clock(phone)).toEqual({ t: at, state: "paused" });
  // Every part of it holds, not just its clock.
  expect(await phone.evaluate((el) => el.getAnimations({ subtree: true }).every((a) => a.playState !== "running"))).toBe(true);
  await phone.getByRole("button", { name: copy.hero.demo.play }).click();
  await expect.poll(async () => (await clock(phone)).t).toBeGreaterThan(at + 300);
});

/** Whether this run emulates reduced motion (the *-reduced-motion projects in playwright.config.ts). */
const reducedRun = (info: TestInfo) => info.project.use.reducedMotion === "reduce";

test("every visual with a story runs from mount and advances; with reduced motion a transform changes only while its element is invisible", async ({ page }, info) => {
  const reduced = reducedRun(info);
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(reduced);
  const all: [string, string][] = [["hero", "/"], ...names.map((n) => [n, home[n]] as [string, string])];
  let checked = 0;
  for (const [name, path] of all) {
    await page.goto(path);
    const el = name === "hero" ? page.locator("#top [data-demo]") : visual(page, name);
    if ((await el.getAttribute("data-steps"))!.split(" ").length === 1) continue; // a still: no story to run
    await intoView(el);
    await expect(el, name).toHaveAttribute("data-run", "");
    const states = await el.evaluate((n) => {
      const now = Number(n.getAnimations().find((a) => (a as CSSAnimation).animationName === "vis-clock")?.currentTime ?? 0);
      return n.getAnimations({ subtree: true }).map((a) => ({
        name: (a as CSSAnimation).animationName,
        state: a.playState,
        // Done already, by design: its whole life lies before now (the hero's first-run cover hold, 150 ms with reduced motion).
        over: Number(a.effect!.getComputedTiming().endTime) <= now,
      }));
    });
    // Every animation in it is running, unless its whole life is already over.
    expect(states.length, name).toBeGreaterThan(1);
    for (const st of states) expect(st.over ? "running" : st.state, `${name}: ${st.name}`).toBe("running");
    // And it advances.
    const at = (await clock(el)).t;
    await expect.poll(async () => (await clock(el)).t, { message: name }).toBeGreaterThan(at + 200);
    // With reduced motion nothing moves where it can be seen: a transform changes only
    // inside a scroll's dip, while its element is at opacity 0. (This pauses the visual.)
    if (reduced) {
      const { shown } = await transformsWhileShown(el);
      expect(shown, `${name}: a transform changed while shown`).toEqual([]);
    }
    checked++;
  }
  expect(checked).toBe(all.length - 3); // menu, editor and sms are stills
});

for (const width of [390, 1440]) {
  test(`at ${width} every visual ends on its final state, with a pause button only past five seconds`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
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
      menu: (el) => el.getByText(demoOrder.dish.name, { exact: true }),
      upsell: (el) => el.getByText("Goes well with", { exact: true }),
      loyalty: (el) => el.getByText(demoReward.title, { exact: true }),
      editor: (el) => el.getByText("Save changes", { exact: true }),
      sms: (el) => el.getByText(demoSms.confirmed, { exact: true }),
    };
    for (const name of names) {
      await page.goto(home[name]);
      const el = visual(page, name);
      await intoView(el);
      const steps = (await el.getAttribute("data-steps"))!.split(" ").map(Number);
      await seek(el, steps[steps.length - 1] + 2_000);
      // (Once a story ends its button is hidden, so count it in the markup.)
      await expect(el.locator("button"), name).toHaveCount(steps[steps.length - 1] > 5_000 ? 1 : 0);
      expect(await shown(end[name](el)), name).toBe(true);
    }
    // The kitchen board's started ticket has left New.
    await page.goto(home.kitchen);
    const kitchen = visual(page, "kitchen");
    await intoView(kitchen);
    await seek(kitchen, 6_000);
    expect(await shown(kitchen.locator('[data-part="out"]'))).toBe(false);
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
    // /about, /contact and the multi-location page (its diagram is plain HTML) have no built visual.
    if (!["/about", "/contact", "/solutions/multi-location"].includes(path)) expect(found.length, path).toBeGreaterThan(0);
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
  // The stories' keyframes (scripts/motion.mjs) too.
  const keyframes = css.match(/@keyframes[^{]+\{([\s\S]*?\})\s*\}/g) ?? [];
  expect(keyframes.length).toBeGreaterThan(50);
  for (const block of keyframes) {
    for (const [, prop] of block.matchAll(/([a-z-]+)\s*:/g)) expect(["opacity", "transform", "animation-timing-function"]).toContain(prop);
  }
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

test("the kitchen board shows only in the homepage kitchen band, /order-management's steps and /kitchen-display's hero", async ({ page }) => {
  const where: Record<string, string[]> = { "/": ["kitchen"], "/order-management": ["how"], "/kitchen-display": [""] };
  for (const path of pages) {
    await page.goto(path);
    const sections = await page.locator('main [data-visual="kitchen"]').evaluateAll((els) => els.map((el) => el.closest("section")?.id ?? ""));
    expect(sections, path).toEqual(where[path] ?? []);
  }
});
