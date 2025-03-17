import { defineExtensionMessaging } from "@webext-core/messaging";
import type {
  IAdvancedSearchRequestConfig,
  ISearchResult,
  ISiteUserConfig,
  ITorrent,
  IUserInfo,
  TSiteID,
} from "@ptd/site";
import type { ExtensionStorageKey, ExtensionStorageSchema } from "@/storage.ts";

interface ProtocolMap {
  // 与 chrome 相关的功能，需要在 service worker 中注册，主要供 offscreen 使用
  downloadFile(downloadOptions: chrome.downloads.DownloadOptions): number;
  getExtStorage<T extends ExtensionStorageKey>(key: T): ExtensionStorageSchema[T];
  setExtStorage<T extends ExtensionStorageKey>(key: T, value: ExtensionStorageSchema[T]): void;

  // 站点相关功能
  getSiteFavicon(siteId: TSiteID): string;
  getSiteUserConfig(siteId: TSiteID): ISiteUserConfig;
  getSiteSearchResult(data: {
    siteId: TSiteID;
    keyword: string;
    searchEntry?: IAdvancedSearchRequestConfig;
  }): ISearchResult;
  getSiteUserInfoResult(siteId: TSiteID): IUserInfo;
  setSiteLastUserInfo(userInfo: IUserInfo): void;

  // 种子下载相关功能
  getTorrentDownloadLink(torrent: ITorrent): string;
  downloadTorrentFile(torrent: ITorrent): number;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>({});
