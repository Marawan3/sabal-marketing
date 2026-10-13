/**
 * Customer stories for the homepage row. Empty until the owner supplies real
 * customers: a real restaurant, a real result the owner can show, and the
 * owner's real name. Nothing here is ever invented, and the row renders
 * nothing while the list is empty. No photos: since 2026-10-13 the site
 * shows built visuals only.
 */
export type CustomerStory = {
  restaurant: string;
  owner: string;
  /** One short, real, checkable result. */
  result: string;
};

export const customerStories: CustomerStory[] = [];
