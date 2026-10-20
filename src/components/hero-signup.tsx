"use client";

import { useId } from "react";
import { buttonBase } from "./cta-link";
import { demoHrefWithName } from "@/lib/demo-href";

/**
 * "Your restaurant's name" and Get Started. Goes to Book a call with the name
 * filled in: by default the /contact form as a call request, with the name in
 * its Restaurant field (/contact?intent=call&restaurant=...). Nothing is sent
 * anywhere by this page: it only builds the link.
 *
 * The box is uncontrolled and read when the form is sent, so the name in it
 * is the name that goes, even if it was typed before the page's script took
 * over. A controlled box lost it once in WebKit (PR #54's first run there).
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
  return (
    <form
      className="mx-auto flex w-full max-w-[480px] items-stretch gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const name = new FormData(event.currentTarget).get("restaurant");
        window.location.href = demoHrefWithName(href, typeof name === "string" ? name : "", nameParam);
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
