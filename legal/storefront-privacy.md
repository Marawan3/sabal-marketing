---
title: Storefront Privacy Policy
slug: storefront-privacy
version: 0.1.0-draft
audience: diners
description: Tenant-interpolated diner privacy notice. Populate only from verified checkout and schema behavior.
---

> DRAFT — not yet attorney-reviewed — do not publish

**{restaurantLegalName}** (“the restaurant”) is the **controller** of personal information collected when you order on this site. **[LEGAL_ENTITY_NAME]** (“Sabal”) is the **processor**: it runs the software.

This policy is in plain language. It describes what the storefront **actually does today**.

# What we collect, and why

When you place an order we collect:

- **Name** — so the restaurant and, for delivery, the courier know who the order is for
- **Phone number** — so the restaurant can reach you and so we can send order SMS
- **Delivery address** — only if you choose delivery (street, apartment, city, state, ZIP, instructions)
- **Order contents** — items, modifiers, special instructions, tip, promo code if you use one
- **Payment metadata** — card brand and last four digits, and the processor’s transaction id, for the receipt and for refunds. The full card number is entered in NMI hosted fields. The restaurant and Sabal never see it.

We do **not** currently collect an email address at checkout. If that field is added later, this policy must be updated before it ships.

We do **not** create a diner login. You can track **this** order with the link we give you. We do not show you a history of every past order on a guest account.

# Who sees it

- **The restaurant**, to cook and fulfill your order (controller)
- **NMI**, to charge or refund the card
- **Twilio**, to send the order SMS, when SMS is turned on
- **DoorDash**, if you chose delivery — name, phone, dropoff address, instructions, tip, order value
- **Sabal’s hosts** — Neon (database) and Vercel (the website and menu photos)

We do **not** sell personal information. We do **not** run advertising networks or pixels on the storefront today. **[Revisit if analytics or ads are ever added.]**

# Cookies

The storefront may set a first-party cookie `sabal_menu_location` so it remembers which location’s menu you last opened (about one year, SameSite=lax). Cart contents live in the browser for that visit; there is no cart cookie. There is no cross-site tracking cookie in the current storefront code.

# How long

Order, payment, and customer-identity records are kept **indefinitely** in the product today. There is no automatic deletion job.

**[Lawyer: state periods you can actually honor — e.g. order records X years for tax/accounting; SMS logs per Twilio. Do not promise deletion on a schedule the code cannot run.]**

# Your choices

Access or deletion requests: **[CONTACT_EMAIL]**. Sabal will coordinate with the restaurant as controller.

**Product gap:** there is no self-serve deletion button and no export API. **[Do not promise a number of days until a runbook exists. Accounting and card-network rules may require keeping an anonymized order record.]**

# Contact

Restaurant: **{restaurantPhone}**  
Sabal (processor): **[CONTACT_EMAIL]**
