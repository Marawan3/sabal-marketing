"use client";

import { useId, useState } from "react";
import { RuleInput } from "./rule-input";
import { copy } from "@/lib/copy";
import { dollarAmount, wholeNumber } from "@/lib/input-rules";

const t = copy.savings;
const WEEKS = 52;

/**
 * The boxes' rules (owner, 2026-11-18): orders a week are a whole number,
 * 0 to 9,999, digits only; the average order is 0 to $999.99, with two
 * decimals at most. Letters, minus signs, "e" and a second point never stay
 * in either box. Each parses to null while its box is empty or out of range.
 */
export const ordersRule = wholeNumber({ min: 0, max: 9999 });
export const valueRule = dollarAmount({ min: 0, max: 999.99 });

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
  const o = ordersRule.parse(orders);
  const v = valueRule.parse(value);
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
          <RuleInput rule={ordersRule} id={`${id}-o`} autoComplete="off" value={orders} onValue={setOrders} className={`${field} mt-2 px-3`} />
        </label>
        <label htmlFor={`${id}-v`} className="flex flex-col justify-between text-small font-medium">
          {t.value}
          <span className="relative mt-2 block">
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-body text-ink-muted">
              $
            </span>
            <RuleInput rule={valueRule} id={`${id}-v`} autoComplete="off" value={value} onValue={setValue} className={`${field} pr-3 pl-7`} />
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
