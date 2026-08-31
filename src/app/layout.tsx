import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { getSiteUrl, shouldIndex, site } from "@/lib/site";
import "./globals.css";

const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const dynamic = "error";

export const viewport: Viewport = {
  themeColor: "#0e3f28",
};

const indexing = shouldIndex();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Sabal — Restaurant websites that rank, and ordering you own",
    template: "%s · Sabal",
  },
  description: site.description,
  applicationName: "Sabal",
  authors: [{ name: "Sabal" }],
  creator: "Sabal",
  robots: indexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sabal",
    title: "Sabal — Restaurant websites that rank, and ordering you own",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sabal",
    description: site.description,
  },
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full`}>
      <body className="min-h-full bg-paper font-sans text-ink antialiased">
        <JsonLd data={[organizationSchema(), webSiteSchema()]} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader appUrl={site.appUrl} />
        <main id="main">{children}</main>
        <SiteFooter contactEmail={site.contactEmail} />
        {plausible ? (
          <Script
            defer
            data-domain={plausible}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
