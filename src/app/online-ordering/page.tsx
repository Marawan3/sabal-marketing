import type { Metadata } from "next";
import { BrowserFrame } from "@/components/browser-frame";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import {
  CartCheckoutMock,
  ConfirmationMock,
  ItemSheetMock,
} from "@/components/mocks/item-cart-mock";
import { KdsMock } from "@/components/mocks/kds-mock";
import { StorefrontMenuMock } from "@/components/mocks/storefront-menu-mock";
import { breadcrumbSchema } from "@/lib/schema";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Online Ordering",
  description:
    "Direct pickup and delivery checkout on your domain, with kitchen display, diner tracking, and payments through your own merchant account.",
  alternates: { canonical: "/online-ordering" },
};

const stages = [
  {
    title: "Menu",
    body: "Guests browse categories and dishes as real pages — the same HTML Google indexed.",
    url: "demokitchen.sabalsites.com/menu",
    label: "Sabal Demo Kitchen ordering menu",
    visual: <StorefrontMenuMock />,
  },
  {
    title: "Item sheet",
    body: "A dish opens with its photo, modifiers, and price. Nothing is trapped in an app store listing.",
    url: "demokitchen.sabalsites.com/menu/citrus-herb-chicken",
    label: "Item sheet for citrus herb chicken on Sabal Demo Kitchen",
    visual: <ItemSheetMock />,
  },
  {
    title: "Checkout",
    body: "Pickup on your domain. Delivery through our delivery-network partner. Card charges settle to your merchant account.",
    url: "demokitchen.sabalsites.com/checkout",
    label: "Checkout and cart on Sabal Demo Kitchen",
    visual: <CartCheckoutMock />,
  },
  {
    title: "Confirmation",
    body: "The diner gets a tracking page on your domain and an SMS as the ticket moves. No marketplace app in the middle.",
    url: "demokitchen.sabalsites.com/order/track/1041",
    label: "Order confirmation and tracking on Sabal Demo Kitchen",
    visual: <ConfirmationMock />,
  },
  {
    title: "Kitchen",
    body: "The ticket hits the kitchen display. The diner can follow it. SMS goes out as the status changes.",
    url: "app.sabal.ai/kds",
    label: "Kitchen display tickets in the Sabal KDS",
    visual: <KdsMock />,
    id: "kitchen",
  },
] as const;

export default function OnlineOrderingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Online ordering", path: "/online-ordering" },
        ])}
      />
      <Container className="py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
          Direct orders
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl tracking-tight sm:text-6xl">
          Orders that stay on your site.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
          Menu, item sheet, checkout, confirmation, kitchen display. Multi-location
          when you need it. The domain is yours and you keep it.
        </p>
      </Container>

      {stages.map((stage) => (
        <section key={stage.title} id={"id" in stage ? stage.id : undefined} className="border-t border-line">
          <Container className="grid items-center gap-10 py-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl tracking-tight">{stage.title}</h2>
              <p className="mt-4 max-w-md text-base leading-7 text-ink-soft">{stage.body}</p>
            </div>
            <BrowserFrame url={stage.url} label={stage.label}>
              {stage.visual}
            </BrowserFrame>
          </Container>
        </section>
      ))}

      <section className="border-y border-line bg-sand/40">
        <Container className="py-16">
          <h2 className="font-display text-3xl tracking-tight">Payments you hold</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
            Guests pay the restaurant, not a marketplace wallet. Card data is
            tokenized through your merchant account. Sabal never needs the
            kitchen to split a ticket with a third party to get paid.
          </p>
          <h2 className="mt-12 font-display text-3xl tracking-tight">Row-level isolation</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
            Tenant data is separated at the database row. Dashboard roles are
            scoped. The storefront only sees what that restaurant published.
          </p>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
