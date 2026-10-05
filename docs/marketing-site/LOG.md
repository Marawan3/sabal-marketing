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
