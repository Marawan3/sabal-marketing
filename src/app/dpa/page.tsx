import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Data Processing Agreement",
  description:
    "Draft DPA: the restaurant is controller of diner data; Sabal is processor. Not yet attorney-reviewed.",
  alternates: { canonical: "/dpa" },
};

export default function DpaPage() {
  return <LegalPage file="dpa.md" path="/dpa" />;
}
