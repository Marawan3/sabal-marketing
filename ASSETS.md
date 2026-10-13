# Assets

## Logo (geometry locked, colors ours)

Geometry comes from `wuntab-rebrand-spec.md` §2 and is implemented exactly: rounded-square tile (rx 14/56), one-stroke W with the raised center peak, WUNTAB wordmark in caps at weight 500 with 3px tracking, horizontal lockup with a 14px gap. Never symmetrize the W.

Since the switch to Archivo (2026-10-07) the wordmark is SVG outlines of its original Bricolage Grotesque lettering (weight 500, 18px, 3px tracking, kerned), so the logo looks the same whatever the page font is. Pixel check against the old live text: 177 of 10,325 inked pixels differ in the header and 498 of 33,055 in the footer, all by anti-aliasing only.

Colors were recolored for this palette. Since the 2026-10-07 design pass the page text is near-black, and the logo keeps the navy as its own color (`--navy`) (Marawan, 2026-09-05: "the colors are yours"):

| Surface | Tile | W stroke | Wordmark |
|---------|------|----------|----------|
| Light (paper, ticket) | navy `#13213C` | saffron `#F4A83A` | navy |
| Dark (ink band, footer) | saffron | navy | paper |

Files: `src/components/logo.tsx` (React), `public/logo.svg` (static, used in JSON-LD), `src/app/icon.svg`, `src/app/favicon.ico` (16/32/48), `src/app/apple-icon.png` (180). Regenerate the raster icons with `node scripts/icons.mjs`. Review sheet: `evidence/logo/logo-sheet.png`.

## Product screenshots

**Batch 1 (2026-10-10, from the owner):**
- `dash-overview`, `orders-board`, `order-drawer`, `kds`, `menu-editor`, `menu-editor-options`, `ordering-settings` and `promotions`, as PNG.
- They were captured from the demo restaurant on the Neon branch preview. The owner edited them before delivery, removing the "Clover map" tab, the "Coming soon" button and the "Pay at store" chips.
- They are committed byte for byte as delivered. Do not re-edit them.
- Each has a 15px white scrollbar gutter on its right edge. The frame hides it at display time (`RIGHT_GUTTER` in `src/lib/shot-files.ts`, keyed by file content); the files are unchanged.
- `analytics.png` from the batch is held back. Its top cards are cut off, and no frame crops to the chart and top items. A retake is coming.

Every screenshot and photo the site can show is listed in `docs/marketing-site/SHOTS.md`, generated from `src/lib/catalog.ts` and `src/lib/shot-placements.ts`. Files go in `public/shots/` under the name shown there. wuntab.com hides a frame until its file exists; preview deployments show a placeholder with the file name and size.

## Hero animation (2026-10-13)

The homepage hero is a phone and a kitchen display drawn in HTML and CSS (`src/components/hero-order-demo.tsx`), not a video or a screenshot. Its one picture is the dish photo:

| File | What it shows | Source | Added |
|---|---|---|---|
| `public/hero-demo/spiced-lamb-meatballs.webp` | The demo menu's photo of Spiced Lamb Meatballs | Cropped from `public/shots/menu-editor.png` (batch 1; the photo panel of the item editor, 174×174 at x 1008, y 132, clear of the editor's remove button), saved as WebP at quality 90. The photo itself is the demo menu's AI-generated dish photo. | 2026-10-13 |

The crop is only 174px wide, so the item sheet shows it softer than the rest of the phone. The original is the 1024×1024 file in the demo's photo storage, which this session's network could not reach. When the original is in the repo, replace this file (same name, any size) and change `photoSize` in `src/lib/demo-order.ts`.

## Photos

Licensed stock is allowed for the panel photos (owner, 2026-10-07). Each one must be recorded below with its source and license before it ships. Any screen inside a photo must be real WunTab UI, never a drawn mockup. No customer photos without the customer's agreement (see `src/lib/stories.ts`).

None has been sourced yet. Stock sites were not reachable from the session that built the design pass.

| File | What it shows | Source | License | Added |
|---|---|---|---|---|
| `photo-ordering-in-hand.webp` | A hand holding a phone with a WunTab ordering menu open (real screen) | not sourced | | |
| `photo-delivery-handoff.webp` | A bagged delivery order handed over at a restaurant counter | not sourced | | |
| `photo-catering-spread.webp` | Catering trays laid out for a group order | not sourced | | |
| `photo-kitchen-screen.webp` | A kitchen team working from a tablet showing the WunTab kitchen display (real screen) | not sourced | | |

The JPGs in `public/demo/` are left over from the old site and are not referenced anywhere; delete them once Marawan confirms they are not needed.
