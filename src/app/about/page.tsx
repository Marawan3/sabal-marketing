import type { Metadata } from "next";
import { Beliefs } from "@/components/beliefs";
import { Container } from "@/components/container";
import { TextLink } from "@/components/cta-link";
import { FinalCta } from "@/components/final-cta";
import { TwoColumnList } from "@/components/product-page";
import { Section, SectionHead } from "@/components/section";
import { SmartLink } from "@/components/smart-link";
import { solutionHref, solutions } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "About",
  description: copy.about.line,
  alternates: { canonical: "/about" },
};

/**
 * /about (owner, 2026-10-13): what we believe (nothing until the owner has
 * written all three), who WunTab is for (the four solution pages), and the
 * hello@ address. No photos, no team, no numbers.
 */
export default function AboutPage() {
  return (
    <>
      <section>
        <Container className="pt-12 pb-8 sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-14">
          <h1 className="max-w-[15ch] text-display">{copy.about.headline}</h1>
          <p className="mt-5 max-w-[48ch] text-body text-ink-muted lg:mt-6">{copy.about.line}</p>
        </Container>
      </section>

      <Beliefs />

      <Section id="for" tone="warm">
        <SectionHead heading={copy.about.forHeading} sub={copy.about.forLine} />
        <TwoColumnList
          items={solutions.map((s) => (
            <>
              <SmartLink href={solutionHref(s.slug)} className="inline-flex min-h-11 items-center font-medium underline decoration-ink-muted underline-offset-4 hover:decoration-ink">
                {s.name}
              </SmartLink>
              <span className="block text-ink-muted">{s.blurb}</span>
            </>
          ))}
        />
      </Section>

      <Section id="reach">
        <SectionHead heading={copy.about.reach} />
        <p className="mt-4 text-body">
          <SmartLink
            href={`mailto:${site.contactEmail}`}
            className="inline-flex min-h-11 items-center font-medium underline decoration-ink-muted underline-offset-4 hover:decoration-ink"
          >
            {site.contactEmail}
          </SmartLink>
        </p>
        <TextLink href="/contact">{copy.finalCta.message}</TextLink>
      </Section>

      <FinalCta message={false} />
    </>
  );
}
