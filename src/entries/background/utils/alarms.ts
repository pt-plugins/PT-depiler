import { format } from "date-fns";
import { defineJobScheduler } from "@webext-core/job-scheduler";
import { EResultParseStatus, type TSiteID } from "@ptd/site/types/base.ts";

import { extStorage } from "@/storage.ts";
import { IDownloadTorrentToClientOption, IDownloadTorrentToLocalFile, onMessage, sendMessage } from "@/messages.ts";

import { setupOffscreenDocument } from "./offscreen.ts";

export enum EJobType {
  FlushUserInfo = "flushUserInfo",
  ReDownloadTorrentToDownloader = "reDownloadTorrentToDownloader",
  ReDownloadTorrentToLocalFile = "reDownloadTorrentToLocalFile",
}

const jobs = defineJobScheduler();

function autoFlushUserInfo(retryIndex: number = 0) {
  return async () => {
    await setupOffscreenDocument();

    const configStore = (await extStorage.getItem("config"))!;

    // 获取自动刷新参数
    const {
      enabled = false,
      interval = 1,
      afterTime = "00:00",
      retry: { max: retryMax = 0, interval: retryInterval = 5 } = {},
    } = configStore?.userInfo?.autoReflush ?? {};

    // 如果未启用自动刷新，则直接返回
    if (!enabled) {
      return;
    }

    const curDate = new Date();
    let metadataStore = (await extStorage.getItem("metadata"))!;

    // 如果不是重试，则主要检查是否满足刷新条件
    if (retryIndex === 0) {
      // 检查当前时间是否在允许的刷新时间之后
      const [afterHour, afterMinute] = afterTime.split(":").map((v) => parseInt(v));
      if (curDate.getHours() < afterHour || (curDate.getHours() === afterHour && curDate.getMinutes() < afterMinute)) {
        sendMessage("logger", {
          msg: `Auto-refreshing user information paused since current time is before the allowed refresh time.`,
        }).catch();
        return;
      }

      // 检查距离上次刷新时间是否超过了设定的间隔
      metadataStore = (await extStorage.getItem("metadata"))!;
      const nextFlushTime = metadataStore.lastUserInfoAutoFlushAt + interval * 60 * 60 * 1000; // interval in hours
      if (curDate.getTime() < nextFlushTime) {
        sendMessage("logger", {
          msg: `Auto-refreshing user information paused since refresh interval not reached.`,
        }).catch();
        return;
      }
    }

    const curDateFormat = format(curDate, "yyyy-MM-dd");
    sendMessage("logger", {
      msg: `Auto-refreshing user information at ${curDateFormat}${retryIndex > 0 ? `(Retry #${retryIndex})` : ""}`,
    }).catch();

    // 遍历 metadataStore 中添加的站点
    metadataStore = (await extStorage.getItem("metadata"))!;
    const flushPromises = [];
    const failFlushSites: TSiteID[] = [];
    for (const siteId of Object.keys(metadataStore.sites)) {
      flushPromises.push(
        new Promise(async (resolve, reject) => {
          try {
            const siteConfig = await sendMessage("getSiteUserConfig", { siteId });
            if (!siteConfig.isOffline && siteConfig.allowQueryUserInfo) {
              // 检查当天的记录是否存在
              const thisSiteUserInfo = await sendMessage("getSiteUserInfo", siteId);
              if (typeof thisSiteUserInfo[curDateFormat] === "undefined") {
                const userInfoResult = await sendMessage("getSiteUserInfoResult", siteId);
                if (userInfoResult.status !== EResultParseStatus.success) {
                  failFlushSites.push(siteId);
                  reject(siteId); // 仅有刷新失败的时候才reject
                }
              }
            }
            resolve(siteId); // 其他状态（刷新成功、已有当天记录、不设置刷新）均视为resolve
          } catch (e) {
            reject(siteId); // 如果获取站点配置失败，则reject
          }
        }),
      );
    }

    // 等待所有刷新操作完成
    await Promise.allSettled(flushPromises);
    sendMessage("logger", {
      msg: `Auto-refreshing user information finished, ${flushPromises.length} sites processed, ${failFlushSites.length} failed.`,
      data: { failFlushSites },
    }).catch();

    // 将刷新时间存入 metadataStore
    metadataStore = (await extStorage.getItem("metadata"))!;
    metadataStore.lastUserInfoAutoFlushAt = curDate.getTime();
    await extStorage.setItem("metadata", metadataStore);

    // 如果本次有失败的刷新操作，则设置重试
    if (failFlushSites.length > 0 && retryIndex < retryMax) {
      sendMessage("logger", {
        msg: `Retrying auto-refresh for ${failFlushSites.length} failed sites in ${retryInterval} minutes (Retry #${retryIndex + 1})`,
      }).catch();
      await jobs.scheduleJob({
        id: EJobType.FlushUserInfo + "-Retry-" + retryIndex,
        type: "once",
        date: +curDate + retryInterval * 60 * 1000, // retryInterval in minutes
        execute: autoFlushUserInfo(retryIndex + 1),
      });
    }
  };
}

export async function createFlushUserInfoJob() {
  await jobs.scheduleJob({
    id: EJobType.FlushUserInfo,
    type: "interval",
    duration: 1000 * 60 * 10, // check every 10 minutes
    immediate: true,
    execute: autoFlushUserInfo(),
  });
}

// noinspection JSIgnoredPromiseFromCall
createFlushUserInfoJob();

function doReDownloadTorrentToDownloader(option: IDownloadTorrentToClientOption) {
  return async () => {
    await setupOffscreenDocument();
    // 按照相同的方式重新下载种子到下载器
    await sendMessage("downloadTorrentToDownloader", option);
  };
}

onMessage("reDownloadTorrentToDownloader", async ({ data }) => {
  jobs
    .scheduleJob({
      id: EJobType.ReDownloadTorrentToDownloader + "-" + data.downloadId!,
      type: "once",
      date: Date.now() + 1000 * 30, // 0.5 minute later
      execute: doReDownloadTorrentToDownloader(data),
    })
    .catch(() => {
      sendMessage("setDownloadHistoryStatus", { downloadId: data.downloadId!, status: "failed" }).catch();
    });
});

function doReDownloadTorrentToLocalFile(option: IDownloadTorrentToLocalFile) {
  return async () => {
    await setupOffscreenDocument();
    await sendMessage("downloadTorrentToLocalFile", option);
  };
}

onMessage("reDownloadTorrentToLocalFile", async ({ data }) => {
  jobs
    .scheduleJob({
      id: EJobType.ReDownloadTorrentToLocalFile + "-" + data.downloadId!,
      type: "once",
      date: Date.now() + 1000 * 30, // 0.5 minute later
      execute: doReDownloadTorrentToLocalFile(data),
    })
    .catch(() => {
      sendMessage("setDownloadHistoryStatus", { downloadId: data.downloadId!, status: "failed" }).catch();
    });
});
