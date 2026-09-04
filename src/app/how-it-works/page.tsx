import type { Metadata } from "next";
import Link from "next/link";
import { BrowserFrame } from "@/components/browser-frame";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { CartCheckoutMock, ItemSheetMock } from "@/components/mocks/item-cart-mock";
import { KdsMock } from "@/components/mocks/kds-mock";
import { SeoScoreMock } from "@/components/mocks/seo-score-mock";
import { StorefrontMenuMock } from "@/components/mocks/storefront-menu-mock";
import { breadcrumbSchema } from "@/lib/schema";
import { demoKitchen } from "@/lib/demo-kitchen";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "How Sabal Works",
  description:
    "From menu pages Google can read to pickup checkout and a kitchen display: exactly what Sabal sets up, and why it is built for search.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  {
    n: "01",
    title: "We build your site around your menu.",
    body: "Your menu becomes real, readable web pages — every category, dish, and price in HTML that Google indexes, plus dedicated pages for your signature dishes and the neighborhoods you serve.",
    href: "/restaurant-seo",
    link: "Restaurant SEO",
    frame: "demokitchen.sabalsites.com/menu",
    label: "Sabal Demo Kitchen menu page showing dishes as HTML",
    visual: <StorefrontMenuMock />,
  },
  {
    n: "02",
    title: "Diners order from you, not a marketplace.",
    body: "Pickup and delivery checkout on your own domain. Five percent of the ticket. Your customers, your merchant account.",
    href: "/online-ordering",
    link: "Online ordering",
    frame: "demokitchen.sabalsites.com/menu/citrus-herb-chicken",
    label: "Item sheet and cart for Sabal Demo Kitchen citrus herb chicken",
    visual: (
      <div>
        <ItemSheetMock />
        <div className="border-t border-zinc-100">
          <CartCheckoutMock />
        </div>
      </div>
    ),
  },
  {
    n: "03",
    title: "Orders flow straight to your kitchen.",
    body: "Kitchen display, order tracking for the diner, SMS confirmations. The ticket the cook sees is the ticket the guest follows.",
    href: "/online-ordering#kitchen",
    link: "Kitchen display",
    frame: "app.sabal.ai/kds",
    label: "Kitchen display with three tickets for Sabal Demo Kitchen",
    visual: <KdsMock />,
  },
  {
    n: "04",
    title: "You see exactly what's working.",
    body: "The SEO launch checklist scores every location — menu readability, structured data, photos, Google Business Profile — and will not call you launch-ready until it is all green.",
    href: "/restaurant-seo#checklist",
    link: "Launch checklist",
    frame: "app.sabal.ai/website",
    label: "SEO launch checklist score panel for Sabal Demo Kitchen",
    visual: <SeoScoreMock />,
  },
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "How it works", path: "/how-it-works" },
        ])}
      />
      <Container className="py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
          The setup
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight sm:text-6xl">
          How Sabal works.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
          From menu to first order, here is exactly what we set up and why it
          wins on Google.
        </p>
        <Link
          href="/demo"
          className="mt-8 inline-flex rounded-full bg-palm-deep px-6 py-3 text-sm font-semibold text-on-brand hover:bg-palm"
        >
          Book a demo
        </Link>
      </Container>

      <div className="border-t border-line">
        {steps.map((step, index) => (
          <section
            key={step.n}
            id={step.n === "03" ? "kitchen" : undefined}
            className="border-b border-line"
          >
            <Container
              className={`grid items-center gap-10 py-16 lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:[&>figure]:order-first" : ""
              }`}
            >
              <div>
                <p className="font-display text-6xl text-palm/25 sm:text-7xl">{step.n}</p>
                <h2 className="mt-4 font-display text-3xl tracking-tight">{step.title}</h2>
                <p className="mt-4 max-w-md text-base leading-7 text-ink-soft">{step.body}</p>
                <Link
                  href={step.href}
                  className="mt-6 inline-block text-sm font-semibold text-palm-deep hover:underline"
                >
                  Learn more: {step.link}
                </Link>
              </div>
              <BrowserFrame url={step.frame} label={step.label}>
                {step.visual}
              </BrowserFrame>
            </Container>
          </section>
        ))}
      </div>
      <p className="sr-only">{demoKitchen.name} is the internal product demo used in these screens.</p>
      <CtaBand />
    </>
  );
}
