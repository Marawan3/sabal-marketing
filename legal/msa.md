---
title: Master Service Agreement
slug: msa
version: 0.1.0-draft
audience: restaurants
description: Draft MSA between Sabal and the restaurant. Not routed on the marketing site.
---

> DRAFT — not yet attorney-reviewed — do not publish

This Master Service Agreement (“Agreement”) is between **[LEGAL_ENTITY_NAME]**, a **[ENTITY_TYPE/STATE]** (“Sabal”), with notice address **[BUSINESS_ADDRESS]**, email **[CONTACT_EMAIL]**, and the restaurant entity named on the signature page (“Restaurant”).

**Effective date:** [EFFECTIVE_DATE]

# 1. Merchant of record

The Restaurant is the **merchant of record** for every diner purchase placed through a Sabal storefront. Payment cards are charged to the Restaurant’s own NMI merchant account. Sabal does not hold diner funds, does not operate a marketplace wallet, and is not the seller of food. Chargebacks, representment, and card-network disputes are the Restaurant’s.

This clause controls if it conflicts with marketing copy or a statement of work.

# 2. What Sabal provides

Sabal provides a provisioned restaurant website, online ordering (pickup and, where enabled, delivery), kitchen display, diner order tracking, transactional order SMS, SEO-oriented storefront pages generated from the Restaurant’s menu, and domain-management tooling.

Onboarding is **Sabal-provisioned**. There is no self-serve signup. A browser session cannot create an organization. Sabal’s platform team creates the tenant, configures it, and invites the Owner via Clerk.

# 3. Fees

Sabal’s platform fee is **five percent (5%) of each online order** placed through the Restaurant’s Sabal storefront. On a ten-dollar ticket that is fifty cents.

**[COLLECTION MECHANIC — not in the product today. The NMI sale path has no Sabal platform-fee line. Choose: invoice in arrears / withhold from settlement / processor application fee. Do not publish this Agreement until the mechanic matches production.]**

**[FEE BASE — merchandise only, after discounts, with/without tax, tip, and delivery quote? Code stores these separately.]**

Five percent is Sabal’s fee. It is not card processing. Card processing settles to the Restaurant’s merchant account at the processor’s rates. Delivery, when enabled, is fulfilled by DoorDash Drive and billed under that relationship; those amounts are not Sabal’s five percent.

**[Any onboarding, domain, SMS, or other surcharge? Pricing page currently discloses none.]**

# 4. Term, suspension, termination

This Agreement starts on the Effective Date and continues until terminated.

**[Termination for convenience: N days’ written notice — pick N.]**

Sabal may suspend the Restaurant’s ordering immediately for cause, including non-payment, suspected fraud, or material breach. The product already implements `service-suspended`: new online orders are refused, the published website remains up, and data is preserved. Sabal may terminate for cause immediately after suspension if the cause is not cured **[cure period — pick]**.

Restaurant may terminate for Sabal’s material breach if uncured after **[cure period]**.

# 5. Availability

Sabal will use **[commercially reasonable efforts / other]** to keep the platform available. **Do not promise a percentage uptime.** Error monitoring (Sentry) is not wired. Operators currently have Vercel Runtime Logs and `/api/health`. Any numeric SLA should wait until alerting exists.

Support response times: **[define, or “commercially reasonable efforts”]**.

# 6. Data

The Restaurant owns its menu, storefront content, and **its diner/customer data**. Sabal owns the platform, templates, software, and aggregate or anonymized usage data that does not identify the Restaurant or a diner.

On termination Sabal will **[export assistance: the product has no diner-data export API today — either build one or narrow this to commercially reasonable assistance]**.

# 7. Restaurant obligations

The Restaurant will keep menu prices, hours, and availability accurate; comply with food-safety, allergen, and calorie-disclosure law; use exported diner data lawfully; keep Google Business Profile and domain credentials under its control; and not publish unlawful content on the storefront.

# 8. Intellectual property

Sabal retains all rights in the platform. The Restaurant grants Sabal a license to display its name, logo, menu, and photos on its storefront. Use of those materials in **Sabal’s own marketing** is **[opt-in only / default off — do not grant a silent publicity license]**.

# 9. Third-party services

The Restaurant acknowledges the platform depends on: NMI (payments), Twilio (transactional SMS), DoorDash Drive (delivery fulfillment when enabled), Clerk (staff login), Neon (database), Vercel (hosting and media). Outages or policy changes at those providers can affect the service. Sabal is not those providers.

# 10. Warranties and disclaimers

Except as expressly stated, the platform is provided **as is**. Sabal does not warrant search rankings, order volume, or that the storefront will be uninterrupted or error-free.

# 11. Indemnity

The Restaurant indemnifies Sabal against claims arising from food, allergens, menu content, photos, diner data the Restaurant uses after export, and the Restaurant’s operation of the restaurant.

Sabal indemnifies the Restaurant against claims that the unmodified platform infringes a third party’s IP, excluding combinations with Restaurant content or third-party services.

# 12. Liability cap

**[Cap structure — 12 months of fees paid is a common default. Note that 5% of orders can be small in early months. Super-cap for confidentiality / IP? Exclude willful misconduct? Lawyer picks.]**

Neither party is liable for indirect, incidental, special, or consequential damages **[to the extent allowed]**.

# 13. Governing law

**[GOVERNING_LAW_STATE]. Venue / arbitration / class waiver — do not pick silently.**

Notices: **[CONTACT_EMAIL]** and **[BUSINESS_ADDRESS]**.

# 14. Order of documents

This MSA, then the Platform Terms, then the DPA. The DPA controls for diner personal data processing. Marketing-site pages are not the contract.

Signature blocks: Sabal **[LEGAL_ENTITY_NAME]** and Restaurant legal name, date, `msa_version` **0.1.0-draft**.
