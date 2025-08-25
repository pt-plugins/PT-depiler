import { shallowReactive } from "vue";
import { definitionList, fixRatio, ISiteMetadata, IUserInfo, NO_IMAGE, TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { isValid } from "date-fns";
import { deepToRaw } from "@/options/utils.ts";

const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

// 对 siteUserInfoData 进行一些预处理（不涉及渲染格式）
export function fixUserInfo<T extends IUserInfo = IUserInfo>(userInfo: Partial<T>): Required<T> {
  userInfo = deepToRaw(userInfo);
  userInfo.ratio = fixRatio(userInfo);
  userInfo.trueRatio = fixRatio(userInfo, "trueRatio");
  userInfo.messageCount ??= 0;

  if (typeof userInfo.joinTime !== "number") {
    if (isValid(new Date(userInfo.joinTime!))) {
      userInfo.joinTime = new Date(userInfo.joinTime!).getTime();
    }
  }

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

export function flushSiteLastUserInfo(sites: TSiteID[]) {
  for (const site of sites) {
    runtimeStore.userInfo.flushPlan[site] = true;

    sendMessage("getSiteUserInfoResult", site)
      .catch((e) => {
        // 首先检查是否还在刷新，如果没有，则说明队列已经取消了，此时不报错
        if (!runtimeStore.userInfo.flushPlan[site]) {
          runtimeStore.showSnakebar(`获取站点 [${site}] 用户信息失败`, { color: "error" });
          console.error(e);
        }
      })
      .finally(() => {
        runtimeStore.userInfo.flushPlan[site] = false;

        // 检查是否所有站点都已完成刷新
        const isAllCompleted = Object.values(runtimeStore.userInfo.flushPlan).every((v) => !v);
        if (isAllCompleted) {
          // 所有站点完成后，显示完成消息
          // 注意：不再手动flush，让BatchUserInfoManager的5秒超时机制处理剩余数据
          runtimeStore.showSnakebar(`用户信息刷新完成，数据将在5秒内自动保存`, { color: "success" });
        }
      });
  }
}

export async function cancelFlushSiteLastUserInfo() {
  for (const runtimeStoreKey in runtimeStore.userInfo.flushPlan) {
    runtimeStore.userInfo.flushPlan[runtimeStoreKey] = false;
  }

  await sendMessage("cancelUserInfoQueue", undefined);

  runtimeStore.showSnakebar(`用户信息刷新队列已取消`, { color: "error" });
}

export interface ITimelineSiteMetadata extends Pick<ISiteMetadata, "id"> {
  siteName: string; // 解析后的站点名称
  hasUserInfo: boolean; // 是否有用户配置
  isDead: boolean; // 是否为失效站点
  isOffline: boolean; // 是否为离线站点
  faviconSrc: string;
  faviconElement: HTMLImageElement; // 站点的图片
}

export type TOptionSiteMetadatas = Record<TSiteID, ITimelineSiteMetadata>;

export const allAddedSiteMetadata = shallowReactive<TOptionSiteMetadatas>({});

export async function loadAllAddedSiteMetadata(sites?: string[]): Promise<TOptionSiteMetadatas> {
  const loadSites = sites ?? definitionList;

  await Promise.allSettled(
    loadSites.map((siteId) => {
      return new Promise<void>(async (resolve) => {
        if (!allAddedSiteMetadata[siteId]) {
          const siteMetadata = await metadataStore.getSiteMetadata(siteId);
          const siteFaviconUrl = await sendMessage("getSiteFavicon", { site: siteId });

          // 加载站点图标
          const siteFavicon = new Image();
          siteFavicon.src = siteFaviconUrl;
          siteFavicon.decode().catch(() => {
            siteFavicon.src = NO_IMAGE;
            siteFavicon.decode();
          });

          (allAddedSiteMetadata as TOptionSiteMetadatas)[siteId] = {
            id: siteId,
            siteName: await metadataStore.getSiteName(siteId),
            hasUserInfo: Object.hasOwn(siteMetadata, "userInfo"),
            isDead: siteMetadata.isDead ?? false,
            isOffline: metadataStore.sites[siteId]?.isOffline ?? false,
            faviconSrc: siteFaviconUrl,
            faviconElement: siteFavicon,
          };
        }

        resolve();
      });
    }),
  );

  return allAddedSiteMetadata;
}
