# Orders dashboard and settings card: evidence (2026-10-13)

The two new visuals were built from batch 1's `orders-board`, `order-drawer` and `ordering-settings` captures, with text and shapes like the others. Captured from the production build in headless Chromium.

| Folder | What |
|---|---|
| `recordings/` | One play of each new visual on /order-management, at 390 and 1440. GIFs, timed from real playback. |
| `reduced-motion/` | Each new visual's final state as a still, at 390 and 1440 (2x). |
| `pages-before/`, `pages-after/` | The homepage and /order-management on `main` before this change and after it, at 390 and 1440. Both use reduced motion, so every visual shows its final state. |

## The orders dashboard

- **What it shows:** the dashboard's Orders screen.
  - The sidebar.
  - The tabs: Active 4, Scheduled 0, Completed 912, Cancelled 19, Awaiting payment 0.
  - The order list: placed time, customer, items, prep time, coloured status and total.
  - The drawer for #1925, sliding open: items, add-ons, totals, and Mark ready, Print receipt and Cancel order.
- **Agrees with the kitchen board:** the orders are the board's own: #1924 Grace (Ready), #1925 Mateo (Preparing), #1929 Leila (New) and #1930 Priya (New, the hero's order). A test checks that the two agree.
- **Totals:** totals use the hero's arithmetic, with the 5% service fee. The real dashboard has no fee line yet.
- **Narrower layouts:**
  - Narrower than about 900 px, the sidebar goes.
  - Narrower than 600 px (phones, and the small homepage row), it is a focal crop of the order list, with prep time under each customer. Text stays at 9 px or more.
- **Plays for:** 2.4 s, so no pause button.

## The settings card

- **What it shows:** Online ordering.
  - Open, Accepting orders.
  - Current prep, the ASAP quote, Closes at 11:00 PM.
  - Pause online ordering and Adjust prep time.
- **The one change:** prep time ticks from 20 to 25 min when it scrolls in. The ASAP quote moves with it, from 20–30 to 25–35 min, as the product computes it.
- **Plays for:** 2.0 s.

## JavaScript

No new script. Both visuals are server-rendered HTML and CSS on the shared player.

## Heights

| Page | 390 (px) | 1440 (px) |
|---|---|---|
| Homepage | 8,037 (was 8,070) | 8,462 (was 8,495) |
| /order-management | 3,976 (was 2,603) | 4,280 (was 2,948) |

/order-management gained the kitchen board section and the What's included section with the settings card. These are reduced-motion heights.
