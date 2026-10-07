import type { Metadata } from "next";
import { Container } from "@/components/container";
import { FinalCta } from "@/components/final-cta";
import { OrgDiagram } from "@/components/org-diagram";
import { isShotVisible, ScreenFrame } from "@/components/screen-frame";
import { Panel, Section, SectionHead } from "@/components/section";
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
        const chip = "inline-flex min-h-11 items-center rounded-[14px] px-4 text-small font-medium";
        return (
          <li key={slug}>
            {href ? (
              <SmartLink href={href} className={`${chip} bg-paper underline decoration-ink/30 underline-offset-4 hover:decoration-ink`}>
                {bySlug[slug].name}
              </SmartLink>
            ) : (
              <span className={`${chip} border border-ink/10`}>{bySlug[slug].name}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The full lifecycle walkthrough, plus integrations and multi-location,
 * which moved here from the homepage in the 2026-10-07 design pass.
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

      <Section>
        <ol className="grid gap-3 lg:gap-6">
          {lifecycle.map((stage, index) => {
            const shot = howItWorksShot(stage);
            const visible = isShotVisible(shot);
            return (
              <li key={stage.name}>
                <Panel className={`p-6 sm:p-8 lg:p-12 ${visible ? "lg:grid lg:grid-cols-12 lg:items-center lg:gap-12" : ""}`}>
                  <div className={visible ? "lg:col-span-5" : ""}>
                    <p className="text-h3 tabular-nums text-ink/45">{index + 1}</p>
                    <h2 className="mt-4 text-h2">{stage.name}</h2>
                    <p className="mt-4 max-w-[44ch] text-body text-ink/85">{stage.body}</p>
                    <ProductChips slugs={stage.products} />
                  </div>
                  {visible ? (
                    <div className="mt-8 lg:col-span-7 lg:mt-0">
                      <ScreenFrame shot={shot} caption={false} />
                    </div>
                  ) : null}
                </Panel>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section id="integrations">
        <SectionHead heading={copy.integrations.heading} />
        <ul className="mt-8 flex flex-wrap gap-2 lg:mt-12 lg:gap-3">
          {copy.integrations.items.map((item) => (
            <li key={item} className="rounded-[14px] bg-ticket px-4 py-3 text-body">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="scale">
        <SectionHead heading={copy.scale.heading} sub={copy.scale.sub} />
        <Panel className="mt-8 px-4 py-10 lg:mt-12 lg:p-16">
          <OrgDiagram />
        </Panel>
      </Section>

      <FinalCta />
    </>
  );
}
