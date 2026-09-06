/**
 * The WunTab product catalog. DRAFT copy, not approved for production.
 *
 * Every product page is generated from this file. Capabilities are the
 * approved lists from Marawan's 2026-09-05 site spec, written in plain
 * words. Do not add a capability that is not in that spec.
 *
 * Cut and never to be reintroduced: Website Grader, Developer API,
 * Webhooks, WunTab POS, Inventory, Labor scheduling, Restaurant CRM.
 */

export type Pillar = "sell" | "grow" | "operate" | "scale";

export type Shot = {
  /** File key: public/shots/<key>.webp (or .png). */
  key: string;
  /** Caption shown under the frame, and the label of the empty slot. */
  label: string;
  kind?: "desktop" | "phone";
};

export type Flow = {
  title: string;
  steps: string[];
};

export type Product = {
  slug: string;
  name: string;
  /** One line under the name in the mega-menu. */
  blurb: string;
  pillar: Pillar;
  /** Appears in the Product mega-menu. */
  inMenu: boolean;
  headline: string;
  sub: string;
  capabilitiesTitle?: string;
  capabilities: string[];
  flow?: Flow;
  shots: Shot[];
  /** Slugs of products this one connects to. */
  related: string[];
  /** Plain-language notes rendered under the capabilities. */
  notes?: string[];
  comingSoon?: string[];
};

export const pillars: Record<
  Pillar,
  { name: string; verb: string; blurb: string }
> = {
  sell: {
    name: "Sell",
    verb: "Sell directly",
    blurb: "Give customers more ways to order from you.",
  },
  grow: {
    name: "Grow",
    verb: "Get found and come back",
    blurb: "Turn searches into orders and customers into regulars.",
  },
  operate: {
    name: "Operate",
    verb: "Run the restaurant",
    blurb: "Everything after Place Order.",
  },
  scale: {
    name: "Scale",
    verb: "Grow to more locations",
    blurb: "One restaurant or fifty.",
  },
};

