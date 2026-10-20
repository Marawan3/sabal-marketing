import { SmartLink } from "./smart-link";
import { ExternalIcon } from "./demo-link";
import { Logo } from "./logo";
import { builtProducts, bySlug, megaMenu, pillars, productHref, secondaryProducts, solutionHref, solutions } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { companyLinks, demoStorefront, legalNav, primaryLinks, site } from "@/lib/site";

/** Every product page: the mega-menu's, in its order, then the secondary pages, then How it works and Pricing. */
const productLinks = [
  ...megaMenu.flatMap((group) => group.slugs).filter((slug) => productHref(slug) && !secondaryProducts.has(slug)),
  ...builtProducts.filter((slug) => secondaryProducts.has(slug)),
]
  .map((slug) => ({ href: productHref(slug)!, label: bySlug[slug].name }))
  .concat(primaryLinks.map((l) => ({ href: l.href, label: l.label })));

const solutionLinks = solutions.map((s) => ({ href: solutionHref(s.slug), label: s.name }));

/**
 * Phones: the mobile menu's groups (owner, 2026-10-19), each with every
 * built page in its pillar (the secondary pages too, so the footer still
 * links to every page). How it works and Pricing join Company, and the
 * demo restaurant ends it, in a new tab (owner, 2026-10-20).
 */
type FooterLink = { href: string; label: string; external?: boolean };

const phoneGroups: { title: string; links: FooterLink[] }[] = [
  ...megaMenu.map((group) => ({
    title: pillars[group.pillar].name,
    links: [...group.slugs, ...builtProducts]
      .filter((slug, i, all) => all.indexOf(slug) === i && productHref(slug) && bySlug[slug].pillar === group.pillar)
      .map((slug) => ({ href: productHref(slug)!, label: bySlug[slug].name })),
  })),
  { title: "Solutions", links: solutionLinks },
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

function Column({
  title,
  links,
  className = "",
}: {
  title: string;
  links: readonly { href: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-small font-medium text-paper/80">{title}</p>
      {/* From md to lg the links wrap in a row, so four columns stay short; from lg, one per line. */}
      <ul className="mt-1 flex flex-wrap gap-x-5 lg:mt-2 lg:block">
        {links.map((link) => (
          <li key={link.href}>
            <SmartLink href={link.href} className="inline-flex min-h-11 items-center text-small text-paper/80 hover:text-paper">
              {link.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Terms and Privacy, once in the page: the Legal column from md, and on
 * phones the last row, "Terms · Privacy · © 2026 WunTab".
 */
function Legal() {
  return (
    <div className="flex flex-wrap items-center gap-x-2 md:block">
      <p className="hidden text-small font-medium text-paper/80 md:block">Legal</p>
      <ul className="flex flex-wrap items-center gap-x-2 md:mt-1 md:items-stretch md:gap-x-5 lg:mt-2 lg:block">
        {legalNav.map((link, i) => (
          <li key={link.href} className="max-md:flex max-md:items-center max-md:gap-x-2">
            {i > 0 ? (
              <span aria-hidden className="text-small text-paper/60 md:hidden">
                ·
              </span>
            ) : null}
            <SmartLink href={link.href} className="inline-flex min-h-11 items-center text-small text-paper/80 hover:text-paper">
              {link.label}
            </SmartLink>
          </li>
        ))}
      </ul>
      <span aria-hidden className="text-small text-paper/60 md:hidden">
        ·
      </span>
      <p className="text-small text-paper/80 md:hidden">
        © {year} WunTab
      </p>
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
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener"
                data-demo-link
                className="flex min-h-11 items-center gap-2 text-small text-paper/80 hover:text-paper"
              >
                {link.label}
                <ExternalIcon />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <SmartLink href={link.href} className="flex min-h-11 items-center text-small text-paper/80 hover:text-paper">
                {link.label}
              </SmartLink>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-8 md:py-14 lg:px-12 lg:py-20">
        {/* Phones: the logo, then the groups (owner, 2026-10-20: the $0 line, Get Started and the demo link went; the final band right above has them). */}
        <div className="md:hidden" data-footer="phone">
          <Logo tone="dark" size={28} />
          <div className="mt-4 border-t border-paper/15">
            {phoneGroups.map((group) => (
              <Group key={group.title} title={group.title} links={group.links} />
            ))}
          </div>
          <div className="mt-2">
            <SmartLink
              href={`mailto:${site.contactEmail}`}
              className="inline-flex min-h-11 items-center text-small font-medium underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
            >
              {site.contactEmail}
            </SmartLink>
          </div>
        </div>
        {/* From md: four columns (owner, 2026-10-13), Product, Solutions, Company, Legal; Product and Solutions full width until lg. On phones only Legal shows, as the last row. */}
        <div className="contents md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-6 lg:grid-cols-4">
          <Column title="Product" links={productLinks} className="col-span-2 hidden md:block lg:col-span-1" />
          <Column title="Solutions" links={solutionLinks} className="col-span-2 hidden md:block lg:col-span-1" />
          <Column title="Company" links={companyLinks} className="hidden md:block" />
          <Legal />
        </div>
        {/* From md: the logo and the year on one line; the address and the contact link under them. */}
        <div className="mt-8 hidden border-t border-paper/15 pt-6 md:block lg:mt-12 lg:pt-8">
          <div className="flex items-center justify-between gap-4">
            <Logo tone="dark" size={28} />
            <p className="text-small text-paper/80">© {year} WunTab</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6">
            <SmartLink
              href={`mailto:${site.contactEmail}`}
              className="inline-flex min-h-11 items-center text-small font-medium underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
            >
              {site.contactEmail}
            </SmartLink>
            <SmartLink
              href="/contact"
              className="inline-flex min-h-11 items-center text-small font-medium underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
            >
              {copy.finalCta.message}
            </SmartLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
