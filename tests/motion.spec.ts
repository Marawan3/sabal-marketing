import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { LOOP, STEPS } from "../src/lib/hero-demo-timeline";
import { visuals } from "../scripts/motion-spec.mjs";
import { timing, type Timing } from "./motion";

/**
 * The visuals' stories are CSS @keyframes generated from
 * scripts/motion-spec.mjs (2026-10-14: the timer-and-lock player never
 * started in Safari on iPhone). These keep the generated CSS, the spec and
 * the components in step, and check ?debug=motion.
 */

type Spec = { steps: number[]; loop?: number };
const spec = visuals as Record<string, Spec>;

test("the generated keyframes are up to date with the spec", () => {
  execFileSync("node", ["scripts/motion.mjs", "--check"], { stdio: "pipe" });
});

test("the spec's step times are each component's own", async ({ page }) => {
  expect(spec.hero.steps).toEqual(STEPS);
  expect(spec.hero.loop).toBe(LOOP);
  const pages = ["/", "/how-it-works", "/pricing", "/delivery", "/catering", "/restaurant-websites", "/restaurant-seo", "/order-management", "/upsells", "/loyalty", "/payments"];
  const seen = new Set<string>();
  for (const path of pages) {
    await page.goto(path);
    for (const [name, steps] of await page.locator("[data-demo]").evaluateAll((els) => els.map((el) => [el.getAttribute("data-visual")!, el.getAttribute("data-steps")!]))) {
      const own = steps.split(" ").map(Number);
      if (own.length === 1) continue; // a still: nothing to run
      if (name.startsWith("flow-")) {
        // A product's four or five steps: the spec's, then its own last hold.
        expect(own.slice(0, -1), name).toEqual(spec.gflow.steps.slice(0, own.length - 1));
        seen.add("gflow");
      } else {
        expect(spec[name], name).toBeDefined();
        expect(own, name).toEqual(spec[name].steps);
        seen.add(name);
      }
    }
  }
  expect([...seen].sort()).toEqual(Object.keys(spec).sort());
});

test("?debug=motion lists each visual's play state, its last isIntersecting and its step", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/?debug=motion");
  const panel = page.locator("[data-motion-debug]");
  await expect(panel).toContainText("isIntersecting (last entry");
  const hero = panel.locator("tr", { hasText: /^hero/ });
  await expect(hero).toContainText("running");
  await expect(hero).toContainText("true");
  await expect(hero).toContainText(/\d+\/13/);
  // Off screen: paused.
  await expect(panel.locator("tr", { hasText: /^kitchen/ })).toContainText("paused: off screen");
  // With reduced motion it says so.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?debug=motion");
  await expect(panel.locator("tr", { hasText: /^hero/ })).toContainText("running (reduced motion)");
  // Without the flag there is no panel.
  await page.goto("/");
  await expect(page.locator("[data-motion-debug]")).toHaveCount(0);
});

/**
 * Reduced motion keeps the pace (owner, 2026-10-14): the same sequence on the
 * same clock, each change starting when the motion version's does, and every
 * crossfade at most 150 ms, so no step takes longer than with motion. A scroll
 * is a dip (out, jump, back in) inside the same 150 ms.
 */
test("with reduced motion every visual keeps the same pace: same loop and play-through, same change times, crossfades of 150 ms or less", async ({ page }) => {
  test.setTimeout(120_000);
  const where: Record<string, string> = {
    hero: "/",
    kitchen: "/order-management",
    orders: "/order-management",
    settings: "/order-management",
    dashboard: "/how-it-works",
    search: "/restaurant-seo",
    receipt: "/pricing",
    flow: "/delivery",
    delivery: "/delivery",
    catering: "/catering",
    storefront: "/restaurant-websites",
    loyalty: "/loyalty",
    upsell: "/upsells",
    "flow-payments": "/payments",
  };
  const read = async (name: string, path: string, reducedMotion: "reduce" | "no-preference") => {
    await page.emulateMedia({ reducedMotion });
    await page.goto(path);
    const el = page.locator(name === "hero" ? "#top [data-demo]" : `main [data-visual="${name}"]`).first();
    await el.evaluate((n) => n.scrollIntoView({ block: "center", behavior: "instant" }));
    return { ...(await timing(el)), steps: (await el.getAttribute("data-steps"))!.split(" ").map(Number) };
  };
  const report: string[] = [];
  for (const width of [393, 1440]) {
    await page.setViewportSize({ width, height: 852 });
    for (const [name, path] of Object.entries(where)) {
      const motion: Timing & { steps: number[] } = await read(name, path, "no-preference");
      const reduced: Timing = await read(name, path, "reduce");
      const label = `${name} at ${width}`;
      // The loop (the hero) or the play-through (the rest): the same clock.
      expect(Math.abs(reduced.clock - motion.clock), `${label}: clock`).toBeLessThanOrEqual(100);
      expect(reduced.repeats, `${label}: repeats`).toBe(motion.repeats);
      // (At phone width the orders dashboard is a still crop in both modes: nothing to compare.)
      expect(reduced.changes.length > 0, `${label}: changes in both modes or neither`).toBe(motion.changes.length > 0);
      if (!motion.changes.length) {
        report.push(`${label}: a still at this width in both modes`);
        continue;
      }
      // Every reduced change (a crossfade, or a part of a scroll's dip: out, jump, back in) happens
      // inside the 150 ms after a motion change starts, so it begins with that change and is done
      // within 150 ms of it. A motion change starts on a step or on a change read from its keyframes
      // (WebKit doesn't report a change between keyframes written with calc(var(--k) ...), the scrolls).
      const starts = [...motion.steps, ...motion.changes.map((c) => c.at)];
      for (const c of reduced.changes) {
        const owner = starts.filter((s) => s <= c.at + 5 && c.at + c.ms <= s + 155);
        expect(owner.length, `${label}: a change at ${c.at}-${c.at + c.ms} ms outside the 150 ms after any motion change (${c.what})`).toBeGreaterThan(0);
        expect(c.ms, `${label}: the crossfade at ${c.at} ms`).toBeLessThanOrEqual(150);
      }
      // The last step change starts at the same time, and it settles no later. (Instant swaps
      // inside a motion, like the phone's faces going out mid-turn for WebKit, aren't steps.)
      const last = (t: Timing) => Math.max(...t.changes.filter((c) => c.ms > 10).map((c) => c.at));
      expect(Math.abs(last(reduced) - last(motion)), `${label}: the last change`).toBeLessThanOrEqual(100);
      if (motion.repeats === 1) expect(reduced.settles, `${label}: settles`).toBeLessThanOrEqual(motion.settles + 100);
      // Moments that move with motion and have nothing in reduced motion (a button press).
      const unmatched = [...new Set(motion.changes.filter((c) => c.ms > 10 && !reduced.changes.some((r) => Math.abs(r.at - c.at) <= 5)).map((c) => c.at))];
      report.push(
        `${label}: clock ${motion.clock}/${reduced.clock} ms x${motion.repeats}, last change ${last(motion)}/${last(reduced)} ms, settles ${motion.settles}/${reduced.settles} ms, longest crossfade ${Math.max(...reduced.changes.map((c) => c.ms))} ms, moves with nothing to fade at ${unmatched.join(", ") || "none"} ms`,
      );
    }
  }
  test.info().annotations.push({ type: "timing (motion/reduced)", description: report.join("\n") });
  console.log(report.join("\n"));
});
