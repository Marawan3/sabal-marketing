import { Fragment } from "react";
import { Container } from "./container";
import { SmartLink } from "./smart-link";
import {
  formatLegalDate,
  LEGAL_PLACEHOLDER,
  type LegalDoc,
} from "@/lib/legal";

/**
 * Renders a legal document. Plain typography, no hero, no marketing copy.
 * Until `final` is true the page shows the title and one line, nothing else.
 */

const LINK = /\[\[([^\]|]+)\|(\/[^\]]*)\]\]/g;

/** Turns `[[label|/href]]` into a link. Everything else is passed through verbatim. */
function Paragraph({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(LINK)) {
    const at = match.index ?? 0;
    if (at > cursor) parts.push(text.slice(cursor, at));
    parts.push(
      <SmartLink
        key={`${at}-${match[2]}`}
        href={match[2]}
        className="underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
      >
        {match[1]}
      </SmartLink>,
    );
    cursor = at + match[0].length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return (
    <p className="mt-4 text-body text-ink">
      {parts.map((part, index) => (
        <Fragment key={index}>{part}</Fragment>
      ))}
    </p>
  );
}

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <Container className="py-16 lg:py-24">
      <article className="max-w-[68ch]">
        <h1 className="text-h2">{doc.title}</h1>

        {doc.final ? (
          <>
            {doc.lastUpdated ? (
              <p className="mt-4 text-body text-ink/72">
                Last updated{" "}
                <time dateTime={doc.lastUpdated}>{formatLegalDate(doc.lastUpdated)}</time>
              </p>
            ) : null}

            {doc.sections.map((section) => (
              <section key={section.heading} className="mt-10">
                <h2 className="text-h3">{section.heading}</h2>
                {section.body.map((paragraph, index) => (
                  <Paragraph key={index} text={paragraph} />
                ))}
              </section>
            ))}

            {doc.contactEmail ? (
              <section className="mt-10">
                <h2 className="text-h3">Contact</h2>
                <p className="mt-4 text-body text-ink">
                  <a
                    href={`mailto:${doc.contactEmail}`}
                    className="underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
                  >
                    {doc.contactEmail}
                  </a>
                </p>
              </section>
            ) : null}
          </>
        ) : (
          <p className="mt-6 text-body text-ink">{LEGAL_PLACEHOLDER}</p>
        )}
      </article>
    </Container>
  );
}
