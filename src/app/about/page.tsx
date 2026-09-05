import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaLink } from "@/components/cta-link";
import { Section } from "@/components/section";
import { copy } from "@/lib/copy";
import { demoHref } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "About",
  description: copy.about.body[0],
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section>
        <Container className="pt-16 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
          <h1 className="max-w-[16ch] text-display">{copy.about.headline}</h1>
          <div className="mt-10 max-w-[56ch] space-y-6 text-lead text-ink/80">
            {copy.about.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Container>
      </section>
      <Section tone="ink">
        <div className="text-center">
          <h2 className="mx-auto max-w-[20ch] text-h2">{copy.finalCta.heading}</h2>
          <div className="mt-10">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}
