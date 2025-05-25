import PQueue from "p-queue";
import { format } from "date-fns";
import type { IUserInfo } from "@ptd/site";
import { EResultParseStatus } from "@ptd/site";

import { onMessage, sendMessage } from "@/messages.ts";
import { type IConfigPiniaStorageSchema, type TUserInfoStorageSchema } from "@/storage.ts";
import { type IMetadataPiniaStorageSchema } from "@/shared/storages/types/metadata.ts";
import { logger } from "./logger.ts";
import { getSiteInstance } from "./site.ts";

const flushQueue = new PQueue({ concurrency: 1 }); // 默认设置为 1，避免并发搜索

flushQueue.on("active", async () => {
  const configStoreRaw = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;
  const queueConcurrency = configStoreRaw?.userInfo?.queueConcurrency ?? 1;

  if (flushQueue.concurrency != queueConcurrency) {
    flushQueue.concurrency = queueConcurrency;
    logger({
      msg: `The concurrency of the user information refresh queue has been updated to ${flushQueue.concurrency}`,
    });
  }
});

onMessage("cancelUserInfoQueue", () => {
  flushQueue.clear();
});

export async function getSiteUserInfoResult(siteId: string) {
  return (await flushQueue.add(async () => {
    logger({ msg: `getSiteUserInfoResult for ${siteId}` });
    // 获取站点实例
    const site = await getSiteInstance<"private">(siteId);

    // 获取历史信息
    const metadataStoreRaw = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
    let lastUserInfo = metadataStoreRaw?.lastUserInfo?.[siteId as string] ?? {};
    if ((lastUserInfo as IUserInfo).status !== EResultParseStatus.success) {
      lastUserInfo = {} as IUserInfo;
    }

    // 调用站点实例获取用户信息
    let userInfo = await site.getUserInfoResult(lastUserInfo);
    await setSiteLastUserInfo(userInfo);
    return userInfo!;
  }))!;
}

onMessage("getSiteUserInfoResult", async ({ data: siteId }) => await getSiteUserInfoResult(siteId));

export async function setSiteLastUserInfo(userData: IUserInfo) {
  logger({ msg: `setSiteLastUserInfo for ${userData.site}`, data: userData });
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
