function Ticket({
  number,
  age,
  items,
  channel,
  accent,
}: {
  number: string;
  age: string;
  items: string[];
  channel: string;
  accent: "normal" | "warning";
}) {
  const card =
    accent === "warning"
      ? "border-amber-500 bg-amber-950/40"
      : "border-zinc-700 bg-zinc-900";
  const clock = accent === "warning" ? "text-amber-300" : "text-zinc-100";

  return (
    <article className={`rounded-lg border-2 p-3 ${card}`}>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold tabular-nums text-zinc-50">
          #{number}
        </span>
        <span className={`text-sm tabular-nums ${clock}`}>{age}</span>
      </div>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-400">
        {channel}
      </p>
      <ul className="mt-2 space-y-1 text-sm text-zinc-100">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <span className="mt-3 flex h-10 items-center justify-center rounded-md bg-product text-sm font-bold text-white">
        Start
      </span>
    </article>
  );
}

export function KdsMock() {
  return (
    <div className="bg-zinc-950 p-4 text-zinc-50">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-zinc-400">
        <span>Kitchen display · Sabal Demo Kitchen</span>
        <span>Coconut Grove</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-semibold text-zinc-300">New</p>
          <Ticket
            number="1041"
            age="2:14"
            channel="Pickup"
            items={["Citrus herb chicken", "Grove greens"]}
            accent="normal"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-zinc-300">In progress</p>
          <Ticket
            number="1038"
            age="11:02"
            channel="Pickup"
            items={["Charred cauliflower × 2"]}
            accent="warning"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-zinc-300">Ready</p>
          <Ticket
            number="1036"
            age="0:48"
            channel="Delivery"
            items={["Tomato bread", "Olive oil cake"]}
            accent="normal"
          />
        </div>
      </div>
    </div>
  );
}
