import type { ReactNode } from "react";

export function BrowserFrame({
  url,
  label,
  children,
}: {
  url: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.65)]">
      <figcaption className="sr-only">{label}</figcaption>
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-100 px-3 py-2">
        <span className="flex gap-1" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-zinc-500">
          {url}
        </span>
      </div>
      <div className="bg-white">{children}</div>
    </figure>
  );
}
