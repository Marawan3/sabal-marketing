# Screenshots batch 1 evidence, 2026-10-10

Full-page screenshots of the homepage, `/order-management`, `/online-ordering` and `/how-it-works` at 360, 390 and 1440 wide, as wuntab.com renders them (production build).

- `before/`: main at `ca0c1c8`, with no shots uploaded.
- `after/`: branch `marketing/shots-batch1`, with eight of the owner's screenshots in `public/shots/`.

| Page | Width | Height before | Height after | Sideways scroll after |
|---|---|---|---|---|
| `/` | 360 | 4,042px | 4,334px | 0px |
| `/order-management` | 360 | 2,928px | 3,615px | 0px |
| `/online-ordering` | 360 | 3,211px | 3,598px | 0px |
| `/how-it-works` | 360 | 4,865px | 5,285px | 0px |
| `/` | 390 | 4,024px | 4,335px | 0px |
| `/order-management` | 390 | 2,933px | 3,655px | 0px |
| `/online-ordering` | 390 | 3,183px | 3,587px | 0px |
| `/how-it-works` | 390 | 4,709px | 5,166px | 0px |
| `/` | 1440 | 4,663px | 5,320px | 0px |
| `/order-management` | 1440 | 3,406px | 5,187px | 0px |
| `/online-ordering` | 1440 | 3,611px | 4,211px | 0px |
| `/how-it-works` | 1440 | 4,877px | 5,105px | 0px |

`after/home-tabs-360.png` shows the outcome tabs at 360. The row is as tall as the panel in view, so the short text panels don't sit over blank space.

## Frame check (360, 390, 1440)

30 frames across these pages were checked. In every one:
- the image loaded;
- it shows the whole file, with nothing cut at the top or bottom;
- only the 15px white scrollbar gutter on the right is hidden.

Images below the hero load lazily. The hero frame loads eagerly at high fetch priority.

## Formats

`next/image` serves each PNG as AVIF, then WebP, then the PNG itself, according to what the browser accepts. The frame's width and height are fixed before the image arrives. Example: `orders-board.png` at 828px wide is 14 KB as AVIF, 15 KB as WebP and 26 KB as PNG. The original file is 113 KB.
