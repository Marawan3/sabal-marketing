import Link from "next/link";
import { Container } from "@/components/container";
import { copy } from "@/lib/copy";

export default function NotFound() {
  return (
    <Container className="py-24">
      <h1 className="text-4xl font-medium tracking-tight">{copy.notFound.heading}</h1>
      <p className="mt-3 max-w-md text-charcoal/80">{copy.notFound.body}</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-[12px] bg-brick px-5 py-2.5 text-sm font-medium text-cream"
      >
        {copy.notFound.cta}
      </Link>
    </Container>
  );
}
