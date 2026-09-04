import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { getSiteUrl, shouldIndex, site } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const dynamic = "error";

export const viewport: Viewport = {
  themeColor: "#f6f1e8",
};

const indexing = shouldIndex();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
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
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sabal",
    description: site.description,
  },
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="en" className={`${outfit.variable} h-full`}>
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
