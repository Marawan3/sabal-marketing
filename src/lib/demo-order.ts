import { ARRIVES_AT } from "./hero-demo-timeline";

/**
 * The demo restaurant the visuals show: Palm&Stone Pizza, Brickell. The menu,
 * its prices, its modifier groups and the logo are the owner's (approved
 * 2026-10-19), replacing the menu the visuals showed before.
 * The live demo restaurant is being updated to match; until it does, the
 * "See a live WunTab restaurant" link (demoStorefront in site.ts) stays off.
 * The location (48 Coral Lantern Way, Miami, FL; tax 6.5%; prep 20 minutes)
 * and the action colour (teal #0f766e, in the module CSS) are unchanged.
 * Labels are the storefront's and the kitchen display's own strings.
 *
 * Every dish photo is AI-generated for this fictional restaurant (ASSETS.md).
 * A dish without a photo (`photo: null`) stays out of every visual.
 *
 * The money is worked out below, not typed in, so every figure agrees: the
 * 16-inch Pepperoni Pizza with Hot-honey drizzle is $16.00 + $5.00 + $1.50 =
 * $22.50; tax 6.5% of it is $1.46; the tip defaults to 20% of the subtotal,
 * $4.50; the cart bar shows subtotal plus tax, $23.96, as the storefront
 * computes it.
 *
 * The service fee line is the owner's decision (2026-10-13, PR #22
 * follow-up): the diner's 5% service fee, on the subtotal, as /pricing and
 * /terms describe it (SERVICE_FEE_CLAUSE in legal.ts), $1.13. The live
 * checkout doesn't show it yet (LOG.md, platform finding 1). Total $29.59.
 */
export const TAX_BP = 650;
export const SERVICE_FEE_PERCENT = 5;
export const TIP_PERCENT = 20;
export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

/** A dish's photo in public/demo/photos: 360 for rows, cards and thumbnails, 900 for the dish sheet. */
export const photoOf = (stem: string, size: 360 | 900 = 360) => `/demo/photos/${stem}-${size}.webp`;

/** A dish: its menu price in cents (a pizza's is the 12-inch), and the stem of its photo files. */
type Dish = { name: string; cents: number; description: string; photo: string | null };

/** The owner's menu (2026-10-19), category by category, in menu order. */
export const demoMenu: { category: string; dishes: Dish[] }[] = [
  {
    category: "Pizzas",
    dishes: [
      {
        name: "Pepperoni Pizza",
        cents: 1600,
        description: "Cup-and-char pepperoni, whole-milk mozzarella and tomato sauce, with oregano.",
        photo: "pepperoni-pizza",
      },
      { name: "Margherita", cents: 1400, description: "San Marzano tomato, fresh mozzarella, basil and olive oil.", photo: "margherita" },
      // Its photo is still to come (LOG.md follow-up), so no visual shows it yet.
      { name: "Hot Honey Soppressata", cents: 1900, description: "Spicy soppressata and mozzarella, finished with chili honey.", photo: null },
      {
        name: "Buffalo Chicken",
        cents: 1800,
        description: "Buffalo chicken, mozzarella, a ranch drizzle and scallions.",
        photo: "buffalo-chicken-pizza",
      },
      { name: "White Pie", cents: 1700, description: "Ricotta, mozzarella, roasted garlic, lemon zest and basil.", photo: "white-pie" },
    ],
  },
  {
    category: "Starters & Sides",
    dishes: [
      {
        name: "Garlic Knots",
        cents: 700,
        description: "Six knots brushed with garlic butter, parmesan and parsley, with marinara.",
        photo: "garlic-knots",
      },
      {
        name: "Loaded Fries",
        cents: 1000,
        description: "Crisp fries under melted mozzarella, pepperoni, ranch and scallions.",
        photo: "loaded-fries",
      },
      { name: "Buffalo Wings", cents: 1600, description: "Ten wings in buffalo sauce, with celery and blue cheese.", photo: "buffalo-wings" },
    ],
  },
  {
    category: "Sandwiches & Salads",
    dishes: [
      {
        name: "Chicken Parm Sandwich",
        cents: 1500,
        description: "Crispy chicken cutlet, marinara and melted mozzarella on a toasted hero roll.",
        photo: "chicken-parm-sandwich",
      },
      {
        name: "Chopped Italian Salad",
        cents: 1300,
        description: "Romaine, salami, provolone, chickpeas, tomato and pepperoncini, with red wine vinaigrette.",
        photo: "chopped-italian-salad",
      },
    ],
  },
  {
    category: "Drinks & Dessert",
    dishes: [
      { name: "Fresh Lemonade", cents: 450, description: "Fresh-squeezed lemonade over ice.", photo: "fresh-lemonade" },
      {
        name: "Cannoli",
        cents: 800,
        description: "Two crisp shells filled with sweet ricotta, with chocolate chips and pistachio.",
        photo: "cannoli",
      },
    ],
  },
];

/** A menu dish as a row draws it: name, price, description, and its 360 photo (null: no photo yet). */
export type MenuRow = { name: string; cents: number; price: string; description: string; photo: string | null };
const asRow = (d: Dish): MenuRow => ({ ...d, price: money(d.cents), photo: d.photo ? photoOf(d.photo) : null });
const all = demoMenu.flatMap((c) => c.dishes);