export const products: Product[] = [
  // ───────────────────────────── SELL ─────────────────────────────
  {
    slug: "online-ordering",
    name: "Online Ordering",
    blurb: "Take direct pickup and delivery orders.",
    pillar: "sell",
    inMenu: true,
    headline: "Take orders on your own website, under your own name.",
    sub: "Pickup, delivery, and scheduled orders through a branded ordering experience that looks like your restaurant, not a marketplace.",
    capabilities: [
      "Pickup and delivery ordering",
      "Scheduled orders for later today or another day",
      "Your full menu with photos, modifiers, and add-ons",
      "Promo codes",
      "Tips at checkout",
      "Smart upsells that suggest the extra naan or the drink",
      "Customer accounts with favorites and one-tap reorder",
      "Order tracking and automatic order updates for the customer",
    ],
    shots: [
      { key: "ordering-menu", label: "Ordering menu on a phone", kind: "phone" },
      { key: "ordering-checkout", label: "Checkout on a phone", kind: "phone" },
      { key: "ordering-tracking", label: "Order tracking", kind: "phone" },
    ],
    related: ["online-menu", "delivery", "upsells", "loyalty", "order-management"],
    notes: [
      "Your restaurant is the brand from the first tap to the thank-you screen. WunTab stays in the background.",
    ],
  },
  {
    slug: "online-menu",
    name: "Online Menu",
    blurb: "A menu people can order from.",
    pillar: "sell",
    inMenu: false,
    headline: "A menu people can read, and order from.",
    sub: "Categories, items, photos, prices, and modifiers, connected straight to ordering.",
    capabilities: [
      "Menu categories and items",
      "Photos for every dish",
      "Modifiers and add-ons",
      "Prices and availability, always current",
      "Tap any item to order it",
    ],
    shots: [{ key: "online-menu", label: "Online menu", kind: "phone" }],
    related: ["online-ordering", "menu-management", "restaurant-seo"],
  },
  {
    slug: "delivery",
    name: "Delivery",
    blurb: "Offer delivery with third-party drivers.",
    pillar: "sell",
    inMenu: true,
    headline: "Delivery without building a delivery fleet.",
    sub: "Your customers order from you. WunTab handles the driver.",
    capabilities: [
      "Delivery ordering on your own website",
      "Third-party drivers requested automatically when an order is ready",
      "Delivery tracking for the customer",
      "Delivery zones you control",
      "Delivery fees you set",
    ],
    flow: {
      title: "How a delivery order moves",
      steps: [
        "Customer orders on your website",
        "WunTab receives the order",
        "Your kitchen prepares it",
        "WunTab requests a third-party driver",
        "Driver picks up the order",
        "Customer receives it",
      ],
    },
    shots: [
      { key: "delivery-order", label: "Delivery order in the dashboard" },
      { key: "delivery-tracking", label: "Customer delivery tracking", kind: "phone" },
    ],
    related: ["online-ordering", "catering", "order-management", "integrations"],
    notes: [
      "You keep the customer. The driver just drives.",
    ],
  },
  {
    slug: "catering",
    name: "Catering",
    blurb: "Take large orders ahead of time.",
    pillar: "sell",
    inMenu: true,
    headline: "Turn big orders into easy orders.",
    sub: "Group and event orders placed online, ahead of time, with the details you need up front. No more phone tag.",
    capabilities: [
      "A separate catering menu",
      "Advance ordering with scheduling",
      "Lead times you set, so nobody orders 40 trays for noon at 11",
      "Minimum order amounts",
      "Catering delivery with a third-party driver where it makes sense",
    ],
    shots: [
      { key: "catering-menu", label: "Catering menu", kind: "phone" },
      { key: "catering-order", label: "Catering order in the dashboard" },
    ],
    related: ["online-ordering", "delivery", "order-management"],
  },
  {
    slug: "table-ordering",
    name: "Table Ordering",
    blurb: "Order and pay from the table.",
    pillar: "sell",
    inMenu: true,
    headline: "Order and pay from the table.",
    sub: "A QR code on the table opens your menu. Guests order and pay from their phone.",
    capabilities: ["QR-code ordering for dine-in", "Pay at the table"],
    shots: [{ key: "table-ordering", label: "Table ordering on a phone", kind: "phone" }],
    related: ["online-menu", "kiosk", "guest-feedback"],
  },
  {
    slug: "kiosk",
    name: "Self-Service Kiosk",
    blurb: "Self-service ordering you control.",
    pillar: "sell",
    inMenu: true,
    headline: "In-store ordering you control.",
    sub: "A self-service kiosk running your menu, your branding, and your prices.",
    capabilities: [
      "Self-service ordering at the counter",
      "Your menu and branding on the screen",
      "Orders flow into the same order management as everything else",
    ],
    shots: [{ key: "kiosk", label: "Kiosk ordering screen" }],
    related: ["table-ordering", "menu-management", "order-management"],
  },
  {
    slug: "restaurant-app",
    name: "Branded Mobile App",
    blurb: "Your own iOS and Android app.",
    pillar: "sell",
    inMenu: true,
    headline: "Your own app on their phone.",
    sub: "An iOS and Android ordering app with your name and your icon, so regulars are one tap from ordering again.",
    capabilities: [
      "Restaurant-branded iOS and Android app",
      "Ordering, favorites, and reorder",
      "Push notifications for offers and order updates",
    ],
    shots: [{ key: "mobile-app", label: "Branded mobile app", kind: "phone" }],
    related: ["online-ordering", "loyalty", "restaurant-marketing"],
  },
  {
    slug: "gift-cards",
    name: "Gift Cards",
    blurb: "Digital gift cards sold online.",
    pillar: "sell",
    inMenu: false,
    headline: "Digital gift cards, sold from your website.",
    sub: "Customers buy a gift card online and the recipient spends it on your food.",
    capabilities: ["Digital gift cards", "Bought online, spent on online orders"],
    shots: [{ key: "gift-cards", label: "Gift card purchase", kind: "phone" }],
    related: ["online-ordering", "loyalty"],
  },
  {
    slug: "upsells",
    name: "Smart Upsells",
    blurb: "Suggest add-ons while they order.",
    pillar: "sell",
    inMenu: false,
    headline: "The right add-on at the right moment.",
    sub: "Suggest a drink, a side, or a dessert while the customer is already ordering.",
    capabilities: [
      "Suggested add-ons during ordering",
      "Suggestions based on what is in the cart",
    ],
    shots: [{ key: "upsells", label: "Upsell prompt at checkout", kind: "phone" }],
    related: ["online-ordering", "menu-management", "analytics"],
  },

  // ───────────────────────────── GROW ─────────────────────────────
  {
    slug: "restaurant-websites",
    name: "Restaurant Websites",
    blurb: "Your digital storefront.",
    pillar: "grow",
    inMenu: true,
    headline: "Your digital storefront.",
    sub: "A website with your branding, your own web address, your menu built in, and ordering on every page.",
    capabilities: [
      "Your branding, colors, and photos",
      "Your own domain name",
      "Menu built into the site, always current",
      "Direct online ordering on every page",
      "Built so search engines can read every dish and price",
    ],
    shots: [
      { key: "website-home", label: "A WunTab restaurant website" },
      { key: "website-menu", label: "Website menu page", kind: "phone" },
    ],
    related: ["restaurant-seo", "online-ordering", "online-menu", "listings"],
  },
  {
    slug: "restaurant-seo",
    name: "Restaurant SEO",
    blurb: "Built so search engines read your menu.",
    pillar: "grow",
    inMenu: true,
    headline: "Built so Google can read your menu.",
    sub: "Every dish, price, and description is in the page itself, with the structured details search engines look for.",
    capabilitiesTitle: "What we build in",
    capabilities: [
      "Menu and restaurant pages search engines can read on the first visit",
      "Structured details about your restaurant, hours, and dishes",
      "Local search basics done right",
      "Pages for your cuisine, dishes, and location where they are legitimate",
      "Your menu, discoverable item by item",
      "Business listings that match your website",
    ],
    shots: [{ key: "seo-dish-page", label: "A dish page search engines can read", kind: "phone" }],
    related: ["menu-check", "restaurant-websites", "listings", "online-menu"],
    notes: [
      "Google can run JavaScript, but it does that in a second pass that can come later and does not always finish. When your menu is in the page itself, Google reads it on the first visit, every time. That is what we build.",
      "We promise what we control: that search engines can read everything. We do not promise rankings, traffic, or a spot on the first page. Nobody honest can.",
    ],
  },
  {
    slug: "listings",
    name: "Restaurant Listings",
    blurb: "Consistent name, hours, and address everywhere.",
    pillar: "grow",
    inMenu: false,
    headline: "The same name, hours, and address everywhere.",
    sub: "Keep your business listings consistent so customers and search engines find the right information.",
    capabilities: [
      "Consistent name, address, phone, and hours across listings",
      "Listing visibility for each location",
    ],
    shots: [{ key: "listings", label: "Listings overview" }],
    related: ["restaurant-seo", "reviews", "multi-location"],
  },
  {
    slug: "guest-feedback",
    name: "Guest Feedback",
    blurb: "Capture feedback and resolve issues faster.",
    pillar: "grow",
    inMenu: true,
    headline: "Know what your guests think.",
    sub: "A QR code or a tap on the table lets guests tell you how it went, while they are still in the restaurant.",
    capabilities: [
      "QR and NFC feedback at the table, the counter, or the receipt",
      "Text-message follow-up where it fits",
      "Feedback that comes to you first",
      "Manager alerts when something goes wrong",
      "Follow up with the guest",
      "Short customer surveys",
      "A satisfaction dashboard and feedback trends",
      "Feedback across all your locations in one view",
    ],
    flow: {
      title: "The feedback loop",
      steps: [
        "Guest scans a QR code or taps an NFC tag",
        "Guest leaves feedback",
        "You see it right away",
        "A manager can act on it",
        "The next visit is better",
      ],
    },
    shots: [
      { key: "feedback-guest", label: "Guest feedback form", kind: "phone" },
      { key: "feedback-dashboard", label: "Satisfaction dashboard" },
    ],
    related: ["reviews", "loyalty", "analytics", "multi-location"],
  },
  {
    slug: "reviews",
    name: "Reviews",
    blurb: "Ask for reviews and watch what comes in.",
    pillar: "grow",
    inMenu: true,
    headline: "More reviews, watched in one place.",
    sub: "Ask every customer for a Google review and keep an eye on what comes in.",
    capabilities: [
      "Google review requests sent to customers",
      "Review monitoring across your locations",
    ],
    shots: [{ key: "reviews", label: "Review monitoring" }],
    related: ["guest-feedback", "listings", "restaurant-marketing"],
    notes: [
      "We ask every customer, not just the happy ones. Review requests follow Google's rules.",
    ],
  },
  {
    slug: "loyalty",
    name: "Loyalty & Rewards",
    blurb: "Give regulars a reason to come back.",
    pillar: "grow",
    inMenu: true,
    headline: "Give regulars a reason to come back.",
    sub: "Rewards that live in the customer's account, right next to their favorites and their reorder button.",
    capabilities: [
      "Rewards for repeat orders",
      "Tied to customer accounts, favorites, and order history",
      "Works with your email and text campaigns",
    ],
    shots: [{ key: "loyalty", label: "Rewards in a customer account", kind: "phone" }],
    related: ["customers", "restaurant-marketing", "online-ordering", "restaurant-app"],
  },
  {
    slug: "customers",
    name: "Customer Database",
    blurb: "Know who your direct customers are.",
    pillar: "grow",
    inMenu: false,
    headline: "Know who your direct customers are.",
    sub: "Every direct order builds a list of real customers, with what they ordered and how often they come back.",
    capabilities: [
      "Every direct customer in one list",
      "Order history and favorites per customer",
      "New and returning customers at a glance",
      "Segments you can send campaigns to",
    ],
    shots: [{ key: "customers", label: "Customer list" }],
    related: ["restaurant-marketing", "loyalty", "analytics"],
    notes: ["These are your customers, not a marketplace's."],
  },
  {
    slug: "restaurant-marketing",
    name: "Customer Marketing",
    blurb: "Email, text, and automatic campaigns.",
    pillar: "grow",
    inMenu: true,
    headline: "Turn customers into regulars.",
    sub: "Email, text, and automatic campaigns that bring people back without you sitting at a computer.",
    capabilities: [
      "Email campaigns",
      "Text message campaigns",
      "Automatic campaigns that run on their own",
      "Customer segments",
      "Win-back campaigns for customers who have gone quiet",
      "Reorder reminders",
      "Birthday offers",
      "Follow-ups for abandoned orders",
    ],
    shots: [{ key: "marketing-campaign", label: "Campaign builder" }],
    related: ["email-marketing", "sms-marketing", "customers", "loyalty", "restaurant-app"],
  },
  {
    slug: "email-marketing",
    name: "Email Marketing",
    blurb: "Email the customers who order from you.",
    pillar: "grow",
    inMenu: false,
    headline: "Email your customers without a separate tool.",
    sub: "Send offers and news to the customers who already order from you.",
    capabilities: [
      "Email campaigns to your customer list",
      "Automatic emails for win-back, reorder, and birthdays",
      "Segments based on order history",
    ],
    shots: [{ key: "email-campaign", label: "Email campaign" }],
    related: ["restaurant-marketing", "sms-marketing", "customers"],
  },
  {
    slug: "sms-marketing",
    name: "SMS Marketing",
    blurb: "Short texts to opted-in customers.",
    pillar: "grow",
    inMenu: false,
    headline: "A text they actually read.",
    sub: "Short text-message offers to customers who opted in.",
    capabilities: [
      "Text message campaigns",
      "Automatic texts for reorder and win-back",
      "Opt-in handled properly",
    ],
    shots: [{ key: "sms-campaign", label: "Text campaign", kind: "phone" }],
    related: ["restaurant-marketing", "email-marketing", "customers"],
  },

  // ───────────────────────────── OPERATE ─────────────────────────────
  {
    slug: "menu-management",
    name: "Menu Management",
    blurb: "Change the menu once, everywhere.",
    pillar: "operate",
    inMenu: true,
    headline: "Change the menu once. It changes everywhere.",
    sub: "Manage categories, items, prices, photos, and availability in one place. Every ordering surface updates.",
    capabilities: [
      "Categories and items",
      "Prices",
      "Photos",
      "Modifiers and add-ons",
      "Availability by day and time",
      "Sold-out controls",
    ],
    shots: [{ key: "menu-management", label: "Menu editor" }],
    related: ["online-menu", "online-ordering", "kiosk", "analytics"],
    notes: [
      "One menu powers your website, online ordering, kiosk, table ordering, and app.",
    ],
  },
  {
    slug: "order-management",
    name: "Order Management",
    blurb: "Every order from new to done.",
    pillar: "operate",
    inMenu: true,
    headline: "Every order, from new to done.",
    sub: "See incoming, in-progress, ready, and completed orders. Pause ordering, set prep times, and print tickets.",
    capabilities: [
      "Incoming, in-progress, ready, and completed orders",
      "Restaurant hours",
      "Pause online ordering with one tap",
      "Prep-time controls",
      "Order printing",
    ],
    shots: [{ key: "order-management", label: "Order management dashboard" }],
    related: ["kitchen-display", "delivery", "menu-management", "payments"],
  },
  {
    slug: "kitchen-display",
    name: "Kitchen Display",
    blurb: "Orders on a kitchen screen.",
    pillar: "operate",
    inMenu: true,
    headline: "Orders on a screen, in the order they came in.",
    sub: "A kitchen display that moves each order through preparation, with printing when you want paper.",
    capabilities: [
      "Incoming orders on a kitchen screen",
      "Move orders through preparation",
      "Order printing",
    ],
    shots: [{ key: "kitchen-display", label: "Kitchen display" }],
    related: ["order-management", "online-ordering"],
  },
  {
    slug: "payments",
    name: "Payments",
    blurb: "Fast checkout, payouts to your bank.",
    pillar: "operate",
    inMenu: true,
    headline: "A fast checkout for them. Money to your bank for you.",
    sub: "Customers pay in a few taps. Payouts go to the restaurant's account.",
    capabilities: [
      "Card checkout in a few taps",
      "Tips at checkout",
      "Payment integrations",
    ],
    shots: [
      { key: "payments-checkout", label: "Customer checkout", kind: "phone" },
      { key: "payments-dashboard", label: "Payments in the dashboard" },
    ],
    related: ["online-ordering", "integrations", "analytics"],
    notes: [
      "Payments are processed by our payment partner. WunTab connects the checkout to your account.",
    ],
  },
  {
    slug: "analytics",
    name: "Analytics",
    blurb: "Sales, orders, menu, and customer reports.",
    pillar: "operate",
    inMenu: true,
    headline: "Know what's working.",
    sub: "Sales, orders, menu, customers, and feedback in one place.",
    capabilities: [
      "Sales reports",
      "Order volume, average ticket, and ordering trends",
      "Popular items and sales mix",
      "New and repeat customer behavior",
      "Feedback trends and guest sentiment",
    ],
    shots: [{ key: "analytics", label: "Analytics dashboard" }],
    related: ["order-management", "customers", "guest-feedback", "menu-management"],
  },
  {
    slug: "reservations",
    name: "Reservations",
    blurb: "Direct bookings and a waitlist.",
    pillar: "operate",
    inMenu: true,
    headline: "Book a table without a middleman.",
    sub: "Direct reservations from your website and a digital waitlist for walk-ins.",
    capabilities: ["Direct reservations", "Digital waitlist"],
    shots: [{ key: "reservations", label: "Reservations", kind: "phone" }],
    related: ["restaurant-websites", "table-ordering", "guest-feedback"],
  },
  {
    slug: "ai",
    name: "WunTab AI",
    blurb: "An assistant that knows your orders.",
    pillar: "scale",
    inMenu: true,
    headline: "An assistant that knows your menu and your orders.",
    sub: "Ask questions about your restaurant in plain words, and get menu suggestions based on what actually sells.",
    capabilities: [
      "An assistant for restaurant operators",
      "Menu suggestions based on your order data",
      "Recommendations drawn from your menu and orders, where the data supports them",
    ],
    shots: [{ key: "ai-assistant", label: "WunTab assistant" }],
    related: ["analytics", "menu-management", "upsells"],
    notes: ["A tool inside WunTab, not the point of WunTab."],
  },

  // ───────────────────────────── SCALE ─────────────────────────────
  {
    slug: "multi-location",
    name: "Multi-Location",
    blurb: "Every location on one account.",
    pillar: "scale",
    inMenu: true,
    headline: "One restaurant or fifty.",
    sub: "Run every location from one account, with menus, orders, and feedback per location.",
    capabilities: [
      "Manage several locations from one account",
      "Menus, hours, and orders per location",
      "Feedback and analytics across locations",
    ],
    shots: [{ key: "multi-location", label: "Locations overview" }],
    related: ["enterprise", "analytics", "guest-feedback", "listings"],
  },
  {
    slug: "enterprise",
    name: "Restaurant Groups & Franchises",
    blurb: "Group controls, location freedom.",
    pillar: "scale",
    inMenu: true,
    headline: "Controls for the group. Freedom for the location.",
    sub: "Set what the organization decides and what each location decides.",
    capabilities: [
      "Organization-level and franchise-level controls",
      "Location managers see their own restaurant",
      "Group reporting across every location",
    ],
    shots: [{ key: "enterprise", label: "Organization view" }],
    related: ["multi-location", "analytics", "partners"],
  },
  {
    slug: "integrations",
    name: "Integrations",
    blurb: "Payments and delivery, POS coming soon.",
    pillar: "scale",
    inMenu: true,
    headline: "Works with what you already use.",
    sub: "Payments and delivery are connected today. POS integrations are next.",
    capabilitiesTitle: "Available now",
    capabilities: ["Payment integrations", "Delivery driver integration"],
    comingSoon: ["POS integrations"],
    shots: [{ key: "integrations", label: "Integrations" }],
    related: ["payments", "delivery", "order-management"],
  },
  {
    slug: "partners",
    name: "Partners",
    blurb: "Offer WunTab under your own brand.",
    pillar: "scale",
    inMenu: false,
    headline: "Offer WunTab under your own brand.",
    sub: "White-label WunTab for the restaurants you already serve.",
    capabilities: ["White-label platform", "Your brand on the product"],
    shots: [],
    related: ["enterprise", "multi-location"],
  },
];

