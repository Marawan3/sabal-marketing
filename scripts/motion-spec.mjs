/**
 * The built visuals' stories, as tracks (2026-10-14). scripts/motion.mjs
 * turns them into CSS @keyframes in each visual's CSS module, between the
 * "motion:start" and "motion:end" markers, so the browser plays every story
 * on its own clock: no JavaScript tick, no gate.
 *
 * A visual: its step times in ms (the same as its component's STEPS; a test
 * checks they agree), and whether it loops (the hero only).
 *
 * A track: one CSS property of the elements a selector matches.
 *   start    the value at step 0; null means the element's own CSS value (its
 *            ramp is then linear: give the value when the ramp should ease)
 *   changes  [step, value] pairs: at that step the value ramps to the new one;
 *            null means back to the element's own CSS value. {at: ms} in
 *            place of a step is a time.
 *   ramp     the ramp's duration and easing (the old transition)
 *   delay    extra ms added to every change
 *   media    a media query the track applies under
 *   clip     (loops) a last ramp that would run past the loop's end ends with it
 *
 * Play-once visuals' own CSS is their last step (the CSS is written end
 * backwards), so most tracks end on null. The hero's CSS is its first step,
 * so its tracks spell out every value.
 */

const move = { ms: 560, ease: "cubic-bezier(0.2, 0.8, 0.2, 1)" };
const fade = { ms: 320, ease: "ease" };
const scroll = { ms: 900, ease: "cubic-bezier(0.3, 0, 0.2, 1)" };
const press = { ms: 160, ease: "ease" };

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** Fade a thing in at step k: opacity and a small shift, like the old :not([data-s~=k]) rules. */
const enter = (sel, k, shift, ramps = { opacity: fade, transform: move }) => [
  { sel, prop: "opacity", start: "0", changes: [[k, null]], ramp: ramps.opacity },
  { sel, prop: "transform", start: shift, changes: [[k, null]], ramp: ramps.transform },
];

