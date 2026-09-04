import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { pricingCopy } from "@/lib/copy";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Pricing",
  description: pricingCopy.body,
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
          faqSchema([...pricingCopy.faqs]),
        ]}
      />
      <Container className="py-16 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
          {pricingCopy.kicker}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight sm:text-6xl">
          {pricingCopy.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">{pricingCopy.body}</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <PriceCard
            kicker={pricingCopy.monthlyLabel}
            value={pricingCopy.monthlyValue}
            detail={pricingCopy.monthlyDetail}
          />
          <PriceCard
            kicker={pricingCopy.processingLabel}
            value={pricingCopy.processingValue}
            detail={pricingCopy.processingDetail}
          />
          <PriceCard
            kicker={pricingCopy.commissionLabel}
            value={pricingCopy.commissionValue}
            detail={pricingCopy.commissionDetail}
          />
        </div>

        <h2 className="mt-16 font-display text-3xl tracking-tight">{pricingCopy.tableTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">{pricingCopy.tableNote}</p>
        <div className="mt-8 overflow-x-auto rounded-3xl border border-line bg-paper-2">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">{pricingCopy.tableTitle}</caption>
            <thead className="border-b border-line bg-sand/60">
              <tr>
                {pricingCopy.tableHeaders.map((header) => (
                  <th key={header || "blank"} scope="col" className="px-5 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricingCopy.tableRows.map((row) => (
                <tr key={row[0]} className="border-t border-line">
                  {row.map((cell, index) => (
                    <td
                      key={`${row[0]}-${index}`}
                      className={`px-5 py-3 leading-6 ${
                        index === 0 ? "font-medium text-ink" : "text-ink-soft"
                      } ${index === 2 ? "text-palm-deep" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-16 font-display text-3xl tracking-tight">Questions</h2>
        <dl className="mt-8 max-w-3xl space-y-8">
          {pricingCopy.faqs.map((item) => (
            <div key={item.question}>
              <dt className="font-display text-xl">{item.question}</dt>
              <dd className="mt-2 text-sm leading-6 text-ink-soft">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Container>
      <CtaBand title={pricingCopy.ctaTitle} body={pricingCopy.ctaBody} />
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
    <div className="rounded-3xl border border-line bg-paper-2 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
        {kicker}
      </p>
      <p className="mt-3 font-display text-4xl tracking-tight text-palm-deep">{value}</p>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{detail}</p>
    </div>
  );
}
