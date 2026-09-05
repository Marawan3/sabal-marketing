import { Container } from "./container";
import { copy } from "@/lib/copy";
import { site } from "@/lib/site";

export function LegalPlaceholder({ title }: { title: string }) {
  return (
    <Container className="py-24 lg:py-32">
      <h1 className="text-h2">{title}</h1>
      <p className="mt-6 max-w-[56ch] text-lead text-ink/80">{copy.legal.comingSoon}</p>
      <p className="mt-4 text-body text-ink/80">
        {copy.legal.questions}{" "}
        <a
          className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          href={`mailto:${site.contactEmail}`}
        >
          {site.contactEmail}
        </a>
      </p>
    </Container>
  );
}
