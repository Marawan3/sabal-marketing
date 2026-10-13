import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Faq } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { PriceCard } from "@/components/price-card";
import { Section } from "@/components/section";
import { Ground } from "@/components/visuals/ground";
import { Receipt } from "@/components/visuals/receipt";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "WunTab is free for the restaurant: no monthly charge, no setup fee, no commission. Customers pay a 5% service fee, shown at checkout before they pay.",
  alternates: { canonical: "/pricing" },
};

/** The full terms (word for word as SERVICE_FEE_CLAUSE in /terms) and the longer answers live in the FAQ. */
const pricingFaq = [
  { question: copy.pricing.termsQuestion, answer: copy.pricing.body },
  ...copy.faq.items.filter((item) => /monthly fee|see the 5%|gets the money|What do I own/.test(item.question)),
  { question: copy.pricing.moreQuestion, answer: copy.pricing.more },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqSchema(pricingFaq)} />
      <section>
        <Container className="pt-12 pb-8 sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-14">
          <h1 className="max-w-[15ch] text-display">{copy.pricing.heading}</h1>
        </Container>
      </section>
      <Section>
        <PriceCard
          lines={copy.pricing.points}
          pricingLink={false}
          visual={
            <Ground>
              <Receipt />
            </Ground>
          }
        />
      </Section>
      <Section className="pb-8 sm:pb-10 lg:pb-14">
        <Faq heading="Pricing questions" items={pricingFaq} />
      </Section>
    </>
  );
}
