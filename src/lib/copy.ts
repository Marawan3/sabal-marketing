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
  },
  /** Homepage tabs. Shots are attached in src/lib/shot-placements.ts. At most three short lines each. */
  outcomes: {
    heading: "What changes when orders come to you.",
    items: [
      {
        key: "direct",
        label: "More direct orders",
        lines: [
          "Customers order on your own website, under your name.",
          "Pickup, delivery, catering, and orders for later.",
          "Search engines can read every dish and price.",
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
          "Orders go into your POS, or to a kitchen printer.",
        ],
      },
    ],
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
  integrations: {
    heading: "Works with what you already use.",
    items: [
      "Payment integrations",
      "Third-party delivery",
      "Connects to your POS. If your POS isn't compatible, orders go to a kitchen printer",
    ],
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
  },
  faq: {
    heading: "Questions owners ask",
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
    body: "A short call. We will show you WunTab on your own menu.",
  },
  howItWorks: {
    headline: "How WunTab works",
    sub: "Six steps, one platform. Each one feeds the next.",
  },
  footer: {
    blurb: "Restaurant websites, online ordering, delivery, and marketing, built and run for you.",
  },
  notFound: {
    heading: "That page isn't here.",
    body: "The address you typed doesn't exist on this site.",
    cta: "Back to the home page",
  },
} as const;
