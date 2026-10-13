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

**Visual:** a live phone drawn in HTML and CSS (2026-10-13). On the demo restaurant's storefront, a diner opens Spiced Lamb Meatballs ($12.00), picks spice level Hot, adds it, checks out (subtotal $12.00, Service fee (5%) $0.60, tax $0.78, tip $2.40) and pays $15.78, and sees the confirmation with a ready time 20 minutes after the visitor's own clock. On desktop the order then lands as ticket #1930 in the New column of the kitchen display beside the phone; on phones the phone turns over to show that ticket. Every string on the screens is the storefront's or the kitchen display's own, except the "Service fee (5%)" line: the owner added it on 2026-10-13 to match /pricing and /terms, and the live checkout doesn't show it yet; every dish and price is the demo menu's (`src/lib/demo-order.ts`). About 14 seconds, then it loops.

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
