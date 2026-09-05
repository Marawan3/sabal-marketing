import { Container } from "@/components/container";
import { CtaLink } from "@/components/cta-link";
import { copy } from "@/lib/copy";

export default function NotFound() {
  return (
    <Container className="py-24 lg:py-32">
      <h1 className="text-h2">{copy.notFound.heading}</h1>
      <p className="mt-4 max-w-[48ch] text-lead text-ink/80">{copy.notFound.body}</p>
      <CtaLink href="/" className="mt-8">
        {copy.notFound.cta}
      </CtaLink>
    </Container>
  );
}
