import { copy } from "./copy";

export const site = {
  name: "Wuntab",
  tagline: copy.hero.headline,
  description: copy.hero.sub,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@wuntab.com",
} as const;

export const demoHref =
  process.env.NEXT_PUBLIC_DEMO_HREF ??
  `mailto:${site.contactEmail}?subject=Book%20a%20Wuntab%20demo`;

export const nav = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#proof", label: "Proof" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const legalNav = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
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
