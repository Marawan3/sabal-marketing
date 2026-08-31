"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";
import { nav } from "@/lib/site";

export function SiteHeader({ appUrl }: { appUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Sabal home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-soft lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={appUrl}
            className="text-sm font-medium text-ink-soft hover:text-ink"
          >
            Log in
          </a>
          <Link
            href="/demo"
            className="rounded-full bg-palm-deep px-4 py-2 text-sm font-semibold text-on-brand hover:bg-palm"
          >
            Book a demo
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className="text-lg leading-none">
            {open ? "×" : "☰"}
          </span>
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="border-t border-line px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-3 text-base font-medium" aria-label="Mobile">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <a href={appUrl} onClick={() => setOpen(false)}>
              Log in
            </a>
            <Link
              href="/demo"
              className="mt-2 inline-flex justify-center rounded-full bg-palm-deep px-4 py-2.5 text-sm font-semibold text-on-brand"
              onClick={() => setOpen(false)}
            >
              Book a demo
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
