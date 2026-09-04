export const site = {
  name: "Sabal",
  tagline: "Restaurant websites that rank, and ordering you own.",
  description:
    "Sabal gives restaurants a website built to rank on Google and an ordering system built to convert — on your own domain, with your own customers.",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@sabal.ai",
  appUrl: (process.env.NEXT_PUBLIC_APP_URL ?? "https://sabal.ai").replace(
    /\/$/,
    "",
  ),
} as const;

export const nav = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/online-ordering", label: "Online Ordering" },
  { href: "/restaurant-seo", label: "Restaurant SEO" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export const legalNav = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Website Terms" },
  { href: "/platform-terms", label: "Platform Terms" },
  { href: "/dpa", label: "DPA" },
  { href: "/accessibility", label: "Accessibility" },
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
    return host === "sabal.ai" || host === "www.sabal.ai";
  } catch {
    return false;
  }
}

export function absoluteUrl(path = "/") {
  const origin = getSiteUrl();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