export const bySlug = Object.fromEntries(products.map((p) => [p.slug, p])) as Record<
  string,
  Product
>;

export function byPillar(pillar: Pillar, menuOnly = false) {
  return products.filter((p) => p.pillar === pillar && (!menuOnly || p.inMenu));
}

/** Mega-menu groups, in the spec's order. */
export const megaMenu: { pillar: Pillar; slugs: string[] }[] = [
  {
    pillar: "sell",
    slugs: ["online-ordering", "delivery", "catering", "table-ordering", "kiosk", "restaurant-app"],
  },
  {
    pillar: "grow",
    slugs: [
      "restaurant-websites",
      "restaurant-seo",
      "guest-feedback",
      "reviews",
      "loyalty",
      "restaurant-marketing",
    ],
  },
  {
    pillar: "operate",
    slugs: [
      "menu-management",
      "order-management",
      "kitchen-display",
      "payments",
      "analytics",
      "reservations",
    ],
  },
  {
    pillar: "scale",
    slugs: ["multi-location", "enterprise", "integrations", "ai"],
  },
];

/** Solutions menu groups (nav spec, 2026-09-05). */
export const solutionsMenu: { title: string; slugs: string[] }[] = [
  {
    title: "By business",
    slugs: ["independent-restaurants", "multi-location-restaurants", "restaurant-groups-franchises"],
  },
  {
    title: "By restaurant type",
    slugs: ["quick-service", "full-service", "catering"],
  },
];

