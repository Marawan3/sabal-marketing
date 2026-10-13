import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Beliefs } from "@/components/beliefs";
import { Container } from "@/components/container";
import { TextLink } from "@/components/cta-link";
import { CustomerStories } from "@/components/customer-stories";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { HeroOrderDemo } from "@/components/hero-order-demo";
import { HeroSignup } from "@/components/hero-signup";
import { JsonLd } from "@/components/json-ld";
import { OutcomeTabs } from "@/components/outcome-tabs";
import { PriceCard } from "@/components/price-card";
import { Steps } from "@/components/steps";
import { CateringPhone } from "@/components/visuals/catering-phone";
import { DashboardCard } from "@/components/visuals/dashboard-card";
import { DeliveryPhone } from "@/components/visuals/delivery-phone";
import { Ground } from "@/components/visuals/ground";
import { KitchenBoard } from "@/components/visuals/kitchen-board";
import { Receipt } from "@/components/visuals/receipt";
import { StorefrontPhone } from "@/components/visuals/storefront-phone";
import { Panel, Section, SectionHead } from "@/components/section";
import { bySlug, productHref } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { demoHref, site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: { absolute: `WunTab: ${copy.hero.headline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

/**
 * The homepage, in the owner's order: hero, outcome tabs, the kitchen band,
 * product rows, how it works, pricing, what we believe, FAQ, final call to
 * action. Every section is a headline, at most two short lines and one built
 * visual (2026-10-13): no screenshots, no photos. The pricing card is the
 * only card. Customer stories and beliefs render only once their data is real.
 */
/** One visual per outcome tab (owner, 2026-10-13). */
const outcomeVisuals: Record<string, ReactNode> = {
  direct: (
    <Ground bleed>
      <StorefrontPhone cut />
    </Ground>
  ),
  repeat: (
    <Ground>
      <DashboardCard />
    </Ground>
  ),
  busywork: (
    <Ground>
      <KitchenBoard />
    </Ground>
  ),
};

/** One visual per product row, in copy.products.slugs order. */
const productVisuals: Record<string, ReactNode> = {
  "online-ordering": (
    <Ground bleed>
      <StorefrontPhone cut />
    </Ground>
  ),
  delivery: (
    <Ground bleed>
      <DeliveryPhone cut />
    </Ground>
  ),
  catering: (
    <Ground bleed>
      <CateringPhone cut />
    </Ground>
  ),
  "order-management": (
    <Ground>
      <KitchenBoard />
    </Ground>
  ),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(copy.faq.items)} />

      {/* a. Hero */}
      <section id="top" className="scroll-mt-20">
        <Container className="pt-12 pb-10 text-center sm:pt-20 lg:pt-24 lg:pb-14">
          {/* One sentence per line from lg up; they flow together on phones. */}
          <h1 className="mx-auto max-w-[15ch] text-display lg:max-w-none">
            {copy.hero.headline.split(/(?<=\.) /).map((sentence, index) => (
              <span key={sentence} className="lg:block">
                {index > 0 ? " " : null}
                {sentence}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-5 max-w-[40ch] text-body text-ink/85 lg:mt-6">{copy.hero.line}</p>
          <div className="mt-8">
            <HeroSignup
              href={demoHref}
              label={copy.hero.inputLabel}
              button={copy.cta.primary}
              nameParam={process.env.NEXT_PUBLIC_DEMO_NAME_PARAM}
            />
          </div>
        </Container>
        {/*
          The hero art: a live phone drawn in HTML and CSS, on the saffron panel.
          A diner orders from the demo restaurant, and on desktop the order lands
          on the kitchen display beside it (hero-order-demo.tsx).
        */}
        <div className="mx-auto w-full max-w-[1244px] px-4 pb-8 sm:px-8 sm:pb-10 lg:px-12 lg:pb-14">
          <Panel className="relative overflow-hidden px-4 pt-8 pb-16 sm:px-6 lg:py-12">
            <HeroOrderDemo />
          </Panel>
        </div>
      </section>

      <CustomerStories />

      {/* b. Outcomes as tabs: no card. Desktop: lines left, visual right. Phone: label, lines, visual. */}
      <Section id="outcomes">
        <SectionHead heading={copy.outcomes.heading} />
        <div className="mt-8 lg:mt-12">
          <OutcomeTabs
            tabs={copy.outcomes.items.map((tab) => ({
              key: tab.key,
              label: tab.label,
              lines: tab.lines,
              visual: outcomeVisuals[tab.key],
            }))}
          />
        </div>
      </Section>

      {/* c. The one bold moment: the kitchen display, large, on the logo navy. */}
      <Section id="kitchen" tone="navy">
        <SectionHead heading={copy.kitchen.heading} sub={copy.kitchen.line} dark />
        <div className="mt-10 lg:mt-14">
          <KitchenBoard />
        </div>
      </Section>

      {/* d. Products: four rows between thin rules. Title, one line, link, and the product's own visual. */}
      <Section id="products">
        <SectionHead heading={copy.products.heading} />
        <ul className="mt-8 border-t border-ink/15 lg:mt-12">
          {copy.products.slugs.map((slug) => {
            const product = bySlug[slug];
            const href = productHref(slug);
            return (
              <li key={slug} className="flex flex-col gap-5 border-b border-ink/15 py-6 md:flex-row md:items-center md:gap-10 lg:py-10">
                <div className="min-w-0 flex-1">
                  <h3 className="text-h3">{product.name}</h3>
                  <p className="mt-2 max-w-[44ch] text-body text-ink/85">{product.headline}</p>
                  {href ? (
                    <TextLink href={href} className="mt-1">
                      More about {product.name.toLowerCase()}
                    </TextLink>
                  ) : null}
                </div>
                <div className="w-full shrink-0 md:w-[340px] lg:w-[400px]">{productVisuals[slug]}</div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* e. How it works: three steps joined by a line; a vertical list on phones. */}
      <Section id="how-it-works">
        <SectionHead heading={copy.steps.heading} />
        <div className="mt-8 lg:mt-12">
          <Steps steps={copy.steps.items} />
        </div>
        <div className="mt-6">
          <TextLink href="/how-it-works">{copy.cta.secondary}</TextLink>
        </div>
      </Section>

      {/* f. Pricing: the only card on the page. */}
      <Section id="pricing">
        <SectionHead heading={copy.pricing.heading} />
        <div className="mt-8 lg:mt-12">
          <PriceCard
            lines={copy.pricing.points}
            visual={
              <Ground>
                <Receipt />
              </Ground>
            }
          />
        </div>
      </Section>

      {/* What we believe: nothing until the owner writes it. */}
      <Beliefs />

      {/* g. FAQ, then h. the final call to action: a saffron band. */}
      <Section id="faq">
        <Faq heading={copy.faq.heading} items={copy.faq.items} />
      </Section>

      <FinalCta email />
    </>
  );
}
