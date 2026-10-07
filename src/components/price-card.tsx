import { CtaLink, TextLink } from "./cta-link";
import { Panel } from "./section";
import { copy } from "@/lib/copy";
import { demoHref } from "@/lib/site";

/**
 * The one pricing card. Same terms as SERVICE_FEE_CLAUSE in src/lib/legal.ts
 * (/terms): the homepage shows the short points, /pricing the full text.
 */
export function PriceCard({ lines, pricingLink = true }: { lines: readonly string[]; pricingLink?: boolean }) {
  return (
    <Panel className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
      <div className="lg:col-span-5">
        <p className="text-display tabular-nums">{copy.pricing.stat}</p>
        <p className="mt-4 max-w-[20ch] text-h3">{copy.pricing.line}</p>
      </div>
      <div className="lg:col-span-7">
        <ul>
          {lines.map((line) => (
            <li key={line} className="border-t border-ink/10 py-3 text-body text-ink/85 first:border-t-0 first:pt-0">
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
          {pricingLink ? <TextLink href="/pricing">See pricing</TextLink> : null}
        </div>
      </div>
    </Panel>
  );
}
