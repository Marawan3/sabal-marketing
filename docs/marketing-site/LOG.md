# Marketing site report log

One entry per PR or report, newest first, in plain language. Each entry says what changed, why, who merged it, and how it was checked.

---

## Platform findings for owner

Recorded 2026-10-02 from the read-only audit of sabal-ros at `92b07e6`. These are for the record only; no action has been taken on them. File:line for each is in `REGISTER.md`.

1. **There is no 5% service fee in checkout.** The total is subtotal − discount + tax + delivery fee + tip (`packages/domain/ordering/order-pricing.ts:352`). The storefront tells diners "No service fee" (`packages/ui/storefront/clean/checkout.tsx:383, 401`). No code bills restaurants either, so in code the platform earns nothing per order.
2. **Card payments run on one platform NMI merchant account.** Money doesn't settle to the restaurant's own account; the dashboard's Payments page says so (`apps/ros/app/(dashboard)/settings/payments/page.tsx:12-15`).
3. **Delivery is DoorDash Drive, sandbox by default.** It works only with platform credentials and a per-location switch that defaults to off (`packages/services/delivery/config.ts:16`, `packages/db/schema/tenancy.ts:175`). Production access isn't provable from code. The diner pays DoorDash's quote unchanged.
4. **Kitchen printing works only through Clover.** Other kitchens get a one-line text message and no printed ticket (`packages/services/printing/kitchen-fulfillment.ts:14-25`).
5. **Catering, careers and contact submissions are stored, but the restaurant isn't told and can't see them.** Only platform admins can (`packages/services/websites/submissions.ts:71-85`).
6. **Possible defect:** on a site with more than one location, storefront checkout always uses the primary location (`apps/sites/app/%5Fsites/[siteId]/(ordering)/order/actions.ts:64, 100`). A test order on a two-location site would confirm it.
7. **The kitchen display works but isn't linked from the dashboard menu.** Staff reach it at `/kds`.
8. **Cancelling an order can text any 10-digit number on the order.** Recorded 2026-10-05 (sabal-ros `815ca6d`). Cancellation sends the customer a text (`apps/ros/server/services/order-cancellation-service.ts:431-433`). The phone check accepts any 10-digit number, including fictional 555 numbers (`packages/services/messaging/customer-sms.ts:42-47`). This doesn't affect the demo seed: it runs on a database branch with a preview that has no Twilio credentials. It would matter if demo data were ever seeded on production, where a staff member cancelling a seeded order would trigger a real send. Fix skipped on the owner's instruction.
9. **Preview and production share one blob storage key.** Recorded 2026-10-05. On the sabal-ros Vercel project, `BLOB_READ_WRITE_TOKEN` is a single variable set for Development, Preview and Production together. An image uploaded from any preview deployment (menu photo, logo, gallery) is written to the same store production serves from. Uploads can also go through a second route, a Vercel OIDC token plus `BLOB_STORE_ID` (`apps/ros/server/storage/gallery-blob.ts:17-22`). Preview has its own `BLOB_STORE_ID` variable, but whether it names a different store wasn't checked, because values weren't decrypted. For the demo seed preview only, both variables are blanked on branch `demo/seed-orders`, so uploads there fail closed. Other previews are unchanged.

---

## 2026-10-07 · PR #17: site font switched from Bricolage Grotesque to Archivo (merged)

**Merged by:** Claude, on the owner's "merge 17". Squash commit `8a2a60d` on `main`, from branch `marketing/archivo`.

**Why:** the owner felt Bricolage Grotesque looked generic and chose Archivo, with exact settings.

**What changed:**
- **Font:** Archivo everywhere, with variable weight and its width axis. Bricolage is removed.
- **Headlines:** heavier (750) and 10% wider, and set smaller to suit: 34px on a phone, 70px on desktop.
- **Card titles:** 650 at 4% wider.
- **Body text, buttons, nav and FAQ:** normal width.
- **Text sizes:** still five site-wide.
- **Headline length:** every page headline is at most 4 lines at 360 wide and 3 lines on desktop. The product-page headline was given more room to get there.
- **Logo:** the WUNTAB wordmark is now drawn as outlines of its original lettering, so it looks the same as before whatever font the page uses.
- **Fallback fonts:** sized to Archivo for each kind of text, so the page doesn't jump when the font arrives. At desktop width nothing moves. At 390, two single lines re-wrap.
- **Mobile menu:** the Sell, Grow and Operate labels now use the nav style.

