import type { Metadata } from "next";
import { Container } from "@/components/container";
import { TextLink } from "@/components/cta-link";
import { copy } from "@/lib/copy";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Articles",
  description: copy.blog.body,
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <section>
      <Container className="pt-16 pb-24 sm:pt-24 lg:pt-28 lg:pb-32">
        <h1 className="max-w-[16ch] text-display">{copy.blog.headline}</h1>
        <p className="mt-8 max-w-[48ch] text-lead text-ink/80">{copy.blog.body}</p>
        <p className="mt-8">
          <TextLink href="/menu-check">In the meantime, see what Google sees on your menu</TextLink>
        </p>
      </Container>
    </section>
  );
}
