import { ARRIVES_AT } from "./hero-demo-timeline";

/**
 * The order the homepage hero plays out (src/components/hero-order-demo.tsx).
 * Every name, price and option is the demo restaurant's own, read on
 * 2026-10-13 from the database behind the demo storefront (the dev branch,
 * organization wuntab-demo): the menu, its modifier groups, the Brickell
 * location (48 Coral Lantern Way, Miami, FL; tax 6.5%; prep 20 minutes) and
 * the site's brand colour (in the module CSS). The other kitchen tickets are
 * the ones in the kds screenshot (public/shots/kds.png). Labels are the
 * storefront's and the kitchen display's own strings.
 *
 * Arithmetic, done the product's way: tax 6.5% of $12.00 is $0.78; the tip
 * defaults to 20% of the subtotal, $2.40; total $15.18. The cart bar shows
 * subtotal plus tax, $12.78. No service fee: the checkout has none today.
 */
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
    price: "$12.00",
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
  cartAmount: "$12.78",
  total: "$15.18",
  checkout: {
    items: "1 item",
    tax: "$0.78",
    tip: "$2.40",
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
