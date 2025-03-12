import {
  BittorrentSite,
  getFavicon,
  getFaviconMetadata,
  getSite as createSiteInstance,
  ISiteUserConfig,
  PrivateSite,
  type TSiteID,
} from "@ptd/site";
import { useLocalStorage } from "@vueuse/core";
import { sendMessage } from "@/messages.ts";

export async function getSiteInstance<TYPE extends "private" | "public">(
  siteId: TSiteID,
  options: { mergeUserConfig?: boolean } = {},
) {
  const { mergeUserConfig = true } = options;
  let storedSiteUserConfig: ISiteUserConfig = {};
  if (mergeUserConfig) {
    storedSiteUserConfig = await sendMessage("getSiteUserConfig", siteId);
  }

  console.log(`siteInstance ${siteId} created with userConfig:`, storedSiteUserConfig);
  return (await createSiteInstance<TYPE>(siteId, storedSiteUserConfig)) as TYPE extends "private"
    ? PrivateSite
    : BittorrentSite;
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
