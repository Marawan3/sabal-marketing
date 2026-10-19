"use client";

import { useId, useState, type FormEvent } from "react";
import { buttonBase } from "./cta-link";
import { copy } from "@/lib/copy";
import { contactFields, contactLimits, contactTrap, type ContactField, type ContactIntent } from "@/lib/contact";

const t = copy.contact;

const kinds: Record<ContactField, { type: string; autoComplete: string }> = {
  name: { type: "text", autoComplete: "name" },
  restaurant: { type: "text", autoComplete: "organization" },
  phone: { type: "tel", autoComplete: "tel" },
  email: { type: "email", autoComplete: "email" },
  message: { type: "text", autoComplete: "off" },
};

/**
 * The /contact form: name, restaurant, phone, email and message, posted to
 * /api/contact, which emails hello@. On success it says when we reply; if
 * sending fails it gives the address, so nothing is lost.
 *
 * As a call request (intent "call", from Get Started) the message starts
 * filled in and stays editable, and the phone says what it is for. The
 * intent goes along in a hidden field; `restaurant` prefills its field.
 */
export function ContactForm({ email, intent = "message", restaurant = "" }: { email: string; intent?: ContactIntent; restaurant?: string }) {
  const id = useId();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null);
    setState(res?.ok ? "sent" : "failed");
  }

  if (state === "sent") {
    return (
      <p role="status" className="rounded-[20px] border border-ink p-6 text-h3" data-sent>
        {t.sent}
      </p>
    );
  }

  const field = "mt-2 block w-full rounded-[12px] border border-ink-muted bg-paper px-3 text-body text-ink focus-visible:border-ink";
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 sm:gap-x-6">
      {contactFields.map((name) => {
        const { required, max } = contactLimits[name];
        const forCall = intent === "call" && name === "phone";
        // For a call the phone's label says what it is for; it stays optional.
        const label = forCall ? (
          t.callIntent.phone
        ) : (
          <>
            {t.fields[name]}
            {required ? null : <span className="font-normal text-ink-muted"> (optional)</span>}
          </>
        );
        const prefill = name === "restaurant" ? restaurant : name === "message" && intent === "call" ? t.callIntent.message : undefined;
        return (
          <label key={name} htmlFor={`${id}-${name}`} className={`text-small font-medium ${name === "message" ? "sm:col-span-2" : ""}`}>
            {label}
            {name === "message" ? (
              <textarea id={`${id}-${name}`} name={name} required={required} maxLength={max} rows={5} defaultValue={prefill} className={`${field} py-3`} />
            ) : (
              <input
                id={`${id}-${name}`}
                name={name}
                required={required}
                maxLength={max}
                defaultValue={prefill || undefined}
                {...kinds[name]}
                className={`${field} min-h-12`}
              />
            )}
          </label>
        );
      })}
      <input type="hidden" name="intent" value={intent} />
      {/* The trap: hidden from people and from screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input name={contactTrap} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className={`${buttonBase} min-h-12 bg-saffron px-6 text-body text-ink hover:bg-saffron-deep disabled:opacity-60`}
        >
          {state === "sending" ? t.sending : t.send}
        </button>
        {state === "failed" ? (
          <p role="alert" className="mt-4 text-body">
            {t.failed}{" "}
            <a href={`mailto:${email}`} className="font-medium underline decoration-ink-muted underline-offset-4 hover:decoration-ink">
              {email}
            </a>
          </p>
        ) : null}
      </div>
    </form>
  );
}
