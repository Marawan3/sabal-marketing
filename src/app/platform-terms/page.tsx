import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Platform Terms",
  description:
    "Draft acceptable-use terms for Sabal restaurant dashboard accounts. The MSA controls if they conflict. Not yet attorney-reviewed.",
  alternates: { canonical: "/platform-terms" },
};

export default function PlatformTermsPage() {
  return <LegalPage file="platform-terms.md" path="/platform-terms" />;
}
