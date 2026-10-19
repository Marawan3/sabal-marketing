/**
 * The built visuals' stories, as tracks (2026-10-14). scripts/motion.mjs
 * turns them into CSS @keyframes in each visual's CSS module, between the
 * "motion:start" and "motion:end" markers, so the browser plays every story
 * on its own clock: no JavaScript tick, no gate.
 *
 * A visual: its step times in ms (the same as its component's STEPS; a test
 * checks they agree), whether it loops (the hero only), and a media query all
 * its tracks apply under, if any (the hero's two shapes).
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
 *   reduced  (transform tracks) what it becomes with reduced motion, below
 *   mode     "reduced": a track for reduced motion only; "motion": for motion only
 *
 * With reduced motion (owner, 2026-10-14: iPhones with the setting on saw
 * only stills) every story still runs, on the same timings, but nothing moves:
 * no transform is animated, and every change is a 150 ms opacity crossfade
 * that starts when the motion version's change starts.
 * Opacity tracks keep their changes. A transform track says what it becomes:
 *   reduced: { hold, show }
 *     hold   the transform it keeps, still (null: its own CSS value)
 *     show   { start, changes }: an opacity track in its place, so a screen
 *            that slid in now fades in where it lands
 *   reduced: { dip: true }
 *            a scroll: at each change the content fades out (75 ms), jumps
 *            to the new position while unseen (1 ms) and fades back (74 ms)
 * Taps pulse in opacity only. A track with mode "reduced" exists only there:
 * { sel, hold } for a still transform, or an opacity track.
 *
 * Play-once visuals' own CSS is their last step (the CSS is written end
 * backwards), so most tracks end on null. The hero's CSS is its first step,
 * so its tracks spell out every value.
 */

const move = { ms: 560, ease: "cubic-bezier(0.2, 0.8, 0.2, 1)" };
const fade = { ms: 320, ease: "ease" };
const scroll = { ms: 900, ease: "cubic-bezier(0.3, 0, 0.2, 1)" };
const press = { ms: 160, ease: "ease" };
/** A leg of the delivery driver's route: steady, so the three legs run as one drive. */
const leg = { ms: 600, ease: "linear" };

/** The hero menu page's head (.menuHead), in the phone's own pixels: the step-1 scroll's length. */
const MENU_HEAD = 234;
/** When the screens under the hero's confirmation go back to the loop's start (it covers the phone from 9420 ms). */
const RESET = 10000;
/** The hero's restart: the confirmation fades out over the menu. */
const restart = { ms: 300, ease: "ease" };

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** Fade a thing in at step k: opacity and a small shift, like the old :not([data-s~=k]) rules. */
const enter = (sel, k, shift, ramps = { opacity: fade, transform: move }) => [
  { sel, prop: "opacity", start: "0", changes: [[k, null]], ramp: ramps.opacity },
  { sel, prop: "transform", start: shift, changes: [[k, null]], ramp: ramps.transform, reduced: { hold: null } },
];

/** Reduced motion: hold `hold` and fade in at step k (a screen or panel that slid in). */
const fadeIn = (k, hold = null) => ({ hold, show: { start: "0", changes: [[k, null]] } });

/**
 * The hero's order story (hero-order-demo.tsx), in one of its two shapes. Steps
 * 0 to 12 are the same in both: 1 scroll the menu (its head goes up under the
 * bar), 2 tap the dish, 3 its sheet opens, 4 pick 16-inch, 5 pick Hot-honey
 * drizzle (the Add item price follows each), 6 tap Add item, 7 the sheet
 * closes and the cart bar shows, 8 tap the bar, 9 checkout, 10 scroll to Pay,
 * 11 tap Pay, 12 the confirmation. Desktop then has 13 the kitchen ticket and
 * 14 the restart; phones go straight to the restart (their step 13), 2.5 s
 * after the confirmation lands.
 *
 * The restart (owner, 2026-10-19: it used to fade to a blank white phone for
 * about a second) is a direct crossfade from the confirmation to the menu, as
 * the loop starts it. While the confirmation covers the screen (from RESET),
 * everything under it goes back to where the loop starts: the checkout slides
 * away, the cart bar and its count go, the menu scrolls back up. At the
 * restart the confirmation fades out over the menu (300 ms; 150 ms with
 * reduced motion), and the status bar and the island never leave. At the top
 * of the next loop the confirmation is back off screen, unseen.
 * src/lib/hero-demo-timeline.ts has the same numbers (a test checks).
 */
