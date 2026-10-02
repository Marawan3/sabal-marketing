import { copy } from "./copy";
import { builtProducts } from "./catalog";
import { finalLegalRoutes } from "./legal";

export const site = {
  name: "WunTab",
  tagline: copy.hero.headline,
  description: copy.hero.sub,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@wuntab.com",
} as const;

/** "Get Started" books a call (owner decision 2026-10-02) until self-serve signup is proven. NEXT_PUBLIC_DEMO_HREF can point at a scheduling link. */
export const demoHref =
  process.env.NEXT_PUBLIC_DEMO_HREF ??
  `mailto:${site.contactEmail}?subject=Book%20a%20call%20with%20WunTab`;

/** "Log in" target. Hidden until NEXT_PUBLIC_APP_HREF is set. */
export const appHref = process.env.NEXT_PUBLIC_APP_HREF;

/**
 * Phase 1 has no Solutions, Resources or Company pages yet, so those nav
 * groups do not render (a group with nothing behind it would only hold dead
 * links). They return as their pages are built.
 */
export const primaryLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
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
