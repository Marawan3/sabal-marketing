import type { Faq as FaqItem } from "@/lib/catalog";

/** Questions on the left, native <details> answers on the right. */
export function Faq({ heading, items }: { heading: string; items: readonly FaqItem[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <h2 className="max-w-[14ch] text-h2 lg:col-span-5">{heading}</h2>
      <div className="faq divide-y divide-mist border-y border-mist lg:col-span-7">
        {items.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex min-h-14 cursor-pointer items-center gap-4 py-4 text-body font-medium">
              {item.question}
            </summary>
            <p className="max-w-[56ch] pb-6 text-body text-ink/85">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
