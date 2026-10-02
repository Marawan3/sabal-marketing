# Capability register

Per `SPEC.md` section 3. One row per capability.

**Proved 2026-10-02 against `Marawan3/sabal-ros` at commit `92b07e6` (main, 2026-10-01)**, read-only, from a shallow clone. Every file:line in the Proof column is a path in that repo at that commit. Proof means the code that does the work, traced from the entry point. A label, flag, route, toggle or column alone is not proof.

Docs in sabal-ros were read for context only and are never cited as proof. Sabal Signal (`sabal-signal-website`, `sabal-reviews`) was not read, per the owner decision below.

Status: **Live** (works end to end in code), **Partial** (the Notes say exactly what is live), **Coming** (POS integrations only), **Not built**, **Unknown** (the Notes say what would settle it). "Was" is the status before this pass.

Code proves what the software does, not what is switched on in production. Where a capability depends on credentials or a per-location setting, the Notes say so. Those rows say what the owner must confirm before the page claims it.

## Owner decisions

**2026-10-02**
- Where `SPEC.md` and the owner's brief of 2026-09-27 conflict, the spec wins. Coming Soon is for POS integrations only, and the homepage does not lead with Google.
- Get Started stays "Book a call" until self-serve signup is proven end to end.
- PR #6 (`platform-site`) stays parked as source material. It will never be merged whole and is not to be touched.
- Sabal Signal is off limits for now: `sabal-signal-website` and `sabal-reviews` are not to be read, edited or have PRs opened. Rows whose proof would live in Signal code stay Unknown, marked "needs Signal access".

## Conflicts with what is published today (owner action needed)

These are statements on the live wuntab.com, or in the published `/privacy` and `/terms`, that the code contradicts. The legal text can only change with written owner approval. They are listed here, not fixed.

1. **There is no 5% service fee.** The checkout total is `subtotal − discount + tax + delivery fee + tip` (`packages/domain/ordering/order-pricing.ts:352`); `computeTotals` has no other fee input (`:288-294`). The storefront tells diners "No service fee" (`packages/ui/storefront/clean/checkout.tsx:383, 401`). This contradicts the homepage pricing section and FAQ (`src/lib/copy.ts` pricing body and FAQ on `main`), and `SERVICE_FEE_CLAUSE` in both legal documents (`src/lib/legal.ts:73-74`), which says the fee "is collected by our payment processor and routed to Wuntab at settlement".
2. **The restaurant is not the merchant of record, and money does not settle to it.** All cards are charged on one platform NMI account, `NMI_SECURITY_KEY` (`packages/db/env.ts:371`, used at `packages/services/payments/nmi.ts:61, 98`). The restaurant's own Settings → Payments page says: "Sabal uses ONE platform NMI merchant account … money does not currently settle to the restaurant's own account" (`apps/ros/app/(dashboard)/settings/payments/page.tsx:12-15`). This contradicts the privacy policy ("The restaurant is the merchant of record… Payments settle to the restaurant's own account", `src/lib/legal.ts:187`). It also contradicts the homepage: "Payments land in your bank account, not ours" and "We never hold your money".
3. **Delivery is sandbox-only by default.** DoorDash Drive is fully wired. But `DOORDASH_ENVIRONMENT` defaults to `sandbox` (`packages/services/delivery/config.ts:16`), and delivery shows at checkout only when DoorDash credentials are set and the location's `is_delivery_enabled` is on (default false, `packages/db/schema/tenancy.ts:175`). Whether production DoorDash access exists is not provable from code. The repo's own docs say production access had not been granted. The homepage and the terms (1.1) describe delivery as live.
4. **Kitchen printing is Clover-only.** A restaurant without Clover gets a one-line text message ("#123 PICKUP 6:15 PM · 3 items (2 mods) · see KDS") and no printed ticket (`packages/services/printing/kitchen-fulfillment.ts:14-25`, `packages/domain/printing/kitchen-ticket.ts:47-58`). The homepage says "or to a printer if you don't have one". Star CloudPRNT is an in-memory test simulator only (`packages/services/printing/cloudprnt.ts:47-117`).
5. **Catering, careers and contact form submissions are stored, but the restaurant is not told and cannot see them.** There's no email or SMS, and only Wuntab platform admins can read them (`packages/services/websites/submissions.ts:71-85`, `apps/ros/server/services/site-submission-service.ts:16`). The terms (1.1) say Wuntab "collects enquiries submitted through the forms on your website".
6. **Possible defect, not a marketing claim:** on a site with two or more locations, storefront checkout always uses the site's primary location (`apps/sites/app/%5Fsites/[siteId]/(ordering)/order/actions.ts:64, 100`), even from `/menu/[locationSlug]`. A test order on a two-location site would settle it. This is for the platform team; the marketing site doesn't fix it.

