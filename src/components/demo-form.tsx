"use client";

import { useState, type FormEvent } from "react";
import { demoCopy } from "@/lib/copy";

type Status = "idle" | "submitting" | "sent" | "error";

const empty = { name: "", restaurant: "", phone: "", city: "" };

export function DemoForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fields, setFields] = useState(empty);

  function update(name: keyof typeof empty, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypot = new FormData(form).get("company_website");
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          company_website: honeypot,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Something went wrong. Email us instead.");
        return;
      }
      setStatus("sent");
      setFields(empty);
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
        <Field
          label={demoCopy.fields.name}
          name="name"
          value={fields.name}
          onChange={update}
          required
          autoComplete="name"
        />
        <Field
          label={demoCopy.fields.restaurant}
          name="restaurant"
          value={fields.restaurant}
          onChange={update}
          required
        />
        <Field
          label={demoCopy.fields.phone}
          name="phone"
          type="tel"
          value={fields.phone}
          onChange={update}
          required
          autoComplete="tel"
        />
        <Field
          label={demoCopy.fields.city}
          name="city"
          value={fields.city}
          onChange={update}
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
        <p className="rounded-2xl bg-sand px-4 py-3 text-sm text-clay" role="alert">
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
  value,
  onChange,
  required,
  autoComplete,
}: {
  label: string;
  name: keyof typeof empty;
  type?: string;
  value: string;
  onChange: (name: keyof typeof empty, value: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(name, event.target.value)}
        className="mt-1 w-full rounded-xl border border-line bg-paper-2 px-3 py-2 text-ink outline-none ring-palm/30 focus:ring-2"
      />
    </label>
  );
}
