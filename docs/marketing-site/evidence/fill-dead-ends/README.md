# Filling the dead ends: evidence (2026-10-13)

Production builds of main (`4e58e1b`) and this branch, Chromium, device scale 1, reduced motion (every visual shows its final state). `pages-before/` has the pages that changed; `pages-after/` has those plus the six new pages.

## Heights (px, reduced motion)

| Page | 390 before | 390 after | 1440 before | 1440 after |
|---|---|---|---|---|
| / | 6928 | 6933 | 8934 | 9197 |
| /online-menu | new | 3546 | new | 4166 |
| /upsells | new | 3500 | new | 4123 |
| /loyalty | new | 3371 | new | 3991 |
| /kitchen-display | new | 3203 | new | 4072 |
| /menu-management | new | 3595 | new | 4245 |
| /payments | new | 3516 | new | 4211 |
| /pricing | 2342 | 3112 | 2312 | 3128 |
| /how-it-works | 7077 | 6837 | 5943 | 6207 |
| /about | 2062 | 2846 | 2451 | 3187 |
| /restaurant-websites | 3660 | 3748 | 4046 | 4310 |
| /online-ordering | 4212 | 4352 | 4384 | 4648 |
| /order-management | 4242 | 4330 | 4683 | 4947 |
| /integrations | 2868 | 2956 | 3345 | 3609 |

Other pages grew by about 90px at 390 and 260px at 1440: the footer now lists the six new pages.

## Homepage at 390 (limit 7,000; tested with and without motion)

| | before (main) | after |
|---|---|---|
| with motion | 6,727 | 6,732 |
| reduced motion | 6,928 | 6,933 |

- **Came in:** the founding restaurants section (387px), and six more footer links (88px).
- **Left:** the homepage FAQ (470px). Its questions are on /pricing and the product and solution pages.
- **The demo link:** while its flag is off it adds nothing. Switched on, it adds about 60px, still under 7,000.

## Pricing table

`pricing-table/compare-390.png` and `compare-1440.png`. Every cell's source is in COPY.md ("/pricing: WunTab next to a delivery app"). No app is named on the page.

## Payments verification (sabal-ros `main` at `a5418d4`, read-only)

**Verified, so the security line is on /payments:** card numbers are tokenized by the payment partner and never stored by WunTab.
- **Collection:** the card is collected in the partner's hosted fields, and only a token comes back. See `packages/ui/ordering/nmi-payment-step.tsx:4, 9-12` ("Card data never touches our servers") and `:72-82`.
- **What's sent onward:** only `{ paymentId, paymentToken }` (`:122`).
- **The sale call:** it carries `payment_token` only (`packages/services/payments/nmi.ts:103`).
- **What's stored:** card brand and last four only (`packages/db/schema/payments.ts:59-66`). The header reads "WHAT IS DELIBERATELY ABSENT: card numbers, CVC" (`:22-24`).
- **The dashboard's own words:** "Card details are entered in the processor's hosted fields and never reach Wuntab's servers." (`apps/ros/app/(dashboard)/settings/payments/page.tsx:77-78`).
- **Search:** pan, cardNumber, card_number, ccnumber, cvv, cvc and expiry columns: none found.

**Not true today, so not on the site:** money settling to the restaurant's own account.
- **The code's own comment:** "Sabal uses ONE platform NMI merchant account — no per-merchant keys — … money does not currently settle to the restaurant's own account" (`settings/payments/page.tsx:12-16`).
- **One key for every restaurant:** `packages/db/env.ts:369-380`, used at `nmi.ts:61`.
- **What changed because of it:**
  - /payments' visual is Checkout → Card check → Paid → Kitchen, not "→ your account".
  - The pricing table has no "Who gets paid" row.
  - The old "Money to your bank for you" headline and the "merchant of record" note are gone from /payments.

## Tests

- Playwright: 99 passed, 1 skipped (the opt-in screenshot spec). That includes `tests/fill.spec.ts` for this round.
- honesty, copy-lint, boundary-check, lint and tsc pass.
