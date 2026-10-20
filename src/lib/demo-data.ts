import { demoOrder, dish, money, photoOf, SERVICE_FEE_PERCENT, TAX_BP, TIP_PERCENT } from "./demo-order";

/**
 * Demo restaurant data for the built visuals (src/components/visuals) that
 * isn't already in demo-order.ts. Each figure says where it comes from. The
 * dishes, prices and the restaurant's words are the owner's Palm&Stone Pizza
 * (2026-10-19, see demo-order.ts). The live demo restaurant, demo.wuntab.com,
 * is live (owner, 2026-10-19) and "See a live restaurant" links to it.
 */

/**
 * The dashboard's Overview card for the demo restaurant, "Last 30 days"
 * (Sep 9 to Oct 8, 2026), as seeded on the demo and shown in the dashboard
 * screenshot from batch 1 (public/shots/dash-overview.png, removed with the
 * screenshot pipeline on 2026-10-13). Labels are the dashboard's own.
 */
export const demoDashboard = {
  restaurant: demoOrder.restaurant,
  location: demoOrder.location,
  period: "Last 30 days",
  netSales: "$13,421.76",
  /** The dashboard's own sentence under the figure. */
  change: "Up 7.2% from $12,518.17 in the previous period",
  from: "Sep 9",
  to: "Oct 8",
  orders: "471",
  ordersChange: "+9.5%",
  averageOrder: "$28.50",
  /**
   * The "This period" sales line, one point a day: the line's height in the
   * screenshot's chart, read off its pixels (higher is more sales). It keeps
   * the real shape; the chart has no axis, so no value is implied.
   */
  line: [470, 434, 442, 416, 505, 523, 498, 517, 519, 477, 404, 475, 479, 524, 493, 459, 448, 449, 418, 479, 506, 499, 446, 446, 476, 472, 514, 506, 506, 549].map(
    (y) => 600 - y,
  ),
  /** Every figure above, for the "Demo restaurant" caption test and the no-quoting rule. */
  figures: ["$13,421.76", "$12,518.17", "7.2%", "471", "9.5%", "$28.50"],
} as const;

/** The kitchen board: the tickets from the kitchen display screenshot (#1924–#1929) and the hero's #1930. */
export const demoKitchen = {
  /** #1929 is started: it moves from New to Preparing. */
  moving: demoOrder.kitchen.new[0],
  new: [demoOrder.ticket],
  preparing: demoOrder.kitchen.preparing,
  ready: demoOrder.kitchen.ready,
};

/**
 * The delivery phone's order, #1931. Dishes and prices are the demo menu's (a
 * 16-inch Margherita, $14.00 + $5.00, and Garlic Knots); the arithmetic is the
 * hero's: tax 6.5%, the diner's 5% service fee and a 20% tip on the
 * subtotal. The delivery fee is the delivery provider's quote in the real
 * checkout; the demo restaurant has delivery switched off, so $4.99 here is
 * an example, not a quote. The address is made up.
 */
const MARGHERITA_16 = dish("Margherita").cents + 500;
const KNOTS = dish("Garlic Knots").cents;
const DELIVERY_SUBTOTAL = MARGHERITA_16 + KNOTS;
const DELIVERY_FEE = 499;
const dTax = Math.round((DELIVERY_SUBTOTAL * TAX_BP) / 10000);
const dService = Math.round((DELIVERY_SUBTOTAL * SERVICE_FEE_PERCENT) / 100);
const dTip = Math.round((DELIVERY_SUBTOTAL * TIP_PERCENT) / 100);

