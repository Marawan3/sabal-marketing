import { CtaLink, TextLink } from "./cta-link";
import { Flow } from "./flow";
import { OrgDiagram } from "./org-diagram";
import { ProductLinks } from "./product-links";
import { findShot, ScreenFrame } from "./screen-frame";
import { Section, SectionHead } from "./section";
import { pillars, type Product } from "@/lib/catalog";
import { copy } from "@/lib/copy";
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

/** One template for every product page, driven by the catalog. */
export function ProductPage({ product }: { product: Product }) {
  const pillar = pillars[product.pillar];
  const [hero, ...rest] = product.shots;
  return (
    <>
      <section className="scroll-mt-20">
        <div className="mx-auto w-full max-w-[1120px] px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-20 lg:px-12 lg:pt-28 lg:pb-24">
          <p className="text-small font-medium text-ink/72">
            {pillar.name}
          </p>
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

      <Section tone="ticket">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 className="text-h2 lg:col-span-5">
            {product.capabilitiesTitle ?? "What you can do"}
          </h2>
          <div className="lg:col-span-7">
            <ul className="space-y-4">
              {product.capabilities.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {product.comingSoon?.length ? (
              <ul className="mt-6 space-y-3 border-t border-ink/10 pt-6">
                {product.comingSoon.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-body text-ink/72">
                    <span className="rounded-[6px] bg-paper px-2 py-0.5 text-small font-medium text-ink">
                      Coming soon
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
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

      {product.flow ? (
        <Section>
          <Flow title={product.flow.title} steps={product.flow.steps} />
        </Section>
      ) : null}

      {rest.some((shot) => shot.priority === "must" || findShot(shot.key)) ? (
        <Section>
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
