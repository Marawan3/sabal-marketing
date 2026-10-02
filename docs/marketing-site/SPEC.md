# WunTab.com redesign: spec

## 0. How to use this spec

- This spec is the **target**. It is not an inventory of what exists. Every capability listed as "approved" is approved to market **once the capability register proves it live** (section 3). Nothing gets a page, a nav link or a homepage mention because it appears here.
- If this spec and the platform code disagree, the code wins and the page says less. Report the conflict instead of writing around it.
- Items marked **[OWNER]** are decisions for the owner. Report what the code tells you and recommend, but don't resolve them yourself.
- This file changes only with owner approval. Findings go in `REGISTER.md` and PR descriptions, not here.

---

## 1. What WunTab is

WunTab is a restaurant technology platform. It helps restaurants get more direct orders, create more repeat customers, and run their digital business from one connected platform.

**Primary positioning:** "More direct orders. More repeat customers. One platform."

**Supporting line:** "WunTab brings your website, online ordering, delivery, catering, guest experience, marketing and restaurant operations together in one platform."

**Acceptable alternative:** "Everything your restaurant needs to sell, serve, and grow."

The exact wording can be refined. The strategy is fixed: **WunTab is the platform. Online ordering is the core commerce engine.** Everything else expands how restaurants win customers, fulfill orders, build relationships and run the business.

WunTab is **not** positioned as an ordering widget, a website builder, an SEO product, a Google menu-indexing tool, or a feedback product. Those are parts of the platform.

### The story every page serves

| Stage | What happens | Products |
|---|---|---|
| **Discover** | A customer finds the restaurant | Websites, SEO, listings, marketing |
| **Order** | They order directly from the restaurant | Online ordering, delivery, catering, table ordering, kiosk, mobile app |
| **Fulfill** | The restaurant runs the order | Menu, payments, order management, kitchen display, delivery dispatch |
| **Understand** | The restaurant sees what's working | Analytics |
| **Build the relationship** | The restaurant learns about the guest | Feedback, reviews, customer database, loyalty |
| **Bring them back** | The guest orders again | Loyalty, email, SMS, automated campaigns, push |

That lifecycle is what WunTab is. The homepage and `/how-it-works` must make it obvious. Every product page links to the stages before and after it.

---

## 2. Truth rules (every page, every PR)

These override anything else in this spec.

1. **No unproven capability.** A feature appears only if its register row is Live or Partial (section 3). Partial means the page describes only the live part.
2. **Coming Soon is allowed for POS integrations only**, unless the owner adds to that list in writing.
3. **No invented numbers.** No metrics, percentages, customer counts, revenue uplift or time saved unless sourced from real data the owner has approved for publication.
4. **No invented proof.** Testimonials, logos, case studies and storefront examples must be real and approved by the owner per restaurant. No placeholder quotes, no "Trusted by" strip with nothing behind it.
5. **No guarantees.** Never promise search ranking, indexing, Google position, traffic, or AI citations.
6. **Google and JavaScript.** Never claim Google can't execute JavaScript. Explain the real architectural benefit: menus and pages served as crawlable HTML with structured data, so they don't depend on rendering to be understood.
7. **Payments.** Never imply WunTab is the payment processor unless that is technically and legally true. Name or describe the processing partner as the register states.
8. **Reviews.** No review gating. Review requests go to all customers on equal terms. A private rating never decides who gets asked for a public review.
9. **Analytics.** Name only metrics the platform actually computes (register lists them).
10. **AI.** AI is a WunTab capability, never the company identity. Not every feature is an AI feature.
11. **Delivery.** Sell the restaurant outcome. Never present the internal delivery API as a developer product.
12. **Empty means absent.** Nothing renders a container before it has contents. A section with no live products, no proof or no pricing does not render.

---

## 3. Capability register

The register lives in `docs/marketing-site/REGISTER.md`. It has one row per capability:

| Column | Meaning |
|---|---|
| Pillar | Sell / Grow / Operate / Scale |
| Capability | Individual capability, not product (e.g. "pay at table", not "table ordering") |
| Route | Marketing page it would appear on |
| Status | **Live**, **Partial**, **Coming** (POS only), **Not built**, **Unknown** |
| Proof | file:line in platform code that does the work |
| Notes | For Partial: exactly what is live |

**Proof means the code that does the work.** A UI label, feature flag, route name, settings toggle or database column alone is not proof.

**Publishing rules:**

- **Live:** may be marketed.
- **Partial:** may be marketed for the live part only.
- **Coming:** may appear only with a Coming Soon label (POS integrations only).
- **Not built / Unknown:** no page, no nav link, no homepage mention, no footer link, no sitemap entry, no structured data.

