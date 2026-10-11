# Layout pass evidence, 2026-10-11

Full-page screenshots of the homepage, `/order-management` and `/online-ordering` at 360, 390 and 1440 wide, as wuntab.com renders them (production build):

- `before/` is main at `cb61291`.
- `after/` is branch `marketing/layout-pass`.
- `after/section-*-360.png` are close-ups of the homepage sections at 360.

## Screenshot body text on phones

How "body text" is measured: the dashboard captures set their body text at about 14px and the kitchen display at about 18px. This is the cap height of lines without descenders, measured from the files and recorded as `textPx` in `phoneCrops` in `src/lib/catalog.ts`. The rendered size is `textPx` multiplied by the image's on-screen scale. The target is 9px or more.

### Before: whole frames squeezed to phone width

| Page | Width | Shot | Frame width | Source pixels shown across | Body text |
|---|---|---|---|---|---|
| `/` | 360 | `orders-board` | 294px | 1425px | **2.9px** |
| `/` | 360 | `ordering-settings` | 240px | 1425px | **2.4px** |
| `/order-management` | 360 | `orders-board` | 294px | 1425px | **2.9px** |
| `/order-management` | 360 | `order-drawer` | 256px | 1425px | **2.5px** |
| `/order-management` | 360 | `ordering-settings` | 256px | 1425px | **2.5px** |
| `/order-management` | 360 | `kds` | 256px | 1165px | **4px** |
| `/online-ordering` | 360 | `promotions` | 256px | 1425px | **2.5px** |
| `/online-ordering` | 360 | `menu-editor-options` | 256px | 1425px | **2.5px** |
| `/` | 390 | `orders-board` | 324px | 1425px | **3.2px** |
| `/` | 390 | `ordering-settings` | 266px | 1425px | **2.6px** |
| `/order-management` | 390 | `orders-board` | 324px | 1425px | **3.2px** |
| `/order-management` | 390 | `order-drawer` | 282px | 1425px | **2.8px** |
| `/order-management` | 390 | `ordering-settings` | 282px | 1425px | **2.8px** |
| `/order-management` | 390 | `kds` | 282px | 1165px | **4.4px** |
| `/online-ordering` | 390 | `promotions` | 282px | 1425px | **2.8px** |
| `/online-ordering` | 390 | `menu-editor-options` | 282px | 1425px | **2.8px** |

### After: focal crops (product-row thumbnails use their own fixed crops)

| Page | Width | Shot | Frame width | Source pixels shown across | Body text |
|---|---|---|---|---|---|
| `/` | 360 | `orders-board` | 310px | 468px | **9.3px** |
| `/` | 360 | `ordering-settings` | 326px | 480px | **9.5px** |
| `/` | 360 | `kds` | 326px | 380px | **15.4px** |
| `/` | 360 | `menu-editor` | 190px | 192px | **13.9px** |
| `/` | 360 | `kds` | 190px | 355px | **9.6px** |
| `/order-management` | 360 | `orders-board` | 326px | 468px | **9.8px** |
| `/order-management` | 360 | `order-drawer` | 326px | 444px | **10.3px** |
| `/order-management` | 360 | `ordering-settings` | 326px | 480px | **9.5px** |
| `/order-management` | 360 | `kds` | 326px | 380px | **15.4px** |
| `/online-ordering` | 360 | `promotions` | 326px | 480px | **9.5px** |
| `/online-ordering` | 360 | `menu-editor-options` | 326px | 444px | **10.3px** |
| `/` | 390 | `orders-board` | 340px | 468px | **10.2px** |
| `/` | 390 | `ordering-settings` | 356px | 480px | **10.4px** |
| `/` | 390 | `kds` | 356px | 380px | **16.9px** |
| `/` | 390 | `menu-editor` | 190px | 192px | **13.9px** |
| `/` | 390 | `kds` | 190px | 355px | **9.6px** |
| `/order-management` | 390 | `orders-board` | 356px | 468px | **10.6px** |
| `/order-management` | 390 | `order-drawer` | 356px | 444px | **11.2px** |
| `/order-management` | 390 | `ordering-settings` | 356px | 480px | **10.4px** |
| `/order-management` | 390 | `kds` | 356px | 380px | **16.9px** |
| `/online-ordering` | 390 | `promotions` | 356px | 480px | **10.4px** |
| `/online-ordering` | 390 | `menu-editor-options` | 356px | 444px | **11.2px** |

The two `kds` rows at 190px are the homepage's order-management row thumbnail, which is a single ticket. `menu-editor` at 190px is the dish photo in the online-ordering row; it contains no text, so its figure is the scale at which text would render.

## Page height

| Page | Width | Before | After |
|---|---|---|---|
| `/` | 360 | 4,334px | 6,725px |
| `/order-management` | 360 | 3,615px | 5,203px |
| `/online-ordering` | 360 | 3,598px | 4,557px |
| `/` | 390 | 4,335px | 6,778px |
| `/order-management` | 390 | 3,655px | 5,342px |
| `/online-ordering` | 390 | 3,587px | 4,511px |
| `/` | 1440 | 5,320px | 6,825px |
| `/order-management` | 1440 | 5,187px | 4,798px |
| `/online-ordering` | 1440 | 4,211px | 3,924px |

The homepage at 390 is taller than before: 4,335px became 6,778px. Three things add height:
- the outcome tabs are stacked with a readable crop under "Less busywork";
- the new kitchen band shows two tickets at near real size;
- the steps and product rows are vertical lists instead of swipe rows.

It stays under the 10,000px limit, and a test checks that.
