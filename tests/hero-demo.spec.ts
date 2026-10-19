import { expect, test, type BrowserContext, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { copy } from "../src/lib/copy";
import { demoOrder, SERVICE_FEE_PERCENT } from "../src/lib/demo-order";
import { SERVICE_FEE_CLAUSE } from "../src/lib/legal";
import { LOOP, NARROW_LOOP, NARROW_STEPS, STEPS } from "../src/lib/hero-demo-timeline";
import { clock, seek, stepAt, transformsWhileShown } from "./motion";

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

test("a drawn phone: real text, decorative for screen readers with one sentence, and the restaurant's own pictures", async ({ page }) => {
  await page.goto("/");
  await expect(demo(page)).toHaveCount(1);
  await expect(demo(page).locator(":scope > [aria-hidden='true']")).toHaveCount(1);
  await expect(demo(page).locator(":scope > .sr-only")).toHaveText(copy.hero.demo.description);
  // No video, canvas or screenshot frame: the screens are text and shapes.
  await expect(demo(page).locator("video, canvas, figure, iframe")).toHaveCount(0);
  // The pictures: each menu row's photo, the dish sheet's, and the restaurant's mark. Nothing else.
  const images = await demo(page).locator("img").evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src") ?? ""));
  const allowed = [...demoOrder.rows.map((row) => row.photo), demoOrder.dish.photo, demoOrder.mark];
  for (const src of images) expect(allowed).toContain(src);
  for (const src of allowed) expect(images).toContain(src);
  // The menu's dishes and prices, as text, every row with its photo.
  for (const row of demoOrder.rows) {
    const line = demo(page).locator('[data-screen="menu"] [data-scroll] > :last-child > div', { hasText: row.name });
    await expect(line.getByText(row.price, { exact: true })).toBeAttached();
    await expect(line.locator("img")).toHaveAttribute("src", row.photo!);
  }
});

test("the diner picks 16-inch, then Hot-honey drizzle, and Add item's price follows: $16.00, $21.00, $22.50", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const sheet = demo(page).locator("[data-sheet]");
  const price = sheet.locator("[data-add-price] > *");
  const shown = async () => {
    const all = await price.evaluateAll((els) => els.map((el) => [el.textContent, Number(getComputedStyle(el).opacity)] as [string, number]));
    return all.filter(([, o]) => o === 1).map(([t]) => t);
  };
  const picked = (step: number) => sheet.locator(`[data-pick="${step}"] > :last-child`).evaluate((el) => Number(getComputedStyle(el).opacity));
  await expect(sheet.locator('[data-pick="4"]')).toContainText("16-inch");
  await expect(sheet.locator('[data-pick="5"]')).toContainText("Hot-honey drizzle");
  await seek(demo(page), STEPS[4] - 10);
  expect(await shown()).toEqual(["$16.00"]);
  expect([await picked(4), await picked(5)]).toEqual([0, 0]);
  await seek(demo(page), STEPS[5] - 10);
  expect(await shown()).toEqual(["$21.00"]);
  expect([await picked(4), await picked(5)]).toEqual([1, 0]);
  await seek(demo(page), STEPS[6] - 10);
  expect(await shown()).toEqual([demoOrder.linePrice]);
  expect([await picked(4), await picked(5)]).toEqual([1, 1]);
  // The cart bar then says 1 item, at subtotal plus tax.
  await expect(demo(page).locator("[data-cart]")).toContainText(`View cart · 1 item${demoOrder.cartAmount}`);
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
  const subtotal = await row("1 item");
  const fee = await row(`Service fee (${SERVICE_FEE_PERCENT}%)`);
  const tax = await row("Taxes and fees ⓘ");
  const tip = await row("Tip");
  const total = await row("Total");
  expect(fee).toBe(Math.round((subtotal * SERVICE_FEE_PERCENT) / 100));
  expect(total).toBe(subtotal + fee + tax + tip);
  // The owner's figures (2026-10-19): a 16-inch Pepperoni Pizza ($16.00 + $5.00) with Hot-honey drizzle ($1.50).
  expect({ subtotal, fee, tax, tip, total }).toEqual({ subtotal: 2250, fee: 113, tax: 146, tip: 450, total: 2959 });
  expect(demoOrder.cartAmount).toBe("$23.96");
  expect(cents(demoOrder.cartAmount)).toBe(subtotal + tax);
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

test("at 1440 it plays the order through to the kitchen ticket beside the phone, then loops", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  // It runs from mount, on the browser's own clock.
  await expect(demo(page)).toHaveAttribute("data-run", "");
  await expect.poll(async () => (await clock(demo(page))).t).toBeGreaterThan(200);
  expect((await clock(demo(page))).state).toBe("running");
  const confirm = demo(page).locator('[data-screen="confirm"]');
  const slid = (el: Locator) => el.evaluate((n) => getComputedStyle(n).transform !== "none");
  await seek(demo(page), 600);
  expect(await slid(confirm)).toBe(true);
  // Step 13: the order lands on the kitchen display beside the phone.
  await seek(demo(page), STEPS[13] + 2_000);
  expect(stepAt(STEPS, (await clock(demo(page))).t)).toBe(13);
  expect(await slid(confirm)).toBe(false);
  await expect(demo(page).locator("[data-board]")).toBeVisible();
  // The ticket is this order: number, name, dish and option, and its timer runs from zero.
  const ticket = demo(page).locator("[data-board] [data-arrive]");
  await expect(ticket).toContainText(`#${demoOrder.ticket.number}`);
  await expect(ticket).toContainText(`Pickup · ${demoOrder.ticket.who}`);
  await expect(ticket).toContainText(demoOrder.dish.name);
  // Both choices, as mods under the dish.
  for (const mod of demoOrder.mods) await expect(ticket).toContainText(`+ ${mod}`);
  expect(await opacity(ticket)).toBe(1);
  await seek(demo(page), STEPS[13] + 3_000);
  await expect(ticket.locator("[data-timer]")).toHaveText("0:03");
  // Round again: the second time through starts on the menu.
  await seek(demo(page), LOOP + 600);
  expect(stepAt(STEPS, (await clock(demo(page))).t % LOOP)).toBe(0);
  expect(await slid(confirm)).toBe(true);
});

/** The menu screen as it stands: its scroll, the cart bar, the dish's cart count, and the checkout off to the side. `at` seeks first. */
async function menuAsAtTheStart(page: Page, at?: number) {
  if (at !== undefined) await seek(demo(page), at);
  return demo(page).evaluate((root) => {
    const style = (sel: string) => getComputedStyle(root.querySelector(sel)!);
    return {
      scroll: style("[data-scroll]").transform,
      cart: [style("[data-cart]").transform, style("[data-cart]").opacity],
      inCart: style('[data-screen="menu"] [class*="inCart"]').opacity,
      checkout: [style('[data-screen="checkout"]').transform, style('[data-screen="checkout"]').opacity],
    };
  });
}

/**
 * The phone's screen at one moment, read off a screenshot in a blank page: how
 * far the status bar strip (the time, the island, the icons) is from the same
 * strip at the top of the loop (0: the same pixels), and what share of the
 * screen under it has ink on it (anything darker than near-white).
 */
async function readScreen(probe: Page, png: Buffer, reference: boolean) {
  return probe.evaluate(
    async ({ b64, reference }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const g = c.getContext("2d")!;
      g.drawImage(img, 0, 0);
      const { data, width: w, height: h } = g.getImageData(0, 0, c.width, c.height);
      // The screen is 844 of the phone's own pixels tall; the status bar is its top 47.
      const k = h / 844;
      const strip: number[] = [];
      for (let y = Math.round(2 * k); y < Math.round(44 * k); y++) {
        for (let x = Math.round(w * 0.08); x < Math.round(w * 0.92); x++) {
          const i = (y * w + x) * 4;
          strip.push(data[i], data[i + 1], data[i + 2]);
        }
      }
      const store = window as unknown as { statusStrip?: number[] };
      if (reference) store.statusStrip = strip;
      const ref = store.statusStrip!;
      let diff = 0;
      for (let i = 0; i < strip.length; i++) diff += Math.abs(strip[i] - ref[i]);
      // Under the status bar, clear of the screen's rounded corners.
      let ink = 0;
      let all = 0;
      for (let y = Math.round(52 * k); y < Math.round((844 - 48) * k); y++) {
        for (let x = Math.round(w * 0.06); x < Math.round(w * 0.94); x++) {
          const i = (y * w + x) * 4;
          const luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          if (luma < 200) ink++;
          all++;
        }
      }
      return { statusDiff: diff / strip.length, ink: ink / all };
    },
    { b64: png.toString("base64"), reference },
  );
}

/** The phone shows nothing of the kitchen display: no flipper, no ticket, none of its words. */
async function noKitchenInPhone(page: Page) {
  await expect(demo(page).locator("[data-flipper]")).toHaveCount(0);
  const phone = demo(page).locator("[data-phone]");
  await expect(phone.locator("[data-arrive], [data-timer]")).toHaveCount(0);
  const text = await phone.innerText();
  expect(text).not.toContain(`Pickup · ${demoOrder.ticket.who}`);
  // The kitchen display's own header: its location and "N active".
  expect(text).not.toMatch(/\b\d+ active\b/);
  expect(text).not.toContain(demoOrder.location);
  await expect(demo(page).locator("[data-board]")).toBeHidden();
}

test("at 390 the phone never turns over: menu to confirmation, a 2.5 s hold, then again", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await expect(demo(page)).toHaveAttribute("data-run", "");
  await noKitchenInPhone(page);
  // Its own loop: the desktop's steps up to the confirmation, then the fade out.
  expect(NARROW_STEPS.slice(0, 13)).toEqual(STEPS.slice(0, 13));
  expect(await demo(page).getAttribute("data-steps-narrow")).toBe(NARROW_STEPS.join(" "));
  const clockLength = await demo(page).evaluate((el) =>
    Number(el.getAnimations().find((a) => (a as CSSAnimation).animationName === "vis-clock")!.effect!.getComputedTiming().duration),
  );
  expect(clockLength).toBe(NARROW_LOOP);
  const confirm = demo(page).locator('[data-screen="confirm"]');
  const shown = (el: Locator) => el.evaluate((n) => getComputedStyle(n).transform === "none");
  await seek(demo(page), STEPS[12] - 100);
  expect(await shown(confirm)).toBe(false);
  // The confirmation lands (520 ms) and holds about 2.5 s, until the restart at step 13.
  for (const t of [STEPS[12] + 600, STEPS[12] + 1_800, NARROW_STEPS[13] - 20]) {
    await seek(demo(page), t);
    expect(await shown(confirm), `confirmation at ${t} ms`).toBe(true);
    expect(await opacity(confirm), `confirmation at ${t} ms`).toBe(1);
  }
  expect(NARROW_STEPS[13] - (STEPS[12] + 520)).toBeGreaterThanOrEqual(2_400);
  expect(NARROW_STEPS[13] - (STEPS[12] + 520)).toBeLessThanOrEqual(2_600);
  // The restart: the confirmation crossfades (300 ms) to the menu just as the loop starts it.
  const menu = await menuAsAtTheStart(page, 50);
  await seek(demo(page), NARROW_STEPS[13] + 150);
  const mid = await opacity(confirm);
  expect(mid).toBeGreaterThan(0);
  expect(mid).toBeLessThan(1);
  await seek(demo(page), NARROW_STEPS[13] + 320);
  expect(await opacity(confirm)).toBe(0);
  expect(await menuAsAtTheStart(page)).toEqual(menu);
  // Round again: the confirmation is back off screen.
  await seek(demo(page), NARROW_LOOP + 600);
  expect(await shown(confirm)).toBe(false);
  // Across one whole loop the kitchen never shows in the phone.
  for (let t = 0; t <= NARROW_LOOP; t += 400) {
    await seek(demo(page), t);
    await noKitchenInPhone(page);
  }
});

