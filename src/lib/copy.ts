/**
 * DRAFT copy for the homepage and shared pages, for owner review.
 * Product-page copy lives in catalog.ts.
 *
 * Rules: docs/marketing-site/SPEC.md section 2 (as amended 2026-10-02).
 * - Pricing: diners pay a 5% service fee, restaurants pay $0. Matches /terms.
 * - Payments: each restaurant has its own payment account and is the
 *   merchant of record. WunTab is never described as the processor.
 * - No invented testimonials, logos, customer counts or performance numbers.
 * - No ranking or indexing guarantees; never "Google can't read JavaScript".
 * - Review requests are never described as going only to happy guests.
 * - No delivery provider or POS names.
 */
export const copy = {
  brand: "WunTab",
  cta: {
    primary: "Get Started",
    secondary: "See how it works",
    login: "Log in",
    talk: "Talk to us",
  },
  hero: {
    headline: "More direct orders. More repeat customers. One platform.",
    /** Metadata description. The page itself shows `line`. */
    sub: "WunTab brings your website, online ordering, delivery, catering, guest experience, marketing, and restaurant operations together in one platform.",
    line: "Your website, online ordering, delivery, and marketing, built and run for you.",
    inputLabel: "Your restaurant's name",
    /**
     * The trust line over the headline (owner, 2026-10-13). Sources: $0 is
     * SERVICE_FEE_CLAUSE (legal.ts); "No contract" is /terms 4.2 (you may end
     * the agreement at any time) and the "monthly fee or a contract" answer
     * below; "your customers" is /terms 1.2 (your customer list is yours).
     */
    trust: "$0 for the restaurant · No contract · Your customers, your data",
    /** The small card under the name field: the pricing fact, moved up. Same terms as SERVICE_FEE_CLAUSE. */
    price: { lead: "$0/month for the restaurant.", rest: "Customers pay 5% at checkout." },
    /** The hero animation: one sentence for screen readers, and its pause button. */
    demo: {
      description:
        "An animation: on a phone, a diner orders Spiced Lamb Meatballs, spice level Hot, from Palm&Stone Kitchen, our demo restaurant, and the order arrives as a new ticket on the kitchen display.",
      pause: "Pause the animation",
      play: "Play the animation",
    },
  },
  /** The built visuals (src/components/visuals): one sentence each for screen readers, and shared captions. */
  visuals: {
    delivery:
      "An animation: a delivery checkout on Palm&Stone Kitchen's website, our demo restaurant, then the tracking page showing the driver on the way.",
    catering:
      "An animation: the demo restaurant's catering page, where a customer fills in the catering enquiry form and sends it.",
    storefront:
      "An animation: the demo restaurant's own website, its featured dishes and prices, then a tap on Order online that opens the menu.",
    kitchen:
      "An animation of the kitchen display on a tablet: tickets in New, Preparing and Ready with running timers, and one order moving from New to Preparing.",
    dashboard:
      "The demo restaurant's dashboard: net sales for the last 30 days with the daily sales line, orders and average order.",
    search:
      "An illustration of a search result for the demo restaurant's menu page, listing dishes with their prices.",
    receipt:
      "An order's charges, line by line: the dish, subtotal, the customer's 5% service fee, tax, tip and total.",
    flow: "An animated diagram of a delivery order's six steps, from the customer's phone to WunTab, your kitchen, a driver and the customer.",
    orders:
      "An animation of the WunTab orders dashboard for the demo restaurant: the order list with status, prep time and totals, then one order's details opening, with its items, totals and the Mark ready button.",
    settings:
      "The online ordering settings: accepting orders, prep time, the ASAP quote and closing time, with controls to pause ordering and adjust prep time. Prep time goes from 20 to 25 minutes.",
    demoCaption: "Demo restaurant",
    searchCaption: "Illustration. We don't promise rankings.",
  },
  /** Homepage tabs, each with one built visual (src/app/page.tsx). At most two short lines each (2026-10-13). */
  outcomes: {
    heading: "What changes when orders come to you.",
    items: [
      {
        key: "direct",
        label: "More direct orders",
        lines: [
          "Customers order on your own website, under your name.",
          "Pickup, delivery, catering requests, and orders for later.",
        ],
      },
      {
        key: "repeat",
        label: "More repeat customers",
        lines: [
          "Every direct order adds a real customer to your list.",
          "Loyalty, texts, and automatic campaigns bring them back.",
        ],
      },
      {
        key: "busywork",
        label: "Less busywork",
        lines: [
          "Every order in one place, from new to done.",
          "Pause ordering or raise prep times in one tap.",
        ],
      },
    ],
  },
  /**
   * The savings calculator (homepage, between products and how it works).
   * The range is the commission third-party delivery apps publish for
   * restaurants' delivery orders (the largest app's own US merchant pricing
   * page lists 15%, 25% and 30% plans; sources in COPY.md, never named here).
   * No averages: both numbers are the owner's own.
   */
  savings: {
    heading: "What commission would you keep?",
    orders: "Delivery-app orders per week",
    value: "Average order value",
    result: "Estimated commission kept each year",
    empty: "Enter both numbers to see the range.",
    low: 15,
    high: 30,
    assumption: "Third-party apps charge 15–30% commission; we charge the restaurant $0.",
  },
  /** The one dark band on the homepage. The line restates the Kitchen Display entry in catalog.ts. */
  kitchen: {
    heading: "Every order on one screen in your kitchen.",
    line: "Orders show up in the order they came in, and your team moves each one from new to ready.",
  },
  products: {
    heading: "Everything you need to sell direct.",
    /** Large panels on the homepage, in this order. */
    slugs: ["online-ordering", "delivery", "catering", "order-management"],
  },
  steps: {
    heading: "How it works",
    items: [
      { title: "We build your site", line: "Your website and menu, built and loaded by us." },
      { title: "We connect your kitchen", line: "Orders go into your POS, or to a kitchen printer." },
      { title: "You say yes", line: "You look it over, then customers start ordering." },
    ],
  },
  beliefs: { heading: "What we believe" },
  stories: { heading: "Restaurants on WunTab" },
  scale: {
    heading: "One restaurant or fifty.",
    sub: "Locations, groups, and franchises on one account, with controls at the level you choose.",
  },
  /** On /how-it-works, as one question under this heading (the list it replaced, word for word in substance). */
  integrations: {
    heading: "Works with what you already use.",
    question: "What does WunTab work with?",
    answer:
      "Payment integrations and third-party delivery. WunTab connects to your POS. If your POS isn't compatible, orders go to a kitchen printer.",
  },
  pricing: {
    heading: "What it costs you",
    stat: "$0",
    line: "WunTab is free for the restaurant.",
    /** Same terms as SERVICE_FEE_CLAUSE in src/lib/legal.ts. */
    /** The homepage card: the same terms as the clause, shortened. */
    points: [
      "No monthly charge, no setup fee, no commission.",
      "Customers pay a 5% service fee, shown at checkout before they pay.",
    ],
    body: "There is no monthly charge, no setup fee, and no per-order commission charged to the restaurant. When a customer places an online order, the customer pays a service fee of 5% of the order. The fee is shown to the customer at checkout before payment is taken.",
    more: "Questions about delivery, catering, or several locations? Talk to us and we will walk through it.",
    /** /pricing asks these; the answers are `body` and `more`. */
    termsQuestion: "What exactly are the terms?",
    moreQuestion: "What about delivery, catering, or several locations?",
  },
  faq: {
    heading: "Questions owners ask",
    /**
     * Left off the homepage (2026-10-13), because the page already answers
     * them: the hero's trust line and $0 card (fee, contract, the 5%) and the
     * how-it-works steps (POS, setup). The solution pages still ask them.
     */
    leftOffHome: [
      "Is there a monthly fee or a contract?",
      "Do my customers see the 5%?",
      "Does it work with my POS?",
      "Do I have to set anything up myself?",
    ] as readonly string[],
    items: [
      {
        question: "What do I own?",
        answer:
          "Your menu, your photos, the words you write and your customer list are yours, and you take them with you if you leave. The website we build, its design and the platform behind it are ours, and you use them while you're with us. If you registered your own web address it stays yours. If we registered one for you, it's ours unless we agree to transfer it.",
      },
      {
        question: "Is WunTab a marketplace?",
        answer:
          "No. Customers order on your own website. Your name is on everything, and the customer is yours.",
      },
      {
        question: "How does delivery work if I don't have drivers?",
        answer:
          "WunTab requests third-party delivery for each delivery order. The driver picks up from you and delivers to the customer. You never build a fleet.",
      },
      {
        question: "Who gets the money?",
        answer:
          "You do. Every restaurant has its own payment account and is the merchant of record. Customer payments go into your account.",
      },
      {
        question: "Is there a monthly fee or a contract?",
        answer:
          "No. WunTab is free for the restaurant: no monthly charge, no setup fee, and no per-order commission. The customer pays a 5% service fee on online orders, and you can leave any time.",
      },
      {
        question: "Do my customers see the 5%?",
        answer: "Yes. The fee is shown to the customer at checkout, before payment is taken.",
      },
      {
        question: "Can search engines read my menu?",
        answer:
          "Yes. Every dish and price is in the page itself, so search engines can read them. Nobody can promise rankings, and we don't.",
      },
      {
        question: "Does it work with my POS?",
        answer:
          "WunTab connects to your POS. If your POS isn't compatible, orders go to a kitchen printer.",
      },
      {
        question: "Do I have to set anything up myself?",
        answer:
          "No. We build the site, load your menu, and connect your kitchen. You look it over and say yes.",
      },
    ],
  },
  finalCta: {
    heading: "Take control of your restaurant's direct business.",
    /** Under the button (owner, 2026-10-13). It replaces the line that sat above it. */
    after: "20-minute call. We show WunTab on your own menu. No pressure.",
    message: "Or send a message",
  },
  /** /contact: the form posts to /api/contact, which emails hello@wuntab.com. */
  contact: {
    headline: "Send us a message.",
    line: "Tell us about your restaurant. We reply within one business day.",
    fields: { name: "Your name", restaurant: "Restaurant", phone: "Phone", email: "Email", message: "Message" },
    send: "Send message",
    sending: "Sending",
    sent: "Thanks. Your message is on its way. We reply within one business day.",
    failed: "We couldn't send your message. Please email us instead:",
    call: "Rather talk? Book a 20-minute call.",
  },
  /** /about. The beliefs render only once the owner has written them (beliefs.ts). */
  about: {
    headline: "About WunTab",
    line: "We build and run restaurant websites, online ordering, delivery, and marketing, so orders come to you.",
    forHeading: "Who WunTab is for",
    forLine: "Every restaurant is set up by hand. We build the site, load your menu, and connect your kitchen.",
    reach: "Reach us",
  },
  howItWorks: {
    headline: "How WunTab works",
    sub: "Six steps, one platform. Each one feeds the next.",
  },
  notFound: {
    heading: "That page isn't here.",
    body: "The address you typed doesn't exist on this site.",
    cta: "Back to the home page",
  },
} as const;
