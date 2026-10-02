# Capability register

Per `SPEC.md` section 3. One row per capability.

**Compiled 2026-10-02 without access to the platform code.** Reading `Marawan3/sabal-ros` (the platform repo) was refused by this session's permission check. So no row below has platform file:line proof yet, and under the spec's own rule **no row can be Live or Partial yet**. Every row is **Unknown** or **Not built**. Both block publication the same way: no page, no nav, no homepage mention, no footer, no sitemap, no structured data.

The "Secondary evidence" column is *not* proof under section 3. It records what the owner or the published legal documents already say, so whoever reads the platform code knows where to look and what to confirm. Sources:

- **Brief**: the owner's brief of 2026-09-27 (§4 "Ships today", "Does not exist yet", "Not planned").
- **legal.ts**: `sabal-marketing/src/lib/legal.ts` on `main`. It was written from a data inventory of the platform repo compiled 2026-09-15. The inventory itself is not in this repo.
- **PR #6**: comment 5753597735 on `Marawan3/sabal-marketing#6` (2026-09-20). It records what that inventory did not evidence.

"To settle" names what would turn a row into Live, Partial or Not built.

| Pillar | Capability | Route | Status | Proof | Secondary evidence | Notes / to settle |
|---|---|---|---|---|---|---|
| Sell | Pickup ordering | /online-ordering | Unknown | – | Brief: ships. legal.ts:133, :298 | Trace checkout → order create with fulfilment = pickup |
| Sell | Delivery ordering | /delivery | Unknown | – | Brief: ships. legal.ts:143, :298 | Trace checkout with delivery address → order create |
| Sell | Scheduled (future-time) orders | /online-ordering | Unknown | – | None | Find a requested/scheduled time on the order and the code that holds it until then |
| Sell | Online menu: categories, items, photos, prices | /online-menu | Unknown | – | legal.ts:148 (menu, prices, photos stored) | Storefront menu render code |
| Sell | Modifiers and add-ons | /online-menu | Unknown | – | legal.ts:142, :148 | Modifier selection + price applied at checkout |
| Sell | Item availability / sold-out | /menu-management | Unknown | – | None | Code that hides or blocks an unavailable item at checkout |
| Sell | Promo codes | /online-ordering | Unknown | – | Brief: ships. legal.ts:148, :298 | Discount applied to total at checkout |
| Sell | Tips | /payments | Unknown | – | legal.ts:142 ("any tip"). Old copy claims 15% default | Tip added to the captured amount. Confirm default % before any number is used |
| Sell | Smart upsells | /upsells | Unknown | – | PR #6: not evidenced in inventory | Recommendation logic in cart/checkout |
| Sell | Customer accounts (sign-in for diners) | /online-ordering | Unknown | – | legal.ts:149 covers staff auth only; nothing on diner accounts | Diner auth / account creation on the storefront |
| Sell | Order tracking (customer-facing) | /online-ordering | Unknown | – | legal.ts:142 (public order-tracking token) | Tracking page that reads live order status |
| Sell | Order notifications to customers (SMS) | /online-ordering | Unknown | – | Brief: ships. legal.ts:157, :172 (Twilio) | Code that sends an SMS on a status change |
| Sell | Favorites | /online-ordering | Unknown | – | None | Diner-side saved items |
| Sell | Reorder | /online-ordering | Unknown | – | None (legal.ts:145: card must be re-entered) | One-tap reorder from history |
| Sell | Catering enquiry form | /catering | Unknown | – | Brief: ships. legal.ts:146 | Form submit → stored + restaurant notified |
| Sell | Catering menu, advance ordering | /catering | Unknown | – | PR #6: only the enquiry form evidenced | Separate catering menu orderable at checkout |
| Sell | Catering lead times | /catering | Unknown | – | PR #6: not evidenced | Checkout rule rejecting orders inside the lead time |
| Sell | Catering order minimums | /catering | Unknown | – | PR #6: not evidenced | Checkout rule enforcing a minimum |
| Sell | QR table ordering | /table-ordering | Not built | – | Brief: does not exist | Owner-stated, not code-checked |
| Sell | Pay at table | /table-ordering | Not built | – | Brief: table ordering does not exist | Owner-stated |
| Sell | Self-service kiosk | /kiosk | Not built | – | Brief: does not exist | Owner-stated |
| Sell | iOS app (in App Store) | /restaurant-app | Not built | – | Brief: mobile app does not exist | Owner-stated. Spec: Live needs a shipped store listing |
| Sell | Android app (in Play Store) | /restaurant-app | Not built | – | Brief: mobile app does not exist | Owner-stated |
| Sell | Push notifications | /restaurant-app | Not built | – | Depends on an app | Owner-stated (via app) |
| Sell | Gift cards | /gift-cards | Not built | – | Brief: does not exist | Owner-stated |
| Grow | Website on restaurant's own domain | /restaurant-websites | Unknown | – | Brief: ships. legal.ts:148, :298 | Custom-domain attach + serving code |
| Grow | Custom branding | /restaurant-websites | Unknown | – | legal.ts:298 ("your branding") | Theme/brand settings applied at render |
| Grow | Website editor | /restaurant-websites | Unknown | – | Brief: ships. legal.ts:148 (draft and published content) | Draft → publish path |
| Grow | Menu served as crawlable HTML | /restaurant-seo | Unknown | – | Brief: "built for Google". Old copy: 220 dishes measured | Server-rendered menu route (no client-only fetch) |
| Grow | Structured data (Restaurant / Menu schema) | /restaurant-seo | Unknown | – | None | JSON-LD generator on storefront pages |
| Grow | Dish / cuisine / location pages | /restaurant-seo | Unknown | – | Old copy: "a page for every dish" | Route per dish + sitemap entry |
| Grow | Search-appearance monitoring | /restaurant-seo | Unknown | – | Brief: ships "on request". legal.ts:178, :298 (Search Console) | Search Console integration code; confirm self-serve vs manual |
| Grow | Restaurant listings management | /listings | Unknown | – | PR #6: not evidenced | Any third-party listings sync |
| Grow | QR feedback | /guest-feedback | Unknown | – | Exists in Sabal Signal (separate product, `sabal-signal-website` home-content.tsx). PR #6: no feedback tables in WunTab platform | Is Signal merged into the platform or still separate (feedback.sabalsignal.com)? |
| Grow | NFC feedback | /guest-feedback | Unknown | – | PR #6: not evidenced | As above |
| Grow | Manager alerts on low feedback | /guest-feedback | Unknown | – | Signal site claims "Real-Time SMS Alerts" | As above |
| Grow | Surveys | /guest-feedback | Unknown | – | Signal claims "customizable feedback forms" | As above |
| Grow | Satisfaction / feedback dashboard | /guest-feedback | Unknown | – | Signal claims "Guest Recovery Dashboard" | As above |
| Grow | Review requests | /reviews | Unknown | – | **Signal copy describes review gating**: only positive feedback triggers a Google review request (home-content.tsx:176, :267, :367). Breaks truth rule 8 if the product works that way | Read the request-trigger code. If it is conditional on rating, it can't be marketed until changed |
| Grow | Review monitoring | /reviews | Unknown | – | Brief: reviews management does not exist | Likely Not built; confirm whether `sabal-reviews` repo is live |
| Grow | Loyalty / rewards | /loyalty | Not built | – | Brief: does not exist. legal.ts:81-91 bans the word | Owner-stated |
| Grow | Customer database (restaurant's customer list) | /customers | Unknown | – | legal.ts:298, :300 ("your customer list") | Dashboard view listing customers with order history |
| Grow | Email campaigns | /email-marketing | Not built | – | Brief: email marketing not planned | Owner-stated. Spec lists it; brief says do not mention |
| Grow | SMS campaigns | /sms-marketing | Unknown | – | PR #6: only transactional texts evidenced. Signal lists "SMS marketing campaigns" | Bulk/segment send code |
| Grow | Automated campaigns (win-back, reorder, birthday, abandoned order), one row each when found | /restaurant-marketing | Unknown | – | None | Scheduler/trigger code per campaign type |
| Grow | Segments | /restaurant-marketing | Unknown | – | None | Segment builder/query |
| Operate | Menu management (edit items, prices, photos, modifiers) | /menu-management | Unknown | – | Brief: menu editor ships. legal.ts:148, :298 | Dashboard edit → storefront update |
| Operate | Menu file import | /menu-management | Unknown | – | legal.ts:148, :170 | Import parser |
| Operate | AI-drafted menu/website copy, human approval | /ai | Unknown | – | Brief: ships. legal.ts:160, :177 (Anthropic) | Draft call + approve gate before publish |
| Operate | Order management (incoming → completed) | /order-management | Unknown | – | legal.ts:142 (stage times), :298 | Dashboard order-status transitions |
| Operate | Restaurant hours | /order-management | Unknown | – | None | Checkout blocked outside hours |
| Operate | Pause online ordering | /order-management | Unknown | – | None | Toggle that blocks checkout |
| Operate | Prep-time controls | /order-management | Unknown | – | None | Prep time feeding quoted ready time |
| Operate | Order printing (kitchen ticket) | /order-management | Unknown | – | Brief: ships. legal.ts:142, :157, :206 | Print job dispatch to printer device |
| Operate | Kitchen display | /kitchen-display | Not built | – | Brief: does not exist | Owner-stated |
| Operate | Clover order injection (with payment recorded) | /integrations | Unknown | – | Brief: ships. legal.ts:150, :173, :205 | Clover API order create. **This is a live POS integration, not "Coming"**. See report |
| Operate | Payments: card checkout via NMI | /payments | Unknown | – | legal.ts:174 (NMI), :145 | Checkout → NMI charge call |
| Operate | Analytics: any metric | /analytics | Unknown | – | PR #6: no reporting tables in inventory. legal.ts:151 is internal AI-usage counts only | List every computed metric with file:line; until then the page names none |
| Operate | Reservations | /reservations | Not built | – | Brief: not planned, do not mention | Owner-stated |
| Operate | Waitlist | /reservations | Not built | – | Brief: reservations not planned | Owner-stated |
| Operate | Operator AI assistant | /ai | Unknown | – | None beyond copy drafting | Chat/assistant code |
| Operate | AI menu optimization / recommendations | /ai | Unknown | – | None | Recommendation code |
| Scale | Multiple locations per restaurant | /multi-location | Unknown | – | legal.ts:148 (each location's address, phones, tax rate) | Location switcher + per-location menu/orders |
| Scale | Organization / franchise controls | /enterprise | Unknown | – | legal.ts:148 (organisation), :204 (account isolation) | Org-level roles and cross-location settings |
| Scale | Staff accounts and roles | /enterprise | Unknown | – | legal.ts:149, :298 | Role checks |
| Scale | White label | /partners | Unknown | – | None | Partner-branded instance or theming |
| Scale | Delivery integration: DoorDash (Drive) | /integrations, /delivery | Unknown | – | Brief: courier partner. legal.ts:175 | Dispatch request on order ready |
| Scale | Delivery tracking | /delivery | Unknown | – | None | Courier status → customer tracking |
| Scale | Delivery zones | /delivery | Unknown | – | None | Address check against a zone |
| Scale | Delivery fee to customer | /delivery | Unknown | – | None | Fee line at checkout; who pays the courier |
| Scale | Payment integration: NMI | /integrations | Unknown | – | legal.ts:174 | As Payments row |
| Scale | Text-message integration: Twilio | /integrations | Unknown | – | legal.ts:172 | As notifications row |
| Scale | POS integrations other than Clover | /integrations | Coming (candidate) | – | Spec rule 2 | Allowed as Coming Soon only; owner to name which POS |