function heroStory({ desk }) {
  const shared = [0, 900, 1900, 2200, 3200, 3900, 4600, 4900, 5900, 6200, 7300, 8200, 8900];
  const steps = desk ? [...shared, 10100, 13800] : [...shared, 11900];
  const end = steps.length - 1; // the restart: the confirmation crossfades to the menu
  // Under the confirmation (it lands at 8900 + 520 ms), the screens beneath go back to the loop's start.
  const reset = { at: RESET };
  const m = { ms: 520, ease: "cubic-bezier(0.2, 0.8, 0.2, 1)" };
  const f = { ms: 280, ease: "ease" };
  const show = (sel, k) => ({ sel, prop: "opacity", start: "0", changes: [[k, "1"]], ramp: f });
  const hide = (sel, k) => ({ sel, prop: "opacity", start: "1", changes: [[k, "0"]], ramp: f });
  const pressAt = (sel, k) => ({ sel, prop: "transform", start: "none", changes: [[k, "scale(0.97)"], [k + 1, "none"]], ramp: press, reduced: { hold: "none" } });
  // Reduced motion: a screen that slides in fades in where it lands.
  const fadeAt = (changes) => ({ hold: "none", show: { start: "0", changes } });
  const tracks = [
    // The menu's head goes up under the bar, and the pizzas come up. Reduced motion: a dip.
    {
      sel: ".wrap .scroll",
      prop: "transform",
      start: "none",
      changes: [
        [1, `translateY(calc(var(--k) * -${MENU_HEAD}))`],
        [reset, "none"],
      ],
      ramp: scroll,
      reduced: { dip: true },
    },
    ...[2, 4, 5, 6, 8, 11].map((k) => ({ sel: `.wrap [data-tap="${k}"]`, tap: k })),
    { sel: ".wrap .backdrop", prop: "opacity", start: "0", changes: [[3, "1"], [7, "0"]], ramp: f },
    { sel: ".wrap .sheet", prop: "transform", start: "translateY(102%)", changes: [[3, "none"], [7, "translateY(102%)"]], ramp: m, reduced: fadeAt([[3, "1"], [7, "0"]]) },
    // 4: 16-inch, 5: Hot-honey drizzle. Each lights its mark and its name, and the Add item price follows.
    show(".wrap .radio i", 4),
    show(".wrap .check i", 5),
    ...[4, 5].flatMap((k) => [show(`.wrap [data-pick="${k}"] > :last-child`, k), hide(`.wrap [data-pick="${k}"] > :first-child`, k)]),
    hide(".wrap [data-add-price] > :nth-child(1)", 4),
    { sel: ".wrap [data-add-price] > :nth-child(2)", prop: "opacity", start: "0", changes: [[4, "1"], [5, "0"]], ramp: f },
    show(".wrap [data-add-price] > :nth-child(3)", 5),
    { sel: ".wrap .inCart", prop: "opacity", start: "0", changes: [[7, "1"], [reset, "0"]], ramp: f },
    show(".wrap [data-paying] > :last-child", 11),
    hide(".wrap [data-paying] > :first-child", 11),
    pressAt(".wrap .sheet .action", 6),
    pressAt(".wrap .cartBar .action", 8),
    pressAt(".wrap .payBar .action", 11),
    {
      sel: ".wrap .cartBar",
      prop: "transform",
      start: "translateY(110%)",
      changes: [[7, "none"], [reset, "translateY(110%)"]],
      ramp: m,
      reduced: fadeAt([[7, "1"], [reset, "0"]]),
    },
    {
      sel: ".wrap .checkout",
      prop: "transform",
      start: "translateX(101%)",
      changes: [[9, "none"], [reset, "translateX(101%)"]],
      ramp: m,
      reduced: fadeAt([[9, "1"], [reset, "0"]]),
    },
    // Reduced motion: a dip down to Pay, which the diner taps.
    {
      sel: ".wrap .checkout .page",
      prop: "transform",
      start: "none",
      changes: [[10, "translateY(calc(var(--k) * -500))"]],
      ramp: scroll,
      reduced: { dip: true },
    },
    // The confirmation slides in, and at the restart fades out over the menu. Reduced motion: it fades in and out.
    { sel: ".wrap .confirm", prop: "transform", start: "translateX(101%)", changes: [[12, "none"]], ramp: m, reduced: fadeAt([[12, "1"], [end, "0"]]) },
    { sel: ".wrap .confirm", prop: "opacity", start: "1", changes: [[end, "0"]], ramp: restart, mode: "motion" },
  ];
  if (desk) {
    tracks.push(
      // The kitchen display: the count and the ticket on step 13; at the restart the ticket leaves and the counts go back.
      ...[".wrap .kCount", ".wrap .kActive"].flatMap((sel) => [
        { sel: `${sel} > :last-child`, prop: "opacity", start: "0", changes: [[13, "1"], [end, "0"]], ramp: f },
        { sel: `${sel} > :first-child`, prop: "opacity", start: "1", changes: [[13, "0"], [end, "1"]], ramp: f },
      ]),
      { sel: ".wrap .arrive", prop: "opacity", start: "0", changes: [[13, "1"], [end, "0"]], ramp: f },
      { sel: ".wrap .arrive", prop: "transform", start: "translateX(calc(var(--k) * -60))", changes: [[13, "none"]], ramp: m, reduced: { hold: "none" } },
    );
  }
  return {
    file: "hero",
    media: desk ? "(min-width: 1024px)" : "(max-width: 1023.98px)",
    loop: steps[end] + 600,
    steps,
    tracks,
  };
}