/** A dish by its name. */
export function dish(name: string): MenuRow {
  const found = all.find((d) => d.name === name);
  if (!found) throw new Error(`No dish called ${name} on the demo menu`);
  return asRow(found);
}

/** The dishes a visual may show: the ones with a photo. */
export const withPhoto = (rows: MenuRow[]) => rows.filter((r) => r.photo);

/** The hero's dish and the diner's choices: 16-inch, then Hot-honey drizzle. */
const SIZE_16 = 500;
const HOT_HONEY = 150;
const BASE = dish("Pepperoni Pizza").cents;
const SUBTOTAL = BASE + SIZE_16 + HOT_HONEY;
const tax = Math.round((SUBTOTAL * TAX_BP) / 10000);
const fee = Math.round((SUBTOTAL * SERVICE_FEE_PERCENT) / 100);
const tip = Math.round((SUBTOTAL * TIP_PERCENT) / 100);

const plus = (cents: number) => `+${money(cents)}`;
const category = demoMenu[0];

export const demoOrder = {
  restaurant: "Palm&Stone Pizza",
  location: "Brickell",
  address: "48 Coral Lantern Way, Miami, FL",
  pickupTime: "ASAP (20–30 min)",
  /** The restaurant's mark (Logo A, a palmetto in a stone), beside its name on its own screens. */
  mark: "/demo/logo/palmstone-pizza-mark.svg",
  category: category.category,
  tabs: demoMenu.map((c) => c.category),
  /** The category's dishes, as the menu lists them, without the ones still waiting for a photo. */
  rows: withPhoto(category.dishes.map(asRow)),
  dish: {
    name: dish("Pepperoni Pizza").name,
    price: money(BASE),
    description: dish("Pepperoni Pizza").description,
    /** The dish sheet's photo, full width. */
    photo: photoOf("pepperoni-pizza", 900),
    groups: [
      {
        name: "Size",
        instruction: "Required",
        single: true,
        options: [{ name: "12-inch" }, { name: "16-inch", delta: plus(SIZE_16) }],
      },
      {
        name: "Extras",
        instruction: "Select up to 4",
        single: false,
        options: [
          { name: "Hot-honey drizzle", delta: plus(HOT_HONEY) },
          { name: "Extra cheese", delta: plus(200) },
          { name: "Add jalapeños", delta: plus(100) },
          { name: "Side of ranch", delta: plus(75) },
        ],
      },
    ] as { name: string; instruction: string; single: boolean; options: { name: string; delta?: string }[] }[],
  },
  /** What the diner taps, in order (story steps 4 and 5), and the Add item price after each. */
  picks: [
    { group: "Size", option: "16-inch", price: money(BASE + SIZE_16) },
    { group: "Extras", option: "Hot-honey drizzle", price: money(SUBTOTAL) },
  ],
  /** The line as the cart, checkout, confirmation and receipt show it. */
  mods: ["16-inch", "Hot-honey drizzle"],
  linePrice: money(SUBTOTAL),
  addLabel: "Add item",
  cartLabel: "View cart · 1 item",
  cartAmount: money(SUBTOTAL + tax),
  total: money(SUBTOTAL + fee + tax + tip),
  checkout: {
    items: "1 item",
    subtotal: money(SUBTOTAL),
    feeLabel: `Service fee (${SERVICE_FEE_PERCENT}%)`,
    fee: money(fee),
    tax: money(tax),
    tip: money(tip),
    tipOptions: ["None", "10%", "15%", "20%", "Other"],
    tipChosen: "20%",
    name: "Priya Medina",
    phone: "(305) 555-0147",
    smallPrint:
      "By placing this order you agree to receive order-status texts. Message and data rates may apply. Reply STOP to opt out.",
  },
  /** The order this story places, as the kitchen sees it. Its timer starts when it lands. */
  ticket: {
    number: 1930,
    who: "Priya",
    seconds: 0,
    items: [{ qty: 1, name: "Pepperoni Pizza", mods: ["16-inch", "Hot-honey drizzle"] }],
    action: "Start",
  },
  arrivesAt: ARRIVES_AT,
  /** The other tickets on the kitchen display, the orders dashboard's too (demo-data.ts). */
  kitchen: {
    new: [{ number: 1929, who: "Leila", seconds: 217, items: [{ qty: 1, name: "Margherita", mods: ["12-inch"] }], action: "Start" }],
    preparing: [
      {
        number: 1925,
        who: "Mateo",
        seconds: 463,
        items: [
          { qty: 1, name: "Buffalo Wings", mods: [] },
          { qty: 1, name: "Garlic Knots", mods: [] },
        ],
        action: "Ready",
      },
    ],
    ready: [
      { number: 1924, who: "Grace", seconds: 406, items: [{ qty: 2, name: "Chicken Parm Sandwich", mods: [] }], action: "Complete" },
    ],
  } as Record<"new" | "preparing" | "ready", { number: number; who: string; seconds: number; items: { qty: number; name: string; mods: string[] }[]; action: string }[]>,
};
