import type { ReactNode } from "react";

const base =
  "inline-flex items-center justify-center rounded-[8px] font-medium leading-none transition-colors duration-150";

const sizes = {
  md: "px-6 py-4 text-[1rem]",
  sm: "px-4 py-3 text-[0.9375rem]",
} as const;

/** The one action on the site. Saffron fill, ink text, everywhere. */
export function CtaLink({
  href,
  children,
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`${base} ${sizes[size]} bg-saffron text-ink hover:bg-saffron-deep ${className}`}
    >
      {children}
    </a>
  );
}

/** Secondary action: a plain underlined link, never a ghost button. */
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`font-medium underline decoration-ink/30 underline-offset-4 transition-colors duration-150 hover:decoration-ink ${className}`}
    >
      {children}
    </a>
  );
}
