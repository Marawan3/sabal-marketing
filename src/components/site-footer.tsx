import Link from "next/link";
import { Logo } from "./logo";
import { copy } from "@/lib/copy";
import { legalNav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-5 py-12 sm:px-8 sm:py-14 lg:px-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo tone="dark" size={32} />
          <p className="mt-4 max-w-xs text-small text-paper/80">
            {copy.footer.blurb}
          </p>
          <a
            href={`mailto:${site.contactEmail}`}
            className="mt-3 inline-block text-small font-medium underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
          >
            {site.contactEmail}
          </a>
        </div>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-small text-paper/80">
          {legalNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-paper">
                {item.label}
              </Link>
            </li>
          ))}
          <li>© {new Date().getFullYear()} Wuntab</li>
        </ul>
      </div>
    </footer>
  );
}
