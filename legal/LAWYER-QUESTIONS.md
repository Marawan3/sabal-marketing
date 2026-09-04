# Lawyer questions

**DRAFT packet — not legal advice.** Each item is a choice this draft will not silently make. Code facts are labeled as such.

## Before anything is published

1. **Entity.** `[LEGAL_ENTITY_NAME]`, `[ENTITY_TYPE/STATE]`, `[BUSINESS_ADDRESS]` are blank. Form the LLC/corp **before** publishing documents that name it. Insurance and contracts follow the entity.
2. **Effective date.** `[EFFECTIVE_DATE]` — do not backdate.
3. **Notice email.** `[CONTACT_EMAIL]` vs the operational inbox `hello@sabal.ai` used by the marketing demo form. Same address or split (legal vs sales)?
4. **Governing law / venue.** `[GOVERNING_LAW_STATE]`. Arbitration vs courts, and whether class actions are waived.
5. **Who signs the MSA.** Sabal-provisioned onboarding is offline today. ROS has no `msa_version` / `msa_accepted_at` on the organization row. Record signed version somewhere before the first live restaurant.

## Fees (MSA § fees)

6. **5% of each online order** is the commercial term Marawan confirmed (a $10 ticket → 50¢). **It is not implemented in NMI sale code.** No `platform_fee` line exists. Decide: invoice in arrears, withhold from settlement, or add a Sabal line at the processor. The public pricing page states the 5% number; it does not claim a collection mechanic.
7. **What the 5% is measured on.** Merchandise only? After discounts? Including tax, tip, delivery quote? Code has those as separate money fields.
8. **Card processing.** Drafts treat processor (NMI) rates as the restaurant’s cost, not Sabal’s 5%. Confirm.
9. **Delivery-network partner fees.** Pass-through, not Sabal’s 5%. Partner is DoorDash Drive in code; marketing site still does not name them publicly.
10. **No monthly SaaS fee** is what the pricing page says. Confirm there is no onboarding / domain / SMS surcharge that should be disclosed.

## Liability, SLA, insurance

11. **Liability cap.** `[12 months of fees paid is the common default]` — pick a number. 5% of orders can be small in month one.
12. **SLA.** Do **not** publish 99.9%. Sentry is not wired. Observability is Vercel Runtime Logs + `/api/health`. Recommend commercially reasonable efforts until alerting exists.
13. **Cyber / Tech E&O.** Get quotes (Vouch, Embroker, Founder Shield) once payments are live. Prerequisite: entity exists. Not a document in this folder.

## Data, DPA, privacy

14. **DPA public vs on request.** Currently routed at `/dpa` as a draft. Lawyer’s call.
15. **Privacy framework.** CCPA/CPRA and other US state laws are the realistic driver. GDPR only if EU diners matter. Anchor the DPA.
16. **Breach notice hours.** `[72 hours is the GDPR anchor]` — pick a number for US-only.
17. **Subprocessor change notice.** `[email + N days objection window]`.
18. **Retention.** Orders, payments, customers, audit logs are **indefinite** in code; no DELETE on financial tables. Pick stated periods. Expect **anonymize, not delete** for orders (accounting).
19. **Twilio SMS log retention** — follow Twilio’s, or a shorter Sabal copy?
20. **DSAR runbook.** There is **no** export or deletion API. Do not publish a “we will delete within X days” promise until a runbook exists. Internal process: who handles `[CONTACT_EMAIL]` requests, restaurant-as-controller vs Sabal-as-processor.
21. **Marketing analytics.** Plausible loads only if `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set. Confirm whether production will enable it before publishing the privacy policy sentence.

## TCPA / checkout (do not publish diner terms until this is built)

22. Checkout **does not** show SMS-consent language. Schema has **no** consent columns (deliberate). Twilio sends transactional confirmation/cancellation SMS to the checkout phone. **Do not publish storefront terms that say the diner consented at checkout until the UI presents that sentence.**
23. Checkout **does not** have “By placing this order you agree to Terms / Privacy.” Small Sites PR, ships with diner legal pages.
24. Confirm: still **no marketing SMS**. Policy must not permit it without new consent flows.

## Product gaps that affect clauses

25. **Data export on termination** — promised in many MSAs; **not in the product**. Build an export or narrow the clause to “commercially reasonable assistance.”
26. **Storefront legal routes** (`/terms`, `/privacy`, `/refunds`, `/accessibility`) — not built. NMI production keys should not go live without a posted refund policy (processor expectation).
27. **Powered by Sabal** footer — recommended, not built. Brand-name anchor, `rel="nofollow"`, UTM, `showPoweredBy` default true. Legal links stay tenant-scoped.
28. **ROS sign-in** should link Platform Terms + Sabal Privacy. Not built.
29. **Cookies.** Storefront sets `sabal_menu_location` (1 year, SameSite=lax). No ad pixels in code. GA4/Meta appear only as an SEO checklist *item*, not an implementation — do not describe them as live.
30. **Merchant of record.** Code never states it; keys charge “the NMI merchant account.” Drafts say the restaurant is MOR. Confirm with NMI agreement.
31. **Allergen / calorie disclosures.** Restaurant obligation in the MSA; Sabal does not generate legal nutrition copy.
32. **Marketing license** to use restaurant name/logo in Sabal marketing — opt-in, default off.
33. **Refund defaults.** Cancellation window before prep, original-payment refunds, restaurant phone as contact — restaurant-configurable. Pick platform defaults.
34. **service-suspended.** Already in ROS: new online orders refused, published site stays up, data preserved. Map this to “suspension for cause” vs “termination.”
35. **Diner email.** Checkout does **not** collect email today. Storefront privacy must not list email as collected unless the field ships.

## Accessibility

36. Marketing site currently aimed at WCAG 2.2 AA in old copy; storefront work is described as WCAG 2.1 AA. Statement uses **2.1 AA as an ongoing effort**, not a conformance claim. No VPAT. Confirm the target.

## Delivery partner naming

37. Legal/DPA names **DoorDash Drive** because that is the integration. Marketing pages still say “delivery-network partner” until Marawan makes the relationship public. Keep that split until told otherwise.
