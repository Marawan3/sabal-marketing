/**
 * REPLACE slots for production screenshots and photos.
 * See ASSETS.md for dimensions and file names.
 */
export function AssetSlot({
  id,
  label,
  ratio,
  hint,
  className = "",
}: {
  id: string;
  label: string;
  ratio: string;
  hint: string;
  className?: string;
}) {
  return (
    <div
      data-asset-slot={id}
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-palm/40 bg-sand text-center ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <p className="px-4 font-display text-sm text-palm-deep">{label}</p>
      <p className="mt-1 max-w-xs px-4 text-xs leading-5 text-ink-soft">{hint}</p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        REPLACE: {id} · {ratio}
      </p>
    </div>
  );
}

export function DishPlaceholder({
  name,
  tone,
}: {
  name: string;
  tone: "wood" | "garden" | "sweet" | "bread";
}) {
  const bg = {
    wood: "bg-[#c45c2a]",
    garden: "bg-[#2e6b45]",
    sweet: "bg-[#8a4b32]",
    bread: "bg-[#d4a05a]",
  }[tone];

  return (
    <div
      className={`flex h-full w-full items-end ${bg}`}
      role="img"
      aria-label={`Placeholder photo for ${name}. Replace with a real dish photo.`}
    >
      <span className="w-full bg-ink/35 px-2 py-1 text-[10px] font-medium text-white">
        {name}
      </span>
    </div>
  );
}
