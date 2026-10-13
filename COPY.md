# Draft copy — not approved

Marawan signs off before production. Source of truth in code: `src/lib/copy.ts` (homepage and shared copy) and `src/lib/catalog.ts` (product pages). Voice and number rules: `.claude/skills/wuntab-design/SKILL.md` §8 and §11.

This file mirrors the homepage as rebuilt in the design pass of 2026-10-07. Every line restates something already in the catalog, the FAQ or the service fee clause in `/terms`. Nothing new is claimed.

## a. Hero

**Headline:** More direct orders. More repeat customers. One platform.

**Line:** Your website, online ordering, delivery, and marketing, built and run for you.

**Input:** Your restaurant's name · **Button:** Get Started (opens Book a call with the name filled in)

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

Four rows, each the product page's headline, a link and the product's visual:

- Take orders on your own website, under your own name. · More about online ordering · *storefront phone*
- Delivery without building a delivery fleet. · More about delivery · *delivery phone*
- Take catering requests on your own website. · More about catering · *catering phone*
- Every order, from new to done. · More about order management · *kitchen board*

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

**Take control of your restaurant's direct business.** A short call. We will show you WunTab on your own menu. · Get Started · or email hello@wuntab.com

## Moved off the homepage

The six-step lifecycle, integrations and multi-location are on `/how-it-works`.

## /how-it-works (2026-10-13)

One built visual per stage: Discover, the search result · Order, the storefront phone · Fulfill, the kitchen board · Understand, the dashboard card · Build the relationship, the delivery phone · Bring them back, the catering phone.

The integrations list is now one question under the same heading, **Works with what you already use.**: **What does WunTab work with?** Payment integrations and third-party delivery. WunTab connects to your POS. If your POS isn't compatible, orders go to a kitchen printer.

The multi-location diagram stacks its three locations on phones.

## Product pages (2026-10-13)

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

## Footer

Restaurant websites, online ordering, delivery, and marketing, built and run for you.

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
