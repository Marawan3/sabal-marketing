import { CtaLink } from "./cta-link";
import { Section } from "./section";
import { copy } from "@/lib/copy";
import { demoHref } from "@/lib/site";

/**
 * "We're new. That works in your favor." The homepage's founding-restaurants
 * section, in the slot and shape the customer row will take (a headline and
 * short items between rules), with one Get Started. The fourth item, "Your
 * customers, your data.", came from the hero's trust line (owner, 2026-10-20). The customer row
 * (customer-stories.tsx) stays built for when there are real customers.
 */
export function Founding() {
  return (
    <Section id="founding">
      <h2 className="max-w-[18ch] text-h2">{copy.founding.heading}</h2>
      <ul className="mt-6 grid sm:grid-cols-2 sm:gap-x-6 lg:mt-10 lg:grid-cols-4">
        {copy.founding.points.map((point) => (
          <li key={point} className="border-t border-rule py-3 text-body font-medium sm:pt-4">
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-4 lg:mt-6">
        <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
      </div>
    </Section>
  );
}
