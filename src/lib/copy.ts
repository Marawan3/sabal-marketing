/**
 * Site copy. Edit here, then update COPY.md so the founder review file stays in sync.
 * Numbers carry a `source` note so we can verify before launch.
 */

export const brand = {
  name: "Sabal",
  domain: "sabalmenu.com",
  tagline: "Restaurant websites Google can actually read",
  description:
    "Most restaurant websites load the menu with code Google skips. Sabal serves every dish, price, and description in the HTML Google reads — plus commission-free ordering we set up with you.",
} as const;

/** Headline candidates. The site builds `heroTitle` (first). Founder picks in COPY.md. */
export const heroHeadlineVariants = [
  "Google can't read your menu. We fix that.",
  "Your best dish is invisible to Google.",
  "When Google reads your website, it sees nothing. Change that.",
  // SOURCE: 220 is an illustrative count, not a live restaurant. Do not treat as a metric.
  "220 dishes. Google sees 0. That's why they order elsewhere.",
  "Google can only rank a menu it can read.",
] as const;

export const homeCopy = {
  heroKicker: "For independent restaurants",
  heroTitle: heroHeadlineVariants[0],
  heroBody:
    "Most restaurant websites load the menu with code Google skips. Sabal serves every dish, price, and description in the exact form Google reads — so when someone nearby searches for what you cook, the menu is actually there to be read.",
  heroCta: "Book a demo",
  heroSecondary: "See what Google sees",
  heroSecondaryHref: "#what-google-sees",

  proofKicker: "The difference",
  proofTitle: "What Google actually sees",
  proofCaption:
    "Google decides who shows up in local search by reading websites. It can only rank what it can read.",
  proofToggleDiner: "What diners see",
  proofToggleGoogle: "What Google sees",
  proofLeftTitle: "A typical restaurant site",
  proofRightTitle: "A Sabal site",
  proofLeftCount: "Menu items visible to Google: 0",
  proofRightCount: "Menu items visible to Google: every single one",
  proofDinerNote:
    "Both can look like a normal menu. That is the trap. The diner never sees the empty page.",
  proofGoogleNote:
    "A crawler does not see the pretty view. It sees the first HTML. Stylized markup — not any real restaurant's source.",

  honestyQuote:
    "Nobody honest can promise you a ranking. We promise Google can finally read you — completely. The rest compounds from there.",
  honestyNote:
    "We guarantee crawler-readable HTML, structured data on every item, dish-and-city pages, and a fast site. We do not promise positions, timelines, or traffic.",

  featuresTitle: "What you get",
  features: [
    {
      id: "seo",
      title: "Every dish is a page Google can read",
      body: "The first HTML response includes the menu — names, prices, descriptions — plus MenuItem structured data. We also build dish-and-city pages such as /tags/chicken. Same data the kitchen uses. No thin placeholder copy.",
      href: "/product#google",
      link: "How the pages are built",
    },
    {
      id: "ordering",
      title: "Orders on your site. No cut of the ticket.",
      body: "One tap adds a dish. Pickup checkout is name, phone, and payment. Tip presets always include a visible None. No diner service fee. You are the merchant. Sabal is a flat monthly fee plus processing at cost.",
      href: "/product#ordering",
      link: "See the checkout",
    },
    {
      id: "kitchen",
      title: "Tickets that reach the line",
      body: "Orders print to the kitchen printers you already use, through your POS — Clover today, more coming — or a cloud printer we ship. If a print fails, a text still goes out. No order disappears.",
      href: "/product#kitchen",
      link: "Kitchen flow",
    },
    {
      id: "service",
      title: "We set it up. You cook.",
      body: "Sabal is not a self-serve tool. We import the menu, guide photography, set up search, connect the domain, and stay through launch. The button on this site books a conversation, not an account.",
      href: "/product#service",
      link: "How onboarding works",
    },
  ],

  statsKicker: "What we can actually count",
  statsTitle: "Inputs we control. Not rankings.",
  statsBody:
    "These are product facts, not Google outcomes. Each number has a source note in the copy file for launch review.",
  statsRows: [
    {
      label: "Menu items in the first HTML",
      value: "All of them",
      note: "Every published dish ships in the first response, not after a script runs.",
      // SOURCE: storefront is server-rendered; menu nodes are in the initial HTML document.
    },
    {
      label: "Taps to add a dish",
      value: "1",
      note: "One tap on Add. No account wall before the cart.",
      // SOURCE: storefront menu / item sheet Add control.
    },
    {
      label: "Pickup checkout fields",
      value: "3",
      note: "Name, phone, payment. Tip None is always visible.",
      // SOURCE: pickup checkout spec — guest-first, three required fields.
    },
    {
      label: "Sabal service fee on the diner",
      value: "$0",
      note: "No extra line on the guest. Processing is the processor’s rate to you.",
      // SOURCE: checkout has no Sabal service-fee line.
    },
  ],

  testimonialsKicker: "From restaurants",
  testimonialsTitle: "What owners will say, in their own words",
  testimonialsNote:
    "We do not invent quotes. These cards are placeholders until a restaurant agrees to be named.",

  finalCtaTitle: "Want this on your menu?",
  finalCtaBody:
    "A short call. Your city, your menu, what you already have live. We onboard every restaurant ourselves.",
} as const;

