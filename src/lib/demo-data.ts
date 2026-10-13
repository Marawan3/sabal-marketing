import { demoOrder, money, SERVICE_FEE_PERCENT, TAX_BP, TIP_PERCENT } from "./demo-order";

/**
 * Demo restaurant data for the built visuals (src/components/visuals) that
 * isn't already in demo-order.ts. Each figure says where it comes from.
 */

/**
 * The dashboard's Overview card for Palm&Stone Kitchen, "Last 30 days"
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
 * The delivery phone's order. Dishes and prices are the demo menu's (Lamb
 * Gyro with spice level Hot, Hummus & Warm Pita); the arithmetic is the
 * hero's: tax 6.5%, the diner's 5% service fee and a 20% tip on the
 * subtotal. The delivery fee is the delivery provider's quote in the real
 * checkout; the demo restaurant has delivery switched off, so $4.99 here is
 * an example, not a quote. The address is made up.
 */
const DELIVERY_SUBTOTAL = 1400 + 850;
const DELIVERY_FEE = 499;
const dTax = Math.round((DELIVERY_SUBTOTAL * TAX_BP) / 10000);
const dService = Math.round((DELIVERY_SUBTOTAL * SERVICE_FEE_PERCENT) / 100);
const dTip = Math.round((DELIVERY_SUBTOTAL * TIP_PERCENT) / 100);

export const demoDelivery = {
  number: 1931,
  address: "300 Lantern Bay Dr, Miami",
  time: "ASAP (20–30 min)",
  items: [
    { qty: 1, name: "Lamb Gyro", mods: ["Hot"], price: money(1400) },
    { qty: 1, name: "Hummus & Warm Pita", mods: [] as string[], price: money(850) },
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

/**
 * The demo restaurant's website (the storefront's clean theme), with its own
 * words from the demo's site content: the hero, and the dishes it features.
 */
export const demoSite = {
  eyebrow: "Mediterranean in Miami, FL",
  heading: "Mediterranean cooking, over fire, in Brickell",
  sub: "Small plates, stone-oven flatbreads, grain bowls, and a grill that runs late. Order ahead for pickup or delivery, or take a seat on the terrace.",
  intro: "Cooked over fire, a block from the bay",
  featured: [
    { name: "Chicken Shawarma Flatbread", price: "$14.50" },
    { name: "Chicken Souvlaki Bowl", price: "$15.50" },
    { name: "Mixed Grill for Two", price: "$48.00" },
    { name: "Lamb Gyro", price: "$14.00" },
  ],
  /** The demo site's address. demo.wuntab.com serves the demo storefront; its menu is /menu/brickell. */
  host: "demo.wuntab.com",
  menuPath: ["menu", "brickell"],
  /** The demo's own menu-page title and description (its SEO settings). */
  menuTitle: "Menu | Palm&Stone Kitchen, Brickell",
  menuDescription:
    "The full Palm&Stone Kitchen menu: mezze, flatbreads, bowls and salads, grill plates, sandwiches, sides, desserts, and drinks, priced for pickup and delivery.",
};

/** The demo site's catering page and its enquiry form, in the product's words. */
export const demoCatering = {
  heading: "Catering from the same kitchen",
  body: "Mezze platters, flatbreads cut for sharing, and grill trays for an office lunch or a party at home. Tell us the date and the headcount and we will send back a plan.",
  form: "Ask about catering",
  name: "Priya Medina",
  email: "priya@example.com",
  guests: "40",
  event: "Office lunch. Mezze and grill trays, two vegan guests.",
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
    { number: 1925, placed: "3:37 PM", who: "Mateo E.", items: "Pickup · 2 items", prep: "Prep by 3:57 PM", status: "Preparing", total: orderTotal(2100, 0) },
    { number: 1924, placed: "3:38 PM", who: "Grace L.", items: "Pickup · 1 item", prep: "Ready since 3:41 PM", status: "Ready", total: orderTotal(1500, 300) },
    { number: 1929, placed: "3:41 PM", who: "Leila P.", items: "Pickup · 1 item", prep: "Prep by 4:01 PM", status: "New", total: orderTotal(1150, 200) },
    { number: 1930, placed: "3:42 PM", who: "Priya M.", items: "Pickup · 1 item", prep: "Prep by 4:02 PM", status: "New", total: demoOrder.total },
  ],
  /** The drawer: #1925, the order being prepared. */
  open: {
    number: 1925,
    placed: "Placed 3:37 PM",
    who: "Mateo E.",
    items: [
      { qty: 1, name: "Crispy Falafel (5 pcs)", mods: "Extra pita", price: money(950) },
      { qty: 1, name: "Falafel Pita", mods: "", price: money(1150) },
    ],
    subtotal: money(2100),
    fee: money(Math.round((2100 * SERVICE_FEE_PERCENT) / 100)),
    tax: money(Math.round((2100 * TAX_BP) / 10000)),
    tip: money(0),
    total: orderTotal(2100, 0),
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
