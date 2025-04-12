/**
 * 存放一些不需要持久化（丢失没有关系的）的结构性数据
 */

import { openDB } from "idb";
import type { ISocialInformation, TSupportSocialSite } from "@ptd/social/types.ts";
import { getSocialSiteInformation } from "@ptd/social";

export const ptdIndexDb = openDB("ptd", 1, {
  upgrade(db) {
    db.createObjectStore("social_information");
  },
});

export async function getSocialInformation(site: TSupportSocialSite, sid: string) {
  const key = `${site}:${sid}`;
  let stored = await (await ptdIndexDb).get("social_information", key);
  if (!stored) {
    stored = await getSocialSiteInformation(site, sid, {});
    if (stored) {
      await setSocialInformation(site, sid, stored);
    }
  }

  return stored;
}

export async function setSocialInformation(site: TSupportSocialSite, sid: string, val: ISocialInformation) {
  const key = `${site}:${sid}`;
  return (await ptdIndexDb).put("social_information", val, key);
}

export async function deleteSocialInformation(site: TSupportSocialSite, sid: string) {
  const key = `${site}:${sid}`;
  return (await ptdIndexDb).delete("social_information", key);
}

export async function clearSocialInformation() {
  return (await ptdIndexDb).clear("social_information");
}
