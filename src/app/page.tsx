import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { TextLink } from "@/components/cta-link";
import { Founding } from "@/components/founding";
import { FinalCta } from "@/components/final-cta";
import { HeroOrderDemo } from "@/components/hero-order-demo";
import { HeroSignup } from "@/components/hero-signup";
import { OutcomeTabs } from "@/components/outcome-tabs";
import { PriceCard } from "@/components/price-card";
import { ProductCards, type ProductStill } from "@/components/product-cards";
import { SmartLink } from "@/components/smart-link";
import { SavingsCalculator } from "@/components/savings-calculator";
import { Steps } from "@/components/steps";
import { CateringPhone } from "@/components/visuals/catering-phone";
import { DashboardCard } from "@/components/visuals/dashboard-card";
import { DeliveryPhone } from "@/components/visuals/delivery-phone";
import { Ground } from "@/components/visuals/ground";
import { KitchenBoard } from "@/components/visuals/kitchen-board";
import { OrdersDashboard } from "@/components/visuals/orders-dashboard";
import { Receipt } from "@/components/visuals/receipt";
import { StorefrontPhone } from "@/components/visuals/storefront-phone";
import { Panel, Section, SectionHead } from "@/components/section";
import { bySlug, productHref } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { demoHref, site } from "@/lib/site";
import { DemoLink } from "@/components/demo-link";

export const dynamic = "error";

export const metadata: Metadata = {
  title: { absolute: `WunTab: ${copy.hero.headline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

/**
 * The homepage, in the owner's order: hero (with the trust line and the $0
 * card), founding restaurants, outcome tabs, the kitchen band, product rows,
 * the savings calculator, how it works, pricing, final call to action. What
 * we believe moved to /about, and the FAQ left to make room for the founding
 * section (2026-10-13); its questions are on /pricing and the product pages. Every section is a headline, at most two short lines and one built
 * visual (2026-10-13): no screenshots, no photos. The pricing card is the
 * only card besides the hero's small $0 card. Customer stories render only
 * once their data is real.
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
      <OrdersDashboard />
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
      <OrdersDashboard />
    </Ground>
  ),
};

/**
 * Phones: the same visuals as stills in the product cards (owner,
 * 2026-10-19), scaled into the card's 160px box: a cut phone drawn 280px
 * wide, the dashboard's focal crop 340px wide, each at half size and running
 * off the box's bottom edge, as the phones do on the wider rows.
 */
const productStills: Record<string, ProductStill> = {
  "online-ordering": { node: <StorefrontPhone cut still />, width: 280, scale: 0.5 },
  delivery: { node: <DeliveryPhone cut still />, width: 280, scale: 0.5 },
  catering: { node: <CateringPhone cut still />, width: 280, scale: 0.5 },
  "order-management": { node: <OrdersDashboard still />, width: 340, scale: 0.5 },
};

export default function HomePage() {
  return (
    <>

      {/* a. Hero */}
      <section id="top" className="scroll-mt-20">
        <Container className="pt-8 pb-10 text-center sm:pt-20 lg:pt-24 lg:pb-14">
          {/* The trust line: a saffron dot, then the three facts (owner, 2026-10-13). */}
          <p className="mx-auto mb-5 max-w-[34ch] text-small font-medium text-balance lg:mb-6 lg:max-w-none">
            <span aria-hidden className="mr-2 inline-block h-2 w-2 rounded-full bg-saffron align-middle" />
            {/* Each fact stays whole ("No lock-in" must not break at its hyphen), and a line never starts with a dot. */}
            {copy.hero.trust.split(" · ").map((fact, i, all) => (
              <span key={fact}>
                <span className="whitespace-nowrap">{i < all.length - 1 ? `${fact} ·` : fact}</span>
                {i < all.length - 1 ? " " : null}
              </span>
            ))}
          </p>
          {/* One sentence per line from lg up; they flow together on phones. */}
          <h1 className="mx-auto max-w-[15ch] text-display lg:max-w-none">
            {copy.hero.headline.split(/(?<=\.) /).map((sentence, index) => (
              <span key={sentence} className="lg:block">
                {index > 0 ? " " : null}
                {sentence}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-5 max-w-[40ch] text-body text-ink-muted lg:mt-6">{copy.hero.line}</p>
          <div className="mt-8">
            <HeroSignup
              href={demoHref}
              label={copy.hero.inputLabel}
              button={copy.cta.primary}
              nameParam={process.env.NEXT_PUBLIC_DEMO_NAME_PARAM}
            />
            {/* The $0 pricing fact, moved up; the full pricing section stays lower down. */}
            <p className="mx-auto mt-3 max-w-[480px] rounded-[12px] border border-mist px-4 py-3 text-small">
              <span className="font-semibold">{copy.hero.price.lead}</span> {copy.hero.price.rest}
            </p>
            {/* The demo restaurant's own website, centred under the $0 card (owner, 2026-10-19). */}
            <DemoLink className="mt-2" />
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

      {/* Founding restaurants, in the proof row's slot. The customer row (CustomerStories) returns here once there are real customers. */}
      <Founding />

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
        <div className="mt-8 lg:mt-14">
          <KitchenBoard />
        </div>
      </Section>

      {/* d. Products: on phones a row of cards to swipe; from 768px four rows, each with the product's own visual. */}
      <Section id="products">
        <SectionHead heading={copy.products.heading} />
        <ProductCards slugs={copy.products.slugs} stills={productStills} className="mt-6 md:hidden" />
        <ul className="mt-8 hidden border-t border-mist md:block lg:mt-12">
          {copy.products.slugs.map((slug) => {
            const product = bySlug[slug];
            const href = productHref(slug);
            return (
              <li key={slug} className="flex flex-col gap-5 border-b border-mist py-5 md:flex-row md:items-center md:gap-10 lg:py-10">
                <div className="min-w-0 flex-1">
                  {/* The name is the link (2026-10-13: the "More about" line went to make room for the calculator). */}
                  <h3 className="text-h3">
                    {href ? (
                      <SmartLink
                        href={href}
                        className="-my-[9px] inline-flex min-h-11 items-center underline decoration-ink-muted decoration-2 underline-offset-4 hover:decoration-ink"
                      >
                        {product.name}
                      </SmartLink>
                    ) : (
                      product.name
                    )}
                  </h3>
                  <p className="mt-2 max-w-[44ch] text-body text-ink-muted">{product.headline}</p>
                </div>
                <div className="w-full shrink-0 md:w-[340px] lg:w-[400px]">{productVisuals[slug]}</div>
              </li>
            );
          })}
        </ul>
        <DemoLink className="mt-4 lg:mt-6" />
      </Section>

      {/* The savings calculator, on warm: the owner's own numbers, the apps' published 15–30%. */}
      <Section id="savings" tone="warm">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12">
          <SectionHead heading={copy.savings.heading} className="lg:col-span-5" />
          <div className="lg:col-span-7">
            <SavingsCalculator />
          </div>
        </div>
      </Section>

      {/* e. How it works: three steps joined by a line; a vertical list on phones. */}
      <Section id="how-it-works">
        <SectionHead heading={copy.steps.heading} />
        <div className="mt-8 lg:mt-12">
          <Steps steps={copy.steps.items} />
        </div>
        <div className="mt-4 lg:mt-6">
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

      {/* The final call to action: a saffron band. The FAQ left the homepage for the founding section (2026-10-13). */}
      <FinalCta />
    </>
  );
}
