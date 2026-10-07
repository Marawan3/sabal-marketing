import type { Shot } from "./catalog";

/**
 * Customer stories for the homepage row. Empty until the owner supplies real
 * customers: a real restaurant, a real result the owner can show, the owner's
 * real name, and a photo they agreed to. Nothing here is ever invented, and
 * the row renders nothing while the list is empty.
 *
 * Each photo goes in public/shots/ under its key and is listed in SHOTS.md.
 */
export type CustomerStory = {
  restaurant: string;
  owner: string;
  /** One short, real, checkable result. */
  result: string;
  photo: Shot & { kind: "photo" };
};

export const customerStories: CustomerStory[] = [];
