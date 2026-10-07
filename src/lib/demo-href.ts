/**
 * The Book a call link with the restaurant's name filled in. No imports, so
 * it is safe in a client component.
 *
 * - mailto: the name goes into the subject and the first line of the body.
 * - a scheduling link (NEXT_PUBLIC_DEMO_HREF): the name is added as the
 *   query parameter NEXT_PUBLIC_DEMO_NAME_PARAM (default "restaurant"). Set
 *   it to whatever field the scheduling tool prefills from.
 */
export function demoHrefWithName(base: string, name: string, param = "restaurant"): string {
  const restaurant = name.trim().slice(0, 120);
  if (!restaurant) return base;
  if (base.startsWith("mailto:")) {
    const [address, query = ""] = base.split("?");
    const params = new URLSearchParams(query);
    const subject = params.get("subject") ?? "Book a call with WunTab";
    params.set("subject", `${subject}: ${restaurant}`);
    params.set("body", `Restaurant: ${restaurant}\n\n`);
    // mailto wants %20, not +.
    return `${address}?${params.toString().replace(/\+/g, "%20")}`;
  }
  try {
    const url = new URL(base);
    url.searchParams.set(param, restaurant);
    return url.toString();
  } catch {
    return base;
  }
}