**How it was checked:**
- **Tests:** 56 Playwright tests passed and 1 was skipped (the existing legal skip). New tests cover:
  - the font settings for each kind of text;
  - no Bricolage left in the page or stylesheets;
  - headline line limits on every page;
  - no headline wider than its container;
  - the outlined logo.
- **Logo pixel comparison:** about 1.5% of inked pixels differ, all from edge anti-aliasing.
- **Evidence:** before and after screenshots of the homepage, `/online-ordering` and `/pricing` at 360, 390 and 1440, in `docs/marketing-site/evidence/archivo/`.

---

## 2026-10-07 · PR #16: design pass on the homepage, product pages, nav and footer (merged)

**Merged by:** Claude, on the owner's "merge" after reviewing the preview and the production screenshots. Squash commit `e33616f` on `main`, from branch `marketing/design-pass`.

**Why:** the owner asked for a calmer, more visual site with less text, built to their brief and their reference notes (owner.com itself wasn't reachable from the session). They gave the patterns only: no wording, images or customer content were taken.

**What changed:**
- **Homepage, in the owner's order:**
  - a hero with a "Your restaurant's name" field that opens Book a call with the name filled in;
  - outcome tabs (More direct orders, More repeat customers, Less busywork);
  - four product panels;
  - how it works in three steps;
  - one pricing card;
  - What we believe, which stays hidden until the owner writes it;
  - FAQ and the final call to action.
- **Moved off the homepage:** the six-step walkthrough, integrations and multi-location are on `/how-it-works`. A customer stories row is built but shows nothing until real customers are added.
- **Product pages:** the same panels and type. Capabilities are one-line chips. "Where it fits" was removed.
- **Look:** headlines at weight 600, five text sizes site-wide, near-black text, one warm panel colour, a saffron accent, rounded panels, 14px buttons, more space between sections. The logo keeps its navy.
- **Phones:** the header always shows the logo, Get Started and the menu. The menu opens full screen with an accordion for each of Sell, Grow and Operate. Card rows swipe sideways. Tap targets are 44px.
- **Shots:** four landscape photo slots were added. `SHOTS.md` now reads 0 of 24 done. `ASSETS.md` has a source and license table for the photos, which the owner will send with Unsplash links.

**Owner decisions on the PR:**
- The pricing honesty test change was accepted. The homepage shows two short points; `/pricing` keeps the full clause.
- The new styling on `/terms` and `/privacy` was accepted. No wording changed.
- The email fallback stays for the name field.
- The product-page chips stay.

**How it was checked:**
- **Tests:** 53 Playwright tests passed and 1 was skipped (the existing legal skip). The new `tests/design.spec.ts` covers:
  - text sizes and headline sizes;
  - tap targets;
  - the phone header and menu at 360, 390 and 430;
  - swipe rows and the tabs;
  - homepage section order and height;
  - the hidden sections;
  - with zero shots, no empty panel and no gap where an image would go.
- **Homepage height at 390:** 19,989px down to 4,784px with placeholders showing, and 14,472px down to 4,071px as wuntab.com shows it.
- **Sideways scroll at 360:** 14px before, none after.
- **Evidence:** `docs/marketing-site/evidence/design-pass/`.
- **Not run:** Lighthouse, because it isn't installed in the session.

---

## 2026-10-07 · PR #15: preview deployments show missing-shot placeholders; SHOTS.md generated (merged)

**Merged by:** Claude, self-merge on green on the owner's instruction. Squash commit `71bec8b` on `main`, from branch `marketing/shots-preview`.

**Why:** the owner wants to see where each missing screenshot goes without it showing on wuntab.com, and wants a shot list that can't drift from the site.

**What changed:**
- Preview deployments show a dashed box where a shot is missing, with what it should show, the file name and the size (for example `orders-board.webp · 1440×900`). wuntab.com still shows nothing, as after PR #14. The switch is Vercel's own `VERCEL_ENV` ("preview" vs "production"), so there's no flag to remember. Local builds behave like production.
- [`docs/marketing-site/SHOTS.md`](SHOTS.md) is generated from the same list the pages read (`src/lib/shot-placements.ts`). One row per shot gives the file, size, what it should show, every page and section, and Missing or Done. Status depends on whether the file is in `public/shots/`. The count at the top reads **0 of 20 done**. Four catalog shots belong to products without a page yet. They're listed separately and not counted.
- Every build regenerates it. On Vercel the build checks it instead, and fails if the committed copy is out of date. To refresh it, run `npm run shots`.

**How it was checked:**
- Locally, 41 Playwright tests passed and 1 was skipped (the existing legal-placeholder skip). New tests check three things: the production build contains no "Screenshot placeholder" text; a preview build shows a box for every missing shot on every page it belongs to, with its file name and size; and SHOTS.md matches the generator.
- tsc, eslint, honesty, copy-lint and boundary-check are clean.
- On the Vercel preview for the PR, the build log shows "shots-doc: SHOTS.md is up to date". `/order-management` showed the five boxes: orders-board, kitchen-ticket, order-drawer, ordering-settings and kds.

---

## 2026-10-07 · PR #14: hotfix, screenshot placeholders removed from the live site (merged)

**Merged by:** Claude, self-merge on green on the owner's instruction. Squash commit `b34195a` on `main`, from branch `marketing/hide-placeholders`.

**Why:** after PR #13, 15 dashed "Screenshot placeholder" boxes were live on the homepage and product pages.

**What changed:**
- A screenshot frame with no real file in `public/shots/` now renders nothing: no box, no label, no reserved space. The column or gallery around it goes too.
- Every section keeps its text.
- When a real file lands, its frame returns on its own.

**How it was checked:**
- **New test:** `tests/no-placeholders.spec.ts` fails if "Screenshot placeholder" appears in any built or served page. It fails against the old code and passes on the fix.
- **Full suite:** 37 passed, 1 skipped, built with production's indexing settings.
- **Visual check:** the homepage, `/online-ordering` and `/how-it-works` at 390 and 1440.

---

## 2026-10-07 · PR #13: phase 1 platform site (merged)

**Merged by:** Claude, on Marawan's instruction ("merge 13"). The PR was marked owner-review-only. Squash commit `51135a3` on `main`, from branch `marketing/phase-1`. CI was green (Vercel) and the branch merged cleanly.

What changed:
- **Nine pages:** `/`, `/how-it-works`, `/pricing`, and six product pages (`/online-ordering`, `/delivery`, `/catering`, `/restaurant-websites`, `/restaurant-seo`, `/order-management`).
- **Navigation:** a product mega-menu and an updated footer.
- **Screens:** every product screen is still a marked placeholder. The real screenshots aren't captured yet.

The site went live with two claims the PR flagged as not true in the platform today:
- **The 5% diner service fee:** checkout charges none.
- **The restaurant as merchant of record with its own payment account:** cards run on one platform account.

Both are owner findings 1 and 2 above. The full build list is in the PR description.

---

## 2026-10-05 · Demo order seed: dry run on a database branch (sabal-ros, not merged)

**Not merged.** Branch `demo/seed-orders` in sabal-ros (commit `1a6f5c5`) holds the seed scripts and migration 0085. There is no PR to main.

What it is: a guarded seed that gives the demo restaurant about 60 days of invented order history plus a live kitchen board, for product screenshots. It runs only on a Neon database branch (`demo-seed-dryrun`) made from production. Production was not written to. The demo's Clover connection on production was fingerprinted before and after the branch was set up, and it is unchanged.

How it was checked:
- 12 guard tests pass.
- The dry run went seed, reset, reseed, then live:
  - **Seed:** 1,459 orders.
  - **Reset:** 0 left.
  - **Reseed + live:** 1,467 orders.
- Other restaurants' rows stayed flat at every step.
- Every order total matches checkout's own pricing code.

Full counts and the side-effects table are in `apps/ros/scripts/demo-orders/README.md` on that branch. The cancel-text gap is logged above as finding 8.

---

## 2026-10-02 · PR #12: spec amended, the register becomes a build list (merged)

**Merged by:** Claude, self-merge on green (docs only). Squash commit `98ca3f2` on `main`, from branch `marketing/spec-amend-findings`.

What changed:
- `SPEC.md` sections 0, 2, 3 and 16 are amended on the owner's instruction:
  - The site showcases every product as available, with no Coming Soon labels.
  - The register is a build list, not a publishing gate.
  - The truth rules are reduced to seven: pricing (5% diner fee, $0 restaurant, matching `/terms`), payments (restaurant is merchant of record, WunTab never the processor), no invented proof, no SEO guarantees and no "Google can't read JavaScript", no review gating in copy, no delivery or POS provider names, and the cut list.
- The platform findings above are recorded.

## 2026-10-02 · PR #11: capability register proved against the platform code (merged)

**Merged by:** Claude, self-merge on green (docs only, approved by Marawan). Squash commit `6e02cfe` on `main`, from branch `marketing/register-proof`.

What changed: `REGISTER.md` now cites platform code (sabal-ros @ `92b07e6`, read-only) for every row that could be proved. Rows that depend on Sabal Signal stay Unknown ("needs Signal access"). The file adds four sections: Clover traced end to end, payments, the delivery fee, and the exact analytics metrics an operator sees.

What moved:
- 35 rows from Unknown to Live or Partial.
- 16 rows from Unknown to Not built.
- 12 rows stay Unknown: 8 need Signal access, and 4 are delivery rows waiting on confirmation that DoorDash production is live.
- 4 rows are new.
- The 12 Not built rows from the 09-27 brief were re-checked against the code: 11 are confirmed, and the kitchen display moved to Live (the brief was out of date).

What it found that the live site and legal documents get wrong (owner action, not fixed here):
- There is no 5% service fee in checkout.
- Card payments run on one platform merchant account, and money doesn't settle to the restaurant.
- Delivery is DoorDash sandbox by default.
- Printing works only through Clover.
- Form submissions don't reach the restaurant.

## 2026-10-02 · PR #10: marketing-site spec and capability register (merged)

**Merged by:** Claude, self-merge on green (docs only, approved by Marawan). Squash commit `6976b4e` on `main`, from branch `marketing/report`. Report only; nothing was built.

What it holds:
- `docs/marketing-site/SPEC.md`, committed unchanged. It's the source of truth for the redesign.
- `docs/marketing-site/REGISTER.md`: one row per capability, plus Marawan's decisions of 2026-10-02.

What it found:
- The platform repo couldn't be read from this session, so no capability has code proof yet. Every row is Unknown or, on Marawan's word, Not built, and nothing is cleared to publish.
- Clover order injection ships today, so it's a live POS integration, not "Coming".
- There's no analytics metric the site can name yet.
- Sabal Signal's copy describes review gating (only happy guests are asked for a Google review). Signal is off limits for now, and its rows stay Unknown.

Decisions recorded on 2026-10-02:
- The spec wins over the 09-27 brief: Coming Soon is for POS only, and the homepage doesn't lead with Google.
- Get Started stays "Book a call" until signup is proven end to end.
- PR #6 stays parked and is never merged whole.
- Sabal Signal is off limits.

## 2026-10-02 · PR #8: live homepage copy fix (merged)

**Merged by:** Claude, on Marawan's instruction ("merge 8"). Squash commit `5148325` on `main`.
**Live:** Vercel production deployment for `5148325` is READY. Not curled on wuntab.com, because this session's network policy blocks the domain.

What changed on wuntab.com:
- **New headline:** "Your restaurant's own website, with orders that print in your kitchen." The page no longer leads with Google.
- **Google wording:** removed every line that said or implied Google can't read or run JavaScript. They now say what we do: write the menu into the page itself, with labels that tell Google what each dish is.
- **Proof tickets removed:** the 220 vs 0 tickets, their intro and the "Measured September 2026" footnote are off the page, with nothing in their place. The measurement method was never documented in the repo, and an earlier commit called 220 illustrative.
- **Redirects:** `/platform-terms` now 301s to `/terms` (was 308). `/accessibility` no longer redirects to `/privacy` and returns 404, since nothing links to it.
- **Unchanged:** the "What Google sees" section heading and AI line, kept until the redesign. The Book a call mailto, which already went to hello@wuntab.com.

Checks: lint, honesty, copy-lint and boundary pass; Playwright 25 passed, 1 skipped. Two new tests: one for the two redirects, one that keeps the 220 vs 0 tickets off the page.

Still open: 19 unproven claims stay on the page until platform access lets each be checked against its register row. They're listed in the PR description.

## 2026-10-02 · PR #9: design skill and handoff docs (merged)

**Merged by:** Claude, self-merge on green (docs only, approved by Marawan). Squash commit `db29ee0` on `main`.

What changed: the design skill no longer allows "220 dishes Google can read, vs 0" or "One live restaurant in Orlando, measured head-to-head". It no longer calls the proof tickets the centerpiece, and its motion, image and do/don't sections were cleaned of them too. It records that the tickets come back only with a re-measurement whose method is committed, plus Marawan's approval. HANDOFF.md, ASSETS.md and COPY.md say the same. No site code changed.