// ───────────────────────────── SOLUTIONS ─────────────────────────────

export type Solution = {
  slug: string;
  name: string;
  blurb: string;
  headline: string;
  sub: string;
  points: string[];
  products: string[];
};

export const solutions: Solution[] = [
  {
    slug: "independent-restaurants",
    name: "Independent Restaurants",
    blurb: "One restaurant, everything direct.",
    headline: "Everything a single restaurant needs to sell direct.",
    sub: "Website, ordering, delivery, and marketing in one place, set up for you.",
    points: [
      "We build your website and load your menu",
      "Orders come to you, not to a marketplace",
      "Delivery without hiring drivers",
      "Regulars get rewards and reminders",
    ],
    products: ["online-ordering", "restaurant-websites", "delivery", "loyalty", "order-management"],
  },
  {
    slug: "multi-location-restaurants",
    name: "Multi-Location Restaurants",
    blurb: "Shared menus, per-location control.",
    headline: "Every location on one platform.",
    sub: "Shared menus, per-location control, and reporting across all of them.",
    points: [
      "Manage menus and hours per location",
      "See orders, feedback, and sales for each one",
      "Listings that stay consistent",
    ],
    products: ["multi-location", "menu-management", "analytics", "guest-feedback", "listings"],
  },
  {
    slug: "restaurant-groups-franchises",
    name: "Restaurant Groups & Franchises",
    blurb: "Organization-level controls.",
    headline: "Group controls, location freedom.",
    sub: "Decide what the organization sets and what each franchisee runs.",
    points: [
      "Organization-level controls",
      "Location managers see their own restaurant",
      "Group-wide reporting",
    ],
    products: ["enterprise", "multi-location", "analytics", "restaurant-marketing"],
  },
  {
    slug: "quick-service",
    name: "Quick-Service Restaurants",
    blurb: "Kiosk, app, and faster lines.",
    headline: "Fast orders, fewer lines.",
    sub: "Kiosk, app, and online ordering that move people through faster.",
    points: [
      "Self-service kiosk at the counter",
      "A branded app for regulars",
      "Orders straight to the kitchen screen",
    ],
    products: ["kiosk", "restaurant-app", "online-ordering", "kitchen-display", "upsells"],
  },
  {
    slug: "full-service",
    name: "Full-Service Restaurants",
    blurb: "Reservations, table ordering, feedback.",
    headline: "Reservations, table ordering, and feedback while they're seated.",
    sub: "Direct bookings, QR ordering at the table, and a way for guests to tell you how it went.",
    points: [
      "Direct reservations and a waitlist",
      "Order and pay at the table",
      "Feedback before they leave",
    ],
    products: ["reservations", "table-ordering", "guest-feedback", "reviews", "online-ordering"],
  },
  {
    slug: "catering",
    name: "Catering Businesses",
    blurb: "Big orders without the phone tag.",
    headline: "Big orders without the phone tag.",
    sub: "A catering menu, lead times, minimums, and delivery, all online.",
    points: [
      "Catering menu with advance scheduling",
      "Lead times and minimums you set",
      "Delivery with a third-party driver",
    ],
    products: ["catering", "delivery", "order-management", "payments"],
  },
];

