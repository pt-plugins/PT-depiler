import { IUserInfo, TLevelGroupType, TSiteID } from "@ptd/site";
import PQueue from "p-queue";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const runtimeStore = useRuntimeStore();

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

export function guessUserLevelGroupType(levelName: string): TLevelGroupType {
  let userLevel = levelName.toLowerCase();
  let specialNames: Record<"manager" | "vip", string[]> = {
    manager: [
      "admin",
      "moderator",
      "sys",
      "retire",
      "uploader",
      "管理",
      "版主",
      "发种",
      "保种",
      "上传",
      "退休",
      "开发",
    ],
    vip: ["vip", "贵宾"],
  };
  let res = "user";
  for (const [k, levelNames] of Object.entries(specialNames)) {
    if (levelNames.some((n: string) => userLevel?.includes(n))) {
      res = k;
      break;
    }
  }
  return res as TLevelGroupType;
}
