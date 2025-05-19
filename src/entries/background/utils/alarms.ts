import { format } from "date-fns";
import { defineJobScheduler } from "@webext-core/job-scheduler";
import { EResultParseStatus, type TSiteID } from "@ptd/site/types/base.ts";

import { extStorage } from "@/storage.ts";
import { onMessage, sendMessage } from "@/messages.ts";
import { setupOffscreenDocument } from "@/background/utils/offscreen.ts";

export enum EJobType {
  FlushUserInfo = "flushUserInfo",
}

const jobs = defineJobScheduler();

export async function createFlushUserInfoJob() {
  await setupOffscreenDocument();
  const configStore = (await extStorage.getItem("config"))!;

  // 获取自动刷新参数
  const {
    enabled = false,
    interval = 1,
    retry: { max: retryMax = 0, interval: retryInterval = 5 } = {},
  } = configStore?.userInfo?.autoReflush ?? {};

  function autoFlushUserInfo(retryIndex: number = 0) {
    return async () => {
      const curDate = new Date();
      const curDateFormat = format(curDate, "yyyy-MM-dd");
      let metadataStore = (await extStorage.getItem("metadata"))!;

      // 遍历 metadataStore 中添加的站点
      const flushPromises = [];
      const failFlushSites: TSiteID[] = [];
      for (const siteId of Object.keys(metadataStore.sites)) {
        flushPromises.push(
          new Promise(async (resolve, reject) => {
            const siteConfig = await sendMessage("getSiteUserConfig", { siteId });
            if (siteConfig.allowQueryUserInfo) {
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
          }),
        );
      }

      // 等待所有刷新操作完成
      await Promise.allSettled(flushPromises);

      // 将刷新时间存入 metadataStore
      metadataStore = (await extStorage.getItem("metadata"))!;
      metadataStore.lastUserInfoAutoFlushAt = curDate.getTime();
      await extStorage.setItem("metadata", metadataStore);

      // 如果本次有失败的刷新操作，则设置重试
      if (failFlushSites.length > 0 && retryIndex < retryMax) {
        await jobs.scheduleJob({
          id: EJobType.FlushUserInfo + "-Retry-" + retryIndex,
          type: "once",
          date: +curDate + retryInterval * 60 * 1000, // retryInterval in minutes
          execute: autoFlushUserInfo(retryIndex + 1),
        });
      }
    };
  }

  if (enabled) {
    await jobs.scheduleJob({
      id: EJobType.FlushUserInfo,
      type: "interval",
      duration: 1000 * 60 * 60 * interval, // interval in hours
      immediate: true,
      execute: autoFlushUserInfo(),
    });
  }
}

export async function cleanupFlushUserInfoJob() {
  // @webext-core/job-scheduler 没有提供已添加的任务列表的 API，我们只能通过 chrome.alarms API 来获取
  const allAlarms = await chrome.alarms.getAll();
  for (const alarm of allAlarms) {
    if (alarm.name.startsWith(EJobType.FlushUserInfo)) {
      await jobs.removeJob(alarm.name);
    }
  }
}

onMessage("cleanupFlushUserInfoJob", async () => await cleanupFlushUserInfoJob());

export async function setFlushUserInfoJob() {
  await cleanupFlushUserInfoJob();
  await createFlushUserInfoJob();
}

onMessage("setFlushUserInfoJob", async () => await setFlushUserInfoJob());

// noinspection JSIgnoredPromiseFromCall
createFlushUserInfoJob();
