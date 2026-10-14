import type { Locator } from "@playwright/test";

/**
 * The visuals run on the browser's own animation clock (CSS @keyframes, see
 * scripts/motion.mjs), so tests read and move that clock through the Web
 * Animations API instead of faking timers.
 */

/**
 * Where a visual's story is, in ms (its vis-clock animation), and whether that clock is running.
 * It applies the page's styles, then waits for a pending play or pause to
 * land: WebKit keeps counting currentTime for a few frames after a CSS pause,
 * then settles back to where the pause was asked for.
 */
export function clock(el: Locator) {
  return el.evaluate(async (root) => {
    void getComputedStyle(root).animationPlayState;
    const a = root.getAnimations().find((x) => (x as CSSAnimation).animationName === "vis-clock");
    await a?.ready;
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

/**
 * A visual's timing, read from its running animations: the clock's length
 * and repeats, when each change starts and how long it takes (any two
 * neighbouring keyframes whose values differ), and when the last animation
 * settles. Times are ms from the top of the story.
 */
export type Timing = { clock: number; repeats: number; changes: { at: number; ms: number; what: string }[]; settles: number };
export function timing(el: Locator): Promise<Timing> {
  return el.evaluate((root) => {
    const out = { clock: -1, repeats: 0, changes: [] as { at: number; ms: number; what: string }[], settles: 0 };
    // document.getAnimations() also has the ones on ::before and ::after, which a subtree read can miss.
    const mine = document.getAnimations().filter((a) => {
      const target = (a.effect as KeyframeEffect | null)?.target;
      return !!target && root.contains(target);
    });
    for (const a of mine) {
      const effect = a.effect as KeyframeEffect;
      const t = effect.getComputedTiming();
      const duration = Number(t.duration);
      if ((a as CSSAnimation).animationName === "vis-clock") {
        out.clock = duration;
        out.repeats = Number(t.iterations);
        continue;
      }
      const delay = Number(effect.getTiming().delay ?? 0);
      // The values that move (opacity, transform) and nothing else: WebKit also lists each
      // keyframe's timing function as a property. A keyframe left out at 0% or 100% is the
      // element's own value.
      const frames = effect.getKeyframes().map((k) => {
        const values = (["opacity", "transform"] as const).map((key) => {
          const v = k[key];
          return v === undefined ? null : Number.isFinite(Number(v)) ? Number(Number(v).toFixed(3)) : String(v).replace(/\s+/g, " ").trim();
        });
        return { at: Number(k.computedOffset), values: JSON.stringify(values) };
      });
      if (frames[0]?.at > 0) frames.unshift({ at: 0, values: "own" });
      if (frames[frames.length - 1]?.at < 1) frames.push({ at: 1, values: "own" });
      for (let i = 0; i + 1 < frames.length; i++) {
        if (frames[i].values === frames[i + 1].values || frames[i + 1].at === frames[i].at) continue;
        out.changes.push({
          at: Math.round(delay + frames[i].at * duration),
          ms: Math.round((frames[i + 1].at - frames[i].at) * duration),
          // Which animation, and its raw keyframes, for a failure message.
          what: `${(a as CSSAnimation).animationName}${effect.pseudoElement ?? ""} ${frames[i].values} -> ${frames[i + 1].values} raw ${JSON.stringify(effect.getKeyframes())}`,
        });
      }
      if (Number.isFinite(Number(t.endTime))) out.settles = Math.max(out.settles, Math.round(Number(t.endTime)));
    }
    return out;
  });
}
