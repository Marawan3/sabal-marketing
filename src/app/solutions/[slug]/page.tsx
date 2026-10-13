import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SolutionPage } from "@/components/solution-page";
import { solutionBySlug, solutionHref, solutions } from "@/lib/catalog";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutionBySlug[slug];
  if (!solution) return {};
  return {
    title: `${solution.name}: ${solution.headline}`,
    description: solution.sub,
    alternates: { canonical: solutionHref(slug) },
  };
}

export default async function Page({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const solution = solutionBySlug[slug];
  if (!solution) notFound();
  return <SolutionPage solution={solution} />;
}
