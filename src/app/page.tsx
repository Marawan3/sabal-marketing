import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaLink, TextLink } from "@/components/cta-link";
import { JsonLd } from "@/components/json-ld";
import { ProofTickets } from "@/components/proof-tickets";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { demoHref, site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: { absolute: `Wuntab: ${copy.hero.headline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

function Check() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-1 shrink-0"
    >
      <path d="M3.5 9.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(copy.faq.items)} />

      <section id="top" className="scroll-mt-20">
        <Container className="pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24">
          <h1 className="max-w-[16ch] text-display">{copy.hero.headline}</h1>
          <p className="mt-8 max-w-[48ch] text-lead text-ink/80">{copy.hero.sub}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <CtaLink href={demoHref}>{copy.hero.cta}</CtaLink>
            <TextLink href="#proof">{copy.hero.secondary}</TextLink>
          </div>
        </Container>
      </section>

      <section id="proof" className="scroll-mt-20 border-t border-mist">
        <Container className="py-20 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <h2 className="text-h2 lg:col-span-5">{copy.proof.heading}</h2>
            <p className="max-w-[48ch] text-lead text-ink/80 lg:col-span-7">
              {copy.proof.sub}
            </p>
          </div>
          <div className="mt-14">
            <ProofTickets left={copy.proof.left} right={copy.proof.right} />
          </div>
          <p className="mt-10 max-w-[62ch] text-small text-ink/72">{copy.proof.footnote}</p>
          <div className="mt-12 grid gap-2 border-t border-mist pt-8 lg:grid-cols-12 lg:gap-12">
            <h3 className="text-h3 lg:col-span-5">{copy.proof.aiLine}</h3>
            <p className="max-w-[62ch] text-body text-ink/80 lg:col-span-7">
              {copy.proof.aiBody}
            </p>
          </div>
        </Container>
      </section>

      <section id="problem" className="scroll-mt-20 border-t border-mist">
        <Container className="py-20 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <h2 className="text-h2 lg:col-span-5">{copy.problem.heading}</h2>
            <div className="max-w-[56ch] space-y-6 text-lead text-ink/80 lg:col-span-7">
              {copy.problem.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-t border-mist">
        <Container className="py-20 lg:py-32">
          <h2 className="text-h2">{copy.how.heading}</h2>
          <ol className="mt-14 divide-y divide-mist border-y border-mist">
            {copy.how.steps.map((step, index) => (
              <li
                key={step.title}
                className="grid gap-4 py-10 lg:grid-cols-12 lg:gap-12"
              >
                <p className="text-h3 tabular-nums text-ink/40 lg:col-span-1">
                  {index + 1}
                </p>
                <h3 className="text-h3 lg:col-span-4">{step.title}</h3>
                <p className="max-w-[56ch] text-body text-ink/80 lg:col-span-7">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="features" className="scroll-mt-20 border-t border-mist">
        <Container className="py-20 lg:py-32">
          <h2 className="text-h2">{copy.features.heading}</h2>
          <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
            {copy.features.groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-h3">{group.title}</h3>
                <ul className="mt-6 space-y-4">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-body">
                      <Check />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="pricing" className="scroll-mt-20 border-t border-mist">
        <Container className="py-20 lg:py-32">
          <h2 className="text-h2">{copy.pricing.heading}</h2>
          <div className="mt-14 max-w-[640px] ticket-shadow">
            <div className="ticket px-6 pt-8 pb-12 sm:px-10 sm:pt-10 sm:pb-14">
              <p className="text-stat">{copy.pricing.stat}</p>
              <p className="mt-4 text-lead font-medium">{copy.pricing.line}</p>
              <p className="mt-4 max-w-[52ch] text-body text-ink/80">{copy.pricing.body}</p>
              <CtaLink href={demoHref} className="mt-8">
                {copy.pricing.cta}
              </CtaLink>
            </div>
          </div>
        </Container>
      </section>

      <section id="promise" className="scroll-mt-20 border-t border-mist">
        <Container className="py-20 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <h2 className="text-h2 lg:col-span-5">{copy.promise.heading}</h2>
            <p className="max-w-[56ch] text-lead text-ink/80 lg:col-span-7">
              {copy.promise.body}
            </p>
          </div>
        </Container>
      </section>

      <section id="faq" className="scroll-mt-20 border-t border-mist">
        <Container className="py-20 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <h2 className="text-h2 lg:col-span-5">{copy.faq.heading}</h2>
            <div className="faq divide-y divide-mist border-y border-mist lg:col-span-7">
              {copy.faq.items.map((item) => (
                <details key={item.question} className="group">
                  <summary className="flex cursor-pointer items-center gap-4 py-5 text-h3">
                    {item.question}
                  </summary>
                  <p className="max-w-[56ch] pb-6 text-body text-ink/80">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="cta" className="on-dark scroll-mt-20 bg-ink text-paper">
        <Container className="py-24 text-center lg:py-32">
          <h2 className="mx-auto max-w-[20ch] text-h2">{copy.finalCta.heading}</h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-lead text-paper/80">
            {copy.finalCta.body}
          </p>
          <div className="mt-10">
            <CtaLink href={demoHref}>{copy.finalCta.cta}</CtaLink>
          </div>
          <p className="mt-6 text-small text-paper/70">
            or email{" "}
            <a
              href={`mailto:${site.contactEmail}`}
              className="font-medium text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
            >
              {site.contactEmail}
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
