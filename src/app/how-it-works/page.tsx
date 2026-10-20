import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { FinalCta } from "@/components/final-cta";
import { OrgDiagram } from "@/components/org-diagram";
import { Faq } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { Section, SectionHead } from "@/components/section";
import { DashboardCard } from "@/components/visuals/dashboard-card";
import { LoyaltyPhone } from "@/components/visuals/loyalty-phone";
import { SmsPhone } from "@/components/visuals/menu-phones";
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

/** The stage's products that have a page, as links (2026-10-13: every chip links somewhere). */
function ProductChips({ slugs }: { slugs: readonly string[] }) {
  const chip = "inline-flex min-h-11 items-center rounded-[12px] border border-ink-muted px-4 text-small font-medium hover:border-ink";
  if (!slugs.some((slug) => productHref(slug))) return null;
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {slugs.flatMap((slug) => {
        const href = productHref(slug);
        return href
          ? [
              <li key={slug}>
                <SmartLink href={href} className={chip}>
                  {bySlug[slug].name}
                </SmartLink>
              </li>,
            ]
          : [];
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
  // Build the relationship: the reward card (owner, 2026-10-13; loyalty is a build commitment).
  <Ground key="relationship" bleed>
    <LoyaltyPhone cut />
  </Ground>,
  // Bring them back: the customer's text, in the product's words (it has no "ready" text).
  <Ground key="back" bleed>
    <SmsPhone cut />
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
        <ol className="border-t border-rule">
          {lifecycle.map((stage, index) => {
            return (
              <li key={stage.name} className="border-b border-rule py-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-14">
                <div className="lg:col-span-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy text-body font-semibold text-navy tabular-nums">
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
