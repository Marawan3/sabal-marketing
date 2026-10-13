"use client";

import { useId, useState } from "react";
import { buttonBase } from "./cta-link";
import { demoHrefWithName } from "@/lib/demo-href";

/**
 * "Your restaurant's name" and Get Started. Opens Book a call with the name
 * filled in. Nothing is sent anywhere by this page: it only builds the link.
 */
export function HeroSignup({
  href,
  label,
  button,
  nameParam,
}: {
  href: string;
  label: string;
  button: string;
  nameParam?: string;
}) {
  const id = useId();
  const [name, setName] = useState("");
  return (
    <form
      className="mx-auto flex w-full max-w-[480px] items-stretch gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        window.location.href = demoHrefWithName(href, name, nameParam);
      }}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name="restaurant"
        type="text"
        autoComplete="organization"
        placeholder={label}
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="min-h-12 min-w-0 flex-1 rounded-[12px] border border-ink-muted bg-paper px-3 text-body text-ink placeholder:text-ink-muted focus-visible:border-ink"
      />
      <button
        type="submit"
        className={`${buttonBase} min-h-12 shrink-0 bg-saffron px-4 text-small text-ink hover:bg-saffron-deep sm:px-6 sm:text-body`}
      >
        {button}
      </button>
    </form>
  );
}
