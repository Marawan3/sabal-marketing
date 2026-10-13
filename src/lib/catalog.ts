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

export type Flow = {
  title: string;
  /** The same steps asked as a question, for the FAQ (copy rules, 2026-10-13: sections stay short). */
  question: string;
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
  /** Slugs of products this one connects to. */
  related: string[];
  /** Plain-language notes. Delivery's first note is the line over its flow diagram; others live in the FAQ. */
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
      "Recommended add-ons when a customer picks a dish",
      "Customer accounts with favorites and one-tap reorder",
      "Order tracking and automatic order updates for the customer",
    ],
    related: ["online-menu", "delivery", "upsells", "loyalty", "order-management"],
    flow: {
      title: "How an online order works",
      question: "How does an online order work?",
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
        question: "Whose name do customers see?",
        answer: "Yours. Your restaurant is the brand from the first tap to the thank-you screen. WunTab stays in the background.",
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
    blurb: "Your menu as your storefront.",
    pillar: "sell",
    inMenu: false,
    headline: "Your menu is your storefront.",
    sub: "Categories, photos, prices and choices, on your own website, ready to order from.",
    capabilities: [
      "Your menu by category, with a photo, price and description for each dish",
      "Choices and add-ons, like spice level and extras, with their prices",
      "Search across the whole menu",
      "A Most ordered list once orders come in",
      "Mark a dish sold out and it comes off the menu until you put it back",
    ],
    flow: {
      title: "How your menu gets online",
      question: "How does my menu get online?",
      steps: [
        "We load your menu, photos and prices",
        "Customers open it on your website",
        "They pick a dish and its options",
        "Sold-out dishes stay off until you put them back",
      ],
    },
    related: ["online-ordering", "menu-management", "upsells", "restaurant-seo"],
    faq: [
      {
        question: "What happens when a dish runs out?",
        answer: "Mark it sold out in your dashboard. It comes off your online menu straight away, until you mark it available again.",
      },
      {
        question: "Can customers see photos?",
        answer: "Yes. Each dish can have a photo, shown on the menu and when the customer opens the dish.",
      },
    ],
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
      question: "How does a delivery order move?",
      steps: [
        "Customer orders on your website",
        "WunTab receives the order",
        "Your kitchen prepares it",
        "WunTab requests a third-party driver",
        "Driver picks up the order",
        "Customer receives it",
      ],
    },
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
    /*
     * Rewritten 2026-10-13 to match the product: catering is a request form on
     * the restaurant's website (event date, guests, details). The restaurant
     * replies and confirms. No catering menu, lead times, minimums or online
     * payment until they are built (LOG.md follow-ups).
     */
    blurb: "Take catering requests on your website.",
    pillar: "sell",
    inMenu: true,
    headline: "Take catering requests on your own website.",
    sub: "Customers send the date, the headcount and what they need. You reply and confirm the order with them.",
    capabilities: [
      "A catering page on your website",
      "A request form for the event date, the number of guests and the details",
      "A note asking customers about allergies and dietary needs",
      "Each request goes to the restaurant, which replies and confirms",
    ],
    related: ["online-ordering", "delivery", "order-management"],
    flow: {
      title: "How a catering request works",
      question: "How does a catering request work?",
      steps: [
        "Customer opens the catering page on your website",
        "Sends the event date, the number of guests and the details",
        "The request goes to the restaurant",
        "You reply with a plan and a price",
        "You confirm the order with the customer",
      ],
    },
    faq: [
      {
        question: "Can customers order catering online?",
        answer:
          "They send a catering request on your website: the event date, the number of guests and what they need. You reply and confirm the order with them.",
      },
      {
        question: "Do customers pay for catering online?",
        answer: "No. You agree the order and the price with the customer when you confirm it.",
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
    related: ["online-ordering", "loyalty"],
  },
  {
    slug: "upsells",
    name: "Recommended Add-ons",
    blurb: "Suggest add-ons when they pick a dish.",
    pillar: "sell",
    inMenu: false,
    /*
     * Rule-based only, as built (owner, 2026-10-13): the restaurant's own
     * picks per dish, then its most-ordered dishes. No "smart", no AI.
     */
    headline: "Suggest the side when they pick the dish.",
    sub: "Pick add-ons for each dish. Customers see them under “Goes well with” when they open it.",
    capabilities: [
      "Up to four add-ons per dish, picked by you",
      "Shown under “Goes well with” when a customer opens the dish",
      "Your most-ordered dishes fill in where you haven't picked any",
      "Nothing already in the cart is suggested again",
      "A “Complete your order” strip in the cart",
    ],
    flow: {
      title: "How a suggestion works",
      question: "How does a suggestion work?",
      steps: [
        "You pick add-ons for a dish in your menu editor",
        "A customer opens that dish",
        "Your picks show under Goes well with",
        "One tap adds one to the order",
      ],
    },
    related: ["online-menu", "menu-management", "online-ordering"],
    faq: [
      {
        question: "Who decides what's suggested?",
        answer: "You do. Pick up to four add-ons for each dish in your menu editor. Where you haven't, your most-ordered dishes fill in.",
      },
    ],
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
    related: ["restaurant-seo", "online-ordering", "online-menu"],
    flow: {
      title: "How we build your website",
      question: "How do you build my website?",
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
    related: ["menu-check", "restaurant-websites", "online-menu"],
    flow: {
      title: "How your menu goes into the page",
      question: "What goes into the page?",
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
      question: "How does the feedback loop work?",
      steps: [
        "Guest scans a QR code or taps an NFC tag",
        "Guest leaves feedback",
        "You see it right away",
        "A manager can act on it",
        "The next visit is better",
      ],
    },
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
    related: ["guest-feedback", "restaurant-marketing"],
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
    /*
     * A build commitment (REGISTER.md, owner 2026-10-13): outcome-level words
     * only. No points math, no tiers, no app.
     */
    headline: "Give regulars a reason to come back.",
    sub: "Customers earn a reward for coming back. You decide what it is and when they get it.",
    capabilities: [
      "A reward for customers who come back",
      "You choose the reward",
      "You choose when they earn it",
      "They see it when their order is confirmed",
    ],
    flow: {
      title: "How a reward works",
      question: "How does a reward work?",
      steps: [
        "You choose a reward and when it's earned",
        "A customer comes back and orders",
        "They see the reward with their order",
        "They use it next time",
      ],
    },
    related: ["online-ordering", "upsells", "online-menu"],
    faq: [
      {
        question: "What can the reward be?",
        answer: "Whatever you choose, like a free side or a dish on the house, and you decide when customers earn it.",
      },
    ],
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
    sub: "Edit a dish in one place. Your website and online ordering show it the moment you save.",
    capabilities: [
      "Dishes, categories and descriptions",
      "Photos",
      "Prices",
      "Modifier groups, like spice level and extras",
      "Available, Sold Out or Hidden, per location",
      "Dietary labels: vegetarian, vegan, gluten-free, spicy, halal",
    ],
    flow: {
      title: "How a menu change goes live",
      question: "How does a menu change go live?",
      steps: [
        "Open the dish in your menu editor",
        "Change the price, photo or availability",
        "Save",
        "Your website and online ordering show it straight away",
      ],
    },
    related: ["online-menu", "upsells", "online-ordering", "order-management"],
    faq: [
      {
        question: "Is there a publish button?",
        answer: "No. Save the dish and the change is live on your website and online ordering.",
      },
      {
        question: "Can a dish be sold out at one location only?",
        answer: "Yes. Availability is set for each location.",
      },
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
    related: ["kitchen-display", "delivery", "menu-management", "payments"],
    flow: {
      title: "How an order moves through your kitchen",
      question: "How does an order move through the kitchen?",
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
    sub: "Every order in New, Preparing and Ready. Your team taps each one along.",
    capabilities: [
      "New, Preparing and Ready columns",
      "A running timer on every ticket",
      "Start, Ready and Complete buttons",
      "Live: new orders appear as they come in",
      "Recently completed orders at the bottom",
    ],
    flow: {
      title: "How an order moves across the screen",
      question: "How does an order move across the screen?",
      steps: [
        "A paid order lands in New",
        "Tap Start and it moves to Preparing",
        "Tap Ready when it's done",
        "Tap Complete when it's picked up",
      ],
    },
    related: ["order-management", "online-ordering", "menu-management"],
    faq: [
      {
        question: "What do I need to run it?",
        answer: "A tablet or screen with a web browser, signed in to WunTab.",
      },
    ],
  },
  {
    slug: "payments",
    name: "Payments",
    blurb: "Card and Apple Pay at checkout.",
    pillar: "operate",
    inMenu: true,
    /*
     * The intended model (owner, 2026-10-13): each restaurant has its own
     * merchant account with our payment partner and is paid through it;
     * WunTab's 5% comes from the customer at checkout. Both are build
     * commitments in REGISTER.md. Card numbers are tokenized in the payment
     * partner's hosted fields; WunTab stores brand and last four only
     * (sources in COPY.md). The partner is never named on the site.
     */
    headline: "A fast checkout, and a paid order straight to your kitchen.",
    sub: "Customers pay by card or Apple Pay. The order goes to your kitchen, and the money to your own merchant account.",
    capabilities: [
      "Card and Apple Pay at checkout",
      "Paid through your own merchant account with our payment partner",
      "WunTab's 5% comes from the customer at checkout, not from you",
      "Tips at checkout, with no tip always an option",
      "The order goes to your kitchen once it's paid",
      "Cancel and refund an order from your dashboard",
      "Card numbers go into our payment partner's secure fields and never reach WunTab. We keep only the card brand and last four digits",
    ],
    flow: {
      title: "How a payment moves",
      question: "How does a payment move?",
      steps: [
        "The customer pays by card or Apple Pay",
        "Our payment partner checks the card",
        "The order shows Paid and goes to your kitchen",
        "The money goes to your own merchant account",
      ],
    },
    related: ["online-ordering", "integrations", "order-management", "kitchen-display"],
    faq: [
      {
        question: "Who gets paid?",
        answer: "You, through your own merchant account with our payment partner. WunTab takes 5% from the customer at checkout, not from you.",
      },
      {
        question: "Is card data safe?",
        answer: "Card numbers go into our payment partner's secure fields and never reach WunTab's servers. We keep only the card brand and the last four digits.",
      },
      {
        question: "Which ways can customers pay?",
        answer: "Card or Apple Pay, at checkout.",
      },
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
    related: ["enterprise", "analytics", "guest-feedback"],
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
    /*
     * The owner's wording (2026-10-13): payment and delivery are live; the
     * POS line is his. No logos or names of any payment, delivery or POS
     * company, anywhere.
     */
    capabilities: [
      "Payments: live. Customers pay at checkout, into your own payment account",
      "Delivery: live. A third-party driver is requested for every delivery order",
      "POS: connects to your POS where supported; if not, a kitchen printer",
    ],
    flow: {
      title: "How an order reaches your kitchen",
      question: "How does an order reach my kitchen?",
      steps: [
        "Customer orders on your website",
        "The payment goes into your own payment account",
        "WunTab receives the order",
        "It goes to your POS where supported, or a kitchen printer",
      ],
    },
    related: ["payments", "delivery", "order-management", "online-ordering"],
    faq: [
      {
        question: "Does it work with my POS?",
        answer: "WunTab connects to your POS where supported. If not, orders go to a kitchen printer.",
      },
      {
        question: "Who handles delivery?",
        answer: "WunTab requests third-party delivery for each delivery order. The driver picks up from you and delivers to the customer.",
      },
      {
        question: "Who gets the money?",
        answer: "You do. Every restaurant has its own payment account and is the merchant of record.",
      },
    ],
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
  "integrations",
  // Secondary pages (owner, 2026-10-13): linked from the footer and from
  // their parent pages' Works with, not from the mega-menu.
  "online-menu",
  "upsells",
  "loyalty",
  "kitchen-display",
  "menu-management",
  "payments",
] as const;

/** Built pages that stay out of the mega-menu. */
export const secondaryProducts = new Set<string>(["online-menu", "upsells", "loyalty", "kitchen-display", "menu-management", "payments"]);

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

// ───────────────────────────── SOLUTIONS ─────────────────────────────

/**
 * The four solution pages (owner, 2026-10-13): each picks the four product
 * pages that matter most for that kind of restaurant and links to them with
 * the product's own one-line blurb. Headlines and lines are the earlier
 * solution copy, trimmed to what those four pages show. No new claims.
 * The old "Catering businesses" and "Groups & franchises" entries went with
 * this change: the first described catering features the product does not
 * have, and neither had a page.
 */
export type Solution = {
  slug: string;
  name: string;
  blurb: string;
  headline: string;
  sub: string;
  /** Four built product pages, in order. */
  picks: string[];
  /** Questions from the homepage FAQ (copy.faq), by question. */
  faq: string[];
};

export const solutions: Solution[] = [
  {
    slug: "independent-restaurants",
    name: "Independent Restaurants",
    blurb: "One restaurant, everything direct.",
    headline: "Everything a single restaurant needs to sell direct.",
    sub: "Website, ordering, and delivery in one place, set up for you.",
    picks: ["restaurant-websites", "online-ordering", "delivery", "order-management"],
    faq: ["Do I have to set anything up myself?", "Is there a monthly fee or a contract?", "What do I own?"],
  },
  {
    slug: "quick-service",
    name: "Quick-Service Restaurants",
    blurb: "Fast direct orders, straight to the kitchen.",
    headline: "Fast orders, straight to the kitchen.",
    sub: "Online ordering on your own website, with every order going to your kitchen.",
    picks: ["online-ordering", "order-management", "delivery", "integrations"],
    faq: ["Does it work with my POS?", "How does delivery work if I don't have drivers?", "Who gets the money?"],
  },
  {
    slug: "full-service",
    name: "Full-Service Restaurants",
    blurb: "Direct orders and catering requests.",
    headline: "Direct orders and catering, on your own website.",
    sub: "Online ordering and delivery from your own website, and catering requests for the big bookings.",
    picks: ["online-ordering", "catering", "delivery", "restaurant-websites"],
    faq: ["Is WunTab a marketplace?", "Do my customers see the 5%?", "What do I own?"],
  },
  {
    slug: "multi-location",
    name: "Multi-Location Restaurants",
    blurb: "Every location on one account.",
    headline: "Every location on one platform.",
    sub: "Run every location from one account, with menus, orders, and feedback per location.",
    picks: ["online-ordering", "order-management", "restaurant-websites", "restaurant-seo"],
    faq: ["Is there a monthly fee or a contract?", "Who gets the money?", "Do I have to set anything up myself?"],
  },
];

export const solutionBySlug = Object.fromEntries(
  solutions.map((s) => [s.slug, s]),
) as Record<string, Solution>;

export const solutionHref = (slug: string) => `/solutions/${slug}`;

/** The complete product story, used on the homepage and /how-it-works. */
export const lifecycle: { name: string; body: string; products: string[] }[] = [
  {
    name: "Discover",
    body: "A customer finds you through your website, search, listings, or a campaign.",
    products: ["restaurant-websites", "restaurant-seo", "restaurant-marketing"],
  },
  {
    name: "Order",
    body: "They order online, for delivery, at the table, at a kiosk, or in your app, and send catering requests.",
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
