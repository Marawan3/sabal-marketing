# Sabal marketing site

Standalone Next.js site for Sabal (restaurant websites + online ordering). This is **not** the ROS dashboard and is **not** inside the ROS monorepo.

Every page is prerendered. The only server code is `POST /api/demo`, which emails a demo request (Resend) and optionally forwards to a webhook. No database, no Clerk, no Blob, no NMI.

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Domain (needs a decision)

ROS currently lives on `https://sabal.ai`. Do **not** move it until this is approved.

- **Option A (recommended):** marketing at `sabal.ai`, ROS moves to `app.sabal.ai`. Touches `NEXT_PUBLIC_APP_URL`, Clerk allowed origins/redirects, invitation links, NMI webhook URLs, and any hardcoded `sabal.ai` links in ROS. Do not execute those in this repo.
- **Option B (zero-risk interim):** marketing at `www.sabal.ai`, apex 308s to www, ROS stays on the apex. Swap to A later.

Until a domain is attached, deploys stay `noindex`. Indexing turns on when `NEXT_PUBLIC_SITE_URL` is `sabal.ai` / `www.sabal.ai`, or when `NEXT_PUBLIC_ALLOW_INDEXING=true`.

Set `NEXT_PUBLIC_APP_URL` to the current ROS origin so header **Log in** works. Today that is `https://sabal.ai`.

## Launch checklist

- [ ] Domain option A or B chosen
- [ ] `NEXT_PUBLIC_SITE_URL` set to the public origin
- [ ] `noindex` gone (host match or `NEXT_PUBLIC_ALLOW_INDEXING`)
- [ ] `RESEND_API_KEY`, `RESEND_FROM`, `DEMO_INBOX` set; demo form delivers
- [ ] Google Search Console verified, sitemap submitted, Rich Results clean
- [ ] Lighthouse ≥ 95 on the production URL
- [ ] Legal pages reviewed (`/privacy`, `/terms`, `/accessibility` are drafts)
- [ ] Delivery-network partner named on `/online-ordering` only after it is public
- [ ] Real product screenshots swapped in if the HTML mockups are no longer close enough

## Honesty

No testimonials, invented metrics, named-competitor comparisons, or ranking guarantees. `npm run honesty` greps the copy.

## Screenshots

Product frames are HTML reconstructions of the live storefront, KDS, and SEO score panel, using the Sabal product navy (`#003e80`) and a clean internal demo tenant named **Sabal Demo Kitchen**. Food photos are Unsplash, used only as dish photography on that demo menu.
