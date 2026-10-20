/**
 * The menu's line icons (owner, 2026-10-20), drawn for WunTab: one per
 * product page (named by its slug) and one per solution page. Navy strokes
 * on a 24 grid, never saffron. Decorative: the link's name says it.
 */
const icons = {
  "online-ordering": (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  "online-menu": (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </>
  ),
  delivery: (
    <>
      <circle cx="6" cy="18" r="2" />
      <path d="M8 18h5a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h3" />
      <path d="M18 3.5a3 3 0 0 0-3 3c0 2.2 3 5 3 5s3-2.8 3-5a3 3 0 0 0-3-3z" />
    </>
  ),
  catering: (
    <>
      <path d="M5 17a7 7 0 0 1 14 0" />
      <path d="M12 10V8.5" />
      <path d="M3 17h18" />
      <path d="M4 20h16" />
    </>
  ),
  upsells: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
  "restaurant-websites": (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      <path d="M6.5 6.75h.01M9 6.75h.01" />
    </>
  ),
  "restaurant-seo": (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </>
  ),
  loyalty: <path d="M12 19.5s-7-4.3-7-9.5a4 4 0 0 1 7-2.6 4 4 0 0 1 7 2.6c0 5.2-7 9.5-7 9.5z" />,
  "order-management": (
    <>
      <path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  "menu-management": (
    <>
      <path d="M4 6h10M4 11h7M4 16h4" />
      <path d="M14 20l.6-2.6 5-5a1.4 1.4 0 0 1 2 2l-5 5z" />
    </>
  ),
  "kitchen-display": (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4M8 8v4M12 8v4M16 8v4" />
    </>
  ),
  payments: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  integrations: (
    <>
      <path d="M9 7V3.5M15 7V3.5" />
      <path d="M7 7h10v4a5 5 0 0 1-10 0z" />
      <path d="M12 16v4.5" />
    </>
  ),
  "sol-independent": (
    <>
      <path d="M4 10v10h16V10" />
      <path d="M3 10l1.5-5.5h15L21 10z" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  "sol-quick-service": (
    <>
      <circle cx="12" cy="13.5" r="7" />
      <path d="M12 10v3.5l2.5 1.5" />
      <path d="M10 3h4" />
    </>
  ),
  "sol-full-service": (
    <>
      <path d="M6 3v6a2 2 0 0 0 4 0V3M8 11v10" />
      <path d="M17 21V3c-2 1-3 3.5-3 7h3" />
    </>
  ),
  "sol-multi-location": (
    <>
      <path d="M8.5 20s-5-4.5-5-9a5 5 0 0 1 10 0c0 4.5-5 9-5 9z" />
      <circle cx="8.5" cy="11" r="1.75" />
      <path d="M15.5 6.2a5 5 0 0 1 5 4.8c0 3-2.2 5.9-3.6 7.5" />
    </>
  ),
};

export type IconName = keyof typeof icons;

/** Each solution page's icon: a storefront, a stopwatch, a fork and knife, two pins. */
export const solutionIcons: Record<string, IconName> = {
  "independent-restaurants": "sol-independent",
  "quick-service": "sol-quick-service",
  "full-service": "sol-full-service",
  "multi-location": "sol-multi-location",
};

export function isIconName(name: string): name is IconName {
  return name in icons;
}

/** 20px in the desktop menus, 22px in the phone menu. */
export function NavIcon({ name, size }: { name: IconName; size: 20 | 22 }) {
  return (
    <svg
      aria-hidden
      data-icon={name}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-navy"
    >
      {icons[name]}
    </svg>
  );
}