export const productCopy = {
  kicker: "The product",
  title: "From the first search to the ticket on the line",
  body: "A walkthrough of the storefront, the checkout, the kitchen, and the pages Google reads. Screens below are labeled slots until we drop in production captures.",
  sections: [
    {
      id: "storefront",
      title: "A site that looks like your restaurant",
      body: "Guests land on your domain. Categories, dishes, photos, and prices are real HTML — the same page a diner sees and a crawler reads. Multi-location when you need it.",
    },
    {
      id: "ordering",
      title: "Ordering that does not fight the guest",
      body: "One tap adds a dish. No account gate. Pickup checkout is name, phone, and payment. Tip buttons always include None, in the same size as the other presets. No extra “service fee” line on the diner. No fake urgency.",
    },
    {
      id: "kitchen",
      title: "The ticket reaches the kitchen",
      body: "Orders print to the stations you already have, through your POS (Clover today, more coming) or a cloud printer we ship. The diner can follow the order. A text goes out if a print does not. Nothing fails silently.",
    },
    {
      id: "google",
      title: "Built so Google can read the menu",
      body: "Every item, price, and description ships in the first HTML. We add MenuItem structured data and dish-and-city pages such as /tags/chicken. Quality gates block thin or leftover draft copy. We do not promise a ranking — we promise the page is readable.",
    },
    {
      id: "service",
      title: "We set it up. You cook.",
      body: "Sabal is not a self-serve tool. We import the menu, guide photography, set up search, connect the domain, and stay through launch. The button on this site books a conversation, not an account.",
    },
  ],
} as const;

export const pricingCopy = {
  kicker: "Pricing",
  title: "A flat monthly fee. No cut of the order.",
  body: "You pay Sabal one monthly amount, quoted on the call. Card charges settle to your merchant account at the processor’s rates. We do not add a commission or a per-order platform fee.",
  monthlyLabel: "Monthly",
  monthlyValue: "Quoted with you",
  monthlyDetail:
    "One flat fee. We set the number on a call after we see your menu and locations. There is no self-serve price list on purpose.",
  processingLabel: "Card processing",
  processingValue: "At cost",
  processingDetail:
    "Guests pay you. Processing is the processor’s rate, passed through. That is not a Sabal commission.",
  commissionLabel: "Per-order commission",
  commissionValue: "$0",
  commissionDetail:
    "No percentage of the ticket. No diner-facing service fee from Sabal.",
  tableTitle: "Against marketplaces, as a category",
  tableNote:
    "We do not name other companies. “Marketplaces” means the apps that sit between you and the diner and take a cut of the order.",
  tableHeaders: ["", "Marketplaces", "Sabal"] as const,
  tableRows: [
    ["Who the diner pays", "The marketplace", "You"],
    ["Cut of the order", "A large commission", "None"],
    ["Your monthly cost", "Often plus ads and extras", "One flat fee"],
    ["Card processing", "Bundled into their cut", "At the processor’s rates"],
    ["The guest record", "Theirs", "Yours"],
    ["Setup", "You list the restaurant", "We onboard you"],
  ] as const,
  faqs: [
    {
      question: "What does Sabal charge?",
      answer:
        "A flat monthly fee, quoted on the call, plus payment processing at the processor’s rates. We do not take a commission or a per-order fee.",
    },
    {
      question: "Do you add fees on the diner?",
      answer:
        "No. Pickup checkout is name, phone, and payment. Tip presets include a visible None. We do not add a service fee to the guest.",
    },
    {
      question: "Is there a signup page?",
      answer:
        "No. We set every restaurant up in person. Book a demo and we will look at your menu first.",
    },
  ],
  ctaTitle: "See the number on your menu.",
  ctaBody: "A short call. Your ticket mix, your city, what you already have live.",
} as const;

export const aboutCopy = {
  kicker: "About",
  title: "Built in Orlando for independent restaurants",
  lede: "Sabal started because a family restaurant should not have to rent its own guests from an app, or hide its menu in a PDF Google cannot read.",
  paragraphs: [
    "We work with independents — often family-run, busy, and tired of tech that talks down to them. We write in plain language. We show up and set the site up. There is no self-serve signup.",
    "Honesty is a product rule, not a slogan. We do not use fake urgency, exit popups, or invented reviews. Tip screens include None. We do not tack a service fee onto the diner. If a page starts as a draft in a tool, a person reads it before it goes live.",
    "The name is a palm. The work is unglamorous: readable pages, a fast checkout, a ticket that prints, and a monthly fee that is not a cut of your food.",
  ],
} as const;

export const demoCopy = {
  kicker: "Demo",
  title: "Book a demo",
  body: "Name, restaurant, phone, and city. We will look at your current site — or the lack of one — before we get on a call.",
  preferEmail: "Prefer email?",
  fields: {
    name: "Your name",
    restaurant: "Restaurant",
    phone: "Phone",
    city: "City",
  },
  submit: "Request a demo",
  submitting: "Sending…",
  success:
    "Received. Someone from Sabal will write you back. We onboard every restaurant ourselves, so expect a real conversation.",
  requiredNote: "All four fields are required. We will not add you to a newsletter.",
} as const;

export const testimonials = [
  {
    quote:
      "A restaurant owner will write this in their own words after they have used Sabal.",
    name: "First last",
    restaurant: "Restaurant name, city",
  },
  {
    quote:
      "A second owner quote goes here when that person agrees to be named and to the words.",
    name: "First last",
    restaurant: "Restaurant name, city",
  },
  {
    quote:
      "A third owner quote. Until then this card stays marked as a placeholder.",
    name: "First last",
    restaurant: "Restaurant name, city",
  },
] as const;

export const ctaDefault = {
  title: "Want this on your menu?",
  body: "We set the site up with you. No self-serve signup, on purpose.",
  button: "Book a demo",
} as const;
