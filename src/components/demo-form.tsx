"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "sent" | "error";

export function DemoForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (!email && !phone) {
      setStatus("error");
      setMessage("Add an email or a phone number.");
      return;
    }
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          restaurant: data.get("restaurant"),
          city: data.get("city"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          company_website: data.get("company_website"),
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Something went wrong. Email us instead.");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Try again, or email us directly.");
    }
  }

  if (status === "sent") {
    return (
      <p className="rounded-2xl border border-palm/30 bg-leaf px-5 py-8 text-sm leading-6 text-ink">
        Received. Someone from Sabal will write you back. We onboard every
        restaurant personally, so expect a real conversation rather than an
        automated sequence.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field label="Restaurant" name="restaurant" required />
        <Field label="City" name="city" required autoComplete="address-level2" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <label className="block text-sm">
        <span className="font-medium">What should we look at?</span>
        <textarea
          name="message"
          rows={4}
          className="mt-1 w-full rounded-xl border border-line bg-paper-2 px-3 py-2 text-ink outline-none ring-palm/30 focus:ring-2"
        />
      </label>
      <div className="hidden" aria-hidden>
        <label>
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="text-xs text-ink-soft">
        Email or phone is required. We will not add you to a newsletter.
      </p>
      {status === "error" ? (
        <p className="text-sm text-rose-400" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-palm-deep px-6 py-3 text-sm font-semibold text-on-brand hover:bg-palm disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request a demo"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-1 w-full rounded-xl border border-line bg-paper-2 px-3 py-2 text-ink outline-none ring-palm/30 focus:ring-2"
      />
    </label>
  );
}
