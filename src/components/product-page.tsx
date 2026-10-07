import { Container } from "./container";
import { CtaLink, TextLink } from "./cta-link";
import { Faq } from "./faq";
import { FinalCta } from "./final-cta";
import { JsonLd } from "./json-ld";
import { OrgDiagram } from "./org-diagram";
import { ScreenFrame, visibleShots } from "./screen-frame";
import { Panel, Section, SectionHead } from "./section";
import { SmartLink } from "./smart-link";
import { bySlug, productHref, type Product } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { productPageShots } from "@/lib/shot-placements";
import { demoHref } from "@/lib/site";

/**
 * One template for every product page, built from the same panels, type and
 * text limits as the homepage: hero with its screen in a panel, the steps,
 * the product's screens (one line each), what's included, what it works
 * with, FAQ, final call to action. A section with nothing to show does not
 * render. The lifecycle walkthrough lives on /how-it-works.
 */
export function ProductPage({ product }: { product: Product }) {
  // Only shots that render (real file, or a preview deployment) take space.
  const placed = productPageShots(product);
  const hero = visibleShots([placed.hero])[0];
  const rest = visibleShots(placed.rest);
  const related = product.related.filter((slug) => bySlug[slug]);
  return (
    <>
      {product.faq?.length ? <JsonLd data={faqSchema(product.faq)} /> : null}

      {/* Hero */}
      <section className="scroll-mt-20">
        <Container className="pt-12 pb-8 sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-14">
          <h1 className="max-w-[15ch] text-display">{product.headline}</h1>
          <p className="mt-5 max-w-[44ch] text-body text-ink/85 lg:mt-6">{product.sub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
            <TextLink href="/pricing">See pricing</TextLink>
          </div>
          {hero ? (
            <Panel className="mt-12 flex justify-center px-4 py-8 sm:px-10 sm:py-12 lg:mt-16 lg:p-16">
              <div className={hero.kind === "phone" || hero.kind === "photo" ? "w-[62%] max-w-[300px]" : "w-full max-w-[860px]"}>
                <ScreenFrame shot={hero} caption={false} priority fill />
              </div>
            </Panel>
          ) : product.visual === "org" ? (
            <Panel className="mt-12 px-4 py-10 lg:mt-16 lg:p-16">
              <OrgDiagram />
            </Panel>
          ) : null}
        </Container>
      </section>

      {/* The steps, one short line each */}
      {product.flow ? (
        <Section>
          <SectionHead heading={product.flow.title} />
          <ol className="snap-row mt-8 lg:mt-12 lg:grid lg:auto-cols-fr lg:grid-flow-col lg:gap-4">
            {product.flow.steps.map((step, index) => (
              <li key={step} className="rounded-[20px] bg-ticket p-5 lg:rounded-[24px] lg:p-6">
                <p className="text-h3 tabular-nums text-ink/45">{index + 1}</p>
                <p className="mt-6 text-body font-medium lg:mt-10">{step}</p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* The product's screens, each with one line */}
      {rest.length ? (
        <Section>
          <SectionHead heading="In the product" />
          <div className="snap-row mt-8 lg:mt-12 lg:grid lg:grid-cols-2 lg:gap-6">
            {rest.map((shot) => (
              <Panel key={shot.key} className="flex flex-col p-3 lg:p-4">
                <div className="flex flex-1 items-center justify-center">
                  <div className={shot.kind === "phone" || shot.kind === "photo" ? "w-[62%] max-w-[260px] py-4" : "w-full"}>
                    <ScreenFrame shot={shot} caption={false} fill />
                  </div>
                </div>
                <p className="p-3 text-body font-medium lg:p-4">{shot.label}</p>
              </Panel>
            ))}
          </div>
        </Section>
      ) : null}

      {/* What's included: one line each */}
      <Section>
        <SectionHead heading={product.capabilitiesTitle ?? "What's included"} sub={product.notes?.[0]} />
        <ul className="mt-8 flex flex-wrap gap-2 lg:mt-12 lg:gap-3">
          {product.capabilities.map((item) => (
            <li key={item} className="rounded-[14px] bg-ticket px-4 py-3 text-body">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* Works with */}
      {related.length ? (
        <Section>
          <SectionHead heading="Works with" />
          <ul className="snap-row mt-8 lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-4">
            {related.map((slug) => {
              const p = bySlug[slug];
              const href = productHref(slug);
              const body = (
                <>
                  <span className="block text-h3">{p.name}</span>
                  <span className="mt-2 block text-body text-ink/85">{p.blurb}</span>
                </>
              );
              return (
                <li key={slug} className="rounded-[20px] border border-mist lg:rounded-[24px]">
                  {href ? (
                    <SmartLink href={href} className="block h-full rounded-[20px] p-5 hover:bg-ticket lg:rounded-[24px] lg:p-6">
                      {body}
                    </SmartLink>
                  ) : (
                    <div className="h-full p-5 lg:p-6">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      {product.faq?.length ? (
        <Section>
          <Faq heading={copy.faq.heading} items={product.faq} />
        </Section>
      ) : null}

      <FinalCta />
    </>
  );
}
