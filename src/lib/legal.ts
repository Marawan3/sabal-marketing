/**
 * Legal documents.
 *
 * PUBLISHED. Text approved by Marawan 2026-09-20; entity details and governing
 * law supplied the same day. `final: true` removes the forced noindex and adds
 * both pages to the sitemap. Any edit from here changes a live legal document:
 * bump `lastUpdated` when the substance changes.
 *
 * Structure follows Clover's two templates section for section:
 *   https://docs.clover.com/dev/docs/clover-privacy-policy-template
 *   https://docs.clover.com/dev/docs/clover-eulaterms-of-service-template
 *
 * Every factual claim below is taken from the data inventory compiled
 * 2026-09-15 against the product repo. Nothing is invented. Where the
 * inventory's §1 vendor table and its §2 / §2c detail disagree about card
 * data, §2 / §2c win: card brand and the last four digits ARE stored, card
 * numbers are NOT.
 *
 * To amend a published document: edit the text, set `lastUpdated` to that day,
 * and say what changed in the commit. Any bracketed marker left in a heading
 * or body fails the build while `final` is true, so drafts in progress belong
 * behind `final: false`.
 *
 * In a paragraph, `[[label|/href]]` renders `label` as a link to `/href`.
 */

export const LEGAL_PLACEHOLDER = "This document is being finalized.";

/**
 * The contracting entity, supplied by Marawan 2026-09-20.
 *
 * NOTE: the registered name contains "Sabal". The repo-wide rule that "sabal"
 * must never appear in rendered HTML protects the marketing brand; a legal
 * document has the opposite duty and must identify the contracting party.
 * `scripts/honesty-check.mjs` and the "never contains Sabal" test both carry a
 * narrow, documented exception for the legal pages, and that test now asserts
 * the only occurrence there is this entity name.
 */
export const ENTITY = {
  name: "Sabal Pay LLC",
  full: "Sabal Pay LLC, a Florida limited liability company doing business as Wuntab",
  address: "1802 N Alafaya Trail, Orlando, FL 32826",
  phone: "(407) 655-8761",
  email: "support@wuntab.com",
  governingLaw: "the State of Florida",
  venue: "Orange County, Florida",
} as const;

/**
 * The data clause. Appears word for word in the privacy policy ("How we use
 * the information") and in the terms (5.3). Shared so the two cannot drift;
 * `tests/legal.spec.ts` asserts both carry it.
 */
export const DATA_CLAUSE =
  "We use the information processed through Wuntab to provide and support the service for the restaurant: to publish the restaurant's website and menu, to take and track orders, to route orders to the kitchen and to Clover where Clover is connected, to arrange delivery, to take payment, to send order notifications to customers, and to keep the service secure and working. We act on the restaurant's instructions. We do not sell personal information and we do not use customer information for our own advertising. We keep information for as long as the restaurant uses Wuntab; after that it is not deleted automatically, and we will delete it by hand within 30 days of a written request to " +
  ENTITY.email +
  ".";

/**
 * What a restaurant takes with it on exit (terms 4.2).
 *
 * Marawan asked for an export of the menu and customer list "at minimum"
 * 2026-09-20 and is reviewing this wording. Described as a manual process on
 * request: the data inventory of 2026-09-15 records no export path in the
 * code, so no automated tool is promised, matching how deletion is described.
 */
export const EXIT_EXPORT =
  "When this agreement ends, write to " +
  ENTITY.email +
  " and we will send you an export of your menu, including your items, prices, modifiers and their prices, and an export of your customer list, including the names, email addresses and phone numbers your customers gave you, together with their order history with you. We will also return the photos and the written content you gave us. We prepare these by hand and send them within 30 days of your written request. We do not offer an automated export tool today.";

/** The service fee. Stated in both documents. Always "service fee", never "surcharge". */
export const SERVICE_FEE_CLAUSE =
  "Wuntab is free to the restaurant. There is no monthly charge, no setup fee, and no per-order commission charged to the restaurant. When a customer places an online order, the customer pays a service fee of 5% of the order. The fee is shown to the customer at checkout before payment is taken. It is collected by our payment processor and routed to Wuntab at settlement.";

