import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { LOOP, STEPS } from "../src/lib/hero-demo-timeline";
import { visuals } from "../scripts/motion-spec.mjs";

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
  // Without the flag there is no panel.
  await page.goto("/");
  await expect(page.locator("[data-motion-debug]")).toHaveCount(0);
});
