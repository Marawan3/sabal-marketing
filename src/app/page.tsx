import type { Metadata } from "next";
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
import { isShotVisible, ScreenFrame } from "@/components/screen-frame";
import { Panel, Section, SectionHead } from "@/components/section";
import { productHref } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { shotSize } from "@/lib/shot-files";
import { FITS, homeShots, outcomeTabs, productRows } from "@/lib/shot-placements";
import { demoHref, site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: { absolute: `WunTab: ${copy.hero.headline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

/**
 * The homepage, in the owner's order (layout pass, 2026-10-11): hero, outcome
 * tabs, the kitchen band, product rows, how it works, pricing, what we
 * believe, FAQ, final call to action. No swipe rows, no beige, and the
 * pricing card is the only card. Customer stories and beliefs render only once their data is real.
 * The lifecycle walkthrough and capability lists live on /how-it-works and
 * the product pages, not here.
 */
export default function HomePage() {
  const [kitchenShot] = homeShots.kitchen.shots;
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

      {/* b. Outcomes as tabs: no card. Desktop: lines left, screenshot right. Phone: label, lines, crop. */}
      <Section id="outcomes">
        <SectionHead heading={copy.outcomes.heading} />
        <div className="mt-8 lg:mt-12">
          <OutcomeTabs
            tabs={outcomeTabs().map((tab) => ({
              key: tab.key,
              label: tab.label,
              lines: tab.lines,
              visual: isShotVisible(tab.shot, FITS.outcome) ? (
                <ScreenFrame shot={tab.shot} fit={FITS.outcome} caption={false} />
              ) : null,
            }))}
          />
        </div>
      </Section>

      {/* c. The one bold moment: the kitchen display, large, on the logo navy. */}
      {/* A visual section: without its screenshot the whole band goes. */}
      {isShotVisible(kitchenShot, FITS.kitchen) ? (
        <Section id="kitchen" tone="navy">
          <SectionHead heading={copy.kitchen.heading} sub={copy.kitchen.line} dark />
          <div className="mt-10 lg:mt-14">
            <ScreenFrame shot={kitchenShot} fit={FITS.kitchen} caption={false} dark sizes="(min-width: 1024px) 1024px, 92vw" />
          </div>
        </Section>
      ) : null}

      {/* d. Products: four rows between thin rules. Title, one line, link; a small real crop where one exists. */}
      <Section id="products">
        <SectionHead heading={copy.products.heading} />
        <ul className="mt-8 border-t border-ink/15 lg:mt-12">
          {productRows().map(({ product, shot, crop }) => {
            const href = productHref(product.slug);
            const visible = isShotVisible(shot, FITS.productRow, crop);
            // A crop shows a small part of a big file, so the file is fetched at the crop's scale.
            const k = visible && crop ? shotSize(shot).width / crop.w : 1;
            return (
              <li key={product.slug} className="flex flex-col gap-4 border-b border-ink/15 py-6 md:flex-row md:items-center md:gap-8 lg:py-8">
                <div className="min-w-0 flex-1">
                  <h3 className="text-h3">{product.name}</h3>
                  <p className="mt-2 max-w-[44ch] text-body text-ink/85">{product.headline}</p>
                  {href ? (
                    <TextLink href={href} className="mt-1">
                      More about {product.name.toLowerCase()}
                    </TextLink>
                  ) : null}
                </div>
                {visible ? (
                  // Phones: under the text, 192px wide, so a ticket's text still reads at about 9.7px.
                  <div className="w-48 shrink-0 md:w-40 lg:w-56">
                    <ScreenFrame
                      shot={shot}
                      crop={crop}
                      fit={FITS.productRow}
                      caption={false}
                      fill
                      sizes={`(min-width: 1024px) ${Math.round(224 * k)}px, (min-width: 768px) ${Math.round(160 * k)}px, ${Math.round(192 * k)}px`}
                    />
                  </div>
                ) : null}
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
          <PriceCard lines={copy.pricing.points} />
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
