/**
 * Local tile + wordmark.
 * Official SVG paths were not in the dropped spec — swap these files when they arrive.
 */
export function TileMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
    >
      <rect width="32" height="32" rx="6" fill="#A8431F" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <TileMark className="h-8 w-8" />
      <span className="text-xl font-medium tracking-[0.14em] text-charcoal uppercase">
        Wuntab
      </span>
    </span>
  );
}
