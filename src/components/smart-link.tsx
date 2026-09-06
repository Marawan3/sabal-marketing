import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

/** True for internal routes; false for mailto, http(s), and same-page hashes. */
export function isInternalRoute(href: string) {
  return href.startsWith("/");
}

/**
 * next/link for internal routes, a plain anchor for everything else.
 * Prefetch is off: this is a static site with hundreds of links per page,
 * and per-link viewport prefetching was the largest hydration cost on mobile.
 * Safe in server and client components alike.
 */
export function SmartLink({ href, children, ...rest }: Props) {
  if (isInternalRoute(href)) {
    return (
      <Link href={href} prefetch={false} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
