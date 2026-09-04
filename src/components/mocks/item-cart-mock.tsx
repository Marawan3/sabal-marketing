import Image from "next/image";
import { demoDishes } from "@/lib/demo-kitchen";

const chicken = demoDishes[0];

export function ItemSheetMock() {
  return (
    <div className="grid bg-white text-zinc-900 md:grid-cols-2">
      <div className="relative min-h-[220px] bg-zinc-100">
        <Image
          src={chicken.photo}
          alt={chicken.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <p className="text-lg font-semibold">{chicken.name}</p>
        <p className="mt-1 text-sm leading-6 text-zinc-600">{chicken.description}</p>
        <p className="mt-3 text-base font-semibold tabular-nums">{chicken.price}</p>
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
          <span className="tabular-nums">{chicken.price}</span>
        </div>
      </div>
    </div>
  );
}

export function CartCheckoutMock() {
  return (
    <div className="grid bg-white text-zinc-900 md:grid-cols-2">
      <div className="border-b border-zinc-100 p-5 md:border-b-0 md:border-r">
        <p className="text-sm font-semibold">Your order</p>
        <ul className="mt-3 space-y-3 text-sm">
          <li className="flex justify-between gap-3">
            <span>Citrus herb chicken × 1</span>
            <span className="tabular-nums">22</span>
          </li>
          <li className="flex justify-between gap-3">
            <span>Charred cauliflower × 1</span>
            <span className="tabular-nums">16</span>
          </li>
        </ul>
        <div className="mt-4 flex justify-between border-t border-zinc-100 pt-3 text-sm font-semibold">
          <span>Due today</span>
          <span className="tabular-nums">38</span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm font-semibold">Pickup on your domain</p>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          Guest pays the restaurant. Merchant account stays yours.
        </p>
        <div className="mt-4 space-y-2">
          <span className="block rounded-lg bg-product-soft px-3 py-2 text-sm font-medium text-product-deep">
            Pickup · Today, 6:30 PM
          </span>
          <span className="block rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500">
            Delivery through our delivery-network partner
          </span>
        </div>
        <div className="mt-4 rounded-full bg-product px-4 py-3 text-center text-sm font-semibold text-white">
          Place order
        </div>
      </div>
    </div>
  );
}

export function ConfirmationMock() {
  return (
    <div className="bg-white px-5 py-8 text-center text-zinc-900">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-product">
        Order 1041
      </p>
      <p className="mt-3 text-lg font-semibold">We have it. The kitchen has it.</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">
        Pickup at Sabal Demo Kitchen · Coconut Grove. Tracking stays on this
        domain. A text goes out when the ticket moves.
      </p>
      <div className="mx-auto mt-6 max-w-xs rounded-xl bg-product-soft px-4 py-3 text-sm text-product-deep">
        Confirmed · Ready around 6:45 PM
      </div>
    </div>
  );
}
