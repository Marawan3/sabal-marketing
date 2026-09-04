# Sabal marketing site (sabalmenu.com)

Standalone Next.js site for Sabal. This is **not** the ROS dashboard and is **not** inside the ROS monorepo.

Every marketing page is prerendered. The only server code is `POST /api/demo`, which emails a demo request (Resend) and optionally forwards to a webhook. No database, no Clerk, no Blob, no NMI.

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run honesty      # bans fake social proof
npm run copy-lint    # bans hype phrases
npm run boundary-check
npm run build
```

## Edit copy

1. Change strings in `src/lib/copy.ts`.
2. Mirror the same words in `COPY.md` so the founder review file stays current.
3. Keep claims true. Any number needs a `source` comment in `copy.ts`.

## Swap assets

See `ASSETS.md`. Placeholder slots use `REPLACE: id` and `data-asset-slot`. Phone frames expect **390×844**. Desktop slots are **16:10 / 1440×900**.

Design tokens live in `src/app/globals.css` (`:root`). Palm green `#1e4d32` / `#2e6b45` is the accent (Sabal is a palm genus). Cream paper, Outfit type. Revisable.

## Pages

| Path | Role |
|---|---|
| `/` | Hero, Google-crawler proof, features, savings example, testimonial placeholders, demo form |
| `/product` | Storefront, ordering, kitchen, SEO, onboarding |
| `/pricing` | Flat monthly + processing at cost vs marketplaces as a category |
| `/about` | Orlando, independents, honesty rules |
| `/demo` | Name, restaurant, phone, city |
| Legal | Drafts until counsel signs off |

Old URLs `/how-it-works`, `/online-ordering`, `/restaurant-seo` 308 to `/product`.

## Domain

Intended public origin: **sabalmenu.com**. Indexing turns on when `NEXT_PUBLIC_SITE_URL` is `sabalmenu.com` / `www.sabalmenu.com` (or `sabal.ai` / `www.sabal.ai`), or when `NEXT_PUBLIC_ALLOW_INDEXING=true`.

`NEXT_PUBLIC_APP_URL` is the ROS sign-in (today `https://sabal.ai`).

## Deploy

Vercel project `sabal-marketing`. Production branch is `main`. Previews stay `noindex` until the host matches above.

Set `RESEND_API_KEY`, `RESEND_FROM`, and `DEMO_INBOX` so the demo form delivers.

## Honesty

No testimonials until a restaurant agrees. No named competitors. No fake urgency or exit popups. Marketplace contrast uses a **labeled example** (25% midpoint of a commonly published 15–30% range) — verify before treating as a launch claim.

## Pricing conflict (do not ignore)

Marketing pages now say **flat monthly + processing at cost, $0 per-order commission**. The MSA draft in `legal/` still says **5% of each online order**. `LAWYER-QUESTIONS.md` item 6 tracks the reconcile.
