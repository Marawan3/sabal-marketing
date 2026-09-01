import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern =
    /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\[[^\]]+\]|`[^`]+`)/g;
  let last = 0;
  let i = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) {
      parts.push(text.slice(last, start));
    }
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;
    if (token.startsWith("**")) {
      parts.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      parts.push(
        <code key={key} className="rounded bg-paper-2 px-1 text-sm">
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        parts.push(
          <a key={key} className="underline" href={link[2]}>
            {link[1]}
          </a>,
        );
      } else {
        parts.push(
          <span
            key={key}
            className="rounded bg-leaf/80 px-1 text-ink"
          >
            {token}
          </span>,
        );
      }
    }
    last = start + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function isList(lines: string[], marker: (line: string) => boolean) {
  return lines.length > 0 && lines.every((line) => marker(line) || line.trim() === "");
}

export function LegalMarkdown({ source }: { source: string }) {
  const blocks = source.split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        const key = `b-${index}`;
        if (trimmed === "---") {
          return <hr key={key} className="border-line" />;
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={key} className="mt-6 font-display text-xl text-ink">
              {inline(trimmed.slice(4), key)}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return <h3 key={key}>{inline(trimmed.slice(3), key)}</h3>;
        }
        if (trimmed.startsWith("# ")) {
          return <h2 key={key}>{inline(trimmed.slice(2), key)}</h2>;
        }
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={key}
              className="border-l-2 border-palm pl-4 text-sm text-ink"
            >
              {inline(trimmed.replace(/^>\s?/gm, ""), key)}
            </blockquote>
          );
        }
        const lines = trimmed.split("\n");
        if (isList(lines, (line) => /^[-*]\s/.test(line))) {
          return (
            <ul key={key} className="list-disc space-y-2 pl-5">
              {lines
                .filter((line) => line.trim())
                .map((line, li) => (
                  <li key={`${key}-${li}`}>
                    {inline(line.replace(/^[-*]\s/, ""), `${key}-${li}`)}
                  </li>
                ))}
            </ul>
          );
        }
        if (isList(lines, (line) => /^\d+\.\s/.test(line))) {
          return (
            <ol key={key} className="list-decimal space-y-2 pl-5">
              {lines
                .filter((line) => line.trim())
                .map((line, li) => (
                  <li key={`${key}-${li}`}>
                    {inline(line.replace(/^\d+\.\s/, ""), `${key}-${li}`)}
                  </li>
                ))}
            </ol>
          );
        }
        return <p key={key}>{inline(trimmed.replace(/\n/g, " "), key)}</p>;
      })}
    </>
  );
}