A product page ships only when its core capability is Live. A nav group with no live items doesn't render.

---

## 4. Product pillars and pages

Every product page follows the template in section 5. Below are each page's direction, approved capabilities (subject to the register), and page-specific guardrails.

### SELL

**Online Ordering**, `/online-ordering` (flagship)
- Direction: direct ordering through the restaurant's own branded experience. The restaurant stays the primary brand throughout. Never positioned as a marketplace.
- Capabilities: pickup, delivery, scheduled orders, online menu, modifiers and add-ons, promo codes, tips, smart upsells, customer accounts, order tracking, automatic order notifications, favorites, reordering.

**Online Menu**, `/online-menu` (secondary)
- Direction: the menu is the customer-facing storefront.
- Show: categories, items, photos, modifiers, add-ons, prices, availability, connection to ordering.

**Delivery**, `/delivery` (major page)
- Direction: "Delivery without building a delivery fleet." or "Your customers order from you. WunTab handles the driver."
- Flow to visualize: customer orders directly → WunTab receives the order → restaurant prepares it → WunTab requests a third-party driver → driver picks up → customer receives it.
- Capabilities: delivery ordering, third-party driver integration, automated dispatch, delivery tracking, delivery zones, delivery fees.
- Guardrail: name the driver provider only if the owner approves **[OWNER]**.

**Catering**, `/catering`
- Direction: direct large and group ordering, dramatically easier than phone and email coordination.
- Capabilities: catering menu, advance ordering, scheduling, lead times, order minimums, catering delivery via third-party drivers where appropriate.

**Table Ordering**, `/table-ordering`
- Capabilities: QR dine-in ordering, pay at table.

**Self-Service Kiosk**, `/kiosk`
- Direction: restaurant-controlled in-store ordering.

**Branded Mobile App**, `/restaurant-app`
- Direction: the restaurant's own iOS and Android ordering app.
- Capabilities: push notifications.
- Guardrail: Live requires a shipped app in the stores, not a wrapper plan.

**Gift Cards**, `/gift-cards` (secondary)
- Digital restaurant gift cards.

**Smart Upsells**, `/upsells` (secondary, SEO page, not in the mega-menu)

### GROW

**Restaurant Websites**, `/restaurant-websites`
- Direction: the website is the restaurant's digital storefront.
- Capabilities: custom branding, custom domain, integrated menu, direct ordering, search-friendly architecture.
- Show real WunTab-powered sites (owner-approved).

**Restaurant SEO**, `/restaurant-seo`
- The current Google and menu discoverability messaging lives here, not on the homepage.
- Capabilities: crawlable restaurant and menu architecture, structured data, local SEO, location discovery, cuisine, dish and location pages where legitimate, menu discoverability, listings.
- Guardrails: truth rules 5 and 6 apply with full force.

**Menu SEO Scanner**, `/menu-check` (secondary, acquisition tool)
- Keep "See What Google Sees" as a lead-generation funnel into Restaurant SEO and the wider platform. It is not WunTab's primary positioning.

**Restaurant Listings**, `/listings` (secondary)
- Listing consistency and visibility.

**Guest Feedback**, `/guest-feedback`
- Former Sabal Signal capabilities, native to WunTab. No separate Sabal Signal brand experience.
- Loop to visualize: guest → QR/NFC → feedback → restaurant receives insight → manager acts → guest experience improves.
- Capabilities: QR feedback, NFC feedback, SMS-supported experiences where applicable, first-party feedback, manager alerts, follow-up, surveys, satisfaction dashboard, feedback analytics, multi-location visibility.

**Reviews**, `/reviews`
- Capabilities: Google review requests, review monitoring.
- Guardrail: truth rule 8.

**Loyalty & Rewards**, `/loyalty`
- Direction: more repeat visits and orders.
- Connects to: customer accounts, favorites, reorder, order history, rewards, marketing.

**Customer Database**, `/customers` (secondary)
- Direction: know your direct customers and their relationship with the restaurant.
- Guardrail: never called a CRM (cut).

**Customer Marketing**, `/restaurant-marketing`
- Capabilities: email, SMS, automated campaigns, segments, win-back, reorder, birthday, abandoned-order campaigns. Each campaign type is its own register row.
- Secondary SEO pages: `/email-marketing`, `/sms-marketing`. Not separate mega-menu links.

### OPERATE

**Menu Management**, `/menu-management`
- Capabilities: categories, items, pricing, photos, modifiers, add-ons, availability, sold-out controls.
- Story: one menu, managed centrally, powers every customer ordering surface that is live.

