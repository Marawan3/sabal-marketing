import type { ReactNode } from "react";
import { Container } from "./container";
import { CtaLink, TextLink } from "./cta-link";
import { ProofSlot } from "./customer-stories";
import { Faq } from "./faq";
import { FinalCta } from "./final-cta";
import { HeroOrderDemo } from "./hero-order-demo";
import { JsonLd } from "./json-ld";
import { Panel, Section, SectionHead } from "./section";
import { SmartLink } from "./smart-link";
import { Steps } from "./steps";
import { CateringPhone } from "./visuals/catering-phone";
import { DeliveryFlow } from "./visuals/delivery-flow";
import { DeliveryPhone } from "./visuals/delivery-phone";
import { Ground } from "./visuals/ground";
import { KitchenBoard } from "./visuals/kitchen-board";
import { OrdersDashboard } from "./visuals/orders-dashboard";
import { SettingsCard } from "./visuals/settings-card";
import { SearchResult } from "./visuals/search-result";
import { StepFlow } from "./visuals/step-flow";
import { StorefrontPhone } from "./visuals/storefront-phone";
import { bySlug, productHref, type Product } from "@/lib/catalog";
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
      <OrdersDashboard />
    </Ground>
  ),
};

/**
 * "How it works": the product's steps as one built visual. Delivery keeps its
 * flow diagram and /order-management its kitchen board, with the steps
 * listed over it. /integrations has the owner's one visual here (an order
 * flowing from the storefront to the kitchen) and none in its hero, so the
 * same four steps don't show twice.
 */
function howItWorks(product: Product): ReactNode {
  const flow = product.flow!;
  if (product.slug === "delivery") return <DeliveryFlow />;
  if (product.slug === "order-management")
    return (
      <>
        <Steps steps={flow.steps.map((line) => ({ line }))} />
        <div className="mt-10 lg:mt-12">
          <Ground>
            <KitchenBoard />
          </Ground>
        </div>
      </>
    );
  return (
    <Ground>
      <StepFlow slug={product.slug} />
    </Ground>
  );
}

/** "Works with": the related products as one row of chips; a chip links once its page exists. */
export function WorksWith({ slugs }: { slugs: string[] }) {
  const chip = "inline-flex min-h-11 items-center rounded-[12px] border px-4 text-small font-medium";
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {slugs.map((slug) => {
        const href = productHref(slug);
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

/** "Payments: live. Customers pay..." shows its name in bold; other lines as they are. */
function capability(line: string): ReactNode {
  const match = /^([A-Z]{2,}|[A-Z][a-z]+): (.*)$/.exec(line);
  if (!match) return line;
  return (
    <>
      <span className="font-semibold">{match[1]}</span>: {match[2]}
    </>
  );
}

/** A two-column list (one column on phones) between hairlines. */
export function TwoColumnList({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="mt-6 grid border-t border-mist sm:grid-cols-2 sm:gap-x-8">
      {items.map((item, index) => (
        <li key={index} className="border-b border-mist py-3 text-body">
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * One template for every product page (owner, 2026-10-13), in this order:
 * hero with its visual, how it works (the steps, one built visual), what's
 * included (a two-column list), the proof slot (nothing until there is a
 * real customer), works with, FAQ, and the final call to action. Each
 * section is a headline and its one visual or list.
 */
export function ProductPage({ product }: { product: Product }) {
  const related = product.related.filter((slug) => bySlug[slug]);
  const faq = product.faq ?? [];
  return (
    <>
      <JsonLd data={faqSchema(faq)} />

      {/* Hero */}
      <section className="scroll-mt-20">
        <Container className="pt-12 pb-8 sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-14">
          <h1 className="max-w-[18ch] text-display">{product.headline}</h1>
          <p className="mt-5 max-w-[52ch] text-body text-ink-muted lg:mt-6">{product.sub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
            <TextLink href="/pricing">See pricing</TextLink>
          </div>
          {heroVisuals[product.slug] ? <div className="mt-12 lg:mt-16">{heroVisuals[product.slug]}</div> : null}
        </Container>
      </section>

      {/* How it works */}
      {product.flow ? (
        <Section id="how">
          <SectionHead heading={product.flow.title} sub={product.slug === "delivery" ? product.notes?.[0] : undefined} />
          <div className="mt-8 lg:mt-12">{howItWorks(product)}</div>
        </Section>
      ) : null}

      {/* What's included: on warm, the page's one toned section. /order-management keeps its settings card beside the list. */}
      <Section id="included" tone="warm">
        {product.slug === "order-management" ? (
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-6">
              <SectionHead heading={product.capabilitiesTitle ?? "What's included"} />
              <TwoColumnList items={product.capabilities.map(capability)} />
            </div>
            <div className="lg:col-span-6">
              <Ground>
                <SettingsCard />
              </Ground>
            </div>
          </div>
        ) : (
          <>
            <SectionHead heading={product.capabilitiesTitle ?? "What's included"} />
            <TwoColumnList items={product.capabilities.map(capability)} />
          </>
        )}
      </Section>

      <ProofSlot slug={product.slug} />

      {related.length ? (
        <Section id="works-with">
          <SectionHead heading="Works with" />
          <WorksWith slugs={related} />
        </Section>
      ) : null}

      {faq.length ? (
        <Section id="faq">
          <Faq heading={copy.faq.heading} items={faq} />
        </Section>
      ) : null}

      <FinalCta />
    </>
  );
}
