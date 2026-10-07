import { SmartLink } from "./smart-link";
import { Logo } from "./logo";
import { byPillar, pillars, productHref, type Pillar } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { legalNav, primaryLinks, site } from "@/lib/site";

const order: Pillar[] = ["sell", "grow", "operate", "scale"];

function Column({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-small font-medium text-paper/55">{title}</p>
      <ul className="mt-2">
        {links.map((link) => (
          <li key={link.href}>
            <SmartLink href={link.href} className="inline-flex min-h-11 items-center text-small text-paper/85 hover:text-paper">
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
      <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {/* Every product page that exists, by pillar. A pillar with no pages yet is left out. */}
          {order.map((pillar) => {
            const links = byPillar(pillar).flatMap((p) => {
              const href = productHref(p.slug);
              return href ? [{ href, label: p.name }] : [];
            });
            return links.length ? (
              <Column key={pillar} title={pillars[pillar].name} links={links} />
            ) : null;
          })}
          <Column title="WunTab" links={primaryLinks} />
        </div>
        <div className="mt-12 flex flex-col gap-6 border-t border-paper/15 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo tone="dark" size={28} />
            <p className="mt-4 max-w-xs text-small text-paper/80">{copy.footer.blurb}</p>
            <SmartLink
              href={`mailto:${site.contactEmail}`}
              className="mt-1 inline-flex min-h-11 items-center text-small font-medium underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
            >
              {site.contactEmail}
            </SmartLink>
          </div>
          <ul className="flex flex-wrap items-center gap-x-6 text-small text-paper/80">
            {legalNav.map((item) => (
              <li key={item.href}>
                <SmartLink href={item.href} className="inline-flex min-h-11 items-center hover:text-paper">
                  {item.label}
                </SmartLink>
              </li>
            ))}
            <li>© {new Date().getFullYear()} WunTab</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
