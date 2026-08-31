import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/schema";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing, no order commissions. We set a number with you on a demo — there is no public rate card yet.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <Container className="py-16 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
          Pricing
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight sm:text-6xl">
          Simple pricing, no order commissions.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
          Talk to us. There is no public table yet because we still onboard
          restaurant by restaurant. When a rate card exists, it will live on
          this page. Until then, the rule is the one we can stand behind: we
          do not take a cut of the ticket.
        </p>
        <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft">
          You keep your merchant account. Guests pay you. Delivery, when you
          offer it, is billed through our delivery-network partner — we will
          name that partner here once the relationship is public.
        </p>
      </Container>
      <CtaBand
        title="Get a number that matches your locations."
        body="A short call. Your menu, your city, what you already have live."
      />
    </>
  );
}
