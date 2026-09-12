/**
 * Legal documents: hosting only.
 *
 * The wording in `sections` is supplied by Marawan and is pasted in VERBATIM.
 * Do not write, summarise, reword, reformat, or "improve" any legal text here.
 * The only formatting applied is structural: `heading` becomes an H2 and each
 * string in `body` becomes a paragraph.
 *
 * To publish a document when the final text arrives:
 *   1. Paste the text into `sections` exactly as delivered.
 *   2. Set `contactEmail` to the address he supplies (it must appear on both).
 *   3. Set `lastUpdated` to that day's date, ISO `YYYY-MM-DD`.
 *   4. Set `final: true`.
 * That removes the noindex and adds the page to the sitemap automatically.
 *
 * In a paragraph, `[[label|/href]]` renders `label` as a link to `/href`.
 * It exists so his text can point at the other document without any of his
 * words being changed.
 */

export const LEGAL_PLACEHOLDER = "This document is being finalized.";

export type LegalSection = {
  /** Rendered as an H2. */
  heading: string;
  /** One string per paragraph, verbatim. */
  body: string[];
};

export type LegalDoc = {
  slug: "privacy" | "terms";
  /** Rendered as the H1 and the browser title. */
  title: string;
  /** false = placeholder, noindex, out of the sitemap. */
  final: boolean;
  /** ISO `YYYY-MM-DD`, the day the final text was delivered. */
  lastUpdated?: string;
  /** Shown at the end of the document. Required on both once final. */
  contactEmail?: string;
  sections: LegalSection[];
};

export const legalDocs: Record<"privacy" | "terms", LegalDoc> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    final: false,
    sections: [],
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    final: false,
    sections: [],
  },
};

export const legalDocList = [legalDocs.privacy, legalDocs.terms];

/** Route paths for documents that are published and may be indexed. */
export function finalLegalRoutes() {
  return legalDocList.filter((doc) => doc.final).map((doc) => `/${doc.slug}`);
}

/** "11 September 2026" style date for the Last updated line. */
export function formatLegalDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
