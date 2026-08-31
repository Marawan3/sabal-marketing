import type { Metadata } from "next";
import { Container } from "@/components/container";
import { DemoForm } from "@/components/demo-form";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Request a Sabal walkthrough. Tell us the restaurant and the city — we reply in person, not with an automated funnel.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Book a demo", path: "/demo" },
        ])}
      />
      <Container className="grid items-start gap-12 py-16 sm:py-24 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
            Demo
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            Book a demo.
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-ink-soft">
            Name, restaurant, city, and a way to reach you. We will look at
            your current site — or the lack of one — before we get on a call.
          </p>
          <p className="mt-4 text-sm text-ink-soft">
            Prefer email?{" "}
            <a className="font-medium text-palm-deep underline" href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
            </a>
          </p>
        </div>
        <DemoForm />
      </Container>
    </>
  );
}
