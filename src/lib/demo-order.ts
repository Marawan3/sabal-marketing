import { ARRIVES_AT } from "./hero-demo-timeline";

/**
 * The order the homepage hero plays out (src/components/hero-order-demo.tsx).
 * Every name, price and option is the demo restaurant's own, read on
 * 2026-10-13 from the database behind the demo storefront (the dev branch,
 * organization wuntab-demo): the menu, its modifier groups, the Brickell
 * location (48 Coral Lantern Way, Miami, FL; tax 6.5%; prep 20 minutes) and
 * the site's brand colour (in the module CSS). The other kitchen tickets are
 * the ones in the batch-1 kitchen display screenshot (removed 2026-10-13). Labels are the
 * storefront's and the kitchen display's own strings.
 *
 * The money is worked out below, not typed in, so every figure agrees:
 * tax 6.5% of the $12.00 subtotal is $0.78; the tip defaults to 20% of the
 * subtotal, $2.40; the cart bar shows subtotal plus tax, $12.78, as the
 * storefront computes it.
 *
 * The service fee line is the owner's decision (2026-10-13, PR #22
 * follow-up): the diner's 5% service fee, on the subtotal, as /pricing and
 * /terms describe it (SERVICE_FEE_CLAUSE in legal.ts). The live checkout
 * doesn't show it yet (LOG.md, platform finding 1). Total $15.78.
 */
const SUBTOTAL = 1200;
export const TAX_BP = 650;
export const SERVICE_FEE_PERCENT = 5;
export const TIP_PERCENT = 20;
export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const tax = Math.round((SUBTOTAL * TAX_BP) / 10000);
const fee = Math.round((SUBTOTAL * SERVICE_FEE_PERCENT) / 100);
const tip = Math.round((SUBTOTAL * TIP_PERCENT) / 100);

export const demoOrder = {
  restaurant: "Palm&Stone Kitchen",
  location: "Brickell",
  address: "48 Coral Lantern Way, Miami, FL",
  pickupTime: "ASAP (20–30 min)",
  category: "Small Plates & Mezze",
  tabs: ["Small Plates & Mezze", "Flatbreads", "Bowls & Salads"],
  rows: [
    {
      name: "Whipped Feta with Honey",
      price: "$9.00",
      description: "Creamy whipped feta drizzled with honey and cracked pepper, served with grilled bread.",
    },
    {
      name: "Stuffed Grape Leaves",
      price: "$7.50",
      description: "Rice and herb dolmas served chilled with a lemon yogurt dip.",
    },
    {
      name: "Spiced Lamb Meatballs",
      price: "$12.00",
      description: "Tender lamb meatballs simmered in tomato sauce, topped with mint yogurt.",
    },
    {
      name: "Hummus & Warm Pita",
      price: "$8.50",
      description: "Silky chickpea hummus finished with olive oil and paprika, served with warm pita.",
    },
    {
      name: "Crispy Falafel (5 pcs)",
      price: "$8.00",
      description: "Herb-packed chickpea falafel fried to order, with tahini sauce and pickled onion.",
    },
    {
      name: "Charred Halloumi",
      price: "$10.50",
      description: "Grilled halloumi with lemon, oregano, and a spoon of tomato jam.",
    },
  ],
  dish: {
    name: "Spiced Lamb Meatballs",
    price: money(SUBTOTAL),
    description: "Tender lamb meatballs simmered in tomato sauce, topped with mint yogurt.",
    /** Cropped from the menu editor screenshot (ASSETS.md) until the original file is in the repo. */
    photo: "/hero-demo/spiced-lamb-meatballs.webp",
    photoSize: 174,
    groups: [
      {
        name: "Spice level",
        instruction: "Optional",
        single: true,
        options: [{ name: "Mild" }, { name: "Medium" }, { name: "Hot" }],
      },
      {
        name: "Extras",
        instruction: "Select up to 4",
        single: false,
        options: [
          { name: "Add feta", delta: "+$1.50" },
          { name: "Add avocado", delta: "+$2.00" },
          { name: "Extra sauce", delta: "+$0.75" },
          { name: "Extra pita", delta: "+$1.50" },
        ],
      },
    ] as { name: string; instruction: string; single: boolean; options: { name: string; delta?: string }[] }[],
  },
  pickGroup: "Spice level",
  pick: "Hot",
  addLabel: "Add item",
  cartLabel: "View cart · 1 item",
  cartAmount: money(SUBTOTAL + tax),
  total: money(SUBTOTAL + fee + tax + tip),
  checkout: {
    items: "1 item",
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
    items: [{ qty: 1, name: "Spiced Lamb Meatballs", mods: ["Hot"] }],
    action: "Start",
  },
  arrivesAt: ARRIVES_AT,
  kitchen: {
    new: [{ number: 1929, who: "Leila", seconds: 217, items: [{ qty: 1, name: "Falafel Pita", mods: [] }], action: "Start" }],
    preparing: [
      {
        number: 1925,
        who: "Mateo",
        seconds: 463,
        items: [
          { qty: 1, name: "Crispy Falafel (5 pcs)", mods: ["Extra pita"] },
          { qty: 1, name: "Falafel Pita", mods: [] },
        ],
        action: "Ready",
      },
    ],
    ready: [
      { number: 1924, who: "Grace", seconds: 406, items: [{ qty: 2, name: "Stuffed Grape Leaves", mods: [] }], action: "Complete" },
    ],
  } as Record<"new" | "preparing" | "ready", { number: number; who: string; seconds: number; items: { qty: number; name: string; mods: string[] }[]; action: string }[]>,
};
