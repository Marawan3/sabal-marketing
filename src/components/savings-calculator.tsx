"use client";

import { useId, useState } from "react";
import { copy } from "@/lib/copy";

const t = copy.savings;
const WEEKS = 52;

/** A typed number, or null while the box is empty or not a number. */
function parse(value: string): number | null {
  const n = Number(value.replace(/[$,\s]/g, ""));
  return value.trim() && Number.isFinite(n) && n >= 0 ? n : null;
}

const dollars = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/**
 * What the restaurant would keep in a year if its delivery-app orders came
 * direct: orders a week × average order × 52 weeks × the apps' 15–30%
 * commission. It opens on the owner's example, 60 orders a week at $30
 * (2026-10-19), marked as an example, so the range shows at once; both boxes
 * are the visitor's to change. Real text, no library, like the built visuals.
 */
export function yearlyRange(orders: number, value: number) {
  const sales = orders * value * WEEKS;
  return [Math.round((sales * t.low) / 100), Math.round((sales * t.high) / 100)] as const;
}

export function SavingsCalculator() {
  const id = useId();
  const [orders, setOrders] = useState(String(t.example.orders));
  const [value, setValue] = useState(String(t.example.value));
  const o = parse(orders);
  const v = parse(value);
  const range = o !== null && v !== null && o * v > 0 ? yearlyRange(o, v) : null;
  const field =
    "block min-h-12 w-full rounded-[12px] border border-ink-muted bg-paper text-body text-ink tabular-nums focus-visible:border-ink";
  return (
    <div className="rounded-[20px] bg-paper p-4 sm:p-8" data-calculator>
      <p className="mb-3 text-small text-ink-muted sm:mb-4" data-example>
        {t.example.note}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <label htmlFor={`${id}-o`} className="flex flex-col justify-between text-small font-medium">
          {t.orders}
          <input
            id={`${id}-o`}
            inputMode="numeric"
            autoComplete="off"
            value={orders}
            onChange={(e) => setOrders(e.target.value)}
            className={`${field} mt-2 px-3`}
          />
        </label>
        <label htmlFor={`${id}-v`} className="flex flex-col justify-between text-small font-medium">
          {t.value}
          <span className="relative mt-2 block">
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-body text-ink-muted">
              $
            </span>
            <input
              id={`${id}-v`}
              inputMode="numeric"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`${field} pr-3 pl-7`}
            />
          </span>
        </label>
      </div>
      <div className="mt-5 border-t border-rule pt-4 sm:mt-8 sm:pt-6" aria-live="polite">
        <p className="text-small font-medium">{t.result}</p>
        <p className="mt-1 text-h2 text-balance tabular-nums" data-result>
          {range ? `Between ${dollars(range[0])} and ${dollars(range[1])}` : <span className="text-body text-ink-muted">{t.empty}</span>}
        </p>
      </div>
      <p className="mt-3 text-small text-ink-muted">{t.assumption}</p>
    </div>
  );
}
