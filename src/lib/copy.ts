/**
 * Site copy. Edit here, then update COPY.md so the founder review file stays in sync.
 * Numbers carry a `source` note so we can verify before launch.
 */

export const brand = {
  name: "Sabal",
  domain: "sabalmenu.com",
  tagline: "Your menu on Google. Your orders on your site.",
  description:
    "Sabal builds SEO-first websites and commission-free online ordering for independent restaurants. We set it up with you. No self-serve signup.",
} as const;

export const homeCopy = {
  heroKicker: "For independent restaurants",
  heroTitle: "Get found on Google. Keep the order. Keep the margin.",
  heroBody:
    "Sabal gives you a website Google can actually read and ordering that stays on your domain. We set it up with you. You stay the merchant. No marketplace in the middle.",
  heroCta: "Book a demo",
  heroSecondary: "See the product",
  heroPhoneCaption: "Pickup ordering on your own site",

  proofKicker: "The wedge is Google",
  proofTitle: "How Google sees your menu",
  proofBody:
    "Most restaurant sites hide the menu behind JavaScript, a PDF, or a photo. A crawler opens the page and finds an empty box. Sabal prints every dish, price, and description into the HTML — plus structured data — so a search for the food you cook can find you.",
  proofLeftTitle: "A typical JavaScript menu",
  proofLeftNote: "What a crawler often gets: an empty page.",
  proofRightTitle: "A Sabal menu",
  proofRightNote: "What a crawler gets: every dish, price, and description.",

  featuresTitle: "What you get",
  features: [
    {
      id: "seo",
      title: "Pages built for the searches people type",
      body: "Your menu becomes real web pages. We also build crave-term pages — think /tags/chicken — aimed at “dish + city” searches. Same data the kitchen uses. No thin placeholder copy.",
      href: "/product#google",
      link: "How the site gets found",
    },
    {
      id: "ordering",
      title: "One tap to add. No account wall.",
      body: "Guests add a dish in one tap. Pickup checkout is name, phone, and payment. Tip presets always include a visible None. We do not add a service fee on the diner.",
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
      id: "money",
      title: "No commission on the ticket",
      body: "You are the merchant of record. Guests pay you. Sabal charges a flat monthly fee and passes through payment processing at cost. We do not take a cut of the order.",
      href: "/pricing",
      link: "See pricing",
    },
  ],

  savingsKicker: "The money",
  savingsTitle: "What you keep vs a marketplace",
  savingsBody:
    "This is example math, not a promise about your restaurant. Marketplace commissions are commonly listed in the 15–30% range. We use 25% as a midpoint so the contrast is easy to see.",
  savingsSource:
    "SOURCE: typical published marketplace commission range 15–30% of the order. Midpoint 25% used for the example only — verify before treating as a claim. Monthly Sabal fee is quoted on the call; do not invent a dollar amount here.",
  savingsExampleLabel: "Example on $10,000 of marketplace orders in a month",
  savingsRows: [
    {
      label: "Marketplace cut at 25%",
      value: "$2,500",
      note: "Leaves the restaurant",
    },
    {
      label: "Sabal per-order commission",
      value: "$0",
      note: "We do not take a cut of the ticket",
    },
    {
      label: "What you still pay with Sabal",
      value: "Monthly + processing",
      note: "Flat monthly fee, quoted on the call. Card processing at the processor’s rates.",
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
      body: "Every item, price, and description ships in the HTML. We add MenuItem structured data and dedicated crave-term pages such as /tags/chicken for “dish + city” searches. Quality gates block thin or leftover draft copy.",
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
