# Design pass evidence, 2026-10-07

Full-page screenshots of the homepage, `/online-ordering` and `/order-management` at 1440, 390 and 360 wide, before (main at `fdd129c`) and after (branch `marketing/design-pass`). The page heights are in each folder's `heights.json`, which also covers 430 wide.

There are two builds of each, because `public/shots/` is still empty:

- **production**: what wuntab.com shows. Frames without a file render nothing.
- **preview**: what a Vercel preview shows (`VERCEL_ENV=preview`). Each missing file is a dashed placeholder with its file name and size.

## Homepage height

| Build | Width | Before | After |
|---|---|---|---|
| Preview | 390 | 19,989px | 4,784px |
| Preview | 1440 | 14,450px | 6,242px |
| Production | 390 | 14,472px | 4,071px |
| Production | 1440 | 11,660px | 4,727px |

Once real shots replace the placeholders, the homepage will sit near the preview figures. Target: under 10,000px at 390, checked by `tests/design.spec.ts`.

## Sideways scroll

Before, every page scrolled sideways by 14px at 360 wide, in both builds. After: 0px at 360, 390 and 430 on every page, checked by `tests/marketing.spec.ts`.

## Also here

- `after/preview/mobile-menu-360.png`: the full-screen phone menu with the Sell accordion open.
- `after/preview/tabs-360.png`: the outcome tabs at 360, with the next panel peeking in.

Captured with Playwright (Chromium) against `next start` builds made with `NEXT_PUBLIC_ALLOW_INDEXING=true NEXT_PUBLIC_SITE_URL=https://wuntab.com`, reduced motion on, after fonts loaded.
