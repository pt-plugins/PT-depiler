import { defineExtensionMessaging } from "@webext-core/messaging";
import type { IAdvancedSearchRequestConfig, ISearchResult, ISiteUserConfig, IUserInfo, TSiteID } from "@ptd/site";
import type { ExtensionStorageKey, ExtensionStorageSchema } from "@/storage.ts";

interface ProtocolMap {
  // 与 chrome.storage 相关的功能，需要在 service worker 中注册，主要供 offscreen 使用
  getExtStorage<T extends ExtensionStorageKey>(key: T): ExtensionStorageSchema[T];
  setExtStorage<T extends ExtensionStorageKey>(key: T, value: ExtensionStorageSchema[T]): void;

  // 与 chrome.storage 相关的高级功能，需要在 service worker 中注册

  // 站点相关功能
  getSiteFavicon(siteId: TSiteID): string;
  getSiteUserConfig(siteId: TSiteID): ISiteUserConfig;
  getSiteSearchResult(data: {
    siteId: TSiteID;
    keyword: string;
    searchEntry?: IAdvancedSearchRequestConfig;
  }): ISearchResult;
  getSiteUserInfoResult(siteId: TSiteID): IUserInfo;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>({});
