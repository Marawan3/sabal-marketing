import { SmartLink } from "./smart-link";
import { bySlug } from "@/lib/catalog";

/**
 * A list of products with the same one-line blurb the mega-menu uses.
 * Hairline rows, not cards. Used for the pillar sections and "Works with".
 */
export function ProductLinks({
  slugs,
  columns = 2,
  dark = false,
}: {
  slugs: readonly string[];
  columns?: 1 | 2 | 3;
  dark?: boolean;
}) {
  const cols =
    columns === 3 ? "md:grid-cols-3" : columns === 2 ? "md:grid-cols-2" : "";
  const rule = dark ? "border-paper/15" : "border-mist";
  const blurb = dark ? "text-paper/75" : "text-ink/72";
  const hover = dark ? "group-hover:decoration-paper" : "group-hover:decoration-ink";
  return (
    <ul className={`grid gap-x-12 ${cols}`}>
      {slugs.map((slug) => {
        const p = bySlug[slug];
        if (!p) return null;
        return (
          <li key={slug} className={`border-t ${rule} py-5`}>
            <SmartLink href={`/${p.slug}`} className="group block">
              <span
                className={`text-h3 underline decoration-transparent underline-offset-4 transition-colors duration-150 ${hover}`}
              >
                {p.name}
              </span>
              <span className={`mt-1 block max-w-[40ch] text-body ${blurb}`}>{p.blurb}</span>
            </SmartLink>
          </li>
        );
      })}
    </ul>
  );
}
