import { contactEmailText, contactSubject, contactTrap, readContact } from "@/lib/contact";
import { site } from "@/lib/site";

/**
 * The /contact form's handler: it checks the message and emails it to
 * hello@wuntab.com, with the sender as reply-to. A call request (Get Started,
 * intent "call") gets the subject "Call request: ..."; anything else is a
 * "Website message: ...".
 *
 * Sending goes through an email API (Resend's, called with fetch, no
 * library) with a key of its own: CONTACT_EMAIL_API_KEY, set in Vercel for
 * this project only. It is not the product's key (scripts/boundary-check.mjs).
 * Without it the handler answers 503 and the form shows the email address
 * instead, so a message is never silently lost.
 *
 * CONTACT_EMAIL_FROM sets the sender (a verified address on the email
 * account); CONTACT_EMAIL_ENDPOINT exists for the tests' stand-in server.
 */
const ENDPOINT = process.env.CONTACT_EMAIL_ENDPOINT ?? "https://api.resend.com/emails";
const FROM = process.env.CONTACT_EMAIL_FROM ?? `WunTab website <${site.contactEmail}>`;

const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status });

/** One line, no control characters: for the subject. */
const oneLine = (text: string) => text.replace(/[\u0000-\u001f\u007f]+/g, " ").slice(0, 120);

export async function POST(request: Request) {
  // Only this site's own pages may post here.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) return json(403, { error: "origin" });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "body" });
  }
  // A filled trap looks like success to the bot and sends nothing.
  if (body && typeof body === "object" && String((body as Record<string, unknown>)[contactTrap] ?? "").trim()) {
    return json(200, { ok: true });
  }
  const read = readContact(body);
  if (!read.ok) return json(400, { error: "field", field: read.field });

  const key = process.env.CONTACT_EMAIL_API_KEY;
  if (!key) return json(503, { error: "not-configured" });

  const { message: m, intent } = read;
  const sent = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [site.contactEmail],
      reply_to: m.email,
      subject: oneLine(contactSubject(m, intent)),
      text: contactEmailText(m, intent),
    }),
  }).catch(() => null);
  if (!sent?.ok) return json(502, { error: "send" });
  return json(200, { ok: true });
}
