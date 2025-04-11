import { openDB } from "idb";
import type { ISocialInformation, TSupportSocialSite } from "@ptd/social/types.ts";
import { getSocialSiteInformation } from "@ptd/social";

const dbPromise = openDB("social_information", 1, {
  upgrade(db) {
    db.createObjectStore("social_information");
  },
});
export async function get(site: TSupportSocialSite, sid: string) {
  const key = `${site}:${sid}`;
  let stored = await (await dbPromise).get("social_information", key);
  if (!stored) {
    stored = await getSocialSiteInformation(site, sid, {});
    if (stored) {
      await set(site, sid, stored);
    }
  }

  return stored;
}

export async function set(site: TSupportSocialSite, sid: string, val: ISocialInformation) {
  const key = `${site}:${sid}`;
  return (await dbPromise).put("social_information", val, key);
}

export async function del(site: TSupportSocialSite, sid: string) {
  const key = `${site}:${sid}`;
  return (await dbPromise).delete("keyval", key);
}

export async function clear() {
  return (await dbPromise).clear("keyval");
}

export async function keys() {
  return (await dbPromise).getAllKeys("keyval");
}