## Facts the copy depends on

### Clover, end to end: **Live in code**
From a paid online order to the Clover device:
1. The restaurant connects Clover by OAuth. The app launch is `apps/ros/app/integrations/clover/launch/route.ts`. The callback `apps/ros/app/integrations/clover/callback/route.ts:56` exchanges the code (`:113` → `packages/services/clover/oauth.ts:159-164`, POST `/oauth/v2/token`) and stores the grant encrypted per location (`callback/route.ts:114` → `oauth.ts:274`). Items are mapped to the Clover catalog in the dashboard at `apps/ros/app/(dashboard)/menu/clover/`.
2. The diner pays online through NMI (`packages/services/ordering/payment-flow.ts:93-134`). NMI's signed webhook marks the order paid (`apps/ros/app/api/nmi/webhook/route.ts:32` → `apps/ros/server/services/payment-service.ts:61`), then calls `deliverPaidOrderToKitchen` (`payment-service.ts:147`). Zero-total orders take `packages/services/ordering/order-service.ts:326`.
3. The router tries Clover first (`packages/services/printing/kitchen-fulfillment.ts:14-25`). It is skipped unless the location's POS is Clover (`packages/services/clover/fulfill.ts:59`) and a usable credential exists for that location (`fulfill.ts:61` → `packages/services/clover/credentials.ts:568-608`).
4. It creates the order in Clover: `fulfill.ts:119` → `packages/services/clover/client.ts:382-389` (POST `/v3/merchants/{mid}/atomic_order/orders`), with lines built from the catalog mapping (`fulfill.ts:272`, `packages/services/clover/cart.ts:59`).
5. It records the payment in Clover as an external tender, tip included: `fulfill.ts:126` → `client.ts:452-470` (POST `/orders/{id}/payments`).
6. It prints on the Clover device: `fulfill.ts:151` → `client.ts:394-400` (POST `/print_event` with the order reference; Clover routes it to the default printer). Then it locks the order (`fulfill.ts:152`, `client.ts:517`) and records the link (`fulfill.ts:159`).
7. **Fallback:** if there's no default printer, the catalog isn't mapped, or Clover returns an error, the kitchen gets the text message instead (`kitchen-fulfillment.ts:20-24`). Checkout is never blocked.

**Caveats for the copy:** this works for any merchant that can connect through OAuth. Who can connect depends on the Clover App Market listing, which per the owner's brief is still in review. So "Built for Clover" and "orders go into Clover and print in your kitchen" are supported. "Available on the Clover App Market" is not, until the owner confirms approval. Clover is the only POS in code.

### Payments
- **Who processes the money:** NMI, on one platform merchant account. Charge: `packages/services/payments/nmi.ts:92-104` (POST `/v5/payments/sale`), called from `packages/services/ordering/payment-flow.ts:93-134`. Refund and void: `nmi.ts:121, 138`. The order becomes paid only on the signed webhook (`apps/ros/app/api/nmi/webhook/route.ts:33-45`).
- **Merchant of record:** the platform, not the restaurant (Conflict 2).
- **Payment methods:** card and Apple Pay only. Pay at store is refused (`packages/services/ordering/order-service.ts:228-230`), and card orders under $1 are refused (`order-service.ts:348-353`).

### Delivery fee: **the diner pays DoorDash's quote, unchanged**
DoorDash's quote amount (`packages/services/delivery/provider.ts:228-229`) is written as both the provider fee and the customer fee (`packages/services/delivery/quote-service.ts:255-256`). Placement reads it from the server-side quote row (`packages/services/ordering/placement.ts:412`) and adds it to the total (`placement.ts:419-425` → `order-pricing.ts:352`). A database check enforces that the quote fee equals the order fee (`packages/db/migrations/0055_doordash_drive_rls.sql:265-267`). There is no markup, cap, subsidy or free-delivery threshold.

