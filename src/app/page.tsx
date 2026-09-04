import type { Metadata } from "next";
import Link from "next/link";
import { CrawlerProof } from "@/components/crawler-proof";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { DemoForm } from "@/components/demo-form";
import { JsonLd } from "@/components/json-ld";
import { PhoneFrame } from "@/components/phone-frame";
import { PalmMark } from "@/components/palm-mark";
import { StorefrontMenuMock } from "@/components/mocks/storefront-menu-mock";
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
  money: <MoneyCard />,
} as const;

export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <section className="relative overflow-hidden">
        <PalmMark className="pointer-events-none absolute -right-8 top-8 h-48 w-48 text-palm/15 sm:h-64 sm:w-64" />
        <Container className="grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
              {homeCopy.heroKicker}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              {homeCopy.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
              {homeCopy.heroBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="rounded-full bg-palm-deep px-6 py-3 text-sm font-semibold text-on-brand hover:bg-palm"
              >
                {homeCopy.heroCta}
              </Link>
              <Link
                href="/product"
                className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold hover:bg-sand"
              >
                {homeCopy.heroSecondary}
              </Link>
            </div>
          </div>
          <div>
            <PhoneFrame url="yourrestaurant.com/menu" label={homeCopy.heroPhoneCaption}>
              <StorefrontMenuMock />
            </PhoneFrame>
            <p className="mt-3 text-center text-xs text-ink-soft">
              HTML reconstruction of the storefront. Production photo drops in later.
            </p>
          </div>
        </Container>
      </section>

      <section id="google" className="border-y border-line bg-paper-2">
        <Container className="py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
            {homeCopy.proofKicker}
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl tracking-tight sm:text-4xl">
            {homeCopy.proofTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
            {homeCopy.proofBody}
          </p>
          <div className="mt-10">
            <CrawlerProof />
          </div>
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

      <section className="border-y border-line bg-leaf/70">
        <Container className="py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
            {homeCopy.savingsKicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight sm:text-4xl">
            {homeCopy.savingsTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
            {homeCopy.savingsBody}
          </p>
          <p className="mt-2 text-xs text-ink-soft">{homeCopy.savingsExampleLabel}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {homeCopy.savingsRows.map((row) => (
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
      <p className="mt-4">Grove greens · Coconut Grove</p>
      <p>Citrus herb chicken · $22</p>
      <p className="mt-4 text-ink-soft">MenuItem JSON-LD on the page</p>
    </div>
  );
}

function MoneyCard() {
  return (
    <div className="flex h-full flex-col justify-center bg-sand p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
        On the ticket
      </p>
      <p className="mt-3 font-display text-5xl text-palm-deep">$0</p>
      <p className="mt-3 max-w-xs text-sm leading-6 text-ink-soft">
        Sabal commission. You are the merchant. Processing is at cost. Monthly is
        flat.
      </p>
    </div>
  );
}
