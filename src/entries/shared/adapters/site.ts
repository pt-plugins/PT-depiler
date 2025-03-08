import {
  getSite as createSiteInstance,
  getFavicon,
  getDefinedSiteMetadata,
  getFaviconMetadata,
  type TSiteID,
  ISiteUserConfig,
  PrivateSite,
  BittorrentSite,
} from "@ptd/site";
import { useLocalStorage } from "@vueuse/core";
import { sendMessage } from "@/messages.ts";

export const siteInstanceCache: Record<TSiteID, PrivateSite | BittorrentSite> = {};

export async function getSiteInstance<TYPE extends "private" | "public">(
  siteId: TSiteID,
  options: { flush?: boolean; mergeUserConfig?: boolean } = {},
) {
  const { flush = false, mergeUserConfig = true } = options;
  if (flush || typeof siteInstanceCache[siteId] === "undefined") {
    const siteMetaData = await getDefinedSiteMetadata(siteId);
    if (siteMetaData) {
      let storedSiteUserConfig: ISiteUserConfig = {};
      if (mergeUserConfig) {
        storedSiteUserConfig = await sendMessage("getSiteUserConfig", siteId);
      }

      // 补全 userConfig 中可能缺失的内容
      storedSiteUserConfig.allowSearch ??= Object.hasOwn(siteMetaData, "search");
      storedSiteUserConfig.allowQueryUserInfo ??= Object.hasOwn(siteMetaData, "userInfo");
      storedSiteUserConfig.showMessageCount ??= Object.hasOwn(siteMetaData, "userInfo");

      siteInstanceCache[siteId] = await createSiteInstance<TYPE>(siteMetaData, storedSiteUserConfig);
    }
  }

  return siteInstanceCache[siteId] as TYPE extends "private" ? PrivateSite : BittorrentSite;
}

export const faviconCache = useLocalStorage<Record<string, string>>("PTD_SiteFavicon", {});

export async function getSiteFavicon(site: TSiteID | getFaviconMetadata, flush: boolean = false) {
  const siteId = typeof site === "string" ? site : site.id;

  let siteFavicon = faviconCache.value[siteId] ?? false;
  if (flush || !siteFavicon) {
    const siteInstance = await getSiteInstance(siteId);
    if (siteInstance) {
      siteFavicon = await getFavicon({
        id: siteId,
        urls: siteInstance.metadata.urls,
        favicon: siteInstance.metadata.favicon,
      });

      faviconCache.value[siteId] = siteFavicon;
    }
  }
  return siteFavicon;
}