export const demoDelivery = {
  number: 1931,
  address: "300 Lantern Bay Dr, Miami",
  time: "ASAP (20–30 min)",
  items: [
    { qty: 1, name: "Margherita", mods: ["16-inch"], price: money(MARGHERITA_16) },
    { qty: 1, name: "Garlic Knots", mods: [] as string[], price: money(KNOTS) },
  ],
  count: "2 items",
  subtotal: money(DELIVERY_SUBTOTAL),
  serviceFee: money(dService),
  /** "Taxes and fees" is tax plus the delivery fee, as the checkout shows it. */
  taxesAndFees: money(dTax + DELIVERY_FEE),
  deliveryFee: money(DELIVERY_FEE),
  tip: money(dTip),
  total: money(DELIVERY_SUBTOTAL + dService + dTax + DELIVERY_FEE + dTip),
  /** The tracking page's stages, in the product's words. "Picked up" is never the current one. */
  kitchenStages: ["New", "Confirmed", "Preparing", "Ready", "Completed"],
  deliveryStages: ["Confirming delivery", "Restaurant preparing", "Driver assigned", "Picked up", "On the way", "Delivered"],
};

/** The dishes the website features (owner, 2026-10-19), each a card with its photo. */
const featured = ["Hot Honey Soppressata", "White Pie", "Buffalo Wings", "Chicken Parm Sandwich"].map(dish);

/**
 * The demo restaurant's website (the storefront's clean theme), in the
 * owner's words (2026-10-19): the hero with its photo, and the dishes it
 * features.
 */
export const demoSite = {
  eyebrow: "Pizza in Miami, FL",
  heading: "Stone-oven pizza in Brickell",
  sub: "Pies from a stone oven, wings, sandwiches and salads. Order ahead for pickup or delivery, or take a seat on the terrace.",
  intro: "Fired in stone, a block from the bay",
  /** The hero image above the heading (900×600, cropped to fit). */
  photo: photoOf("hero-oven", 900),
  featured,
  /** The demo site's address. demo.wuntab.com serves the demo storefront; its menu is /menu/brickell. */
  host: "demo.wuntab.com",
  menuPath: ["menu", "brickell"],
  /** The demo's own menu-page title and description (its SEO settings). */
  menuTitle: "Menu | Palm&Stone Pizza, Brickell",
  menuDescription:
    "The full Palm&Stone Pizza menu: pizzas, starters and sides, sandwiches and salads, drinks and dessert, priced for pickup and delivery.",
};

/** The demo site's catering page and its enquiry form, in the product's words. */
export const demoCatering = {
  heading: "Catering from the same kitchen",
  body: "Party pies, trays of wings and garlic knots, and a big salad for an office lunch or a party at home. Tell us the date and the headcount and we will send back a plan.",
  /** The photo at the top of the page (900×600). */
  photo: photoOf("catering-spread", 900),
  form: "Ask about catering",
  name: "Priya Medina",
  email: "priya@example.com",
  guests: "40",
  event: "Office lunch. Pizzas, wings and a big salad, two vegetarian guests.",
  hint: "Include any allergies or dietary preferences we should plan around — please don't share medical details.",
  promise: "Your message goes to the restaurant. They reply when they can.",
};

/**
 * The orders dashboard (the Orders screen and its order drawer, after batch
 * 1's orders-board and order-drawer captures), with the kitchen board's
 * orders so the two agree. Names, items, placed times and prep times are the
 * captures'. Totals use the hero's arithmetic: subtotal, the diner's 5%
 * service fee, tax 6.5% and the order's tip. The real dashboard has no
 * service fee yet, so its totals there are lower by the fee.
 */
const orderTotal = (subtotal: number, tip: number) =>
  money(subtotal + Math.round((subtotal * SERVICE_FEE_PERCENT) / 100) + Math.round((subtotal * TAX_BP) / 10000) + tip);
/** Each order's subtotal from the menu: #1925 Buffalo Wings and Garlic Knots, #1924 two Chicken Parm Sandwiches, #1929 a 12-inch Margherita. */
const WINGS = dish("Buffalo Wings").cents;
const MATEO = WINGS + dish("Garlic Knots").cents;
const GRACE = 2 * dish("Chicken Parm Sandwich").cents;
const LEILA = dish("Margherita").cents;

