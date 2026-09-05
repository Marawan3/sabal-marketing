import Link from "next/link";
import { CtaLink } from "./cta-link";
import { Logo } from "./logo";
import { copy } from "@/lib/copy";
import { demoHref, nav } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
        <Link href="/" className="shrink-0 rounded-[8px]" aria-label="Wuntab home">
          <Logo size={32} />
        </Link>
        <nav
          className="hidden items-center gap-8 text-[0.9375rem] font-medium lg:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[4px] transition-colors duration-150 hover:text-ink/70"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CtaLink href={demoHref} size="sm">
            {copy.hero.cta}
          </CtaLink>
          <details className="relative lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[8px] border border-mist">
              <span className="sr-only">Menu</span>
              <svg
                aria-hidden
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M3 5h14M3 10h14M3 15h14" />
              </svg>
            </summary>
            <nav
              className="absolute right-0 mt-2 w-60 rounded-[8px] border border-mist bg-paper p-2 shadow-lift"
              aria-label="Mobile"
            >
              <ul className="flex flex-col text-[1rem] font-medium">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block rounded-[6px] px-3 py-2.5 hover:bg-ticket"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
