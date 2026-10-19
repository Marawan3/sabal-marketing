/**
 * When each step of the hero's order story starts, in ms from the top of the
 * loop (hero-order-demo.module.css says what each step shows):
 * 1 scroll the menu, 2 tap the dish, 3 its sheet opens, 4 pick Hot,
 * 5 tap Add item, 6 the sheet closes and the cart bar shows, 7 tap the bar,
 * 8 checkout, 9 scroll to Pay, 10 tap Pay, 11 the confirmation,
 * 12 the kitchen ticket, 13 fade out before the loop starts again.
 * scripts/motion-spec.mjs has the same numbers (a test checks).
 */
export const STEPS = [0, 900, 1900, 2200, 3400, 4300, 4600, 5600, 5900, 7000, 7900, 8600, 9800, 13800];
export const LOOP = 14400;
export const ARRIVES_AT = STEPS[12];

/**
 * Below 1024px (phones): the same steps up to the confirmation, which holds
 * about 2.5 s (it lands 520 ms after 8600), then 12 fade out and start again.
 * No kitchen display on phones (2026-10-19).
 */
export const NARROW_STEPS = [...STEPS.slice(0, 12), 11600];
export const NARROW_LOOP = 12200;
