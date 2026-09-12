/**
 * A numbered step flow. Numbers are earned: every flow here is a real
 * sequence (an order moving, a feedback loop, the customer lifecycle).
 */
export function Flow({
  steps,
  title,
  dark = false,
}: {
  steps: readonly string[];
  title?: string;
  dark?: boolean;
}) {
  const line = dark ? "bg-paper/20" : "bg-ink/15";
  const muted = dark ? "text-paper/70" : "text-ink/72";
  return (
    <div>
      {title ? <h3 className="text-h3">{title}</h3> : null}
      <ol
        className={`${title ? "mt-8" : ""} grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr`}
      >
        {steps.map((step, index) => (
          <li key={step} className="relative">
            <div className="flex items-center gap-3">
              <span className={`text-h3 tabular-nums ${muted}`}>{index + 1}</span>
              <span className={`h-px flex-1 ${line}`} aria-hidden />
            </div>
            <p className="mt-3 max-w-[24ch] text-body font-medium">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** A short chain like Feedback → Reviews → Loyalty → Repeat customer. */
export function Chain({ items }: { items: readonly string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-body font-medium">
      {items.map((item, index) => (
        <li key={item} className="flex items-center gap-3">
          {index > 0 ? <span className="h-px w-6 bg-ink/30" aria-hidden /> : null}
          <span className="rounded-[8px] bg-ticket px-3 py-1.5">{item}</span>
        </li>
      ))}
    </ol>
  );
}
