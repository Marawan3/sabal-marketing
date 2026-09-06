import { SmartLink } from "@/components/smart-link";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CtaLink, TextLink } from "@/components/cta-link";
import { Chain, Flow } from "@/components/flow";
import { JsonLd } from "@/components/json-ld";
import { ProductLinks } from "@/components/product-links";
import { ScreenFrame } from "@/components/screen-frame";
import { Section, SectionHead } from "@/components/section";
import { bySlug, lifecycle } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { faqSchema } from "@/lib/schema";
import { demoHref, menuCheckHref, site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: { absolute: `WunTab: ${copy.hero.headline}` },
  description: site.description,
  alternates: { canonical: "/" },
};

function Check() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-1 shrink-0"
    >
      <path d="M3.5 9.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

function LinkList({ items }: { items: readonly { name: string; slug: string }[] }) {
  return (
    <ul className="grid gap-x-12 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.name} className="border-t border-mist py-3">
          <SmartLink
            href={`/${item.slug}`}
            className="text-body font-medium underline decoration-transparent underline-offset-4 hover:decoration-ink"
          >
            {item.name}
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  const delivery = bySlug.delivery;
  const guest = bySlug["guest-feedback"];
  const catering = bySlug.catering;
  return (
    <>
      <JsonLd data={faqSchema(copy.faq.items)} />

      {/* 2. Platform hero */}
      <section id="top" className="scroll-mt-20">
        <Container className="pt-20 pb-16 sm:pt-28 lg:pt-32">
          <h1 className="max-w-[18ch] text-display">{copy.hero.headline}</h1>
          <p className="mt-8 max-w-[52ch] text-lead text-ink/80">{copy.hero.sub}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
            <TextLink href="/how-it-works">{copy.cta.secondary}</TextLink>
          </div>
        </Container>
        <Container className="pb-20 lg:pb-28">
          {/* Website with the phone overlapping it; dashboard and kitchen stacked beside. */}
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="relative lg:col-span-8">
              <ScreenFrame shot={copy.hero.screens[0]} priority />
              <div className="absolute -bottom-6 right-6 w-[120px] sm:w-[150px] lg:-bottom-8 lg:right-8">
                <ScreenFrame shot={copy.hero.screens[1]} />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:gap-4">
              <ScreenFrame shot={copy.hero.screens[2]} />
              <ScreenFrame shot={copy.hero.screens[3]} />
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Product proof: the lifecycle */}
      <Section id="proof" tone="ticket">
        <SectionHead heading={copy.proof.heading} sub={copy.proof.sub} />
        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {lifecycle.map((stage, index) => (
            <li key={stage.name} className="border-t border-ink/15 pt-5">
              <p className="text-small tabular-nums text-ink/72">{index + 1}</p>
              <h3 className="mt-2 text-h3">{stage.name}</h3>
              <p className="mt-2 max-w-[36ch] text-body text-ink/80">{stage.body}</p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-small font-medium">
                {stage.products.map((slug) => (
                  <li key={slug}>
                    <SmartLink href={`/${slug}`} className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                      {bySlug[slug].name}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      {/* 4. Sell directly */}
      <Section id="sell">
        <SectionHead kicker="Sell" heading={copy.sell.heading} sub={copy.sell.sub} />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ScreenFrame shot={bySlug["online-ordering"].shots[0]} />
          </div>
          <div className="lg:col-span-8">
            <ProductLinks
              slugs={["online-ordering", "delivery", "catering", "table-ordering", "kiosk", "restaurant-app"]}
              columns={2}
            />
          </div>
        </div>
      </Section>

      {/* 5. Website + discovery */}
      <Section id="discovery">
        <SectionHead kicker="Grow" heading={copy.discovery.heading} sub={copy.discovery.sub} />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProductLinks
              slugs={["restaurant-websites", "restaurant-seo", "online-menu", "listings"]}
              columns={1}
            />
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[16px] bg-ticket p-8">
              <h3 className="text-h3">{copy.discovery.checkCta}</h3>
              <p className="mt-3 text-body text-ink/80">{copy.discovery.checkBody}</p>
              <CtaLink href="/menu-check" className="mt-6">
                {copy.discovery.checkCta}
              </CtaLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. Delivery */}
      <Section id="delivery" tone="ink">
        <SectionHead kicker="Sell" heading={copy.delivery.heading} sub={copy.delivery.sub} dark />
        <div className="mt-14">
          <Flow steps={delivery.flow!.steps} dark />
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {delivery.shots.map((shot) => (
            <ScreenFrame key={shot.key} shot={shot} dark />
          ))}
        </div>
        <p className="mt-10">
          <TextLink href="/delivery" className="text-paper decoration-paper/40 hover:decoration-paper">
            More about delivery
          </TextLink>
        </p>
      </Section>

      {/* 7. Catering */}
      <Section id="catering">
        <SectionHead kicker="Sell" heading={copy.catering.heading} sub={copy.catering.sub} />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <ul className="space-y-4 lg:col-span-5">
            {catering.capabilities.map((item) => (
              <li key={item} className="flex gap-3 text-body">
                <Check />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
            {catering.shots.map((shot) => (
              <ScreenFrame key={shot.key} shot={shot} />
            ))}
          </div>
        </div>
        <p className="mt-10">
          <TextLink href="/catering">More about catering</TextLink>
        </p>
      </Section>

      {/* 8. Guest experience */}
      <Section id="guest" tone="paper">
        <SectionHead kicker="Grow" heading={copy.guest.heading} sub={copy.guest.sub} />
        <div className="mt-14">
          <Flow steps={guest.flow!.steps} />
        </div>
        <div className="mt-12 border-t border-ink/10 pt-8">
          <p className="text-small font-medium text-ink/72">{copy.guest.chainIntro}</p>
          <div className="mt-4">
            <Chain items={copy.guest.chain} />
          </div>
        </div>
        <p className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
          <TextLink href="/guest-feedback">Guest feedback</TextLink>
          <TextLink href="/reviews">Reviews</TextLink>
          <TextLink href="/loyalty">Loyalty and rewards</TextLink>
        </p>
      </Section>

      {/* 9. Customer growth */}
      <Section id="growth" tone="ticket">
        <SectionHead kicker="Grow" heading={copy.growth.heading} sub={copy.growth.sub} />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <LinkList items={copy.growth.items} />
          </div>
          <div className="lg:col-span-5">
            <ScreenFrame shot={bySlug["restaurant-marketing"].shots[0]} />
          </div>
        </div>
      </Section>

      {/* 10. Operations */}
      <Section id="operations">
        <SectionHead kicker="Operate" heading={copy.operations.heading} sub={copy.operations.sub} />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <LinkList items={copy.operations.items} />
          </div>
          <div className="lg:col-span-7">
            <ScreenFrame shot={bySlug["order-management"].shots[0]} />
          </div>
        </div>
      </Section>

      {/* 11. Analytics */}
      <Section id="analytics" tone="ticket">
        <SectionHead kicker="Operate" heading={copy.analytics.heading} sub={copy.analytics.sub} />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ScreenFrame shot={bySlug.analytics.shots[0]} />
          </div>
          <ul className="space-y-4 lg:col-span-5">
            {bySlug.analytics.capabilities.map((item) => (
              <li key={item} className="flex gap-3 text-body">
                <Check />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 12. Multi-location */}
      <Section id="scale">
        <SectionHead kicker="Scale" heading={copy.scale.heading} sub={copy.scale.sub} />
        <div className="mt-12">
          <ProductLinks slugs={["multi-location", "enterprise", "ai"]} columns={3} />
        </div>
      </Section>

      {/* 13. Integrations */}
      <Section id="integrations">
        <SectionHead kicker="Scale" heading={copy.integrations.heading} />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <ul className="space-y-4 lg:col-span-5">
            {copy.integrations.available.map((item) => (
              <li key={item} className="flex gap-3 text-body">
                <Check />
                <span>{item}</span>
              </li>
            ))}
            {copy.integrations.comingSoon.map((item) => (
              <li key={item} className="flex items-center gap-3 text-body text-ink/72">
                <span className="rounded-[6px] bg-ticket px-2 py-0.5 text-small font-medium text-ink">
                  {copy.integrations.comingSoonLabel}
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="max-w-[48ch] text-body text-ink/80 lg:col-span-7">
            <TextLink href="/integrations">See all integrations</TextLink>
          </p>
        </div>
      </Section>

      {/* 14. Pricing */}
      <Section id="pricing" tone="ticket">
        <h2 className="text-h2">{copy.pricing.heading}</h2>
        <div className="mt-14 max-w-[640px] ticket-shadow">
          <div className="ticket px-6 pt-8 pb-12 sm:px-10 sm:pt-10 sm:pb-14">
            <p className="text-stat">{copy.pricing.stat}</p>
            <p className="mt-4 text-lead font-medium">{copy.pricing.line}</p>
            <p className="mt-4 max-w-[52ch] text-body text-ink/80">{copy.pricing.body}</p>
            <p className="mt-4 max-w-[52ch] text-small text-ink/72">{copy.pricing.more}</p>
            <CtaLink href={demoHref} className="mt-8">
              {copy.cta.primary}
            </CtaLink>
          </div>
        </div>
      </Section>

      {/* 15. Customer proof */}
      <Section id="customer-proof">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <h2 className="text-h2">{copy.customerProof.heading}</h2>
            <p className="mt-6 max-w-[52ch] text-lead text-ink/80">{copy.customerProof.body}</p>
            <p className="mt-6 max-w-[52ch] text-small text-ink/72">{copy.customerProof.footnote}</p>
            <p className="mt-6">
              <TextLink href="/menu-check">{copy.discovery.checkCta}</TextLink>
            </p>
          </div>
          <div className="lg:col-span-6">
            <ScreenFrame shot={copy.customerProof.shot} />
          </div>
        </div>
      </Section>

      {/* 16. FAQ */}
      <Section id="faq">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <h2 className="text-h2 lg:col-span-5">{copy.faq.heading}</h2>
          <div className="faq divide-y divide-mist border-y border-mist lg:col-span-7">
            {copy.faq.items.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer items-center gap-4 py-5 text-h3">
                  {item.question}
                </summary>
                <p className="max-w-[56ch] pb-6 text-body text-ink/80">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* 17. Final CTA */}
      <Section id="cta" tone="ink">
        <div className="text-center">
          <h2 className="mx-auto max-w-[20ch] text-h2">{copy.finalCta.heading}</h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-lead text-paper/80">{copy.finalCta.body}</p>
          <div className="mt-10">
            <CtaLink href={demoHref}>{copy.cta.primary}</CtaLink>
          </div>
          <p className="mt-6 text-small text-paper/70">
            or email{" "}
            <SmartLink
              href={`mailto:${site.contactEmail}`}
              className="font-medium text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
            >
              {site.contactEmail}
            </SmartLink>
            {" · "}
            <SmartLink href={menuCheckHref} className="font-medium text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper">
              {copy.discovery.checkCta}
            </SmartLink>
          </p>
        </div>
      </Section>
    </>
  );
}
