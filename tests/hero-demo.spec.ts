import { expect, test, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { copy } from "../src/lib/copy";
import { demoOrder, SERVICE_FEE_PERCENT } from "../src/lib/demo-order";
import { SERVICE_FEE_CLAUSE } from "../src/lib/legal";
import { LOOP, STEPS } from "../src/lib/hero-demo-timeline";
import { clock, seek, stepAt } from "./motion";

/**
 * The homepage hero: a phone drawn in HTML and CSS that orders from the demo
 * restaurant, and the kitchen ticket that order makes (hero-order-demo.tsx).
 */

test.use({ timezoneId: "America/New_York" });

const demo = (page: Page) => page.locator("#top [data-demo]");
/** Whether an element shows: opacity all the way up to the hero. */
const opacity = (el: Locator) =>
  el.evaluate((node) => {
    let o = 1;
    for (let n: Element | null = node; n && !n.hasAttribute("data-demo"); n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
    return o;
  });
const NOON = new Date("2026-10-13T16:40:00-04:00");

test("a drawn phone: real text, decorative for screen readers with one sentence, and only the dish photo as a picture", async ({ page }) => {
  await page.goto("/");
  await expect(demo(page)).toHaveCount(1);
  await expect(demo(page).locator(":scope > [aria-hidden='true']")).toHaveCount(1);
  await expect(demo(page).locator(":scope > .sr-only")).toHaveText(copy.hero.demo.description);
  // No video, canvas or screenshot frame: the screens are text and shapes.
  await expect(demo(page).locator("video, canvas, figure, iframe")).toHaveCount(0);
  const images = await demo(page).locator("img").evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src") ?? ""));
  expect(images.length).toBeGreaterThan(0);
  for (const src of images) expect(decodeURIComponent(src)).toContain(demoOrder.dish.photo);
  // The real dishes and prices, as text.
  for (const row of demoOrder.rows) await expect(demo(page).getByText(row.name, { exact: true }).first()).toBeAttached();
  await expect(demo(page).getByText(demoOrder.dish.price, { exact: true }).first()).toBeAttached();
});

test("checkout shows the diner's service fee as /pricing and /terms state it, and every total agrees", async ({ page, request }) => {
  // The same percentage as the terms, the pricing page and the homepage pricing card.
  expect(SERVICE_FEE_CLAUSE).toContain(`service fee of ${SERVICE_FEE_PERCENT}% of the order`);
  for (const path of ["/pricing", "/terms"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).toMatch(new RegExp(`service fee(?: of)? ${SERVICE_FEE_PERCENT}%|${SERVICE_FEE_PERCENT}% service fee`));
  }
  await page.goto("/");
  const checkout = demo(page).locator('[data-screen="checkout"]');
  const cents = (text: string) => Math.round(Number(text.replace(/[$,]/g, "")) * 100);
  const row = async (label: string) => {
    const line = checkout.locator("div", { has: page.getByText(label, { exact: true }) }).last();
    return cents((await line.locator("span").last().textContent())!.trim());
  };
  const subtotal = cents(demoOrder.dish.price);
  const fee = await row(`Service fee (${SERVICE_FEE_PERCENT}%)`);
  const tax = await row("Taxes and fees ⓘ");
  const tip = await row("Tip");
  const total = await row("Total");
  expect(fee).toBe(Math.round((subtotal * SERVICE_FEE_PERCENT) / 100));
  expect(total).toBe(subtotal + fee + tax + tip);
  // The fee sits between the subtotal (the items row) and the total.
  const text = (await checkout.innerText()).replace(/\s+/g, " ");
  const at = (needle: string) => text.indexOf(needle);
  const feeLabel = `Service fee (${SERVICE_FEE_PERCENT}%)`;
  expect(at("1 item")).toBeLessThan(at(feeLabel));
  expect(at(feeLabel)).toBeLessThan(at("Total"));
  // The Pay button and the confirmation carry the same total.
  await expect(checkout.locator("[data-paying]").last()).toContainText(demoOrder.total);
  await expect(demo(page).locator('[data-screen="confirm"]')).toContainText(`Total${demoOrder.total}`);
  expect(cents(demoOrder.total)).toBe(total);
});

test("the pause button is labelled, 44px, and the only control", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const button = demo(page).getByRole("button", { name: copy.hero.demo.pause });
  await expect(button).toBeVisible();
  const box = (await button.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  await expect(demo(page).locator("a, button, input")).toHaveCount(1);
  await button.click();
  await expect(demo(page).getByRole("button", { name: copy.hero.demo.play })).toBeVisible();
});

test("the phone shows the visitor's time, and the confirmation a ready time 20 minutes on", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.clock.install({ time: NOON });
  await page.goto("/");
  await page.clock.runFor(500);
  await expect(demo(page).locator('[data-clock="status"]').first()).toHaveText("4:40");
  await expect(demo(page).locator('[data-clock="kitchen"]')).toHaveText("4:40 PM");
  await expect(demo(page).locator('[data-clock="ready"]')).toHaveText("5:00 PM");
});

for (const width of [390, 1440]) {
  test(`at ${width} it plays the order through to the kitchen ticket, then loops`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    // It runs from mount, on the browser's own clock.
    await expect(demo(page)).toHaveAttribute("data-run", "");
    await expect.poll(async () => (await clock(demo(page))).t).toBeGreaterThan(200);
    expect((await clock(demo(page))).state).toBe("running");
    const confirm = demo(page).locator('[data-screen="confirm"]');
    const slid = (el: Locator) => el.evaluate((n) => getComputedStyle(n).transform !== "none");
    await seek(demo(page), 600);
    expect(await slid(confirm)).toBe(true);
    // Step 12: the order lands in the kitchen.
    // (On phones the ticket lands after the turn.)
    await seek(demo(page), STEPS[12] + 2_000);
    expect(stepAt(STEPS, (await clock(demo(page))).t)).toBe(12);
    expect(await slid(confirm)).toBe(false);
    // The ticket is this order: number, name, dish and option, and its timer runs from zero.
    const ticket = width >= 1024 ? demo(page).locator("[data-board] [data-arrive]") : demo(page).locator("[data-flipper] [data-arrive]");
    await expect(ticket).toContainText(`#${demoOrder.ticket.number}`);
    await expect(ticket).toContainText(`Pickup · ${demoOrder.ticket.who}`);
    await expect(ticket).toContainText(demoOrder.dish.name);
    await expect(ticket).toContainText(`+ ${demoOrder.pick}`);
    expect(await opacity(ticket)).toBe(1);
    await seek(demo(page), STEPS[12] + 3_000);
    await expect(ticket.locator("[data-timer]")).toHaveText("0:03");
    // Phones turn over to the kitchen's side; desktop keeps the phone and shows the board beside it.
    const flip = await demo(page).locator("[data-flipper]").evaluate((el) => getComputedStyle(el).transform);
    if (width >= 1024) {
      expect(flip).toBe("none");
      await expect(demo(page).locator("[data-board]")).toBeVisible();
    } else {
      expect(flip).not.toBe("none");
      await expect(demo(page).locator("[data-board]")).toBeHidden();
    }
    // Round again: the second time through starts on the menu.
    await seek(demo(page), LOOP + 600);
    expect(stepAt(STEPS, (await clock(demo(page))).t % LOOP)).toBe(0);
    expect(await slid(confirm)).toBe(true);
    expect(await demo(page).locator("[data-flipper]").evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  });
}

test("it holds when paused and while fully off screen, and runs again after", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect.poll(async () => (await clock(demo(page))).t).toBeGreaterThan(300);

  await demo(page).getByRole("button", { name: copy.hero.demo.pause }).click();
  const held = (await clock(demo(page))).t;
  await page.waitForTimeout(1_000);
  expect(await clock(demo(page))).toEqual({ t: held, state: "paused" });
  await demo(page).getByRole("button", { name: copy.hero.demo.play }).click();
  await expect.poll(async () => (await clock(demo(page))).t).toBeGreaterThan(held + 300);

  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await expect(demo(page)).not.toHaveAttribute("data-run");
  const away = (await clock(demo(page))).t;
  await page.waitForTimeout(1_000);
  expect(await clock(demo(page))).toEqual({ t: away, state: "paused" });
  // Partly on screen counts as on screen.
  await page.evaluate(() => {
    const box = document.querySelector("#top [data-demo]")!.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + box.bottom - 40, behavior: "instant" });
  });
  await expect(demo(page)).toHaveAttribute("data-run", "");
  await expect.poll(async () => (await clock(demo(page))).t).toBeGreaterThan(away + 300);
});

