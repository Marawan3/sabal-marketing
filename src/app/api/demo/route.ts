import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const EMAIL =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (field(body.company_website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = field(body.name, 120);
  const restaurant = field(body.restaurant, 160);
  const city = field(body.city, 120);
  const email = field(body.email, 160);
  const phone = field(body.phone, 40);
  const message = field(body.message, 2000);

  if (!name || !restaurant || !city) {
    return NextResponse.json(
      { ok: false, error: "Name, restaurant, and city are required." },
      { status: 400 },
    );
  }

  if (!email && !phone) {
    return NextResponse.json(
      { ok: false, error: "Add an email or a phone number." },
      { status: 400 },
    );
  }

  if (email && !EMAIL.test(email)) {
    return NextResponse.json({ ok: false, error: "That email does not look valid." }, { status: 400 });
  }

  const text = [
    `Name: ${name}`,
    `Restaurant: ${restaurant}`,
    `City: ${city}`,
    `Email: ${email || "—"}`,
    `Phone: ${phone || "—"}`,
    "",
    message || "(no message)",
  ].join("\n");

  const payload = { name, restaurant, city, email, phone, message };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Demo request received without RESEND_API_KEY", payload);
    return NextResponse.json(
      {
        ok: false,
        error: `Email is not configured on this deploy. Write ${site.contactEmail} directly.`,
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? "Sabal <hello@sabal.ai>";
  const to = process.env.DEMO_INBOX ?? site.contactEmail;

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email || undefined,
    subject: `Demo request: ${restaurant} (${city})`,
    text,
  });

  if (error) {
    console.error("Resend error", error);
    return NextResponse.json(
      { ok: false, error: `Could not send. Email ${site.contactEmail} instead.` },
      { status: 502 },
    );
  }

  const webhook = process.env.DEMO_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (webhookError) {
      console.error("Demo webhook failed", webhookError);
    }
  }

  return NextResponse.json({ ok: true });
}