**Order Management**, `/order-management`
- Capabilities: incoming, in-progress, ready and completed orders; restaurant hours; pause online ordering; prep-time controls; order printing.
- This page proves WunTab continues after checkout. Real UI required.

**Kitchen Display**, `/kitchen-display`
- Show how orders move through preparation. Related: order printing.

**Payments**, `/payments`
- Show customer checkout and the restaurant's payment flow. Capabilities: payment integrations, tips.
- Guardrail: truth rule 7.

**Analytics**, `/analytics`
- Candidates: sales, order volume, average ticket, ordering trends, menu performance, popular items, sales mix, customer analytics, new vs repeat behavior, feedback analytics, guest sentiment.
- Guardrail: the page names only metrics listed as Live in the register (truth rule 9).

**Reservations**, `/reservations`
- Capabilities: direct reservations, digital waitlist.

**WunTab AI**, `/ai`
- Capabilities: operator AI assistant, AI menu optimization, recommendations from menu and order data where implemented.
- Guardrail: truth rule 10.

### SCALE

**Multi-Location**, `/multi-location`
- Manage multiple locations.

**Restaurant Groups & Franchises**, `/enterprise`
- Organization and franchise-level controls. Use the customer-facing label "Restaurant Groups & Franchises", not "Franchise Management".

**Integrations**, `/integrations`
- Live categories: payment, delivery. POS integrations shown as Coming Soon only (truth rule 2).

**Partners / White Label**, `/partners`
- White label is approved. Lives in Company or footer navigation, not the Product mega-menu.

---

## 5. Product page template

Every product page has these sections, in this order. A section with nothing true to say doesn't render.

1. **Hero:** short outcome headline, one supporting sentence, Get Started, and a real product screen.
2. **How it works:** three to five steps, ideally as a visual flow using real UI.
3. **Capabilities:** Live and Partial register rows only, written as outcomes.
4. **Where it fits:** links to the lifecycle stages before and after this product (section 1).
5. **Proof:** real, owner-approved storefront, screenshot or testimonial. Omitted if none.
6. **FAQ:** real questions, true answers. Becomes FAQPage structured data only if visible on the page.
7. **Final CTA.**

---

## 6. Navigation

**Desktop:** Product · Solutions · Pricing · Resources · Company. Right side: Log in · Get Started.

**Product mega-menu**, four groups (items hidden until Live):

- **Sell:** Online Ordering, Delivery, Catering, Table Ordering, Self-Service Kiosk, Branded Mobile App
- **Grow:** Restaurant Websites, Restaurant SEO, Guest Feedback, Reviews, Loyalty & Rewards, Customer Marketing
- **Operate:** Menu Management, Order Management, Kitchen Display, Payments, Analytics, Reservations, WunTab AI
- **Scale:** Multi-Location, Restaurant Groups & Franchises, Integrations

The menu communicates the platform's shape. It does not list every capability. Secondary pages (Online Menu, Gift Cards, Smart Upsells, Restaurant Listings, Customer Database, Email Marketing, SMS Marketing, Menu SEO Scanner) are reached from parent pages, contextual links, search and the footer.

**Mobile:** the mega-menu becomes an accordion by pillar. Get Started stays visible without opening the menu.

**Footer:** all live product pages including secondary ones, Solutions, Company (About, Partners, Blog, Contact), Legal (Privacy, Terms).

---

## 7. Solutions

Pages: Independent Restaurants, Multi-Location Restaurants, Restaurant Groups & Franchises, Quick-Service Restaurants, Full-Service Restaurants.

Each solutions page explains which live products matter for that business type and why, and links to them. It makes no claim that isn't backed by a product page.

Catering appears as a product, not a solution **[OWNER]**: a Catering solution page would compete with `/catering` for the same searches. If the owner wants it, it must target caterers as a business type and link to `/catering` as the product.

---

## 8. Homepage

The homepage sells the complete platform. It does not lead with Google or menu SEO.

**Hero:** "More direct orders. More repeat customers. One platform." Supporting line from section 1. Primary CTA: **Get Started**. Secondary CTA: **See How It Works**, which goes to `/how-it-works`. The hero visual connects real UI: restaurant website → ordering → restaurant dashboard → kitchen and order operations. A visitor should understand within seconds that this is substantial restaurant software.

**Sections, in order.** A section renders only if it has live products behind it.

