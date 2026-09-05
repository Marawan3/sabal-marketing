import type { ReactNode } from "react";
import { Container } from "./container";

const tones = {
  paper: "bg-paper border-t border-mist",
  ticket: "bg-ticket",
  ink: "on-dark bg-ink text-paper",
} as const;

export function Section({
  id,
  tone = "paper",
  children,
  className = "",
  tight = false,
}: {
  id?: string;
  tone?: keyof typeof tones;
  children: ReactNode;
  className?: string;
  tight?: boolean;
}) {
  return (
    <section id={id} className={`scroll-mt-20 ${tones[tone]} ${className}`}>
      <Container className={tight ? "py-14 lg:py-20" : "py-20 lg:py-32"}>{children}</Container>
    </section>
  );
}

/** Heading on the left, lead paragraph on the right, the site's standard opener. */
export function SectionHead({
  heading,
  sub,
  as: Tag = "h2",
  dark = false,
}: {
  heading: string;
  sub?: string;
  as?: "h1" | "h2";
  dark?: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
      <Tag className={`${Tag === "h1" ? "text-display max-w-[16ch]" : "text-h2"} lg:col-span-5`}>
        {heading}
      </Tag>
      {sub ? (
        <p className={`max-w-[48ch] text-lead lg:col-span-7 ${dark ? "text-paper/80" : "text-ink/80"}`}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}
