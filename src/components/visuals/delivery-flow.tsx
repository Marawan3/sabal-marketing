import { copy } from "@/lib/copy";
import { bySlug } from "@/lib/catalog";
import { Visual } from "./visual";
import v from "./visuals.module.css";

/** Steps 1 to 6 light one at a time. */
const STEPS = [0, 400, 1400, 2400, 3400, 4400, 5400, 6200];

const icon = {
  phone: <path d="M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2" />,
  wuntab: <path d="M4 7l3.5 10L12 9l4.5 8L20 7" />,
  kitchen: <path d="M5 11h14v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7Zm-2 0h18M9 8c0-1.5 1-2 1-3.5M14 8c0-1.5 1-2 1-3.5" />,
  driver: (
    <>
      <path d="M3 13l2-5h11l3 5v4H3v-4Zm0 0h16" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="16" cy="17.5" r="1.5" />
    </>
  ),
  customer: <path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-8Z" />,
};

const nodes: [keyof typeof icon, string][] = [
  ["phone", "Phone"],
  ["wuntab", "WunTab"],
  ["kitchen", "Kitchen"],
  ["driver", "Driver"],
  ["customer", "Customer"],
];

/**
 * A delivery order's six steps (the Delivery page's own, catalog.ts), as a
 * line from the customer's phone to WunTab, your kitchen, a driver and the
 * customer. One step lights at a time; at the end all six are lit.
 */
export function DeliveryFlow() {
  const steps = bySlug.delivery.flow!.steps;
  return (
    <Visual name="flow" steps={STEPS} description={copy.visuals.flow} className={v.flowVis}>
      <div className={v.flow}>
        <div className={v.track}>
          <span className={v.trackLine} />
          <span className={v.trackFill} />
          {nodes.map(([key, label], i) => (
            <div key={key} className={v.node} data-node={i + 1}>
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
          {steps.map((step, i) => (
            <li key={step} className={v.step} data-step={i + 1}>
              <span className={v.stepNum}>{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </Visual>
  );
}
