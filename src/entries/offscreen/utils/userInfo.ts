import { format } from "date-fns";
import type { IUserInfo } from "@ptd/site";
import { EResultParseStatus } from "@ptd/site";

import { onMessage, sendMessage } from "@/messages.ts";
import { type TUserInfoStorageSchema } from "@/storage.ts";
import { type IMetadataPiniaStorageSchema } from "@/shared/storages/types/metadata.ts";
import { getSiteInstance } from "./site.ts";

export async function getSiteUserConfig(siteId: string) {
  const site = await getSiteInstance<"private">(siteId);

  // 获取历史信息
  const metadataStoreRaw = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
  let lastUserInfo = metadataStoreRaw?.lastUserInfo?.[siteId as string] ?? {};
  if ((lastUserInfo as IUserInfo).status !== EResultParseStatus.success) {
    lastUserInfo = {} as IUserInfo;
  }

  let userInfo = await site.getUserInfoResult(lastUserInfo);
  await setSiteLastUserInfo(userInfo);
  return userInfo;
}

onMessage("getSiteUserInfoResult", async ({ data: siteId }) => await getSiteUserConfig(siteId));

export async function setSiteLastUserInfo(userData: IUserInfo) {
  console.log("setSiteLastUserInfo", userData);
  const site = userData.site;

  // 存储用户信息到 metadata 中（ pinia/webExtPersistence 会自动同步该部分信息 ）
  const metadataStore = ((await sendMessage("getExtStorage", "metadata")) ?? {}) as IMetadataPiniaStorageSchema;
  (metadataStore as IMetadataPiniaStorageSchema).lastUserInfo ??= {};
  (metadataStore as IMetadataPiniaStorageSchema).lastUserInfo[site] = userData;
  await sendMessage("setExtStorage", { key: "metadata", value: metadataStore });

  // 存储用户信息到 userInfo 中（仅当获取成功时）
  if (userData.status === EResultParseStatus.success) {
    const userInfoStore = ((await sendMessage("getExtStorage", "userInfo")) ?? {}) as TUserInfoStorageSchema;
    userInfoStore[site] ??= {};
    const dateTime = format(userData.updateAt, "yyyy-MM-dd");
    userInfoStore[site][dateTime] = userData;
    await sendMessage("setExtStorage", { key: "userInfo", value: userInfoStore });
  }
}

onMessage("setSiteLastUserInfo", async ({ data: userData }) => await setSiteLastUserInfo(userData));

onMessage("getSiteUserInfo", async ({ data: siteId }) => {
  const userInfoStore = ((await sendMessage("getExtStorage", "userInfo")) ?? {}) as TUserInfoStorageSchema;
  return userInfoStore?.[siteId] ?? {};
});

onMessage("removeSiteUserInfo", async ({ data: { siteId, date } }) => {
  const userInfoStore = ((await sendMessage("getExtStorage", "userInfo")) ?? {}) as TUserInfoStorageSchema;
  delete userInfoStore?.[siteId]?.[date];
  await sendMessage("setExtStorage", { key: "userInfo", value: userInfoStore! });
});
