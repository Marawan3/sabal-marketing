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

## Built visuals (2026-10-13), in place of screenshots and photos

The site shows no screenshots and no photos. Every section's visual is built in HTML and CSS from real text and shapes, in the hero phone's language, with the demo restaurant's real dishes and prices (`src/components/visuals`, data in `src/lib/demo-data.ts` and `src/lib/demo-order.ts`):

- delivery phone, catering phone, storefront phone
- kitchen board, dashboard card, search result, receipt
- delivery flow diagram

The screenshot pipeline went with them: the shot catalog, `SHOTS.md`, `public/shots/`, the frames, the resolution gate and the placeholders. Batch 1 (2026-10-10) is in git history if it's ever needed. The dashboard card's figures and sales line come from batch 1's `dash-overview` capture; the kitchen tickets from its `kds` capture.

## Hero animation (2026-10-13)

The homepage hero is a phone and a kitchen display drawn in HTML and CSS (`src/components/hero-order-demo.tsx`), not a video or a screenshot. Its one picture is the dish photo:

| File | What it shows | Source | Added |
|---|---|---|---|
| `public/hero-demo/spiced-lamb-meatballs.webp` | The demo menu's photo of Spiced Lamb Meatballs | Cropped from batch 1's menu-editor screenshot (formerly `public/shots/menu-editor.png`, now in git history; the photo panel of the item editor, 174×174 at x 1008, y 132, clear of the editor's remove button), saved as WebP at quality 90. The photo itself is the demo menu's AI-generated dish photo. | 2026-10-13 |

The crop is only 174px wide, so the item sheet shows it softer than the rest of the phone. The original is the 1024×1024 file in the demo's photo storage, which this session's network could not reach. When the original is in the repo, replace this file (same name, any size) and change `photoSize` in `src/lib/demo-order.ts`.

## Photos

None. The owner chose built visuals over photos on 2026-10-13, so no stock photos are planned. The hero phone's dish photo (above) is the one picture on the site.

The JPGs in `public/demo/` are left over from the old site and are not referenced anywhere; delete them once Marawan confirms they are not needed.
