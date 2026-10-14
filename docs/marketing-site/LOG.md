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

## Follow-ups

Open items the owner asked to be recorded. Newest first. Strike one through when it's done, with the PR that did it.

1. **/about founder section.** Recorded 2026-10-13 (PR #30). Fill `src/lib/founder.ts`: the name, a photo in `public/about/` with its pixel size, and four sentences. It renders nothing until then.
2. **Demo storefront link.** Recorded 2026-10-13 (PR #30). Set `NEXT_PUBLIC_SHOW_DEMO_LINK=true` in Vercel once the demo menu has photos.
3. **/pricing comparison sources.** Recorded 2026-10-13 (PR #30). The delivery-app cells for customer fees and customer data cite the largest app's help pages. These were read through search results, because help.doordash.com doesn't resolve from the session. Owner to open them and confirm.
4. **Contact form: switch on sending.** Recorded 2026-10-13 (PR #29). /contact works, but it can't send until `CONTACT_EMAIL_API_KEY` (a Resend key for this site only) is set in Vercel. Until then it shows hello@wuntab.com instead. The steps and the DNS records for Namecheap are in the PR #29 description. Careful with Namecheap's Custom MX switch if hello@ uses Namecheap forwarding.
5. ~~**/integrations and the payment account.**~~ Closed in PR #31 (2026-10-13). The owner chose to describe the intended model: each restaurant has its own merchant account with our payment partner and is paid through it, and WunTab takes 5% from the customer at checkout. /integrations' line and the FAQs stay. Per-restaurant merchant accounts are a build commitment in REGISTER.md, next to the 5% fee.
6. ~~**Homepage height at 390: 8,070 px, target under 7,000.**~~ Done in PR #28 (2026-10-13): the outcomes are tabs on phones too, and the homepage is 6,770 px at 390. A test keeps it under 7,000.
7. ~~**Catering visual vs. the product.**~~ Done in PR #26 (2026-10-13): /catering and the homepage row describe the request form. WunTab staff forward every request to the restaurant (owner, 2026-10-13). The homepage tab and /how-it-works say "catering requests".
8. ~~**Receipt visual.**~~ Closed 2026-10-13: the owner is fine with it as an illustration.
9. ~~**Delivery phone examples.**~~ Closed 2026-10-13: the owner is fine with the example fee and address, and with "Tip".
10. ~~**/how-it-works stage visuals.**~~ Done in PR #30 (2026-10-13): "Build the relationship" shows the loyalty reward card, and "Bring them back" shows the customer's confirmation text in the product's own words. The product sends no "ready" text, so the visual doesn't claim one.
11. ~~**Hero: the checkout shows no 5% service fee, while the pricing section says customers pay 5% at checkout.**~~ Done in PR #23 (2026-10-13). The owner decided to add a "Service fee (5%)" line to the phone's checkout, between the subtotal and the total, at 5% of the subtotal ($0.60). The total is now $15.78 everywhere it appears. The live checkout still has no fee (platform finding 1).
12. **Hero: replace the dish photo with the original.** Recorded 2026-10-13 (PR #22). The meatballs photo is a 174px crop of the menu-editor screenshot and looks soft in the item sheet. The 1024px original is in the demo's photo storage, which the session couldn't reach. The owner decided on 2026-10-13 to keep the current photo until they send the original. Then swap `public/hero-demo/spiced-lamb-meatballs.webp` and `photoSize` in `src/lib/demo-order.ts`.
13. ~~**Hero: wording.**~~ Closed 2026-10-13. The owner decided to keep the product's own labels ("Add item", "Pay", "Order received", "Ready by").
14. ~~**Retake `order-drawer` once the 5% service fee is in checkout.**~~ Closed by PR #24 (2026-10-13): the site no longer shows screenshots.
15. ~~**The multi-location diagram on `/how-it-works` is cramped on phones.**~~ Done in PR #24 (2026-10-13): the locations stack on phones.
16. ~~**3x retakes of all batch-1 screenshots.**~~ Closed by PR #24 (2026-10-13): screenshots replaced with built visuals; PR #20 closed as superseded.
17. ~~**`analytics.png` retake pending.**~~ Closed by PR #24 (2026-10-13): no screenshots on the site.

---

## 2026-10-14 · PR #42: reduced motion, each scroll is a dip (merged)

**Merged by:** Claude, on the owner's instruction ("merge on green"). Squash commit `184def8` on `main`, from branch `claude/wuntab-marketing-brief-49dbha`. Chromium and WebKit iPhone CI were both green.

**Why:** with reduced motion the scrolls had nothing to fade, so the hero's first visible change came a second late. The owner chose a dip, with no duplicate screens.

**What changed:**
- **Scrolls are dips.** This covers the hero (menu at 0.9 s, checkout at 7.0 s), the storefront, delivery (both scrolls) and catering (down to the form and back up). At each one the content fades to 0 (75 ms), jumps while invisible (1 ms) and fades back (74 ms), starting when the normal-mode scroll starts.
- **Catering** now scrolls back up for its thanks, like the normal-mode version.
- **Tests:**
  - With reduced motion a transform may change only while its element is at opacity 0, sampled at each change's start, middle and end.
  - The pace test requires every reduced change to fall inside the 150 ms after a step or normal-mode change.
  - Two WebKit-only test assumptions were fixed: WebKit doesn't report a change between `var()` keyframes, and its slower hydration let the hero's 150 ms first-run hold finish before the check.
- **Recordings:** side-by-side recordings of the hero and storefront at 393×852 are in `evidence/reduced-motion-dip/`.

**Left as is:** the kitchen board's and settings card's button presses (a 2% shrink) have no reduced-motion equivalent.

---

## 2026-10-14 · PR #40: reduced motion keeps the motion pace (merged)

**Merged by:** Claude, on the owner's instruction ("merge on green"). Squash commit `9e99f34` on `main`, from branch `claude/wuntab-marketing-brief-49dbha`. Chromium and WebKit iPhone CI were both green.

**Why:** on the owner's iPhone, reduced-motion mode felt slower than normal mode.

**What changed:**
- **Crossfades:** every reduced-motion crossfade is now 150 ms (was 200 ms), and starts when the normal-mode change starts. The tap ring fades out at the same moment as the normal-mode tap.
- **A real Safari bug, found by the new test in WebKit:**
  - WebKit read keyframes that carried an easing as the element's own value. The hero backdrop's and sheet's holds came out wrong, so in Safari they drifted across the whole hold, in both modes.
  - The generator now puts the easing on the animation instead. Chromium renders identically: 21,840 sampled frames match before and after.
- **New pace test:** per visual, at 393 and 1440, both modes must share the clock and the last step change (within 100 ms). Every crossfade must start on a normal-mode change and last at most 150 ms, and reduced motion must settle no later.
- **Test fix:** the player marks the observer's last report in `data-seen`. A test now waits for it instead of racing hydration in WebKit.
- **Recordings:** side-by-side recordings at 393×852 of the hero and kitchen board are in `evidence/reduced-motion-pace/`.

**Still for the owner:** the held scrolls have no fade, so the hero's first visible change in reduced mode is at 1.9 s instead of 0.9 s. The storefront, delivery and catering phones are the same. A fade can't show a scroll without moving something.

---

## 2026-10-14 · PR #34: the visuals in real WebKit on an iPhone profile; WebKit runs on every PR (merged)

**Merged by:** Claude, on the owner's instruction ("merge on green"). Squash commit `3fbb7cb` on `main`, from branch `claude/funny-euler-utwhob`. The WebKit iPhone job passed 41 of 41, across `webkit-iphone` and `webkit-iphone-reduced-motion`. The Vercel preview of the head `9bee54f` built READY, with no team-membership warning.

**Why:** the owner reported that after PR #32 the visuals still don't start in Safari on an iPhone 17 Pro. They had never been run in WebKit.

**Where it ran:** the WebKit download hosts were still refused in the build session. So WebKit 26.6 (Playwright's build) ran on a GitHub Actions runner, with an iPhone profile: 393×852, 3x, touch, and an iOS 26 Safari user agent.

**What WebKit showed before any change** (`evidence/webkit-iphone/before/report.json`):
- **Hydration:** React hydrated. There were no console errors and no page errors on load. The pause button toggled and the calculator computed. The mobile menu opened, but it is a native `<details>` and opens without React.
- **The hero** was running: 32 of 32 animations, its clock at 3,020 ms 3 seconds after load. The observer reported it intersecting.
- **The other visuals:** storefront, kitchen and receipt were paused while off screen. Each was paused at 806 ms, the time the observer took to send its first report. Scrolled into view, each one ran: storefront at 3,779 ms after 3 seconds, while kitchen and receipt had played through and held their last frame. The observer reported each one intersecting. Six other visuals on the page are hidden at phone width.
- **`?debug=motion`:** the panel on wuntab.com in WebKit agrees (`before/debug-panel-live-393x852.png`).
- **So "never starts" did not reproduce in WebKit.**

**What WebKit got wrong:**
1. **The hero's turn on phones.** After the confirmation the phone turns over to the kitchen. WebKit kept painting the front face after it had turned away, despite `backface-visibility: hidden`, so the phone showed the confirmation mirrored and never the kitchen ticket (`turn-before-webkit.png`). Five CSS variants were tried in WebKit. Giving the front face its own layer made the back face show through mirrored before the turn instead.
2. **Three timing tests.** WebKit keeps counting a paused visual's clock for 60 to 270 ms after a CSS pause, then settles back to where the pause was asked for. The tests read it in that window. The visuals do hold.

**What changed:**
- **The fix** (`scripts/motion-spec.mjs`, regenerated into `hero-order-demo.module.css`): on phones, each face goes out at the moment it passes edge-on. That is 295 ms into the turn's 800 ms ease, and 221 ms into the turn back. Opacity only. Chromium looks the same as before.
- **New test:** at 390, the phone is bright (the confirmation) before the turn and dark (the kitchen) after it, read from the pixels of a screenshot. It failed in WebKit before the fix (221.7 after the turn, limit 90) and passes after.
- **Tests:** `clock()` in `tests/motion.ts` applies styles and waits for a pending play or pause to land before reading.
- **CI:** `.github/workflows/webkit-iphone.yml` runs the `webkit-iphone` project (hero, visuals and motion tests) on every pull request and on `main`.
- **Script:** `scripts/webkit-evidence.mjs` writes the report, debug panel screenshots and GIFs.

**Evidence:** `evidence/webkit-iphone/`, with `before/` and `after/`. Each holds recordings of the hero, storefront and kitchen board at 393×852, the debug panel locally and on wuntab.com, and `report.json`. `turn-before-webkit.png` and `turn-after-webkit.png` show the turn frame by frame.

**Still open, owner to do:** WebKit doesn't reproduce "never starts" with motion on. PR #35, merged while this was in progress, covers the other case: with Reduce Motion on, the visuals now run as crossfades instead of showing stills. If anything is still frozen on the iPhone, open wuntab.com/?debug=motion and send a screenshot of the panel.

**Commit identity:** every commit on this branch was re-authored as `Marawan3 <90366029+Marawan3@users.noreply.github.com>`. The temporary evidence workflow, the only place `ci@users.noreply.github.com` was used, is deleted. Its five `webkit-evidence/*` branches still exist and still hold "ci" commits: the build session may push only to its own branch, so deleting them was refused. Owner to delete them on GitHub.

---

## 2026-10-14 · Commit identity: the repo owner, not "ci"

**Why:** the temporary WebKit evidence workflow on PR #34's branch committed as "ci", using GitHub's noreply address for the login `ci`. GitHub credits that address to an unrelated real account ("ci"), who is not on the Vercel team. Those evidence branches also hold only screenshots, so each of their Vercel previews failed to build (no `app` directory). Production deploys of `main` were never affected.

**What changed:**
- **Workflow:** on `claude/funny-euler-utwhob` (PR #34), `.github/workflows/webkit-evidence.yml` now commits as `Marawan3 <90366029+Marawan3@users.noreply.github.com>`. Commit `d1e3bef`, pushed with `[skip ci]` so it didn't start another run. No other file or branch in the repo has that address.
- **Build session git identity:** the session's local git config uses the same owner identity.
- **The cloud environment sets the author itself.** It sets `GIT_AUTHOR_NAME=Fable 5.1` and `GIT_AUTHOR_EMAIL=agent@wuntab.com`, which override git config. Build sessions clear them on each commit until they're removed from the environment's settings.
- **This entry** is the first commit authored as the owner, and its deploy is the check.

**Not done:** the five existing `webkit-evidence/*` branches still carry the old "ci" commits. They belong to PR #34's evidence runs; delete them when that PR is done.

---

## 2026-10-14 · PR #35: with reduced motion, the visuals run as crossfades (merged)

**Merged by:** Claude, on the owner's instruction ("merge on green"). Squash commit `5a419bf` on `main`, from branch `claude/wuntab-marketing-brief-49dbha`.

**Why:** the owner's iPhone `?debug=motion` panel showed every visual as "still (reduced motion)" with no animations running. Safari reports reduce-motion as on, many iPhones have it set, and a still reads as a broken demo.

**What changed:**
- **The same stories run, as crossfades:**
  - With reduced motion, every story runs on the same timings, including the hero loop.
  - Every change is a 200 ms opacity crossfade, and nothing is animated with a transform.
  - Screens that slid in fade in where they land, and the hero phone's turn is a crossfade to the kitchen's side.
  - The spec says, for each moving part, what it becomes. The generator refuses one that doesn't say.
- **The old stills are gone.** The pause button, observer pause, clocks and debug panel work the same in both modes. The panel says "running (reduced motion)".
- **Motion-allowed keyframes are unchanged.**
- **Tests:** a reduced-motion Playwright project runs the visuals tests (WebKit too, once installed). Every visual must run and advance, and nothing may animate a transform.
- **Recordings:** 393×852 recordings with reduced motion on are in `evidence/reduced-motion/`.

**How it was checked:**
- **Tests:** 117 Playwright tests passed and 1 was skipped. The related specs passed 183 of 183 across three repeats.
- **Animations:** every visual, at 393 and 1440 with reduced motion emulated, had all its animations running and none on transform.
- **Frames:** every step was reviewed on contact sheets. That caught the catering thank-you sitting off screen, now fixed.
- **Height:** the homepage is 6,732px at 390 in both modes.

**Owner to do:** check on the iPhone with Reduce Motion on. `?debug=motion` should read "running (reduced motion)".

---

## 2026-10-14 · PR #32: the visuals play on the browser's own clock, for Safari on iPhone (merged)

**Merged by:** Claude, on the owner's instruction ("merge on green"). Squash commit `5da524f` on `main`, from branch `claude/wuntab-marketing-brief-49dbha`.

**Why:** on an iPhone in Safari the visuals never started. The old player held each visual back until three things agreed: an IntersectionObserver reading (first entry only), a 100ms timer and a site-wide "now playing" lock. In WebKit a stale entry or an unreleased lock froze everything at step 0.

**What changed:**
- **Stories are CSS keyframes:**
  - Each visual's steps are generated by `scripts/motion.mjs` from `scripts/motion-spec.mjs` into the two CSS modules (`npm run motion`).
  - The browser runs them. There is no script tick and no lock.
  - Play-once visuals hold their last frame; the hero loops.
- **The player only pauses:**
  - It starts the visuals on mount.
  - It pauses one only while that visual is fully off screen, reading the last observer entry.
  - The pause button still holds a visual.
  - The demo clocks are set once, on mount.
- **Reduced motion:** unchanged. The stills are byte-identical to before.
- **`?debug=motion`:** on any page it shows each visual's play state, the observer's last `isIntersecting` and its current step.
- **WebKit tests:** an iPhone WebKit project is configured. It can't run in the build session until `cdn.playwright.dev` and `playwright.download.prss.microsoft.com` are allowed.
- **Recordings:** 393×852 recordings of the hero, storefront and kitchen board are in `evidence/safari-player/`.

**How it was checked:**
- **Frames against the old player:** every step of every visual at 390 and 1440 (186 frames) matches it within 0.23% of pixels, which is text antialiasing.
- **Tests:** 103 Playwright tests passed and 1 was skipped. The motion tests passed 108 of 108 across four repeats.
- **Checks:** honesty, copy-lint, boundary-check, lint and typecheck all pass.
- **Height:** the homepage is 6,933px at 390.

**Owner to do:** test on the iPhone. If anything is still frozen, open the page with `?debug=motion` and send a screenshot of the panel.

---

## 2026-10-13 · PR #31: payments, the intended merchant-account model (merged)

**Merged by:** Claude, on the owner's instruction. Squash commit `87080e8` on `main`, from branch `claude/wuntab-marketing-brief-49dbha`.

**Why:** the owner decided the site describes the intended payments model. Each restaurant has its own merchant account with our payment partner and is paid through it, and WunTab takes 5% from the customer at checkout.

**What changed:**
- **/payments:** the flow ends at "Your account". The steps end with "The money goes to your own merchant account". The page adds a line on the 5% and a "Who gets paid?" FAQ. The verified card-data line stays.
- **/pricing:** the "Who gets paid" row is back: "You, through your own merchant account." The delivery-app side reads "The app collects the payment and pays you out, after its commission".
- **REGISTER.md:** per-restaurant merchant accounts are a build commitment, next to the 5% fee (Conflicts 1 and 2). Today's code still settles to one platform account.
- **Processor name:** a new test fails if the payment processor is named on any page or in `src`. The one exception is /privacy. The owner kept that exemption on 2026-10-13, because the published privacy policy names its subprocessors.
- **Follow-up closed:** "/integrations and the payment account". Its line and the FAQs stay, as the owner asked.

**How it was checked:**
- **Tests:** 100 Playwright tests passed and 1 was skipped.
- **Repo checks:** honesty, copy-lint, boundary-check, lint and tsc pass.
- **Evidence:** `docs/marketing-site/evidence/fill-dead-ends/merchant-account/`.

---

## 2026-10-13 · PR #30: filling the dead ends (merged)

**Merged by:** Claude, on the owner's instruction ("merge 30"). Squash commit `9c36113` on `main`, from branch `claude/wuntab-marketing-brief-49dbha`.

**Why:** close the dead ends (Works with items that went nowhere), and add what a new company can honestly back: founding restaurants, a sourced comparison, and pages for what the product does.

**What changed:**
- **Six secondary product pages** on the template: /online-menu, /upsells (renamed "Recommended Add-ons"), /loyalty, /kitchen-display, /menu-management and /payments.
  - They're linked from the footer and their parents' Works with, not the mega-menu.
  - Every fact was checked in sabal-ros `main` at `a5418d4`; the file:line references are in COPY.md.
- **Loyalty:** not built. It's a build commitment in REGISTER.md, so the page uses outcome-level words only.
- **Works with:** every item links to a page. Restaurant Listings is gone.
- **Homepage:** "We're new. That works in your favor." takes the customer row's slot. The FAQ left the homepage to make room.
- **/pricing:** WunTab next to a delivery app, with four sourced rows and no app named.
- **/about:** the owner's three beliefs, and a founder section that renders nothing until filled.
- **Demo link:** "See a live WunTab restaurant" sits behind `NEXT_PUBLIC_SHOW_DEMO_LINK`, which is off.
- **/how-it-works:** the reward card, and the customer's real confirmation text.

**Left out, because the code contradicts it:**
- "→ your account" on /payments, and a "Who gets paid" row. Money settles to one platform account (REGISTER.md, Conflict 2).
- A "your order's ready" text. The product doesn't send one.
- A "Sold out" label. Sold-out dishes are removed from the menu instead.

**Verified and published:** the /payments security line. Card numbers are tokenized in the payment partner's hosted fields and never reach WunTab; only the card brand and last four are stored.

**Result:** homepage at 390 is 6,732 px with motion and 6,933 px with reduced motion, both under 7,000.

**How it was checked:**
- **Tests:** 99 Playwright tests passed and 1 was skipped. They include `tests/fill.spec.ts`.
- **Repo checks:** honesty, copy-lint, boundary-check, lint and tsc pass.
- **Evidence:** `docs/marketing-site/evidence/fill-dead-ends/`.

**Follow-ups:**
- **Founder section:** fill `src/lib/founder.ts`.
- **Demo link:** switch the flag on when the demo menu has photos.
- **Comparison table:** check its two sources from help.doordash.com.
- **Follow-up 5:** still open (the "own payment account" claims on /integrations and in the FAQ).

---

## 2026-10-13 · PR #29: competitive upgrade (merged)

**Merged by:** Claude, on the owner's instruction after the trust-line wording change. Squash commit `bbe90d1` on `main`, from branch `claude/wuntab-marketing-brief-49dbha`.

**Why:** the competitors lead with a trust line, offer a form on the page, and have pages for business types and integrations. This matches that, keeping built visuals, plain copy and short pages.

**What changed:**
- **Colours:** two greys only, `--ink` and `--ink-muted` (#6e6e6d, 64% ink: a true 60% fails contrast on warm). `--warm` (#faf7f2) is on at most two sections a page. 65 colours in use before, 33 after.
- **Homepage hero:** the trust line "$0 for the restaurant · No lock-in · Your customers, your data". The owner changed "No contract" to "No lock-in". There's also a small $0 card under the name field.
- **Savings calculator** between products and how it works. The 15–30% range is from the apps' published delivery commission; sources are in COPY.md.
- **Product pages:** one template. Hero → how it works (a built step diagram) → what's included in two columns → proof slot → works with → FAQ → final band.
- **New pages:** /integrations, four /solutions pages, /about (no longer redirects) and /contact. The form emails hello@ through `/api/contact`.
- **Navigation:** Solutions and Company menus.
- **Footer:** Product, Solutions, Company and Legal columns.
- **Final band:** "20-minute call. We show WunTab on your own menu. No pressure." and "Or send a message".
- **Proof:** the homepage row and the product pages read one list and stay empty until there's a real customer.
- **Hero:** starts playing at 20% visible (owner accepted), so it plays on a 1440×900 screen.

**Result:**
- **Homepage at 390:** 6,727 px with motion and 6,928 px with reduced motion, both under 7,000 and both tested.
- **Homepage at 1440:** 8,990 px.
- **What left the homepage to make room:**
  - The "More about" links
  - Four FAQ questions the page already answers
  - The footer blurb
  - The old line above the final button
  - Some phone padding

**How it was checked:**
- **Tests:** 92 Playwright tests passed and 1 was skipped. They include `tests/upgrade.spec.ts`, and its contact test submits through a stand-in email server.
- **Repo checks:** honesty, copy-lint, boundary-check, lint and tsc pass.
- **Contrast:** AA on every page at both widths.
- **Evidence:** `docs/marketing-site/evidence/competitive-upgrade/`.

**Follow-ups:**
- **Contact form:** switch on sending (follow-up 4).
- **Payment-account claim:** check it on /integrations (follow-up 5).

---

## 2026-10-13 · PR #28: outcome tabs on phones (merged)

**Merged by:** Claude, self-merge on green on the owner's instruction. Squash commit `45d064b` on `main`, from branch `marketing/outcome-tabs-phones`.

**Why:** the homepage was still 8,037 px at 390. The target is under 7,000.

**What changed:**
- **Tabs on phones:** the homepage outcomes are now tabs at every width. One panel shows at a time; tap a tab to switch.
  - The active tab is underlined.
  - No swiping: the three tabs share the width, with labels on two lines when needed.
- **Each panel on phones:** the lines, then the visual, at most 60% of the screen's height.
- **Desktop:** unchanged.

**Result:**
- **390:** 6,770 px, from 8,037 px.
- **1440:** unchanged at 8,462 px.

**How it was checked:**
- **Tests:** 79 Playwright tests passed and 1 was skipped (the existing legal skip).
- **Outcome test:** now covers phones and desktop.
- **Height test:** now requires under 7,000 px at 390.
- **Live:** confirmed on wuntab.com after the deploy.

---

## 2026-10-13 · PR #26: catering describes the request form the product has (merged)

**Merged by:** Claude, on the owner's instruction after their answer. Squash commit `366f49b` on `main`, from branch `marketing/catering-truth`.

**Why:** /catering promised a catering menu, lead times, minimums and paying online. The product has a catering request form only.

**What changed:**
- **/catering and the homepage row:**
  - The headline is now "Take catering requests on your own website."
  - The line: customers send the date, the headcount and what they need; you reply and confirm.
- **What's included, the steps and the FAQ** describe the request form. Each request goes to the restaurant, which replies and confirms. The owner confirmed WunTab staff forward every request today.
- **Removed until built:** the catering menu, lead times, minimums, online payment and catering delivery.
- **"catering requests" elsewhere:** the homepage "More direct orders" tab and the /how-it-works Order stage now say this, not catering orders.
- **Before-and-after copy:** in the PR description and `COPY.md`.

**How it was checked:**
- **Tests:** 79 Playwright tests passed and 1 was skipped (the existing legal skip).
- **Live:** confirmed on wuntab.com. /catering carries the new headline and none of the removed claims.

---

## 2026-10-13 · PR #27: orders dashboard and settings card; the kitchen board only where it belongs (merged)

**Merged by:** Claude, on the owner's "merge 27". Squash commit `ac73b34` on `main`, from branch `marketing/orders-dashboard`.

**Why:** the kitchen board was standing in for the whole order management dashboard, which is a different screen.

**What changed:**
- **New visual, the orders dashboard.** Built from batch 1's orders-board and order-drawer captures, in text and shapes:
  - The sidebar; the Active, Scheduled and Completed tabs with counts; and the order list (time, customer, items, prep time, status, total).
  - Then the order drawer for #1925 opens, with its items, add-ons, totals and Mark ready.
  - It uses the kitchen board's own orders, so the two agree.
  - On phones it shows a cropped view of the order list, with text at 9px or more.
  - Its totals include the 5% service fee, like the hero and the receipt. The real dashboard has no fee line yet.
- **New visual, the online ordering settings card.** Accepting orders, prep time, the ASAP quote, closing time, and the pause and prep-time controls. Prep time goes from 20 to 25 minutes as it scrolls in.
- **Placement:**
  - **The orders dashboard:** the homepage "Less busywork" tab and its Order management row, the /order-management hero, and /how-it-works Fulfill.
  - **The kitchen board:** the homepage kitchen band and /order-management's "How an order moves through your kitchen", and nowhere else.
  - **The settings card:** /order-management's "What's included", beside the list.

**How it was checked:**
- **Tests:** 79 Playwright tests passed and 1 was skipped (the existing legal skip). The new ones include that the dashboard and the kitchen board show the same orders, and where the kitchen board may appear.
- **Script:** no new JavaScript.
- **Evidence:** `docs/marketing-site/evidence/orders-dashboard/`.
- **Live:** confirmed on wuntab.com after the deploy. /order-management serves the dashboard, the kitchen board and the settings card.

---

## 2026-10-13 · PR #25: homepage trim on phones (merged)

**Merged by:** Claude, self-merge on green on the owner's instruction. Squash commit `afa78d7` on `main`, from branch `marketing/homepage-trim`.

**Why:** the homepage had grown from 4,071 px to 9,799 px at 390 with the visuals. The owner set a target of under 7,000 px.

**What changed:**
- **Product rows, phones:** each row is now the title, one line and the link. The visuals still show from 768 px, at the small size.
- **Outcome tabs, phones:** each visual sits under its text and takes at most 60% of the screen's height.
  - The dashboard card is a little more compact on phones.
  - Its "Demo restaurant" caption moved to the top of the card.
- **Unchanged:** the kitchen band, the hero and the pricing receipt.

**Result:**
- **390:** 9,799 px → 8,070 px. That is still above the 7,000 target; see the follow-up above.
- **1440:** unchanged at 8,495 px.

**How it was checked:**
- **Tests:** 77 Playwright tests passed and 1 was skipped (the existing legal skip).
- **New tests:** the outcome visuals' height, and that the product rows have no visual on phones.
- **Hero test fix:** the hero's play-through test now allows for the browser reporting the hero on screen a moment late under load. It had failed once in four runs.
- **Live:** confirmed on wuntab.com after the deploy.

---

## 2026-10-13 · PR #24: built visuals site-wide, in place of screenshots and photos (merged)

**Merged by:** Claude, on the owner's "merge". Squash commit `0208562` on `main`, from branch `marketing/built-visuals`. PR #20 closed as superseded.

**Why:** the owner wanted every screenshot and photo replaced with visuals built like the hero phone: real text and shapes, sharp at any size. One visual per section, and short text.

**What changed:**
- **Eight new visuals**, in the hero phone's style with the demo restaurant's real dishes, prices and labels:
  - the delivery, catering and storefront phones;
  - a kitchen board on a tablet;
  - the dashboard card, captioned "Demo restaurant";
  - a search result;
  - a receipt;
  - the delivery flow diagram.
- **How they move:**
  - Each one plays once when it scrolls into view, then holds its last frame. Only the hero loops.
  - One thing moves at a time.
  - Anything over five seconds has a pause button.
  - With reduced motion, each shows its final state as a still.
- **Where they are:**
  - **Homepage:** the outcome tabs, the kitchen band (which is back), the product rows, and the pricing card, which gets the receipt.
  - **/how-it-works:** one visual per stage.
  - **Product pages:** one visual in each page's hero, plus the flow diagram on /delivery.
  - **/pricing:** the receipt.
  - The multi-location diagram now stacks on phones.
- **Copy:** every section is now a headline, at most two short lines and its visual. Longer text moved into the FAQs word for word; no fact or price changed (COPY.md).
- **Removed:** the screenshot pipeline: the shot list, SHOTS.md, the screenshot files, frames, crops, placeholders and their tests.

**How it was checked:**
- **Tests:** 76 Playwright tests passed and 1 was skipped (the existing legal skip), including the new visuals tests.
- **Script:** pages load less JavaScript than before, except /pricing (+2.5 KB). One shared 2.3 KB player runs everything.
- **Layout shift:** zero.
- **Evidence:** `docs/marketing-site/evidence/built-visuals/`.
- **Live:** confirmed on wuntab.com after the deploy. The homepage serves its 10 visuals and no screenshots.

**Open:** four follow-ups above (catering, receipt, delivery examples, two stage visuals).

---

## 2026-10-13 · PR #23: the hero's checkout shows the diner's 5% service fee (merged)

**Merged by:** Claude, self-merge on green on the owner's instruction. Squash commit `adb11a5` on `main`, from branch `marketing/hero-service-fee`.

**Why:** the owner's decision on the first PR #22 follow-up. Without the fee, the phone's checkout contradicted the pricing section on the same page.

**What changed:**
- **New line:** the phone's checkout shows "Service fee (5%) $0.60" between the subtotal (the "1 item $12.00" row) and the total. The fee is 5% of the subtotal. The wording and percentage are the same as /pricing and /terms.
- **New total:** $15.78 ($12.00 + $0.60 fee + $0.78 tax + $2.40 tip). It is the same on the checkout, the Pay button and the confirmation.
- **Calculated figures:** every amount is worked out from the subtotal, tax rate, fee and tip, so the figures can't disagree.
- **Unchanged:** the "View cart" bar still shows subtotal plus tax ($12.78), as the storefront calculates it.

**How it was checked:**
- **Tests:** 75 Playwright tests passed and 1 was skipped (the existing legal skip).
- **New test:** it checks the percentage against the terms clause, /pricing and /terms, checks where the line sits, and checks that the totals add up.
- **Live:** confirmed on wuntab.com after the deploy.

---

## 2026-10-13 · PR #22: the hero is a live phone that orders from the demo restaurant (merged)

**Merged by:** Claude, on the owner's "merge". Squash commit `119f62f` on `main`, from branch `marketing/hero-phone`.

**Why:** the owner wanted a moving hero: a phone drawn in HTML and CSS with real text, not a video or a screenshot.

**What changed:**
- **The hero, at every width, is now a phone on the saffron panel.** On the demo restaurant's storefront (Palm&Stone Kitchen), a diner:
  - opens Spiced Lamb Meatballs ($12.00);
  - picks spice level Hot;
  - adds it, checks out and pays $15.18;
  - sees "Order received" and "Ready by" a time 20 minutes after the visitor's own clock.
- **Then the order reaches the kitchen.** On desktop, ticket #1930 slides into the New column of the kitchen display beside the phone. On phones, the phone turns over to show that ticket. About 14 seconds, then it loops.
- **Everything on the screens is real.** The dishes, prices, options, tax, prep time and brand colour are the demo's own, read from its database. The layouts and labels are the storefront's and the kitchen display's. The only picture is the dish photo.
- **Behaviour:**
  - It plays only while on screen and while the tab is visible.
  - A pause/play button sits in the corner.
  - Only position and fade animate.
  - With reduced motion it shows the confirmation and the ticket as a still.
  - Screen readers hear one sentence.
- **The orders board screenshot** no longer appears in the hero. It stays in the catalog for `/order-management`.

**How it was checked:**
- **Tests:** 74 Playwright tests passed and 1 was skipped (the existing legal skip), including 10 new ones for the animation.
- **Script added:** 1,989 bytes (864 gzipped).
- **Layout shift:** zero at 390 and 1440 through a full loop.
- **Evidence** (recordings, stills, measurements): `docs/marketing-site/evidence/hero-phone/`.

**Open:** three follow-ups above: the 5% fee, the dish photo and the wording.

---

## 2026-10-12 · PR #21: hotfix, blurry screenshots held off wuntab.com until the 3x retakes (merged)

**Merged by:** Claude, self-merge on green on the owner's instruction. Squash commit `4cbe044` on `main`, from branch `marketing/hold-1x-shots`.

**Why:** the batch-1 screenshots are 1x captures. On phones and retina screens they are stretched up to about 3 times their pixel size and look blurry.

**What changed:**
- **The rule:** wuntab.com shows a screenshot only if its file has enough pixels for the frame it sits in, at a 390-wide phone (3x) and a 1440-wide desktop (2x). This is the check from PR #20. Today none of the eight files passes, so all eight are hidden.
- **No files deleted:** when a 3x file replaces a 1x file, it passes and shows again by itself; there is no flag to remember. Checked with temporary 3x copies, which were not kept.
- **Previews:** preview deployments still show the screenshots, so the layout stays visible.
- **The page without them:**
  - the hero is just the headline, the name field and Get Started;
  - the kitchen band is gone until its screenshot is back;
  - every other section keeps its text with no gaps;
  - the "Demo restaurant" caption goes with its image.
- **SHOTS.md:** reads 0 of 26 done, with 8 marked "Held: 1x, awaiting 3x retake".

**How it was checked:**
- **Tests:** 64 Playwright tests passed and 1 was skipped (the existing legal skip). New tests check that no held screenshot or empty container appears on production, and that previews still show them.
- **Homepage height on production:** 4,882px at 390 and 4,644px at 1440.

---

## 2026-10-11 · PR #19: layout pass, readable screenshots on phones, no beige (merged)

**Merged by:** Claude, on the owner's "merge 19". Squash commit `0566c6e` on `main`, from branch `marketing/layout-pass`.

**Why:** on phones the dashboard screenshots were shrunk so far that their text was 2.4–4.4px tall, which is unreadable. The owner also wanted the beige gone and a calmer, more deliberate layout.

**What changed:**
- **Readable screenshots on phones:** every screenshot now shows a close-up of its most important part instead of the whole screen. Screenshot text now renders at 9.3px or more on a 360-wide phone, and the kitchen display shows two tickets at near real size. The close-ups are set per screenshot in the catalog and cut from the same files when the page is shown; the files are not edited.
- **Colour and shape:**
  - The beige background is gone. The site now uses white, near-black text, the logo's navy and saffron, plus one pale cool grey for thin lines.
  - Cards and screenshots no longer have shadows.
  - Corners follow a hierarchy: screenshots and panels 20px, buttons and inputs 12px, list rows square.
- **Homepage, top to bottom:**
  - a wide orders board under the headline;
  - the three outcomes without a card, stacked on phones;
  - a new navy band with the kitchen display, the page's one bold moment ("Every order on one screen in your kitchen.");
  - the four products as simple rows, with small real crops for online ordering and order management;
  - the three steps joined by a line, a vertical list on phones;
  - pricing as the only card;
  - the FAQ;
  - a saffron band to finish.
  - Nothing on the page swipes sideways any more.
- **Product pages and `/how-it-works`:** the same close-ups and rules. Steps are a vertical list on phones, and "What's included" is a plain two-column list.
- **Step markers:** the numbers sit in saffron circles in ink, because saffron text on white is too faint to read.
- **New copy:** one line under the kitchen band's headline, restating the existing Kitchen Display description.

**How it was checked:**
- **Tests:** 62 Playwright tests passed and 1 was skipped (the existing legal skip). New tests cover each rule: readable phone screenshots, no sideways scrolling, no beige or shadows, the corner hierarchy, the step layout, the bands and the section order.
- **Homepage height at 390:** 4,335px became 6,778px. It's taller because the screenshots are now readable and the lists are vertical. It stays under the 10,000px limit.
- **Evidence:** before and after screenshots of the homepage, `/order-management` and `/online-ordering` at 360, 390 and 1440, with per-frame text sizes, in `docs/marketing-site/evidence/layout-pass/`.

---

## 2026-10-10 · PR #18: screenshots batch 1 on the site (merged)

**Merged by:** Claude, on the owner's "merge 18". Squash commit `5596dbb` on `main`, from branch `marketing/shots-batch1`.

**Why:** the owner supplied the first real product screenshots, already edited: the "Clover map" tab, the "Coming soon" button and the "Pay at store" chips were removed.

**What changed:**
- **Eight screenshots** went into `public/shots/` exactly as delivered: dash-overview, orders-board, order-drawer, kds, menu-editor, menu-editor-options, ordering-settings and promotions.
- **analytics.png was held back** because its top cards are cut off. A retake is coming (Follow-ups, item 3).
- **Where they show:**
  - the orders board in the homepage hero and the `/order-management` hero;
  - the order drawer, ordering settings and kitchen display on `/order-management`, with ordering settings also in the homepage's "Less busywork" tab;
  - the menu editor and the dashboard overview on `/how-it-works`;
  - promo codes and an item's availability and modifiers on `/online-ordering`.
- **Menu Management:** the item-options shot is set to appear there once that page exists, and it stays off `/order-management` (owner decision).
- **Images load fast:** browsers get AVIF or WebP versions sized to the screen, with the PNG as a fallback. Each frame keeps its space so nothing jumps. Only the hero loads straight away; the rest load as you scroll.
- **Scrollbar strip:** each capture has a 15px white strip down its right edge. The site hides it when showing the image; the files are untouched.
- **Demo figures:** frames that show the demo restaurant's sales figures carry a "Demo restaurant" caption, and a test makes sure no page copy quotes those figures (owner decision).
- **Phones:** in the homepage tabs, the swipe row now matches the height of the tab in view, so a short tab never sits over blank space.
- **SHOTS.md:** 8 of 26 done.

**Owner decisions on the PR:**
- Keep the order drawer without the 5% fee for now, with a retake reminder logged.
- Keep the demo figures, captioned.
- Leave both logos as they are for now.
- Log the cramped multi-location diagram as a follow-up.

**How it was checked:**
- **Tests:** 58 Playwright tests passed and 1 was skipped (the existing legal skip).
- **Frames:** 30 frames were checked at 360, 390 and 1440. Every image loads and shows in full except the hidden strip, and no page scrolls sideways.
- **Evidence:** before and after screenshots of the homepage, `/order-management`, `/online-ordering` and `/how-it-works`, in `docs/marketing-site/evidence/shots-batch1/`.

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
