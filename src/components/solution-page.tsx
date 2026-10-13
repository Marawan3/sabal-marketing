import type { ReactNode } from "react";
import { Container } from "./container";
import { CtaLink, TextLink } from "./cta-link";
import { ProofSlot } from "./customer-stories";
import { Faq } from "./faq";
import { FinalCta } from "./final-cta";
import { JsonLd } from "./json-ld";
import { OrgDiagram } from "./org-diagram";
import { TwoColumnList, WorksWith } from "./product-page";
import { Section, SectionHead } from "./section";
import { SmartLink } from "./smart-link";
import { Steps } from "./steps";
import { CateringPhone } from "./visuals/catering-phone";
import { Ground } from "./visuals/ground";
import { OrdersDashboard } from "./visuals/orders-dashboard";
import { StorefrontPhone } from "./visuals/storefront-phone";
import { bySlug, productHref, type Solution } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { demoHref } from "@/lib/site";

/** Each solution page's one hero visual: an existing built visual, no new one. */
const heroVisuals: Record<string, ReactNode> = {
  "independent-restaurants": (
    <Ground>
      <StorefrontPhone />
    </Ground>
  ),
  "quick-service": (
    <Ground>
      <OrdersDashboard />
    </Ground>
  ),
  "full-service": (
    <Ground>
      <CateringPhone />
    </Ground>
  ),
  // The diagram sits on the page itself, as on /how-it-works: its muted text needs white under it.
  "multi-location": <OrgDiagram />,
};

/**
 * A solution page, on the product-page template: hero with its visual, how
 * it works (the homepage's three steps), what's included (the four product
 * pages that matter for this kind of restaurant, each with its one line),
 * the proof slot, works with, FAQ (the homepage's own questions), and the
 * final call to action.
 */
export function SolutionPage({ solution }: { solution: Solution }) {
  const faq = solution.faq.map((question) => copy.faq.items.find((item) => item.question === question)!);
  return (
    <>
      <JsonLd data={faqSchema(faq)} />

      <section className="scroll-mt-20">
        <Container className="pt-12 pb-8 sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-14">
          <h1 className="max-w-[18ch] text-display">{solution.headline}</h1>
          <p className="mt-5 max-w-[52ch] text-body text-ink-muted lg:mt-6">{solution.sub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
            <TextLink href="/pricing">See pricing</TextLink>
          </div>
          <div className="mt-12 lg:mt-16">{heroVisuals[solution.slug]}</div>
        </Container>
      </section>

      <Section id="how">
        <SectionHead heading={copy.steps.heading} />
        <div className="mt-8 lg:mt-12">
          <Steps steps={copy.steps.items} />
        </div>
      </Section>

      <Section id="included" tone="warm">
        <SectionHead heading="What's included" />
        <TwoColumnList
          items={solution.picks.map((slug) => (
            <>
              <SmartLink href={productHref(slug)!} className="inline-flex min-h-11 items-center font-medium underline decoration-ink-muted underline-offset-4 hover:decoration-ink">
                {bySlug[slug].name}
              </SmartLink>
              <span className="block text-ink-muted">{bySlug[slug].blurb}</span>
            </>
          ))}
        />
      </Section>

      <ProofSlot slug={solution.slug} />

      <Section id="works-with">
        <SectionHead heading="Works with" />
        <WorksWith slugs={["integrations", "payments", "delivery"]} />
      </Section>

      <Section id="faq">
        <Faq heading={copy.faq.heading} items={faq} />
      </Section>

      <FinalCta />
    </>
  );
}
