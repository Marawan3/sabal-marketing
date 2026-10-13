import { copy } from "@/lib/copy";
import { demoSettings as d } from "@/lib/demo-data";
import { Visual } from "./visual";
import v from "./visuals.module.css";

/** Steps: 1 Adjust prep time is pressed, 2 prep time and the ASAP quote go up. */
const STEPS = [0, 800, 1200, 2000];

/**
 * The dashboard's Online ordering card (batch 1's ordering-settings
 * capture): accepting orders, current prep time, the ASAP quote, closing
 * time, and the two quick controls. Still, except prep time going from 20 to
 * 25 minutes when it scrolls in.
 */
export function SettingsCard() {
  return (
    <Visual name="settings" steps={STEPS} description={copy.visuals.settings}>
      <div className={v.set}>
        <div className={v.setTitle}>{d.title}</div>
        <div className={v.dashLabel}>{d.sub}</div>
        <div className={v.setCard}>
          <div className={v.setOpen}>
            <span className={v.setPill}>Open</span>
            <span>Accepting orders</span>
          </div>
          <div className={v.setStats}>
            <div>
              <div className={v.setLabel}>Current prep</div>
              <div className={`${v.setValue} ${v.flip}`}>
                <span>{d.prep[0]}</span>
                <span>{d.prep[1]}</span>
              </div>
            </div>
            <div>
              <div className={v.setLabel}>ASAP quote</div>
              <div className={`${v.setValue} ${v.flip}`}>
                <span>{d.quote[0]}</span>
                <span>{d.quote[1]}</span>
              </div>
            </div>
            <div>
              <div className={v.setLabel}>Closes at</div>
              <div className={v.setValue}>{d.closes}</div>
            </div>
          </div>
        </div>
        <div className={v.setQuick}>Quick controls</div>
        <div className={`${v.setButton} ${v.setPause}`}>Pause online ordering</div>
        <div className={`${v.setButton} ${v.setAdjust}`}>Adjust prep time</div>
      </div>
    </Visual>
  );
}
