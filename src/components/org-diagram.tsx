/**
 * A restrained platform visualization for Scale: one organization, several
 * locations, each running its own menu, hours, and orders. Used where a real
 * multi-location screen does not exist yet. It is a diagram, not fake UI.
 */
export function OrgDiagram({ dark = false }: { dark?: boolean }) {
  const line = dark ? "bg-paper/25" : "bg-ink/20";
  const box = dark ? "border-paper/20 bg-paper/5 text-paper" : "border-ink/10 bg-paper text-ink";
  const muted = dark ? "text-paper/70" : "text-ink/72";
  const locations = ["Location 1", "Location 2", "Location 3"];
  return (
    <div className="mx-auto w-full max-w-[560px]" aria-label="One organization running several locations">
      <div
        className={`mx-auto w-fit rounded-[8px] px-5 py-3 text-body font-medium ${
          dark ? "bg-saffron text-ink" : "bg-ink text-paper"
        }`}
      >
        Your organization
      </div>
      <div className="relative mx-auto h-8 w-px">
        <span className={`absolute inset-0 ${line}`} aria-hidden />
      </div>
      <div className="relative">
        <span
          className={`absolute left-[16.67%] right-[16.67%] top-0 h-px ${line}`}
          aria-hidden
        />
        <ol className="grid grid-cols-3 gap-4 pt-8">
          {locations.map((name) => (
            <li key={name} className="relative">
              <span className={`absolute left-1/2 -top-8 h-8 w-px ${line}`} aria-hidden />
              <div className={`rounded-[8px] border p-4 ${box}`}>
                <p className="text-small font-medium">{name}</p>
                <p className={`mt-1 text-[0.8125rem] leading-snug ${muted}`}>Own menu, hours, and orders</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <p className={`mt-6 text-center text-small ${muted}`}>
        One account. Group reporting across every location.
      </p>
    </div>
  );
}
