import type { Locator } from "@playwright/test";

/**
 * The visuals run on the browser's own animation clock (CSS @keyframes, see
 * scripts/motion.mjs), so tests read and move that clock through the Web
 * Animations API instead of faking timers.
 */

/** Where a visual's story is, in ms (its vis-clock animation), and whether that clock is running. */
export function clock(el: Locator) {
  return el.evaluate((root) => {
    const a = root.getAnimations().find((x) => (x as CSSAnimation).animationName === "vis-clock");
    return { t: Number(a?.currentTime ?? -1), state: a?.playState ?? "none" };
  });
}

/** Stop every animation in a visual at `t` ms of its story, so a test can look at that moment. */
export function seek(el: Locator, t: number) {
  return el.evaluate((root, at) => {
    for (const a of root.getAnimations({ subtree: true })) {
      a.pause();
      a.currentTime = at;
    }
  }, t);
}

/** Play a visual's story `rate` times faster, still under the page's own play and pause rules. */
export function speed(el: Locator, rate: number) {
  return el.evaluate((root, r) => {
    for (const a of root.getAnimations({ subtree: true })) a.playbackRate = r;
  }, rate);
}

/** The step a story is on at `t` ms. */
export const stepAt = (steps: readonly number[], t: number) => steps.reduce((n, at, i) => (t >= at ? i : n), 0);
