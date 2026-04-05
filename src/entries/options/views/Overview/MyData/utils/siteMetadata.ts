import { shallowReactive } from "vue";

import { definitionList, ISiteMetadata, NO_IMAGE, TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

export interface IExtendSiteMetadata extends Pick<ISiteMetadata, "id" | "type"> {
  siteName: string; // 解析后的站点名称（当前用户使用的）
  combinedSiteName: string; // 所有该站点的名称，使用 "|$|" 分隔
  hasUserInfo: boolean; // 是否有用户配置
  isDead: boolean; // 是否为失效站点
  isOffline: boolean; // 是否为离线站点
  faviconSrc: string;
  faviconElement: HTMLImageElement; // 站点的图片
}

export type TOptionSiteMetadatas = Record<TSiteID, IExtendSiteMetadata>;

export const allAddedSiteMetadata = shallowReactive<TOptionSiteMetadatas>({});

export async function loadAllAddedSiteMetadata(sites?: string[]): Promise<TOptionSiteMetadatas> {
  const loadSites = sites ?? definitionList;
  const metadataStore = useMetadataStore();

  await Promise.allSettled(
    loadSites.map((siteId) => {
      return new Promise<void>(async (resolve) => {
        if (!allAddedSiteMetadata[siteId]) {
          const siteMetadata = await metadataStore.getSiteMetadata(siteId);
          const siteFaviconUrl = await sendMessage("getSiteFavicon", { site: siteId });

          const siteName = await metadataStore.getSiteName(siteId);

          // 加载站点图标
          const siteFavicon = new Image();
          siteFavicon.src = siteFaviconUrl;
          siteFavicon.decode().catch(() => {
            siteFavicon.src = NO_IMAGE;
            siteFavicon.decode();
          });

          (allAddedSiteMetadata as TOptionSiteMetadatas)[siteId] = {
            id: siteId,
            type: siteMetadata.type,
            siteName,
            combinedSiteName: Array.from(
              new Set([siteName, siteMetadata.name, ...(siteMetadata.aka ?? [])].filter(Boolean)),
            ).join("|$|"),
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
