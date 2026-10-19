# Draft copy — not approved

Marawan signs off before production. Source of truth in code: `src/lib/copy.ts` (homepage and shared copy) and `src/lib/catalog.ts` (product pages). Voice and number rules: `.claude/skills/wuntab-design/SKILL.md` §8 and §11.

This file mirrors the homepage as rebuilt in the design pass of 2026-10-07. Every line restates something already in the catalog, the FAQ or the service fee clause in `/terms`. Nothing new is claimed.

## a. Hero

**Trust line (2026-10-13), over the headline, after a saffron dot:** $0 for the restaurant · No lock-in · Your customers, your data
- *$0 for the restaurant:* the service fee clause in /terms ("Wuntab is free to the restaurant").
- *No lock-in:* /terms 4.2 ("You may end this agreement at any time, for any reason or none"). The owner chose "No lock-in" over "No contract" (PR #29), since /terms is itself an agreement.
- *Your customers, your data:* /terms 1.2 ("What is yours: ... your customer list. Those stay yours throughout and you can take them with you").

**Headline:** More direct orders. More repeat customers. One platform.

**Line:** Your website, online ordering, delivery, and marketing, built and run for you.

**Input:** Your restaurant's name · **Button:** Get Started (opens Book a call with the name filled in)

**Small card under the name field (2026-10-13):** **$0/month for the restaurant.** Customers pay 5% at checkout. *(The same terms as the service fee clause; the full pricing section stays lower down.)*

**Visual:** a live phone drawn in HTML and CSS (2026-10-13). On the demo restaurant's storefront, a diner opens Spiced Lamb Meatballs ($12.00), picks spice level Hot, adds it, checks out (subtotal $12.00, Service fee (5%) $0.60, tax $0.78, tip $2.40) and pays $15.78, and sees the confirmation with a ready time 20 minutes after the visitor's own clock. On desktop the order then lands as ticket #1930 in the New column of the kitchen display beside the phone. On phones there is no kitchen display in the hero (2026-10-19): the phone holds on the confirmation for about 2.5 seconds and starts again; the kitchen band just below shows the display. Every string on the screens is the storefront's or the kitchen display's own, except the "Service fee (5%)" line: the owner added it on 2026-10-13 to match /pricing and /terms, and the live checkout doesn't show it yet; every dish and price is the demo menu's (`src/lib/demo-order.ts`). About 14 seconds on desktop and 12 on phones, then it loops.

**Screen readers hear:** An animation: on a phone, a diner orders Spiced Lamb Meatballs, spice level Hot, from Palm&Stone Kitchen, our demo restaurant, and the order arrives as a new ticket on the kitchen display.

**Button:** Pause the animation / Play the animation

## b. What changes when orders come to you.

Tabs, at most two lines each, each with one built visual (2026-10-13):

- **More direct orders:** Customers order on your own website, under your name. · Pickup, delivery, catering requests, and orders for later. · *Visual: the storefront phone.*
- **More repeat customers:** Every direct order adds a real customer to your list. · Loyalty, texts, and automatic campaigns bring them back. · *Visual: the dashboard card, captioned "Demo restaurant".*
- **Less busywork:** Every order in one place, from new to done. · Pause ordering or raise prep times in one tap. · *Visual: the kitchen board.*

The two lines that left the tabs are in the FAQ: "Search engines can read every dish and price" as **Can search engines read my menu?**, and "Orders go into your POS, or to a kitchen printer" was already **Does it work with my POS?**

## Kitchen band (navy)

**Every order on one screen in your kitchen.** Orders show up in the order they came in, and your team moves each one from new to ready. · *Visual: the kitchen board.*

## c. Everything you need to sell direct.

Four rows, each the product's name (the link) and its page's headline, with the product's visual from 768px. The "More about …" links went on 2026-10-13 to make room for the calculator; the name is the link now.

- **Online Ordering:** Take orders on your own website, under your own name. · *storefront phone*
- **Delivery:** Delivery without building a delivery fleet. · *delivery phone*
- **Catering:** Take catering requests on your own website. · *catering phone*
- **Order Management:** Every order, from new to done. · *orders dashboard*

## Savings calculator (2026-10-13), on warm, between the products and how it works

**What commission would you keep?**

- **Delivery-app orders per week** · **Average order value** (both empty: no averages are filled in for the owner)
- **Estimated commission kept each year:** Between $X and $Y (orders × average order × 52 weeks × 15%, and × 30%). Before both numbers are in: "Enter both numbers to see the range."
- Under it: Third-party apps charge 15–30% commission; we charge the restaurant $0.

Source for 15–30% (kept here, never named on the site): the largest delivery app's own US merchant pricing page lists 15%, 25% and 30% commission on delivery orders for its Basic, Plus and Premier plans (merchants.doordash.com/en-us/products/pricing, read 2026-10-13). Uber Eats' plans now run 20–30% (Restaurant Dive, "Uber Eats increases marketplace fees"). Pickup orders on the apps cost less (about 6–10%), so the range describes delivery orders, which is what the first box asks for.

## d. How it works

1. **We build your site.** Your website and menu, built and loaded by us.
2. **We connect your kitchen.** Orders go into your POS, or to a kitchen printer.
3. **You say yes.** You look it over, then customers start ordering.

Link: See how it works

## e. What it costs you

**$0** · WunTab is free for the restaurant.

- No monthly charge, no setup fee, no commission.
- Customers pay a 5% service fee, shown at checkout before they pay.

Get Started · See pricing. *Visual beside the $0: the receipt for the hero's order (subtotal $12.00, Service fee (5%) $0.60, tax $0.78, tip $2.40, total $15.78).*

`/pricing`: the same card and receipt. The full clause, word for word, is the first question in its FAQ (**What exactly are the terms?**), and the old closing line is **What about delivery, catering, or several locations?** → "Questions about delivery, catering, or several locations? Talk to us and we will walk through it."

## f. What we believe

**[OWNER TO WRITE]**: three beliefs, each a bold line plus up to two short paragraphs, in `src/lib/beliefs.ts`. The section renders nothing until all three are written.

## Customer stories

Built but empty: `src/lib/stories.ts`. Each entry is a real restaurant, a real result and the owner's name; no photos since 2026-10-13. The row renders nothing while the list is empty.

## g. Questions owners ask, then the final call to action

FAQ (`copy.faq` in `src/lib/copy.ts`), with one question added on 2026-10-13: **Can search engines read my menu?** Yes. Every dish and price is in the page itself, so search engines can read them. Nobody can promise rankings, and we don't.

Since the upgrade of 2026-10-13 the homepage leaves out four questions the page already answers: **Is there a monthly fee or a contract?** and **Do my customers see the 5%?** (the trust line and the $0 card), **Does it work with my POS?** and **Do I have to set anything up myself?** (the how-it-works steps). The solution pages still ask them.

**Final band (every page but /contact), 2026-10-13:** **Take control of your restaurant's direct business.** · Get Started · *under the button:* 20-minute call. We show WunTab on your own menu. No pressure. · Or send a message (→ /contact). The line that used to sit above the button ("A short call. We will show you WunTab on your own menu.") and the homepage's "or email hello@wuntab.com" went: the new line says the same, and the email is on /contact, /about and in the footer.

## Moved off the homepage

The six-step lifecycle, integrations and multi-location are on `/how-it-works`.

## /how-it-works (2026-10-13)

One built visual per stage: Discover, the search result · Order, the storefront phone · Fulfill, the kitchen board · Understand, the dashboard card · Build the relationship, the delivery phone · Bring them back, the catering phone.

The integrations list is now one question under the same heading, **Works with what you already use.**: **What does WunTab work with?** Payment integrations and third-party delivery. WunTab connects to your POS. If your POS isn't compatible, orders go to a kitchen printer.

The multi-location diagram stacks its three locations on phones.

## Product pages (2026-10-13, before the template above)

Each page: the headline, its one line, Get Started and See pricing, and one visual:

- /online-ordering: the hero phone
- /delivery: the delivery phone
- /catering: the catering phone
- /restaurant-websites: the storefront phone
- /restaurant-seo: the search result, captioned "Illustration. We don't promise rankings."
- /order-management: the kitchen board

/delivery adds **How a delivery order moves** with the line "You keep the customer. The driver just drives." and the six steps as the flow diagram.

Then **Works with** as one row of links, then the FAQ. The FAQ now also asks:

- **What's included?** (or **What do you build in?** on /restaurant-seo), answered with the old "What's included" list.
- The steps as a question, answered with the old numbered steps:
  - **How does an online order work?**
  - **How does a catering order work?**
  - **How do you build my website?**
  - **What goes into the page?**
  - **How does an order move through the kitchen?**
- /online-ordering: **Whose name do customers see?** Yours. Your restaurant is the brand from the first tap to the thank-you screen. WunTab stays in the background. This was the page's note.

/restaurant-seo's two notes were already its two FAQ answers, so they are no longer shown twice.

## Footer (2026-10-13)

Four columns: **Product** (every product page, then How it works and Pricing), **Solutions** (the four solution pages), **Company** (About, Contact), **Legal** (Terms, Privacy). Under them: the logo and © year, then hello@wuntab.com and **Or send a message**. The blurb under the logo went: it repeated the hero's line.

## Navigation (2026-10-13)

Product (the mega-menu, now with Integrations under Scale) · Solutions (Independent Restaurants, Quick-Service Restaurants, Full-Service Restaurants, Multi-Location Restaurants, each with its one line) · How it works · Pricing · Company (About, Contact). Get Started still books a call.

## Product page template (2026-10-13)

Every product page, in this order: hero with its visual → **How it works** (the steps, one built visual) → **What's included** (two columns, on warm) → proof slot (renders nothing until `src/lib/stories.ts` has a real customer tagged for the page) → **Works with** → FAQ → final band.

- How it works visuals: /online-ordering, /catering, /restaurant-websites, /restaurant-seo and /integrations get a step diagram (one icon and a one-word label per step, over the catalog's own steps); /delivery keeps its flow diagram; /order-management keeps the kitchen board, with its five steps listed over it.
- The FAQs no longer carry "What's included?" and the steps: both are on the page.
- /restaurant-seo's steps are now titled **How your menu goes into the page** (was "What we build in", which is also its included-list heading).

## /integrations (new, 2026-10-13)

- **Works with what you already use.** Payments, third-party delivery, and your POS, connected.
- **How an order reaches your kitchen** (the one visual: an order flowing from the storefront to the kitchen): 1. Customer orders on your website. 2. The payment goes into your own payment account. 3. WunTab receives the order. 4. It goes to your POS where supported, or a kitchen printer. The hero has no visual of its own, so the steps don't show twice.
- **What's included:** **Payments:** live. Customers pay at checkout, into your own payment account. · **Delivery:** live. A third-party driver is requested for every delivery order. · **POS:** connects to your POS where supported; if not, a kitchen printer.
- FAQ: **Does it work with my POS?** WunTab connects to your POS where supported. If not, orders go to a kitchen printer. · **Who handles delivery?** WunTab requests third-party delivery for each delivery order. The driver picks up from you and delivers to the customer. · **Who gets the money?** You do. Every restaurant has its own payment account and is the merchant of record.
- No logos and no company names.

## Solution pages (new, 2026-10-13)

Each: headline, line, Get Started, one existing visual → **How it works** (the homepage's three steps) → **What's included** (four product pages, each with its mega-menu line) → proof slot → **Works with** (Integrations, Payments, Delivery) → three questions from the homepage FAQ → final band. Headlines and lines are the earlier solution copy, trimmed to what the four pages show.

- **/solutions/independent-restaurants:** Everything a single restaurant needs to sell direct. · Website, ordering, and delivery in one place, set up for you. · Restaurant Websites, Online Ordering, Delivery, Order Management · *storefront phone*
- **/solutions/quick-service:** Fast orders, straight to the kitchen. · Online ordering on your own website, with every order going to your kitchen. · Online Ordering, Order Management, Delivery, Integrations · *orders dashboard*
- **/solutions/full-service:** Direct orders and catering, on your own website. · Online ordering and delivery from your own website, and catering requests for the big bookings. · Online Ordering, Catering, Delivery, Restaurant Websites · *catering phone*
- **/solutions/multi-location:** Every location on one platform. · Run every location from one account, with menus, orders, and feedback per location. · Online Ordering, Order Management, Restaurant Websites, Restaurant SEO · *the organization diagram*

Removed from the catalog with this change: the "Catering Businesses" solution (it promised a catering menu, lead times and minimums the product doesn't have) and "Restaurant Groups & Franchises" (no page).

## /about (new, 2026-10-13; the redirect to / is gone)

- **About WunTab.** We build and run restaurant websites, online ordering, delivery, and marketing, so orders come to you.
- **What we believe:** renders nothing until you write all three in `src/lib/beliefs.ts`. (It moved here from the homepage, where it also rendered nothing.)
- **Who WunTab is for.** Every restaurant is set up by hand. We build the site, load your menu, and connect your kitchen. · the four solution pages, each with its line.
- **Reach us:** hello@wuntab.com · Or send a message

## /contact (new, 2026-10-13)

- **Send us a message.** Tell us about your restaurant. We reply within one business day. · hello@wuntab.com · Rather talk? Book a 20-minute call.
- Form: Your name, Restaurant, Phone (optional), Email, Message · **Send message**
- Sent: Thanks. Your message is on its way. We reply within one business day.
- If sending fails: We couldn't send your message. Please email us instead: hello@wuntab.com

## /catering (rewritten 2026-10-13)

Matches the product: a catering request form, not a catering checkout.

- **Headline:** Take catering requests on your own website.
- **Line:** Customers send the date, the headcount and what they need. You reply and confirm the order with them.
- **Visual:** the catering phone (the demo's catering page and its request form).
- **What's included?** A catering page on your website. A request form for the event date, the number of guests and the details. A note asking customers about allergies and dietary needs. Each request goes to the restaurant, which replies and confirms.
- **How does a catering request work?** 1. Customer opens the catering page on your website. 2. Sends the event date, the number of guests and the details. 3. The request goes to the restaurant. 4. You reply with a plan and a price. 5. You confirm the order with the customer.
- **Can customers order catering online?** They send a catering request on your website: the event date, the number of guests and what they need. You reply and confirm the order with them.
- **Do customers pay for catering online?** No. You agree the order and the price with the customer when you confirm it.
- **Mega-menu line:** Take catering requests on your website.

Removed until built: a separate catering menu, advance ordering with scheduling, lead times, minimum order amounts, catering delivery, and the three questions about them.

The two other lines that described catering as an online order now say "catering requests":
- **Homepage, More direct orders:** Pickup, delivery, catering requests, and orders for later.
- **/how-it-works, Order:** They order online, for delivery, at the table, at a kiosk, or in your app, and send catering requests.

---

# Filling the dead ends (2026-10-13, PR #30)

Product facts below were checked against sabal-ros `main` at `a5418d4`, read-only. Each file:line is in that repo at that commit.

## Homepage: founding restaurants (in the customer row's slot)

**We're new. That works in your favor.**
- The people who built WunTab set up your restaurant themselves.
- You get a direct line, not a ticket queue.
- Founding restaurants shape what we build next.

Get Started (Book a call).

The customer row (`src/components/customer-stories.tsx`) stays built for when there are real customers.

**What left the homepage to make room:** the FAQ. All five of its questions are still asked on /pricing, the product pages or the solution pages.

## /about

**What we believe** is the owner's text, word for word:
- **Your customers should be yours.** When someone orders from your restaurant, you should know who they are and be able to reach them again. Marketplaces keep that relationship for themselves. We hand it to you.
- **A restaurant shouldn't pay to sell its own food.** We charge the restaurant nothing. Customers pay a small fee at checkout, so we only earn when you sell. If you don't grow, neither do we.
- **Software should arrive finished.** Most restaurant software is a login and a manual. We build your site, load your menu and connect your kitchen before you touch anything. You get something that works on day one.

**Founder section:** a name, a photo and four sentences, in `src/lib/founder.ts`. It renders nothing while any field is `[OWNER]`.

## /pricing: WunTab next to a delivery app

The table sits under the $0 card; the receipt was already beside the card. No app is named on the page.

**What the restaurant pays per order**
- *WunTab:* "$0. No monthly charge, no setup fee, no commission." Source: SERVICE_FEE_CLAUSE in /terms (`src/lib/legal.ts`).
- *Delivery apps:* "15–30% commission on each delivery order." Source: the largest app's US merchant pricing page, which lists 15%, 25% and 30% plans (merchants.doordash.com/en-us/products/pricing). The second-largest's plans run 20–30%.

**What the customer pays**
- *WunTab:* "Your menu prices, tax, any tip, and a 5% service fee shown before they pay. Delivery adds the driver's fee." Sources:
  - SERVICE_FEE_CLAUSE.
  - The delivery fee is the courier's quote, passed to the diner (`packages/services/delivery/quote-service.ts:294-295`, `placement.ts:412, 424`).
  - Known conflict: checkout code has no 5% fee yet (REGISTER.md, Conflict 1).
- *Delivery apps:* "Menu prices, plus the app's service fee (often 15% of the order) and a delivery fee." Source: the largest app's consumer help page "What fees do I pay?" (help.doordash.com/en-us/consumers/article/what-fees-do-i-pay): the service fee is usually 15% of the subtotal, plus a delivery fee that varies.

**Whose name is on the order**
- *WunTab:* "Yours. They order on your own website." Source: /terms 1.1 (your website, on your own domain, with your branding).
- *Delivery apps:* "The app's. They order in the app." Source: the same pricing page, whose commission applies to "orders placed in the DoorDash App".

**Who gets the customer's details**
- *WunTab:* "You. Your customer list is yours, and you can take it with you." Source: /terms 1.2 ("What is yours: ... your customer list"); export by hand within 30 days (`src/lib/legal.ts`, export clause).
- *Delivery apps:* "The app. The customer's account, email and phone sit with the app." Source: the largest app's consumer privacy policy, whose user profile holds name, email, delivery address and phone (help.doordash.com/en-us/consumers/article/consumer-privacy-policy-ca-english).
- **Caveat:** help.doordash.com doesn't resolve from the session's network, so this and the fees page were read through search results, not opened directly. Worth a look before merging.

**Who gets paid** (restored by the owner, 2026-10-13, PR #31)
- *WunTab:* "You, through your own merchant account."
  - Source: the owner's decision to describe the intended model. Each restaurant has its own merchant account with our payment partner and is paid through it.
  - It is a **build commitment** in REGISTER.md, next to the 5% fee. Today's code still settles to one platform account (REGISTER.md, Conflict 2).
- *Delivery apps:* "The app collects the payment and pays you out, after its commission." Source: the largest app's "How DoorDash Marketplace Works" page, which describes weekly deposits to your bank account, with daily payouts through Fast Pay (merchants.doordash.com/en-us/marketplace/how-it-works-for-restaurants).

## The six secondary pages

All six follow the product template. They're linked from the footer and from their parent pages' Works with, not from the mega-menu.

### /online-menu
- **Headline:** Your menu is your storefront.
- **Line:** Categories, photos, prices and choices, on your own website, ready to order from.
- **Visual:** the storefront phone on its menu screen.
- **Included:** the menu by category with photo, price and description; choices and add-ons with prices; search; a Most ordered list; sold-out dishes come off the menu.
- **Sources:**
  - Categories and adapter: `packages/ui/ordering/public-menu-adapter.ts:73-114`.
  - Clean theme pills, "Search the menu", "Most ordered": `packages/ui/storefront/clean/ordering-menu.tsx:193, 298, 303`.
  - Item sheet photo, price and modifiers: `packages/ui/storefront/clean/item-sheet.tsx:224-302`.
- **Sold out:** diners never see a "Sold out" label. Sold-out items are filtered out of the public menu (`packages/db/migrations/0006_menu_rls.sql:278-287`), so the page says they "come off the menu".

### /upsells (Recommended Add-ons)
- **Headline:** Suggest the side when they pick the dish.
- **Line:** Pick add-ons for each dish. Customers see them under "Goes well with" when they open it.
- **Visual:** the dish sheet with two "Goes well with" rows. The clean theme shows at most two (`packages/ui/storefront/clean/goes-well-with.ts:4`).
- **Rule-based only, as built:**
  - **The restaurant's picks:** "Recommended add-ons", up to 4 per dish (`apps/ros/app/(dashboard)/menu/_components/recommendation-editor.tsx:25, 110-120`).
  - **Then the most-ordered dishes:** `goes-well-with.ts:7-39`.
  - **"Complete your order" in the cart:** `packages/ui/ordering/v2/cart-upsell-strip.tsx:40-42`.
  - **No AI or "smart":** the code says "No randomness, no scoring, no ranking, no model" (`packages/ui/ordering/recommendations.ts:7-10`).
- **Renamed:** "Smart Upsells" became "Recommended Add-ons". On /online-ordering, "Smart upsells that suggest the extra naan or the drink" became "Recommended add-ons when a customer picks a dish".

### /loyalty (build commitment)
- **Headline:** Give regulars a reason to come back.
- **Line:** Customers earn a reward for coming back. You decide what it is and when they get it.
- **Visual:** a reward card on the order confirmation. The confirmation's own strings are from `packages/ui/storefront/clean/confirmation.tsx:42-92`; the reward ("Thanks for coming back. Your next Hummus & Warm Pita is on us.") is an example.
- **Status:** not built (`packages/ui/storefront/themes/clean-home.tsx:41-42`). REGISTER.md records it as a build commitment. No points, tiers or app on the page.

### /kitchen-display
- **Headline:** Orders on a screen, in the order they came in.
- **Line:** Every order in New, Preparing and Ready. Your team taps each one along.
- **Visual:** the kitchen board.
- **Sources:**
  - Columns: `apps/ros/app/(kds)/kds/_lib/kds-thresholds.ts:162-166`.
  - Buttons Start / Ready / Complete: `:193-197`.
  - "Live": `kds-board.tsx:134-141`.
  - "Recently completed": `:255`.
- **Removed:** "Order printing" left this page; printing is Clover-only (REGISTER.md, Conflict 4).

### /menu-management
- **Headline:** Change the menu once. It changes everywhere.
- **Line:** Edit a dish in one place. Your website and online ordering show it the moment you save.
- **Visual:** the menu editor's item drawer, from batch 1's menu-editor captures.
- **Labels:**
  - "Edit item details", "Photo", "Item name", "Category", "Price", "Prep (min)": `item-editor-drawer.tsx:181-326`.
  - Availability "Available / Sold Out / Hidden": `:365`, `packages/domain/menu-status.ts:1-3`.
  - "Modifier groups": `:419`, "Optional · N options" `:440`.
  - "Save changes": `:198-218`.
- **Live on save:** there is no publish step, and every storefront route is `force-dynamic` (`apps/sites/.../menu/page.tsx:22`).
- **Availability per location:** `menu-repository.ts:583-598`.
- **Removed (not built):** "Availability by day and time", and the note "One menu powers your website, online ordering, kiosk, table ordering, and app". There is no kiosk, table ordering or app.

### /payments
- **Headline:** A fast checkout, and a paid order straight to your kitchen.
- **Line:** Customers pay by card or Apple Pay. The order goes to your kitchen, and the money to your own merchant account.
- **Visuals:** the receipt in the hero; "How a payment moves" as Checkout → Card check → Paid → Your account.
- **Steps:**
  1. The customer pays by card or Apple Pay.
  2. Our payment partner checks the card.
  3. The order shows Paid and goes to your kitchen.
  4. The money goes to your own merchant account.
- **The intended model (owner, 2026-10-13):**
  - "Paid through your own merchant account with our payment partner".
  - "WunTab's 5% comes from the customer at checkout, not from you".
  - FAQ **Who gets paid?** "You, through your own merchant account with our payment partner. WunTab takes 5% from the customer at checkout, not from you."
  - Both are **build commitments** in REGISTER.md: the per-restaurant merchant account next to the 5% fee.
- **The payment partner is never named on the site.** A test checks every page. The one exception is the privacy policy, which names it as a subprocessor (`src/lib/legal.ts:174`, approved legal text).
- **Security line**, verified: "Card numbers go into our payment partner's secure fields and never reach WunTab. We keep only the card brand and last four digits."
  - Hosted fields return a token: `packages/ui/ordering/nmi-payment-step.tsx:4, 9-12, 72-82`.
  - Only `{ paymentId, paymentToken }` is sent onward: `:122`.
  - The sale call carries only `payment_token`: `packages/services/payments/nmi.ts:103`.
  - Stored: brand and last four only, with card numbers and CVC "deliberately absent": `packages/db/schema/payments.ts:22-24, 59-66`.
  - The dashboard: "Card details are entered in the processor's hosted fields and never reach Wuntab's servers" (`apps/ros/app/(dashboard)/settings/payments/page.tsx:77-78`).
- **Other sources:**
  - "Paid": `packages/domain/ordering/payment-status.ts:76`.
  - The order goes to the kitchen on the paid webhook: REGISTER.md, Clover step 2.
  - Cancel and refund: `apps/ros/server/services/order-cancellation-service.ts:432`.

## Works with
- Every item on every product, solution and /how-it-works page now links to a page. Products without a page are left out rather than shown unlinked.
- "Restaurant Listings" is gone from every list.

## Demo link
- "See a live WunTab restaurant" points at https://demo.wuntab.com.
- It sits in the homepage products section and in /restaurant-websites' hero links.
- It's behind `NEXT_PUBLIC_SHOW_DEMO_LINK`, which is off. Set it to `true` in Vercel once the demo menu has photos. It adds about 60px to the homepage at 390, which still stays under 7,000.

## /how-it-works
- **Build the relationship:** the reward card on the order confirmation (the /loyalty visual).
- **Bring them back:** the customer's text on a lock screen, in the product's own words: "Your order #1930 at Palm&Stone Kitchen is confirmed." / "Pickup in about 20 minutes (around {time})." (`packages/domain/ordering/confirmation-sms.ts:67, 77`).
  - You asked for a "Your order's ready" style text. The product sends no ready text, only the confirmation and a cancellation (`packages/services/messaging/customer-sms.ts`), so the visual uses the real one.
- The stage chips list only products that have a page.
