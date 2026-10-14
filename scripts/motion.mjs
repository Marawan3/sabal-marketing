#!/usr/bin/env node
/**
 * Writes each built visual's story as CSS @keyframes (from motion-spec.mjs)
 * into its CSS module, between "motion:start" and "motion:end".
 *
 *   node scripts/motion.mjs          write the blocks
 *   node scripts/motion.mjs --check  exit 1 if a block is out of date
 *
 * Every animation starts when the page renders, paused; the player
 * (src/components/visual-player.tsx) lets it run on mount and pauses it while
 * the visual is fully off screen. Only opacity and transform move.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { visuals } from "./motion-spec.mjs";

const files = {
  visuals: "src/components/visuals/visuals.module.css",
  hero: "src/components/hero-order-demo.module.css",
};

const pct = (t, total) => `${+((t / total) * 100).toFixed(3)}%`;

/** The points of one track: [time, value, easing of the ramp that starts here], times relative to `t0`. */
function points(track, steps, extraDelay) {
  const at = (when) => (typeof when === "number" ? steps[when] : when.at) + extraDelay;
  let prev = track.start;
  const out = [];
  for (const [when, value] of track.changes) {
    const t = at(when);
    out.push({ t, value: prev, ease: track.ramp.ease, hold: true });
    out.push({ t: t + track.ramp.ms, value });
    prev = value;
  }
  return out;
}

const decl = (prop, value) => `${prop}: ${value};`;

/** One play-once track: delayed to its first change, ending on its last; null values only at the ends. */
function onceTrack(name, track, steps) {
  const pts = points(track, steps, track.delay ?? 0);
  const t0 = pts[0].t;
  const total = pts[pts.length - 1].t - t0;
  const frames = [];
  pts.forEach((p, i) => {
    const edge = i === 0 || i === pts.length - 1;
    if (p.value === null && !edge) throw new Error(`${name}: ${track.sel} returns to its own value mid-story; give it an explicit value`);
    if (p.value === null) return; // the element's own value: an implicit 0% or 100% keyframe
    const ease = p.hold ? ` animation-timing-function: ${p.ease};` : "";
    frames.push(`  ${pct(p.t - t0, total)} { ${decl(track.prop, p.value)}${ease} }`);
  });
  // A null start still needs its easing for the first ramp.
  if (pts[0].value === null) frames.unshift(`  0% { animation-timing-function: ${pts[0].ease}; }`);
  return { keyframes: `@keyframes ${name} {\n${frames.join("\n")}\n}`, use: `${name} ${total}ms linear ${t0}ms both` };
}

/** One looping track: the whole loop, every value spelled out, from 0% to 100%. */
function loopTrack(name, track, steps, loop) {
  const pts = points(track, steps, track.delay ?? 0).map((p) => (track.clip && p.t > loop ? { ...p, t: loop } : p));
  if (track.start === null || pts.some((p) => p.value === null)) throw new Error(`${name}: loop tracks need explicit values`);
  if (pts.some((p) => p.t > loop)) throw new Error(`${name}: ${track.sel} runs past the end of the loop`);
  const frames = [`  0% { ${decl(track.prop, track.start)} }`];
  for (const p of pts) {
    const ease = p.hold ? ` animation-timing-function: ${p.ease};` : "";
    frames.push(`  ${pct(p.t, loop)} { ${decl(track.prop, p.value)}${ease} }`);
  }
  frames.push(`  100% { ${decl(track.prop, pts[pts.length - 1].value)} }`);
  return { keyframes: `@keyframes ${name} {\n${frames.join("\n")}\n}`, use: `${name} ${loop}ms linear 0ms infinite both` };
}

/** A tap ring: the module's own tap pulse (600 ms) at the step's time. */
function tapTrack(name, track, steps, loop) {
  const t = steps[track.tap];
  if (!loop) return { use: `tap 600ms ease-out ${t}ms both` };
  const f = (dt, opacity, scale) => `  ${pct(t + dt, loop)} { opacity: ${opacity}; transform: scale(${scale}); animation-timing-function: ease-out; }`;
  const frames = [
    `  0% { opacity: 0; transform: scale(0.4); }`,
    f(0, 0, 0.4),
    f(210, 1, 1),
    f(600, 0, 1.15),
    `  100% { opacity: 0; transform: scale(1.15); }`,
  ];
  return { keyframes: `@keyframes ${name} {\n${frames.join("\n")}\n}`, use: `${name} ${loop}ms linear 0ms infinite both` };
}

function block(file) {
  const keyframes = [];
  /** selector + media → animations, in spec order */
  const uses = new Map();
  for (const [vname, v] of Object.entries(visuals)) {
    if (v.file !== file) continue;
    v.tracks.forEach((track, i) => {
      const name = `m-${vname}-${i}`;
      const made =
        track.tap !== undefined
          ? tapTrack(name, track, v.steps, v.loop)
          : v.loop
            ? loopTrack(name, track, v.steps, v.loop)
            : onceTrack(name, track, v.steps);
      if (made.keyframes) keyframes.push(made.keyframes);
      const key = `${track.media ?? ""}|${track.sel}`;
      if (!uses.has(key)) uses.set(key, []);
      uses.get(key).push(made.use);
      // The hero's first run starts on the menu: hold this value through the first ramp.
      if (track.firstRun !== undefined) {
        const first = `${name}-first`;
        keyframes.push(`@keyframes ${first} {\n  0%, 100% { ${decl(track.prop, track.firstRun)} }\n}`);
        uses.get(key).push(`${first} ${track.ramp.ms}ms linear 0ms 1 none`);
      }
    });
  }
  const rules = [];
  for (const [key, list] of uses) {
    const [media, sel] = key.split("|");
    const rule = `${sel} {\n  animation: ${list.join(",\n    ")};\n}`;
    rules.push(media ? `@media ${media} {\n${rule.replace(/^/gm, "  ")}\n}` : rule);
  }
  return [
    "/* motion:start (generated by scripts/motion.mjs from scripts/motion-spec.mjs; edit those, then npm run motion) */",
    "@media (prefers-reduced-motion: no-preference) {",
    ...rules.map((r) => r.replace(/^/gm, "  ")),
    "}",
    ...keyframes,
    "/* motion:end */",
  ].join("\n");
}

const check = process.argv.includes("--check");
let stale = false;
for (const [file, path] of Object.entries(files)) {
  const full = join(process.cwd(), path);
  const css = readFileSync(full, "utf8");
  const start = css.indexOf("/* motion:start");
  const end = css.indexOf("/* motion:end */");
  const next = block(file);
  const updated =
    start === -1 ? `${css.trimEnd()}\n\n${next}\n` : `${css.slice(0, start)}${next}${css.slice(end + "/* motion:end */".length)}`;
  if (updated !== css) {
    stale = true;
    if (!check) writeFileSync(full, updated);
  }
  console.log(`${check ? "checked" : "wrote"} ${path}`);
}
if (check && stale) {
  console.error("motion: a generated block is out of date; run npm run motion");
  process.exit(1);
}
