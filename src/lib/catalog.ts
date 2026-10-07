/**
 * The WunTab product catalog. DRAFT copy for owner review.
 *
 * Every product page is generated from this file. Capabilities are the
 * lists in docs/marketing-site/SPEC.md section 4, written in plain words.
 * Per the spec as amended 2026-10-02, every product is marketed as
 * available: no Coming Soon labels. What the platform does not do yet is
 * the build list in docs/marketing-site/REGISTER.md, and each PR lists it.
 *
 * Copy rules (SPEC section 2): never name a delivery provider or a POS
 * system; never describe WunTab as the payment processor; no invented
 * proof; no ranking or indexing guarantees.
 *
 * Cut and never to be reintroduced: Website Grader, Developer API,
 * Webhooks, WunTab POS, Inventory, Labor scheduling, Restaurant CRM.
 */

export type Pillar = "sell" | "grow" | "operate" | "scale";

export type Shot = {
  /** File key: public/shots/<key>.webp (or .png). Keys are shared across pages on purpose. */
  key: string;
  /** Caption shown under the frame, and the label of the empty slot. */
  label: string;
  kind?: "desktop" | "phone" | "tablet" | "photo";
  /** must: the site is incomplete without it. helpful: nice once it exists. */
  priority: "must" | "helpful";
};

export type Flow = {
  title: string;
  steps: string[];
};

