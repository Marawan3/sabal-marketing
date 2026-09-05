---
name: wuntab-design
description: The Wuntab marketing-site design system and copy rules. Load before touching anything visual or any public copy in this repo. Covers palette, type scale, spacing, section patterns, motion, the proof module, allowed numbers, and the do/don't list. Pairs with the frontend-design skill in this folder.
---

# Wuntab design system

Read `.claude/skills/frontend-design/SKILL.md` first for general craft. This file is the
Wuntab-specific brief. Where the two disagree, this file wins.

Owner: Marawan Elkabany. Every visual change ships as a preview he can react to.
Copy is draft until he says otherwise.

## 1. What we are designing for

**Wuntab** builds and runs an independent restaurant's own website with online ordering.
One vendor: the site, getting found on Google, the ordering, checkout, and orders
printing straight into the kitchen through the POS they already own (Clover first).
Not self-serve. Every restaurant is onboarded by hand. The only thing this site has to
do is get an owner to book a call.

**Reader:** an independent restaurant owner. Often family-run, busy, not technical,
burned by agencies and apps before, losing a big cut of each order to delivery
marketplaces. They read this on a phone between rushes. Write and design for a smart,
tired person.

**The one idea that drives the page:** most restaurant websites hide the menu behind
code Google cannot read, so the restaurant is invisible for "biryani near me". On a
Wuntab site Google can read every dish and every price. We promise the inputs (Google
can read everything). We never promise the outputs (rankings). That honesty is the brand.

**Voice in one line:** the restaurant keeps the money, the diner gets a fast honest
checkout, and Google finally sees the menu.

**The enemy, as a category only, never by name:** marketplaces that take a commission
and own the customer, and website builders whose sites Google can't actually read.

## 2. Why the old page looked generated

The previous build used a cream page, a terracotta/brick accent, six identical rounded
cards, an eyebrow label over every heading, system font at weights 400/500, and a
"stat + small label" hero. The frontend-design skill lists cream + terracotta + card kit
as the single most common tell of an AI page. Treat the old palette and layout as
retired. Do not reintroduce them.

## 3. Palette

Restaurant vernacular, not SaaS vernacular: white paper, kitchen-ticket stock, deep
green ink, a saffron "we're open" accent. Use exactly these six. Define them in
`src/lib/brand.ts` and `src/app/globals.css`; never hard-code a hex in a component.

| Token     | Hex       | Use                                                                 |
|-----------|-----------|---------------------------------------------------------------------|
| `paper`   | `#FFFFFF` | Page background. The page is white, not cream.                      |
| `ink`     | `#17352A` | All text, the dark CTA band, the footer. Deep green, not near-black.|
| `ticket`  | `#F6F1E7` | Kitchen-ticket stock. Only for the proof tickets and screen frames. |
| `saffron` | `#F2B33D` | Primary CTA fill with `ink` text. Nothing else is saffron.          |
| `tomato`  | `#D9482B` | The "0 items / Google can't see this" negative state only.          |
| `mist`    | `#E4EAE6` | Hairlines, dividers, disabled, subtle backgrounds.                  |

Secondary text is `ink` at 72% opacity. Never `mist` for text.
Contrast floors: `ink` on `paper` and `ink` on `saffron` both pass AA for all sizes.
`tomato` on `paper` passes AA at 17px+ only; use it for numbers and short words, never
paragraphs. No gradients anywhere. No tinted near-blacks.

Dark sections: background `ink`, text `paper`, CTA `saffron`. At most two dark
sections on the page (the final CTA band and, optionally, the proof module frame).

## 4. Typography

One family: **Bricolage Grotesque** (variable, Google Fonts) loaded with
`next/font/google`, `display: "swap"`, preloaded, subsets `latin` only. It is warm,
a little hand-made, and reads nothing like Inter. Fallback stack
`ui-sans-serif, system-ui, sans-serif`. If Lighthouse mobile performance drops below
95 because of the font, reduce the weights loaded before you drop the font.

Weights: 400 body, 500 buttons and nav, 700 headlines and stats. No 600.
Numbers always `font-variant-numeric: tabular-nums`.

Type scale (base 17px, tuned steps, mobile to desktop via `clamp`):

| Role      | Size                              | Line height | Tracking | Weight |
|-----------|-----------------------------------|-------------|----------|--------|
| display   | `clamp(2.625rem, 7.5vw, 4.75rem)` | 1.02        | -0.025em | 700    |
| h2        | `clamp(1.875rem, 4vw, 2.75rem)`   | 1.1         | -0.015em | 700    |
| h3        | `1.25rem`                         | 1.3         | -0.005em | 700    |
| stat      | `clamp(3.5rem, 10vw, 6.5rem)`     | 0.95        | -0.03em  | 700    |
| lead      | `1.25rem`                         | 1.5         | 0        | 400    |
| body      | `1.0625rem` (17px)                | 1.6         | 0        | 400    |
| small     | `0.9375rem`                       | 1.5         | 0        | 400    |
| button    | `1rem`                            | 1           | 0        | 500    |

