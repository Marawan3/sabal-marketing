import { copy } from "@/lib/copy";
import { demoCatering as c } from "@/lib/demo-data";
import { demoOrder as o } from "@/lib/demo-order";
import h from "../hero-order-demo.module.css";
import { DemoImg } from "../demo-img";
import { Field, Phone, SiteHeader } from "./phone";
import { Tap, Visual } from "./visual";
import v from "./visuals.module.css";

/** Steps: 1 scroll to the form, 2 tap Send, 3 "Thank you." */
const STEPS = [0, 1200, 2900, 3400, 4300];

/**
 * The demo restaurant's catering page, as the product has it today: its
 * photo of a catering spread, the page's own words, then its enquiry form (event date, guests, a note) and
 * the form's thank-you. The product takes catering as an enquiry; there is
 * no catering checkout, lead time or minimum in it yet.
 */
export function CateringPhone({ cut = false, width, still = false }: { cut?: boolean; width?: string; still?: boolean }) {
  return (
    <Visual name="catering" steps={STEPS} description={copy.visuals.catering} className={v.catering} still={still}>
      <Phone cut={cut} width={width}>
        <div className={v.layer}>
          <SiteHeader />
          <div className={v.scrollA}>
            <DemoImg src={c.photo} width={900} height={600} className={v.pagePhoto} />
            <div className={v.pad}>
              <div className={h.stack}>
                <div className={v.siteH1}>{c.heading}</div>
                <div>{c.body}</div>
              </div>
              <div className={v.formBox}>
                <div className={v.swapForm}>
                  <div className={v.formFields}>
                    <div className={h.title}>{c.form}</div>
                    <Field label="Your name" value={c.name} />
                    <Field label="Email" value={c.email} />
                    <Field label="Phone" value={o.checkout.phone} />
                    <div className={v.grid2}>
                      <Field label="Event date" value={<span data-clock="date" data-add={String(14 * 24 * 60)} />} />
                      <Field label="Guests" value={c.guests} />
                    </div>
                    <Field label="Tell us about the event" value={c.event} tall />
                    <span className={h.meta}>{c.hint}</span>
                    <span className={`${v.sendButton} ${v.pillAction}`}>
                      <span className={v.swap2}>
                        <span>Send</span>
                        <span>Sending…</span>
                      </span>
                      <Tap step={2} x={40} y={22} />
                    </span>
                    <span className={h.meta}>{c.promise}</span>
                  </div>
                  {/* A still is the first screen only: no thank-you. */}
                  {still ? null : (
                    <div className={v.thanks}>
                      <b>Thank you.</b>
                      <span>{c.promise}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Phone>
    </Visual>
  );
}
