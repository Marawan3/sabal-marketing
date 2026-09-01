# Legal drafts (attorney packet)

**DRAFT — not yet attorney-reviewed — do not publish.**

This folder is the versioned source for Sabal’s nine legal documents. It lives in the standalone marketing repo because that is the public site. It is not yet a shared `packages/legal/` workspace — ROS and Sites are a separate monorepo. Copy these files there when storefront and ROS routes ship.

| File | Audience | Marketing route |
|---|---|---|
| `msa.md` | Restaurants | not routed (signed offline) |
| `platform-terms.md` | Restaurant staff | `/platform-terms` |
| `dpa.md` | Restaurants | `/dpa` (lawyer: public vs request) |
| `storefront-terms.md` | Diners | Sites only — do not route here |
| `storefront-privacy.md` | Diners | Sites only |
| `refund-cancellation.md` | Diners | Sites only |
| `sabal-privacy.md` | Visitors + ROS staff | `/privacy` |
| `sabal-website-terms.md` | Visitors | `/terms` |
| `accessibility.md` | Everyone | `/accessibility` |

Every file starts with the draft banner. Bracketed text is an unresolved lawyer/product choice, also listed in `LAWYER-QUESTIONS.md`.

Ground truth for ROS/Sites was taken from `Sabal-OOS/sabal-ros` (schema, checkout, Twilio, NMI, Clerk, DoorDash Drive, RLS). Ground truth for this site was taken from `sabal-marketing` (demo form, Resend, optional Plausible). If the code changes, the matching draft is stale.

Do not publish any of these until:

1. `[LEGAL_ENTITY_NAME]` exists and is the contracting party.
2. A licensed attorney has reviewed the packet and `LAWYER-QUESTIONS.md`.
3. Product gaps called out in that file are either built or the clause is rewritten to match current behavior.
