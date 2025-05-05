import type { ISocialInformation, TSupportSocialSite } from "@ptd/social";
import { getSocialSiteInformation } from "@ptd/social";
import { onMessage, sendMessage } from "@/messages.ts";
import { ptdIndexDb } from "@/offscreen/adapter/indexdb.ts";
import type { IConfigPiniaStorageSchema } from "@/shared/storages/types/config.ts";

export async function getSocialInformation(site: TSupportSocialSite, sid: string): Promise<ISocialInformation> {
  const key = `${site}:${sid}`;
  let stored = await (await ptdIndexDb).get("social_information", key);
  if (!stored) {
    const configStoreRaw = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;
    stored = await getSocialSiteInformation(site, sid, configStoreRaw.socialSiteInformation ?? {});
    if (stored && (stored.title !== "" || stored.poster !== "")) {
      await setSocialInformation(site, sid, stored);
    }
  }

  return stored as ISocialInformation;
}

onMessage("getSocialInformation", async ({ data: { site, sid } }) => await getSocialInformation(site, sid));

export async function setSocialInformation(site: TSupportSocialSite, sid: string, val: ISocialInformation) {
  const key = `${site}:${sid}`;
  return await (await ptdIndexDb).put("social_information", val, key);
}

export async function deleteSocialInformation(site: TSupportSocialSite, sid: string) {
  const key = `${site}:${sid}`;
  return await (await ptdIndexDb).delete("social_information", key);
}

export async function clearSocialInformation() {
  return await (await ptdIndexDb).clear("social_information");
}

onMessage("clearSocialInformationCache", async () => {
  await clearSocialInformation();
});
