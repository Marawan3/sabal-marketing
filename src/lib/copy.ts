/**
 * DRAFT copy. Not approved for production.
 * Marawan signs off before any production deploy.
 * Rules: .claude/skills/wuntab-design/SKILL.md §8 (numbers) and §11 (voice).
 */
export const copy = {
  hero: {
    headline: "Google can't see most restaurant menus. It can see yours.",
    sub: "We build your restaurant's website and online ordering, then run it for you. You pay nothing. Orders print in your kitchen. The money goes to your bank.",
    cta: "Book a call",
    secondary: "See what Google sees",
  },
  proof: {
    heading: "What Google sees",
    sub: "We took one real restaurant in Orlando and put its menu on two websites. Then we checked what Google can actually read on each one.",
    left: {
      title: "A typical restaurant website",
      count: "0",
      label: "dishes Google can read",
      note: "The menu loads after the page. Google has already left.",
    },
    right: {
      title: "The same restaurant on Wuntab",
      intro: "Google can read:",
      // TODO(Marawan): replace with real dish names from the Orlando menu.
      // These are placeholders so the ticket has lines to print.
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
      label: "dishes Google can read",
    },
    footnote:
      "Measured September 2026. Same restaurant, same menu, both websites live at the same time.",
    aiLine: "It's not just Google.",
    aiBody:
      "AI helpers like ChatGPT and Claude read your menu the same way. If Google can read it, so can they.",
  },
  problem: {
    heading: "Here's the problem.",
    lines: [
      "When someone searches \"biryani near me\", Google looks at your website to find your menu.",
      "Most restaurant websites hide the menu inside code Google can't read. Google sees an empty page and shows someone else.",
      "So people order from the delivery apps instead. The apps take a cut of every order, and they keep the customer. You never learn their name.",
    ],
  },
  how: {
    heading: "How it works",
    steps: [
      {
        title: "We build your website",
        body: "Your name, your menu, your own web address. Every dish written so Google can read it. We do the work. You check it and say yes.",
      },
      {
        title: "Orders print in your kitchen",
        body: "Online orders go straight into your Clover, or to a printer if you don't have one. A text message backs up every order so nothing gets lost.",
      },
      {
        title: "You keep the money",
        body: "Payments land in your bank account, not ours. No monthly bill. No contract. Leave whenever you want.",
      },
    ],
  },
  features: {
    heading: "What you get",
    groups: [
      {
        title: "Getting found",
        items: [
          "A website Google can read from top to bottom",
          "A page for every dish you serve",
          "Your menu, hours, and address, always right",
          "Readable by AI helpers too",
        ],
      },
      {
        title: "Taking orders",
        items: [
          "Pickup and delivery from your own website",
          "Orders go into your Clover or to a printer",
          "Three taps and two boxes to pay",
          "Tip starts at 15%, and \"no tip\" is always right there",
        ],
      },
    ],
  },
  pricing: {
    heading: "What it costs you",
    stat: "$0",
    line: "Nothing. Wuntab is free for the restaurant.",
    body: "When someone orders online, they pay a 5% service fee at checkout. That's the whole price, and it's shown plainly before they pay. No monthly bill. No setup fee. No contract.",
    cta: "Book a call",
  },
  promise: {
    heading: "What we don't promise",
    body: "We can't promise you'll be first on Google. Nobody can, and anyone who says so is guessing. What we can promise is that Google can read every dish, every price, and every word on your site. That's the part we control, and we get it right.",
  },
  faq: {
    heading: "Questions owners ask",
    items: [
      {
        question: "Do I own my website and web address?",
        answer:
          "Yes. It's yours. If you ever leave, you take it with you.",
      },
      {
        question: "Does it work with my Clover?",
        answer:
          "Yes. Orders go straight into your Clover. If you don't have Clover, we set up a printer instead.",
      },
      {
        question: "What about delivery?",
        answer:
          "If you have your own drivers, we set that up. If you don't, we can add a courier option.",
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
        answer:
          "Yes, right at checkout, before they pay. We don't hide fees.",
      },
      {
        question: "Do I have to set anything up myself?",
        answer:
          "No. We build the site, load your menu, and connect your kitchen. You look it over and say yes.",
      },
    ],
  },
  finalCta: {
    heading: "Let's look at your restaurant together.",
    body: "A short call. We'll show you what Google sees on your website today.",
    cta: "Book a call",
  },
  legal: {
    termsTitle: "Terms",
    privacyTitle: "Privacy",
    comingSoon:
      "This page is coming soon. Our lawyer hasn't signed off on the public terms yet, so we're not publishing placeholder legal text.",
    questions: "Questions in the meantime:",
  },
  footer: {
    blurb: "Restaurant websites and online ordering, built and run for you.",
  },
  notFound: {
    heading: "That page isn't here.",
    body: "The address you typed doesn't exist on this site.",
    cta: "Back to the home page",
  },
} as const;
