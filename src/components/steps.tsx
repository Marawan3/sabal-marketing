/**
 * A numbered sequence. From lg up the steps sit in a row joined by a thin
 * line; on phones they are a vertical list with the line running down
 * between the markers. Markers are navy outline circles with navy numerals
 * (owner, 2026-10-20: saffron only fills buttons, the hero panel and the
 * final band). No card behind any step.
 */
export function Steps({ steps }: { steps: readonly { title?: string; line: string }[] }) {
  const last = steps.length - 1;
  return (
    <ol className="grid gap-6 lg:auto-cols-fr lg:grid-flow-col lg:gap-6">
      {steps.map((step, index) => (
        <li key={step.title ?? step.line} className="relative flex gap-4 lg:block">
          {index < last ? (
            <span
              aria-hidden
              className="absolute top-11 bottom-[-1.25rem] left-5 w-px bg-rule lg:top-5 lg:right-[-1.5rem] lg:bottom-auto lg:left-12 lg:h-px lg:w-auto"
            />
          ) : null}
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-navy bg-paper text-body font-semibold text-navy tabular-nums">
            {index + 1}
          </span>
          <div className="pt-2 lg:pt-0 lg:mt-5 lg:pr-6">
            {step.title ? <h3 className="text-h3">{step.title}</h3> : null}
            <p className={`max-w-[34ch] text-body ${step.title ? "mt-2 text-ink-muted" : "font-medium"}`}>{step.line}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
