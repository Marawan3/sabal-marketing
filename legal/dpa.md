---
title: Data Processing Agreement
slug: dpa
version: 0.1.0-draft
audience: restaurants
description: Restaurant is controller of diner data; Sabal is processor. Annex lists what the code actually stores.
---

> DRAFT — not yet attorney-reviewed — do not publish

This Data Processing Agreement (“DPA”) is an annex to the MSA between **[LEGAL_ENTITY_NAME]** (“Sabal”, processor) and the Restaurant (“controller”) for **diner personal data** processed to run the storefront and orders.

Sabal is **controller** (not processor) of (a) ROS staff-account data and (b) marketing-site / demo-form data. Those are covered by the Sabal Privacy Policy, not this DPA.

**[Anchor: US state privacy laws (CCPA/CPRA and others) vs GDPR. GDPR only if EU diners are in scope.]**

# 1. Processing details

**Subject:** diners who place or receive orders on a restaurant storefront.  
**Purpose:** accept, pay, fulfill, track, and support the order; send transactional SMS; run delivery when enabled.  
**Duration:** for the MSA term plus the retention in Annex B.  
**Nature:** hosting, storage, transmission to subprocessors listed below.

## Annex A — data actually processed (from the live schema)

Collected at public checkout today:

- First name, last name (stored as customer display name and order name snapshot)
- Phone number (required; normalized to E.164; used as contact and SMS destination)
- Delivery street, apartment, city, state, ZIP, and instructions (delivery orders only)
- Order contents, modifiers, special instructions, tip, promo code
- **Email is not collected on public checkout today.** Do not list diner email as a processed data type until that field ships. Order rows have a nullable `customer_email_snapshot` for possible future use.

Payment card data:

- NMI hosted fields collect the card in the browser. Sabal’s servers are written to remain PCI SAQ-A: **no PAN, no CVC**.
- Sabal stores `method_type`, `method_brand`, `method_last4`, and the NMI transaction id (`provider_payment_intent_id`). The browser payment token is used to create the sale and is **not** stored as a vaulted card.

Identity records (`customers`): `phone_e164`, optional `email_normalized`, `display_name`, organization-scoped. **No SMS or marketing consent columns exist** (deliberate in schema).

Diner-facing order history: a diner can track **one order** via a public token. There is no diner login and no cross-order history for the guest. Staff see full history in ROS.

# 2. Subprocessors (current, from code)

- **Neon** — PostgreSQL database
- **Vercel** — hosting; **Vercel Blob** — menu photographs
- **Twilio** — transactional SMS (confirmation and cancellation). Skipped if Twilio env is absent.
- **NMI** — payment gateway / hosted fields
- **DoorDash Drive** — delivery quotes and fulfillment when delivery is enabled (pickup/dropoff addresses, diner name, phone, instructions, tip, order value)
- **Clerk** — staff authentication only (not diner accounts)

Sabal will notify the Restaurant of new subprocessors by **[email notice + N days objection window]**.

Resend and Plausible are used on the **marketing site**, not on diner storefronts, and are not diner subprocessors under this DPA.

# 3. Security measures (what is actually in place)

- Tenant isolation with PostgreSQL row-level security (`organization_id`) and scoped database roles (`sabal_app`, `sabal_public`, `sabal_storefront`, `sabal_platform`, `sabal_worker`, `sabal_analytics`). Runtime roles do not bypass RLS.
- Encryption in transit (TLS). Encryption at rest is provided by the hosted database and object-storage providers, not by an application-level cipher Sabal maintains.
- No storage of full card numbers.
- Append-only audit logs of staff actions (actor is an internal UUID, not an email).
- **Not in place:** Sentry or similar error monitoring; a diner export/deletion API; a documented timed retention sweeper for orders.

Sabal will not claim security controls that are only on a roadmap.

# 4. Breach notice

Sabal will notify the Restaurant of a personal-data breach affecting diner data without undue delay and in any event within **[72 hours is a common GDPR anchor — pick a US-appropriate number if GDPR is out of scope]**.

# 5. Assistance, return, deletion

Sabal will assist the Restaurant with data-subject requests that the Restaurant cannot fulfill from ROS alone.

**Product gap:** there is no GDPR/CCPA export or deletion tooling. Order, payment, customer, and audit records are retained **indefinitely**; runtime roles have no DELETE on financial tables. Until a runbook exists, Sabal will not promise deletion timelines. Likely design: **anonymize order records rather than delete them**, for tax and card-network reasons — lawyer to confirm.

On termination: **[return vs delete vs anonymize; align with the MSA export clause]**.

# 6. Restaurant instructions

The Restaurant instructs Sabal to process Annex A data only to provide the platform. The Restaurant is responsible for notices to diners (storefront privacy policy) and for any use of diner data it exports.
