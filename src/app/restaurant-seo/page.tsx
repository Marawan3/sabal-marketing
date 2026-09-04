import type { Metadata } from "next";
import { BrowserFrame } from "@/components/browser-frame";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { CrawlerDiagram } from "@/components/mocks/crawler-diagram";
import { SeoScoreMock } from "@/components/mocks/seo-score-mock";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { restaurantSeoFaqs } from "@/lib/seo-faqs";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Restaurant SEO",
  description:
    "Sabal turns a live menu into indexable pages, structured data, and a launch checklist that will not call you ready until the site actually is.",
  alternates: { canonical: "/restaurant-seo" },
};

const generated = [
  "Per-location landing pages with address, hours, and a map.",
  "Dish pages and neighborhood pages built from your actual menu.",
  "Restaurant, Menu, and FAQ structured data that matches the visible page.",
  "Automatic sitemaps, self-canonicals, and clean URLs.",
  "Image optimization with alt text written from the real dish name.",
] as const;

export default function RestaurantSeoPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Restaurant SEO", path: "/restaurant-seo" },
          ]),
          faqSchema([...restaurantSeoFaqs]),
        ]}
      />
      <Container className="py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
          The flagship
        </p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl tracking-tight sm:text-6xl">
          Restaurant SEO that&apos;s built in, not bolted on.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
          Search engines read HTML. Sabal publishes the menu as HTML, then
          refuses to ship the thin pages that usually come with that idea.
        </p>
      </Container>

      <section className="border-y border-line bg-sand/40">
        <Container className="py-16">
          <h2 className="font-display text-3xl tracking-tight">
            How Google sees a Sabal site
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            This is a diagram of document shape, not a screenshot of anyone
            else&apos;s product. On the left, a crawler has nothing to index. On
            the right, every dish is a node in the page.
          </p>
          <div className="mt-8">
            <CrawlerDiagram />
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <h2 className="font-display text-3xl tracking-tight">
            What we generate for every restaurant
          </h2>
          <ul className="mt-8 max-w-3xl space-y-4 text-base leading-7 text-ink-soft">
            {generated.map((item) => (
              <li key={item} className="border-l-2 border-palm pl-4">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-y border-line bg-leaf/40">
        <Container className="py-16">
          <h2 className="font-display text-3xl tracking-tight">
            Quality gates, not page spam
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
            Search engines penalize thin auto-generated pages. Sabal will not
            create a dish page without enough real items behind it, and it will
            not publish placeholder content. If a string still looks like a
            draft, the site stays unpublished. Doorway-page tricks are not a
            feature we offer.
          </p>
        </Container>
      </section>

      <section id="checklist">
        <Container className="grid items-start gap-10 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl tracking-tight">
              The launch checklist
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-soft">
              Hard gates: the menu is readable, schema is valid, photos are
              present, and Google Business Profile is connected. Soft checks
              fill in around them. The badge does not say ready until the gates
              pass.
            </p>
          </div>
          <BrowserFrame
            url="app.sabal.ai/website"
            label="SEO launch checklist score panel from the Sabal admin"
          >
            <SeoScoreMock />
          </BrowserFrame>
        </Container>
      </section>

      <section className="border-y border-line">
        <Container className="py-16">
          <h2 className="font-display text-3xl tracking-tight">
            What SEO can&apos;t do
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
            Rankings take time and depend on reviews, photos, and your Google
            Business Profile. Sabal handles the website end and tells you
            exactly what is left.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <h2 className="font-display text-3xl tracking-tight">Questions we get</h2>
          <dl className="mt-8 max-w-3xl space-y-8">
            {restaurantSeoFaqs.map((item) => (
              <div key={item.question}>
                <dt className="font-display text-xl">{item.question}</dt>
                <dd className="mt-2 text-sm leading-6 text-ink-soft">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
