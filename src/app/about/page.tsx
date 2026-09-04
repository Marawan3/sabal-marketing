import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { PalmMark } from "@/components/palm-mark";
import { aboutCopy } from "@/lib/copy";
import { breadcrumbSchema } from "@/lib/schema";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "About",
  description: aboutCopy.lede,
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
      <Container className="relative py-16 sm:py-24">
        <PalmMark className="pointer-events-none absolute right-4 top-10 h-32 w-32 text-palm/15" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
          {aboutCopy.kicker}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight sm:text-6xl">
          {aboutCopy.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">{aboutCopy.lede}</p>
        <div className="mt-8 max-w-2xl space-y-5 text-base leading-7 text-ink-soft">
          {aboutCopy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
