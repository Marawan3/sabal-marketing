"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "./contact-form";
import { TextLink } from "./cta-link";
import { copy } from "@/lib/copy";
import { contactLimits, readIntent, type ContactIntent } from "@/lib/contact";

const t = copy.contact;

/** Keeps a hyphenated word on one line ("20-minute"), so a narrow headline never breaks after the hyphen. */
const nowrapHyphens = (text: string) =>
  text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );

/**
 * /contact's words and form. As a call request (/contact?intent=call, where
 * Get Started goes) the headline and line say so; otherwise it is the page as
 * it was. `callHref` is the "Rather talk?" link, left out (null) while Get
 * Started comes to this very form.
 */
export function ContactView({
  intent,
  restaurant,
  email,
  callHref,
}: {
  intent: ContactIntent;
  restaurant: string;
  email: string;
  callHref: string | null;
}) {
  const call = intent === "call";
  return (
    <>
      <div className="lg:col-span-5">
        <h1 className="max-w-[12ch] text-display" data-intent={intent}>
          {nowrapHyphens(call ? t.callIntent.headline : t.headline)}
        </h1>
        <p className="mt-5 max-w-[40ch] text-body text-ink-muted lg:mt-6">{call ? t.callIntent.line : t.line}</p>
        <p className="mt-4 text-body">
          <a
            href={`mailto:${email}`}
            className="inline-flex min-h-11 items-center font-medium underline decoration-ink-muted underline-offset-4 hover:decoration-ink"
          >
            {email}
          </a>
        </p>
        {callHref ? <TextLink href={callHref}>{t.call}</TextLink> : null}
      </div>
      <div className="mt-10 lg:col-span-7 lg:mt-0">
        <ContactForm email={email} intent={intent} restaurant={restaurant} />
      </div>
    </>
  );
}

/**
 * ContactView set from the address: ?intent and ?restaurant. Read in the
 * browser (useSearchParams), so the page stays static; it sits in a Suspense
 * boundary whose fallback is the plain page.
 */
export function ContactFromQuery(props: { email: string; callHref: string | null }) {
  const query = useSearchParams();
  const intent = readIntent(query.get("intent"));
  const restaurant = (query.get("restaurant") ?? "").trim().slice(0, contactLimits.restaurant.max);
  // A new query (a client-side visit from Get Started) starts the form afresh.
  return <ContactView key={`${intent}|${restaurant}`} intent={intent} restaurant={restaurant} {...props} />;
}
