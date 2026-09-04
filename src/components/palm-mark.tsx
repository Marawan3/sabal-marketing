/** Subtle palm frond. Sabal is a palm genus. Decorative only. */
export function PalmMark({ className = "h-14 w-14 text-palm/20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M32 58c0-14 2-24 8-34 6 8 10 18 10 34h-6c0-12-2-20-6-28-4 8-6 16-6 28h-6c0-16 4-26 10-34 6 10 8 20 8 34z"
      />
      <path
        fill="currentColor"
        d="M32 56c-12-6-22-8-30-6 10-8 20-8 30-4 10-4 20-4 30 4-8-2-18 0-30 6z"
      />
      <path
        fill="currentColor"
        d="M31 22c-8-10-8-18-4-22 2 8 6 14 12 18-8 2-14 8-18 16 4-6 8-10 10-12z"
      />
    </svg>
  );
}