1. **Sell directly:** "Give customers more ways to order from you." Online ordering, delivery, catering, table ordering, kiosk, mobile app.
2. **Website and discovery:** "Turn searches into orders." Websites, SEO, online menu, listings. Contextual CTA: "See What Google Sees", which goes to `/menu-check`.
3. **Delivery:** "Delivery without building a fleet." Flow: direct order → WunTab → restaurant → third-party driver → customer.
4. **Catering:** "Turn big orders into easy orders." Real catering experience.
5. **Guest experience:** "Know what your guests think." Guest → QR/NFC → feedback → manager alert → follow-up, connecting to feedback → reviews → loyalty → repeat customer.
6. **Customer growth:** "Turn customers into regulars." Customer database, loyalty, email, SMS, automated campaigns, push.
7. **Operations:** "Everything after Place Order." Menu management, order management, kitchen display, payments, prep times, availability. Real admin UI.
8. **Analytics:** "Know what's working." Live metrics only.
9. **Scale:** "One restaurant or fifty." Locations and groups.
10. **Integrations:** live integrations; POS as Coming Soon.
11. **Pricing:** actual current model (section 10).
12. **Customer proof:** real only (truth rule 4).
13. **FAQ**
14. **Final CTA:** "Take control of your restaurant's direct business." Get Started.

---

## 9. How it works

`/how-it-works` is the lifecycle page: Discover → Order → Fulfill → Understand → Build the relationship → Bring them back. Each stage gets one short paragraph and one real screen, and links to its product pages. It is the homepage's secondary CTA destination and the page to send to anyone who asks "what is WunTab?"

---

## 10. Pricing

`/pricing` and the homepage pricing section use WunTab's actual current pricing model. The source of truth must be identified in the register **[OWNER]**. No invented fees, tiers or discounts. If there's no confirmed source, both stay unpublished until the owner provides one.

---

## 11. Cut: never build or market

Restaurant Website Grader (no `/grader`), Developer API or Developer Platform, Webhooks, WunTab POS, Inventory, Labor or Employee Scheduling, Restaurant CRM.

Don't reintroduce these under other names: no "customer relationship management", no "website score", no "developer access", no "point of sale" as a WunTab product. POS **integrations** are not cut; they are Coming.

---

## 12. Design direction

- WunTab should feel like a serious, modern restaurant technology platform. **The product is the visual identity.**
- Prioritize: real WunTab UI, real storefronts, customer ordering screens, dashboard screens, kitchen and order workflows, mobile app screens, product animations where they explain something, strong typography, generous whitespace, clear product storytelling, restaurant photography where it adds credibility.
- Avoid generic SaaS illustrations and drawn mockups made to look like WunTab UI.
- Learn from strong restaurant SaaS information architecture and funnels. Don't clone Owner.com or anyone else; the visual system is original.
- Screenshots use real UI with demo or owner-approved data. Real restaurants appear only with the owner's sign-off per restaurant.

---

## 13. Copy rules

- Write for restaurant owners in plain business language.
  - Good: "Take delivery orders directly." Bad: "Omnichannel last-mile fulfillment orchestration."
  - Good: "Know what your guests think." Bad: "Aggregate omnichannel sentiment intelligence."
- Short headlines. Outcomes first. No buzzwords.
- Every factual claim traces to a register row (section 15).

---

## 14. SEO and migration

- Every current URL keeps working or gets a 301 to its closest new page. No URL is dropped without a redirect.
- Pages with existing search traffic are identified before anything moves, and their best-performing content is preserved on the destination page.
- Sabal Signal domains and pages redirect to `/guest-feedback` (or the closest live page).
- Each page has a unique title, meta description and canonical. Structured data only describes things that are true and visible on the page.
- The sitemap contains only published pages.

---

## 15. Build and evidence rules

**Phasing.** Phase 1: navigation, footer, homepage, `/how-it-works`, and whichever of these are Live: Online Ordering, Delivery, Catering, Restaurant Websites, Restaurant SEO, Menu SEO Scanner, Order Management. Later phases ship in batches of related pages, one PR per batch.

**Every PR includes:**
- Screenshots of every changed page at 390 and 1440.
- A **claims table**: every factual claim on the page, next to the register row that backs it. A claim with no row is removed, not softened.
- Title, meta and canonical for each page; structured data diff.
- No layout shift from images; contrast sampled from composited pixels.
- Redirects added or changed, each tested.
- Confirmation that nothing renders an empty container.

**Scope.** The marketing site only. Platform code is read-only for this workstream; if a capability needs a platform change to be true, report it, don't make it.

---

## 16. Open owner decisions

| Decision | Default until decided |
|---|---|
| Name the delivery driver provider? | Say "third-party drivers" |
| Name the payment processor? | Describe as "payment partner"; never imply WunTab processes |
| Pricing source of truth | Pricing unpublished |
| Which real restaurants may appear | None |
| Get Started destination: self-serve signup or demo request | Whatever works end to end today, per the register |
| Catering as a solutions page | Not built |
| Additional Coming Soon items beyond POS | None |
