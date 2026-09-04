import type { ReactNode } from "react";

/** Recurring product device. Inner content area is 390×844 (9:19.5). */
export function PhoneFrame({
  children,
  label,
  url,
}: {
  children: ReactNode;
  label: string;
  url?: string;
}) {
  return (
    <figure className="mx-auto w-full max-w-[320px]">
      <figcaption className="sr-only">{label}</figcaption>
      <div className="rounded-[2.4rem] border-[10px] border-ink bg-ink p-1 shadow-[0_28px_60px_-24px_rgba(28,36,24,0.45)]">
        <div className="relative overflow-hidden rounded-[1.7rem] bg-paper-2">
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-2" aria-hidden>
            <span className="h-5 w-24 rounded-full bg-ink/90" />
          </div>
          {url ? (
            <p className="border-b border-line/70 bg-sand px-4 pb-1.5 pt-8 text-center text-[10px] text-ink-soft">
              {url}
            </p>
          ) : (
            <div className="h-8" />
          )}
          <div className="aspect-[390/844] overflow-hidden bg-paper-2">{children}</div>
        </div>
      </div>
    </figure>
  );
}
