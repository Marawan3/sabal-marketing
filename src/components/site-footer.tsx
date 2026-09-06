import { SmartLink } from "./smart-link";
import { Logo } from "./logo";
import { byPillar, pillars, solutions, type Pillar } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { companyNav, legalNav, resourcesNav, site } from "@/lib/site";

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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {order.map((pillar) => (
            <Column
              key={pillar}
              title={pillars[pillar].name}
              links={byPillar(pillar).map((p) => ({ href: `/${p.slug}`, label: p.name }))}
            />
          ))}
          <Column
            title="Solutions"
            links={solutions.map((s) => ({ href: `/solutions/${s.slug}`, label: s.name }))}
          />
          <Column
            title="Company"
            links={[{ href: "/pricing", label: "Pricing" }, ...resourcesNav, ...companyNav]}
          />
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
