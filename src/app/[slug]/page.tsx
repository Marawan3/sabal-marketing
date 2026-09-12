import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product-page";
import { bySlug, products } from "@/lib/catalog";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = bySlug[slug];
  if (!product) return {};
  return {
    title: `${product.name}: ${product.headline}`,
    description: product.sub,
    alternates: { canonical: `/${product.slug}` },
  };
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const product = bySlug[slug];
  if (!product) notFound();
  return <ProductPage product={product} />;
}