export const solutionBySlug = Object.fromEntries(
  solutions.map((s) => [s.slug, s]),
) as Record<string, Solution>;

/** The complete product story, used on the homepage and /how-it-works. */
export const lifecycle: { name: string; body: string; products: string[] }[] = [
  {
    name: "Discover",
    body: "A customer finds you through your website, search, listings, or a campaign.",
    products: ["restaurant-websites", "restaurant-seo", "listings", "restaurant-marketing"],
  },
  {
    name: "Order",
    body: "They order online, for delivery, for catering, at the table, at a kiosk, or in your app.",
    products: ["online-ordering", "delivery", "catering", "table-ordering", "kiosk", "restaurant-app"],
  },
  {
    name: "Fulfill",
    body: "You manage the menu, take the payment, work the order through the kitchen, and hand it to a driver.",
    products: ["menu-management", "payments", "order-management", "kitchen-display", "delivery"],
  },
  {
    name: "Understand",
    body: "You see sales, customers, menu performance, and feedback in one place.",
    products: ["analytics", "guest-feedback"],
  },
  {
    name: "Build the relationship",
    body: "You capture feedback, reviews, customer details, and loyalty.",
    products: ["guest-feedback", "reviews", "customers", "loyalty"],
  },
  {
    name: "Bring them back",
    body: "Rewards, email, texts, automatic campaigns, and push notifications turn one order into the next.",
    products: ["loyalty", "restaurant-marketing", "restaurant-app"],
  },
];
