/**
 * DRAFT copy — not approved for production.
 * Marawan signs off before any production deploy.
 */
export const copy = {
  hero: {
    headline: "Your menu, on Google. Your orders, commission-free.",
    sub: "Wuntab builds restaurant storefronts that search engines can actually read — with online ordering that sends every dollar to you.",
    cta: "Book a demo",
  },
  proof: {
    heading: "Measured, not marketed.",
    cards: [
      {
        stat: "220 vs 0",
        body: "220 menu items readable by Google in the first response — vs 0 on a leading competitor's stack. Same restaurant, measured head-to-head.",
      },
      {
        stat: "3 taps vs 5",
        body: "3 taps to checkout vs 5. Two form fields vs three.",
      },
      {
        stat: "15% tips, None always visible",
        body: "Tips default 15% with “None” always visible. No hidden service fees — ever.",
      },
    ],
    aiLine: "Readable by Google — and by AI assistants.",
    aiBody:
      "Menus are server-rendered HTML, so Google and AI assistants (Claude, ChatGPT) browsing the web can read them the same way. A client-only SPA shell leaves them a blank page.",
    footnote:
      "Measured Sept 2026 on a live restaurant running both platforms simultaneously.",
  },
  how: {
    heading: "How it works",
    steps: [
      {
        title: "We build your site",
        body: "A storefront on your domain. The menu is real HTML, not a photo or a PDF.",
      },
      {
        title: "Orders reach your kitchen",
        body: "POS injection or a printer. SMS backup is always on.",
      },
      {
        title: "You keep the revenue",
        body: "You are the merchant of record. Money settles to your account, not ours.",
      },
    ],
  },
  features: {
    heading: "What you get",
    items: [
      {
        title: "SEO-first menus",
        body: "Every dish is a page search engines can read.",
      },
      {
        title: "Commission-free ordering",
        body: "Pickup and delivery on your domain. No per-order cut.",
      },
      {
        title: "Kitchen printing & POS routing",
        body: "Tickets land where the line already works.",
      },
      {
        title: "Delivery options",
        body: "Self-delivery, or a courier when you want one.",
      },
      {
        title: "AI-drafted content, human-approved",
        body: "Drafts start faster. Nothing publishes without a person.",
      },
      {
        title: "Honest checkout, no dark patterns",
        body: "Fees you can see. A tip “None” that stays visible.",
      },
    ],
  },
  pricing: {
    heading: "Pricing",
    line: "Simple monthly price. No per-order commission. No setup fee surprises.",
    slotLabel: "Monthly price",
    slotValue: "To be confirmed",
    slotNote:
      "Exact figure ships here when it is set. Until then this is a slot, not a number.",
    cta: "Talk to us",
  },
  faq: {
    heading: "FAQ",
    items: [
      {
        question: "Do I own my domain?",
        answer:
          "Yes — and we help you get it back if a platform holds it.",
      },
      {
        question: "What POS do you support?",
        answer: "Clover today; printer kits for everyone else.",
      },
      {
        question: "What about delivery?",
        answer:
          "Self-delivery if you already run drivers, plus a courier option when you do not.",
      },
      {
        question: "Who processes payments?",
        answer: "You do — you are the merchant of record.",
      },
      {
        question: "Can I leave?",
        answer: "Anytime. Your domain and content are yours.",
      },
    ],
  },
  legal: {
    termsTitle: "Terms",
    privacyTitle: "Privacy",
    comingSoon:
      "This page is coming soon. Counsel has not signed off on public terms yet, so we are not publishing placeholder legal text.",
    questions: "Questions in the meantime:",
  },
  footer: {
    blurb:
      "Restaurant storefronts that search engines can read. Ordering with no per-order commission.",
  },
  notFound: {
    heading: "Page not here.",
    body: "That URL is not on this site.",
    cta: "Back home",
  },
} as const;
