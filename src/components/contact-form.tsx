"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { buttonBase } from "./cta-link";
import { RuleInput, RuleTextarea } from "./rule-input";
import { copy } from "@/lib/copy";
import { contactFields, contactLimits, contactRules, contactTrap, type ContactField, type ContactIntent } from "@/lib/contact";

const t = copy.contact;

const autoCompletes: Record<ContactField, string> = {
  name: "name",
  restaurant: "organization",
  phone: "tel",
  email: "email",
  message: "off",
};

/** A phone box holding part of a number: some digits, not all 10. Empty is fine; the phone is optional. */
const partPhone = (value: string) => value !== "" && contactRules.phone.parse(value) === null;

/**
 * The /contact form: name, restaurant, phone, email and message, posted to
 * /api/contact, which emails hello@. On success it says when we reply; if
 * sending fails it gives the address, so nothing is lost.
 *
 * As a call request (intent "call", from Get Started) the message starts
 * filled in and stays editable, and the phone says what it is for. The
 * intent goes along in a hidden field; `restaurant` prefills its field.
 *
 * Every box but the email has its rule (src/lib/contact.ts), and the handler
 * checks again with the same rules. The phone keeps 10 digits at most and
 * shows them as (305) 555-0123; left with part of a number (on to another
 * box, or Send), it says "Enter all 10 digits" under the box until the number
 * is whole or the box is empty, and the message isn't sent.
 */
export function ContactForm({ email, intent = "message", restaurant = "" }: { email: string; intent?: ContactIntent; restaurant?: string }) {
  const id = useId();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [phone, setPhone] = useState("");
  const [phoneLeft, setPhoneLeft] = useState(false);
  const phoneBox = useRef<HTMLDivElement>(null);
  const phoneError = phoneLeft && partPhone(phone);
  const phoneErrorId = `${id}-phone-error`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (partPhone(phone)) {
      setPhoneLeft(true);
      phoneBox.current?.querySelector("input")?.focus();
      return;
    }
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
        const shared = { id: `${id}-${name}`, name, required, autoComplete: autoCompletes[name] };
        const box =
          name === "message" ? (
            <RuleTextarea rule={contactRules.message} {...shared} maxLength={max} rows={5} defaultValue={prefill} className={`${field} py-3`} />
          ) : name === "email" ? (
            <input {...shared} maxLength={max} type="email" className={`${field} min-h-12`} />
          ) : name === "phone" ? (
            <RuleInput
              rule={contactRules.phone}
              {...shared}
              maxLength={max}
              onValue={setPhone}
              // Moving on to another box with part of a number shows the line. Send does too, from submit().
              onBlur={(event) => {
                if (event.relatedTarget?.matches("input, textarea")) setPhoneLeft(true);
              }}
              aria-invalid={phoneError || undefined}
              aria-describedby={phoneError ? phoneErrorId : undefined}
              className={`${field} min-h-12`}
            />
          ) : (
            <RuleInput rule={contactRules[name]} {...shared} maxLength={max} defaultValue={prefill || undefined} className={`${field} min-h-12`} />
          );
        const labelled = (
          <label key={name} htmlFor={`${id}-${name}`} className={`text-small font-medium ${name === "message" ? "sm:col-span-2" : ""}`}>
            {label}
            {box}
          </label>
        );
        if (name !== "phone") return labelled;
        // The phone's line sits under its box, outside the label, so it isn't read as part of the box's name.
        return (
          <div key={name} ref={phoneBox} className="flex flex-col">
            {labelled}
            {phoneError ? (
              <p id={phoneErrorId} data-phone-error className="mt-2 text-small font-medium text-ink">
                {t.phoneIncomplete}
              </p>
            ) : null}
          </div>
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
