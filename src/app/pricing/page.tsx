import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaLink } from "@/components/cta-link";
import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { demoHref } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Pricing",
  description: copy.pricing.body,
  alternates: { canonical: "/pricing" },
};

const pricingFaq = copy.faq.items.filter((item) =>
  /monthly fee|see the 5%|gets the money|own my website/.test(item.question),
);

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqSchema(pricingFaq)} />
      <section>
        <Container className="pt-16 pb-12 sm:pt-24 lg:pt-28">
          <h1 className="max-w-[16ch] text-display">{copy.pricing.heading}</h1>
          <p className="mt-8 max-w-[48ch] text-lead text-ink/80">{copy.pricing.line}</p>
        </Container>
      </section>
      <Section tone="ticket">
        <div className="max-w-[640px] ticket-shadow">
          <div className="ticket px-6 pt-8 pb-12 sm:px-10 sm:pt-10 sm:pb-14">
            <p className="text-stat">{copy.pricing.stat}</p>
            <p className="mt-4 text-lead font-medium">{copy.pricing.line}</p>
            <p className="mt-4 max-w-[52ch] text-body text-ink/80">{copy.pricing.body}</p>
            <p className="mt-4 max-w-[52ch] text-small text-ink/72">{copy.pricing.more}</p>
            <CtaLink href={demoHref} className="mt-8">
              {copy.cta.talk}
            </CtaLink>
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <h2 className="text-h2 lg:col-span-5">Pricing questions</h2>
          <div className="faq divide-y divide-mist border-y border-mist lg:col-span-7">
            {pricingFaq.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer items-center gap-4 py-5 text-h3">
                  {item.question}
                </summary>
                <p className="max-w-[56ch] pb-6 text-body text-ink/80">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
