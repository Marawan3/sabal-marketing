import type { CSSProperties, ReactNode } from "react";
import { bySlug } from "@/lib/catalog";
import { Visual } from "./visual";
import v from "./visuals.module.css";

/** Line icons, 24px grid, drawn with the same stroke as the delivery flow. */
const icon = {
  phone: <path d="M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2" />,
  menu: <path d="M5 6h14M5 12h14M5 18h9" />,
  card: <path d="M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Zm0 4h18M7 15h4" />,
  kitchen: <path d="M5 11h14v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7Zm-2 0h18M9 8c0-1.5 1-2 1-3.5M14 8c0-1.5 1-2 1-3.5" />,
  bell: <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Zm4 4h4" />,
  wuntab: <path d="M4 7l3.5 10L12 9l4.5 8L20 7" />,
  store: <path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-8Z" />,
  form: <path d="M4 6h16v12H4V6Zm0 0l8 7 8-7" />,
  reply: <path d="M4 5h16v11H9l-5 4V5Z" />,
  check: <path d="M5 12l4.5 4.5L19 7" />,
  photo: <path d="M4 5h16v14H4V5Zm0 10l4-4 4 4 3-3 5 5" />,
  eye: <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  globe: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z" />,
  refresh: <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />,
  page: <path d="M6 3h9l4 4v14H6V3Zm9 0v4h4M9 12h6M9 16h6" />,
  tag: <path d="M3 12V4h8l10 10-8 8L3 12Zm5-4h.01" />,
  pages: <path d="M8 7h11v14H8V7ZM5 17V3h11" />,
  tree: <path d="M10 3h4v4h-4V3Zm2 4v4M5 15v-4h14v4M3 15h4v5H3v-5Zm7 0h4v5h-4v-5Zm7 0h4v5h-4v-5Z" />,
  printer: <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7v-7Z" />,
  lock: <path d="M6 11h12v9H6v-9Zm2 0V8a4 4 0 0 1 8 0v3" />,
} satisfies Record<string, ReactNode>;

type Icon = keyof typeof icon;

/**
 * Each page's steps (the catalog's own flow, word for word) and, per step, an
 * icon and a one-word label for the node above it.
 */
const flows: Record<string, [Icon, string][]> = {
  "online-ordering": [
    ["menu", "Menu"],
    ["phone", "Dishes"],
    ["card", "Checkout"],
    ["kitchen", "Kitchen"],
    ["bell", "Updates"],
  ],
  catering: [
    ["phone", "Catering page"],
    ["form", "Request"],
    ["store", "Restaurant"],
    ["reply", "Reply"],
    ["check", "Confirmed"],
  ],
  "restaurant-websites": [
    ["photo", "Collect"],
    ["wuntab", "Build"],
    ["eye", "Review"],
    ["globe", "Publish"],
    ["refresh", "Update"],
  ],
  "restaurant-seo": [
    ["page", "In the page"],
    ["tag", "Labelled"],
    ["pages", "Pages"],
    ["tree", "Sitemap"],
  ],
  payments: [
    ["card", "Checkout"],
    ["lock", "Card check"],
    ["check", "Paid"],
    ["kitchen", "Kitchen"],
  ],
  integrations: [
    ["phone", "Website"],
    ["card", "Payment"],
    ["wuntab", "WunTab"],
    ["printer", "Kitchen"],
  ],
};

export const stepFlowSlugs = Object.keys(flows);

/**
 * A product's steps as a line of nodes over a numbered list: one step lights
 * at a time, then all of them hold. The same shape as the delivery flow, for
 * any four or five steps.
 */
export function StepFlow({ slug }: { slug: string }) {
  const flow = bySlug[slug].flow!;
  const nodes = flows[slug];
  const n = nodes.length;
  // Step k lights at 400 ms, then one a second; the last holds 800 ms more.
  const steps = [0, ...nodes.map((_, i) => 400 + i * 1000), 400 + (n - 1) * 1000 + 800];
  const description = `An animated diagram: ${flow.title.toLowerCase()}, in ${n} steps. ${flow.steps.map((s, i) => `${i + 1}. ${s}.`).join(" ")}`;
  return (
    <Visual name={`flow-${slug}`} steps={steps} description={description} className={v.flowVis}>
      <div className={`${v.flow} ${v.gflow}`} data-n={n} style={{ "--n": n } as CSSProperties}>
        <div className={v.track}>
          <span className={v.trackLine} />
          <span className={v.gfill} />
          {nodes.map(([key, label], i) => (
            <div key={label} className={v.node} data-gnode={i + 1}>
              <span className={v.nodeDot}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {icon[key]}
                </svg>
                <span className={v.nodeOn}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {icon[key]}
                  </svg>
                </span>
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <ol className={v.steps}>
          {flow.steps.map((step, i) => (
            <li key={step} className={v.step} data-gstep={i + 1}>
              <span className={v.stepNum}>{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </Visual>
  );
}
