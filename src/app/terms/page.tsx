import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/legal-placeholder";
import { copy } from "@/lib/copy";

export const dynamic = "error";

export const metadata: Metadata = {
  title: copy.legal.termsTitle,
  description: copy.legal.comingSoon,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPlaceholder title={copy.legal.termsTitle} />;
}
