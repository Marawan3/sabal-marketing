import { SmartLink } from "./smart-link";
import { Logo } from "./logo";
import { builtProducts, bySlug, megaMenu, productHref, secondaryProducts, solutionHref, solutions } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { companyLinks, legalNav, primaryLinks, site } from "@/lib/site";

/** Every product page: the mega-menu's, in its order, then the secondary pages, then How it works and Pricing. */
const productLinks = [
  ...megaMenu.flatMap((group) => group.slugs).filter((slug) => productHref(slug) && !secondaryProducts.has(slug)),
  ...builtProducts.filter((slug) => secondaryProducts.has(slug)),
]
  .map((slug) => ({ href: productHref(slug)!, label: bySlug[slug].name }))
  .concat(primaryLinks.map((l) => ({ href: l.href, label: l.label })));

const solutionLinks = solutions.map((s) => ({ href: solutionHref(s.slug), label: s.name }));

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
      {/* Phones: the links wrap in a row, so four columns stay short; from lg, one per line. */}
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

export function SiteFooter() {
  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-8 sm:py-14 lg:px-12 lg:py-20">
        {/* Phones: Product and Solutions full width, Company and Legal side by side. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4">
          {/* Four columns (owner, 2026-10-13): Product, Solutions, Company, Legal. */}
          <Column title="Product" links={productLinks} className="col-span-2 lg:col-span-1" />
          <Column title="Solutions" links={solutionLinks} className="col-span-2 lg:col-span-1" />
          <Column title="Company" links={companyLinks} />
          <Column title="Legal" links={legalNav} />
        </div>
        {/* The logo and the year on one line; the address and the contact link under them. */}
        <div className="mt-8 border-t border-paper/15 pt-6 lg:mt-12 lg:pt-8">
          <div className="flex items-center justify-between gap-4">
            <Logo tone="dark" size={28} />
            <p className="text-small text-paper/80">© {new Date().getFullYear()} WunTab</p>
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
