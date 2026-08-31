import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { LegalShell } from "@/components/legal-shell";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Terms",
  description: "Draft terms for the Sabal marketing site. Flagged for legal review.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ])}
      />
      <LegalShell title="Terms" dated="Draft — flagged for legal review">
        <p>
          These terms cover the public marketing website only. Restaurant
          software is contracted separately. This draft needs legal review
          before it is treated as binding.
        </p>
        <h2>The site</h2>
        <p>
          Pages describe what the software does today. They are not a promise
          of search rankings, order volume, or a launch date we have not
          agreed in writing.
        </p>
        <h2>Demos</h2>
        <p>
          Sending the demo form is a request to talk. It does not create a
          customer relationship, a license, or an obligation to store your
          information beyond answering you.
        </p>
        <h2>Your content</h2>
        <p>
          Do not submit secrets, card numbers, or other people&apos;s personal
          data through the demo form.
        </p>
      </LegalShell>
    </>
  );
}
