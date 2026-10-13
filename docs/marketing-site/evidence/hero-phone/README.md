# Hero phone: evidence (2026-10-13)

The homepage hero is now a phone drawn in HTML and CSS (`src/components/hero-order-demo.tsx`). It replaces the hero screenshot at every width. The orders board screenshot stays in the catalog and still shows on `/order-management`.

All captures are from the production build (`next build` + `next start`) in headless Chromium.

## Recordings: one full loop

| File | What |
|---|---|
| `hero-loop-390.gif` | 390 wide, one loop (14.25 s of real playback, 210 frames). The phone turns over to the kitchen ticket after the confirmation. |
| `hero-loop-1440.gif` | 1440 wide, one loop (14.7 s, 152 frames, scaled to 900 wide). The ticket slides into the New column of the kitchen display beside the phone. |
| `steps-390.png`, `steps-1440.png` | Frames from those recordings side by side, for a quick look. |

GIF timing comes from real playback: each frame lasts as long as it took to capture (about 40 ms at 390, 56 ms at 1440). It is a GIF because this container has no MP4 encoder.

## Reduced motion

`reduced-motion-390.png` and `reduced-motion-1440.png`: with `prefers-reduced-motion: reduce` nothing moves and there is no pause button. The phone shows the confirmation. At 1440 the ticket is in the New column; on phones it sits under the phone.

## JavaScript size

The player (`src/components/hero-demo-player.tsx` plus the step times in `src/lib/hero-demo-timeline.ts`) is **1,989 bytes minified, 1,118 bytes gzipped** on its own.

The homepage's script files, measured against a build of `main`:

| | Files | Raw | Gzipped |
|---|---|---|---|
| main | 9 | 597,670 B | 185,401 B |
| this branch | 9 | 599,659 B | 186,265 B |
| added | 0 | **+1,989 B** | **+864 B** |

No new library. The dish photo is a plain `img`, so the image loader's script isn't pulled in.

The HTML is heavier, because the screens are real markup: `index.html` goes from 12.3 KB to 22.4 KB gzipped (79 KB to 148 KB raw). The dish photo is 10 KB.

## No layout shift

A layout-shift observer ran from the first paint through one full loop (15.5 s):

| Width | CLS | Layout-shift entries | Hero box, first paint and after the loop |
|---|---|---|---|
| 390 | 0 | 0 | 326 × 587.05 at (32, 475.75), unchanged |
| 1440 | 0 | 0 | 1100 × 629.5 at (170, 641.17), unchanged |

Every box reserves its space with `aspect-ratio`. The times the script fills in (status bar, kitchen clock, ready time, timers) sit in fixed-width slots. `tests/hero-demo.spec.ts` repeats this check on every run.

## Tests (`tests/hero-demo.spec.ts`, 10 tests, all passing)

- The screens are real text. The only picture is the dish photo; there is no video, canvas or frame.
- `aria-hidden`, with one sentence for screen readers.
- One control: the pause/play button, 44 px, labelled.
- The status bar shows the visitor's time. The confirmation shows that time plus 20 minutes. Tested with a fixed clock: 4:40 shows "Ready by 5:00 PM".
- At 390 and 1440 the story plays through to ticket #1930. The ticket shows the same name, dish and option as the order, its timer runs from 0:00, and the story loops.
  - Phones turn the phone over.
  - Desktop shows the board.
- It stops when paused, when scrolled away, and when the tab is hidden.
- Reduced motion, at 390 and 1440: it stays still and shows the confirmation and the ticket.
- No layout shift over a whole loop, at 390 and 1440.
- Only `transform` and `opacity` animate. This is checked against the stylesheet. The pause button's hover colour is the one exception, like every button on the site.

Full suite: 74 passed, 1 skipped (the legal placeholder test, skipped since the documents went final).

## Where every detail comes from

Read on 2026-10-13 from the demo storefront's database (the dev branch, which demo.wuntab.com serves) and from the product's code:

- **Menu.**
  - Spiced Lamb Meatballs, $12.00, with the menu's description.
  - Its groups: "Spice level" (optional; Mild, Medium, Hot) and "Extras" (up to 4; Add feta +$1.50, Add avocado +$2.00, Extra sauce +$0.75, Extra pita +$1.50).
  - The neighbouring rows are the same category's dishes, with their real prices and descriptions.
- **Location.** Brickell, 48 Coral Lantern Way, Miami, FL. Tax 6.5%, prep 20 minutes (so "ASAP (20–30 min)"). Brand colour #0f766e.
- **Arithmetic, done the product's way.**
  - Tax $0.78.
  - Tip at the default 20%: $2.40.
  - Total $15.18.
  - The cart bar shows subtotal plus tax: $12.78.
- **Layouts and strings.**
  - Storefront: the clean theme's menu rows, item sheet, sticky bar, checkout and confirmation.
  - Kitchen display: the board header, the columns, and the ticket's number, timer, "PICKUP · NAME", "1×" items with "+ option" and the Start button.
  - The ready time is now + 20 minutes, as the confirmation computes it.
- **Other tickets.** #1924, #1925 and #1929 are from the kitchen display screenshot (`public/shots/kds.png`). #1930 is the next number.
