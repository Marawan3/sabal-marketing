import { SmartLink } from "./smart-link";
import { CtaLink } from "./cta-link";
import { DemoCard, DemoRow } from "./demo-link";
import { DesktopNav, type NavMenu } from "./desktop-nav";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavIcon, isIconName, solutionIcons, type IconName } from "./nav-icon";
import { productMenu, solutionHref, solutions } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { appHref, companyLinks, demoHref, primaryLinks } from "@/lib/site";

/**
 * Three zones: logo left, primary nav centered on the viewport, Log in and
 * Get Started right. The center column is a grid track between two equal
 * 1fr tracks, so it stays centered no matter how wide the sides are.
 * Below lg the center nav is replaced by a tap-based accordion menu.
 */

/**
 * The Product menu (owner, 2026-10-20: option A): every built product page,
 * with its icon, under the three headings in productGroups (catalog.ts), the
 * same list the phone menu and both footers read. Then the demo restaurant's
 * card, and "New to WunTab?" with How it works and Pricing. Then Solutions
 * (the four solution pages, with icons and their lines), the plain links
 * (How it works, Pricing), and Company (About, Contact) last (2026-10-13).
 */
const iconOf = (name: string): IconName | undefined => (isIconName(name) ? name : undefined);

const productNav: NavMenu = {
  key: "product",
  label: "Product",
  width: "product",
  groups: productMenu.map((group) => ({
    title: group.title,
    // Each with its one line under the name on desktop (owner, 2026-10-21); the phone menu shows names only.
    items: group.items.map((item) => ({ href: item.href, name: item.name, blurb: item.blurb, icon: iconOf(item.slug) })),
  })),
  card: <DemoCard />,
  more: {
    lead: copy.nav.newTo,
    links: [
      { href: "/how-it-works", label: copy.nav.howItWorks },
      { href: "/pricing", label: copy.nav.pricing },
    ],
  },
};

const solutionsMenu: NavMenu = {
  key: "solutions",
  label: "Solutions",
  width: "solutions",
  groups: [
    {
      items: solutions.map((s) => ({ href: solutionHref(s.slug), name: s.name, blurb: s.blurb, icon: iconOf(solutionIcons[s.slug] ?? "") })),
    },
  ],
};

const companyMenu: NavMenu = {
  key: "company",
  label: "Company",
  width: "narrow",
  groups: [{ items: companyLinks.map((l) => ({ href: l.href, name: l.label })) }],
};

function MobileLink({ href, icon, children }: { href: string; icon?: IconName; children: React.ReactNode }) {
  return (
    <SmartLink href={href} className={`flex min-h-12 items-center px-3 text-body font-medium hover:bg-panel ${icon ? "gap-3.5" : ""}`}>
      {icon ? <NavIcon name={icon} size={22} /> : null}
      {children}
    </SmartLink>
  );
}

function MobileAccordion({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details name="mobile-nav-group" className="group/acc border-b border-rule">
      <summary className="flex min-h-14 cursor-pointer items-center justify-between text-body font-semibold">
        {label}
        <svg
          aria-hidden
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-150 group-open/acc:rotate-180"
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </summary>
      <div className="-mx-3 pb-4">{children}</div>
    </details>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="relative mx-auto flex h-[68px] max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:px-12">
        <SmartLink href="/" className="flex min-h-11 shrink-0 items-center justify-self-start rounded-[8px]" aria-label="WunTab home">
          <Logo size={28} />
        </SmartLink>

        <nav className="hidden lg:block" aria-label="Primary">
          <DesktopNav menus={[productNav, solutionsMenu]} links={primaryLinks} after={[companyMenu]} />
        </nav>

        <div className="flex items-center gap-2 justify-self-end sm:gap-3">
          {appHref ? (
            <SmartLink
              href={appHref}
              className="hidden min-h-11 items-center rounded-[8px] px-2 text-small font-medium hover:text-ink-muted sm:inline-flex"
            >
              {copy.cta.login}
            </SmartLink>
          ) : null}
          <CtaLink href={demoHref} size="sm">
            {copy.cta.primary}
          </CtaLink>

          {/* Below lg: a full-screen menu, an accordion per Product group, then Solutions and Company. */}
          <MobileMenu className="mobile-nav group lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[12px] border border-rule">
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
                className="group-open:hidden"
              >
                <path d="M3 5h14M3 10h14M3 15h14" />
              </svg>
              <svg
                aria-hidden
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="hidden group-open:block"
              >
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </summary>
            <nav
              className="fixed inset-x-0 top-[69px] bottom-0 z-50 flex flex-col overflow-y-auto bg-paper px-4 pt-2 pb-8 sm:px-8"
              aria-label="Mobile"
            >
              {productNav.groups.map((group, index) => (
                <MobileAccordion key={group.title ?? index} label={group.title ?? "Product"}>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <MobileLink href={item.href} icon={item.icon}>
                          {item.name}
                        </MobileLink>
                      </li>
                    ))}
                  </ul>
                </MobileAccordion>
              ))}
              <MobileAccordion label={solutionsMenu.label}>
                <ul>
                  {solutionsMenu.groups[0].items.map((item) => (
                    <li key={item.href}>
                      <MobileLink href={item.href}>{item.name}</MobileLink>
                    </li>
                  ))}
                </ul>
              </MobileAccordion>
              <MobileAccordion label={companyMenu.label}>
                <ul>
                  {companyLinks.map((link) => (
                    <li key={link.href}>
                      <MobileLink href={link.href}>{link.label}</MobileLink>
                    </li>
                  ))}
                </ul>
              </MobileAccordion>
              <ul className="-mx-3 mt-4">
                {primaryLinks.map((link) => (
                  <li key={link.href}>
                    <MobileLink href={link.href}>{link.label}</MobileLink>
                  </li>
                ))}
                {appHref ? (
                  <li>
                    <MobileLink href={appHref}>{copy.cta.login}</MobileLink>
                  </li>
                ) : null}
              </ul>
              {/* The demo restaurant above Get Started (owner, 2026-10-19), as a compact row with its photo (2026-10-20). */}
              <div className="mt-auto pt-8">
                <DemoRow className="mb-3" />
                <CtaLink href={demoHref} className="w-full">
                  {copy.cta.primary}
                </CtaLink>
              </div>
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
