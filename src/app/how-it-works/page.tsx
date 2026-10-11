import type { Metadata } from "next";
import { Container } from "@/components/container";
import { FinalCta } from "@/components/final-cta";
import { OrgDiagram } from "@/components/org-diagram";
import { isShotVisible, ScreenFrame } from "@/components/screen-frame";
import { Section, SectionHead } from "@/components/section";
import { SmartLink } from "@/components/smart-link";
import { bySlug, lifecycle, productHref } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { howItWorksShot } from "@/lib/shot-placements";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How WunTab works, from the first search to the next order: discover, order, fulfill, understand, build the relationship, and bring them back.",
  alternates: { canonical: "/how-it-works" },
};

/** Product names as chips; a product links once its page exists. */
function ProductChips({ slugs }: { slugs: readonly string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {slugs.map((slug) => {
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
  );
}

/**
 * The full lifecycle walkthrough, plus integrations and multi-location,
 * which moved here from the homepage in the 2026-10-07 design pass. Frames
 * show their focal crops on phones (layout pass, 2026-10-11).
 */
export default function HowItWorksPage() {
  return (
    <>
      <section>
        <Container className="pt-12 pb-8 sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-14">
          <h1 className="max-w-[15ch] text-display">{copy.howItWorks.headline}</h1>
          <p className="mt-5 max-w-[44ch] text-body text-ink/85 lg:mt-6">{copy.howItWorks.sub}</p>
        </Container>
      </section>

      {/* The six stages: square rows between thin rules, no cards. */}
      <Section>
        <ol className="border-t border-ink/15">
          {lifecycle.map((stage, index) => {
            const shot = howItWorksShot(stage);
            const visible = isShotVisible(shot);
            return (
              <li
                key={stage.name}
                className={`border-b border-ink/15 py-10 lg:py-14 ${visible ? "lg:grid lg:grid-cols-12 lg:items-center lg:gap-12" : ""}`}
              >
                <div className={visible ? "lg:col-span-5" : ""}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron text-body font-semibold tabular-nums">
                    {index + 1}
                  </span>
                  <h2 className="mt-5 text-h2">{stage.name}</h2>
                  <p className="mt-4 max-w-[44ch] text-body text-ink/85">{stage.body}</p>
                  <ProductChips slugs={stage.products} />
                </div>
                {visible ? (
                  <div className="mt-8 lg:col-span-7 lg:mt-0">
                    <ScreenFrame shot={shot} caption={false} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Section>

      <Section id="integrations">
        <SectionHead heading={copy.integrations.heading} />
        <ul className="mt-8 grid gap-x-12 gap-y-3 sm:grid-cols-2 lg:mt-12">
          {copy.integrations.items.map((item) => (
            <li key={item} className="flex gap-3 text-body">
              <span aria-hidden className="mt-[0.6em] h-2 w-2 shrink-0 bg-saffron" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="scale">
        <SectionHead heading={copy.scale.heading} sub={copy.scale.sub} />
        <div className="mt-8 lg:mt-12">
          <OrgDiagram />
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
