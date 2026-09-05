import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/legal-placeholder";
import { copy } from "@/lib/copy";

export const dynamic = "error";

export const metadata: Metadata = {
  title: copy.legal.privacyTitle,
  description: copy.legal.comingSoon,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPlaceholder title={copy.legal.privacyTitle} />;
}
