import { JsonLd } from "@/components/json-ld";
import { LegalMarkdown } from "@/components/legal-markdown";
import { LegalShell } from "@/components/legal-shell";
import { loadLegalDoc } from "@/lib/legal";
import { breadcrumbSchema } from "@/lib/schema";

export const DRAFT_BANNER =
  "DRAFT — not yet attorney-reviewed — do not publish";

export function LegalPage({
  file,
  path,
}: {
  file: string;
  path: string;
}) {
  const doc = loadLegalDoc(file);
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: doc.title, path },
        ])}
      />
      <LegalShell title={doc.title} dated={DRAFT_BANNER}>
        <p className="text-sm">
          Version {doc.version}. Placeholders in brackets are for counsel, not
          filled-in facts.
        </p>
        <LegalMarkdown source={doc.body} />
      </LegalShell>
    </>
  );
}
