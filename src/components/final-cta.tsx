import { CtaLink } from "./cta-link";
import { Section } from "./section";
import { SmartLink } from "./smart-link";
import { copy } from "@/lib/copy";
import { demoHref, site } from "@/lib/site";

/**
 * The last thing on a page: a full-width saffron band with ink text, one
 * line, one button. Not dark, because the kitchen band on the homepage is.
 */
export function FinalCta({ email = false }: { email?: boolean }) {
  return (
    <Section id="cta" tone="saffron">
      <div className="text-center">
        <h2 className="mx-auto max-w-[18ch] text-h2">{copy.finalCta.heading}</h2>
        <p className="mx-auto mt-4 max-w-[40ch] text-body">{copy.finalCta.body}</p>
        <div className="mt-8">
          <CtaLink href={demoHref} onSaffron>
            {copy.cta.primary}
          </CtaLink>
        </div>
        {email ? (
          <p className="mt-4 text-small">
            or email{" "}
            <SmartLink
              href={`mailto:${site.contactEmail}`}
              className="inline-flex min-h-11 items-center font-medium underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
            >
              {site.contactEmail}
            </SmartLink>
          </p>
        ) : null}
      </div>
    </Section>
  );
}
