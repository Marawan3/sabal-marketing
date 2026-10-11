# Retina prep evidence, 2026-10-11

`tests/design.spec.ts` › "retina: the file's pixels cover every frame at 390 (3x) and 1440 (2x)".

The test visits every page at two viewports:
- **390 wide, device pixel ratio 3**, like a modern phone;
- **1440 wide, device pixel ratio 2**, like a retina laptop.

For each visible screenshot frame it compares the file pixels behind the visible area with the device pixels the frame is drawn at. A ratio under 1.00 means the image is being stretched, which reads as blur.

- **Ratio (source):** what the file on disk could give.
- **Ratio (as delivered):** what next/image actually sends, given the frame's `sizes` hint and the widths the optimizer is allowed to produce.

Both must be at least 1.00.

## Today: the 1x files (`RETINA_STRICT=1`, so the test fails)

18 of 24 frames are below 1.00 on source.

| Viewport | Page | Shot | Frame CSS px | Device px needed | File px covering it | Ratio (source) | Ratio (as delivered) |
| 390 @3x | `/` | `orders-board` | 340 | 1020 | 468 | **0.46** | 0.46 |
| 390 @3x | `/` | `ordering-settings` | 356 | 1068 | 480 | **0.45** | 0.45 |
| 390 @3x | `/` | `kds` | 356 | 1068 | 380 | **0.36** | 0.36 |
| 390 @3x | `/` | `menu-editor` | 190 | 570 | 192 | **0.34** | 0.34 |
| 390 @3x | `/` | `kds` | 190 | 570 | 355 | **0.62** | 0.62 |
| 390 @3x | `/how-it-works` | `menu-editor` | 356 | 1068 | 444 | **0.42** | 0.42 |
| 390 @3x | `/how-it-works` | `dash-overview` | 356 | 1068 | 480 | **0.45** | 0.45 |
| 390 @3x | `/online-ordering` | `promotions` | 356 | 1068 | 480 | **0.45** | 0.45 |
| 390 @3x | `/online-ordering` | `menu-editor-options` | 356 | 1068 | 444 | **0.42** | 0.42 |
| 390 @3x | `/order-management` | `orders-board` | 356 | 1068 | 468 | **0.44** | 0.44 |
| 390 @3x | `/order-management` | `order-drawer` | 356 | 1068 | 444 | **0.42** | 0.42 |
| 390 @3x | `/order-management` | `ordering-settings` | 356 | 1068 | 480 | **0.45** | 0.45 |
| 390 @3x | `/order-management` | `kds` | 356 | 1068 | 380 | **0.36** | 0.36 |
| 1440 @2x | `/` | `orders-board` | 1098 | 2196 | 1425 | **0.65** | 0.65 |
| 1440 @2x | `/` | `kds` | 1022 | 2044 | 1165 | **0.57** | 0.57 |
| 1440 @2x | `/` | `menu-editor` | 222 | 444 | 192 | **0.43** | 0.43 |
| 1440 @2x | `/` | `kds` | 222 | 444 | 355 | **0.80** | 0.80 |
| 1440 @2x | `/how-it-works` | `menu-editor` | 575 | 1151 | 1425 | **1.24** | 1.24 |
| 1440 @2x | `/how-it-works` | `dash-overview` | 575 | 1151 | 1425 | **1.24** | 1.03 |
| 1440 @2x | `/online-ordering` | `promotions` | 494 | 988 | 1425 | **1.44** | 1.08 |
| 1440 @2x | `/online-ordering` | `menu-editor-options` | 494 | 988 | 1425 | **1.44** | 1.08 |
| 1440 @2x | `/order-management` | `orders-board` | 1022 | 2044 | 1425 | **0.70** | 0.70 |
| 1440 @2x | `/order-management` | `order-drawer` | 494 | 988 | 1425 | **1.44** | 1.08 |
| 1440 @2x | `/order-management` | `ordering-settings` | 494 | 988 | 1425 | **1.44** | 1.08 |
| 1440 @2x | `/order-management` | `kds` | 494 | 988 | 1165 | **1.18** | 1.18 |

