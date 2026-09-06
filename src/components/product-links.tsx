import { SmartLink } from "./smart-link";
import { bySlug } from "@/lib/catalog";

/**
 * A list of products with one-line descriptions. Hairline rows, not cards.
 * Used for "Sell directly", "Turn searches into orders", and related links.
 */
export function ProductLinks({
  slugs,
  columns = 2,
}: {
  slugs: readonly string[];
  columns?: 1 | 2 | 3;
}) {
  const cols =
    columns === 3 ? "md:grid-cols-3" : columns === 2 ? "md:grid-cols-2" : "";
  return (
    <ul className={`grid gap-x-12 ${cols}`}>
      {slugs.map((slug) => {
        const p = bySlug[slug];
        if (!p) return null;
        return (
          <li key={slug} className="border-t border-mist py-5">
            <SmartLink href={`/${p.slug}`} className="group block">
              <span className="text-h3 underline decoration-transparent underline-offset-4 transition-colors duration-150 group-hover:decoration-ink">
                {p.name}
              </span>
              <span className="mt-1 block max-w-[48ch] text-body text-ink/72">{p.headline}</span>
            </SmartLink>
          </li>
        );
      })}
    </ul>
  );
}