export const visuals = {
  /* ---------------- src/components/visuals/visuals.module.css ---------------- */
  kitchen: {
    file: "visuals",
    steps: [0, 1400, 1800, 2500, 3200],
    tracks: [
      { sel: ".out", prop: "opacity", start: "1", changes: [[2, null]], ramp: fade },
      { sel: ".out", prop: "transform", start: "none", changes: [[2, null]], ramp: move },
      { sel: ".out > :last-child", prop: "transform", start: "none", changes: [[1, "scale(0.97)"], [2, null]], ramp: press },
      ...enter(".in", 2, "translateX(-40%)"),
      { sel: ".up", prop: "transform", start: "none", changes: [[3, null]], ramp: move },
      { sel: ".count > :first-child", prop: "opacity", start: "1", changes: [[2, null]], ramp: fade },
      { sel: ".count > :last-child", prop: "opacity", start: "0", changes: [[2, null]], ramp: fade },
    ],
  },
  dashboard: {
    file: "visuals",
    steps: [0, 300, 1500, 2200],
    tracks: [
      { sel: ".reveal", prop: "transform", start: "none", changes: [[1, null]], ramp: { ms: 1400, ease: "cubic-bezier(0.4, 0, 0.2, 1)" } },
      ...enter(".stat", 2, "translateY(8px)"),
    ],
  },
  search: {
    file: "visuals",
    steps: [0, 300, 800, 1100, 1400, 1700, 2200],
    tracks: range(1, 6).flatMap((k) => enter(`.search [data-line="${k}"]`, k, "translateY(6px)")),
  },
  receipt: {
    file: "visuals",
    steps: [0, 300, 650, 1000, 1350, 1700, 2050, 2400, 2900],
    tracks: range(1, 7).flatMap((k) => enter(`.rLine[data-line="${k}"]`, k, "translateY(6px)")),
  },
  flow: {
    file: "visuals",
    steps: [0, 400, 1400, 2400, 3400, 4400, 5400, 6200],
    tracks: [
      ...range(1, 6).map((k) => ({ sel: `.flow [data-step="${k}"]`, prop: "opacity", start: "0.25", changes: [[k, null]], ramp: fade })),
      ...[1, 2, 3, 4].map((k) => ({ sel: `.flow [data-node="${k}"] .nodeOn`, prop: "opacity", start: "0", changes: [[k, null]], ramp: fade })),
      { sel: '.flow [data-node="5"] .nodeOn', prop: "opacity", start: "0", changes: [[6, null]], ramp: fade },
      {
        sel: ".trackFill",
        prop: "transform",
        start: "scaleX(0)",
        changes: [[2, "scaleX(0.25)"], [3, "scaleX(0.5)"], [4, "scaleX(0.75)"], [6, null]],
        ramp: move,
      },
    ],
  },
  /* Any product's steps (step-flow.tsx): step k at 400 + (k - 1) * 1000 ms, for four or five steps. */
  gflow: {
    file: "visuals",
    steps: [0, 400, 1400, 2400, 3400, 4400],
    tracks: [
      ...range(1, 5).map((k) => ({ sel: `.gflow [data-gstep="${k}"]`, prop: "opacity", start: "0.25", changes: [[k, null]], ramp: fade })),
      ...range(1, 5).map((k) => ({ sel: `.gflow [data-gnode="${k}"] .nodeOn`, prop: "opacity", start: "0", changes: [[k, null]], ramp: fade })),
      {
        sel: '.gflow[data-n="4"] .gfill',
        prop: "transform",
        start: "scaleX(0)",
        changes: [[2, "scaleX(0.3333)"], [3, "scaleX(0.6667)"], [4, null]],
        ramp: move,
      },
      {
        sel: '.gflow[data-n="5"] .gfill',
        prop: "transform",
        start: "scaleX(0)",
        changes: [[2, "scaleX(0.25)"], [3, "scaleX(0.5)"], [4, "scaleX(0.75)"], [5, null]],
        ramp: move,
      },
    ],
  },
  storefront: {
    file: "visuals",
    steps: [0, 1100, 2600, 2900, 3900],
    tracks: [
      { sel: ".storefront .scrollA", prop: "transform", start: "none", changes: [[1, null]], ramp: scroll },
      { sel: '.storefront [data-tap="2"]', tap: 2 },
      { sel: ".storefront .slideB", prop: "transform", start: "translateX(101%)", changes: [[3, null]], ramp: move },
    ],
  },
  delivery: {
    file: "visuals",
    steps: [0, 1500, 3000, 3600, 4800, 5100, 6400, 7700, 8600],
    tracks: [
      { sel: ".delivery .scrollA", prop: "transform", start: "none", changes: [[1, null]], ramp: scroll },
      { sel: '.delivery [data-tap="2"]', tap: 2 },
      { sel: '.delivery [data-tap="4"]', tap: 4 },
      { sel: ".delivery .slideB", prop: "transform", start: "translateX(101%)", changes: [[3, null]], ramp: move },
      { sel: ".delivery .slideC", prop: "transform", start: "translateX(101%)", changes: [[5, null]], ramp: move },
      { sel: ".delivery .swap2 > :first-child", prop: "opacity", start: "1", changes: [[2, null]], ramp: fade },
      { sel: ".delivery .swap2 > :last-child", prop: "opacity", start: "0", changes: [[2, null]], ramp: fade },
      { sel: ".delivery .scrollB", prop: "transform", start: "none", changes: [[6, null]], ramp: scroll },
      { sel: '.delivery [data-reach="6"]', prop: "opacity", start: "0", changes: [[6, null]], ramp: fade },
      { sel: '.delivery [data-reach="7"]', prop: "opacity", start: "0", changes: [[7, null]], ramp: fade },
      { sel: '.delivery .current[data-cur="7"]', prop: "opacity", start: "0", changes: [[7, null]], ramp: fade },
      { sel: '.delivery .current[data-cur="5-6"]', prop: "opacity", start: "0", changes: [[5, "1"], [6, null]], ramp: fade },
      { sel: '.delivery .current[data-cur="6-7"]', prop: "opacity", start: "0", changes: [[6, "1"], [7, null]], ramp: fade },
      { sel: '.delivery .current[data-cur="5-7"]', prop: "opacity", start: "0", changes: [[5, "1"], [7, null]], ramp: fade },
    ],
  },
  catering: {
    file: "visuals",
    steps: [0, 1200, 2900, 3400, 4300],
    tracks: [
      {
        sel: ".catering .scrollA",
        prop: "transform",
        start: "none",
        changes: [[1, "translateY(calc(var(--k) * -330))"], [3, null]],
        ramp: scroll,
      },
      { sel: '.catering [data-tap="2"]', tap: 2 },
      { sel: ".catering .swap2 > :first-child", prop: "opacity", start: "1", changes: [[2, null]], ramp: fade },
      { sel: ".catering .swap2 > :last-child", prop: "opacity", start: "0", changes: [[2, null]], ramp: fade },
      { sel: ".catering .formFields", prop: "opacity", start: "1", changes: [[3, null]], ramp: fade },
      { sel: ".catering .thanks", prop: "opacity", start: "0", changes: [[3, null]], ramp: fade },
    ],
  },
  orders: {
    file: "visuals",
    steps: [0, 1000, 1400, 2400],
    tracks: [
      { sel: '.odRow[data-row="1925"]::before', prop: "opacity", start: "0", changes: [[1, null]], ramp: fade },
      { sel: ".odShade", prop: "opacity", start: "0", changes: [[2, null]], ramp: fade },
      { sel: ".odDrawer", prop: "transform", start: "translateX(101%)", changes: [[2, null]], ramp: move },
    ],
  },
  settings: {
    file: "visuals",
    steps: [0, 800, 1200, 2000],
    tracks: [
      { sel: ".flip > :first-child", prop: "opacity", start: "1", changes: [[2, null]], ramp: fade },
      { sel: ".flip > :first-child", prop: "transform", start: "none", changes: [[2, null]], ramp: move },
      { sel: ".flip > :last-child", prop: "opacity", start: "0", changes: [[2, null]], ramp: fade },
      { sel: ".flip > :last-child", prop: "transform", start: "translateY(40%)", changes: [[2, null]], ramp: move },
      { sel: ".setAdjust", prop: "transform", start: "none", changes: [[1, "scale(0.98)"], [2, null]], ramp: press },
    ],
  },
  loyalty: {
    file: "visuals",
    steps: [0, 700, 1500],
    tracks: enter(".loyalty .reward", 1, "translateY(calc(var(--k) * 16))"),
  },
  upsell: {
    file: "visuals",
    steps: [0, 700, 1500],
    tracks: enter(".upsell .upPairs", 1, "translateY(calc(var(--k) * 16))"),
  },

  /* ---------------- src/components/hero-order-demo.module.css ---------------- */
  hero: {
    file: "hero",
    loop: 14400,
    steps: [0, 900, 1900, 2200, 3400, 4300, 4600, 5600, 5900, 7000, 7900, 8600, 9800, 13800],
    tracks: (() => {
      const m = { ms: 520, ease: "cubic-bezier(0.2, 0.8, 0.2, 1)" };
      const f = { ms: 280, ease: "ease" };
      const show = (sel, k) => ({ sel, prop: "opacity", start: "0", changes: [[k, "1"]], ramp: f });
      const hide = (sel, k) => ({ sel, prop: "opacity", start: "1", changes: [[k, "0"]], ramp: f });
      const pressAt = (sel, k) => ({ sel, prop: "transform", start: "none", changes: [[k, "scale(0.97)"], [k + 1, "none"]], ramp: press });
      // The ticket lands `extra` ms after step 12 and leaves with step 13 (under the cover).
      const arrive = (sel, extra) => [
        { sel, prop: "opacity", start: "0", changes: [[{ at: 9800 + extra }, "1"], [13, "0"]], ramp: f },
        { sel, prop: "transform", start: "translateX(calc(var(--k) * -60))", changes: [[{ at: 9800 + extra }, "none"]], ramp: m },
      ];
      return [
        { sel: ".wrap .scroll", prop: "transform", start: "none", changes: [[1, "translateY(calc(var(--k) * -96))"]], ramp: scroll },
        ...[2, 4, 5, 7, 10].map((k) => ({ sel: `.wrap [data-tap="${k}"]`, tap: k })),
        { sel: ".wrap .backdrop", prop: "opacity", start: "0", changes: [[3, "1"], [6, "0"]], ramp: f },
        { sel: ".wrap .sheet", prop: "transform", start: "translateY(102%)", changes: [[3, "none"], [6, "translateY(102%)"]], ramp: m },
        show(".wrap .radio i", 4),
        show(".wrap [data-pick] > :last-child", 4),
        hide(".wrap [data-pick] > :first-child", 4),
        show(".wrap .inCart", 6),
        show(".wrap [data-paying] > :last-child", 10),
        hide(".wrap [data-paying] > :first-child", 10),
        show(".wrap .kCount > :last-child", 12),
        hide(".wrap .kCount > :first-child", 12),
        show(".wrap .kActive > :last-child", 12),
        hide(".wrap .kActive > :first-child", 12),
        pressAt(".wrap .sheet .action", 5),
        pressAt(".wrap .cartBar .action", 7),
        pressAt(".wrap .payBar .action", 10),
        { sel: ".wrap .cartBar", prop: "transform", start: "translateY(110%)", changes: [[6, "none"]], ramp: m },
        { sel: ".wrap .checkout", prop: "transform", start: "translateX(101%)", changes: [[8, "none"]], ramp: m },
        { sel: ".wrap .checkout .page", prop: "transform", start: "none", changes: [[9, "translateY(calc(var(--k) * -500))"]], ramp: scroll },
        { sel: ".wrap .confirm", prop: "transform", start: "translateX(101%)", changes: [[11, "none"]], ramp: m },
        ...arrive(".wrap .arrive", 0),
        // Phones: the back's ticket lands after the phone turns over.
        ...arrive(".wrap .back .arrive", 650).map((t) => ({ ...t, media: "(max-width: 1023.98px)" })),
        {
          sel: ".wrap .flipper",
          prop: "transform",
          start: "none",
          changes: [[12, "rotateY(180deg)"], [13, "none"]],
          ramp: { ms: 800, ease: "cubic-bezier(0.45, 0, 0.2, 1)" },
          media: "(max-width: 1023.98px)",
          // The turn back starts with the cover and ends with the loop, under the cover.
          clip: true,
        },
        // The white cover: up before the loop starts again, and lifting at the top of each loop
        // (not the first: the page opens on the menu, not on white).
        { sel: ".wrap .cover", prop: "opacity", start: "1", changes: [[{ at: 0 }, "0"], [13, "1"]], ramp: { ms: 500, ease: "ease" }, firstRun: "0" },
      ];
    })(),
  },
};
