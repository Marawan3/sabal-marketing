import { DishPlaceholder } from "@/components/asset-slot";
import { demoDishes } from "@/lib/demo-kitchen";

const chicken = demoDishes[0];

export function ItemSheetMock() {
  return (
    <div className="h-full bg-white text-zinc-900">
      <div className="relative h-40">
        <DishPlaceholder name={chicken.name} tone="wood" />
      </div>
      <div className="p-5">
        <p className="text-lg font-semibold">{chicken.name}</p>
        <p className="mt-1 text-sm leading-6 text-zinc-600">{chicken.description}</p>
        <p className="mt-3 text-base font-semibold tabular-nums">${chicken.price}</p>
        <fieldset className="mt-4 space-y-2 text-sm">
          <legend className="font-medium">Heat</legend>
          <label className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full border-4 border-product bg-white" />
            Herb oil
          </label>
          <label className="flex items-center gap-2 text-zinc-500">
            <span className="h-3.5 w-3.5 rounded-full border border-zinc-300" />
            Chili crisp
          </label>
        </fieldset>
        <div className="mt-5 flex items-center justify-between rounded-full bg-product px-4 py-3 text-sm font-semibold text-white">
          <span>Add to cart</span>
          <span className="tabular-nums">${chicken.price}</span>
        </div>
      </div>
    </div>
  );
}

export function CartCheckoutMock() {
  return (
    <div className="h-full bg-white p-5 text-zinc-900">
      <p className="text-sm font-semibold">Pickup checkout</p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">
        Guest checkout. Name, phone, payment. No account.
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex justify-between">
          <span>Citrus herb chicken × 1</span>
          <span className="tabular-nums">$22</span>
        </li>
        <li className="flex justify-between">
          <span>Charred cauliflower × 1</span>
          <span className="tabular-nums">$16</span>
        </li>
      </ul>
      <div className="mt-4 space-y-2 text-sm">
        <span className="block rounded-lg bg-zinc-50 px-3 py-2 text-zinc-600">Name</span>
        <span className="block rounded-lg bg-zinc-50 px-3 py-2 text-zinc-600">Phone</span>
        <span className="block rounded-lg bg-zinc-50 px-3 py-2 text-zinc-600">Payment</span>
      </div>
      <p className="mt-4 text-xs font-medium text-zinc-500">Tip</p>
      <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs font-semibold">
        <span className="rounded-lg border border-zinc-200 py-2">15%</span>
        <span className="rounded-lg border border-zinc-200 py-2">18%</span>
        <span className="rounded-lg border border-zinc-200 py-2">20%</span>
        <span className="rounded-lg border-2 border-product py-2 text-product-deep">
          None
        </span>
      </div>
      <div className="mt-4 flex justify-between text-sm font-semibold">
        <span>Due today</span>
        <span className="tabular-nums">$38</span>
      </div>
      <p className="mt-1 text-[11px] text-zinc-500">No service fee added by Sabal.</p>
      <div className="mt-4 rounded-full bg-product px-4 py-3 text-center text-sm font-semibold text-white">
        Place order
      </div>
    </div>
  );
}

export function ConfirmationMock() {
  return (
    <div className="flex h-full flex-col justify-center bg-white px-5 py-8 text-center text-zinc-900">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-product">
        Order 1041
      </p>
      <p className="mt-3 text-lg font-semibold">The kitchen has it.</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">
        Pickup at Sabal Demo Kitchen. Tracking stays on this domain. A text goes
        out if a print does not.
      </p>
      <div className="mx-auto mt-6 max-w-xs rounded-xl bg-product-soft px-4 py-3 text-sm text-product-deep">
        Confirmed · Ready around 6:45 PM
      </div>
    </div>
  );
}
