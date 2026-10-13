import type { ReactNode } from "react";
import { Container } from "./container";

const tones = {
  paper: "bg-paper",
  navy: "on-dark bg-navy text-paper",
  saffron: "bg-saffron text-ink",
} as const;

/**
 * Vertical rhythm: 64px between sections on phones, 80px from 640px, 112px
 * from 1024px. White sections carry half of it on each side, so two in a row
 * add up to one gap; a toned band carries the whole gap inside itself.
 */
export function Section({
  id,
  tone = "paper",
  children,
  className = "",
}: {
  id?: string;
  tone?: keyof typeof tones;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-20 ${tones[tone]} ${className}`}>
      <Container className={tone === "paper" ? "py-8 sm:py-10 lg:py-14" : "py-16 sm:py-20 lg:py-28"}>
        {children}
      </Container>
    </section>
  );
}

/** A section opener: the heading, and at most one short line under it. Left-aligned. */
export function SectionHead({
  heading,
  sub,
  dark = false,
  className = "",
}: {
  heading: string;
  sub?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="max-w-[18ch] text-h2">{heading}</h2>
      {sub ? (
        <p className={`mt-4 max-w-[44ch] text-body ${dark ? "text-paper/80" : "text-ink/85"}`}>{sub}</p>
      ) : null}
    </div>
  );
}

/** A media panel: 20px corners, the ground under the hero phone. */
export function Panel({
  children,
  className = "",
  tone = "saffron",
}: {
  children: ReactNode;
  className?: string;
  tone?: "saffron" | "mist";
}) {
  const bg = tone === "saffron" ? "bg-saffron" : "bg-mist";
  return <div className={`rounded-[20px] ${bg} ${className}`}>{children}</div>;
}
