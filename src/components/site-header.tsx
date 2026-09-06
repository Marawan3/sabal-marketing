import { CtaLink } from "./cta-link";
import { DesktopNav, type NavMenu } from "./desktop-nav";
import { Logo } from "./logo";
import {
  bySlug,
  megaMenu,
  pillars,
  solutionBySlug,
  solutionsMenu,
} from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { appHref, companyNav, demoHref, resourcesNav } from "@/lib/site";

/**
 * Three zones: logo left, primary nav centered on the viewport, Log in and
 * Get Started right. The center column is a grid track between two equal
 * 1fr tracks, so it stays centered no matter how wide the sides are.
 * Below lg the center nav is replaced by a tap-based accordion menu.
 */

function buildMenus(): NavMenu[] {
  return [
    {
      key: "product",
      label: "Product",
      width: "wide",
      groups: megaMenu.map((group) => ({
        title: pillars[group.pillar].name,
        items: group.slugs.map((slug) => ({
          href: `/${slug}`,
          name: bySlug[slug].name,
          blurb: bySlug[slug].blurb,
        })),
      })),
    },
    {
      key: "solutions",
      label: "Solutions",
      width: "medium",
      groups: solutionsMenu.map((group) => ({
        title: group.title,
        items: group.slugs.map((slug) => ({
          href: `/solutions/${slug}`,
          name: solutionBySlug[slug].name,
          blurb: solutionBySlug[slug].blurb,
        })),
      })),
    },
    {
      key: "resources",
      label: "Resources",
      width: "narrow",
      groups: [{ items: resourcesNav.map((item) => ({ href: item.href, name: item.label })) }],
    },
    {
      key: "company",
      label: "Company",
      width: "narrow",
      groups: [{ items: companyNav.map((item) => ({ href: item.href, name: item.label })) }],
    },
  ];
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="block rounded-[6px] px-3 py-2.5 text-[1rem] font-medium hover:bg-ticket">
      {children}
    </a>
  );
}

function MobileAccordion({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <details name="mobile-nav" className="group border-t border-mist">
      <summary className="flex cursor-pointer items-center justify-between py-3.5 text-[1rem] font-medium">
        {label}
        <span aria-hidden className="text-h3 leading-none text-ink/72 group-open:hidden">
          +
        </span>
        <span aria-hidden className="hidden text-h3 leading-none text-ink/72 group-open:inline">
          &minus;
        </span>
      </summary>
      <div className="pb-4">{children}</div>
    </details>
  );
}

export function SiteHeader() {
  const menus = buildMenus();
  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper">
      <div className="relative mx-auto flex max-w-[1120px] items-center justify-between gap-6 px-5 py-3 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-12">
        <a href="/" className="shrink-0 justify-self-start rounded-[8px]" aria-label="WunTab home">
          <Logo size={32} />
        </a>

        <nav className="hidden lg:block" aria-label="Primary">
          <DesktopNav menus={menus} pricing={{ href: "/pricing", label: "Pricing" }} />
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          {appHref ? (
            <a
              href={appHref}
              className="hidden rounded-[6px] px-2 py-1.5 text-[0.9375rem] font-medium hover:text-ink/70 sm:inline-block"
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
              className="absolute inset-x-0 top-full max-h-[85vh] overflow-y-auto border-b border-mist bg-paper px-5 pb-6 shadow-lift sm:px-8"
              aria-label="Mobile"
            >
              {menus.map((menu) => (
                <MobileAccordion key={menu.key} label={menu.label}>
                  {menu.groups.map((group, index) => (
                    <div key={group.title ?? index} className={index > 0 ? "mt-3" : ""}>
                      {group.title ? (
                        <p className="px-3 pb-1 text-small font-medium text-ink/72">{group.title}</p>
                      ) : null}
                      <ul>
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <MobileLink href={item.href}>{item.name}</MobileLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </MobileAccordion>
              ))}
              <div className="border-t border-mist py-2">
                <MobileLink href="/pricing">Pricing</MobileLink>
                {appHref ? <MobileLink href={appHref}>{copy.cta.login}</MobileLink> : null}
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
