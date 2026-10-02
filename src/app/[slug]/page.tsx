import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product-page";
import { builtProducts, bySlug, productHref } from "@/lib/catalog";

export const dynamic = "error";
export const dynamicParams = false;

/** Only the phase-1 product pages are built; every other slug is a 404. */
export function generateStaticParams() {
  return builtProducts.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = productHref(slug) ? bySlug[slug] : undefined;
  if (!product) return {};
  return {
    title: `${product.name}: ${product.headline}`,
    description: product.sub,
    alternates: { canonical: `/${product.slug}` },
  };
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const product = productHref(slug) ? bySlug[slug] : undefined;
  if (!product) notFound();
  return <ProductPage product={product} />;
}
