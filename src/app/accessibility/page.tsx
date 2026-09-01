import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "How we approach accessibility on the Sabal marketing site and storefronts. Ongoing WCAG 2.1 AA effort, not a conformance claim.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return <LegalPage file="accessibility.md" path="/accessibility" />;
}
