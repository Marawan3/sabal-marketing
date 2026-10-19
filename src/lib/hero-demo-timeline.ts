/**
 * When each step of the hero's order story starts, in ms from the top of the
 * loop (hero-order-demo.module.css says what each step shows):
 * 1 scroll the menu, 2 tap the dish, 3 its sheet opens, 4 pick 16-inch,
 * 5 pick Hot-honey drizzle, 6 tap Add item, 7 the sheet closes and the cart
 * bar shows, 8 tap the bar, 9 checkout, 10 scroll to Pay, 11 tap Pay,
 * 12 the confirmation, 13 the kitchen ticket, 14 the restart: the confirmation
 * crossfades to the menu before the loop starts again (no blank screen,
 * 2026-10-19). The second pick (2026-10-19) came out of the ticket's hold, so
 * the loop is as long as before. scripts/motion-spec.mjs has the same numbers
 * (a test checks).
 */
export const STEPS = [0, 900, 1900, 2200, 3200, 3900, 4600, 4900, 5900, 6200, 7300, 8200, 8900, 10100, 13800];
export const LOOP = 14400;
export const ARRIVES_AT = STEPS[13];

/**
 * Below 1024px (phones): the same steps up to the confirmation, which holds
 * about 2.5 s (it lands 520 ms after 8900), then 13 the restart.
 * No kitchen display on phones (2026-10-19).
 */
export const NARROW_STEPS = [...STEPS.slice(0, 13), 11900];
export const NARROW_LOOP = 12500;
