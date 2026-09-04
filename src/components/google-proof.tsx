"use client";

import { useState, type ReactNode } from "react";
import { DishPlaceholder } from "@/components/asset-slot";
import { StorefrontMenuMock } from "@/components/mocks/storefront-menu-mock";
import { homeCopy } from "@/lib/copy";

type View = "google" | "diner";

export function GoogleProof() {
  const [view, setView] = useState<View>("google");

  return (
    <div>
      <div
        className="mx-auto flex w-full max-w-md rounded-full border border-line bg-sand p-1"
        role="tablist"
        aria-label="Toggle diner view and crawler view"
      >
        <Toggle
          active={view === "diner"}
          onClick={() => setView("diner")}
          selected={homeCopy.proofToggleDiner}
        >
          {homeCopy.proofToggleDiner}
        </Toggle>
        <Toggle
          active={view === "google"}
          onClick={() => setView("google")}
          selected={homeCopy.proofToggleGoogle}
        >
          {homeCopy.proofToggleGoogle}
        </Toggle>
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-ink-soft">
        {view === "google" ? homeCopy.proofGoogleNote : homeCopy.proofDinerNote}
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {view === "google" ? (
          <>
            <CrawlerPanel
              title={homeCopy.proofLeftTitle}
              count={homeCopy.proofLeftCount}
              tone="empty"
            />
            <CrawlerPanel
              title={homeCopy.proofRightTitle}
              count={homeCopy.proofRightCount}
              tone="full"
            />
          </>
        ) : (
          <>
            <PrettyPanel title={homeCopy.proofLeftTitle}>
              <TypicalMenuMock />
            </PrettyPanel>
            <PrettyPanel title={homeCopy.proofRightTitle}>
              <StorefrontMenuMock />
            </PrettyPanel>
          </>
        )}
      </div>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
  selected,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
  selected: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition ${
        active ? "bg-palm-deep text-on-brand" : "text-ink-soft hover:text-ink"
      }`}
      onClick={onClick}
    >
      {children}
      <span className="sr-only">{active ? `, ${selected} selected` : ""}</span>
    </button>
  );
}

function PrettyPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-line bg-paper-2">
      <figcaption className="border-b border-line px-5 py-3 font-display text-base">
        {title}
      </figcaption>
      <div className="max-h-[28rem] overflow-auto">{children}</div>
    </figure>
  );
}

function CrawlerPanel({
  title,
  count,
  tone,
}: {
  title: string;
  count: string;
  tone: "empty" | "full";
}) {
  const empty = tone === "empty";
  return (
    <figure
      className={`rounded-3xl border p-4 sm:p-5 ${
        empty ? "border-line bg-paper-2" : "border-palm/30 bg-leaf"
      }`}
    >
      <figcaption className="font-display text-lg">{title}</figcaption>
      <p
        className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          empty ? "bg-sand text-clay" : "bg-palm-deep text-on-brand"
        }`}
      >
        {count}
      </p>
      <pre
        className={`mt-4 overflow-x-auto rounded-2xl p-4 font-mono text-[11px] leading-5 ${
          empty ? "bg-ink text-[#9a9386]" : "bg-palm-deep text-[#d7f0de]"
        }`}
      >
        {empty ? emptySource : sabalSource}
      </pre>
    </figure>
  );
}

const emptySource = `<!doctype html>
<html>
  <body>
    <div id="root"></div>
    <script src="/app.js"></script>
  </body>
</html>

# first HTML
# headings: none
# dish names: none
# prices: none`;

const sabalSource = `<h1>Tonight's menu</h1>
<h2>Wood-fired</h2>
<article>
  <h3>Citrus herb chicken</h3>
  <p>Half chicken, preserved lemon…</p>
  <span>$22</span>
</article>
<script type="application/ld+json">
{"@type":"MenuItem",
 "name":"Citrus herb chicken",
 "offers":{"price":"22"}}
</script>

# first HTML includes the menu
# every published item, price, description`;

function TypicalMenuMock() {
  return (
    <div className="bg-white text-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
        <div>
          <p className="text-sm font-semibold">A neighborhood kitchen</p>
          <p className="text-[11px] text-zinc-500">Sample menu · not a real site</p>
        </div>
        <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white">
          Order
        </span>
      </div>
      <div className="divide-y divide-zinc-100">
        <TypicalRow name="House roast chicken" price="21" tone="wood" />
        <TypicalRow name="Seasonal greens" price="13" tone="garden" />
        <TypicalRow name="Tomato toast" price="9" tone="bread" />
      </div>
    </div>
  );
}

function TypicalRow({
  name,
  price,
  tone,
}: {
  name: string;
  price: string;
  tone: "wood" | "garden" | "bread";
}) {
  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        <DishPlaceholder name={name} tone={tone} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-2">
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-sm tabular-nums">{price}</p>
        </div>
        <p className="mt-0.5 text-xs text-zinc-500">Looks complete to a diner.</p>
      </div>
    </div>
  );
}
