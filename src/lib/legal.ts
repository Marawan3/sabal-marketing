import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  version: string;
  audience: string;
  body: string;
};

function parseFrontMatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw.trim() };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: match[2].trim() };
}

export const loadLegalDoc = cache(function loadLegalDoc(filename: string): LegalDoc {
  const raw = readFileSync(join(process.cwd(), "legal", filename), "utf8");
  const { meta, body } = parseFrontMatter(raw);
  return {
    slug: meta.slug ?? filename.replace(/\.md$/, ""),
    title: meta.title ?? filename,
    description: meta.description ?? "Draft — not yet attorney-reviewed.",
    version: meta.version ?? "0.1.0-draft",
    audience: meta.audience ?? "unspecified",
    body,
  };
});
