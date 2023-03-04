import { createInstance as createLocalforageInstance } from "localforage";
import {
  getSite as createSiteInstance,
  getFavicon, getDefinedSiteConfig, getFaviconMetadata,
  type SiteID, type TSite, type ISiteMetadata as ISiteDefinedMetadata,
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

  showMessageCount?: boolean;
}

export async function getSiteConfig (siteId: SiteID, mergeUserConfig: boolean = true) {
  // FIXME 此处的 as unknown as 使用了一种比较hack的方法来避免 ISiteRuntimeConfig 和 ISiteDefinedMetadata 不相同的情况
  let siteMetaData = await getDefinedSiteConfig(siteId) as unknown as ISiteRuntimeConfig;

  if (mergeUserConfig) {
    const { site = {} } = await chrome.storage.local.get("site");  // FIXME storage keys
    const storedSiteConfig = site?.sites?.[siteId];
    if (storedSiteConfig) {
      // 如果对用户配置中的部分顶级Array，直接删除设置以防止merge直接append
      for (const field of ["tags", "legacyUrls"] as (keyof ISiteRuntimeConfig)[]) {
        if (typeof storedSiteConfig[field] !== "undefined") {
          delete siteMetaData[field];
        }
      }

      siteMetaData = merge(siteMetaData, storedSiteConfig);
    }
  }

  // 此处补全一些和 ISiteRuntimeConfig 有关的字段
  siteMetaData.sortIndex ??= 100;
  siteMetaData.showMessageCount ??= Object.hasOwn(siteMetaData,"userInfo") && siteMetaData.allowQueryUserInfo === true;

  return siteMetaData as unknown as ISiteDefinedMetadata;
}

export const siteInstanceCache: Record<SiteID, TSite> = {};

export async function getSiteInstance (siteId: SiteID, options: { flush?: boolean, mergeUserConfig?: boolean } = {}) {
  const {
    flush = false,
    mergeUserConfig = true
  } = options;
  if (flush || typeof siteInstanceCache[siteId] === "undefined") {
    const siteConfig = await getSiteConfig(siteId, mergeUserConfig);
    if (siteConfig) {
      siteInstanceCache[siteId] = await createSiteInstance(siteConfig);
    }
  }
  return siteInstanceCache[siteId];
}

export const faviconCache = createLocalforageInstance({
  name: "Favicon",
});

export async function getSiteFavicon(site: SiteID | getFaviconMetadata, flush: boolean = false) {
  const siteId = typeof site === "string" ? site : site.id;

  let siteFavicon = await faviconCache.getItem<string>(siteId) ?? false;
  if (flush || !siteFavicon) {
    const siteConfig = typeof site === "string" ? await getSiteConfig(siteId) : site;
    if (siteConfig) {
      siteFavicon = await getFavicon(siteConfig);

      // noinspection ES6MissingAwait
      faviconCache.setItem(siteId, siteFavicon);
    }
  }
  return siteFavicon;
}

