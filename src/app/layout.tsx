import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { brand } from "@/lib/brand";
import { getSiteUrl, shouldIndex, site } from "@/lib/site";
import { copy } from "@/lib/copy";
import "./globals.css";

export const dynamic = "error";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-bricolage",
});

export const viewport: Viewport = {
  themeColor: brand.paper,
};

const indexing = shouldIndex();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `Wuntab: ${copy.hero.headline}`,
    template: "%s | Wuntab",
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${bricolage.variable}`}>
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
