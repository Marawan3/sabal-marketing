import { copy } from "@/lib/copy";
import { demoEditor as e } from "@/lib/demo-data";
import { demoOrder as o } from "@/lib/demo-order";
import { Visual } from "./visual";
import v from "./visuals.module.css";

/**
 * The dashboard's item editor (batch 1's menu-editor captures): photo, item
 * name, category, price and prep, availability, and modifier groups, for the
 * demo's Spiced Lamb Meatballs. A still: it shows what one edit touches.
 */
export function MenuEditor() {
  return (
    <Visual name="editor" steps={[0]} description={copy.visuals.editor}>
      <div className={v.me}>
        <div className={v.meHead}>
          <div className={v.meTitle}>{e.title}</div>
          <div className={v.meSub}>{e.sub}</div>
        </div>
        <div className={v.meBody}>
          <div className={v.meTop}>
            <div>
              <div className={v.meLabel}>Photo</div>
              {/* eslint-disable-next-line @next/next/no-img-element -- the hero's dish photo, at its own size */}
              <img src={o.dish.photo} alt="" width={o.dish.photoSize} height={o.dish.photoSize} className={v.mePhoto} decoding="async" />
            </div>
            <div className={v.meFields}>
              <div>
                <div className={v.meLabel}>Item name</div>
                <div className={v.meInput}>{e.title}</div>
              </div>
              <div>
                <div className={v.meLabel}>Category</div>
                <div className={v.meInput}>{e.category}</div>
              </div>
              <div className={v.mePair}>
                <div>
                  <div className={v.meLabel}>Price</div>
                  <div className={v.meInput}>{e.price}</div>
                </div>
                <div>
                  <div className={v.meLabel}>Prep (min)</div>
                  <div className={v.meInput}>{e.prep}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={v.meLabel}>Availability</div>
          <div className={v.meSeg}>
            {e.availability.map((label, i) => (
              <span key={label} className={i === 0 ? v.meOn : undefined}>
                {label}
              </span>
            ))}
          </div>
          <div className={v.meLabel}>Modifier groups</div>
          {e.groups.map((g) => (
            <div key={g.name} className={v.meGroup}>
              <span className={v.meGroupName}>{g.name}</span>
              <span className={v.meSub}>{g.meta}</span>
            </div>
          ))}
          <div className={v.meSave}>{e.save}</div>
        </div>
      </div>
    </Visual>
  );
}
