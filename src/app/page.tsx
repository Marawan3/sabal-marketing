import type { Metadata } from "next";
import Link from "next/link";
import { BrowserFrame } from "@/components/browser-frame";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { StorefrontMenuMock } from "@/components/mocks/storefront-menu-mock";
import { DemoForm } from "@/components/demo-form";
import { softwareApplicationSchema } from "@/lib/schema";
import { demoKitchen } from "@/lib/demo-kitchen";
import { site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: { absolute: "Sabal — Restaurant websites that rank, and ordering you own" },
  description: site.description,
  alternates: { canonical: "/" },
};

const pillars = [
  {
    href: "/restaurant-seo",
    title: "Get found on Google",
    body: "Your menu becomes real web pages. Dishes, neighborhoods, hours, and schema — generated from the same data the kitchen uses.",
  },
  {
    href: "/online-ordering",
    title: "Take orders directly",
    body: "Pickup and delivery checkout on your domain. Your customers, your data, your merchant account.",
  },
  {
    href: "/online-ordering#kitchen",
    title: "Run the kitchen",
    body: "Tickets land on a kitchen display. Diners get tracking and SMS as the ticket moves.",
  },
  {
    href: "/restaurant-seo#checklist",
    title: "Know it's working",
    body: "A launch checklist that will not call the site ready until the menu, schema, photos, and Google Business Profile all check out.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <section className="overflow-hidden">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-palm">
              Restaurant websites + ordering
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Your restaurant&apos;s website should be your best salesperson.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
              Sabal gives restaurants a website built to rank on Google and an
              ordering system built to convert — on your own domain, with your
              own customers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="rounded-full bg-palm-deep px-6 py-3 text-sm font-semibold text-paper hover:bg-palm"
              >
                Book a demo
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold hover:bg-sand"
              >
                See how it works
              </Link>
            </div>
          </div>
          <BrowserFrame
            url={demoKitchen.url}
            label="Sabal Demo Kitchen storefront menu in a browser frame"
          >
            <StorefrontMenuMock />
          </BrowserFrame>
        </Container>
      </section>

      <section className="border-y border-line bg-sand/50">
        <Container className="grid gap-8 py-14 md:grid-cols-3">
          <Problem
            title="Marketplaces own the guest"
            body="They charge commissions and keep the customer relationship. You cook. They stay in the middle."
          />
          <Problem
            title="Most website builders hide the menu"
            body="PDFs, photos of chalkboard specials, and client-only rendering leave Google with a blank page."
          />
          <Problem
            title="Dish searches miss you"
            body={`Most restaurant sites never show up for “grove greens near me.” The menu never became a page.`}
          />
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <h2 className="max-w-2xl font-display text-3xl tracking-tight sm:text-4xl">
            Four things Sabal actually does.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {pillars.map((pillar, index) => (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="rounded-2xl border border-line bg-white p-6 hover:border-palm/40"
              >
                <p className="font-display text-sm text-palm">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-2xl">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{pillar.body}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-palm-deep">
                  Learn more
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-leaf/40">
        <Container className="py-16">
          <h2 className="font-display text-3xl tracking-tight">
            We practice what we sell.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
            This site and every Sabal storefront ship as server-rendered HTML,
            with structured data and a clean sitemap. There is no testimonial
            wall here. View source on this page. If Google can read it, a diner
            searching for a dish can too.
          </p>
        </Container>
      </section>

      <section>
        <Container className="grid items-start gap-12 py-20 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl tracking-tight">
              Book a walkthrough of your menu.
            </h2>
            <p className="mt-3 max-w-md text-ink-soft">
              Built by a small team obsessed with restaurant SEO. We onboard
              every restaurant personally.
            </p>
          </div>
          <DemoForm />
        </Container>
      </section>
      <CtaBand />
    </>
  );
}

function Problem({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-display text-xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{body}</p>
    </div>
  );
}
