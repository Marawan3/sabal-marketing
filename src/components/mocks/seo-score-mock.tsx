const checks = [
  { pass: true, hard: true, title: "Menu readable as HTML", detail: "Categories, dishes, and prices render in the document." },
  { pass: true, hard: true, title: "Restaurant schema valid", detail: "Restaurant, Menu, and FAQ JSON-LD match the visible page." },
  { pass: true, hard: true, title: "Photos present", detail: "Menu items use real photographs with alt text." },
  { pass: true, hard: true, title: "Google Business Profile connected", detail: "Place ID is on the location and emitted on the homepage." },
  { pass: true, hard: false, title: "Canonicals and sitemap", detail: "Every indexable URL has a self-canonical and a sitemap row." },
  { pass: true, hard: false, title: "No placeholder copy", detail: "Quality gates refused to publish leftover draft strings." },
] as const;

export function SeoScoreMock() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 text-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">SEO for online orders</p>
          <p className="mt-1 max-w-xl text-sm text-zinc-500">
            Fill score is everything you can complete here. Launch-ready also
            requires every hard gate.
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold tabular-nums">12/12</p>
          <p className="text-xs text-zinc-500">fillable checks</p>
          <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
            Launch ready
          </span>
        </div>
      </div>
      <ul className="mt-4">
        {checks.map((check) => (
          <li
            key={check.title}
            className="flex gap-3 border-t border-zinc-100 py-2.5 first:border-t-0"
          >
            <span className="mt-0.5 w-4 shrink-0 text-center text-sm text-emerald-600" aria-hidden>
              ✓
            </span>
            <div>
              <p className="text-sm font-medium">
                {check.hard ? <span className="mr-1 text-rose-700">⛔</span> : null}
                {check.title}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">{check.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
