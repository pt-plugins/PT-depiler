import { fixRatio, IUserInfo, TSiteID } from "@ptd/site";
import PQueue from "p-queue";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { log } from "~/helper.ts";

const runtimeStore = useRuntimeStore();

// 对 siteUserInfoData 进行一些预处理（不涉及渲染格式）
export function fixUserInfo<T extends IUserInfo = IUserInfo>(userInfo: Partial<T>): Required<T> {
  userInfo.ratio = fixRatio(userInfo);
  userInfo.trueRatio = fixRatio(userInfo, "trueRatio");
  return userInfo as Required<T>;
}

export function realFormatRatio(ratio: number): string | "∞" | "" {
  if (ratio > 10000 || ratio === -1 || ratio === Infinity || ratio === null) {
    return "∞";
  }

  if (isNaN(ratio) || ratio === -Infinity) {
    return "-";
  }

  return ratio.toFixed(2);
}

export function formatRatio(
  userInfo: Partial<IUserInfo>,
  ratioKey: "ratio" | "trueRatio" = "ratio",
): string | "∞" | "" {
  let ratio = userInfo[ratioKey] ?? -1;
  return realFormatRatio(ratio);
}

const configStore = useConfigStore();
export const flushQueue = new PQueue({ concurrency: 1 }); // 默认设置为 1，避免并发搜索

flushQueue.on("active", () => {
  runtimeStore.userInfo.isFlush = true;
  if (flushQueue.concurrency != configStore.userInfo.queueConcurrency) {
    flushQueue.concurrency = configStore.userInfo.queueConcurrency;
    log(`用户信息刷新队列并发数已更改为 ${flushQueue.concurrency}`, { color: "info" });
  }
});

flushQueue.on("idle", () => {
  runtimeStore.userInfo.isFlush = false;
});

export async function flushSiteLastUserInfo(sites: TSiteID[]) {
  for (const site of sites) {
    runtimeStore.userInfo.flushPlan[site] = { isFlush: true };

    // noinspection ES6MissingAwait
    flushQueue.add(async () => {
      try {
        await sendMessage("getSiteUserInfoResult", site);
      } catch (e) {
        runtimeStore.showSnakebar(`获取站点 [${site}] 用户信息失败`, { color: "error" });
        console.error(e);
      } finally {
        runtimeStore.userInfo.flushPlan[site].isFlush = false;
      }
    });
  }
}
