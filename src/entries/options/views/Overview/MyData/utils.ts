import { IUserInfo, TSiteID } from "@ptd/site";
import PQueue from "p-queue";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const runtimeStore = useRuntimeStore();

export function getFixedRatio(
  userInfo: Partial<Pick<IUserInfo, "uploaded" | "downloaded" | "ratio">>,
): string | "∞" | "" {
  let ratio = userInfo.ratio ?? -1;

  if (ratio === -1) {
    if (userInfo.uploaded && userInfo.downloaded) {
      ratio = userInfo.uploaded / userInfo.downloaded;
    }
  }

  if (ratio > 10000) {
    return "∞";
  }

  if (ratio === -1 || isNaN(ratio)) {
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
