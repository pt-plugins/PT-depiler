import { fixRatio, IUserInfo, TSiteID } from "@ptd/site";
import PQueue from "p-queue";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const runtimeStore = useRuntimeStore();

// 对 siteUserInfoData 进行一些预处理（不涉及渲染格式）
export function fixUserInfo(userInfo: Partial<IUserInfo>): IUserInfo {
  userInfo.ratio = fixRatio(userInfo);
  userInfo.trueRatio = fixRatio(userInfo, "trueRatio");
  return userInfo as IUserInfo;
}

export function formatRatio(
  userInfo: Partial<IUserInfo>,
  ratioKey: "ratio" | "trueRatio" = "ratio",
): string | "∞" | "" {
  let ratio = userInfo[ratioKey] ?? -1;

  if (ratio > 10000 || ratio === -1) {
    return "∞";
  }

  if (isNaN(ratio) || ratio === -Infinity) {
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
      try {
        await sendMessage("getSiteUserInfoResult", site);
      } catch (e) {
        runtimeStore.showSnakebar(`获取站点 [${site}] 用户信息失败`, { color: "error" });
      } finally {
        runtimeStore.userInfo.flushPlan[site].isFlush = false;
      }
    });
  }
}
