export function PrinterTicketMock() {
  return (
    <div className="h-full bg-[#f3efe6] px-5 py-6 text-[#1c2418]">
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        Kitchen printer · Clover / cloud
      </p>
      <div className="mx-auto mt-4 max-w-[240px] bg-white px-4 py-5 font-mono text-xs shadow-sm">
        <p className="text-center text-[11px] font-bold">SABAL DEMO KITCHEN</p>
        <p className="mt-1 text-center text-[10px] text-zinc-500">
          #1041 · PICKUP · 6:30 PM
        </p>
        <div className="my-3 border-t border-dashed border-zinc-300" />
        <p>1  CITRUS HERB CHICKEN</p>
        <p className="pl-4 text-zinc-500">Herb oil</p>
        <p className="mt-2">1  GROVE GREENS</p>
        <div className="my-3 border-t border-dashed border-zinc-300" />
        <p>GUEST  A. RIVERA</p>
        <p>SMS IF PRINT FAILS</p>
      </div>
      <p className="mt-5 text-center text-[11px] leading-5 text-zinc-500">
        Prints to the station you already have. Text fallback so nothing is lost.
      </p>
    </div>
  );
}
