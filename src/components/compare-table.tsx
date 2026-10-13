import { copy } from "@/lib/copy";

const t = copy.pricing.compare;

/**
 * WunTab next to a delivery app, row by row (/pricing). A real table: the
 * row names are row headers. On phones each row's name runs across the top
 * and the two answers sit side by side under it, so nothing scrolls sideways.
 */
export function CompareTable() {
  return (
    <table className="w-full border-collapse text-left" data-compare>
      <caption className="sr-only">{t.heading}</caption>
      <thead>
        <tr className="grid grid-cols-2 gap-x-4 border-b border-ink sm:table-row">
          <th scope="col" className="hidden sm:table-cell sm:w-[34%]">
            <span className="sr-only">Question</span>
          </th>
          <th scope="col" className="pb-3 text-small font-semibold sm:pr-6">
            {t.us}
          </th>
          <th scope="col" className="pb-3 text-small font-semibold">
            {t.them}
          </th>
        </tr>
      </thead>
      <tbody>
        {t.rows.map((row) => (
          <tr key={row.label} className="grid grid-cols-2 gap-x-4 border-b border-mist py-4 sm:table-row sm:py-0">
            <th scope="row" className="col-span-2 pb-2 text-small font-medium sm:py-4 sm:pr-6 sm:align-top">
              {row.label}
            </th>
            <td className="text-small sm:py-4 sm:pr-6 sm:align-top">{row.us}</td>
            <td className="text-small text-ink-muted sm:py-4 sm:align-top">{row.them}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
