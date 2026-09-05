import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { CtaLink, TextLink } from "@/components/cta-link";
import { ProductLinks } from "@/components/product-links";
import { Section, SectionHead } from "@/components/section";
import { solutionBySlug, solutions } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { demoHref } from "@/lib/site";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutionBySlug[slug];
  if (!solution) return {};
  return {
    title: `WunTab for ${solution.name}`,
    description: solution.sub,
    alternates: { canonical: `/solutions/${solution.slug}` },
  };
}

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

export default async function Page({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const solution = solutionBySlug[slug];
  if (!solution) notFound();
  return (
    <>
      <section>
        <Container className="pt-16 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
          <p className="text-small font-medium text-ink/60">WunTab for {solution.name}</p>
          <h1 className="mt-4 max-w-[16ch] text-display">{solution.headline}</h1>
          <p className="mt-8 max-w-[48ch] text-lead text-ink/80">{solution.sub}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
            <TextLink href="/pricing">See pricing</TextLink>
          </div>
        </Container>
      </section>
      <Section tone="ticket">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <h2 className="text-h2 lg:col-span-5">What WunTab does for you</h2>
          <ul className="space-y-4 lg:col-span-7">
            {solution.points.map((point) => (
              <li key={point} className="flex gap-3 text-body">
                <Check />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <Section>
        <SectionHead heading="The products you'll use" />
        <div className="mt-12">
          <ProductLinks slugs={solution.products} columns={2} />
        </div>
      </Section>
      <Section tone="ink">
        <div className="text-center">
          <h2 className="mx-auto max-w-[20ch] text-h2">{copy.finalCta.heading}</h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-lead text-paper/80">{copy.finalCta.body}</p>
          <div className="mt-10">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
          </div>
        </div>
      </Section>
    </>
  );
}
