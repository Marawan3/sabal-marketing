/**
 * Customer stories: the homepage customer row and every product page's proof
 * slot read this one list. Empty until the owner supplies real
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
  /** Product pages whose proof slot shows this story (catalog slugs). Omitted: the homepage only. */
  products?: string[];
};

/** The stories for one product page's proof slot. */
export function storiesFor(slug: string, list: CustomerStory[] = customerStories) {
  return list.filter((story) => story.products?.includes(slug));
}

export const customerStories: CustomerStory[] = [];