If DoorDash's fee at dispatch is higher than the quote, the diner is not recharged and the difference is only logged (`packages/services/delivery/accept-service.ts:181, 214-222`). DoorDash credentials are platform-level env vars (`config.ts:43-57`), so DoorDash invoices the platform. The code doesn't show whether the restaurant reimburses that; the owner's contracts would. The diner's tip is passed to DoorDash as the Dasher tip (`provider.ts:203`).

### Pricing: **neither figure is defined in code**
- **Diner 5%:** not built (Conflict 1).
- **Restaurant $0:** there is no billing code. The only trace is `organizations.plan`, default `"trial"` (`packages/db/schema/tenancy.ts:40`), which nothing charges against. So "$0 for the restaurant" matches the code by absence. Per the code, the platform earns no fee on an order.
- **To settle:** the owner states the actual pricing model. Spec §10 keeps pricing unpublished until then.

### Analytics: metrics the dashboard computes and shows an operator
Every metric below is limited to **one location** (the active one), a date range (default the last 30 days, presets up to 366), and **realized orders**: not cancelled, and paid (`apps/ros/server/domain/analytics-metrics.ts:42-48`). Net sales = subtotal − discount; it excludes tax, tips and fees (`analytics-metrics.ts:67`). Entry: `apps/ros/app/(dashboard)/analytics/page.tsx:65` → `apps/ros/server/services/analytics-service.ts:140-166` → `apps/ros/server/repositories/analytics-repository.ts:407-427`.

