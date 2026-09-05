# Assets

## Logo (geometry locked, colors ours)

Geometry comes from `wuntab-rebrand-spec.md` §2 and is implemented exactly: rounded-square tile (rx 14/56), one-stroke W with the raised center peak, WUNTAB wordmark in caps at weight 500 with 3px tracking, horizontal lockup with a 14px gap. Never symmetrize the W.

Colors were recolored for this palette (Marawan, 2026-09-05: "the colors are yours"):

| Surface | Tile | W stroke | Wordmark |
|---------|------|----------|----------|
| Light (paper, ticket) | ink `#13213C` | saffron `#F4A83A` | ink |
| Dark (ink band, footer) | saffron | ink | paper |

Files: `src/components/logo.tsx` (React), `public/logo.svg` (static, used in JSON-LD), `src/app/icon.svg`, `src/app/favicon.ico` (16/32/48), `src/app/apple-icon.png` (180). Regenerate the raster icons with `node scripts/icons.mjs`. Review sheet: `evidence/logo/logo-sheet.png`.

## Product screenshots (waiting on Marawan)

Real phone screenshots of the Orlando restaurant site (menu, dish page, checkout, Clover ticket) go in `public/shots/` as WebP with explicit dimensions. Until they arrive the proof tickets are typographic. The dish names on the right ticket are placeholders; see `COPY.md`.

## Photos

No restaurant photos, menu scans, or live-site links until the owner's written OK. No stock photos. The JPGs in `public/demo/` are left over from the old site and are not referenced anywhere; delete them once Marawan confirms they are not needed.
