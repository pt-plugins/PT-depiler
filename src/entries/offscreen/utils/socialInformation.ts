import type { ISocialInformation, TSupportSocialSite$1 } from "@ptd/social";
import { getSocialSiteInformation } from "@ptd/social";

import { onMessage, sendMessage } from "@/messages.ts";
import type { IConfigPiniaStorageSchema } from "@/shared/types.ts";

import { ptdIndexDb } from "../adapter/indexdb.ts";
import { logger } from "../utils/logger.ts";

interface IGetSocialInformationOptions {
  force?: boolean;
  requireSummary?: boolean;
  requireMetadata?: boolean;
}

// 记录本次会话中已经因缺失字段联网重取过的 key，避免对源本身就不提供
// 简介/元数据的条目在每次调用时反复联网（绕过 cacheDay TTL）。
const enrichmentAttemptedKeys = new Set<string>();

export async function getSocialInformation(
  site: TSupportSocialSite$1,
  sid: string,
  options: IGetSocialInformationOptions = {},
): Promise<ISocialInformation> {
  const configStoreRaw = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;
  const socialInformationConfig = configStoreRaw.socialSiteInformation ?? {};

  const key = `${site}:${sid}`;
  let stored = await (await ptdIndexDb).get("social_information", key);

  const isExpired = stored && stored.createAt < Date.now() - 86400000 * (socialInformationConfig.cacheDay ?? 3);
  // 仅在本会话尚未因缺失字段重取过该 key 时才允许补取，避免源本身无数据时反复联网。
  const canRetryForMissingFields = !enrichmentAttemptedKeys.has(key);
  const isMissingRequiredSummary = canRetryForMissingFields && options.requireSummary && stored && !stored.summary;
  const isMissingRequiredMetadata =
    canRetryForMissingFields &&
    options.requireMetadata &&
    stored &&
    (!stored.releaseYear || !stored.region || !stored.genres?.length);

  if (options.force || !stored || isExpired || isMissingRequiredSummary || isMissingRequiredMetadata) {
    if (isMissingRequiredSummary || isMissingRequiredMetadata) {
      enrichmentAttemptedKeys.add(key);
    }
    stored = await getSocialSiteInformation(site, sid, socialInformationConfig);
    if (stored && (stored.title !== "" || stored.poster !== "")) {
      await setSocialInformation(site, sid, stored);
    }
    logger({ msg: `getSocialInformation for ${site} with sid: ${sid}`, data: stored });
  }

  return stored as ISocialInformation;
}

onMessage("getSocialInformation", async ({ data: { site, sid } }) => await getSocialInformation(site, sid));

export async function setSocialInformation(site: TSupportSocialSite$1, sid: string, val: ISocialInformation) {
  const key = `${site}:${sid}`;
  return await (await ptdIndexDb).put("social_information", val, key);
}

export async function deleteSocialInformation(site: TSupportSocialSite$1, sid: string) {
  const key = `${site}:${sid}`;
  return await (await ptdIndexDb).delete("social_information", key);
}

export async function clearSocialInformation() {
  return await (await ptdIndexDb).clear("social_information");
}

onMessage("clearSocialInformationCache", async () => {
  await clearSocialInformation();
});
