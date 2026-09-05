import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaLink, TextLink } from "@/components/cta-link";
import { ProofTickets } from "@/components/proof-tickets";
import { Section } from "@/components/section";
import { copy } from "@/lib/copy";
import { menuCheckHref } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "See what Google sees",
  description: copy.menuCheck.sub,
  alternates: { canonical: "/menu-check" },
};

export default function MenuCheckPage() {
  const m = copy.menuCheck;
  return (
    <>
      <section>
        <Container className="pt-16 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
          <p className="text-small font-medium text-ink/60">Menu check</p>
          <h1 className="mt-4 max-w-[16ch] text-display">{m.headline}</h1>
          <p className="mt-8 max-w-[52ch] text-lead text-ink/80">{m.sub}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <CtaLink href={menuCheckHref}>{m.cta}</CtaLink>
            <TextLink href="/restaurant-seo">How WunTab builds for search</TextLink>
          </div>
        </Container>
      </section>
      <Section tone="ticket">
        <p className="max-w-[52ch] text-lead text-ink/80">{m.example}</p>
        <div className="mt-12">
          <ProofTickets left={m.left} right={m.right} />
        </div>
        <p className="mt-10 max-w-[62ch] text-small text-ink/72">{m.footnote}</p>
        <div className="mt-12 grid gap-2 border-t border-ink/10 pt-8 lg:grid-cols-12 lg:gap-12">
          <h2 className="text-h3 lg:col-span-5">{m.aiLine}</h2>
          <p className="max-w-[62ch] text-body text-ink/80 lg:col-span-7">{m.aiBody}</p>
        </div>
      </Section>
      <Section tone="ink">
        <div className="text-center">
          <h2 className="mx-auto max-w-[20ch] text-h2">{m.headline}</h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-lead text-paper/80">
            Send your website address and we will reply with what Google can read today.
          </p>
          <div className="mt-10">
            <CtaLink href={menuCheckHref}>{m.cta}</CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}
