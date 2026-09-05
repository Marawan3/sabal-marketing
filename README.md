# Wuntab marketing site

Standalone Next.js marketing site for **Wuntab** (restaurant websites + commission-free ordering). This is not the product repo and must never import from it.

Every page is prerendered (`dynamic = "error"`). There is no database, no API route, and no secret. The only CTA is a mailto (or a Cal URL via `NEXT_PUBLIC_DEMO_HREF` when one exists).

All public copy is **draft** until Marawan approves it. Do not promote a production deploy on `wuntab.com` without that sign-off.

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

```bash
npm run build
npm run honesty && npm run copy-lint && npm run boundary-check
npm run test
```

## Domain (Marawan step)

Attach `wuntab.com` on the Vercel project after copy approval:

1. Vercel → project **sabal-marketing** (rename later if you want) → **Settings** → **Domains**
2. Add `wuntab.com` and `www.wuntab.com`
3. In the registrar DNS, add the records Vercel shows (usually A `10.0.1.2` for apex, CNAME `cname.vercel-dns.com` for www)
4. Set `NEXT_PUBLIC_SITE_URL=https://wuntab.com` on Production
5. Confirm the first HTML response with `curl` before treating it as live

Until the host is `wuntab.com` / `www.wuntab.com` (or `NEXT_PUBLIC_ALLOW_INDEXING=true`), the site stays `noindex`.

## Honesty

No competitor names, invented prices, customer counts, testimonials, or ranking promises. `npm run honesty` greps the source.
