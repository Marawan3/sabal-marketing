import { CtaLink } from "./cta-link";
import { Panel, Section } from "./section";
import { SmartLink } from "./smart-link";
import { copy } from "@/lib/copy";
import { demoHref, site } from "@/lib/site";

/** The last thing on a page: one dark rounded panel, one line, one button. */
export function FinalCta({ email = false }: { email?: boolean }) {
  return (
    <Section id="cta" className="pb-8 sm:pb-10 lg:pb-14">
      <Panel tone="ink" className="px-6 py-14 text-center sm:px-10 lg:py-24">
        <h2 className="mx-auto max-w-[18ch] text-h2">{copy.finalCta.heading}</h2>
        <p className="mx-auto mt-4 max-w-[40ch] text-body text-paper/80">{copy.finalCta.body}</p>
        <div className="mt-8">
          <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
        </div>
        {email ? (
          <p className="mt-4 text-small text-paper/70">
            or email{" "}
            <SmartLink
              href={`mailto:${site.contactEmail}`}
              className="inline-flex min-h-11 items-center font-medium text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
            >
              {site.contactEmail}
            </SmartLink>
          </p>
        ) : null}
      </Panel>
    </Section>
  );
}
