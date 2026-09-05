import Link from "next/link";
import { CtaLink } from "./cta-link";
import { Logo } from "./logo";
import { bySlug, megaMenu, pillars, solutions } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { appHref, companyNav, demoHref, resourcesNav } from "@/lib/site";

/**
 * Header with a Product mega-menu and three dropdowns, all native <details>
 * sharing a name so only one is open at a time. No client JavaScript.
 */

function Chevron() {
  return (
    <svg
      aria-hidden
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-150 group-open:rotate-180"
    >
      <path d="M2.5 4.5l3.5 3.5 3.5-3.5" />
    </svg>
  );
}

const summaryClass =
  "flex cursor-pointer items-center gap-1.5 rounded-[6px] px-1 py-1 text-[0.9375rem] font-medium transition-colors duration-150 hover:text-ink/70";

function Dropdown({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <details name="site-nav" className={`group ${wide ? "" : "relative"}`}>
      <summary className={summaryClass}>
        {label}
        <Chevron />
      </summary>
      <div
        className={`absolute z-50 mt-3 rounded-[12px] border border-mist bg-paper p-2 shadow-lift ${
          wide ? "left-0 right-0" : "w-64"
        }`}
      >
        {children}
      </div>
    </details>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-[6px] px-3 py-2 text-[0.9375rem] font-medium hover:bg-ticket"
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper">
      <div className="relative mx-auto flex max-w-[1120px] items-center justify-between gap-6 px-5 py-3 sm:px-8 lg:px-12">
        <Link href="/" className="shrink-0 rounded-[8px]" aria-label="WunTab home">
          <Logo size={32} />
        </Link>

        <nav className="hidden flex-1 items-center gap-5 lg:flex" aria-label="Primary">
          <Dropdown label="Product" wide>
            <div className="grid grid-cols-4 gap-2 p-4">
              {megaMenu.map((group) => (
                <div key={group.pillar}>
                  <p className="px-3 pb-2 text-small font-medium text-ink/60">
                    {pillars[group.pillar].name}
                  </p>
                  <ul>
                    {group.slugs.map((slug) => (
                      <li key={slug}>
                        <MenuLink href={`/${slug}`}>{bySlug[slug].name}</MenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Dropdown>
          <Dropdown label="Solutions">
            <ul>
              {solutions.map((s) => (
                <li key={s.slug}>
                  <MenuLink href={`/solutions/${s.slug}`}>{s.name}</MenuLink>
                </li>
              ))}
            </ul>
          </Dropdown>
          <Link href="/pricing" className={summaryClass}>
            Pricing
          </Link>
          <Dropdown label="Resources">
            <ul>
              {resourcesNav.map((item) => (
                <li key={item.href}>
                  <MenuLink href={item.href}>{item.label}</MenuLink>
                </li>
              ))}
            </ul>
          </Dropdown>
          <Dropdown label="Company">
            <ul>
              {companyNav.map((item) => (
                <li key={item.href}>
                  <MenuLink href={item.href}>{item.label}</MenuLink>
                </li>
              ))}
            </ul>
          </Dropdown>
        </nav>

        <div className="flex items-center gap-3">
          {appHref ? (
            <a
              href={appHref}
              className="hidden text-[0.9375rem] font-medium hover:text-ink/70 sm:inline"
            >
              {copy.cta.login}
            </a>
          ) : null}
          <CtaLink href={demoHref} size="sm">
            {copy.cta.primary}
          </CtaLink>

          <details className="group lg:hidden">
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
              className="absolute inset-x-0 top-full max-h-[80vh] overflow-y-auto border-b border-mist bg-paper px-5 py-6 shadow-lift sm:px-8"
              aria-label="Mobile"
            >
              <div className="grid gap-8 sm:grid-cols-2">
                {megaMenu.map((group) => (
                  <div key={group.pillar}>
                    <p className="text-small font-medium text-ink/60">
                      {pillars[group.pillar].name}
                    </p>
                    <ul className="mt-2">
                      {group.slugs.map((slug) => (
                        <li key={slug}>
                          <MenuLink href={`/${slug}`}>{bySlug[slug].name}</MenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div>
                  <p className="text-small font-medium text-ink/60">Solutions</p>
                  <ul className="mt-2">
                    {solutions.map((s) => (
                      <li key={s.slug}>
                        <MenuLink href={`/solutions/${s.slug}`}>{s.name}</MenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-small font-medium text-ink/60">More</p>
                  <ul className="mt-2">
                    <li>
                      <MenuLink href="/pricing">Pricing</MenuLink>
                    </li>
                    {[...resourcesNav, ...companyNav].map((item) => (
                      <li key={item.href}>
                        <MenuLink href={item.href}>{item.label}</MenuLink>
                      </li>
                    ))}
                    {appHref ? (
                      <li>
                        <a
                          href={appHref}
                          className="block rounded-[6px] px-3 py-2 text-[0.9375rem] font-medium hover:bg-ticket"
                        >
                          {copy.cta.login}
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
