/**
 * When each step of the hero's order story starts, in ms from the top of the
 * loop (hero-order-demo.module.css says what each step shows):
 * 1 scroll the menu, 2 tap the dish, 3 its sheet opens, 4 pick Hot,
 * 5 tap Add item, 6 the sheet closes and the cart bar shows, 7 tap the bar,
 * 8 checkout, 9 scroll to Pay, 10 tap Pay, 11 the confirmation,
 * 12 the kitchen ticket, 13 fade out before the loop starts again.
 */
export const STEPS = [0, 900, 1900, 2200, 3400, 4300, 4600, 5600, 5900, 7000, 7900, 8600, 9800, 13800];
export const LOOP = 14400;
export const ARRIVES_AT = STEPS[12];
