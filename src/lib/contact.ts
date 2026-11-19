import { boundedText, usPhone } from "./input-rules";

/**
 * The /contact form's fields, their limits and their rules, shared by the
 * form and the handler (src/app/api/contact/route.ts) so the two cannot drift.
 */
export const contactFields = ["name", "restaurant", "phone", "email", "message"] as const;
export type ContactField = (typeof contactFields)[number];
export type ContactMessage = Record<ContactField, string>;

/**
 * Each box's maxLength, which the handler also holds the text to. The phone
 * box never holds more than "(305) 555-0123"; its 40 is room for a pasted
 * "+1 (305) 555-0123" to arrive whole before the rule takes it to 10 digits.
 */
export const contactLimits: Record<ContactField, { required: boolean; max: number }> = {
  name: { required: true, max: 120 },
  restaurant: { required: true, max: 160 },
  phone: { required: false, max: 40 },
  email: { required: true, max: 200 },
  message: { required: true, max: 4000 },
};

/**
 * Each box's type rule (owner, 2026-11-18; src/lib/input-rules.ts). The email
 * has none: it keeps the check below and the browser's own for type="email".
 */
export const contactRules = {
  name: boundedText({ max: contactLimits.name.max }),
  restaurant: boundedText({ max: contactLimits.restaurant.max }),
  phone: usPhone,
  message: boundedText({ max: contactLimits.message.max, multiline: true }),
} as const;

/**
 * Why they wrote (owner, 2026-10-19): "call" when they came from Get Started
 * (/contact?intent=call), "message" otherwise. A hidden field; anything else
 * it might hold counts as "message".
 */
export const contactIntents = ["call", "message"] as const;
export type ContactIntent = (typeof contactIntents)[number];
export const readIntent = (value: unknown): ContactIntent => (value === "call" ? "call" : "message");

/** The trap field: people never see it, so anything in it came from a bot. */
export const contactTrap = "website";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** One field as the email will carry it, or null when it is malformed or too long. */
function readField(field: ContactField, raw: string): string | null {
  if (field === "email") {
    const value = raw.trim();
    return value.length <= contactLimits.email.max && (!value || EMAIL.test(value)) ? value : null;
  }
  if (field === "phone") {
    // Optional; given, it is 10 US digits, emailed as (305) 555-0123.
    if (!raw.trim()) return "";
    if (raw.length > contactLimits.phone.max) return null;
    const digits = usPhone.parse(raw);
    return digits === null ? null : usPhone.format(digits);
  }
  // Name, restaurant and message: control characters out, trimmed, then held to the limit.
  return contactRules[field].parse(raw);
}

/**
 * The message as the email will carry it, and why they wrote; or the first
 * field that is missing, too long or malformed.
 */
export function readContact(input: unknown): { ok: true; message: ContactMessage; intent: ContactIntent } | { ok: false; field: ContactField } {
  const data = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const message = {} as ContactMessage;
  for (const field of contactFields) {
    const raw = data[field];
    const value = readField(field, typeof raw === "string" ? raw : "");
    if (value === null || (contactLimits[field].required && !value)) return { ok: false, field };
    message[field] = value;
  }
  return { ok: true, message, intent: readIntent(data.intent) };
}

/** The email's subject line: a call request, or a message. */
export function contactSubject(m: ContactMessage, intent: ContactIntent) {
  return `${intent === "call" ? "Call request" : "Website message"}: ${m.name}, ${m.restaurant}`;
}

/** The email the restaurant's message becomes: plain text, one field a line. */
export function contactEmailText(m: ContactMessage, intent: ContactIntent = "message") {
  return [
    `Intent: ${intent}`,
    `Name: ${m.name}`,
    `Restaurant: ${m.restaurant}`,
    `Phone: ${m.phone || "(not given)"}`,
    `Email: ${m.email}`,
    "",
    m.message,
    "",
    "Sent from the contact form on wuntab.com/contact.",
  ].join("\n");
}
