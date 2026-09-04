import type { Metadata } from "next";
import Link from "next/link";
import { AssetSlot } from "@/components/asset-slot";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { DemoForm } from "@/components/demo-form";
import { GoogleProof } from "@/components/google-proof";
import { JsonLd } from "@/components/json-ld";
import { PalmMark } from "@/components/palm-mark";
import { CartCheckoutMock } from "@/components/mocks/item-cart-mock";
import { PrinterTicketMock } from "@/components/mocks/printer-ticket-mock";
import { TestimonialPlaceholders } from "@/components/testimonial-placeholders";
import { homeCopy } from "@/lib/copy";
import { softwareApplicationSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.tagline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

const featureVisual = {
  seo: <CrawlerMini />,
  ordering: <CartCheckoutMock />,
  kitchen: <PrinterTicketMock />,
  service: (
    <AssetSlot
      id="onboarding-team"
      label="We set the site up with you"
      ratio="4/3"
      hint="Desktop 1440×900. Menu import or launch walkthrough."
      className="h-full rounded-none border-0"
    />
  ),
} as const;

export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <section className="relative overflow-hidden">
        <PalmMark className="pointer-events-none absolute -right-10 top-6 h-56 w-56 text-palm/12" />
        <Container className="max-w-4xl py-16 sm:py-20 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
            {homeCopy.heroKicker}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {homeCopy.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
            {homeCopy.heroBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="rounded-full bg-palm-deep px-6 py-3 text-sm font-semibold text-on-brand hover:bg-palm"
            >
              {homeCopy.heroCta}
            </Link>
            <a
              href={homeCopy.heroSecondaryHref}
              className="rounded-full border border-ink/15 bg-transparent px-6 py-3 text-sm font-semibold hover:bg-sand"
            >
              {homeCopy.heroSecondary}
            </a>
          </div>
        </Container>
      </section>

      <section id="what-google-sees" className="border-y border-line bg-paper-2">
        <Container className="py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
            {homeCopy.proofKicker}
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl tracking-tight sm:text-5xl">
            {homeCopy.proofTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
            {homeCopy.proofCaption}
          </p>
          <div className="mt-10">
            <GoogleProof />
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-leaf/50">
        <Container className="py-16 sm:py-20">
          <blockquote className="mx-auto max-w-3xl">
            <p className="font-display text-2xl leading-snug tracking-tight sm:text-4xl">
              {homeCopy.honestyQuote}
            </p>
            <footer className="mt-6 text-sm leading-6 text-ink-soft">
              {homeCopy.honestyNote}
            </footer>
          </blockquote>
        </Container>
      </section>

      <section>
        <Container className="py-16 sm:py-20">
          <h2 className="max-w-2xl font-display text-3xl tracking-tight sm:text-4xl">
            {homeCopy.featuresTitle}
          </h2>
          <div className="mt-12 space-y-16">
            {homeCopy.features.map((feature, index) => (
              <article
                key={feature.id}
                className="grid items-center gap-8 lg:grid-cols-2"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                  <h3 className="font-display text-2xl tracking-tight sm:text-3xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-7 text-ink-soft">
                    {feature.body}
                  </p>
                  <Link
                    href={feature.href}
                    className="mt-5 inline-block text-sm font-semibold text-palm-deep hover:underline"
                  >
                    {feature.link}
                  </Link>
                </div>
                <div
                  className={`overflow-hidden rounded-3xl border border-line bg-paper-2 shadow-[0_20px_50px_-28px_rgba(28,36,24,0.35)] ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {featureVisual[feature.id]}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-sand/60">
        <Container className="py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
            {homeCopy.statsKicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight sm:text-4xl">
            {homeCopy.statsTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
            {homeCopy.statsBody}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeCopy.statsRows.map((row) => (
              <div key={row.label} className="rounded-3xl bg-paper-2 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  {row.label}
                </p>
                <p className="mt-3 font-display text-4xl tracking-tight text-palm-deep">
                  {row.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{row.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <TestimonialPlaceholders
        kicker={homeCopy.testimonialsKicker}
        title={homeCopy.testimonialsTitle}
        note={homeCopy.testimonialsNote}
      />

      <section>
        <Container className="grid items-start gap-12 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl tracking-tight">
              Book a walkthrough of your menu.
            </h2>
            <p className="mt-3 max-w-md text-ink-soft">
              We onboard every restaurant ourselves. Name, restaurant, phone, and
              city is enough to start.
            </p>
          </div>
          <DemoForm />
        </Container>
      </section>
      <CtaBand title={homeCopy.finalCtaTitle} body={homeCopy.finalCtaBody} />
    </>
  );
}

function CrawlerMini() {
  return (
    <div className="flex h-full flex-col justify-center bg-leaf p-6 font-mono text-[11px] leading-5 text-palm-deep">
      <p className="text-xs font-semibold uppercase tracking-[0.16em]">/tags/chicken</p>
      <p className="mt-4">Citrus herb chicken · $22</p>
      <p>In the first HTML. In the JSON-LD.</p>
      <p className="mt-4 text-ink-soft">A dish-and-city page, not a promise of rank.</p>
    </div>
  );
}
