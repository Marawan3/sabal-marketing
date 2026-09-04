# Assets checklist

Every slot is marked in code with `REPLACE: …` or `data-asset-slot`. Until a file lands, the site uses HTML reconstructions or dashed placeholders.

## Logo and icons

| ID | Where | Size | Status |
|---|---|---|---|
| `logo.svg` | Header, footer, favicon | SVG, current S-mark in palm green `#1e4d32` | In repo. Confirm this is the final mark. |
| `icon.svg` | App icon | 32×32 | In repo. Cream field + palm S. |

## Open Graph (generated)

`opengraph-image.tsx` on each route outputs **1200×630** PNG. No photo required. Replace with designed stills later if you want food in the share card.

## Production screenshots (phone)

Inner content **390×844** (9:19.5). Shoot on a real device or export from the storefront at that CSS size. Drop into the phone frame on Home and Product.

| ID | Shot | Ratio / px | Goes on |
|---|---|---|---|
| `storefront-phone` | Live menu, 3–4 dishes, cart chip | 390×844 | Home hero, Product `#storefront` |
| `item-phone` | Dish sheet with photo + Add | 390×844 | Product `#ordering` |
| `checkout-phone` | Name, phone, payment, tip row with **None** selected | 390×844 | Product `#ordering` |
| `tracking-phone` | Order confirmation / tracking | 390×844 | Product `#kitchen` |

## Production screenshots (desktop)

| ID | Shot | Ratio / px | Goes on |
|---|---|---|---|
| `onboarding-team` | Menu import or launch checklist | 16:10 · 1440×900 | Product `#service` |
| `crawler-optional` | Optional: DevTools view-source of a live dish page | 16:10 · 1440×900 | Home proof (today is HTML, not a shot) |

## Kitchen

| ID | Shot | Ratio / px | Goes on |
|---|---|---|---|
| `printer-ticket` | Real kitchen print or Clover ticket photo, cropped square-ish | 4:3 · 1200×900 | Product `#kitchen` (today: HTML ticket mock) |

## Dish photography (demo kitchen)

Used only as menu photography in product frames. Do **not** present as customer restaurants.

| ID | Dish | Size | Status |
|---|---|---|---|
| `dish-chicken` | Citrus herb chicken | 800×800 | Color placeholder |
| `dish-cauliflower` | Charred cauliflower | 800×800 | Color placeholder |
| `dish-greens` | Grove greens | 800×800 | Color placeholder |
| `dish-bread` | Tomato bread | 800×800 | Color placeholder |

Optional food-energy band later: 1600×1200 lifestyle stills. Not on the page yet.

## Testimonials

No photos until a restaurant agrees. Cards are dashed placeholders. If you add headshots: 160×160, circle crop.

## Do not add

- Competitor logos
- Invented review stars
- Marketplace app icons
- Stock “happy chef” that we pass off as a customer
