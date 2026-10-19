import { copy } from "./copy";
import { demoSite } from "./demo-data";
import { builtProducts, solutionHref, solutions } from "./catalog";
import { finalLegalRoutes } from "./legal";

export const site = {
  name: "WunTab",
  tagline: copy.hero.headline,
  description: copy.hero.sub,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@wuntab.com",
} as const;

/**
 * "Get Started" books a call (owner decision 2026-10-02) until self-serve
 * signup is proven. It goes to the /contact form, set up for a call request
 * (owner, 2026-10-19: a mailto link did nothing on phones without a mail
 * app). NEXT_PUBLIC_DEMO_HREF can point it at a scheduling link instead.
 */
export const demoHref = process.env.NEXT_PUBLIC_DEMO_HREF ?? "/contact?intent=call";

/**
 * True while Get Started goes to this site's own /contact form. Then the
 * links that would only repeat it (the final band's "Or send a message",
 * /contact's "Rather talk?") step aside.
 */
export const demoIsContactForm = /^\/contact(?:[?#]|$)/.test(demoHref);

/**
 * "See a live WunTab restaurant": the demo storefront (owner, 2026-10-13),
 * on the homepage products section and /restaurant-websites. Off until
 * NEXT_PUBLIC_SHOW_DEMO_LINK=true; the owner turns it on once the demo menu
 * has photos.
 */
export const demoStorefront = {
  href: `https://${demoSite.host}`,
  label: "See a live WunTab restaurant",
  on: process.env.NEXT_PUBLIC_SHOW_DEMO_LINK === "true",
} as const;

/** "Log in" target. Hidden until NEXT_PUBLIC_APP_HREF is set. */
export const appHref = process.env.NEXT_PUBLIC_APP_HREF;

/** Top-level links between the Solutions and Company menus. */
export const primaryLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
] as const;

/** The Company menu and footer column (owner, 2026-10-13). */
export const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalNav = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
] as const;

/**
 * Every route that belongs in the sitemap: published pages only. Legal
 * documents join only once their final text is published.
 */
export const allRoutes: string[] = [
  "/",
  "/how-it-works",
  "/pricing",
  ...builtProducts.map((slug) => `/${slug}`),
  ...solutions.map((s) => solutionHref(s.slug)),
  ...companyLinks.map((l) => l.href),
  ...finalLegalRoutes(),
];

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function shouldIndex() {
  const flag = process.env.NEXT_PUBLIC_ALLOW_INDEXING;
  if (flag === "true") return true;
  if (flag === "false") return false;
  try {
    const host = new URL(getSiteUrl()).hostname;
    return host === "wuntab.com" || host === "www.wuntab.com";
  } catch {
    return false;
  }
}

export function absoluteUrl(path = "/") {
  const origin = getSiteUrl();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
