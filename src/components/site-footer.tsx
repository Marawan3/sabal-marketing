import Link from "next/link";
import { Logo } from "./logo";
import { copy } from "@/lib/copy";
import { legalNav, nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-charcoal/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-charcoal/75">
            {copy.footer.blurb}
          </p>
          <a
            href={`mailto:${site.contactEmail}`}
            className="mt-4 inline-block text-sm font-medium text-brick hover:underline"
          >
            {site.contactEmail}
          </a>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-charcoal/70">
            On this page
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-brick">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-charcoal/70">
            Legal
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brick">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-charcoal/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-charcoal/70 sm:px-8">
          © {new Date().getFullYear()} Wuntab.
        </p>
      </div>
    </footer>
  );
}
