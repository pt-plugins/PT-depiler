import { definitionList, fixRatio, ISiteMetadata, IUserInfo, NO_IMAGE, TSiteID } from "@ptd/site";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { isEmpty } from "es-toolkit/compat";
import { useMetadataStore } from "@/options/stores/metadata.ts";

const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

// 对 siteUserInfoData 进行一些预处理（不涉及渲染格式）
export function fixUserInfo<T extends IUserInfo = IUserInfo>(userInfo: Partial<T>): Required<T> {
  userInfo.ratio = fixRatio(userInfo);
  userInfo.trueRatio = fixRatio(userInfo, "trueRatio");
  userInfo.messageCount ??= 0;
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
  faviconSrc: string;
  faviconElement: HTMLImageElement; // 站点的图片
}

export type TOptionSiteMetadatas = Record<TSiteID, ITimelineSiteMetadata>;

export const allAddedSiteMetadata: TOptionSiteMetadatas = {};

export async function loadAllAddedSiteMetadata(): Promise<TOptionSiteMetadatas> {
  if (isEmpty(allAddedSiteMetadata)) {
    for (const siteId of definitionList) {
      const siteMetadata = await metadataStore.getSiteMetadata(siteId);
      const siteFaviconUrl = await sendMessage("getSiteFavicon", { site: siteId });

      // 加载站点图标
      const siteFavicon = new Image();
      siteFavicon.src = siteFaviconUrl;
      try {
        await siteFavicon.decode();
      } catch (e) {
        siteFavicon.src = NO_IMAGE;
        await siteFavicon.decode();
      }

      (allAddedSiteMetadata as TOptionSiteMetadatas)[siteId] = {
        id: siteId,
        siteName: await metadataStore.getSiteName(siteId),
        hasUserInfo: Object.hasOwn(siteMetadata, "userInfo"),
        faviconSrc: siteFaviconUrl,
        faviconElement: siteFavicon,
      };
    }
  }

  return allAddedSiteMetadata;
}
