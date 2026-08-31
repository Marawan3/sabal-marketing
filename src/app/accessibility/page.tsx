import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { LegalShell } from "@/components/legal-shell";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "How we approach accessibility on the Sabal marketing site. Draft, flagged for review.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Accessibility", path: "/accessibility" },
        ])}
      />
      <LegalShell title="Accessibility" dated="Draft — flagged for review">
        <p>
          This marketing site should be usable with a keyboard, a screen
          reader, and a zoomed browser. We aim for WCAG 2.2 AA on these pages.
          We have not published a formal VPAT.
        </p>
        <h2>What we built in</h2>
        <p>
          One H1 per page, skip-to-content, text alternatives on product
          imagery, and form labels. If something is in the way, that is a
          defect — tell us.
        </p>
        <h2>Contact</h2>
        <p>
          Accessibility notes:{" "}
          <a className="underline" href={`mailto:${site.contactEmail}`}>
            {site.contactEmail}
          </a>
          .
        </p>
      </LegalShell>
    </>
  );
}
