---
title: Privacy
slug: privacy
version: 0.1.0-draft
audience: sabal
description: Covers the marketing site, demo form, and ROS staff accounts. Does not cover diner storefronts.
---

> DRAFT — not yet attorney-reviewed — do not publish

**[LEGAL_ENTITY_NAME]** (“Sabal”, “we”) provides restaurant websites and online ordering. This policy covers:

- Visitors to this marketing website
- People who submit the demo form
- Restaurant staff who sign into the ROS dashboard (Clerk accounts)

It does **not** cover diners ordering on a restaurant storefront. Those visits are covered by that restaurant’s storefront privacy policy. The restaurant is controller of diner data; Sabal is processor (see the DPA).

**Contact:** **[CONTACT_EMAIL]** (legal) and `hello@sabal.ai` (the operational demo inbox unless env overrides it).

# Marketing site — what we collect

If you submit the demo form, we receive the fields you type: **name, restaurant, city, email, phone, message**. Email or phone is required. A hidden honeypot field is ignored except to drop bots.

That request is **emailed** via Resend to our inbox (`DEMO_INBOX`, defaulting to `hello@sabal.ai`). If `DEMO_WEBHOOK_URL` is configured, the same fields are POSTed to that URL. **This marketing site does not keep a leads database.** If Resend is not configured, the form tells you to email us directly and may log that a request arrived without storing it as a CRM record.

We do not add demo-form submitters to a newsletter (the form says so, and there is no newsletter list in this app).

This marketing site has **no login** and **no access** to restaurant orders, menus, or payment data.

# Marketing site — cookies and analytics

We do not set advertising cookies.

If `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set, we load [Plausible](https://plausible.io) for page-view analytics (`script.js`, domain as configured). **If that variable is unset, the script is not on the page.** **[Confirm production intent before publishing this sentence as a guarantee either way.]**

# ROS staff accounts

Restaurant staff sign in with **Clerk**. Sabal stores a user id tied to Clerk, last-seen time, and on membership records a **display name, email, role, and status** mirrored at sign-in. Clerk session cookies are Clerk’s.

Staff actions (settings changes, voids, refunds, SMS send/skip, and similar) are written to **append-only audit logs** with an internal actor id, not the email, as the actor field. Staff should assume operational actions in the dashboard are logged.

Invitations are sent through Clerk’s invitation API.

# What we do not do with this data

We do not sell personal information. We do not run ad networks on this marketing site today.

# Processors for this policy’s data

- **Vercel** — hosts this site and ROS
- **Resend** — sends demo-form email (marketing site only)
- **Clerk** — staff authentication (ROS only)
- **Neon** — ROS database (staff membership and audit logs; not the marketing site)
- **Plausible** — only if enabled as above

# Retention

Demo emails live in our inbox and, if used, Resend’s logs, subject to those tools. We have no marketing-site database to purge. ROS staff records and audit logs are retained **indefinitely** in the product today. **[Lawyer: state periods you can honor.]**

# Your choices

Email **[CONTACT_EMAIL]** for access or deletion requests about demo-form or staff-account data. Diner requests belong with the restaurant first; we coordinate as processor.

# Changes

We will bump `version` and `[EFFECTIVE_DATE]` in the repository when this policy changes. Prior files remain as evidence of what applied when.
