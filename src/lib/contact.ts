/**
 * The /contact form's fields and their limits, shared by the form and the
 * handler (src/app/api/contact/route.ts) so the two cannot drift.
 */
export const contactFields = ["name", "restaurant", "phone", "email", "message"] as const;
export type ContactField = (typeof contactFields)[number];
export type ContactMessage = Record<ContactField, string>;

export const contactLimits: Record<ContactField, { required: boolean; max: number }> = {
  name: { required: true, max: 120 },
  restaurant: { required: true, max: 160 },
  phone: { required: false, max: 40 },
  email: { required: true, max: 200 },
  message: { required: true, max: 4000 },
};

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

/** The message, trimmed, and why they wrote; or the first field that is missing, too long or malformed. */
export function readContact(input: unknown): { ok: true; message: ContactMessage; intent: ContactIntent } | { ok: false; field: ContactField } {
  const data = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const message = {} as ContactMessage;
  for (const field of contactFields) {
    const raw = data[field];
    const value = typeof raw === "string" ? raw.trim() : "";
    const { required, max } = contactLimits[field];
    if ((required && !value) || value.length > max) return { ok: false, field };
    if (field === "email" && !EMAIL.test(value)) return { ok: false, field };
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