/**
 * The phone is never blank (owner, 2026-10-19: the restart used to fade the whole
 * screen, status bar and island included, to white for about a second). At every
 * moment of a loop, every 100 ms and every 25 ms across the restart and the top
 * of the next loop: the status bar and the island are exactly as at the top of
 * the loop, and the screen under them shows something.
 */
for (const width of [390, 1280]) {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`at ${width}${reducedMotion === "reduce" ? " with reduced motion" : ""} the phone screen is never blank, and the status bar and island never leave`, async ({
      page,
      context,
    }) => {
      test.setTimeout(240_000);
      await page.emulateMedia({ reducedMotion });
      // Tall enough that the whole phone is on screen without scrolling (scrolling would let the player run it).
      await page.setViewportSize({ width, height: 1400 });
      await page.goto("/");
      await expect(demo(page)).toHaveAttribute("data-run", "");
      await demo(page).evaluate((root) => Promise.all([...root.querySelectorAll("img")].map((img) => img.decode().catch(() => {}))));
      const narrow = width < 1024;
      const steps = narrow ? NARROW_STEPS : STEPS;
      const loop = narrow ? NARROW_LOOP : LOOP;
      const restart = steps[steps.length - 1];
      const times = new Set<number>();
      for (let t = 0; t < loop; t += 100) times.add(t);
      for (let t = restart - 50; t <= loop + 200; t += 25) times.add(t);
      const screen = demo(page).locator("[data-phone-screen]");
      const probe = await (context as BrowserContext).newPage();
      // Measured 2026-10-19: under the status bar the barest moment still has 4–5% ink on it, and
      // the status strip drifts by under 0.1 (anti-aliasing). The old restart's white phone: 0% and tens.
      const blank: string[] = [];
      let least = { ink: 1, at: 0 };
      for (const t of [...times].sort((a, b) => a - b)) {
        await seek(demo(page), t);
        const png = await page.screenshot({ clip: (await screen.boundingBox())!, scale: "css" });
        const { statusDiff, ink } = await readScreen(probe, png, t === 0);
        if (statusDiff > 1) blank.push(`${t} ms: the status bar or the island changed (${statusDiff.toFixed(2)} off)`);
        if (ink < 0.02) blank.push(`${t} ms: ${(ink * 100).toFixed(2)}% of the screen under the status bar shows anything`);
        if (ink < least.ink) least = { ink, at: t };
      }
      await probe.close();
      test.info().annotations.push({ type: "barest moment", description: `${(least.ink * 100).toFixed(1)}% ink at ${least.at} ms` });
      expect(blank).toEqual([]);
    });
  }
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
  test(`with reduced motion at ${width}: the same loop runs as crossfades, and nothing moves`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    await page.clock.install({ time: NOON });
    await page.goto("/");
    await expect.poll(async () => (await clock(demo(page))).state).toBe("running");
    // Nothing moves where it can be seen: the only transforms are the two scrolls (menu,
    // checkout), each a jump inside a dip to opacity 0. And the pause button is there.
    // (The menu's second dip, back to the top, is under the confirmation before the restart, 2026-10-19.)
    const { changes, shown } = await transformsWhileShown(demo(page));
    expect(changes).toBe(3);
    expect(shown).toEqual([]);
    await expect(demo(page).getByRole("button", { name: copy.hero.demo.pause })).toBeVisible();
    // The menu's dip starts with the motion scroll (step 1) and is done 150 ms later.
    const menu = demo(page).locator("[data-scroll]");
    const look = () => menu.evaluate((el) => ({ opacity: Number(getComputedStyle(el).opacity), transform: getComputedStyle(el).transform }));
    await seek(demo(page), STEPS[1] - 10);
    expect(await look()).toEqual({ opacity: 1, transform: "none" });
    await seek(demo(page), STEPS[1] + 40);
    const mid = await look();
    expect(mid.opacity).toBeGreaterThan(0);
    expect(mid.opacity).toBeLessThan(1);
    expect(mid.transform).toBe("none");
    await seek(demo(page), STEPS[1] + 150);
    const after = await look();
    expect(after.opacity).toBe(1);
    expect(after.transform).not.toBe("none");
    // The confirmation fades in where it lands.
    const confirm = demo(page).locator('[data-screen="confirm"]');
    await seek(demo(page), 600);
    expect(await opacity(confirm)).toBe(0);
    await seek(demo(page), STEPS[12] + 600);
    expect(await opacity(confirm)).toBe(1);
    expect(await confirm.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    await expect(confirm.locator('[data-clock="ready"]')).toHaveText("5:00 PM");
    if (width >= 1024) {
      // The kitchen ticket fades in on the display beside the phone.
      await seek(demo(page), STEPS[13] + 2_000);
      const ticket = demo(page).locator("[data-board] [data-arrive]");
      expect(await opacity(ticket)).toBe(1);
      await expect(ticket).toContainText(`#${demoOrder.ticket.number}`);
      await seek(demo(page), LOOP + 600);
    } else {
      // Phones: no kitchen display. The confirmation holds until the fade out, then the menu again.
      await noKitchenInPhone(page);
      await seek(demo(page), NARROW_STEPS[13] - 20);
      expect(await opacity(confirm)).toBe(1);
      await seek(demo(page), NARROW_LOOP + 600);
    }
    // Round again: back on the menu.
    expect(await opacity(confirm)).toBe(0);
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
  expect([...moved].sort()).toEqual(["opacity", "transform"]);
  // The story's keyframes (scripts/motion.mjs) too.
  const keyframes = css.match(/@keyframes[^{]+\{([\s\S]*?\})\s*\}/g) ?? [];
  for (const block of keyframes) {
    const props = [...block.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
    for (const prop of props) expect(["opacity", "transform", "animation-timing-function"]).toContain(prop);
  }
});
