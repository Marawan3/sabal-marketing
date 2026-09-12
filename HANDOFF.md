# Handoff — Wuntab marketing site

For the next agent (Fable 5.1). Read this before editing. Owner: Marawan Elkabany (`marawan@sabalpay.com`).

> **Re-platformed 2026-09-05 (later the same day).** The site is no longer one page.
> Marawan's platform spec turned it into ~45 routes: four product pillars (Sell / Grow /
> Operate / Scale) generated from `src/lib/catalog.ts` through one template, six
> `/solutions/*` pages, `/pricing`, `/how-it-works`, `/menu-check` (the old proof
> tickets, now a lead tool), `/about`, `/contact`, `/blog`. Positioning is "More direct
> orders. More repeat customers. One platform." Do not lead with Google/menu SEO.
> Product screens are `ScreenFrame` slots that read `public/shots/<key>.*`; the
> checklist is in `ASSETS.md`. Regenerate `COPY.md` and that checklist with `npm run docs`.
> Cut products (never reintroduce): Website Grader, Developer API, Webhooks, WunTab POS,
> Inventory, Labor scheduling, Restaurant CRM. POS integrations are "Coming soon".
>
> **Superseded 2026-09-05.** Marawan reviewed the site and rejected the look as generic.
> The design constraints below (cream page, brick accent, system font, weights 400/500,
> no shadows, no client JS) and the pricing line ("flat monthly, no per-order
> commission") are no longer the direction. The source of truth is now
> `.claude/skills/wuntab-design/SKILL.md` (Wuntab palette, type, sections, allowed
> numbers, pricing = 5% per online order) together with
> `.claude/skills/frontend-design/SKILL.md` (Anthropic's craft guide). Load both before
> any visual or copy work. Everything else in this note (repo boundaries, honesty
> rules, no competitor names, no "Sabal" in rendered HTML, static only, no invented
> numbers, no tenant imagery without rights) still applies.

## What this repo is

- **GitHub:** `Marawan3/sabal-marketing` (public). Working product name is **Wuntab**. The repo and Vercel project are still named `sabal-marketing`.
- **Not** the product monorepo. The product lives in `sabal-ros` (private, Vercel project `sabal-ros`). This marketing app must never import from it, never gain a DB, never receive Clerk / Blob / NMI / Resend / ROS secrets.
- **Audience:** restaurant owners (B2B), not diners. Secondary: credibility surface for a Clover app review.
- **Intended public domain:** `wuntab.com` (Marawan owns it; **not attached yet**). `sabal.ai` is still the ROS app (Clerk). Do not move ROS.

Current `main` (production): `66f14f7` — Wuntab static marketing site.

## What we were doing (this thread)

1. Earlier agents rebuilt this site as a cream/palm-green **sabalmenu.com** pitch, then as a “Google can't read your menu” headline. Marawan rejected both: “roll it back to base this is ass,” then “roll it back one more time.”
2. Production was restored to the original dark **5% of each online order** Sabal site (`5e59989` tree, commit `309a4d6` on main).
3. Marawan then dropped `wuntab-marketing-site-spec.md` and asked to build **wuntab.com** from that spec, with overrides:
   - Do **not** wait for or import a brand module from the product repo.
   - Define tokens locally (values below).
   - Logo SVGs “are in the spec — implement exactly” — **they were not in the uploaded file.**
   - Add an AI-discovery proof line (factual, no overclaim).
   - Static only. All copy draft until he approves. No production without sign-off.
4. Site was built on `cursor/wuntab-marketing-site-05a5` as draft PR #3. Evidence: Playwright, local `curl` of first HTML, Lighthouse 100s at 390 and 1440, section screenshots.
5. Marawan said **“merge to main.”** Fast-forwarded and pushed. PR #3 is **MERGED**. Vercel production will serve this Wuntab site. `wuntab.com` is still not on the project.

## Non-negotiables (do not break)

- **No competitor names** anywhere public. Proof stats say “a leading competitor's platform” / “the incumbent stack.” Never Owner.com, DoorDash, Uber Eats, Grubhub, ChowNow, Square Online, Toast-as-competitor. Clover is allowed (POS we support). Claude and ChatGPT are allowed (AI-readability line).
- **No invented numbers:** no monthly dollar amount, no customer counts, no testimonials, no “#1,” no “trusted by,” no ranking promises.
- **No restaurant photos or live-site links** until Chaat House owner written OK. Typographic hero only. No stock photos.
- **Static only:** no API routes, no Resend, no form posts, no secrets. CTA is mailto (or Cal via `NEXT_PUBLIC_DEMO_HREF` when supplied).
- **Rendered HTML must never contain `sabal`.** Playwright tests this. Honesty/copy-lint grep `src/` for `sabal` and competitor names.
- **Legal markdown in `legal/` is the old Sabal 5% packet.** Do not route those files. `/terms` and `/privacy` stay “coming soon” until counsel rewrites for Wuntab + monthly/no-commission.
- Pricing marketing is **flat monthly + no per-order commission**. The old site’s 5% claim is dead. Do not revive it on public pages.

## Brand tokens (local, source of truth)

`src/lib/brand.ts` and `src/app/globals.css`:

| Token | Hex | Use |
| --- | --- | --- |
| brick | `#A8431F` | CTAs, tile, stat numbers |
| terracotta | `#E07A5F` | accent (use sparingly; contrast on cream is weak) |
| charcoal | `#2B2B2B` | text |
| cream | `#FAF3EC` | page background |
| sand | `#F2CC8F` | proof/pricing card wash |
| warm gray | `#8A8A8A` | hairlines / large labels only — **fails WCAG on cream for small text**. Body secondary is `charcoal/70–80`. |

Design: cream page, charcoal type, brick CTAs (cream text), sand card accents, 12px radius, no gradients, no decorative shadows, one type family, weights 400/500 only (`font-medium`, not `font-semibold`).

**Logo:** official SVGs were missing from the spec drop. Current mark is a brick rounded square + “WUNTAB” wordmark. **Do not invent a custom illustrated logo.** When Marawan provides SVGs, replace `public/logo.svg` and `src/components/logo.tsx` exactly.

Type: system UI sans (`ui-sans-serif, system-ui, …`) so Lighthouse LCP stays clean. Spec said drop a webfont if it hurts scores.

## What the site is (v1)

Single page + two legal placeholders.

**Nav:** lockup left; anchors How it works · Proof · Pricing · FAQ; CTA “Book a demo” (brick / cream). Mobile menu is `<details>` (no client JS).

**Page order:**

1. Hero — “Your menu, on Google. Your orders, commission-free.”
2. Proof — three measured cards + AI line “Readable by Google — and by AI assistants.” Footnote: measured Sept 2026, same restaurant, both platforms. No live-site link.
3. How it works — build site → kitchen (POS or printer, SMS backup) → merchant of record, money to their account.
4. Feature grid — six one-liners (SEO menus, commission-free, kitchen/POS, delivery, AI-drafted human-approved, honest checkout).
5. Pricing — “Simple monthly price. No per-order commission. No setup fee surprises.” Slot: **To be confirmed.** CTA “Talk to us.”
6. FAQ — domain ownership, Clover + printers, delivery, merchant of record, can leave anytime.
7. Footer — lockup, `hello@wuntab.com`, Terms, Privacy, © Wuntab.

Copy lives in `src/lib/copy.ts` and is mirrored in `COPY.md`. Treat as draft until Marawan edits/approves.

Zero `"use client"` components. Header/FAQ use native `<details>`. That is intentional (SSR story + Lighthouse).

Old Sabal routes 308 in `next.config.ts` to `/`, `/#how-it-works`, `/#pricing`, `/terms`, or `/privacy`.

Indexing stays off until host is `wuntab.com` / `www.wuntab.com` or `NEXT_PUBLIC_ALLOW_INDEXING=true`.

## Key files

| Path | Role |
| --- | --- |
| `src/lib/copy.ts` | All public draft copy |
| `src/lib/brand.ts` | Color tokens |
| `src/lib/site.ts` | Name, nav, mailto, indexing |
| `src/app/page.tsx` | The one marketing page |
| `src/components/logo.tsx` | Temporary tile + wordmark |
| `src/app/globals.css` | Tokens + theme |
| `COPY.md` / `ASSETS.md` | Human review of copy and asset gaps |
| `legal/` | Old Sabal attorney drafts — **do not publish** |
| `tests/marketing.spec.ts` | First HTML, anchors, legal 200, no “Sabal” |
| `scripts/honesty-check.mjs` | Banned claims / names |
| `scripts/lighthouse.mjs` | 390 mobile + 1440 `--preset=desktop` |

## How to run

```bash
cp .env.example .env.local
npm install
npm run dev
```

```bash
NEXT_PUBLIC_ALLOW_INDEXING=true npm run build   # so local Lighthouse SEO is not dinged for noindex
npm run honesty && npm run copy-lint && npm run boundary-check
npm run lint
npm run test   # Playwright; starts its own server on :3002; do not leave another process on 3002
node scripts/lighthouse.mjs http://127.0.0.1:3002 /tmp/lh
```

Playwright `webServer.reuseExistingServer` is **false**. A leftover `next start` on 3002 will fail tests or serve a stale build (this bit us once).

This Next.js version has breaking changes vs older training data. Read `node_modules/next/dist/docs/` before inventing APIs.

## Vercel / domains

- Team `sabal1` (`team_U8XO0V2c6TedrSXMuBw2Zpr4`)
- Project `sabal-marketing` (`prj_U29A9wyMtWqbJgfqCY8ChkP19sXi`)
- Preview `*.vercel.app` has **Vercel Authentication**. Raw `curl` 302s to SSO. Use `vercel curl` if the CLI is logged in. Do not turn protection off unless Marawan asks.
- Production host today is still the Vercel project URL, not `wuntab.com`.
- **Marawan DNS path (do not execute unless he asks):** Vercel → sabal-marketing → Settings → Domains → add `wuntab.com` and `www.wuntab.com` → put the A/CNAME records he is shown on the registrar → set Production `NEXT_PUBLIC_SITE_URL=https://wuntab.com` → `curl` first HTML and report.

## Open items (named checkpoints)

1. Official logo SVGs — drop-in replace, do not redraw.
2. Chaat House photo / menu / live-site rights.
3. Real monthly price into the pricing slot.
4. Cal link or confirmed `hello@wuntab.com` inbox (`NEXT_PUBLIC_DEMO_HREF` / `NEXT_PUBLIC_CONTACT_EMAIL`).
5. Counsel rewrite of Terms / Privacy for Wuntab + monthly/no-commission. Entity name still blank in old drafts.
6. Copy approval (he merged to main anyway; copy is still labeled draft in code).
7. Domain attach + first production curl on `wuntab.com`.
8. Optional: rename GitHub/Vercel project from `sabal-marketing` — cosmetic, not required.

## What not to do next

- Do not restore the dark 5% Sabal site or the cream sabalmenu / crawler-headline experiments unless he explicitly asks.
- Do not add `/api/demo`, Resend, a database, or Clerk.
- Do not import `packages/ui` or anything from `apps/ros` / `apps/sites`.
- Do not put “Sabal” back in rendered HTML, metadata, JSON-LD, or emails (`hello@sabal.ai` fails the Sabal test).
- Do not invent testimonials or a dollar price “to look finished.”
- Do not ship tenant imagery on an assumption.
- Do not treat Lighthouse desktop as `--form-factor=desktop` alone — that keeps **mobile** throttle and scores desktop harshly. Use `--preset=desktop` for 1440 (`scripts/lighthouse.mjs` already does this).

## Spec vs this repo

The written spec assumed `apps/www` in the sabal-ros monorepo, waiting on a rebrand PR’s brand module, and Lighthouse CI in that repo. Marawan overrode the wait. This standalone app is the marketing site. Do not scaffold a second `apps/www` here.

The uploaded spec path in the last build session was `wuntab-marketing-site-spec.md` (no SVGs). If a fuller spec with logo markup appears, implement those SVGs exactly.
