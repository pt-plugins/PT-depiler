import PQueue from "p-queue";
import { format } from "date-fns";
import { isEmpty } from "es-toolkit/compat";
import type { IUserInfo } from "@ptd/site";
import { EResultParseStatus } from "@ptd/site";

import { onMessage, sendMessage } from "@/messages.ts";
import type { IMetadataPiniaStorageSchema, IConfigPiniaStorageSchema, TUserInfoStorageSchema } from "@/shared/types.ts";

import { logger } from "./logger.ts";
import { getSiteInstance } from "./site.ts";

const flushQueue = new PQueue({ concurrency: 1 }); // 默认设置为 1，避免并发搜索
const setSiteLastUserInfoQueue = new PQueue({ concurrency: 1 }); // 专门用于 setSiteLastUserInfo 的队列

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

    // 获取站点实例和配置信息
    const site = await getSiteInstance<"private">(siteId);

    // 尝试延长cookies
    try {
      await sendMessage("checkAndExtendCookies", site.url);
    } catch (error) {
      // 静默处理错误，不影响用户信息获取流程
      logger({ msg: `Failed to extend cookies for site ${siteId}`, level: "debug" });
    }

    // 获取历史信息
    const metadataStoreRaw = (await sendMessage("getExtStorage", "metadata")) as IMetadataPiniaStorageSchema;
    let lastUserInfo = metadataStoreRaw?.lastUserInfo?.[siteId as string] ?? {};
    if ((lastUserInfo as IUserInfo).status !== EResultParseStatus.success) {
      lastUserInfo = {} as IUserInfo;
    }

    let userInfo = lastUserInfo;
    if (site.allowQueryUserInfo) {
      // 调用站点实例获取用户信息
      userInfo = await site.getUserInfoResult(userInfo);
    } else if (site.metadata.type === "private" && !site.isOnline && isEmpty(lastUserInfo)) {
      // 如果 private 站点不允许查询用户信息（），则尝试从 userInfo 中获取最近一次的用户信息（回退），以避免 metadata.lastUserInfo 为 undefined 的情况
      const userInfoStore = ((await sendMessage("getExtStorage", "userInfo")) ?? {}) as TUserInfoStorageSchema;
      const userInfoSite = userInfoStore?.[siteId] ?? {};

      let maxDate = null;
      for (const date in userInfoSite) {
        if (
          userInfoSite[date].status === EResultParseStatus.success && // 如果是 PTPP 导入，可能存在 status 为 unknownError 的情况
          (!maxDate || new Date(date) > new Date(maxDate))
        ) {
          maxDate = date;
        }
      }

      if (maxDate) {
        userInfo = userInfoSite[maxDate];
      }
    }

    await setSiteLastUserInfo(userInfo);
    return userInfo!;
  }))!;
}

onMessage("getSiteUserInfoResult", async ({ data: siteId }) => await getSiteUserInfoResult(siteId));

export async function setSiteLastUserInfo(userData: IUserInfo) {
  return setSiteLastUserInfoQueue.add(async () => {
    logger({ msg: `setSiteLastUserInfo for ${userData.site}`, data: userData });
    const site = userData.site;

    // 并行获取两个存储区域的数据
    const [metadataStore, userInfoStore] = await Promise.all([
      sendMessage("getExtStorage", "metadata") as Promise<IMetadataPiniaStorageSchema>,
      userData.status === EResultParseStatus.success
        ? (sendMessage("getExtStorage", "userInfo") as Promise<TUserInfoStorageSchema>)
        : Promise.resolve(null),
    ]);

    // 准备 metadata 更新
    const updatedMetadataStore = (metadataStore ?? {}) as IMetadataPiniaStorageSchema;
    updatedMetadataStore.lastUserInfo ??= {};
    updatedMetadataStore.lastUserInfo[site] = userData;

    // 准备并行写入的操作数组
    const writeOperations = [sendMessage("setExtStorage", { key: "metadata", value: updatedMetadataStore })];

    // 如果需要更新 userInfo，准备第二个写入操作
    if (userData.status === EResultParseStatus.success && userInfoStore) {
      const updatedUserInfoStore = userInfoStore ?? ({} as TUserInfoStorageSchema);
      updatedUserInfoStore[site] ??= {};
      const dateTime = format(userData.updateAt, "yyyy-MM-dd");
      updatedUserInfoStore[site][dateTime] = userData;

      writeOperations.push(sendMessage("setExtStorage", { key: "userInfo", value: updatedUserInfoStore }));
    }

    // 并行执行所有写入操作
    await Promise.all(writeOperations);
  });
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
