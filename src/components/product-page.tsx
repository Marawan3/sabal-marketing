import type { ReactNode } from "react";
import { Container } from "./container";
import { CtaLink, TextLink } from "./cta-link";
import { Faq } from "./faq";
import { FinalCta } from "./final-cta";
import { HeroOrderDemo } from "./hero-order-demo";
import { JsonLd } from "./json-ld";
import { OrgDiagram } from "./org-diagram";
import { Panel, Section, SectionHead } from "./section";
import { SmartLink } from "./smart-link";
import { CateringPhone } from "./visuals/catering-phone";
import { DeliveryFlow } from "./visuals/delivery-flow";
import { DeliveryPhone } from "./visuals/delivery-phone";
import { Ground } from "./visuals/ground";
import { KitchenBoard } from "./visuals/kitchen-board";
import { SearchResult } from "./visuals/search-result";
import { StorefrontPhone } from "./visuals/storefront-phone";
import { bySlug, productHref, type Faq as FaqItem, type Product } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { demoHref } from "@/lib/site";

/** Each product page's one hero visual (owner, 2026-10-13). */
const heroVisuals: Record<string, ReactNode> = {
  "online-ordering": (
    <Panel className="relative overflow-hidden px-4 pt-8 pb-16 sm:px-6 lg:py-12">
      <HeroOrderDemo />
    </Panel>
  ),
  delivery: (
    <Ground>
      <DeliveryPhone />
    </Ground>
  ),
  catering: (
    <Ground>
      <CateringPhone />
    </Ground>
  ),
  "restaurant-websites": (
    <Ground>
      <StorefrontPhone />
    </Ground>
  ),
  "restaurant-seo": (
    <Ground>
      <SearchResult />
    </Ground>
  ),
  "order-management": (
    <Ground>
      <KitchenBoard />
    </Ground>
  ),
};

/**
 * Everything longer than a section's two lines, as questions: what's
 * included, and the steps (except on /delivery, where the steps are the
 * flow diagram). Same words as the catalog, so no fact changes.
 */
function pageFaq(product: Product): FaqItem[] {
  const items: FaqItem[] = [...(product.faq ?? [])];
  items.push({
    question: product.capabilitiesTitle === "What we build in" ? "What do you build in?" : "What's included?",
    answer: `${product.capabilities.join(". ")}.`,
  });
  if (product.flow && product.slug !== "delivery") {
    items.push({
      question: product.flow.question,
      answer: product.flow.steps.map((step, i) => `${i + 1}. ${step}.`).join(" "),
    });
  }
  return items;
}

/**
 * One template for every product page (2026-10-13): a
 * headline, at most two short lines and one visual per section. The hero
 * carries the product's visual; /delivery adds its flow diagram; the rest is
 * in the FAQ. Works with, then the final call to action.
 */
export function ProductPage({ product }: { product: Product }) {
  const related = product.related.filter((slug) => bySlug[slug]);
  const faq = pageFaq(product);
  const visual = heroVisuals[product.slug] ?? (product.visual === "org" ? <OrgDiagram /> : null);
  return (
    <>
      <JsonLd data={faqSchema(faq)} />

      {/* Hero */}
      <section className="scroll-mt-20">
        <Container className="pt-12 pb-8 sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-14">
          <h1 className="max-w-[18ch] text-display">{product.headline}</h1>
          <p className="mt-5 max-w-[52ch] text-body text-ink/85 lg:mt-6">{product.sub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
            <TextLink href="/pricing">See pricing</TextLink>
          </div>
          {visual ? <div className="mt-12 lg:mt-16">{visual}</div> : null}
        </Container>
      </section>

      {/* Delivery: the six steps as the flow diagram, under one line. */}
      {product.slug === "delivery" && product.flow ? (
        <Section>
          <SectionHead heading={product.flow.title} sub={product.notes?.[0]} />
          <div className="mt-8 lg:mt-12">
            <DeliveryFlow />
          </div>
        </Section>
      ) : null}

      {/* Works with: the related products as one row of links. */}
      {related.length ? (
        <Section>
          <SectionHead heading="Works with" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {related.map((slug) => {
              const href = productHref(slug);
              const chip = "inline-flex min-h-11 items-center rounded-[12px] border px-4 text-small font-medium";
              return (
                <li key={slug}>
                  {href ? (
                    <SmartLink href={href} className={`${chip} border-ink/30 hover:border-ink`}>
                      {bySlug[slug].name}
                    </SmartLink>
                  ) : (
                    <span className={`${chip} border-mist text-ink/70`}>{bySlug[slug].name}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      <Section>
        <Faq heading={copy.faq.heading} items={faq} />
      </Section>

      <FinalCta />
    </>
  );
}
