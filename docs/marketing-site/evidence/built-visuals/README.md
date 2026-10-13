# Built visuals instead of screenshots and photos: evidence (2026-10-13)

All captures are from the production build (`next build`, `next start`) in headless Chromium.

## Folders

| Folder | What |
|---|---|
| `recordings/` | One play of each visual on its own page, at 390 and 1440 (`<visual>-390.gif`, `<visual>-1440.gif`). Frames are timed from real playback. They are GIFs because this container has no MP4 encoder. |
| `reduced-motion/` | Each visual with `prefers-reduced-motion: reduce`: the final state as a still, and no pause button. 2x, at 390 and 1440. The hero is included for comparison. |
| `pages-before/` | Every page on `main` before this change, at 390 and 1440 (production build, so the held screenshots are hidden). |
| `pages-after/` | Every page after, at 390 and 1440, with reduced motion so each visual shows its final state. With motion on, a visual plays once when it scrolls into view, so a quick scroll-through would catch some at their first step. |

## Where each visual is recorded

| Visual | Page | Plays for | Pause button |
|---|---|---|---|
| Delivery phone | /delivery | 8.6 s | yes |
| Catering phone | /catering | 4.3 s | no |
| Storefront phone | /restaurant-websites | 3.9 s | no |
| Kitchen board | /order-management | 3.2 s | no |
| Dashboard card | /how-it-works | 2.2 s | no |
| Search result | /restaurant-seo | 2.2 s | no |
| Receipt | /pricing | 2.9 s | no |
| Delivery flow | /delivery | 6.2 s | yes |

## JavaScript

One shared script runs every visual and the hero: `src/components/visual-player.tsx`. It is **2,345 B minified, 1,249 B gzipped**, which is 356 B more than the hero-only player it replaces. The eight visuals are server-rendered HTML and CSS, so each adds **0 B of script of its own**. Each one's step times travel in the page data, at 20 to 45 characters per visual.

Script each page loads (raw / gzipped), measured against a build of `main`:

| Page | main | this branch | change |
|---|---|---|---|
| / | 599,659 / 186,265 | 585,269 / 181,080 | −14,390 / −5,185 |
| /how-it-works | 594,507 / 184,110 | 582,106 / 179,793 | −12,401 / −4,317 |
| /pricing | 579,650 / 178,488 | 582,106 / 179,793 | +2,456 / +1,305 |
| /online-ordering | 594,507 / 184,110 | 582,106 / 179,793 | −12,401 / −4,317 |
| /delivery | 594,507 / 184,110 | 582,106 / 179,793 | −12,401 / −4,317 |
| /catering | 594,507 / 184,110 | 582,106 / 179,793 | −12,401 / −4,317 |
| /restaurant-websites | 594,507 / 184,110 | 582,106 / 179,793 | −12,401 / −4,317 |
| /restaurant-seo | 594,507 / 184,110 | 582,106 / 179,793 | −12,401 / −4,317 |
| /order-management | 594,507 / 184,110 | 582,106 / 179,793 | −12,401 / −4,317 |

Pages load less script than before, because the screenshot frames' image loader is gone. /pricing gains the shared player, since it had no animated visual before.

## No layout shift

`tests/visuals.spec.ts` scrolls through / and /delivery at 390 and 1440 while the visuals play. The measured layout shift is 0. Every box reserves its size from the first paint.

## Homepage height at 390

9,944 px with reduced motion; a little less with motion on. The test keeps it under 10,000.
