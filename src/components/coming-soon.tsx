/**
 * "Coming soon" marker for products that are planned but not built today
 * (Marawan, 2026-09-20). Nothing unbuilt may look available: this appears
 * beside the name everywhere a product is listed, and as a banner on its page.
 */

export const COMING_SOON_LABEL = "Coming soon";

export function ComingSoonBadge({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`ml-2 inline-block shrink-0 whitespace-nowrap rounded-[4px] px-1.5 py-0.5 align-middle text-[0.75rem] font-medium ${
        dark ? "bg-paper/15 text-paper" : "bg-mist text-ink/80"
      }`}
    >
      {COMING_SOON_LABEL}
    </span>
  );
}

/** The banner at the top of a coming-soon product page. */
export function ComingSoonBanner({ name }: { name: string }) {
  return (
    <p
      role="note"
      className="mt-6 rounded-[8px] border border-ink/15 bg-ticket px-5 py-4 text-body"
    >
      <span className="font-medium">{COMING_SOON_LABEL}.</span> {name} is not available
      yet. This page describes what it will do when it ships. Everything else on WunTab
      works today.
    </p>
  );
}
