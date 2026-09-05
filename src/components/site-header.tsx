import Link from "next/link";
import { Logo } from "./logo";
import { copy } from "@/lib/copy";
import { demoHref, nav } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Wuntab home">
          <Logo />
        </Link>
        <nav
          className="hidden items-center gap-6 text-sm font-medium text-charcoal lg:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-brick">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={demoHref}
          className="hidden rounded-[12px] bg-brick px-4 py-2 text-sm font-medium text-cream hover:bg-brick/90 lg:inline-flex"
        >
          {copy.hero.cta}
        </a>
        <details className="relative lg:hidden">
          <summary className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-[12px] border border-charcoal/15 text-charcoal [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Menu</span>
            <span aria-hidden className="text-lg leading-none">
              ☰
            </span>
          </summary>
          <nav
            className="absolute right-0 mt-2 w-56 rounded-[12px] border border-charcoal/10 bg-cream p-4"
            aria-label="Mobile"
          >
            <ul className="flex flex-col gap-3 text-base font-medium">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
              <li>
                <a
                  href={demoHref}
                  className="mt-1 inline-flex w-full justify-center rounded-[12px] bg-brick px-4 py-2.5 text-sm font-medium text-cream"
                >
                  {copy.hero.cta}
                </a>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
