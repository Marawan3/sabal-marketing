import type { Metadata } from "next";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { TileMark } from "@/components/logo";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { demoHref, site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: { absolute: `${copy.hero.headline} · Wuntab` },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(copy.faq.items)} />

      <section id="top" className="scroll-mt-24">
        <Container className="grid items-center gap-10 py-16 lg:grid-cols-[auto_1fr] lg:gap-16 lg:py-24">
          <TileMark className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28" />
          <div>
            <h1 className="max-w-3xl text-4xl leading-[1.1] font-medium tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
              {copy.hero.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-charcoal/80">
              {copy.hero.sub}
            </p>
            <a
              href={demoHref}
              className="mt-8 inline-flex rounded-[12px] bg-brick px-6 py-3 text-sm font-medium text-cream hover:bg-brick/90"
            >
              {copy.hero.cta}
            </a>
          </div>
        </Container>
      </section>

      <section id="proof" className="scroll-mt-24 border-y border-charcoal/10">
        <Container className="py-16 sm:py-20">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            {copy.proof.heading}
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.proof.cards.map((card) => (
              <article
                key={card.stat}
                className="rounded-[12px] border border-charcoal/10 bg-sand/35 p-6"
              >
                <p className="text-2xl font-medium tracking-tight text-brick">
                  {card.stat}
                </p>
                <p className="mt-3 text-sm leading-6 text-charcoal/80">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
          <aside className="mt-4 rounded-[12px] border border-charcoal/10 bg-cream p-6">
            <p className="text-xl font-medium tracking-tight text-charcoal">
              {copy.proof.aiLine}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-charcoal/80">
              {copy.proof.aiBody}
            </p>
          </aside>
          <p className="mt-6 text-sm leading-6 text-charcoal/70">
            {copy.proof.footnote}
          </p>
        </Container>
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <Container className="py-16 sm:py-20">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            {copy.how.heading}
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {copy.how.steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[12px] border border-charcoal/10 p-6"
              >
                <p className="text-sm font-medium text-brick">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-xl font-medium">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-charcoal/80">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="features" className="scroll-mt-24 border-y border-charcoal/10">
        <Container className="py-16 sm:py-20">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            {copy.features.heading}
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {copy.features.items.map((item) => (
              <li
                key={item.title}
                className="rounded-[12px] border border-charcoal/10 p-6"
              >
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-charcoal/80">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="pricing" className="scroll-mt-24">
        <Container className="py-16 sm:py-20">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            {copy.pricing.heading}
          </h2>
          <article className="mt-10 max-w-xl rounded-[12px] border border-charcoal/10 bg-sand/35 p-8">
            <p className="text-xl font-medium leading-8">{copy.pricing.line}</p>
            <dl className="mt-8 border-t border-charcoal/10 pt-6">
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-charcoal/70">
                {copy.pricing.slotLabel}
              </dt>
              <dd className="mt-2 text-2xl font-medium">{copy.pricing.slotValue}</dd>
              <dd className="mt-2 text-sm leading-6 text-charcoal/70">
                {copy.pricing.slotNote}
              </dd>
            </dl>
            <a
              href={demoHref}
              className="mt-8 inline-flex rounded-[12px] bg-brick px-6 py-3 text-sm font-medium text-cream hover:bg-brick/90"
            >
              {copy.pricing.cta}
            </a>
          </article>
        </Container>
      </section>

      <section id="faq" className="scroll-mt-24 border-t border-charcoal/10">
        <Container className="py-16 sm:py-20">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            {copy.faq.heading}
          </h2>
          <div className="mt-10 divide-y divide-charcoal/10 border-y border-charcoal/10">
            {copy.faq.items.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="cursor-pointer text-lg font-medium">
                  {item.question}
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/80">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