## Dry run: the same files upscaled 3x, standing in for the retakes

These were temporary copies made only for this check, and they were never committed. The test passed with no expected-failure mark. The lowest delivered ratio is 1.00: the dish photo in the homepage's online-ordering row, which shows a 192px-wide slice of the file. That slice is why `deviceSizes` now includes 4320.

| Viewport | Page | Shot | Frame CSS px | Device px needed | File px covering it | Ratio (source) | Ratio (as delivered) |
| 390 @3x | `/` | `orders-board` | 340 | 1020 | 1404 | **1.38** | 1.22 |
| 390 @3x | `/` | `ordering-settings` | 356 | 1068 | 1440 | **1.35** | 1.20 |
| 390 @3x | `/` | `kds` | 356 | 1068 | 1140 | **1.07** | 1.07 |
| 390 @3x | `/` | `menu-editor` | 190 | 570 | 576 | **1.01** | 1.01 |
| 390 @3x | `/` | `kds` | 190 | 570 | 1065 | **1.87** | 1.01 |
| 390 @3x | `/how-it-works` | `menu-editor` | 356 | 1068 | 1332 | **1.25** | 1.25 |
| 390 @3x | `/how-it-works` | `dash-overview` | 356 | 1068 | 1440 | **1.35** | 1.20 |
| 390 @3x | `/online-ordering` | `promotions` | 356 | 1068 | 1440 | **1.35** | 1.20 |
| 390 @3x | `/online-ordering` | `menu-editor-options` | 356 | 1068 | 1332 | **1.25** | 1.11 |
| 390 @3x | `/order-management` | `orders-board` | 356 | 1068 | 1404 | **1.31** | 1.17 |
| 390 @3x | `/order-management` | `order-drawer` | 356 | 1068 | 1332 | **1.25** | 1.11 |
| 390 @3x | `/order-management` | `ordering-settings` | 356 | 1068 | 1440 | **1.35** | 1.20 |
| 390 @3x | `/order-management` | `kds` | 356 | 1068 | 1140 | **1.07** | 1.07 |
| 1440 @2x | `/` | `orders-board` | 1098 | 2196 | 4320 | **1.97** | 1.75 |
| 1440 @2x | `/` | `kds` | 1022 | 2044 | 3540 | **1.73** | 1.00 |
| 1440 @2x | `/` | `menu-editor` | 222 | 444 | 576 | **1.30** | 1.15 |
| 1440 @2x | `/` | `kds` | 222 | 444 | 1065 | **2.40** | 1.30 |
| 1440 @2x | `/how-it-works` | `menu-editor` | 575 | 1151 | 4320 | **3.75** | 3.34 |
| 1440 @2x | `/how-it-works` | `dash-overview` | 575 | 1151 | 4320 | **3.75** | 1.04 |
| 1440 @2x | `/online-ordering` | `promotions` | 494 | 988 | 4320 | **4.37** | 1.09 |
| 1440 @2x | `/online-ordering` | `menu-editor-options` | 494 | 988 | 4320 | **4.37** | 1.09 |
| 1440 @2x | `/order-management` | `orders-board` | 1022 | 2044 | 4320 | **2.11** | 1.88 |
| 1440 @2x | `/order-management` | `order-drawer` | 494 | 988 | 4320 | **4.37** | 1.09 |
| 1440 @2x | `/order-management` | `ordering-settings` | 494 | 988 | 4320 | **4.37** | 1.09 |
| 1440 @2x | `/order-management` | `kds` | 494 | 988 | 3540 | **3.58** | 2.07 |

In the same dry run, the gutter test failed for every upscaled file, because their content hashes are new and so their 15px white strip would not be trimmed. If the 3x retakes have the strip too, add their hashes to `RIGHT_GUTTER` in `src/lib/shot-files.ts` with width 15 (layout pixels).
