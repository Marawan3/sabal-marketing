---
title: Platform Terms
slug: platform-terms
version: 0.1.0-draft
audience: restaurants
description: Acceptable use for ROS staff accounts. The MSA controls if they conflict.
---

> DRAFT — not yet attorney-reviewed — do not publish

These Platform Terms apply to people who sign into the Sabal restaurant dashboard (“ROS”) with a Clerk account. They are incorporated into the Master Service Agreement. **If they conflict, the MSA controls.**

They do **not** govern diners. Diner purchases are with the restaurant. They do **not** govern the public marketing website; see the Website Terms.

# Accounts

ROS login is Clerk. Authorization (which restaurant, which role) is in Sabal’s database, not Clerk Organizations. The restaurant is responsible for who it invites and for keeping credentials secret. Notify **[CONTACT_EMAIL]** of suspected unauthorized access.

Staff display names and emails are mirrored from Clerk into membership records at sign-in. Staff actions in settings, refunds, voids, and messaging are written to append-only audit logs with an internal actor id.

# Acceptable use

You will not:

- Access another tenant’s data or scrape another restaurant’s storefront or dashboard.
- Probe, scan, or load-test Sabal systems without Sabal’s prior written consent.
- Publish unlawful, infringing, or deceptive content on a storefront.
- Attempt to store or transmit full payment-card numbers through Sabal. Cards are collected only in NMI hosted fields.
- Use transactional order SMS for marketing. The product sends order confirmation and cancellation SMS only. Marketing SMS is not offered and is not permitted.
- Circumvent `service-suspended` or other platform controls.

Sabal may suspend ordering (new online orders refused; published site stays up; data preserved) or close accounts for breach.

# The platform

Features include the provisioned website, online ordering, kitchen display, tracking, transactional SMS, and SEO tooling described in the MSA. Sabal does not promise rankings or ticket volume.

# Fees

Platform fees are in the MSA: **5% of each online order**, plus the restaurant’s own processor and delivery-partner charges. These terms do not set a different price.

# Termination

Access ends when the MSA ends or when membership is revoked. Suspension behavior is described in the MSA and implemented as `service-suspended` in ROS.
