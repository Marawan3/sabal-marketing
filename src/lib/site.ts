import { copy } from "./copy";
import { products, solutions } from "./catalog";

export const site = {
  name: "WunTab",
  tagline: copy.hero.headline,
  description: copy.hero.sub,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@wuntab.com",
} as const;

/** "Get Started" target. Marawan points NEXT_PUBLIC_DEMO_HREF at his scheduling link. */
export const demoHref =
  process.env.NEXT_PUBLIC_DEMO_HREF ??
  `mailto:${site.contactEmail}?subject=Get%20started%20with%20WunTab`;

/** "Log in" target. Hidden until NEXT_PUBLIC_APP_HREF is set. */
export const appHref = process.env.NEXT_PUBLIC_APP_HREF;

export const menuCheckHref = `mailto:${site.contactEmail}?subject=Check%20my%20menu&body=My%20website%20is%3A%20`;

export const topNav = [
  { key: "product", label: "Product" },
  { key: "solutions", label: "Solutions" },
  { key: "pricing", label: "Pricing", href: "/pricing" },
  { key: "resources", label: "Resources" },
  { key: "company", label: "Company" },
] as const;

export const resourcesNav = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/menu-check", label: "See what Google sees" },
  { href: "/blog", label: "Articles" },
] as const;

export const companyNav = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/partners", label: "Partners" },
] as const;

export const legalNav = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
] as const;

/** Every public route, for the sitemap. */
export const allRoutes = [
  "/",
  "/pricing",
  "/how-it-works",
  "/menu-check",
  "/about",
  "/contact",
  "/blog",
  "/privacy",
  "/terms",
  ...products.map((p) => `/${p.slug}`),
  ...solutions.map((s) => `/solutions/${s.slug}`),
] as const;

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
