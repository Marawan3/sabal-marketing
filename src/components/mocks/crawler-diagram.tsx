export function CrawlerDiagram() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <figure className="rounded-2xl border border-line bg-paper-2 p-5">
        <figcaption className="text-sm font-semibold">
          Menu as a PDF, image, or JS blob
        </figcaption>
        <p className="mt-1 text-xs text-ink-soft">What a crawler gets: nothing it can quote.</p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[11px] leading-5 text-zinc-400">
{`<div id="root"></div>
<script src="/app.js"></script>
<!-- or a PDF / photo of the menu -->

[empty document]`}
        </pre>
      </figure>
      <figure className="rounded-2xl border border-palm/30 bg-leaf/60 p-5">
        <figcaption className="text-sm font-semibold">Menu as HTML on Sabal</figcaption>
        <p className="mt-1 text-xs text-ink-soft">
          What a crawler gets: every dish, price, and description.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[11px] leading-5 text-leaf">
{`<h1>Citrus herb chicken</h1>
<p>Half chicken, preserved lemon...</p>
<span>22</span>
<script type="application/ld+json">
  {"@type":"MenuItem","name":"Citrus herb chicken"}
</script>`}
        </pre>
      </figure>
    </div>
  );
}
