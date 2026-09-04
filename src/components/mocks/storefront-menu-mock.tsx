import Image from "next/image";
import { demoDishes, demoKitchen } from "@/lib/demo-kitchen";

export function StorefrontMenuMock() {
  return (
    <div className="bg-white text-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-product text-xs font-bold text-white">
            SD
          </span>
          <div>
            <p className="text-sm font-semibold">{demoKitchen.name}</p>
            <p className="text-[11px] text-zinc-500">
              {demoKitchen.neighborhood} · {demoKitchen.hours}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-product px-3 py-1.5 text-xs font-semibold text-white">
          Cart · 2
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto border-b border-zinc-100 px-4 py-2 text-xs font-medium text-zinc-600">
        {demoKitchen.categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-product-soft px-3 py-1 text-product-deep"
          >
            {category}
          </span>
        ))}
      </div>
      <div className="divide-y divide-zinc-100">
        {demoDishes.map((dish) => (
          <div key={dish.slug} className="flex gap-3 px-4 py-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              <Image
                src={dish.photo}
                alt={dish.alt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold">{dish.name}</p>
                <p className="text-sm tabular-nums">{dish.price}</p>
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-zinc-500">
                {dish.description}
              </p>
            </div>
            <span className="mt-1 h-7 shrink-0 rounded-full bg-product px-2.5 text-xs font-semibold leading-7 text-white">
              Add
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