/**
 * Planned or unplanned, but not built today (Marawan, 2026-09-20). The
 * documents describe only what exists now and are versioned when a feature
 * ships. `tests/legal.spec.ts` fails if any of these appear.
 */
export const UNBUILT_FEATURES = [
  "loyalty",
  "rewards",
  "kiosk",
  "table ordering",
  "gift card",
  "mobile app",
  "reservation",
  "email marketing",
  "email campaign",
] as const;

export type LegalSection = {
  /** Rendered as an H2. */
  heading: string;
  /** One string per paragraph. */
  body: string[];
};

export type LegalDoc = {
  slug: "privacy" | "terms";
  /** Rendered as the H1 and the browser title. */
  title: string;
  /** false = placeholder, noindex, out of the sitemap. */
  final: boolean;
  /** ISO `YYYY-MM-DD`, the day the text is approved. */
  lastUpdated?: string;
  /** Must appear in the body of both documents. */
  contactEmail?: string;
  /**
   * An internal obligation attached to this document. Never rendered and never
   * published, so it cannot leak onto a live legal page, and kept here rather
   * than in a comment so it travels with the document it belongs to.
   */
  review?: string;
  sections: LegalSection[];
};

// ─────────────────────────── PRIVACY POLICY ───────────────────────────

const privacy: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  final: true,
  lastUpdated: "2026-09-20",
  contactEmail: ENTITY.email,
  review:
    "[REVIEW BEFORE TENANT 3] The 'Storefront customer information' section describes how customer data reaches us at checkout before Clover sees it. Review that framing before a third restaurant is onboarded.",
  sections: [
    {
      heading: "Who we are and what this policy covers",
      body: [
        `${ENTITY.full} ("Wuntab", "we", "us"), provides Wuntab, a platform for restaurants. Wuntab builds and runs a restaurant's own website and menu, takes online orders for pickup and delivery, routes those orders to the restaurant's kitchen, arranges delivery through a third-party delivery partner, takes payment, and provides the tools the restaurant uses to manage its menu, its orders and its customers. Wuntab also publishes an app on the Clover App Market that connects a restaurant's Clover account to that service.`,
        `This policy explains what information we collect, how we use it, and who we share it with. It covers the Wuntab platform, the Wuntab Clover app, and the restaurant storefronts we operate.`,
        `We process most of this information on behalf of our customers, who are the restaurants. The restaurant decides what is collected through its storefront and what it is used for. We act on the restaurant's instructions. Where a restaurant has its own privacy policy, that policy governs the restaurant's own handling of its customers' information.`,
        SERVICE_FEE_CLAUSE,
      ],
    },
    {
      heading: "Information we collect",
      body: [
        `From a customer placing an order on a restaurant's storefront, we collect an email address, a phone number and a name, together with the name, phone number and email address given on that particular order. We collect the contents of the order: the items, quantities, modifiers, totals and any tip. We collect free-text instructions attached to the order and free-text notes attached to individual items. We collect the times at which the order moves through its stages, and we generate a token used for the public order-tracking link. We store a rendered copy of the kitchen ticket, which contains the information above.`,
        `For a delivery order we also collect the dropoff address, the first and last name of the person receiving the order, a phone number and any dropoff instructions.`,
        `For payment we collect the amount authorised, the amount captured and the amount refunded, the payment method type, the card brand, the last four digits of the card, and the reference our payment processor assigns to the transaction.`,
        `We do not store card numbers, expiry dates or security codes. Card details are entered by the customer and go to our payment processor. We keep the card brand and the last four digits only, so that restaurant staff and our support team can match a charge to a line on a statement. We hold no stored card credential and no reusable payment token, so we cannot charge a customer again. A repeat purchase requires the customer to enter card details afresh.`,
        `From a person who submits a form on a restaurant's website, such as a catering enquiry, a contact message or a job application, we collect a name, an email address and a phone number, a free-text message of up to 4,000 characters, and, where the form asks for them, an event date, an event time, a guest count, an event type, a postal address and a country. A job application may include a résumé file and its filename.`,
        `The message field on these forms is free text. Please do not include medical details in it. We do not ask for health information and we do not need it.`,
        `From the restaurant we collect the organisation name, the legal name, a billing email address, the plan and account status, each location's address, public phone number and kitchen phone number, the tax rate, the menu and its prices, item and modifier details, photos, website draft and published content, custom domain names, promotion codes and any menu file uploaded for import.`,
        `From restaurant staff and our own administrators we collect identity information through our authentication provider, which holds the email address, name and password or single sign-on credentials. Wuntab itself stores the identifier that provider issues, a display name, an email address, the email address an invitation was sent to, the time a person was last seen, and a record of the actions that person takes. Audited changes are stored as before-and-after copies of the affected record, which means that where the record contained customer information, the audit entry contains a copy of it.`,
        `Where a restaurant connects Clover, we collect the Clover merchant identifier, a snapshot of the Clover catalog, the mappings between Clover items and modifiers and our own, the link between a Wuntab order and a Clover order, and encrypted Clover access and refresh tokens.`,
        `For platform administration we record support sessions, including the reason a session was opened and when it started, expired and ended, an audit log of administrator actions, free-text notes about a restaurant, the reason for any suspension, and counts of artificial-intelligence usage attributed to a user.`,
      ],
    },
    {
      heading: "How we use the information",
      body: [
        `We use the information to provide the service: to publish the restaurant's website and menu, to take and track orders, to route orders to the kitchen by printed ticket and, where Clover is connected, into Clover, to arrange delivery, to take payment, and to send order notifications by text message.`,
        `We use it to support the restaurant and its customers, including matching a charge to a line on a statement, which is the reason we keep the card brand and last four digits.`,
        `We use it to operate and secure the service, through error monitoring, audit logging and the prevention of abuse.`,
        `We submit the restaurant's menu and website copy to our artificial-intelligence provider when the restaurant asks us to draft content. No customer information is sent for this purpose, and nothing is published without a person at the restaurant approving it.`,
        DATA_CLAUSE,
      ],
    },
    {
      heading: "How we share information",
      body: [
        `We share information with the restaurant whose storefront the information came from.`,
        `We use the following service providers, and each receives only what it needs.`,
        `Our database provider, Neon, stores all of the information described in this policy.`,
        `Our hosting provider, Vercel, runs the platform, keeps runtime logs, and stores uploaded files, which are menu photos, logos, menu-import files and résumés.`,
        `Our authentication provider, Clerk, holds staff and administrator identity, which is an email address, a name and a password or single sign-on credentials.`,
        `Our text-message provider, Twilio, receives a customer's phone number and the text of each message we send.`,
        `Clover receives the order number, special instructions, item names, quantities and totals. Clover does not receive a customer's name, phone number or email address from us.`,
        `Our payment processor, NMI, receives the card details entered by the customer and the amount. It does not receive menu contents.`,
        `Our delivery partner, DoorDash, receives the dropoff address, the customer's first and last name, phone number and dropoff instructions. It does not receive card details.`,
        `Our error-monitoring provider, Sentry, receives error and trace data. Personal information is switched off in that integration, request cookies, headers and bodies are removed before anything is sent, and session replay is not enabled.`,
        `Our artificial-intelligence provider, Anthropic, receives menu and website copy submitted for drafting. It does not receive customer information.`,
        `Google Search Console receives the addresses of pages on the restaurant's website. It does not receive customer or order information.`,
        `We also share information where the law requires it, and we may transfer it as part of a merger, acquisition or sale of assets, in which case this policy continues to apply to the information transferred.`,
      ],
    },
    {
      heading: "Storefront customer information",
      body: [
        `Wuntab operates the restaurant's own website and its checkout. When someone places an order there, they give their information to the restaurant through a storefront that we run. We receive and store that information at the moment it is entered, before any part of it reaches Clover, and we would hold it whether or not the restaurant uses Clover at all.`,
        `What Clover receives is a subset: the order number, special instructions, item names, quantities and totals. Clover does not receive the customer's name, phone number or email address from us.`,
        `The restaurant is the merchant of record for these orders. The restaurant decides what is collected on its storefront and what it is used for, and we act on its instructions. Payments settle to the restaurant's own account.`,
      ],
    },
    {
      heading: "How long we keep information",
      body: [
        `We keep information for as long as the restaurant uses Wuntab.`,
        `If a restaurant ends its account, its information is not deleted automatically. It stays until someone asks us to remove it.`,
        `We delete information on written request to ${ENTITY.email}. We handle these requests by hand and complete them within 30 days of receiving them. We do not offer an automated deletion tool today, and we do not promise one.`,
        `Three things are removed automatically. An expired Clover sign-in state record is deleted within ten minutes. A résumé file and its filename are cleared 90 days after the application is submitted. The encrypted Clover access and refresh tokens are cleared when a restaurant disconnects Clover or the app is uninstalled.`,
        `Nothing else has a set retention period. Deactivating a staff member, archiving a promotion or removing a custom domain changes the record's status and keeps the record.`,
        `Our database provider keeps backups. Information we have deleted can remain in those backups until they age out, and our deletion of a record does not reach into them.`,
      ],
    },
    {
      heading: "How we protect information",
      body: [
        `Access to a restaurant's information is restricted to that restaurant's own account, and the restriction is enforced by the database itself rather than by application code alone. A test in our build checks that the restriction holds across accounts.`,
        `Clover access and refresh tokens are encrypted where they are stored, with a separate nonce for each record bound to the organisation and location it belongs to. A restaurant may disconnect its Clover account at any time, and disconnecting clears those tokens.`,
        `Printer device tokens and website preview tokens are stored as hashes rather than in a form we can read back.`,
        `Provider API keys are held as environment configuration and are never written into source code. A test in our build checks that API tokens are not written to application logs.`,
        `No system is completely secure, and we do not claim that ours is.`,
      ],
    },
    {
      heading: "Your rights and choices",
      body: [
        `If you placed an order with a restaurant that uses Wuntab, the restaurant decides how your information is used. You can contact the restaurant directly, or you can write to us at ${ENTITY.email} and we will pass your request to the restaurant where the decision is theirs.`,
        `You may ask for a copy of the information we hold about you, ask us to correct it, or ask us to delete it. We handle these requests by hand and complete them within 30 days.`,
        `If you want to complain about how your information has been handled, write to ${ENTITY.email}.`,
        `We may update this policy. When we do, the date at the top of this page changes. Where a change is significant we will tell the restaurants that use Wuntab.`,
      ],
    },
    {
      heading: "Contact us",
      body: [
        `${ENTITY.name}`,
        `${ENTITY.address}`,
        `${ENTITY.phone}`,
        `${ENTITY.email}`,
      ],
    },
    {
      heading: "Additional information for merchants located in Europe",
      body: [
        `Controller and processor. The restaurant is the controller of the information described in this policy. We are a processor and act on the restaurant's documented instructions.`,
        `Legal basis for processing. The restaurant, as controller, establishes the legal basis on which the information is processed.`,
        `Cross-border transfer. Our service providers are named above. Where information is transferred outside the European Economic Area or the United Kingdom, the transfer is made under the mechanism set out in the relevant provider's data processing terms.`,
        `Data retention. Retention is described under "How long we keep information" above. In short: we keep information while the restaurant uses Wuntab, nothing is deleted automatically when an account ends, and we delete by hand within 30 days of a written request.`,
        `Data subject rights. Subject to local law, a person may ask for access to their information, correction of it, erasure of it, restriction of its processing, portability of it, or may object to its processing, and may complain to a supervisory authority. Requests should go to the restaurant, or to ${ENTITY.email}, and are handled by hand within 30 days.`,
      ],
    },
    {
      heading: "Your California privacy rights",
      body: [
        `If you are a California resident, you may ask what personal information we have collected about you, the sources it came from, the purposes we collected it for, and the categories of third party we shared it with. You may ask for a copy of that information. You may ask us to delete it. We will not treat you differently for exercising any of these rights.`,
        `How to exercise your rights. Write to ${ENTITY.email} or call ${ENTITY.phone}. We will verify your identity by matching your request against information we already hold, such as the email address or phone number used on an order. If you use an authorised agent, we will ask for proof that you authorised them.`,
        `Sale of personal information. We do not sell personal information, and we have not sold personal information in the preceding twelve months.`,
        `Sensitive personal information. We do not ask for sensitive personal information. The free-text message field on a restaurant's website forms accepts whatever a person chooses to type, and we ask people not to include medical details in it.`,
      ],
    },
    {
      heading: "Categories of personal information we collect",
      body: [
        `Everything we collect is stored with our database provider and our hosting provider, which act as service providers on our behalf. The list below says whether we collect each category defined by California law, and whether we disclose it to a third party for a business purpose beyond that storage.`,
        `Identifiers, such as a name, email address, postal address, phone number and account identifier. Collected: yes. Disclosed for a business purpose: yes, to Clover, our payment processor, our delivery partner, our text-message provider and our authentication provider, each as described above.`,
        `Personal information listed in the California Customer Records statute, such as a name, address, phone number and payment information limited to the card brand and last four digits. Collected: yes. Disclosed for a business purpose: yes.`,
        `Protected classification characteristics, such as age, race or gender. Collected: no.`,
        `Commercial information, such as the orders placed, the items purchased, the amounts and any tip. Collected: yes. Disclosed for a business purpose: yes, to Clover and our payment processor.`,
        `Biometric information. Collected: no.`,
        `Internet or other network activity. Collected: yes, limited to server logs and error telemetry. Disclosed for a business purpose: yes, to our hosting provider and our error-monitoring provider.`,
        `Geolocation data. Collected: yes, limited to a delivery address a customer enters. Disclosed for a business purpose: yes, to our delivery partner.`,
        `Audio, electronic, visual or similar information. Collected: no.`,
        `Professional or employment-related information. Collected: yes, limited to what a person submits through a job application form on a restaurant's website, including a résumé. Disclosed for a business purpose: no.`,
        `Non-public education information. Collected: no.`,
        `Inferences drawn to create a profile. Collected: no.`,
      ],
    },
    {
      heading: "Glossary",
      body: [
        `"Personal information" means information that identifies, relates to, or could reasonably be linked with a particular person or household.`,
        `"Identifiers" means items such as a real name, an alias, a postal address, a unique personal identifier, an email address or a phone number.`,
        `"Commercial information" means records of products or services purchased, obtained or considered.`,
        `"Service provider" means a company that processes information on our behalf and for our purposes, under a contract that limits what it may do with that information.`,
        `"Controller" and "processor" have the meanings given to them in European and United Kingdom data protection law. The controller decides why and how information is processed; the processor acts on the controller's instructions.`,
        `"Sale" means disclosing personal information to a third party for money or other valuable consideration. We do not do this.`,
      ],
    },
  ],
};

