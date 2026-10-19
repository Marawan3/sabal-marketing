import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactFromQuery, ContactView } from "@/components/contact-view";
import { Container } from "@/components/container";
import { copy } from "@/lib/copy";
import { demoHref, demoIsContactForm, site } from "@/lib/site";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Contact",
  description: copy.contact.line,
  alternates: { canonical: "/contact" },
};

/**
 * /contact (owner, 2026-10-13): a real form that emails hello@wuntab.com.
 * Get Started everywhere comes here as /contact?intent=call (owner,
 * 2026-10-19): the page then asks for a call, with the restaurant's name from
 * the hero filled in. The query is read in the browser, so the page stays
 * static; with no query it is the plain message form. No final band here:
 * the page is the call to action.
 */
export default function ContactPage() {
  // "Rather talk?" only while Get Started goes somewhere other than this form.
  const callHref = demoIsContactForm ? null : demoHref;
  return (
    <section>
      <Container className="pt-12 pb-16 sm:pt-20 sm:pb-20 lg:grid lg:grid-cols-12 lg:gap-12 lg:pt-24 lg:pb-28">
        <Suspense fallback={<ContactView intent="message" restaurant="" email={site.contactEmail} callHref={callHref} />}>
          <ContactFromQuery email={site.contactEmail} callHref={callHref} />
        </Suspense>
      </Container>
    </section>
  );
}