for (const width of [390, 1440]) {
  test(`with reduced motion at ${width}: nothing moves; the confirmation and the ticket show as a still`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    await page.clock.install({ time: NOON });
    await page.goto("/");
    // Nothing to run: no animation anywhere in it.
    expect(await demo(page).evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
    await expect(demo(page).getByRole("button")).toBeHidden();
    const confirm = demo(page).locator('[data-screen="confirm"]');
    expect(await confirm.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    await expect(confirm).toContainText(`#${demoOrder.ticket.number}`);
    await expect(confirm.locator('[data-clock="ready"]')).toHaveText("5:00 PM");
    const ticket = width >= 1024 ? demo(page).locator("[data-board] [data-arrive]") : demo(page).locator("[data-still]");
    await expect(ticket).toBeVisible();
    expect(await ticket.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    await expect(ticket).toContainText(`#${demoOrder.ticket.number}`);
  });
}

test("no layout shift: the hero keeps its size from the first paint through a whole loop", async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const first = await demo(page).boundingBox();
    await page.evaluate(() => {
      (window as unknown as { cls: number }).cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as { value: number }[]) (window as unknown as { cls: number }).cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.waitForTimeout(LOOP + 1_000);
    expect(await page.evaluate(() => (window as unknown as { cls: number }).cls), `CLS at ${width}`).toBe(0);
    expect(await demo(page).boundingBox(), `hero box at ${width}`).toEqual(first);
  }
});

test("only transform and opacity animate", () => {
  const css = readFileSync(join(process.cwd(), "src/components/hero-order-demo.module.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const moved = new Set<string>();
  for (const [, selector, body] of rules) {
    if (selector.includes(".playPause")) continue; // the button's hover colour, like every button on the site
    for (const [, value] of body.matchAll(/transition(?:-property)?:\s*([^;]+);/g)) {
      for (const part of value.split(/,(?![^(]*\))/)) moved.add(part.trim().split(/\s+/)[0]);
    }
  }
  expect([...moved].sort()).toEqual(["none", "opacity", "transform"]);
  // The story's keyframes (scripts/motion.mjs) too.
  const keyframes = css.match(/@keyframes[^{]+\{([\s\S]*?\})\s*\}/g) ?? [];
  for (const block of keyframes) {
    const props = [...block.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
    for (const prop of props) expect(["opacity", "transform", "animation-timing-function"]).toContain(prop);
  }
});
