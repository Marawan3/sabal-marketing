import type { ReactNode } from "react";
import { SmartLink } from "./smart-link";
import { bySlug, productHref } from "@/lib/catalog";
import { copy } from "@/lib/copy";

/** A still and how it sits in the card's 160px box: drawn at `width`, then scaled by `scale` from its top centre. */
export type ProductStill = { node: ReactNode; width: number; scale: number };

/**
 * The homepage's products on phones (below 768px, owner 2026-10-19): a row of
 * cards you swipe, each a still of the product's own visual, its name, its
 * one line and Learn more. The next card peeks 24px past the edge; cards snap
 * to the gutter; no scrollbar and no script. The still is static (Visual's
 * `still`), so nothing here moves with or without reduced motion. Each card
 * is one link.
 */
export function ProductCards({ slugs, stills, className = "" }: { slugs: readonly string[]; stills: Record<string, ProductStill>; className?: string }) {
  return (
    <ul
      className={`-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden ${className}`}
      data-product-cards
    >
      {slugs.map((slug) => {
        const href = productHref(slug);
        const still = stills[slug];
        if (!href) return null;
        return (
          // The gutter less 12px gap and 24px peek: 16 + 20 = 36 on phones, 32 + 4 from 640px.
          <li key={slug} className="w-[calc(100%-20px)] shrink-0 snap-start sm:w-[calc(100%-4px)]">
            <SmartLink href={href} className="group block rounded-[20px]" data-product-card>
              <div className="relative h-40 overflow-hidden rounded-[20px] bg-mist">
                {still ? (
                  <div
                    className="absolute top-4 left-1/2 origin-top -translate-x-1/2"
                    style={{ width: still.width, scale: String(still.scale) }}
                  >
                    {still.node}
                  </div>
                ) : null}
              </div>
              <h3 className="mt-4 text-h3">{bySlug[slug].name}</h3>
              <p className="mt-1 text-body text-ink-muted">{bySlug[slug].headline}</p>
              {/* The whole card is the tap target, so this line needs no 44px row of its own. */}
              <span className="mt-2 inline-flex items-center gap-1.5 font-medium">
                <span className="underline decoration-ink-muted underline-offset-4 transition-colors duration-150 group-hover:decoration-ink">
                  {copy.products.more}
                </span>
                <span aria-hidden>→</span>
              </span>
            </SmartLink>
          </li>
        );
      })}
    </ul>
  );
}
