import { isEqual, pick } from "lodash-es";
import { createInstance as createLocalforageInstance } from "localforage";
import {
  getSite as createSiteInstance,
  getFavicon, getDefinedSiteConfig, getFaviconMetadata,
  type SiteID, type TSite, type ISiteMetadata as ISiteDefinedMetadata, type ISearchParams,
} from "@ptpp/site";

export interface ISiteRuntimeConfig extends Partial<ISiteDefinedMetadata> {
  id: SiteID;

  entryPoint?: string;  // 用户在options首页点击时，打开的站点地址
  sortIndex?: number;  // 排序号
  showMessageCount?: boolean;

  defaultSearchParams?: ISearchParams[]; // 默认搜索模块（强烈不推荐使用！更建议在站点配置中配置或使用搜索方案！）
}

const pickList: Array<keyof ISiteRuntimeConfig> = [
  // ISiteDefinedMetadata中定义的可以由用户自定义的字段
  "name", "aka", "url", "legacyUrls", "activateUrl", "timezoneOffset", "tags", "description", "host",
  // ISiteDefinedMetadata 中定义的boolean类型字段
  "isOffline", "allowSearch", "allowQueryUserInfo",
  // ISiteRuntimeConfig 中额外定义的字段
  "entryPoint", "sortIndex", "showMessageCount", "defaultSearchParams"
];

export async function diffSiteConfig (site: ISiteRuntimeConfig, mergeUserConfig: boolean = true) {
  const definedSiteConfig = await getSiteConfig(site.id, mergeUserConfig) as unknown as ISiteRuntimeConfig;
  const pickedSiteConfig = pick(site, pickList);
  for (const pickElement of pickList) {
    if (isEqual(definedSiteConfig[pickElement], pickedSiteConfig[pickElement])) {
      delete pickedSiteConfig[pickElement];
    }
  }
  return { ...pickedSiteConfig, id: site.id } as ISiteRuntimeConfig;
}

export async function getSiteConfig (siteId: SiteID, mergeUserConfig: boolean = true) {
  let siteMetaData = await getDefinedSiteConfig(siteId) as unknown as ISiteRuntimeConfig;

  if (mergeUserConfig) {
    const { site = {} } = await chrome.storage.local.get("site");  // FIXME storage keys
    const storedSiteConfig = site?.sites?.[siteId];
    if (storedSiteConfig) {
      siteMetaData = { ...siteMetaData, ...storedSiteConfig };
    }
  }

  // 此处补全一些和 ISiteRuntimeConfig 有关的字段
  siteMetaData.sortIndex ??= 100;
  siteMetaData.showMessageCount ??= Object.hasOwn(siteMetaData,"userInfo") && siteMetaData.allowQueryUserInfo === true;
  siteMetaData.defaultSearchParams ??= [];

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