// ──────────────────────── TERMS OF SERVICE ────────────────────────

const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  final: true,
  lastUpdated: "2026-09-20",
  contactEmail: ENTITY.email,
  sections: [
    {
      heading: "Agreement",
      body: [
        `These terms are an agreement between ${ENTITY.full} ("Wuntab", "we", "us"), and the restaurant that uses Wuntab ("you"). They govern your use of the Wuntab app, the Wuntab platform and the services, documentation and intellectual property that go with them.`,
        `By downloading, installing or using Wuntab, you accept these terms. If you do not accept them, do not use Wuntab.`,
      ],
    },
    {
      heading: "1. The app",
      body: [
        `1.1 What Wuntab does. Wuntab builds and runs your restaurant's website on your own domain, with your menu, your prices, your photos and your branding. It takes online orders for pickup and for delivery, applies promotion codes, and takes payment through our payment processor. It sends your customers order notifications by text message. It passes each order to your kitchen as a printed ticket, and, where you connect your Clover account, injects the order into Clover. It arranges delivery through a third-party delivery partner. It collects enquiries submitted through the forms on your website, including catering enquiries and job applications. It gives you tools to manage your menu, your orders, your locations, your staff accounts and your customer list, and it can draft menu and website copy for you to review and approve. Where you ask us to, it monitors how your pages appear in search.`,
        `1.2 Licence and ownership. We grant you a limited, non-exclusive, non-transferable licence to use Wuntab for your own restaurant business, for as long as this agreement lasts. You may not distribute it, modify it, reverse engineer it, or let anyone else use it on their own behalf. We keep every intellectual property right we do not expressly grant you here.`,
        `What is yours: your menu and your prices, the photos you give us, the words you write for your site, and your customer list. Those stay yours throughout and you can take them with you.`,
        `What is ours: Wuntab itself. That means the website we build and run for you, the templates and the design it is built from, and the platform behind it. While this agreement lasts you have a licence to use them. A licence is not a transfer, and ending this agreement ends the licence.`,
        `Your web address: if you registered your domain name yourself, it is yours and we make no claim to it. If we registered a domain name for you, that domain name belongs to us, and it passes to you only if we agree in writing to transfer it.`,
        `1.3 Changes, interruptions and equipment. We update Wuntab from time to time, and updates may apply automatically. The service may be interrupted for maintenance or because a provider we depend on is unavailable. You are responsible for the devices, printers and internet connection you use to run your restaurant.`,
      ],
    },
    {
      heading: "2. Fees",
      body: [
        SERVICE_FEE_CLAUSE,
        `Sales tax. Wuntab works out the sales tax on each online order using the tax rate set for the location the order is for, adds it to what the customer pays at checkout, and passes it through to you with the rest of the order. You set that rate, and making sure it is the right rate is your responsibility. We do not file or remit sales tax. Filing your returns and paying what you owe stays your responsibility.`,
        `If you believe a service fee has been miscalculated, tell us within 120 days of the order it was charged on, and we will look into it.`,
      ],
    },
    {
      heading: "3. Term",
      body: [
        `This agreement starts when you accept these terms and continues month to month until you or we end it under section 4.`,
      ],
    },
    {
      heading: "4. Suspension and termination",
      body: [
        `4.1 By us. We may suspend or end your use of Wuntab if you breach these terms; if your use is unlawful or infringes someone else's rights; if your use risks harm to the service or to other restaurants using it; if we suspect fraud; if a payment, delivery or platform provider we depend on requires it; or if we stop offering the service, in which case we will give you as much notice as we reasonably can.`,
        `4.2 By you. You may end this agreement at any time, for any reason or none. Because you pay us nothing, there is nothing for us to refund.`,
        `When this agreement ends, your Wuntab website stops being published and your licence to use Wuntab ends. You do not keep the website, its templates or its design, and you do not keep the platform. Section 1.2 sets out what is yours and what is ours, including what happens to a domain name we registered for you.`,
        EXIT_EXPORT,
        `Ending the agreement does not by itself delete your information; see section 5.3 and our ${"[[privacy policy|/privacy]]"} for how deletion works.`,
      ],
    },
    {
      heading: "5. Confidentiality, data and ideas",
      body: [
        `5.1 Confidentiality. Each of us may learn confidential information about the other. Each of us will protect the other's confidential information with at least the care we use for our own. This does not apply to information that is already public through no fault of the receiver, that the receiver already knew, that the receiver receives from someone else without a duty of confidence, or that the receiver develops independently.`,
        `5.2 Disclosure. Neither of us will disclose the other's confidential information, except to employees and contractors who need it and are bound to keep it confidential, where the law requires disclosure and we give the other notice where we are allowed to, and to the service providers named in our ${"[[privacy policy|/privacy]]"}.`,
        `5.3 Data. ${DATA_CLAUSE}`,
        `Our ${"[[privacy policy|/privacy]]"} sets out in full what we collect, who we share it with, how long we keep it and how deletion works. It forms part of these terms.`,
        `5.4 Ideas. If you send us an idea or a suggestion for Wuntab, we may use it without owing you anything and without treating it as confidential. Do not send us an idea you are not willing to have used on those terms.`,
      ],
    },
    {
      heading: "6. Account",
      body: [
        `You will give accurate registration details and keep them current. You are responsible for the security of your account and for what happens under it, including what your staff do. Tell us immediately at ${ENTITY.email} if you believe your account has been accessed without your permission.`,
        `You are responsible for the accuracy of what you publish through Wuntab, including your menu, your prices, your hours and any allergen or ingredient information. You are responsible for keeping your own copies of anything you would not want to lose.`,
      ],
    },
    {
      heading: "7. Risk allocation",
      body: [
        `7.1 No warranty. Wuntab is provided as-is and as-available. To the fullest extent the law allows, we disclaim every warranty, whether express or implied, including any implied warranty of merchantability, fitness for a particular purpose, title or non-infringement. We do not warrant that the service will be uninterrupted or error-free, and we do not promise any particular search ranking, level of orders or level of revenue.`,
        `7.2 Indemnity. You will defend and indemnify us against claims brought by a third party that arise from your content, from your use of Wuntab, from your sale of food and drink, or from an obligation you owe your own customers or staff.`,
        `7.3 Excluded damages. Neither of us is liable to the other for indirect, incidental, consequential, special, exemplary or punitive damages, or for lost profits, lost revenue or lost data, even if told such damages were possible.`,
        `7.4 Cap. Our total liability under this agreement is limited to the service fees we collected on your orders in the three months before the event giving rise to the claim.`,
      ],
    },
    {
      heading: "8. Communications",
      body: [
        `You agree that we may contact you electronically, using the email address and phone number you give us, about your account, the service, and changes to it. Your phone or internet provider may charge you for receiving those messages.`,
      ],
    },
    {
      heading: "9. Compliance with privacy laws",
      body: [
        `9.1 We process personal information only as a service provider acting on your instructions, for the purposes set out in section 5.3. We do not sell personal information, as "sell" is defined in the California Consumer Privacy Act.`,
        `9.2 We do not collect, retain, use or disclose personal information for our own commercial purposes in a way that would be inconsistent with the California Consumer Privacy Act or other applicable privacy law.`,
        `9.3 We limit our collection of personal information to what is reasonably necessary and proportionate to provide the service described in section 1.1.`,
      ],
    },
    {
      heading: "10. Data subject rights",
      body: [
        `10.1 We will give you reasonable help to meet your own obligations to people who ask about their information under the California Consumer Privacy Act or other applicable privacy law. We handle these requests by hand and complete them within 30 days. We do not offer an automated tool for them.`,
        `10.2 If one of your customers sends us a request that is yours to decide, we will pass it to you rather than answer it ourselves.`,
        `10.3 Tell us immediately at ${ENTITY.email} if you receive a complaint or a regulatory enquiry about privacy compliance that relates to Wuntab.`,
      ],
    },
    {
      heading: "11. General",
      body: [
        `11.1 Authority. You confirm that the person accepting these terms has authority to bind your business.`,
        `11.2 Changes. We may change these terms. We will update the date at the top of this page, and where a change is significant we will tell you. If you keep using Wuntab after a change takes effect, you accept it.`,
        `11.3 Compliance. Each of us will comply with the laws that apply to it. You will not upload or transmit anything unlawful, malicious or designed to cause harm.`,
        `11.4 Governing law and venue. These terms are governed by the laws of ${ENTITY.governingLaw}, without regard to conflict-of-laws rules, and the state and federal courts located in ${ENTITY.venue} have exclusive jurisdiction over any dispute arising out of them.`,
        `11.5 Entire agreement. These terms, together with our ${"[[privacy policy|/privacy]]"}, are the entire agreement between us about Wuntab and replace anything said or written before. Neither of us is the other's agent, partner or employee; we are independent contractors.`,
        `11.6 Assignment. You may not assign this agreement without our written consent. We may assign it, including to a company that acquires our business.`,
        `11.7 Contact. ${ENTITY.name}, ${ENTITY.address}, ${ENTITY.phone}, ${ENTITY.email}.`,
      ],
    },
  ],
};

export const legalDocs: Record<"privacy" | "terms", LegalDoc> = { privacy, terms };

export const legalDocList = [legalDocs.privacy, legalDocs.terms];

/** Route paths for documents that are published and may be indexed. */
export function finalLegalRoutes() {
  return legalDocList.filter((doc) => doc.final).map((doc) => `/${doc.slug}`);
}

/** Every bracketed marker that must be resolved before a document goes final. */
export function unresolvedMarkers(doc: LegalDoc) {
  const text = doc.sections.flatMap((s) => [s.heading, ...s.body]).join("\n");
  // Single-bracket markers only; [[label|/href]] link markup is not one.
  return [...text.matchAll(/\[(?!\[)([A-Z][A-Z \d]+)\]/g)].map((m) => m[0]);
}

/** "September 20, 2026" style date for the Last updated line. */
export function formatLegalDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
