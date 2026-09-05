import { Container } from "./container";
import { copy } from "@/lib/copy";
import { site } from "@/lib/site";

export function LegalPlaceholder({ title }: { title: string }) {
  return (
    <Container className="py-20">
      <h1 className="text-4xl font-medium tracking-tight">{title}</h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-charcoal/80">
        {copy.legal.comingSoon}
      </p>
      <p className="mt-4 text-sm text-charcoal/80">
        {copy.legal.questions}{" "}
        <a className="font-medium text-brick hover:underline" href={`mailto:${site.contactEmail}`}>
          {site.contactEmail}
        </a>
        .
      </p>
    </Container>
  );
}
