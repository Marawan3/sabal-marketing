import { SmartLink } from "@/components/smart-link";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaLink } from "@/components/cta-link";
import { ScreenFrame } from "@/components/screen-frame";
import { Section } from "@/components/section";
import { bySlug, lifecycle } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { demoHref } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "How it works",
  description: copy.howItWorks.sub,
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <section>
        <Container className="pt-16 pb-12 sm:pt-24 lg:pt-28">
          <h1 className="max-w-[16ch] text-display">{copy.howItWorks.headline}</h1>
          <p className="mt-8 max-w-[48ch] text-lead text-ink/80">{copy.howItWorks.sub}</p>
        </Container>
      </section>
      {lifecycle.map((stage, index) => {
        const shot = bySlug[stage.products[0]].shots[0];
        return (
          <Section key={stage.name} tone={index % 2 === 0 ? "ticket" : "paper"}>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6">
                <p className="text-small tabular-nums text-ink/72">{index + 1}</p>
                <h2 className="mt-2 text-h2">{stage.name}</h2>
                <p className="mt-6 max-w-[48ch] text-lead text-ink/80">{stage.body}</p>
                <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-body font-medium">
                  {stage.products.map((slug) => (
                    <li key={slug}>
                      <SmartLink
                        href={`/${slug}`}
                        className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                      >
                        {bySlug[slug].name}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-6">{shot ? <ScreenFrame shot={shot} /> : null}</div>
            </div>
          </Section>
        );
      })}
      <Section tone="ink">
        <div className="text-center">
          <h2 className="mx-auto max-w-[20ch] text-h2">{copy.finalCta.heading}</h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-lead text-paper/80">{copy.finalCta.body}</p>
          <div className="mt-10">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}
