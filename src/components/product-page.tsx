import { Container } from "./container";
import { CtaLink, TextLink } from "./cta-link";
import { Faq } from "./faq";
import { FinalCta } from "./final-cta";
import { JsonLd } from "./json-ld";
import { OrgDiagram } from "./org-diagram";
import { isShotVisible, ScreenFrame } from "./screen-frame";
import { Section, SectionHead } from "./section";
import { Steps } from "./steps";
import { SmartLink } from "./smart-link";
import { bySlug, productHref, type Product, type Shot } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { FITS, productPageShots } from "@/lib/shot-placements";
import { demoHref } from "@/lib/site";

/**
 * One template for every product page, on the homepage's rules (layout pass,
 * 2026-10-11): hero with its screen, the steps, the product's screens (one
 * line each, focal crops on phones), what's included, what it works with,
 * FAQ, final call to action. No beige, no cards, no swipe rows. A section with nothing to show does not
 * render. The lifecycle walkthrough lives on /how-it-works.
 */
export function ProductPage({ product }: { product: Product }) {
  // Only shots that render take space: on production a real file sharp enough
  // for its frame (shot-files.ts), on previews anything (or its placeholder).
  const placed = productPageShots(product);
  const narrow = (shot: Shot) => shot.kind === "phone" || shot.kind === "photo";
  const heroFit = (shot: Shot) => (narrow(shot) ? FITS.productHeroNarrow : FITS.productHero);
  const screenFit = (shot: Shot) => (narrow(shot) ? FITS.productScreenNarrow : FITS.productScreen);
  const hero = placed.hero && isShotVisible(placed.hero, heroFit(placed.hero)) ? placed.hero : undefined;
  const rest = placed.rest.filter((shot) => isShotVisible(shot, screenFit(shot)));
  const related = product.related.filter((slug) => bySlug[slug]);
  return (
    <>
      {product.faq?.length ? <JsonLd data={faqSchema(product.faq)} /> : null}

      {/* Hero */}
      <section className="scroll-mt-20">
        <Container className="pt-12 pb-8 sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-14">
          <h1 className="max-w-[18ch] text-display">{product.headline}</h1>
          <p className="mt-5 max-w-[44ch] text-body text-ink/85 lg:mt-6">{product.sub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
            <TextLink href="/pricing">See pricing</TextLink>
          </div>
          {hero ? (
            <div className="mt-12 lg:mt-16">
              <div className={hero.kind === "phone" || hero.kind === "photo" ? "mx-auto w-[62%] max-w-[300px]" : "w-full"}>
                <ScreenFrame
                  shot={hero}
                  fit={heroFit(hero)}
                  caption={false}
                  priority
                  fill
                  sizes={hero.kind === "phone" || hero.kind === "photo" ? "(min-width: 1024px) 300px, 62vw" : "(min-width: 1024px) 1024px, 92vw"}
                />
              </div>
            </div>
          ) : product.visual === "org" ? (
            <div className="mt-12 lg:mt-16">
              <OrgDiagram />
            </div>
          ) : null}
        </Container>
      </section>

      {/* The steps: a row joined by a line on desktop, a vertical numbered list on phones. */}
      {product.flow ? (
        <Section>
          <SectionHead heading={product.flow.title} />
          <div className="mt-8 lg:mt-12">
            <Steps steps={product.flow.steps.map((line) => ({ line }))} />
          </div>
        </Section>
      ) : null}

      {/* The product's screens, each with one line. Stacked on phones (each its focal crop), two up on desktop. */}
      {rest.length ? (
        <Section>
          <SectionHead heading="In the product" />
          <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
            {rest.map((shot) => {
              const narrow = shot.kind === "phone" || shot.kind === "photo";
              return (
                <div key={shot.key}>
                  <div className={narrow ? "mx-auto w-[62%] max-w-[260px]" : "w-full"}>
                    <ScreenFrame
                      shot={shot}
                      fit={screenFit(shot)}
                      caption={false}
                      fill
                      sizes={narrow ? "(min-width: 1024px) 260px, 50vw" : "(min-width: 1024px) 500px, 92vw"}
                    />
                  </div>
                  <p className="mt-4 text-body font-medium">{shot.label}</p>
                </div>
              );
            })}
          </div>
        </Section>
      ) : null}

      {/* What's included: a plain two-column list with small saffron markers. */}
      <Section>
        <SectionHead heading={product.capabilitiesTitle ?? "What's included"} sub={product.notes?.[0]} />
        <ul className="mt-8 grid gap-x-12 gap-y-3 sm:grid-cols-2 lg:mt-12">
          {product.capabilities.map((item) => (
            <li key={item} className="flex gap-3 text-body">
              <span aria-hidden className="mt-[0.6em] h-2 w-2 shrink-0 bg-saffron" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Works with: square list rows between thin rules. */}
      {related.length ? (
        <Section>
          <SectionHead heading="Works with" />
          <ul className="mt-8 grid border-t border-ink/15 sm:grid-cols-2 sm:gap-x-12 lg:mt-12">
            {related.map((slug) => {
              const p = bySlug[slug];
              const href = productHref(slug);
              const body = (
                <>
                  <span className="block text-h3">{p.name}</span>
                  <span className="mt-1 block text-body text-ink/85">{p.blurb}</span>
                </>
              );
              return (
                <li key={slug} className="border-b border-ink/15">
                  {href ? (
                    <SmartLink href={href} className="block py-5 hover:bg-mist">
                      {body}
                    </SmartLink>
                  ) : (
                    <div className="py-5">{body}</div>
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