export const demoOrders = {
  location: demoOrder.location,
  tabs: [
    { label: "Active", count: 4 },
    { label: "Scheduled", count: 0 },
    { label: "Completed", count: 912 },
    { label: "Cancelled", count: 19 },
    { label: "Awaiting payment", count: 0 },
  ],
  narrow: [
    { label: "In progress", count: 1 },
    { label: "Ready", count: 1 },
  ],
  rows: [
    { number: 1925, placed: "3:37 PM", who: "Mateo E.", items: "Pickup · 2 items", prep: "Prep by 3:57 PM", status: "Preparing", total: orderTotal(MATEO, 0) },
    { number: 1924, placed: "3:38 PM", who: "Grace L.", items: "Pickup · 2 items", prep: "Ready since 3:41 PM", status: "Ready", total: orderTotal(GRACE, 300) },
    { number: 1929, placed: "3:41 PM", who: "Leila P.", items: "Pickup · 1 item", prep: "Prep by 4:01 PM", status: "New", total: orderTotal(LEILA, 200) },
    { number: 1930, placed: "3:42 PM", who: "Priya M.", items: "Pickup · 1 item", prep: "Prep by 4:02 PM", status: "New", total: demoOrder.total },
  ],
  /** The drawer: #1925, the order being prepared. */
  open: {
    number: 1925,
    placed: "Placed 3:37 PM",
    who: "Mateo E.",
    items: [
      { qty: 1, name: "Buffalo Wings", mods: "", price: money(WINGS) },
      { qty: 1, name: "Garlic Knots", mods: "", price: money(MATEO - WINGS) },
    ],
    subtotal: money(MATEO),
    fee: money(Math.round((MATEO * SERVICE_FEE_PERCENT) / 100)),
    tax: money(Math.round((MATEO * TAX_BP) / 10000)),
    tip: money(0),
    total: orderTotal(MATEO, 0),
  },
};

/** The Online ordering settings card (batch 1's ordering-settings capture). Prep time goes from 20 to 25 minutes. */
export const demoSettings = {
  title: "Online ordering",
  sub: `Availability and preparation times for ${demoOrder.location}.`,
  prep: ["20 min", "25 min"],
  /** The ASAP quote is prep time to prep time plus ten, as the product computes it. */
  quote: ["20–30 min", "25–35 min"],
  closes: "11:00 PM",
};

/**
 * The menu editor's item drawer for Pepperoni Pizza (the layout and labels of
 * batch 1's menu-editor and menu-editor-options captures), with the owner's
 * menu values: category, the 12-inch price, and its two modifier groups. Prep
 * is the restaurant's 20 minutes. "Available" is the selected availability.
 */
export const demoEditor = {
  title: demoOrder.dish.name,
  sub: "Edit item details",
  category: demoOrder.category,
  photo: demoOrder.dish.photo,
  price: String(dish(demoOrder.dish.name).cents / 100),
  prep: "20",
  availability: ["Available", "Sold Out", "Hidden"],
  groups: demoOrder.dish.groups.map((g) => ({
    name: g.name,
    meta: `${g.instruction === "Required" ? "Required" : "Optional"} · ${g.options.length} options`,
  })),
  save: "Save changes",
};

/**
 * The loyalty reward card (owner, 2026-10-13): what a returning customer sees
 * on the order confirmation. Loyalty is a build commitment (REGISTER.md); the
 * reward is an example of one a restaurant could set, on a dish from the
 * demo menu. No points, no tiers.
 */
export const demoReward = {
  label: "Your reward",
  title: "Thanks for coming back.",
  body: "Your next cannoli is on us.",
  photo: dish("Cannoli").photo!,
};

/**
 * "Goes well with" on the dish sheet (the clean theme shows at most two):
 * the restaurant's picks for Pepperoni Pizza (owner, 2026-10-19).
 */
export const demoPairings = ["Garlic Knots", "Loaded Fries"].map(dish);

/**
 * The customer's confirmation text, in the product's words
 * (packages/domain/ordering/confirmation-sms.ts:67, 77 at the product repo at a5418d4).
 * There is no "ready" text in the product; this is the one it sends.
 */
export const demoSms = {
  from: demoOrder.restaurant,
  confirmed: `Your order #${demoOrder.ticket.number} at ${demoOrder.restaurant} is confirmed.`,
  /** Then "Pickup in about 20 minutes (around {time})", the visitor's own time plus 20, as the hero does. */
  pickup: "Pickup in about 20 minutes",
};