Line length: body max 62ch, lead max 48ch, display max 14 words.
Sentence case everywhere. No all-caps. No letter-spaced eyebrow labels above headings.
No single-word color accents inside a headline. Headlines are full sentences a person
would say out loud.

## 5. Spacing, layout, shape

- Base unit 4px. Use only 8, 12, 16, 24, 32, 48, 64, 96, 128 for vertical rhythm.
- Container `max-width: 1120px`; gutters 20px mobile, 32px from 640px, 48px from 1024px.
- Section padding: 80px top and bottom on mobile, 128px on desktop. Adjacent sections
  with the same background get a single hairline (`mist`), not a double gap.
- Everything is left-aligned. Center only the final CTA band.
- Radius: 8px buttons and inputs, 16px screen frames and tickets. Nothing else rounded.
  A ticket gets a sawtooth bottom edge via CSS mask. It is the one decorative shape on
  the site because it means something (orders print in the kitchen).
- Shadow: only under elevated screens and tickets:
  `0 1px 2px rgba(23,53,42,.06), 0 16px 40px -16px rgba(23,53,42,.22)`.
  Plain content never gets a shadow or a border box.
- Grid: 12 columns desktop. Text columns take 6 or 7 of them, never all 12.

## 6. Section patterns, in order

Every section answers one question the owner has. Section content lives in
`src/lib/copy.ts`. Sections are server components. Native `<details>` for FAQ and the
mobile menu stays.

1. **Hero.** Question: what is this. A plain headline, one sentence under it, one
   saffron button, one text link that jumps to the proof. On desktop the right 5
   columns hold the proof tickets (section 3) or, once rights clear, a phone frame
   with the live restaurant site. On mobile the tickets stack under the button.
   Headline direction: "Google can't see most restaurant menus. It can see yours."
   No stat in the hero.
2. **The problem, plainly.** Three short sentences in a single text column. Not cards.
   Tell the owner what a marketplace costs them and why their current site is
   invisible, in words a five-year-old gets.
3. **What Google sees (the proof module, the centerpiece).** Two kitchen tickets
   side by side. Left ticket, headed "A typical restaurant site", prints a single line
   in `tomato`: "0 menu items Google can read." Right ticket, headed "The same
   restaurant on Wuntab", prints a scrolling list of real dish names with a count of
   220. Small footnote under both: measured date, same restaurant, both platforms
   live at once. No competitor name. No live-site link until rights clear.
4. **How it works.** A true sequence, so numbers 1, 2, 3 are earned. One row each,
   text left, a product screenshot or framed detail right. We build the site, orders
   print in your kitchen, you keep the money.
5. **What you get.** A two-column checklist with short plain lines. Not six identical
   cards. Group under two headings: "Getting found" and "Taking orders."
6. **The money.** One panel on `ticket` stock. The fee in the stat size, the rule in
   one sentence, who pays it in one sentence, the button. See section 8 for what is
   allowed here.
7. **What we don't promise.** A small, quiet text block. We can't guarantee the top
   spot on Google. We can make sure Google can read every dish. That is what we promise.
   This section is brand. Keep it.
8. **FAQ.** Native `<details>`. Five to seven questions in the owner's words.
9. **Final CTA band.** Dark `ink` background, one headline, one saffron button, the
   email address as plain text under it.
10. **Footer.** Lockup, email, Terms, Privacy, © Wuntab. Nothing else.

## 7. The call to action

One action on the whole site: book a call. Same label everywhere, in the header,
hero, pricing, and final band. Label: **"Book a call"** (fallback "Talk to us").
The href is `demoHref` from `src/lib/site.ts`, driven by `NEXT_PUBLIC_DEMO_HREF`
(Marawan will point it at his scheduling link) with a mailto fallback. The header
button is visible on mobile too, not hidden behind the menu. No forms, no API routes,
no chat widgets, no exit popups, no sticky bars.

Button spec: saffron fill, ink text, 8px radius, 16px vertical and 24px horizontal
padding, weight 500, hover darkens saffron 8%, focus ring 2px `ink` offset 2px.
Secondary action is a plain underlined text link in `ink`, never a ghost button.

## 8. Numbers, claims, and pricing

Only these numbers may appear on the site. Never invent another.

| Allowed                                                      | How to say it                                   |
|--------------------------------------------------------------|-------------------------------------------------|
| 220 menu items Google can read on our live restaurant, vs 0  | "220 dishes Google can read. The other site: 0."|
| 3 taps and 2 fields from menu to payment                     | "Three taps and two boxes to pay."              |
| $0 service fees added for diners                             | "No service fee on the diner's bill."           |
| 15% default tip with "None" always visible                   | "Tip starts at 15%. No tip is always an option."|
| Marketplaces often take 20 to 30% of an order (from the brief) | Category claim with "often" or "up to". Never a named company. Confirm with Marawan before publish. |
| One live restaurant in Orlando, measured head-to-head        | "Measured on a real restaurant in Orlando."     |

