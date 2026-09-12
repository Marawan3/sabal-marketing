import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaLink, TextLink } from "@/components/cta-link";
import { copy } from "@/lib/copy";
import { demoHref, site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Contact",
  description: copy.contact.body,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section>
      <Container className="pt-16 pb-24 sm:pt-24 lg:pt-28 lg:pb-32">
        <h1 className="max-w-[16ch] text-display">{copy.contact.headline}</h1>
        <p className="mt-8 max-w-[48ch] text-lead text-ink/80">{copy.contact.body}</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
          <TextLink href={`mailto:${site.contactEmail}`}>{site.contactEmail}</TextLink>
        </div>
      </Container>
    </section>
  );
}
