import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { FinalCta } from "@/components/final-cta";
import { OrgDiagram } from "@/components/org-diagram";
import { Faq } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { Section, SectionHead } from "@/components/section";
import { CateringPhone } from "@/components/visuals/catering-phone";
import { DashboardCard } from "@/components/visuals/dashboard-card";
import { DeliveryPhone } from "@/components/visuals/delivery-phone";
import { Ground } from "@/components/visuals/ground";
import { OrdersDashboard } from "@/components/visuals/orders-dashboard";
import { SearchResult } from "@/components/visuals/search-result";
import { StorefrontPhone } from "@/components/visuals/storefront-phone";
import { SmartLink } from "@/components/smart-link";
import { bySlug, lifecycle, productHref } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How WunTab works, from the first search to the next order: discover, order, fulfill, understand, build the relationship, and bring them back.",
  alternates: { canonical: "/how-it-works" },
};

/** Product names as chips; a product links once its page exists. */
function ProductChips({ slugs }: { slugs: readonly string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {slugs.map((slug) => {
        const href = productHref(slug);
        const chip = "inline-flex min-h-11 items-center rounded-[12px] border px-4 text-small font-medium";
        return (
          <li key={slug}>
            {href ? (
              <SmartLink href={href} className={`${chip} border-ink-muted hover:border-ink`}>
                {bySlug[slug].name}
              </SmartLink>
            ) : (
              <span className={`${chip} border-mist text-ink-muted`}>{bySlug[slug].name}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** One built visual per stage, in lifecycle order (owner, 2026-10-13). */
const stageVisuals: ReactNode[] = [
  <Ground key="discover">
    <SearchResult />
  </Ground>,
  <Ground key="order" bleed>
    <StorefrontPhone cut />
  </Ground>,
  <Ground key="fulfill">
    <OrdersDashboard />
  </Ground>,
  <Ground key="understand">
    <DashboardCard />
  </Ground>,
  <Ground key="relationship" bleed>
    <DeliveryPhone cut />
  </Ground>,
  <Ground key="back" bleed>
    <CateringPhone cut />
  </Ground>,
];

/** What used to be the integrations list, now a question (sections stay short). */
const howFaq = [{ question: copy.integrations.question, answer: copy.integrations.answer }];

/**
 * The full lifecycle walkthrough, plus integrations and multi-location,
 * which moved here from the homepage in the 2026-10-07 design pass. Each
 * stage has one built visual; the integrations list is a question in the FAQ.
 */
export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={faqSchema(howFaq)} />
      <section>
        <Container className="pt-12 pb-8 sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-14">
          <h1 className="max-w-[15ch] text-display">{copy.howItWorks.headline}</h1>
          <p className="mt-5 max-w-[44ch] text-body text-ink-muted lg:mt-6">{copy.howItWorks.sub}</p>
        </Container>
      </section>

      {/* The six stages: square rows between thin rules, no cards. */}
      <Section>
        <ol className="border-t border-mist">
          {lifecycle.map((stage, index) => {
            return (
              <li key={stage.name} className="border-b border-mist py-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-14">
                <div className="lg:col-span-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron text-body font-semibold tabular-nums">
                    {index + 1}
                  </span>
                  <h2 className="mt-5 text-h2">{stage.name}</h2>
                  <p className="mt-4 max-w-[44ch] text-body text-ink-muted">{stage.body}</p>
                  <ProductChips slugs={stage.products} />
                </div>
                <div className="mt-8 lg:col-span-7 lg:mt-0">{stageVisuals[index]}</div>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section id="scale">
        <SectionHead heading={copy.scale.heading} sub={copy.scale.sub} />
        <div className="mt-8 lg:mt-12">
          <OrgDiagram />
        </div>
      </Section>

      <Section id="faq">
        <Faq heading={copy.integrations.heading} items={howFaq} />
      </Section>

      <FinalCta />
    </>
  );
}
