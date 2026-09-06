/**
 * DRAFT copy for the homepage and shared pages. Not approved for production.
 * Product-page copy lives in catalog.ts.
 * Rules: .claude/skills/wuntab-design/SKILL.md
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
    sub: "WunTab brings your website, online ordering, delivery, catering, guest experience, marketing, and restaurant operations together in one platform.",
    /** One composition: the four screens share keys with the product pages. */
    screens: [
      { key: "website-home", label: "Your website", priority: "must" as const },
      { key: "ordering-menu", label: "Customer ordering", kind: "phone" as const, priority: "must" as const },
      { key: "order-management", label: "Your dashboard", priority: "must" as const },
      { key: "kitchen-display", label: "Kitchen and fulfillment", priority: "must" as const },
    ],
    lifecycle: ["Website", "Ordering", "Dashboard", "Kitchen"],
  },
  proof: {
    heading: "One platform, from the first search to the next order.",
    sub: "Every piece of WunTab feeds the next one. That loop is the product.",
  },
  sell: {
    heading: "Give customers more ways to order from you.",
    sub: "Every order goes through your brand and lands in your kitchen.",
  },
  discovery: {
    heading: "Turn searches into orders.",
    sub: "A website with your menu built in, made so search engines can read every dish.",
    checkCta: "See what Google sees",
    checkBody:
      "Send us your website address. We will show you what Google can read on your menu today, and what it would read on WunTab.",
  },
  delivery: {
    heading: "Delivery without building a fleet.",
    sub: "Your customers order from you. WunTab requests the driver.",
  },
  catering: {
    heading: "Turn big orders into easy orders.",
    sub: "A catering menu, lead times, and minimums, ordered online and scheduled ahead.",
  },
  guest: {
    heading: "Know what your guests think.",
    sub: "A QR code or an NFC tap lets guests tell you how it went while they are still at the table.",
    chain: ["Feedback", "Reviews", "Loyalty", "Repeat customer"],
    chainIntro: "Then the loop continues:",
  },
  growth: {
    heading: "Turn customers into regulars.",
    sub: "Every direct order adds a real customer to your list. WunTab helps you bring them back.",
    items: [
      { name: "Customer database", slug: "customers" },
      { name: "Loyalty and rewards", slug: "loyalty" },
      { name: "Email campaigns", slug: "email-marketing" },
      { name: "Text campaigns", slug: "sms-marketing" },
      { name: "Automatic campaigns", slug: "restaurant-marketing" },
      { name: "Push notifications", slug: "restaurant-app" },
    ],
  },
  operations: {
    heading: "Everything after Place Order.",
    sub: "Menu, orders, kitchen, and payments, run from one dashboard.",
    items: [
      { name: "Menu management", slug: "menu-management" },
      { name: "Order management", slug: "order-management" },
      { name: "Kitchen display", slug: "kitchen-display" },
      { name: "Payments", slug: "payments" },
      { name: "Prep times", slug: "order-management" },
      { name: "Availability controls", slug: "menu-management" },
    ],
  },
  analytics: {
    heading: "Know what's working.",
    sub: "Sales, orders, menu, customers, and feedback, reported from the same system that takes the orders.",
  },
  scale: {
    heading: "One restaurant or fifty.",
    sub: "Locations, groups, and franchises on one account, with controls at the level you choose.",
  },
  integrations: {
    heading: "Works with what you already use.",
    available: ["Payment integrations", "Delivery driver integration"],
    comingSoon: ["POS integrations"],
    comingSoonLabel: "Coming soon",
  },
  pricing: {
    heading: "What it costs you",
    stat: "$0",
    line: "Nothing. WunTab is free for the restaurant.",
    body: "When someone orders online, they pay a 5% service fee at checkout. It is shown plainly before they pay. No monthly bill. No setup fee. No contract.",
    more: "Questions about delivery, catering, or several locations? Talk to us and we will walk through it.",
  },
  customerProof: {
    heading: "Live today.",
    body: "A real restaurant in Orlando runs its website, online ordering, and kitchen on WunTab. We measured its menu head to head against the same restaurant on another platform: 220 dishes readable by Google in the first response, versus 0.",
    footnote:
      "Measured September 2026. Same restaurant, same menu, both websites live at the same time. Restaurant name and screens will appear here with the owner's permission.",
    shot: { key: "website-home", label: "A live WunTab storefront", priority: "must" as const },
  },
  faq: {
    heading: "Questions owners ask",
    items: [
      {
        question: "Do I own my website and web address?",
        answer: "Yes. It's yours. If you ever leave, you take it with you.",
      },
      {
        question: "Is WunTab a marketplace?",
        answer:
          "No. Customers order on your website, your app, or in your restaurant. Your name is on everything, and the customer is yours.",
      },
      {
        question: "How does delivery work if I don't have drivers?",
        answer:
          "When an order is ready, WunTab requests a third-party driver. The driver picks up from you and delivers to the customer. You never build a fleet.",
      },
      {
        question: "Who gets the money?",
        answer:
          "You do. Payments go to your bank account. We never hold your money.",
      },
      {
        question: "Is there a monthly fee or a contract?",
        answer:
          "No. You pay nothing. The diner pays a 5% service fee on online orders, and you can leave any time.",
      },
      {
        question: "Do my customers see the 5%?",
        answer: "Yes, right at checkout, before they pay. We don't hide fees.",
      },
      {
        question: "Does it work with my POS?",
        answer:
          "POS integrations are coming. Today, orders print in your kitchen and show on a kitchen display, and you manage them in the WunTab dashboard.",
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
  about: {
    headline: "We build the direct business for independent restaurants.",
    body: [
      "WunTab started with a simple observation: restaurants were paying a big cut of every order to platforms that kept the customer. We wanted the restaurant to keep both.",
      "So we built one platform that does the whole job. The website, the ordering, the delivery, the kitchen, the feedback, and the marketing that brings people back. Every restaurant is set up by hand, by us.",
      "We promise what we control and we say what things cost. That is the whole company.",
    ],
  },
  contact: {
    headline: "Let's talk about your restaurant.",
    body: "Book a short call or send an email. We will show you WunTab on your own menu.",
  },
  blog: {
    headline: "Articles",
    body: "We are writing. The first articles will be about getting found on Google, direct ordering, and running delivery without drivers.",
  },
  menuCheck: {
    headline: "See what Google sees.",
    sub: "Most restaurant menus are hard for search engines to read. Send us your website address and we will show you exactly what Google can read on yours today.",
    cta: "Check my menu",
    example: "Here is what the check looks like for a real restaurant in Orlando.",
    left: {
      title: "A typical restaurant website",
      count: "0",
      label: "dishes Google can read on the first visit",
      note: "The menu loads after the page. Search engines may come back for it later, or not.",
    },
    right: {
      title: "The same restaurant on WunTab",
      intro: "Google can read:",
      // TODO(Marawan): replace with real dish names from the Orlando menu.
      dishes: [
        "Samosa chaat",
        "Pani puri",
        "Chicken biryani",
        "Paneer tikka",
        "Butter chicken",
        "Garlic naan",
        "Dal makhani",
        "Masala dosa",
        "Chole bhature",
        "Mango lassi",
        "Gulab jamun",
        "Masala chai",
      ],
      more: "and 208 more",
      total: 220,
      label: "dishes Google can read on the first visit",
    },
    footnote:
      "Measured September 2026. Same restaurant, same menu, both websites live at the same time.",
    aiLine: "It's not just Google.",
    aiBody:
      "AI helpers like ChatGPT and Claude read your menu the same way. If search engines can read it, so can they.",
  },
  legal: {
    termsTitle: "Terms",
    privacyTitle: "Privacy",
    comingSoon:
      "This page is coming soon. Our lawyer hasn't signed off on the public terms yet, so we're not publishing placeholder legal text.",
    questions: "Questions in the meantime:",
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
