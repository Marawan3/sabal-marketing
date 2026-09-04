import type { Metadata } from "next";
import Link from "next/link";
import { AssetSlot } from "@/components/asset-slot";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { PhoneFrame } from "@/components/phone-frame";
import { GoogleProof } from "@/components/google-proof";
import { CartCheckoutMock, ConfirmationMock, ItemSheetMock } from "@/components/mocks/item-cart-mock";
import { PrinterTicketMock } from "@/components/mocks/printer-ticket-mock";
import { StorefrontMenuMock } from "@/components/mocks/storefront-menu-mock";
import { productCopy } from "@/lib/copy";
import { breadcrumbSchema } from "@/lib/schema";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Product",
  description: productCopy.body,
  alternates: { canonical: "/product" },
};

const visuals = {
  storefront: (
    <PhoneFrame url="yourrestaurant.com/menu" label="Storefront menu on a phone">
      <StorefrontMenuMock />
    </PhoneFrame>
  ),
  ordering: (
    <div className="grid gap-4 sm:grid-cols-2">
      <PhoneFrame url="yourrestaurant.com/item" label="Item sheet on a phone">
        <ItemSheetMock />
      </PhoneFrame>
      <PhoneFrame url="yourrestaurant.com/checkout" label="Guest checkout on a phone">
        <CartCheckoutMock />
      </PhoneFrame>
    </div>
  ),
  kitchen: (
    <div className="grid items-center gap-4 lg:grid-cols-2">
      <div className="overflow-hidden rounded-3xl border border-line bg-paper-2">
        <div className="aspect-[4/3]">
          <PrinterTicketMock />
        </div>
      </div>
      <PhoneFrame url="yourrestaurant.com/order/1041" label="Order tracking on a phone">
        <ConfirmationMock />
      </PhoneFrame>
    </div>
  ),
  google: <GoogleProof />,
  service: (
    <AssetSlot
      id="onboarding-team"
      label="Onboarding walkthrough"
      ratio="16/10"
      hint="Desktop 1440×900. A real capture of menu import or launch checklist."
    />
  ),
} as const;

export default function ProductPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Product", path: "/product" },
        ])}
      />
      <Container className="py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
          {productCopy.kicker}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight sm:text-6xl">
          {productCopy.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">{productCopy.body}</p>
        <Link
          href="/demo"
          className="mt-8 inline-flex rounded-full bg-palm-deep px-6 py-3 text-sm font-semibold text-on-brand hover:bg-palm"
        >
          Book a demo
        </Link>
      </Container>

      {productCopy.sections.map((section) => (
        <section key={section.id} id={section.id} className="border-t border-line">
          <Container className="py-16">
            <h2 className="max-w-2xl font-display text-3xl tracking-tight sm:text-4xl">
              {section.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">{section.body}</p>
            <div className="mt-10">{visuals[section.id]}</div>
          </Container>
        </section>
      ))}
      <CtaBand />
    </>
  );
}