**Pricing:** Marawan's current brief says the fee is **5% on each online order**. This
replaces the earlier "flat monthly, no commission" direction from HANDOFF.md.
Do not write "commission-free" anywhere. Open question to resolve before the pricing
panel goes live: the brief says the 5% is "charged to customer" and also says diners
pay $0 service fees. Those cannot both be on the page. Ask Marawan who pays the 5%
(the restaurant or the diner) and write exactly that. Until answered, the pricing
panel says "5% per online order" and the who-pays sentence is a TODO in `copy.ts`.

Never: a monthly dollar amount, customer counts, testimonials, quotes, logos of
restaurants, "trusted by", "#1", ranking promises, "guaranteed", star ratings,
review schema, countdowns, or "only N spots left".

## 9. Motion

One orchestrated moment on the page: when the proof module scrolls into view, the
right-hand ticket prints its lines top to bottom once and the 220 counts up as the
lines print. That is the only scroll-triggered animation. It runs in a small
`"use client"` island wrapped around the tickets; everything else stays a server
component. Respect `prefers-reduced-motion` by rendering the finished state.

Allowed elsewhere: 150ms color transitions on hover and focus, and `<details>` open
state. Not allowed: fade-and-slide-up entrances on sections, hover lifts on cards,
parallax, marquees, typewriter headlines, particle backgrounds, cursor effects.

## 10. Images

- Product screenshots are the priority asset. Real phone screenshots of the live
  restaurant site (menu, dish page, checkout, the Clover ticket) go in `public/shots/`
  as WebP with explicit width and height, inside a 16px-radius frame on `ticket`
  stock. Rendered with `next/image`.
- Until Marawan drops the Orlando screenshots, the proof tickets are typographic and
  built from real dish names he supplies. Do not fake a screenshot.
- No restaurant photos, menu scans, or live-site links until the owner's written OK.
- No stock food photos. The JPGs in `public/demo/` are from the old site and must not
  appear on the page.
- Icons: none, unless a check mark in a checklist. No icon grids.
- Logo: keep the current mark until official SVGs arrive, then swap files exactly.

## 11. Copy rules

- Reading level around 8th grade. If a five-year-old wouldn't get the sentence,
  rewrite it. Short words: money, orders, kitchen, Google, menu, phone.
- No technical words on the page: not "server-rendered", "SSR", "structured data",
  "SEO", "crawler", "JavaScript", "merchant of record", "POS injection", "SPA",
  "HTML". Say what it means: "Google can read every dish", "orders print in your
  kitchen", "the money goes to your bank account".
- Say "you" and "your restaurant". Say "we" for Wuntab. Never "our platform".
- Sentence case. No exclamation marks. No em dashes. No "revolutionary",
  "game-changing", "seamless", "unlock", "supercharge", "empower", "leverage".
- Buttons say what happens: "Book a call", not "Get started".
- Every claim is something we can show on a screen. If we can't show it, cut it.
- Competitor names never appear, including in alt text, comments, JSON-LD, and
  metadata. "Sabal" never appears in anything that renders. Claude and ChatGPT may be
  named in the AI-readability line. Clover may be named.
- Mirror any copy change into `COPY.md` so Marawan can review without reading code.

## 12. Quality floor before a preview goes up

- `npm run honesty && npm run copy-lint && npm run boundary-check && npm run lint`
- `npm run test` (Playwright, port 3002 must be free)
- `node scripts/lighthouse.mjs http://127.0.0.1:3002 <outdir>` at 390 and 1440.
  Targets: 95+ performance mobile, 100 accessibility, 100 best practices, 100 SEO.
- Screenshot every section at 390 and 1440 and look at them before reporting.
  Ask of each one: would a human designer have made this choice for a restaurant
  owner, or is it the default?
- Keyboard: every link and button has a visible focus ring. `<details>` works with
  Enter and Space.
- Static export only. No API routes, no forms, no database, no secrets, no imports
  from the product repo.

## 13. Do / Don't

Do
- One idea per section, one action on the site.
- White page, green ink, saffron button, ticket stock for proof and screens.
- Big honest headline that a person would say out loud.
- Real screenshots in frames as soon as they exist.
- The proof tickets as the memorable thing. Keep everything else quiet.
- Numbered steps only where the content is a sequence.
- Leave white space. If a section feels empty, the copy is doing its job.

Don't
- Cream page, terracotta or brick accents, gradients, tinted blacks.
- Grids of identical rounded cards with the same border and shadow.
- All-caps eyebrow labels, middle-dot meta strings, arrows appended to links.
- Stat hero with a small label under a big number.
- Fade-up on every section, hover lift on every card.
- Stock photos, icon grids, illustrations of people, emoji.
- Testimonials, logos, "trusted by", star ratings, countdowns, popups.
- Jargon. Competitor names. "Sabal". "Commission-free". Invented numbers.
- Monthly prices or a "coming soon" price slot.
