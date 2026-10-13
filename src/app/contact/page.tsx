import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { TextLink } from "@/components/cta-link";
import { copy } from "@/lib/copy";
import { demoHref, site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Contact",
  description: copy.contact.line,
  alternates: { canonical: "/contact" },
};

/**
 * /contact (owner, 2026-10-13): a real form that emails hello@wuntab.com.
 * Get Started everywhere still books a call; this is for owners who would
 * rather write. No final band here: the page is the call to action.
 */
export default function ContactPage() {
  return (
    <section>
      <Container className="pt-12 pb-16 sm:pt-20 sm:pb-20 lg:grid lg:grid-cols-12 lg:gap-12 lg:pt-24 lg:pb-28">
        <div className="lg:col-span-5">
          <h1 className="max-w-[12ch] text-display">{copy.contact.headline}</h1>
          <p className="mt-5 max-w-[40ch] text-body text-ink-muted lg:mt-6">{copy.contact.line}</p>
          <p className="mt-4 text-body">
            <a
              href={`mailto:${site.contactEmail}`}
              className="inline-flex min-h-11 items-center font-medium underline decoration-ink-muted underline-offset-4 hover:decoration-ink"
            >
              {site.contactEmail}
            </a>
          </p>
          <TextLink href={demoHref}>{copy.contact.call}</TextLink>
        </div>
        <div className="mt-10 lg:col-span-7 lg:mt-0">
          <ContactForm email={site.contactEmail} />
        </div>
      </Container>
    </section>
  );
}
