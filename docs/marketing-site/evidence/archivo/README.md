# Archivo switch evidence, 2026-10-07

Full-page screenshots of the homepage, `/online-ordering` and `/pricing` at 360, 390 and 1440 wide: `before/` is main at `1974467` (Bricolage Grotesque) and `after/` is branch `marketing/archivo`. Both are production builds (`NEXT_PUBLIC_ALLOW_INDEXING=true NEXT_PUBLIC_SITE_URL=https://wuntab.com`, no shots uploaded). Each `report.json` holds the page height, the horizontal overflow, the H1's line count, size, weight, width and family, and any headline wider than its container.

## Results (after)

| Page | Width | Sideways scroll | H1 lines | H1 size | Headlines wider than their container |
|---|---|---|---|---|---|
| `/` | 360 | 0px | 4 | 33.0px | none |
| `/online-ordering` | 360 | 0px | 4 | 33.0px | none |
| `/pricing` | 360 | 0px | 1 | 33.0px | none |
| `/` | 390 | 0px | 4 | 34.0px | none |
| `/online-ordering` | 390 | 0px | 3 | 34.0px | none |
| `/pricing` | 390 | 0px | 1 | 34.0px | none |
| `/` | 1440 | 0px | 3 | 70.0px | none |
| `/online-ordering` | 1440 | 0px | 3 | 70.0px | none |
| `/pricing` | 1440 | 0px | 1 | 70.0px | none |

Every H1 on the site, not only these three pages, stays within 4 lines at 360 and 3 at 1440. `tests/design.spec.ts` checks it on every page.

## Wordmark

`wordmark-compare.png`: the header and footer logo at 3×, before (live Bricolage text) and after (SVG outlines), with differing pixels in red. Of the inked pixels, 177 of 10,325 differ in the header and 498 of 33,055 in the footer, and none differs strongly: it's anti-aliasing at the edges. The before image uses `text-rendering: geometricPrecision` because Linux Chromium snaps glyph advances to whole pixels, while Mac, iOS, Android and Windows don't. With that snapping the old text was 1.5px narrower, on Linux only.

## Fallback font

Page height with Archivo blocked (the fallback) against Archivo loaded:

```
390 /                  {"fallback":{"fam":"fallback","h1":139,"body":48,"page":4000},"archivo":{"fam":"archivo","h1":139,"body":48,"page":4024}}
390 /online-ordering   {"fallback":{"fam":"fallback","h1":104,"body":72,"page":3183},"archivo":{"fam":"archivo","h1":104,"body":72,"page":3183}}
390 /pricing           {"fallback":{"fam":"fallback","h1":35,"body":35,"page":1910},"archivo":{"fam":"archivo","h1":35,"body":35,"page":1878}}
1440 /                  {"fallback":{"fam":"fallback","h1":214,"body":54,"page":4663},"archivo":{"fam":"archivo","h1":214,"body":54,"page":4663}}
1440 /online-ordering   {"fallback":{"fam":"fallback","h1":214,"body":81,"page":3611},"archivo":{"fam":"archivo","h1":214,"body":81,"page":3611}}
1440 /pricing           {"fallback":{"fam":"fallback","h1":71,"body":71,"page":1765},"archivo":{"fam":"archivo","h1":71,"body":71,"page":1765}}
```

At 1440 nothing moves on any of the three pages. At 390 two single lines re-wrap: one FAQ question on the homepage and the "Pricing questions" heading. Closed FAQ answers make up the rest of the height difference, and they aren't visible.
