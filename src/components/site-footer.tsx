import Link from "next/link";
import { Logo } from "./logo";
import { legalNav, nav } from "@/lib/site";

export function SiteFooter({ contactEmail }: { contactEmail: string }) {
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-ink-soft">
            SEO-first restaurant websites and commission-free ordering. We onboard
            every restaurant ourselves.
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-4 inline-block text-sm font-medium text-palm-deep hover:underline"
          >
            {contactEmail}
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
            Product
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-palm-deep">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/demo" className="hover:text-palm-deep">
                Book a demo
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
            Legal
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-palm-deep">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-ink-soft sm:px-8">
          © {new Date().getFullYear()} Sabal. Legal pages are drafts until counsel
          signs off.
        </p>
      </div>
    </footer>
  );
}
