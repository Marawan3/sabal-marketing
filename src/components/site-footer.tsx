import { SmartLink } from "./smart-link";
import { ExternalIcon } from "./demo-link";
import { Logo } from "./logo";
import { productMenu, solutionHref, solutions } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { companyLinks, demoStorefront, legalNav, primaryLinks, site } from "@/lib/site";

type FooterLink = { href: string; label: string; external?: boolean };

/**
 * The footer's five groups, on every screen (owner, 2026-10-20): the Product
 * menu's three (productGroups in catalog.ts, the list the header menus read,
 * with every built page), then Solutions and Company. How it works and
 * Pricing join Company, and the demo restaurant ends it, in a new tab.
 * Phones show them as closed groups and wider screens as columns, both from
 * this one list, so a new page lands in the same group everywhere.
 */
const footerGroups: { title: string; links: FooterLink[] }[] = [
  ...productMenu.map((group) => ({ title: group.title, links: group.items.map((item) => ({ href: item.href, label: item.name })) })),
  { title: "Solutions", links: solutions.map((s) => ({ href: solutionHref(s.slug), label: s.name })) },
  {
    title: "Company",
    links: [
      ...primaryLinks,
      ...companyLinks,
      ...(demoStorefront.on ? [{ href: demoStorefront.href, label: demoStorefront.footerLabel, external: true }] : []),
    ],
  },
].filter((group) => group.links.length > 0);

const year = new Date().getFullYear();

/** A group's link: the page, or the demo restaurant in a new tab with the new-tab icon. A row on phones, inline in a column. */
function GroupLink({ link, display }: { link: FooterLink; display: "flex" | "inline-flex" }) {
  return link.external ? (
    <a
      href={link.href}
      target="_blank"
      rel="noopener"
      data-demo-link
      className={`${display} min-h-11 items-center gap-2 text-small text-paper underline-offset-4 hover:underline`}
    >
      {link.label}
      <ExternalIcon />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  ) : (
    <SmartLink href={link.href} className={`${display} min-h-11 items-center text-small text-paper underline-offset-4 hover:underline`}>
      {link.label}
    </SmartLink>
  );
}

/** A desktop column: the group's name, then its links, one per line. */
function Column({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <div data-footer-column>
      <p className="text-small font-medium text-paper/75">{title}</p>
      <ul className="mt-2">
        {links.map((link) => (
          <li key={link.href}>
            <GroupLink link={link} display="inline-flex" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Terms and Privacy, once in the page: "Terms · Privacy · © 2026 WunTab",
 * the phone footer's last row and the right end of the bottom bar from md.
 */
function Legal() {
  return (
    <div className="flex flex-wrap items-center gap-x-2">
      <ul className="flex flex-wrap items-center gap-x-2">
        {legalNav.map((link, i) => (
          <li key={link.href} className="flex items-center gap-x-2">
            {i > 0 ? (
              <span aria-hidden className="text-small text-paper/75">
                ·
              </span>
            ) : null}
            <SmartLink href={link.href} className="inline-flex min-h-11 items-center text-small text-paper underline-offset-4 hover:underline">
              {link.label}
            </SmartLink>
          </li>
        ))}
      </ul>
      <span aria-hidden className="text-small text-paper/75">
        ·
      </span>
      <p className="text-small text-paper/75">© {year} WunTab</p>
    </div>
  );
}

/** A phone footer group: a 48px row that opens to its links, one per row. Closed, the links stay in the page. */
function Group({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <details name="footer-group" className="group/fg border-b border-paper/15" data-footer-group>
      <summary className="flex min-h-12 cursor-pointer items-center justify-between text-body font-medium">
        {title}
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
          className="transition-transform duration-150 group-open/fg:rotate-180 motion-reduce:transition-none"
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </summary>
      <ul className="pb-2">
        {links.map((link) => (
          <li key={link.href}>
            <GroupLink link={link} display="flex" />
          </li>
        ))}
      </ul>
    </details>
  );
}

const barLink =
  "inline-flex min-h-11 items-center text-small font-medium underline decoration-paper/40 underline-offset-4 hover:decoration-paper";

export function SiteFooter() {
  return (
    <footer className="on-dark bg-navy text-paper">
      <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-8 md:py-14 lg:px-12 lg:py-20">
        {/* Phones: the logo, then the groups (owner, 2026-10-20: the $0 line, Get Started and the demo link went; the final band right above has them). */}
        <div className="md:hidden" data-footer="phone">
          <Logo tone="dark" size={28} />
          <div className="mt-4 border-t border-paper/15">
            {footerGroups.map((group) => (
              <Group key={group.title} title={group.title} links={group.links} />
            ))}
          </div>
          <div className="mt-2">
            <SmartLink href={`mailto:${site.contactEmail}`} className={barLink}>
              {site.contactEmail}
            </SmartLink>
          </div>
        </div>
        {/*
          From md: the same five groups as columns (owner, 2026-10-20). Three, then Solutions and Company, until lg;
          then one row of five. From lg each column is as wide as its longest name, and the spare width goes between
          them, so no name wraps at 1024 ("Multi-Location Restaurants" is 180px).
        */}
        <div
          data-footer="desktop"
          className="hidden md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-8 lg:grid-cols-[repeat(5,auto)] lg:justify-between lg:gap-x-4"
        >
          {footerGroups.map((group) => (
            <Column key={group.title} title={group.title} links={group.links} />
          ))}
        </div>
        {/* From md, under a hairline: the logo, the address and the contact form, then Terms · Privacy · © on the right. On phones only the legal row shows, as the last row. */}
        <div className="md:mt-8 md:flex md:flex-wrap md:items-center md:justify-between md:gap-x-6 md:border-t md:border-paper/15 md:pt-6 lg:mt-12 lg:pt-8">
          <div className="hidden md:flex md:flex-wrap md:items-center md:gap-x-6">
            <Logo tone="dark" size={28} />
            <SmartLink href={`mailto:${site.contactEmail}`} className={barLink}>
              {site.contactEmail}
            </SmartLink>
            <SmartLink href="/contact" className={barLink}>
              {copy.footer.message}
            </SmartLink>
          </div>
          <Legal />
        </div>
      </div>
    </footer>
  );
}
