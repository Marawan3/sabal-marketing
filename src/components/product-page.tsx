import { CtaLink, TextLink } from "./cta-link";
import { Flow } from "./flow";
import { JsonLd } from "./json-ld";
import { OrgDiagram } from "./org-diagram";
import { ProductLinks } from "./product-links";
import { ScreenFrame, visibleShots } from "./screen-frame";
import { productPageShots } from "@/lib/shot-placements";
import { Section, SectionHead } from "./section";
import { lifecycle, pillars, type Product } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { demoHref } from "@/lib/site";

function Check() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-1 shrink-0"
    >
      <path d="M3.5 9.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

/**
 * The lifecycle stages before and after this product (SPEC section 5,
 * "Where it fits"). Uses the first stage that lists the product.
 */
function whereItFits(slug: string) {
  const index = lifecycle.findIndex((stage) => stage.products.includes(slug));
  if (index === -1) return null;
  return {
    stage: lifecycle[index],
    before: index > 0 ? lifecycle[index - 1] : null,
    after: index < lifecycle.length - 1 ? lifecycle[index + 1] : null,
  };
}

/**
 * One template for every product page, in the order SPEC section 5 sets:
 * hero, how it works, capabilities, where it fits, the product, FAQ, final
 * call to action. A section with nothing to say does not render. Proof is
 * left out until the owner approves real proof.
 */
export function ProductPage({ product }: { product: Product }) {
  const pillar = pillars[product.pillar];
  // Only shots that render (real file, or a preview deployment) take space.
  const placed = productPageShots(product);
  const hero = visibleShots([placed.hero])[0];
  const rest = visibleShots(placed.rest);
  const fits = whereItFits(product.slug);
  return (
    <>
      {product.faq?.length ? <JsonLd data={faqSchema(product.faq)} /> : null}

      {/* 1. Hero */}
      <section className="scroll-mt-20">
        <div className="mx-auto w-full max-w-[1120px] px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-20 lg:px-12 lg:pt-28 lg:pb-24">
          <p className="text-small font-medium text-ink/72">{pillar.name}</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h1 className="max-w-[16ch] text-display">{product.headline}</h1>
              <p className="mt-8 max-w-[48ch] text-lead text-ink/80">{product.sub}</p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
                <TextLink href="/pricing">See pricing</TextLink>
              </div>
            </div>
            {hero ? (
              <div className="lg:col-span-5">
                <ScreenFrame shot={hero} priority />
              </div>
            ) : product.visual === "org" ? (
              <div className="self-center lg:col-span-5">
                <OrgDiagram />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 2. How it works */}
      {product.flow ? (
        <Section>
          <Flow title={product.flow.title} steps={product.flow.steps} />
        </Section>
      ) : null}

      {/* 3. Capabilities */}
      <Section tone="ticket">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 className="text-h2 lg:col-span-5">{product.capabilitiesTitle ?? "What you can do"}</h2>
          <div className="lg:col-span-7">
            <ul className="space-y-4">
              {product.capabilities.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {product.notes?.length ? (
              <div className="mt-8 max-w-[56ch] space-y-4 border-t border-ink/10 pt-6 text-body text-ink/80">
                {product.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Section>

      {/* 4. Where it fits */}
      {fits ? (
        <Section>
          <SectionHead
            heading="Where it fits"
            sub={`${product.name} is part of the ${fits.stage.name.toLowerCase()} step. ${fits.stage.body}`}
          />
          <div className="mt-12 grid gap-12 md:grid-cols-2">
            {[fits.before, fits.after].map((stage, index) =>
              stage ? (
                <div key={stage.name}>
                  <p className="text-small font-medium text-ink/72">{index === 0 ? "Before" : "After"}</p>
                  <h3 className="mt-2 text-h3">{stage.name}</h3>
                  <p className="mt-2 max-w-[44ch] text-body text-ink/80">{stage.body}</p>
                  <div className="mt-6">
                    <ProductLinks slugs={stage.products.filter((s) => s !== product.slug)} columns={1} />
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </Section>
      ) : null}

      {/* The product: the remaining screens that render. None, no section. */}
      {rest.length ? (
        <Section tone="ticket">
          <h2 className="text-h2">In the product</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {rest.map((shot) => (
              <ScreenFrame key={shot.key} shot={shot} />
            ))}
          </div>
        </Section>
      ) : null}

      {product.related.length ? (
        <Section>
          <SectionHead heading="Works with" sub={`${product.name} is one piece of WunTab. It connects to the rest.`} />
          <div className="mt-12">
            <ProductLinks slugs={product.related} columns={2} />
          </div>
        </Section>
      ) : null}

      {/* 6. FAQ */}
      {product.faq?.length ? (
        <Section>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <h2 className="text-h2 lg:col-span-5">Questions owners ask</h2>
            <div className="faq divide-y divide-mist border-y border-mist lg:col-span-7">
              {product.faq.map((item) => (
                <details key={item.question} className="group">
                  <summary className="flex cursor-pointer items-center gap-4 py-5 text-h3">
                    {item.question}
                  </summary>
                  <p className="max-w-[56ch] pb-6 text-body text-ink/80">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {/* 7. Final call to action */}
      <Section tone="ink">
        <div className="text-center">
          <h2 className="mx-auto max-w-[20ch] text-h2">{copy.finalCta.heading}</h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-lead text-paper/80">{copy.finalCta.body}</p>
          <div className="mt-10">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}
