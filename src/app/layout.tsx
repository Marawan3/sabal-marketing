import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { brand } from "@/lib/brand";
import { getSiteUrl, shouldIndex, site } from "@/lib/site";
import { copy } from "@/lib/copy";
import "./globals.css";

export const dynamic = "error";

export const viewport: Viewport = {
  themeColor: brand.cream,
};

const indexing = shouldIndex();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${copy.hero.headline} · Wuntab`,
    template: "%s · Wuntab",
  },
  description: site.description,
  applicationName: "Wuntab",
  authors: [{ name: "Wuntab" }],
  creator: "Wuntab",
  robots: indexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Wuntab",
    title: copy.hero.headline,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Wuntab",
    description: site.description,
  },
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-cream text-charcoal antialiased">
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
