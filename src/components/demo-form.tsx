"use client";

import { useState, type FormEvent } from "react";
import { demoCopy } from "@/lib/copy";

type Status = "idle" | "submitting" | "sent" | "error";

export function DemoForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
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
          phone: data.get("phone"),
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
      <p className="rounded-3xl border border-palm/30 bg-leaf px-5 py-8 text-sm leading-6 text-ink">
        {demoCopy.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={demoCopy.fields.name} name="name" required autoComplete="name" />
        <Field label={demoCopy.fields.restaurant} name="restaurant" required />
        <Field
          label={demoCopy.fields.phone}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
        />
        <Field
          label={demoCopy.fields.city}
          name="city"
          required
          autoComplete="address-level2"
        />
      </div>
      <div className="hidden" aria-hidden>
        <label>
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="text-xs text-ink-soft">{demoCopy.requiredNote}</p>
      {status === "error" ? (
        <p className="text-sm text-clay" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-palm-deep px-6 py-3 text-sm font-semibold text-on-brand hover:bg-palm disabled:opacity-60"
      >
        {status === "submitting" ? demoCopy.submitting : demoCopy.submit}
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
