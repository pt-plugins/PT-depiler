import { createInstance as createLocalforageInstance } from "localforage";
import {
  getSite as createSiteInstance,
  getFavicon,
  SiteID,
  TSite,
  ISiteMetadata as ISiteDefinedMetadata,
  getDefinedSiteConfig,
} from "@ptpp/site";
import { merge } from "lodash-es";

export interface ISiteRuntimeConfig extends Partial<ISiteDefinedMetadata> {
  id: SiteID;

  /**
   * 用户在options首页点击时，打开的站点地址
   */
  entryPoint?: string;

  /**
   * 排序号
   */
  sortIndex?: number;
}

export async function getSiteConfig (siteId: SiteID) {
  let siteMetaData = await getDefinedSiteConfig(siteId);

  const { site = {} } = await chrome.storage.local.get("site");  // FIXME storage keys
  const storedSiteConfig = site?.sites?.find((site: ISiteDefinedMetadata) => site.id === siteId);
  if (storedSiteConfig) {
    storedSiteConfig.sortIndex ??= 100;
    siteMetaData = merge(siteMetaData, storedSiteConfig);
  }
  return siteMetaData;
}

export const siteInstanceCache: Record<SiteID, TSite> = {};

export async function getSiteInstance(siteId: SiteID, flush: boolean = false) {
  if (flush || typeof siteInstanceCache[siteId] === "undefined") {
    const siteConfig = await getSiteConfig(siteId);
    if (siteConfig) {
      siteInstanceCache[siteId] = await createSiteInstance(siteConfig);
    }
  }
  return siteInstanceCache[siteId];
}

export const faviconCache = createLocalforageInstance({
  name: "Favicon",
});

export async function getSiteFavicon(siteId: SiteID, flush: boolean = false) {
  let siteFavicon = await faviconCache.getItem<string>(siteId);
  if (flush || !siteFavicon) {
    const siteConfig = await getSiteConfig(siteId);
    if (siteConfig) {
      siteFavicon = await getFavicon(siteConfig);

      // noinspection ES6MissingAwait
      faviconCache.setItem(siteId, siteFavicon);
    }
  }
  return siteFavicon;
}