export const visuals = {
  /* ---------------- src/components/visuals/visuals.module.css ---------------- */
  kitchen: {
    file: "visuals",
    steps: [0, 1400, 1800, 2500, 3200],
    tracks: [
      { sel: ".out", prop: "opacity", start: "1", changes: [[2, null]], ramp: fade },
      // Reduced motion: it fades out where it stood.
      { sel: ".out", prop: "transform", start: "none", changes: [[2, null]], ramp: move, reduced: { hold: "none" } },
      { sel: ".out > :last-child", prop: "transform", start: "none", changes: [[1, "scale(0.97)"], [2, null]], ramp: press, reduced: { hold: null } },
      ...enter(".in", 2, "translateX(-40%)"),
      // Reduced motion: the next ticket fades in at the top once the first has gone.
      { sel: ".up", prop: "transform", start: "none", changes: [[3, null]], ramp: move, reduced: fadeIn(3) },
      { sel: ".count > :first-child", prop: "opacity", start: "1", changes: [[2, null]], ramp: fade },
      { sel: ".count > :last-child", prop: "opacity", start: "0", changes: [[2, null]], ramp: fade },
    ],
  },
  dashboard: {
    file: "visuals",
    steps: [0, 300, 1500, 2200],
    tracks: [
      {
        sel: ".reveal",
        prop: "transform",
        start: "none",
        changes: [[1, null]],
        ramp: { ms: 1400, ease: "cubic-bezier(0.4, 0, 0.2, 1)" },
        // Reduced motion: the white sheet over the line fades away instead.
        reduced: { hold: "none", show: { start: "1", changes: [[1, "0"]] } },
      },
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
        // Reduced motion: the nodes light one by one; the whole line fades in at the end.
        reduced: fadeIn(6),
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
        reduced: fadeIn(4),
      },
      {
        sel: '.gflow[data-n="5"] .gfill',
        prop: "transform",
        start: "scaleX(0)",
        changes: [[2, "scaleX(0.25)"], [3, "scaleX(0.5)"], [4, "scaleX(0.75)"], [5, null]],
        ramp: move,
        reduced: fadeIn(5),
      },
    ],
  },
  storefront: {
    file: "visuals",
    steps: [0, 1100, 2600, 2900, 3900],
    tracks: [
      // Reduced motion: each scroll is a dip (out, jump while unseen, back in).
      { sel: ".storefront .scrollA", prop: "transform", start: "none", changes: [[1, null]], ramp: scroll, reduced: { dip: true } },
      { sel: '.storefront [data-tap="2"]', tap: 2 },
      { sel: ".storefront .slideB", prop: "transform", start: "translateX(101%)", changes: [[3, null]], ramp: move, reduced: fadeIn(3) },
    ],
  },
  delivery: {
    file: "visuals",
    steps: [0, 1500, 3000, 3600, 4800, 5100, 6400, 7700, 10000],
    tracks: [
      { sel: ".delivery .scrollA", prop: "transform", start: "none", changes: [[1, null]], ramp: scroll, reduced: { dip: true } },
      { sel: '.delivery [data-tap="2"]', tap: 2 },
      { sel: '.delivery [data-tap="4"]', tap: 4 },
      { sel: ".delivery .slideB", prop: "transform", start: "translateX(101%)", changes: [[3, null]], ramp: move, reduced: fadeIn(3) },
      { sel: ".delivery .slideC", prop: "transform", start: "translateX(101%)", changes: [[5, null]], ramp: move, reduced: fadeIn(5) },
      { sel: ".delivery .swap2 > :first-child", prop: "opacity", start: "1", changes: [[2, null]], ramp: fade },
      { sel: ".delivery .swap2 > :last-child", prop: "opacity", start: "0", changes: [[2, null]], ramp: fade },
      { sel: ".delivery .scrollB", prop: "transform", start: "none", changes: [[6, null]], ramp: scroll, reduced: { dip: true } },
      { sel: '.delivery [data-reach="6"]', prop: "opacity", start: "0", changes: [[6, null]], ramp: fade },
      { sel: '.delivery [data-reach="7"]', prop: "opacity", start: "0", changes: [[7, null]], ramp: fade },
      { sel: '.delivery .current[data-cur="7"]', prop: "opacity", start: "0", changes: [[7, null]], ramp: fade },
      { sel: '.delivery .current[data-cur="5-6"]', prop: "opacity", start: "0", changes: [[5, "1"], [6, null]], ramp: fade },
      { sel: '.delivery .current[data-cur="6-7"]', prop: "opacity", start: "0", changes: [[6, "1"], [7, null]], ramp: fade },
      { sel: '.delivery .current[data-cur="5-7"]', prop: "opacity", start: "0", changes: [[5, "1"], [7, null]], ramp: fade },
      // On the way (2026-10-19): the driver's dot appears at the restaurant and crosses the map in three
      // equal legs (delivery-phone.tsx), stopping short of the address. Reduced motion: no travelling
      // dot (its CSS hides it); a still dot fades in at the end of each leg as the moving one would set off.
      { sel: ".delivery .driver", prop: "opacity", start: "0", changes: [[7, null]], ramp: fade, mode: "motion" },
      {
        sel: ".delivery .mapLeg",
        prop: "transform",
        start: "none",
        changes: [
          [7, "translate(25%, 0)"],
          [{ at: 8300 }, "translate(25%, -57.1429%)"],
          [{ at: 8900 }, null],
        ],
        ramp: leg,
        mode: "motion",
      },
      { sel: '.delivery [data-driver-at="1"]', prop: "opacity", start: "0", changes: [[7, "1"], [{ at: 8300 }, "0"]], ramp: fade, mode: "reduced" },
      { sel: '.delivery [data-driver-at="2"]', prop: "opacity", start: "0", changes: [[{ at: 8300 }, "1"], [{ at: 8900 }, "0"]], ramp: fade, mode: "reduced" },
      { sel: '.delivery [data-driver-at="3"]', prop: "opacity", start: "0", changes: [[{ at: 8900 }, null]], ramp: fade, mode: "reduced" },
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
        // Reduced motion: a dip down to the form and a dip back up to the thanks.
        reduced: { dip: true },
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
      { sel: ".odDrawer", prop: "transform", start: "translateX(101%)", changes: [[2, null]], ramp: move, reduced: fadeIn(2) },
    ],
  },
  settings: {
    file: "visuals",
    steps: [0, 800, 1200, 2000],
    tracks: [
      { sel: ".flip > :first-child", prop: "opacity", start: "1", changes: [[2, null]], ramp: fade },
      { sel: ".flip > :first-child", prop: "transform", start: "none", changes: [[2, null]], ramp: move, reduced: { hold: "none" } },
      { sel: ".flip > :last-child", prop: "opacity", start: "0", changes: [[2, null]], ramp: fade },
      { sel: ".flip > :last-child", prop: "transform", start: "translateY(40%)", changes: [[2, null]], ramp: move, reduced: { hold: null } },
      { sel: ".setAdjust", prop: "transform", start: "none", changes: [[1, "scale(0.98)"], [2, null]], ramp: press, reduced: { hold: null } },
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
  // Desktop: the phone and the kitchen display beside it, where the ticket lands.
  hero: heroStory({ desk: true }),
  // Phones: the phone alone. It never turns over to the kitchen display (2026-10-19): it holds
  // on the confirmation for about 2.5 s and starts again. Every step before is the desktop's.
  heroNarrow: heroStory({ desk: false }),
};
