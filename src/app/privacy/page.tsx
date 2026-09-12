import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { LEGAL_PLACEHOLDER, legalDocs } from "@/lib/legal";

export const dynamic = "error";

const doc = legalDocs.privacy;

export const metadata: Metadata = {
  title: doc.title,
  description: doc.final ? doc.title : LEGAL_PLACEHOLDER,
  alternates: { canonical: "/privacy" },
  // Forced noindex until the final text is published; then the site-wide rule applies.
  ...(doc.final ? {} : { robots: { index: false, follow: false } }),
};

export default function PrivacyPage() {
  return <LegalDocument doc={doc} />;
}
