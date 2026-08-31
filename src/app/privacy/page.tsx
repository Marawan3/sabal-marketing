import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LegalShell } from "@/components/legal-shell";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Draft privacy notice for the Sabal marketing site. Flagged for legal review.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ])}
      />
      <LegalShell title="Privacy" dated="Draft — flagged for legal review">
        <p>
          This page describes how the Sabal marketing site handles information.
          It is a draft. It is not a substitute for counsel.
        </p>
        <h2>What we collect</h2>
        <p>
          If you submit the demo form, we receive the fields you type: name,
          restaurant, city, email, phone, and message. That request is emailed
          to us (and, if configured, posted to an internal webhook). We do not
          keep a leads database on this site in this version.
        </p>
        <h2>What we do not collect here</h2>
        <p>
          This marketing site has no login, no cookies for advertising, and no
          access to restaurant orders, menus, or payment data. Those live in
          the Sabal application at a separate origin.
        </p>
        <h2>Analytics</h2>
        <p>
          If a privacy-respecting analytics script is enabled, it may record
          page views. It is off unless an environment variable turns it on.
        </p>
        <h2>Contact</h2>
        <p>
          Questions:{" "}
          <a className="underline" href={`mailto:${site.contactEmail}`}>
            {site.contactEmail}
          </a>
          .
        </p>
      </LegalShell>
    </>
  );
}
