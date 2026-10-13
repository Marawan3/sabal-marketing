import { CtaLink, TextLink } from "./cta-link";
import { Section } from "./section";
import { copy } from "@/lib/copy";
import { demoHref } from "@/lib/site";

/**
 * The last thing on a page: a full-width saffron band with ink text, the
 * headline, one button and the line under it (owner, 2026-10-13), then a
 * quiet link to /contact for owners who would rather write than call.
 * Not dark, because the kitchen band on the homepage is.
 */
export function FinalCta({ message = true }: { message?: boolean }) {
  return (
    <Section id="cta" tone="saffron">
      <div className="text-center">
        <h2 className="mx-auto max-w-[18ch] text-h2">{copy.finalCta.heading}</h2>
        <div className="mt-8">
          <CtaLink href={demoHref} onSaffron>
            {copy.cta.primary}
          </CtaLink>
        </div>
        <p className="mx-auto mt-4 max-w-[40ch] text-body">{copy.finalCta.after}</p>
        {message ? <TextLink href="/contact">{copy.finalCta.message}</TextLink> : null}
      </div>
    </Section>
  );
}
