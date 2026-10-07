import { SmartLink } from "./smart-link";
import { CtaLink } from "./cta-link";
import { DesktopNav, type NavMenu } from "./desktop-nav";
import { Logo } from "./logo";
import { bySlug, megaMenu, pillars, productHref } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { appHref, demoHref, primaryLinks } from "@/lib/site";

/**
 * Three zones: logo left, primary nav centered on the viewport, Log in and
 * Get Started right. The center column is a grid track between two equal
 * 1fr tracks, so it stays centered no matter how wide the sides are.
 * Below lg the center nav is replaced by a tap-based accordion menu.
 */

/**
 * The Product mega-menu, in the spec's four pillar groups. An item appears
 * once its page exists, and a group with no pages does not render.
 * Solutions, Resources and Company have no pages in phase 1, so they are not
 * in the nav yet.
 */
function buildMenus(): NavMenu[] {
  const groups = megaMenu
    .map((group) => ({
      title: pillars[group.pillar].name,
      items: group.slugs.flatMap((slug) => {
        const href = productHref(slug);
        return href ? [{ href, name: bySlug[slug].name, blurb: bySlug[slug].blurb }] : [];
      }),
    }))
    .filter((group) => group.items.length > 0);
  return [{ key: "product", label: "Product", width: "wide", groups }];
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <SmartLink href={href} className="flex min-h-12 items-center rounded-[14px] px-3 text-body font-medium hover:bg-ticket">
      {children}
    </SmartLink>
  );
}

function MobileAccordion({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details name="mobile-nav-group" className="group/acc border-b border-mist">
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
  const menus = buildMenus();
  const pillarGroups = menus.flatMap((menu) => menu.groups);
  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper">
      <div className="relative mx-auto flex h-[68px] max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:px-12">
        <SmartLink href="/" className="flex min-h-11 shrink-0 items-center justify-self-start rounded-[8px]" aria-label="WunTab home">
          <Logo size={28} />
        </SmartLink>

        <nav className="hidden lg:block" aria-label="Primary">
          <DesktopNav menus={menus} links={primaryLinks} />
        </nav>

        <div className="flex items-center gap-2 justify-self-end sm:gap-3">
          {appHref ? (
            <SmartLink
              href={appHref}
              className="hidden min-h-11 items-center rounded-[8px] px-2 text-small font-medium hover:text-ink/70 sm:inline-flex"
            >
              {copy.cta.login}
            </SmartLink>
          ) : null}
          <CtaLink href={demoHref} size="sm">
            {copy.cta.primary}
          </CtaLink>

          {/* Below lg: a full-screen menu, one accordion per pillar. */}
          <details className="mobile-nav group lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[14px] border border-mist">
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
              {pillarGroups.map((group, index) => (
                <MobileAccordion key={group.title ?? index} label={group.title ?? "Product"}>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <MobileLink href={item.href}>{item.name}</MobileLink>
                      </li>
                    ))}
                  </ul>
                </MobileAccordion>
              ))}
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
              <div className="mt-auto pt-8">
                <CtaLink href={demoHref} className="w-full">
                  {copy.cta.primary}
                </CtaLink>
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
