import type { IUserInfo, TSiteID } from "@ptd/site";
import PQueue from "p-queue";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const runtimeStore = useRuntimeStore();

// 对 siteUserInfoData 进行一些预处理（不涉及渲染格式）
export function fixUserInfo(userInfo: Partial<IUserInfo>): IUserInfo {
  let { uploaded = 0, downloaded = 0 } = userInfo;
  if (typeof userInfo.ratio === "undefined") {
    let ratio = -1;
    if (downloaded == 0 && uploaded > 0) {
      ratio = Infinity; // 没有下载量时设置分享率为无限
    } else if (downloaded > 0) {
      ratio = uploaded / downloaded;
    }
    userInfo.ratio = ratio;
  }
  return userInfo as IUserInfo;
}

export function getFixedRatio(
  userInfo: Partial<Pick<IUserInfo, "uploaded" | "downloaded" | "ratio">>,
): string | "∞" | "" {
  let ratio = userInfo.ratio ?? -1;

  if (ratio > 10000 || ratio === -1) {
    return "∞";
  }

  if (isNaN(ratio)) {
    return "";
  }

  return ratio.toFixed(2);
}

export const flushQueue = new PQueue({ concurrency: 1 }); // FIXME Use settingStore

flushQueue.on("active", () => {
  runtimeStore.userInfo.isFlush = true;
});

flushQueue.on("empty", () => {
  runtimeStore.userInfo.isFlush = false;
});

export async function flushSiteLastUserInfo(sites: TSiteID[]) {
  for (const site of sites) {
    runtimeStore.userInfo.flushPlan[site] = { isFlush: true };
    await flushQueue.add(async () => {
      await sendMessage("getSiteUserInfoResult", site);
      runtimeStore.userInfo.flushPlan[site].isFlush = false;
    });
  }
}
