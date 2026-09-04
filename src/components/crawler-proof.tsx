import { homeCopy } from "@/lib/copy";

export function CrawlerProof() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <figure className="rounded-3xl border border-line bg-paper-2 p-5 sm:p-6">
        <figcaption className="font-display text-lg">{homeCopy.proofLeftTitle}</figcaption>
        <p className="mt-1 text-sm text-ink-soft">{homeCopy.proofLeftNote}</p>
        <pre className="mt-5 overflow-x-auto rounded-2xl bg-ink p-4 font-mono text-[11px] leading-5 text-[#c8c2b4]">
{`<div id="root"></div>
<script src="/app.js"></script>

[empty document]

# crawler sees no dishes
# crawler sees no prices`}
        </pre>
      </figure>
      <figure className="rounded-3xl border border-palm/30 bg-leaf p-5 sm:p-6">
        <figcaption className="font-display text-lg">{homeCopy.proofRightTitle}</figcaption>
        <p className="mt-1 text-sm text-ink-soft">{homeCopy.proofRightNote}</p>
        <pre className="mt-5 overflow-x-auto rounded-2xl bg-palm-deep p-4 font-mono text-[11px] leading-5 text-[#d7f0de]">
{`<h1>Citrus herb chicken</h1>
<p>Half chicken, preserved lemon…</p>
<span>$22</span>
<script type="application/ld+json">
{"@type":"MenuItem",
 "name":"Citrus herb chicken"}
</script>`}
        </pre>
      </figure>
    </div>
  );
}
