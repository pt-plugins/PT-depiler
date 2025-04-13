/**
 * 注意： 所有的 IndexDB 如果需要在 options 等页面使用，则需要在 offscreen 中注册代理，确保 IndexDB 只在 offscreen 页面打开！
 */
import { openDB, type IDBPDatabase } from "idb";
import { getSocialSiteInformation, type ISocialInformation, type TSupportSocialSite } from "@ptd/social";
import type { IPtdDBSchema, ITorrentDownloadMetadata } from "./types/indexdb";
import type { IPtdDBSchemaV1, TTorrentDownloadKey } from "./types/indexdb";

export const ptdIndexDb = openDB<IPtdDBSchema>("ptd", 2, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      const dbV1 = db as unknown as IDBPDatabase<IPtdDBSchemaV1>;
      dbV1.createObjectStore("social_information");
    }
    if (oldVersion < 2) {
      db.createObjectStore("download_history", { keyPath: "id", autoIncrement: true });
    }
  },
});

export async function getSocialInformation(site: TSupportSocialSite, sid: string): Promise<ISocialInformation> {
  const key = `${site}:${sid}`;
  let stored = await (await ptdIndexDb).get("social_information", key);
  if (!stored) {
    stored = await getSocialSiteInformation(site, sid, {});
    if (stored) {
      await setSocialInformation(site, sid, stored);
    }
  }

  return stored as ISocialInformation;
}

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

export async function getDownloadHistory() {
  return await (await ptdIndexDb).getAll("download_history");
}

export async function getDownloadHistoryById(id: TTorrentDownloadKey) {
  return await (await ptdIndexDb).get("download_history", id);
}

export async function setDownloadHistory(data: ITorrentDownloadMetadata) {
  return await (await ptdIndexDb).put("download_history", data);
}
