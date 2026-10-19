/**
 * The Get Started (Book a call) link with the restaurant's name filled in. No
 * imports, so it is safe in a client component.
 *
 * - this site's own pages (the default, /contact?intent=call): the name is
 *   added as the query parameter `param` (default "restaurant"), which
 *   /contact reads into its Restaurant field.
 * - mailto: the name goes into the subject and the first line of the body.
 * - a scheduling link (NEXT_PUBLIC_DEMO_HREF): the name is added as the
 *   query parameter NEXT_PUBLIC_DEMO_NAME_PARAM (default "restaurant"). Set
 *   it to whatever field the scheduling tool prefills from.
 */
export function demoHrefWithName(base: string, name: string, param = "restaurant"): string {
  const restaurant = name.trim().slice(0, 120);
  if (!restaurant) return base;
  // A path on this site: new URL() throws on it alone, so resolve it against a placeholder origin and drop the origin again.
  if (base.startsWith("/") && !base.startsWith("//")) {
    const url = new URL(base, "https://placeholder.invalid");
    url.searchParams.set(param, restaurant);
    return `${url.pathname}${url.search}${url.hash}`;
  }
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
