import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { brand } from "@/lib/brand";
import { getSiteUrl, shouldIndex, site } from "@/lib/site";
import { copy } from "@/lib/copy";
import "./globals.css";

export const dynamic = "error";

/**
 * Archivo, variable weight plus the width axis (62–125%): headlines run at
 * 110% width, card titles at 104%, everything else at 100%.
 *
 * Fallbacks are metric-matched to Archivo so text doesn't re-wrap when the
 * font arrives. They are declared in globals.css instead of next/font's
 * automatic one, which only names local(Arial) (missing on Linux, where
 * Liberation Sans carries Arial's metrics) and covers weight 400 only.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
  adjustFontFallback: false,
  fallback: ["Archivo Body Fallback", "ui-sans-serif", "system-ui", "sans-serif"],
});

export const viewport: Viewport = {
  themeColor: brand.paper,
};

const indexing = shouldIndex();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `WunTab: ${copy.hero.headline}`,
    template: "%s | WunTab",
  },
  description: site.description,
  applicationName: "WunTab",
  authors: [{ name: "WunTab" }],
  creator: "WunTab",
  robots: indexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WunTab",
    title: copy.hero.headline,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "WunTab",
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${archivo.variable}`}>
      <body className="min-h-full bg-paper text-ink antialiased">
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
