import PQueue from "p-queue";
import { format } from "date-fns";
import { isEmpty, unset } from "es-toolkit/compat";
import type { IUserInfo } from "@ptd/site";
import { EResultParseStatus } from "@ptd/site";

import { onMessage, sendMessage } from "@/messages.ts";
import type { IMetadataPiniaStorageSchema, IConfigPiniaStorageSchema, TUserInfoStorageSchema } from "@/shared/types.ts";

import { logger } from "./logger.ts";
import { getSiteInstance } from "./site.ts";

const flushQueue = new PQueue({ concurrency: 1 }); // 默认设置为 1，避免并发搜索
const setSiteLastUserInfoQueue = new PQueue({ concurrency: 1 }); // 专门用于 setSiteLastUserInfo 的队列

// 批量更新管理器
class BatchUserInfoManager {
  private pendingUpdates: IUserInfo[] = [];
  public batchSize: number = 5; // 默认批量大小，改为公共属性便于外部检查
  private batchTimeout: NodeJS.Timeout | null = null;

  updateBatchSize(size: number) {
    this.batchSize = Math.min(size, 5); // 不超过5
  }

  addPendingUpdate(userInfo: IUserInfo) {
    this.pendingUpdates.push(userInfo);
    logger({ msg: `Added user info to batch: ${userInfo.site} (${this.pendingUpdates.length}/${this.batchSize})` });

    // 检查是否达到批量大小
    if (this.pendingUpdates.length >= this.batchSize) {
      this.flushPendingUpdates();
    } else {
      // 设置2秒延迟批量写入
      this.scheduleDelayedFlush();
    }
  }

  private scheduleDelayedFlush() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this.flushPendingUpdates();
    }, 5000);
  }

  async flushPendingUpdates() {
    if (this.pendingUpdates.length === 0) return;

    const updatesBatch = [...this.pendingUpdates];
    this.pendingUpdates = [];

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    logger({ msg: `Batch flushing ${updatesBatch.length} user info updates` });

    try {
      await this.batchUpdateStorage(updatesBatch);
      logger({ msg: `Successfully batch updated ${updatesBatch.length} user info records` });
    } catch (error) {
      logger({ msg: `Failed to batch update user info: ${error}`, level: "error" });
      // 如果批量更新失败，回退到逐个更新
      for (const userInfo of updatesBatch) {
        try {
          await setSiteLastUserInfo(userInfo);
        } catch (e) {
          logger({ msg: `Failed to update user info for ${userInfo.site}: ${e}`, level: "error" });
        }
      }
    }
  }

  private async batchUpdateStorage(userInfoList: IUserInfo[]) {
    if (userInfoList.length === 0) return;

    // 批量更新 metadata 存储
    const metadataStore = ((await sendMessage("getExtStorage", "metadata")) ?? {}) as IMetadataPiniaStorageSchema;
    metadataStore.lastUserInfo ??= {};

    // 批量更新 userInfo 存储
    const userInfoStore = ((await sendMessage("getExtStorage", "userInfo")) ?? {}) as TUserInfoStorageSchema;

    // 预处理成功的用户信息数据
    const successfulUpdates = userInfoList.filter((userData) => userData.status === EResultParseStatus.success);

    for (const userData of userInfoList) {
      // 更新 metadata 中的最新用户信息
      metadataStore.lastUserInfo[userData.site] = userData;
    }

    // 批量处理成功的用户信息历史记录
    for (const userData of successfulUpdates) {
      userInfoStore[userData.site] ??= {};
      const dateTime = format(userData.updateAt, "yyyy-MM-dd");
      userInfoStore[userData.site][dateTime] = userData;
    }

    // 批量写入存储
    await Promise.all([
      sendMessage("setExtStorage", { key: "metadata", value: metadataStore }),
      sendMessage("setExtStorage", { key: "userInfo", value: userInfoStore }),
    ]);
  }

  reset() {
    this.pendingUpdates = [];
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }
}

const batchManager = new BatchUserInfoManager();

flushQueue.on("active", async () => {
  const configStoreRaw = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;
  const queueConcurrency = configStoreRaw?.userInfo?.queueConcurrency ?? 1;

  if (flushQueue.concurrency != queueConcurrency) {
    flushQueue.concurrency = queueConcurrency;
    logger({
      msg: `The concurrency of the user information refresh queue has been updated to ${flushQueue.concurrency}`,
    });
  }

  // 批量大小等于队列并发数，但不超过5
  const batchSize = Math.min(queueConcurrency, 5);
  if (batchManager.batchSize !== batchSize) {
    batchManager.updateBatchSize(batchSize);
    logger({
      msg: `Batch size updated to ${batchSize} (based on concurrency: ${queueConcurrency})`,
    });
  }
});

onMessage("cancelUserInfoQueue", () => {
  flushQueue.clear();
  logger({ msg: "User info queue canceled" });
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

    // 使用批量管理器处理存储更新，而不是立即调用 setSiteLastUserInfo
    batchManager.addPendingUpdate(userInfo);

    return userInfo!;
  }))!;
}

onMessage("getSiteUserInfoResult", async ({ data: siteId }) => await getSiteUserInfoResult(siteId));

export async function setSiteLastUserInfo(userData: IUserInfo) {
  return setSiteLastUserInfoQueue.add(async () => {
    logger({ msg: `setSiteLastUserInfo for ${userData.site}`, data: userData });
    const site = userData.site;

    // 存储用户信息到 metadata 中（ pinia/webExtPersistence 会自动同步该部分信息 ）
    const metadataStore = ((await sendMessage("getExtStorage", "metadata")) ?? {}) as IMetadataPiniaStorageSchema;
    metadataStore.lastUserInfo ??= {};
    metadataStore.lastUserInfo[site] = userData;
    await sendMessage("setExtStorage", { key: "metadata", value: metadataStore });

    // 存储用户信息到 userInfo 中（仅当获取成功时）
    if (userData.status === EResultParseStatus.success) {
      const userInfoStore = ((await sendMessage("getExtStorage", "userInfo")) ?? {}) as TUserInfoStorageSchema;
      userInfoStore[site] ??= {};
      const dateTime = format(userData.updateAt, "yyyy-MM-dd");
      userInfoStore[site][dateTime] = userData;
      await sendMessage("setExtStorage", { key: "userInfo", value: userInfoStore });
    }
  });
}

onMessage("setSiteLastUserInfo", async ({ data: userData }) => await setSiteLastUserInfo(userData));

onMessage("getSiteUserInfo", async ({ data: siteId }) => {
  const userInfoStore = ((await sendMessage("getExtStorage", "userInfo")) ?? {}) as TUserInfoStorageSchema;
  return userInfoStore?.[siteId] ?? {};
});

onMessage("removeSiteUserInfo", async ({ data: { siteId, date } }) => {
  const userInfoStore = ((await sendMessage("getExtStorage", "userInfo")) ?? {}) as TUserInfoStorageSchema;
  for (const day of date) {
    unset(userInfoStore, `${siteId}.${day}`);
  }
  await sendMessage("setExtStorage", { key: "userInfo", value: userInfoStore! });
});