| Metric as shown | Computed | Shown |
|---|---|---|
| Net sales, with change vs the previous period | `analytics-repository.ts:137`, previous `:148`; change `analytics-metrics.ts:117-140` | `analytics-view.tsx:67-74`; overview `overview-view.tsx:121-128` |
| Orders, with change | `analytics-repository.ts:136`, `:147` | `analytics-view.tsx:75-81` |
| Average order | `analytics-metrics.ts:86-92` | `analytics-view.tsx:82-91` |
| Tips, with change | `analytics-repository.ts:141`, `:152` | `analytics-view.tsx:92-98` |
| Sales trend (net sales per day, current vs previous) | `analytics-repository.ts:198-253` | `trend-chart.tsx`; `analytics-view.tsx:101-107` |
| Top items (net item sales, quantity sold) | `analytics-repository.ts:280-311` | `top-items-list.tsx:107-141` |
| Pickup / delivery mix (orders, net sales, % of orders) | `analytics-repository.ts:334-369` | `breakdown-summary.tsx:34-88` |
| Gross merchandise, discounts, tax collected, total collected | `analytics-repository.ts:138-143` | `analytics-view.tsx:155-172` |
| Discounts given; orders with a promo code (count and %) | `analytics-repository.ts:139, 144` | `analytics-view.tsx:180-190` |
| Paid-then-cancelled orders (count, total; shown only when above 0) | `analytics-repository.ts:158-159` | `analytics-view.tsx:195, 239-259` |
| CSV export of the above | `apps/ros/server/domain/analytics-csv.ts:98-190` | link `analytics-view.tsx:55-61` |
| Customers: total, new, returning (across the user's locations) | `apps/ros/server/repositories/customer-repository.ts:184-204` | `apps/ros/app/(dashboard)/customers/page.tsx:44-59` |
| Per customer: orders, lifetime spend, average, first and last order | `customer-repository.ts:126-140, 264-308` | `customers-view.tsx:228-241`; `customers/[customerId]/page.tsx:87-97` |

Component paths are under `apps/ros/app/(dashboard)/_components/analytics/`, except `overview-view.tsx`, which is under `apps/ros/app/(dashboard)/_components/`.

**Not computed, so the analytics page must not name them:** menu performance beyond top items, sales mix by category, ordering trends beyond the daily net-sales line, feedback analytics, guest sentiment, multi-location rollups. The channel mix is computed but never shown, because every order is written as "online".

## Register

| Pillar | Capability | Route | Was | Status | Proof (sabal-ros @ 92b07e6) | Notes |
|---|---|---|---|---|---|---|
| Sell | Pickup ordering | /online-ordering | Unknown | **Live** | Entry `apps/sites/app/%5Fsites/[siteId]/(ordering)/menu/_lib/ordering-menu.tsx:155` → `apps/sites/app/%5Fsites/[siteId]/(ordering)/order/actions.ts:99` → `packages/services/ordering/order-service.ts:171-174` → insert `packages/services/ordering/placement.ts:453-480`; charge `packages/services/ordering/payment-flow.ts:114` | Card or Apple Pay only; $1 minimum. Paid on the NMI webhook. |
| Sell | Delivery ordering at checkout | /delivery | Unknown | **Unknown** | Code complete: quote `packages/services/delivery/quote-service.ts:117-290`; placement requires an active quote `placement.ts:312-323, 359-425` | Works only with DoorDash credentials and `is_delivery_enabled` on (default off). Sandbox by default (Conflict 3). **To settle:** owner confirms production DoorDash is live for at least one location. |
| Sell | Scheduled (future-time) orders | /online-ordering | Unknown | **Live** | Slots `packages/domain/ordering/ordering-availability.ts:268-312`, re-checked `order-service.ts:258-269`, stored `placement.ts:476-477`; held on the board until release `apps/ros/server/domain/order-views.ts:57-63` | 15-minute slots, up to 7 days ahead. The kitchen ticket or text goes out when payment clears, not at release time. |
| Sell | Online menu: categories, items, photos, prices | /online-menu | Unknown | **Live** | `ordering-menu.tsx:97` → `packages/services/ordering/public-menu.ts:216-248, 386-450` | Server-rendered on first load. |
| Sell | Modifiers and add-ons | /online-menu | Unknown | **Live** | Rules `packages/domain/ordering/order-pricing.ts:207-257`, price `:166-170`; trusted re-read `placement.ts:739-784`, written `:508-519` | The server ignores browser prices. |
| Sell | Item availability / sold-out | /menu-management | Unknown | **Live** | Toggle `apps/ros/app/(dashboard)/menu/_components/menu-view.tsx:223` → `apps/ros/server/repositories/menu-repository.ts:882-918`; hidden `public-menu.ts:380-384`; rejected `order-pricing.ts:152-155` | Per location. "Sold out until" a time is supported. |
| Sell | Promo codes | /online-ordering | Unknown | **Live** | Create `apps/ros/app/(dashboard)/menu/promotions/actions.ts:64`; apply `placement.ts:341-354`; rules `packages/domain/ordering/promotion-pricing.ts:91-147` | Fixed or percent, minimum subtotal, cap, date window. |
| Sell | Tips | /payments | Unknown | **Live** | Added to total `order-pricing.ts:352`; stored `placement.ts:471`; charged `payment-flow.ts:73-81, 114` | Default depends on theme: 18% classic (`packages/ui/ordering/checkout-flow.tsx:200`), 15% v2 (`packages/domain/storefront-settings.ts:13`), 20% clean (`packages/ui/storefront/clean/checkout.tsx:25`). "No tip" is always offered. Don't publish one default %. |
| Sell | Smart upsells | /upsells | Unknown | **Partial** | `packages/ui/ordering/ordering-view.tsx:369-417` → `packages/domain/storefront-upsells.ts:4, 18-23`; "most ordered" `packages/services/ordering/most-ordered.ts:23-45` | Live: rule-based add-on suggestions (category matching, operator-picked pairings, 30-day most-ordered counts). Not live: anything "smart" or AI. |
| Sell | Customer accounts (diner sign-in) | /online-ordering | Unknown | **Not built** | No sign-in code in `apps/sites` | Guest checkout only. |
| Sell | Order tracking (customer-facing) | /online-ordering | Unknown | **Partial** | `apps/sites/app/%5Fsites/[siteId]/(ordering)/order/track/[trackingToken]/page.tsx:55` → `packages/services/ordering/tracking.ts:70-95` → `packages/ui/ordering/track-order-view.tsx` | Live: a tracking link that shows the real status when the page loads. Not live: automatic updates (the customer must reload). |
| Sell | Order notifications to customers (SMS) | /online-ordering | Unknown | **Partial** | Twilio send `packages/services/messaging/customer-sms.ts:50-81`; triggers `apps/ros/server/services/payment-service.ts:144` (confirmed), `apps/ros/server/services/order-cancellation-service.ts:431-433` (cancelled or refunded) | Live: "order confirmed" (with promised time) and "cancelled/refunded" texts. Not live: "ready" or "on the way" texts. Needs the Twilio env vars. |
| Sell | Favorites | /online-ordering | Unknown | **Not built** | No code | |
| Sell | Reorder | /online-ordering | Unknown | **Partial** | `packages/ui/ordering/v2/guest-reorder.ts:5-12`; pill `packages/ui/storefront/clean/ordering-menu.tsx:272-274` | Live: "Order again" refills the cart with the last order's items, on the same device, on the v2 and clean themes. Not live: order history, quantities or modifiers, and the classic (default) theme. |
| Sell | Catering enquiry form | /catering | Unknown | **Partial** | `apps/sites/app/%5Fsites/[siteId]/(site)/catering/page.tsx:74` → `(site)/_forms/actions.ts:70-72` → `packages/services/websites/submissions.ts:71-85` | Live: the form is stored. Not live: telling the restaurant. Only platform admins can read submissions (Conflict 5). |
| Sell | Catering menu / advance catering ordering | /catering | Unknown | **Not built** | Catering page offers a PDF only (`packages/ui/storefront/themes/catering-body.tsx:98-99`) | |
| Sell | Catering lead times | /catering | Unknown | **Not built** | No code | |
| Sell | Catering order minimums | /catering | Unknown | **Not built** | No code | |
| Sell | QR table ordering | /table-ordering | Not built | **Not built** (confirmed) | `dine_in` exists only as a DB value; checkout accepts pickup or delivery only (`packages/domain/ordering/order-status.ts:151-153`) | |
| Sell | Pay at table | /table-ordering | Not built | **Not built** (confirmed) | No code | |
| Sell | Self-service kiosk | /kiosk | Not built | **Not built** (confirmed) | Only an enum value (`packages/db/schema/orders.ts:220`); every order is written `online` (`order-service.ts:293`) | |
| Sell | iOS app (in App Store) | /restaurant-app | Not built | **Not built** (confirmed) | No native or PWA code | |
| Sell | Android app (in Play Store) | /restaurant-app | Not built | **Not built** (confirmed) | No native or PWA code | |
| Sell | Push notifications | /restaurant-app | Not built | **Not built** (confirmed) | No push or service-worker code | |
| Sell | Gift cards | /gift-cards | Not built | **Not built** (confirmed) | Code says so: `packages/ui/storefront/clean/checkout.tsx:108` | |
| Grow | Website on restaurant's own domain | /restaurant-websites | Unknown | **Live** | Attach `apps/ros/server/services/website-domain-service.ts:258` → `apps/ros/server/vercel/domain-client.ts:294`; serve by host `apps/sites/proxy.ts:105` → `packages/db/site-resolver.ts:38-52` | Wuntab staff attach the domain; restaurants can't self-serve (`apps/ros/server/auth/capabilities.ts:80-85`). |
| Grow | Custom branding / themes | /restaurant-websites | Unknown | **Live** | `apps/sites/app/%5Fsites/[siteId]/(site)/layout.tsx:37-57`; brand colour `packages/ui/storefront/clean/theme-root.tsx:38-39` | Three themes. Staff-set. Brand colour applies on the clean theme and the ordering pages. |
| Grow | Website editor (draft → publish) | /restaurant-websites | Unknown | **Live** (staff-only) | Save `apps/ros/server/services/website-service.ts:204`; publish `:309-350` → `apps/ros/server/repositories/website-repository.ts:574` | Wuntab staff edit and publish; there's no restaurant-facing editor. "We build and run it for you" is accurate. |
| Grow | Menu served as server-rendered HTML | /restaurant-seo | Unknown | **Live** | `apps/sites/app/%5Fsites/[siteId]/(ordering)/menu/page.tsx:45-94` → `ordering-menu.tsx:97`; checked by `apps/sites/e2e/seo.spec.ts:59-100` | Dish names and descriptions are in the first HTML response. Prices are in the first HTML via JSON-LD. |
| Grow | Structured data (JSON-LD) | /restaurant-seo | Unknown | **Live** | Generators `packages/domain/storefront-seo.ts:294-553` (Restaurant, Menu, MenuItem, Offer, FAQPage, Breadcrumb…); emitted `packages/ui/seo/json-ld.tsx:9-15` | No review or rating schema. |
| Grow | Dish / cuisine / location pages | /restaurant-seo | Unknown | **Partial** | Tags `apps/sites/app/%5Fsites/[siteId]/(site)/tags/[tag]/page.tsx:61`; places `(site)/places/[area]/page.tsx:57`; locations `(site)/[locationSlug]/page.tsx:61`; sitemap `apps/sites/app/%5Fsites/[siteId]/sitemap.ts:53-65` | Live: tag (cuisine/dish-type), area and location pages, in the sitemap. Not live: a page per dish (dishes open as `/menu?item=`, canonical `/menu`). |
| Grow | Search-appearance monitoring | /restaurant-seo | Unknown | **Partial** (staff-only) | Search Console client `packages/services/search-console/client.ts:276-328`; on publish `website-service.ts:347-350` → `packages/services/search-console/announce.ts:36-69`; SEO score and nightly probe `packages/domain/storefront-seo-score.ts:289`, `apps/ros/app/api/cron/seo-monitor/route.ts:30` | Live: sitemap submitted and URLs inspected on every publish, plus an SEO score, all run by Wuntab staff. Not live: anything a restaurant can see, or click and impression data. |
| Grow | Restaurant listings management | /listings | Unknown | **Not built** | Hard-coded not-built check `storefront-seo-score.ts:941-950` | |
| Grow | QR feedback | /guest-feedback | Unknown | **Unknown** (needs Signal access) | Not in sabal-ros | |
| Grow | NFC feedback | /guest-feedback | Unknown | **Unknown** (needs Signal access) | Not in sabal-ros | |
| Grow | Manager alerts on low feedback | /guest-feedback | Unknown | **Unknown** (needs Signal access) | Not in sabal-ros | |
| Grow | Surveys | /guest-feedback | Unknown | **Unknown** (needs Signal access) | Not in sabal-ros | |
| Grow | Satisfaction / feedback dashboard | /guest-feedback | Unknown | **Unknown** (needs Signal access) | Not in sabal-ros | |
| Grow | Review requests | /reviews | Unknown | **Unknown** (needs Signal access) | Not in sabal-ros | Signal's public site describes review gating (recorded before Signal went off limits). Truth rule 8 applies if it's ever proven. |
| Grow | Review monitoring | /reviews | Unknown | **Unknown** (needs Signal access) | Not in sabal-ros | |
| Grow | Loyalty / rewards | /loyalty | Not built | **Not built** (confirmed) | Code says so: `packages/ui/storefront/themes/clean-home.tsx:42` | |
| Grow | Customer database | /customers | Unknown | **Live** | `apps/ros/app/(dashboard)/customers/page.tsx:25-68` → `apps/ros/server/repositories/customer-repository.ts:113-149`; detail `customers/[customerId]/page.tsx:59-147` | Name, contact, orders, spend, last 50 orders. No export. Customers appear after a paid order. |
| Grow | Marketing opt-in at checkout | /customers | (new row) | **Partial** | Stored `placement.ts:478`; `packages/db/migrations/0083_orders_marketing_opt_in.sql:1-11` | Live: diners can tick email or text offers, and it's recorded. Not live: anything sent. |
| Grow | Email campaigns | /email-marketing | Not built | **Not built** (confirmed) | No customer email provider | Not planned per the brief; don't mention. |
| Grow | SMS campaigns | /sms-marketing | Unknown | **Unknown** (needs Signal access) | Not in sabal-ros: Twilio is transactional only (`customer-sms.ts:83-122`) | Not built in sabal-ros. Signal's site lists SMS campaigns, unproven. |
| Grow | Win-back campaign | /restaurant-marketing | Unknown | **Not built** | No code | |
| Grow | Reorder campaign | /restaurant-marketing | Unknown | **Not built** | No code | |
| Grow | Birthday campaign | /restaurant-marketing | Unknown | **Not built** | No code | |
| Grow | Abandoned-order campaign | /restaurant-marketing | Unknown | **Not built** | No code | |
| Grow | Customer segments | /restaurant-marketing | Unknown | **Not built** | No code | Only New/Returning counts. |
| Operate | Menu management (items, prices, photos, modifiers) | /menu-management | Unknown | **Live** | `apps/ros/app/(dashboard)/menu/actions.ts:126, 162-235` → `apps/ros/server/services/menu-service.ts:329-371` → `menu-repository.ts:546, 601-610`; storefront reads live `packages/services/websites/published-menu.ts` | Items and prices are shared across locations. Per-location prices are not built (nothing writes the override). |
| Operate | Menu file import | /menu-management | Unknown | **Partial** | `apps/ros/server/services/menu-import-service.ts:49-52, 199-215, 335-454` | Live: Wuntab staff import a spreadsheet, PDF or photo (AI vision). Not live: restaurant self-serve, or importing modifiers. |
| Operate | AI-drafted menu / website copy, human approve | /ai | Unknown | **Live** | Anthropic client `packages/services/ai/client.ts:56-64, 240-252`; dish descriptions `apps/ros/app/(dashboard)/menu/_components/item-editor-drawer.tsx:265-279` → `apps/ros/server/services/menu-description-service.ts:163-172` (writes nothing; operator saves); website copy by staff `apps/ros/server/services/page-copy-service.ts:51` | Nothing auto-publishes. Restaurants draft dish descriptions themselves; website copy is drafted by staff. |
| Operate | Operator AI assistant | /ai | Unknown | **Not built** | No chat or assistant code | |
| Operate | AI menu optimization / recommendations | /ai | Unknown | **Not built** | "Goes well with" pairings are set by hand (`apps/ros/server/services/menu-recommendation-service.ts`) | |
| Operate | Order management (incoming → completed) | /order-management | Unknown | **Live** | `apps/ros/app/(dashboard)/orders/page.tsx:86` → `orders/actions.ts:53-59` → `apps/ros/server/services/order-service.ts:248-276` → `apps/ros/server/repositories/order-repository.ts:665-734`; refund and void `orders/actions.ts:61-71` | Statuses New → Confirmed → Preparing → Ready → Completed, plus Cancelled and Scheduled views. Staff-entered orders are not built. |
| Operate | Restaurant hours enforced | /order-management | Unknown | **Live** | Set `apps/ros/app/(dashboard)/settings/online-ordering/structure-actions.ts:93, 103`; enforced `ordering-availability.ts:223-231`, `order-service.ts:240-264` | Per location, with holiday hours. |
| Operate | Pause online ordering | /order-management | Unknown | **Live** | `apps/ros/app/(dashboard)/settings/online-ordering/actions.ts:55-61` → `apps/ros/server/repositories/ordering-settings-repository.ts:157`; enforced `ordering-availability.ts:167-171, 221, 328`, `order-service.ts:252-264` | Timed or indefinite, with a message. |
| Operate | Prep-time controls | /order-management | Unknown | **Live** | `apps/ros/app/(dashboard)/settings/online-ordering/actions.ts:67-75`; applied `ordering-availability.ts:187-191, 236-237`, `order-service.ts:244-268` | Default plus rush override. Feeds the promised time. |
| Operate | Order printing (kitchen ticket) | /order-management | Unknown | **Partial** | `packages/services/printing/kitchen-fulfillment.ts:14-25` → Clover `print_event` (see Clover above) | Live: printing on the Clover device for Clover restaurants. Not live: any other printer (Conflict 4). |
| Operate | Kitchen text message (fallback) | /order-management | (new row) | **Live** | `packages/services/messaging/kitchen-sms.ts:19-87`; text `packages/domain/printing/kitchen-ticket.ts:47-58` | Sent on every paid order where Clover isn't used or fails. A one-line summary, not a ticket. Not a backup for Clover orders. |
| Operate | Kitchen display | /kitchen-display | Not built | **Live** | `apps/ros/app/(kds)/kds/page.tsx:36, 53`; polling `apps/ros/app/(kds)/kds/_lib/use-order-stream.ts:24, 76` → `apps/ros/app/api/kds/queue/route.ts:37-50`; bump `apps/ros/app/(kds)/kds/actions.ts:99-106` → `apps/ros/server/services/kds-service.ts:116-169` | **The brief was out of date.** It works: refreshes every 5s, staff bump tickets, and conflicts between tablets are handled. It isn't linked from the dashboard nav (`apps/ros/app/(dashboard)/_lib/nav-items.ts:29-37`), so staff open `/kds` directly. |
| Operate | Clover order injection with payment recorded | /integrations | Unknown | **Live** | See "Clover, end to end" above | Clover is a live POS integration, not Coming. App Market approval is pending (owner). |
| Operate | Payments: card checkout via NMI | /payments | Unknown | **Live** | `packages/services/payments/nmi.ts:92-104` via `packages/services/ordering/payment-flow.ts:93-134` | One platform merchant account (Conflict 2). Truth rule 7: never imply Wuntab is the processor. |
| Operate | Analytics | /analytics | Unknown | **Live** (the metrics listed above only) | See "Analytics" above | One location at a time. |
| Operate | Reservations | /reservations | Not built | **Not built** (confirmed) | No code | Not planned per the brief; don't mention. |
| Operate | Waitlist | /reservations | Not built | **Not built** (confirmed) | No code | |
| Scale | Multiple locations per restaurant | /multi-location | Unknown | **Partial** | Switcher `apps/ros/app/(dashboard)/_actions/location.ts:31-73`; create `apps/ros/app/(dashboard)/settings/locations/actions.ts:30-34`; per-location orders, hours, availability, analytics | Live in the dashboard. Not live: per-location prices, a cross-location rollup, and (likely) ordering from a second location on the storefront (Conflict 6). |
| Scale | Organization / franchise controls | /enterprise | Unknown | **Not built** | Organization → locations only (`packages/db/schema/tenancy.ts:329, 379, 388`) | No brand, group or franchise layer. |
| Scale | Staff accounts and roles | /enterprise | Unknown | **Live** | Roles `packages/db/migrations/0002_seed_authz.sql:25-64`; enforced `apps/ros/server/auth/permissions.ts:60-82`; invites `apps/ros/server/services/team-service.ts:204-234` | Four fixed roles (owner, administrator, manager, employee). No custom roles. |
| Scale | White label | /partners | Unknown | **Not built** | Hard-coded "POWERED BY WUNTAB" (`packages/ui/src/brand/powered-by-wuntab.tsx:32`) | |
| Scale | Delivery integration: DoorDash Drive | /integrations, /delivery | Unknown | **Unknown** | Code complete: quote `packages/services/delivery/provider.ts:228`, dispatch on payment `provider.ts:262-275` via `accept-service.ts:183` | Sandbox by default (Conflict 3). **To settle:** owner confirms production DoorDash credentials are live. |
| Scale | Delivery integration: Burq | /integrations | (new row) | **Not built** | Config, a signature check and request builders only (`packages/services/delivery/burq/config.ts`, `packages/domain/delivery/burq/requests.ts:2` "No fetch"); nothing imports them | A design note exists; no adapter. |
| Scale | Restaurant's own drivers | /delivery | (new row) | **Not built** | Delivery requires a DoorDash quote (`placement.ts:382-386`) | The live FAQ's "If you have your own drivers, we set that up" is unsupported. |
| Scale | Delivery tracking (courier status) | /delivery | Unknown | **Unknown** | Code complete: webhook `apps/ros/app/api/webhooks/doordash/drive/route.ts:14-35` → `packages/services/delivery/webhook-service.ts:44-126` → `track-order-view.tsx:74-112` | Depends on DoorDash production, as above. |
| Scale | Delivery zones | /delivery | Unknown | **Not built** | No zone or radius code; DoorDash decides serviceability (`provider.ts:162-168`) | |
| Scale | Delivery fee to customer | /delivery | Unknown | **Unknown** | The DoorDash quote passed through 1:1 (see "Delivery fee") | The code is complete; it's Unknown only because delivery itself is. |
| Scale | Payment integration: NMI | /integrations | Unknown | **Live** | As Payments | |
| Scale | Text-message integration: Twilio | /integrations | Unknown | **Live** | `packages/services/messaging/customer-sms.ts:50-81` | Needs the env vars set. |
| Scale | POS integrations other than Clover | /integrations | Coming (candidate) | **Coming** | None in code | Coming Soon label only (spec rule 2). |

## Not checked from code

- **Checkout taps:** "Three taps and two boxes to pay" holds only on the clean theme with Apple Pay and an item without required options. The classic theme, the default, asks for three boxes and has a cart step (`packages/ui/ordering/ordering-view.tsx:699-719`). Don't publish the claim.
- **What is switched on in production:** DoorDash credentials, Twilio, which locations use Clover. This needs the Vercel env and a database query, not code.

## Shallow-clone limits

The clone is `--depth 1` on `main`, and it was not deepened. It can't show history: for example, whether the 5% service fee existed earlier and was removed, or when. It can't show branches other than `main` either. A bounded fetch of history would settle the first if the owner wants it.
