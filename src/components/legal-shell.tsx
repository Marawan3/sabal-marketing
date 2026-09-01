import type { ReactNode } from "react";
import { Container } from "./container";

export function LegalShell({
  title,
  dated,
  children,
}: {
  title: string;
  dated: string;
  children: ReactNode;
}) {
  return (
    <Container className="max-w-3xl py-16 sm:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
        {dated}
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">{title}</h1>
      <div className="mt-8 space-y-4 text-base leading-7 text-ink-soft [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-ink [&_a]:text-palm-bright">
        {children}
      </div>
    </Container>
  );
}
