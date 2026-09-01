import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Website Terms",
  description:
    "Draft terms for the Sabal marketing website. Restaurant software is contracted separately. Not yet attorney-reviewed.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage file="sabal-website-terms.md" path="/terms" />;
}
