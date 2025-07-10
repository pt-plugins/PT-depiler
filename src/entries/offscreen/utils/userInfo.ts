import PQueue from "p-queue";
import { format } from "date-fns";
import { isEmpty } from "es-toolkit/compat";
import type { IUserInfo } from "@ptd/site";
import { EResultParseStatus } from "@ptd/site";
import { getHostFromUrl } from "@ptd/site/utils/html";

import { onMessage, sendMessage } from "@/messages.ts";
import type { IMetadataPiniaStorageSchema, IConfigPiniaStorageSchema, TUserInfoStorageSchema } from "@/shared/types.ts";

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

    // 刷新站点数据时，检查并延长即将过期的cookie（仅在配置开启时）
    const configStoreRaw = (await sendMessage("getExtStorage", "config")) as IConfigPiniaStorageSchema;
    if (configStoreRaw?.userInfo?.autoExtendCookie) {
      await extendCookiesIfNeeded(site);
    }

    await setSiteLastUserInfo(userInfo);
    return userInfo!;
  }))!;
}

// Cookie有效期相关常量
const COOKIE_EXPIRY_THRESHOLD_DAYS = 7;
const COOKIE_EXTENSION_DAYS = 90;
const SECONDS_PER_DAY = 24 * 60 * 60;

/**
 * 检查站点cookie有效期，如果少于7天则延长到90天
 */
async function extendCookiesIfNeeded(site: { url?: string; metadata: { urls?: string[] } }) {
  const siteUrl = site.url || site.metadata.urls?.[0];
  if (!siteUrl) return;

  const host = getHostFromUrl(siteUrl);
  if (!host) return;

  try {
    const cookies = await sendMessage("getCookiesByDomain", host);
    if (!cookies?.length) return;

    const now = Math.floor(Date.now() / 1000);
    const thresholdSeconds = COOKIE_EXPIRY_THRESHOLD_DAYS * SECONDS_PER_DAY;
    const extensionSeconds = COOKIE_EXTENSION_DAYS * SECONDS_PER_DAY;

    let extendedCount = 0;

    for (const cookie of cookies) {
      if (!cookie.expirationDate || typeof cookie.expirationDate !== "number") continue;

      const timeUntilExpiry = cookie.expirationDate - now;
      if (timeUntilExpiry <= 0 || timeUntilExpiry >= thresholdSeconds) continue;

      const cookieDetails = {
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        expirationDate: now + extensionSeconds,
      } as chrome.cookies.SetDetails;

      await sendMessage("setCookie", cookieDetails);
      extendedCount++;
    }

    if (extendedCount > 0) {
      logger({ msg: `Extended ${extendedCount} cookies for domain ${host} to ${COOKIE_EXTENSION_DAYS} days` });
    }
  } catch (error) {
    logger({ msg: `Failed to extend cookies for domain ${host}: ${error}` });
  }
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
