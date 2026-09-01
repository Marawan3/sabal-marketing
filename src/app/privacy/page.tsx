import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Draft privacy notice for the Sabal marketing site, demo form, and ROS staff accounts. Not yet attorney-reviewed.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage file="sabal-privacy.md" path="/privacy" />;
}
