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

## Built visuals (2026-10-13), in place of screenshots

Every section's visual is built in HTML and CSS from real text and shapes, in the hero phone's language (`src/components/visuals`, data in `src/lib/demo-data.ts` and `src/lib/demo-order.ts`):

- delivery phone, catering phone, storefront phone
- kitchen board, dashboard card, search result, receipt
- delivery flow diagram

The screenshot pipeline went with them: the shot catalog, `SHOTS.md`, `public/shots/`, the frames, the resolution gate and the placeholders. Batch 1 (2026-10-10) is in git history if it's ever needed. The dashboard card's figures and sales line come from batch 1's `dash-overview` capture; the kitchen tickets' layout from its `kds` capture.

## The demo restaurant's pictures (2026-10-19)

Since 2026-10-19 the demo restaurant is the owner's **Palm&Stone Pizza**, and the visuals carry its pictures: a photo on every dish they show, the website's and the catering page's photos, and its logo mark. **Every photo is AI-generated for this fictional demo restaurant.** None shows a real restaurant, a real dish served anywhere, or a real person.

Source: `palmstone-pizza-assets.zip`, sent by the owner on 2026-10-19 (its `README.txt` maps each dish to its file). The zip's `web/` files are used as they came, already sized and saved as WebP; its `demo-restaurant-uploads/` JPEGs are for the live demo restaurant's menu and are not in this repo.

They are plain `<img>` tags with their width and height set (no layout shift) and `alt=""`, because every visual is `aria-hidden` with one sentence for screen readers (`src/components/demo-img.tsx`). The hero phone's load at once; every other one is `loading="lazy"`. The homepage's pictures weigh about 680 KB in all (a test keeps them under 1 MB).

### Photos: `public/demo/photos/`

| File | Size | Shows | Where |
|---|---|---|---|
| `pepperoni-pizza-360.webp` | 360×360 | Pepperoni Pizza | Menu rows (hero, /online-menu, the website's menu) |
| `pepperoni-pizza-900.webp` | 900×900 | Pepperoni Pizza | The hero's dish sheet, the /upsells sheet (both with steam), the /menu-management editor |
| `margherita-360.webp` | 360×360 | Margherita | Menu rows |
| `buffalo-chicken-pizza-360.webp` | 360×360 | Buffalo Chicken | Menu rows; the website's fourth Featured card |
| `white-pie-360.webp` | 360×360 | White Pie | Menu rows; Featured |
| `garlic-knots-360.webp` | 360×360 | Garlic Knots | "Goes well with" (/upsells) |
| `loaded-fries-360.webp` | 360×360 | Loaded Fries | "Goes well with" (/upsells) |
| `buffalo-wings-360.webp` | 360×360 | Buffalo Wings | Featured |
| `chicken-parm-sandwich-360.webp` | 360×360 | Chicken Parm Sandwich | Featured |
| `cannoli-360.webp` | 360×360 | Cannoli | The reward card (/loyalty, /how-it-works) |
| `chopped-italian-salad-360.webp` | 360×360 | Chopped Italian Salad | Not shown yet (on the menu, outside the categories the visuals show) |
| `fresh-lemonade-360.webp` | 360×360 | Fresh Lemonade | Not shown yet (as above) |
| `hero-oven-900.webp` | 900×600 | A pizza at the stone oven | The website's hero image, above its heading (cropped with `object-fit: cover`) |
| `catering-spread-900.webp` | 900×600 | A catering spread: pizzas, wings, sandwiches, salad | The top of the catering page |

**Still to come:** Hot Honey Soppressata. The zip has no photo for it (its README says "still to come"), so no visual shows it yet: it is on the menu in `demo-order.ts` with `photo: null`, and the website features Buffalo Chicken in its place. When the photo arrives, add `hot-honey-soppressata-360.webp` (360×360, a centred square crop, WebP quality 80, like the others) and set its `photo`; it then takes the first Featured card (LOG.md follow-up).

### Logo: `public/demo/logo/`

| File | Shows | Where |
|---|---|---|
| `palmstone-pizza-mark.svg` | Logo A, a palmetto in a stone (teal, sand) | Beside the name in the restaurant's own bars (website, menu, catering, the order confirmation), the delivery tracking page, the search result |
| `palmstone-pizza-lockup-light.svg` | The mark with "Palm&Stone / PIZZA · BRICKELL", for light backgrounds | Not used yet |
| `palmstone-pizza-lockup-dark.svg` | The same, for dark backgrounds | Not used yet |

Its colours: teal #0f766e (the storefront's action colour, as before), deep teal #0b4f4a, terracotta #c8693a and sand #f3ead9. The restaurant's own screens use sand for their bands and cards and terracotta for its map pin and the rule over the website's intro band; WunTab's own panels keep their colours.

### Removed on 2026-10-19

- `public/hero-demo/spiced-lamb-meatballs.webp`: the old menu's one dish photo, a 174px crop of batch 1's menu-editor screenshot, shown up to five times its size. In git history.
- `public/demo/bread.jpg`, `cauliflower.jpg`, `chicken.jpg`, `greens.jpg`: left over from the old site and never referenced. In git history.

## Stock photos

None, and none planned. Every picture on the site is the demo restaurant's own, inside a built visual.
