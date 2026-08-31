import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/schema";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sabal is built by a small team obsessed with restaurant SEO. We onboard every restaurant personally.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <Container className="py-16 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
          About
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight sm:text-6xl">
          Built by a small team obsessed with restaurant SEO.
        </h1>
        <div className="mt-8 max-w-2xl space-y-5 text-base leading-7 text-ink-soft">
          <p>
            Sabal exists because a restaurant&apos;s website is usually the
            last place a diner can actually order, and the last place Google
            can actually read a menu. We think that is backwards.
          </p>
          <p>
            We sell the unglamorous version: server-rendered pages, structured
            data that matches the screen, a kitchen display, and a checklist
            that will not lie about launch-ready. We onboard every restaurant
            personally. There is no self-serve signup.
          </p>
          <p>
            This page has no team photos because we have not asked anyone to
            pose for them. When we publish a case study it will be from a
            restaurant that agreed, with numbers they agreed to share.
          </p>
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