export type Faq = { question: string; answer: string };

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
  /** A restrained diagram used where no real screen exists yet (never fake UI). */
  visual?: "org";
  /** Questions owners ask about this product. Rendered visibly and as FAQPage JSON-LD. */
  faq?: Faq[];
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
      { key: "site-menu", label: "Ordering menu on a phone", kind: "phone", priority: "must" },
      { key: "item-sheet", label: "An item with modifiers and add-ons", kind: "phone", priority: "must" },
      { key: "checkout-pickup", label: "Checkout with tip and promo code", kind: "phone", priority: "must" },
      { key: "checkout-schedule", label: "Choosing a later pickup time", kind: "phone", priority: "must" },
      { key: "order-tracking", label: "Order tracking after checkout", kind: "phone", priority: "must" },
    ],
    related: ["online-menu", "delivery", "upsells", "loyalty", "order-management"],
    notes: [
      "Your restaurant is the brand from the first tap to the thank-you screen. WunTab stays in the background.",
    ],
    flow: {
      title: "How an online order works",
      steps: [
        "Customer opens your menu on your website",
        "Picks dishes, add-ons, and a time",
        "Pays at checkout, with a tip if they like",
        "The order reaches your kitchen",
        "Customer gets updates until it's ready",
      ],
    },
    faq: [
      {
        question: "Can customers order for later?",
        answer: "Yes. Customers can order for as soon as possible, or pick a time later today or on another day.",
      },
      {
        question: "Where do the orders go?",
        answer:
          "Into your POS. If your POS isn't compatible, orders go to a kitchen printer. Every order also shows in your WunTab dashboard.",
      },
      {
        question: "What does the customer pay?",
        answer:
          "Your menu prices, tax, any tip, and a 5% service fee shown at checkout before they pay. You pay nothing.",
      },
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
    shots: [{ key: "site-menu", label: "Online menu on a phone", kind: "phone", priority: "must" }],
    related: ["online-ordering", "menu-management", "restaurant-seo"],
  },
  {
    slug: "delivery",
    name: "Delivery",
    blurb: "Offer delivery without your own drivers.",
    pillar: "sell",
    inMenu: true,
    headline: "Delivery without building a delivery fleet.",
    sub: "Your customers order from you. WunTab handles the driver.",
    capabilities: [
      "Delivery ordering on your own website",
      "Third-party delivery, requested automatically for every delivery order",
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
      { key: "checkout-delivery", label: "Delivery checkout with fee and arrival time", kind: "phone", priority: "must" },
      { key: "delivery-tracking", label: "Customer delivery tracking", kind: "phone", priority: "must" },
    ],
    related: ["online-ordering", "catering", "order-management", "integrations"],
    notes: [
      "You keep the customer. The driver just drives.",
    ],
    faq: [
      {
        question: "Do I need my own drivers?",
        answer: "No. WunTab requests third-party delivery for each delivery order.",
      },
      {
        question: "Whose customer is it?",
        answer: "Yours. They order on your website, under your name, and they stay on your customer list.",
      },
      {
        question: "Can customers follow their delivery?",
        answer: "Yes. Customers get a tracking link and can follow the order to their door.",
      },
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
      { key: "catering-page", label: "Catering page with the enquiry form", priority: "must" },
      { key: "catering-order", label: "Catering order with lead time and minimum", kind: "phone", priority: "must" },
    ],
    related: ["online-ordering", "delivery", "order-management"],
    flow: {
      title: "How a catering order works",
      steps: [
        "Customer opens your catering menu",
        "Picks a date and time past your lead time",
        "Orders above your minimum and pays",
        "The order lands in your dashboard ahead of time",
        "You prepare it, and it is picked up or delivered",
      ],
    },
    faq: [
      {
        question: "Can I stop last-minute catering orders?",
        answer: "Yes. Set a lead time, and customers can only pick times after it.",
      },
      {
        question: "Can I set a minimum?",
        answer: "Yes. Set a minimum order amount for catering.",
      },
      {
        question: "Can catering orders be delivered?",
        answer: "Yes, with third-party delivery where it makes sense for the order.",
      },
    ],
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
    shots: [],
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
    shots: [],
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
    shots: [{ key: "mobile-app", label: "Branded mobile app", kind: "phone", priority: "helpful" }],
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
    shots: [],
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
    shots: [{ key: "checkout-pickup", label: "Upsell at checkout", kind: "phone", priority: "must" }],
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
      { key: "site-home", label: "A restaurant website on its own domain", priority: "must" },
      { key: "site-menu", label: "The menu built into the site", kind: "phone", priority: "must" },
    ],
    related: ["restaurant-seo", "online-ordering", "online-menu", "listings"],
    flow: {
      title: "How we build your website",
      steps: [
        "We collect your menu, photos, and branding",
        "We build the site and load your menu",
        "You look it over and say yes",
        "We publish it on your own domain",
        "Menu changes show up on the site",
      ],
    },
    faq: [
      {
        question: "Do I have to build it myself?",
        answer: "No. We build the site, load your menu, and publish it. You review it before it goes live.",
      },
      {
        question: "Can it use my own web address?",
        answer: "Yes. Your website runs on your own domain.",
      },
      {
        question: "What do I own?",
        answer:
          "Your menu, photos, words and customer list are yours. The website we build and the platform behind it are ours, and you use them while you're with us.",
      },
    ],
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
    shots: [
      { key: "tag-page", label: "A cuisine page search engines can read", priority: "must" },
      { key: "site-menu", label: "Every dish and price in the page", kind: "phone", priority: "must" },
    ],
    related: ["menu-check", "restaurant-websites", "listings", "online-menu"],
    flow: {
      title: "What we build in",
      steps: [
        "Your menu is written into the page itself",
        "Each dish, price, and your hours are labelled for search engines",
        "Pages for your cuisine, dishes, and location where they are legitimate",
        "A sitemap tells search engines what is there",
      ],
    },
    faq: [
      {
        question: "Will I rank first on Google?",
        answer:
          "Nobody can promise that. We build what we control: pages that search engines can read and understand. We don't promise rankings, indexing, or traffic.",
      },
      {
        question: "Can Google read a menu that loads with JavaScript?",
        answer:
          "Google can run JavaScript, often in a later pass. On WunTab your menu is already in the page, so it doesn't depend on that pass to be understood.",
      },
    ],
    notes: [
      "Google can run JavaScript, and it often does that in a later pass. On WunTab your menu is already in the page, with labels that say what each dish and price is, so it does not depend on that later pass to be understood.",
      "We build what we control. We do not promise rankings, indexing, traffic, or a spot on the first page. Nobody honest can.",
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
    shots: [],
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
      { key: "feedback-guest", label: "Guest feedback on a phone", kind: "phone", priority: "must" },
      { key: "feedback-dashboard", label: "Manager alert and satisfaction dashboard", priority: "must" },
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
    shots: [],
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
    shots: [],
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
    shots: [{ key: "customers", label: "Customer list", priority: "helpful" }],
    related: ["restaurant-marketing", "loyalty", "analytics"],
    notes: ["These are your customers, not a marketplace's."],
  },
  {
    slug: "restaurant-marketing",
    name: "Customer Marketing",
    blurb: "Text and automatic campaigns.",
    pillar: "grow",
    inMenu: true,
    headline: "Turn customers into regulars.",
    sub: "Text and automatic campaigns that bring people back without you sitting at a computer.",
    capabilities: [
      "Text message campaigns",
      "Automatic campaigns that run on their own",
      "Customer segments",
      "Win-back campaigns for customers who have gone quiet",
      "Reorder reminders",
      "Birthday offers",
      "Follow-ups for abandoned orders",
    ],
    shots: [{ key: "marketing-campaign", label: "Campaign builder", priority: "helpful" }],
    related: ["sms-marketing", "customers", "loyalty", "restaurant-app"],
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
    shots: [],
    related: ["restaurant-marketing", "customers"],
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
    shots: [{ key: "menu-editor", label: "Menu editor", priority: "must" }],
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
    sub: "See incoming, in-progress, ready, and completed orders. Pause ordering, set prep times, and get every order to the kitchen.",
    capabilities: [
      "Incoming, in-progress, ready, and completed orders",
      "Restaurant hours",
      "Pause online ordering with one tap",
      "Prep-time controls",
      "Orders go into your POS. If your POS isn't compatible, they go to a kitchen printer",
      "A kitchen display for the line",
    ],
    shots: [
      { key: "orders-board", label: "Incoming, preparing, and ready orders", priority: "must" },
      { key: "order-drawer", label: "One order in detail", priority: "must" },
      { key: "ordering-settings", label: "Hours, pause ordering, and prep time", priority: "must" },
      { key: "kds", label: "Kitchen display on a tablet", kind: "tablet", priority: "must" },
      { key: "kitchen-ticket", label: "A printed kitchen ticket", kind: "photo", priority: "must" },
    ],
    related: ["kitchen-display", "delivery", "menu-management", "payments"],
    flow: {
      title: "How an order moves through your kitchen",
      steps: [
        "A new order arrives in your dashboard",
        "It goes to your POS or kitchen printer",
        "Your team marks it preparing",
        "Then ready",
        "Then completed",
      ],
    },
    faq: [
      {
        question: "Does it work with my POS?",
        answer: "WunTab connects to your POS. If your POS isn't compatible, orders go to a kitchen printer.",
      },
      {
        question: "Can I stop orders when we're slammed?",
        answer: "Yes. Pause online ordering with one tap, for a set time or until you turn it back on.",
      },
      {
        question: "Can I change prep times?",
        answer: "Yes. Set your usual prep time, and raise it during a rush so customers see a realistic ready time.",
      },
    ],
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
    shots: [{ key: "kds", label: "Kitchen display on a tablet", kind: "tablet", priority: "must" }],
    related: ["order-management", "online-ordering"],
  },
  {
    slug: "payments",
    name: "Payments",
    blurb: "Fast checkout, paid into your own account.",
    pillar: "operate",
    inMenu: true,
    headline: "A fast checkout for them. Money to your bank for you.",
    sub: "Customers pay in a few taps. The money goes into your own payment account.",
    capabilities: [
      "Card checkout in a few taps",
      "Tips at checkout",
      "Payment integrations",
    ],
    shots: [{ key: "checkout-pickup", label: "Customer checkout", kind: "phone", priority: "must" }],
    related: ["online-ordering", "integrations", "analytics"],
    notes: [
      "Every restaurant has its own payment account and is the merchant of record. WunTab connects your checkout to it.",
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
    shots: [{ key: "analytics", label: "Analytics dashboard", priority: "must" }],
    related: ["order-management", "customers", "guest-feedback", "menu-management"],
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
    shots: [],
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
    shots: [{ key: "multi-location", label: "Locations overview", priority: "helpful" }],
    related: ["enterprise", "analytics", "guest-feedback", "listings"],
    visual: "org",
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
    shots: [],
    related: ["multi-location", "analytics", "partners"],
    visual: "org",
  },
  {
    slug: "integrations",
    name: "Integrations",
    blurb: "Payments, delivery, and your POS.",
    pillar: "scale",
    inMenu: true,
    headline: "Works with what you already use.",
    sub: "Payments, third-party delivery, and your POS, connected.",
    capabilities: [
      "Payment integrations",
      "Third-party delivery",
      "Connects to your POS. If your POS isn't compatible, orders go to a kitchen printer",
    ],
    shots: [],
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

/**
 * Product pages that exist in this release (phase 1, SPEC section 15).
 * Products without a page are still named wherever they belong, but are
 * not links, so nothing on the site points at a missing page.
 */
export const builtProducts = [
  "online-ordering",
  "delivery",
  "catering",
  "restaurant-websites",
  "restaurant-seo",
  "order-management",
] as const;

const built = new Set<string>(builtProducts);

/** The product's page, or null while it has none. */
export function productHref(slug: string): string | null {
  return built.has(slug) ? `/${slug}` : null;
}

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
    blurb: "Fast direct orders, straight to the kitchen.",
    headline: "Fast orders, straight to the kitchen.",
    sub: "Online ordering on your own website, with tickets printing the moment an order lands.",
    points: [
      "Online ordering and delivery from your own website",
      "Tickets print in the kitchen as orders land",
      "Orders go into your POS, or to a kitchen printer",
      "A self-service kiosk and a branded app",
    ],
    products: ["online-ordering", "order-management", "delivery", "kiosk", "restaurant-app"],
  },
  {
    slug: "full-service",
    name: "Full-Service Restaurants",
    blurb: "Direct orders, and honest feedback.",
    headline: "Take orders direct, and hear how the visit went.",
    sub: "Online ordering on your own website, catering for the big bookings, and a way for guests to tell you how it went.",
    points: [
      "Online ordering and delivery from your own website",
      "Catering enquiries handled online instead of by phone",
      "Guest feedback before they leave",
      "Table ordering and pay at the table",
    ],
    products: ["online-ordering", "guest-feedback", "catering", "delivery", "table-ordering"],
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
