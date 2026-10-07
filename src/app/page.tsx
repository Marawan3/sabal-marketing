import type { Metadata } from "next";
import { Beliefs } from "@/components/beliefs";
import { Container } from "@/components/container";
import { TextLink } from "@/components/cta-link";
import { CustomerStories } from "@/components/customer-stories";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { HeroSignup } from "@/components/hero-signup";
import { JsonLd } from "@/components/json-ld";
import { OutcomeTabs } from "@/components/outcome-tabs";
import { PriceCard } from "@/components/price-card";
import { isShotVisible, ScreenFrame } from "@/components/screen-frame";
import { Panel, Section, SectionHead } from "@/components/section";
import { productHref } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { homeShots, outcomeTabs, productPanels } from "@/lib/shot-placements";
import { demoHref, site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: { absolute: `WunTab: ${copy.hero.headline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

/**
 * The homepage, in the owner's order (2026-10-07): hero, outcome tabs,
 * product panels, how it works, pricing, what we believe, FAQ, final call to
 * action. Customer stories and beliefs render only once their data is real.
 * The lifecycle walkthrough and capability lists live on /how-it-works and
 * the product pages, not here.
 */
export default function HomePage() {
  const [phoneShot, boardShot] = homeShots.hero.shots;
  const phone = isShotVisible(phoneShot) ? phoneShot : null;
  const board = isShotVisible(boardShot) ? boardShot : null;
  return (
    <>
      <JsonLd data={faqSchema(copy.faq.items)} />

      {/* a. Hero */}
      <section id="top" className="scroll-mt-20">
        <Container className="pt-12 pb-8 text-center sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-14">
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
          {phone || board ? (
            <Panel tone="saffron" className="mt-12 overflow-hidden px-4 pt-8 pb-6 sm:px-10 sm:pt-12 lg:mt-16 lg:px-16 lg:pt-16 lg:pb-12">
              <div className="flex items-end justify-center gap-3 sm:gap-6 lg:gap-10">
                {phone ? (
                  <div className="w-[34%] shrink-0 sm:w-[28%] lg:w-[22%]">
                    <ScreenFrame shot={phone} caption={false} priority fill />
                  </div>
                ) : null}
                {board ? (
                  <div className={`min-w-0 flex-1 ${phone ? "mb-[8%]" : "max-w-[760px]"}`}>
                    <ScreenFrame shot={board} caption={false} priority />
                  </div>
                ) : null}
              </div>
            </Panel>
          ) : null}
        </Container>
      </section>

      <CustomerStories />

      {/* b. Outcomes as tabs */}
      <Section id="outcomes">
        <SectionHead heading={copy.outcomes.heading} />
        <div className="mt-8 lg:mt-12">
          <OutcomeTabs
            tabs={outcomeTabs().map((tab) => ({
              key: tab.key,
              label: tab.label,
              lines: tab.lines,
              visual: isShotVisible(tab.shot) ? <ScreenFrame shot={tab.shot} caption={false} /> : null,
            }))}
          />
        </div>
      </Section>

      {/* c. Product panels */}
      <Section id="products">
        <SectionHead heading={copy.products.heading} />
        <div className="snap-row mt-8 lg:mt-12 lg:grid lg:grid-cols-2 lg:gap-6">
          {productPanels().map(({ product, shot }) => {
            const href = productHref(product.slug);
            return (
              <Panel key={product.slug} className="flex flex-col p-3 lg:p-4">
                {isShotVisible(shot) ? <ScreenFrame shot={shot} caption={false} /> : null}
                <div className="flex flex-1 flex-col p-3 pt-4 lg:p-5">
                  <h3 className="max-w-[24ch] text-h3">{product.headline}</h3>
                  {href ? (
                    <div className="mt-auto pt-3">
                      <TextLink href={href}>More about {product.name.toLowerCase()}</TextLink>
                    </div>
                  ) : null}
                </div>
              </Panel>
            );
          })}
        </div>
      </Section>

      {/* d. How it works */}
      <Section id="how-it-works">
        <SectionHead heading={copy.steps.heading} />
        <ol className="snap-row mt-8 lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-6">
          {copy.steps.items.map((step, index) => (
            <li key={step.title} className="rounded-[20px] bg-ticket p-6 lg:rounded-[24px] lg:p-8">
              <p className="text-h3 tabular-nums text-ink/45">{index + 1}</p>
              <h3 className="mt-8 text-h3 lg:mt-12">{step.title}</h3>
              <p className="mt-2 text-body text-ink/85">{step.line}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4">
          <TextLink href="/how-it-works">{copy.cta.secondary}</TextLink>
        </div>
      </Section>

      {/* e. Pricing */}
      <Section id="pricing">
        <SectionHead heading={copy.pricing.heading} />
        <div className="mt-8 lg:mt-12">
          <PriceCard lines={copy.pricing.points} />
        </div>
      </Section>

      {/* f. What we believe: nothing until the owner writes it. */}
      <Beliefs />

      {/* g. FAQ, then the final call to action */}
      <Section id="faq">
        <Faq heading={copy.faq.heading} items={copy.faq.items} />
      </Section>

      <FinalCta email />
    </>
  );
}
