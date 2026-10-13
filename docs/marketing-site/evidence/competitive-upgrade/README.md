# Competitive upgrade: evidence (2026-10-13)

Branch `claude/wuntab-marketing-brief-49dbha`, against main at c8e8aaa. Production builds
(`NEXT_PUBLIC_ALLOW_INDEXING=true NEXT_PUBLIC_SITE_URL=https://wuntab.com`), Chromium,
device scale 1.

## Pages at 390 and 1440, before and after

`pages-before/` (main, 11 pages) and `pages-after/` (this branch, 18 pages), full page,
with reduced motion so every visual shows its final state. Solution pages are saved as
`solutions_<name>-<width>.png`. Heights in px, reduced motion:

| Page | 390 before | 390 after | 1440 before | 1440 after |
|---|---|---|---|---|
| / | 6971 | 6928 | 8406 | 8934 |
| /how-it-works | 7096 | 7077 | 5691 | 5943 |
| /pricing | 2382 | 2342 | 2105 | 2312 |
| /online-ordering | 3152 | 4212 | 3159 | 4384 |
| /delivery | 3369 | 3698 | 3476 | 4120 |
| /catering | 2789 | 3686 | 2912 | 4060 |
| /restaurant-websites | 2811 | 3660 | 2900 | 4046 |
| /restaurant-seo | 2677 | 3620 | 2740 | 3940 |
| /order-management | 3976 | 4242 | 4280 | 4683 |
| /privacy | 12360 | 12329 | 9159 | 9367 |
| /terms | 8375 | 8343 | 6336 | 6543 |
| /integrations | new | 2868 | new | 3345 |
| /solutions/independent-restaurants | new | 3593 | new | 3970 |
| /solutions/quick-service | new | 3316 | new | 3792 |
| /solutions/full-service | new | 3593 | new | 3997 |
| /solutions/multi-location | new | 3315 | new | 3517 |
| /about | new | 2062 | new | 2451 |
| /contact | new | 1748 | new | 1464 |

Product pages grew by about 900px at 390: each now carries How it works and What's
included on the page (they were questions in the FAQ). /how-it-works, /pricing and the
legal pages changed only by the footer and the final band.

## Homepage height at 390 (limit 7,000, tested both ways)

| | main | this branch |
|---|---|---|
| with motion | 6,770 | 6,727 |
| reduced motion | 6,971 | 6,928 |
| 1440, with motion | 8,462 | 8,990 |

What came in at 390: the trust line and the /bin/bash card (+123), the calculator (+437), the
footer's four columns. What left or shrank to pay for it: the "More about …" link on each
product row (the name is the link now), four FAQ questions the page already answers, the
footer blurb (it repeated the hero line) and its padding, the line above the final band's
button and the homepage's "or email" line, and 8–16px of padding on the toned bands, the
steps and the pricing card on phones.

## Colours in use, before and after

Every computed text, background, border, fill and stroke colour on every page at 390 and
1440: `colors-before.json` (65 values) and `colors-after.json` (33 values).

**After, the site's own:** ink #1d1d1b · ink-muted #6e6e6d · paper #ffffff · mist #e6e9ef ·
warm #faf7f2 (13 sections across 18 pages, never more than two a page) · saffron #f4a83a
(hover #e2962c) · navy #13213c (logo tile and the kitchen band). On dark grounds: paper at
80% (text) and 15% (rules). Inside visuals: ink at 18%, 35% and 40% as scrims.

**After, inside the built visuals and not greys:** the demo restaurant's own colours
(#003e80 and its 25% tint, #a7c7e3, #0f766e, #c2410c), the product's status colours
(greens #10b981 #047857 #065f46 #d1fae5 #ecfdf5, ambers #f59e0b #fbbf24 #facc15 #b45309
#92400e #fffbeb #fefce8, reds #e11d48 #fecdd3) and the search result's link blue #1a0dab.
`rgb(0, 0, 0)` in the list is the default fill of the logo's `<svg>` element; its paths
set their own colours, so nothing paints black.

**Gone (the greys):** ink at 10, 15, 20, 30, 55, 60, 70 and 85%; paper at 55 and 85%;
#000, #09090b, #0b0b0c, #111111, #18181b, #27272a, #202124, #3f3f46, #4d5156, #52525b,
#646b78, #70757a, #71717a, #767676, #a1a1aa, #d4d4d8, #dfe1e5, #e4e4e7, #e5e7eb, #ebebeb,
#f4f4f5, #f5f5f4, #fafafa; and the scrims rgb(17 17 17 / .18), rgb(9 9 11 / .35),
rgb(0 0 0 / .4), which are ink-based now. Text contrast was checked on every page at both
widths: everything passes AA (ink-muted is 5.1:1 on paper and 4.8:1 on warm).

## Calculator

`calculator/empty-<width>.png` and `calculator/100-orders-30-dollars-<width>.png`: 100
orders a week at $30 gives "Between $23,400 and $46,800" (100 × $30 × 52 × 15% and 30%).

## Contact form: test submission

`contact/filled-<width>.png` and `contact/sent-<width>.png`: the form filled in and
sent, at both widths, showing "We reply within one business day". The handler ran against
a stand-in email API on localhost; `contact/received-by-email-api.json` is exactly what
it would have sent: to hello@wuntab.com, reply-to the sender, plain text. The key is
redacted.

**Not yet live:** the Vercel project has no email key, so on the preview and in production
the form answers "We couldn't send your message. Please email us instead: hello@wuntab.com"
until `CONTACT_EMAIL_API_KEY` is set (see the PR).

## Script added

Gzipped JavaScript per page: homepage +3.7 KB (the calculator), /contact +3.1 KB (the
form) over a page with neither. Every other page is unchanged.

## Tests

`npm run honesty && npm run copy-lint && npm run boundary-check && npm run lint` pass;
Playwright: 92 passed, 1 skipped (the opt-in screenshot spec). The hero's play-through
passes 20 of 20 on its own; once in 36 runs under heavy parallel load it stalled at step 1
(the late-visibility timing PR #25 already allows for).
