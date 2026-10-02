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
      <p className="text-small font-medium text-paper">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <SmartLink href={link.href} className="text-small text-paper/75 hover:text-paper">
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
      <div className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mt-14 flex flex-col gap-6 border-t border-paper/15 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo tone="dark" size={32} />
            <p className="mt-4 max-w-xs text-small text-paper/80">{copy.footer.blurb}</p>
            <SmartLink
              href={`mailto:${site.contactEmail}`}
              className="mt-3 inline-block text-small font-medium underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
            >
              {site.contactEmail}
            </SmartLink>
          </div>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-small text-paper/80">
            {legalNav.map((item) => (
              <li key={item.href}>
                <SmartLink href={item.href} className="hover:text-paper">
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
