import type { ReactNode } from "react";
import { CtaLink, TextLink } from "./cta-link";
import { copy } from "@/lib/copy";
import { demoHref } from "@/lib/site";

/**
 * The one pricing card. Same terms as SERVICE_FEE_CLAUSE in src/lib/legal.ts
 * (/terms), in short; the full clause is in the pricing FAQ. White, a 1px ink
 * border, the big $0, and a receipt beside it showing where the 5% goes.
 */
export function PriceCard({
  lines,
  pricingLink = true,
  visual,
}: {
  lines: readonly string[];
  pricingLink?: boolean;
  visual?: ReactNode;
}) {
  return (
    <div className="grid gap-8 rounded-[20px] border border-ink bg-paper p-5 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14">
      <div className={visual ? "lg:col-span-6" : "lg:col-span-12"}>
        <p className="text-display tabular-nums">{copy.pricing.stat}</p>
        <p className="mt-4 max-w-[20ch] text-h3">{copy.pricing.line}</p>
        <ul className="mt-6">
          {lines.map((line) => (
            <li key={line} className="border-t border-mist py-3 text-body text-ink-muted first:border-t-0 first:pt-0">
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
          {pricingLink ? <TextLink href="/pricing">See pricing</TextLink> : null}
        </div>
      </div>
      {/* Phones: the visual runs to the card's border, full width like every visual. */}
      {visual ? <div className="-mx-5 sm:mx-0 lg:col-span-6">{visual}</div> : null}
    </div>
  );
}
