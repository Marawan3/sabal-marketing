import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pricingFaqs } from "@/lib/seo-faqs";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Sabal’s fee is 5% of each online order. A $10 ticket is fifty cents. You keep the guest, the domain, and the merchant account.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
          faqSchema([...pricingFaqs]),
        ]}
      />
      <Container className="py-16 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
          Pricing
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight sm:text-6xl">
          Five percent of the order.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
          A ten-dollar ticket is fifty cents. You keep the rest — and the
          diner. No marketplace in the middle. No public monthly table,
          because the number is the number.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <PriceCard kicker="The fee" value="5%" detail="of each online order through your storefront" />
          <PriceCard kicker="A $10 order" value="50¢" detail="to Sabal. You keep the other $9.50 of that ticket." />
          <PriceCard kicker="The diner" value="Yours" detail="Pays you. Stays on your domain. Lives in your account." />
        </div>

        <div className="mt-14 max-w-2xl space-y-5 text-base leading-7 text-ink-soft">
          <p>
            The site Google can read, the ordering on your domain, the kitchen
            display, the tracking page, the SMS as the ticket moves — that is
            what five percent buys. We still onboard every restaurant
            personally. There is no self-serve signup.
          </p>
          <p>
            Guests pay the restaurant, not a Sabal wallet. You keep your own
            merchant account. Card processing runs through that account at
            the processor’s rates; that is not Sabal’s five percent. Delivery,
            when you offer it, is billed through our delivery-network partner
            — we will name that partner here once the relationship is public.
          </p>
          <p>
            We do not take a cut of walk-in, phone, or anything that never
            hits the storefront. Five percent is on the online order.
          </p>
        </div>
      </Container>
      <CtaBand
        title="See the number on your menu."
        body="A short call. Your ticket average, your city, what you already have live."
      />
    </>
  );
}

function PriceCard({
  kicker,
  value,
  detail,
}: {
  kicker: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper-2 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
        {kicker}
      </p>
      <p className="mt-3 font-display text-5xl tracking-tight text-palm">{value}</p>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{detail}</p>
    </div>
  );
}
