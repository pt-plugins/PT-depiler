import { defineExtensionMessaging } from "@webext-core/messaging";
import type {
  IAdvancedSearchRequestConfig,
  ISearchResult,
  ISiteUserConfig,
  ITorrent,
  IUserInfo,
  TSiteID,
} from "@ptd/site";
import type { CAddTorrentOptions } from "@ptd/downloader";
import type { ISocialInformation, TSupportSocialSite } from "@ptd/social";
import type {
  TExtensionStorageKey,
  IExtensionStorageSchema,
  IDownloaderMetadata,
  ISearchData,
  TSearchSnapshotKey,
  TLocalDownloadMethod,
} from "@/storage.ts";
import type { ITorrentDownloadMetadata, TTorrentDownloadKey } from "@/shared/storages/types/indexdb.ts";
import { getFaviconMetadata } from "@ptd/site";

interface ProtocolMap {
  // 1. 与 chrome 相关的功能，需要在 service worker 中注册，主要供 offscreen, options 使用
  downloadFile(downloadOptions: chrome.downloads.DownloadOptions): number;
  getExtStorage<T extends TExtensionStorageKey>(key: T): IExtensionStorageSchema[T];
  setExtStorage<T extends TExtensionStorageKey>(data: { key: T; value: IExtensionStorageSchema[T] }): void;

  // 2. 在 offscreen 中注册，涉及页面解析等功能，主要供 options 使用

  // 2.1 站点基础 ( utils/site )
  getSiteUserConfig(data: { siteId: TSiteID; flush?: boolean }): ISiteUserConfig;
  getSiteFavicon(data: { site: TSiteID | getFaviconMetadata; flush?: boolean }): string;

  // 2.2 站点搜索、搜索快照 ( utils/search )
  getSiteSearchResult(data: {
    siteId: TSiteID;
    keyword: string;
    searchEntry?: IAdvancedSearchRequestConfig;
  }): ISearchResult;
  getSearchResultSnapshotData(snapshotId: TSearchSnapshotKey): ISearchData;
  saveSearchResultSnapshotData(data: { snapshotId: TSearchSnapshotKey; data: ISearchData }): void;
  removeSearchResultSnapshotData(snapshotId: TSearchSnapshotKey): void;

  // 2.3 下载器、下载历史 ( utils/download )
  getDownloaderConfig(downloaderId: string): IDownloaderMetadata;
  getTorrentDownloadLink(torrent: ITorrent): string;
  downloadTorrentToLocalFile(data: {
    torrent: ITorrent;
    localDownloadMethod?: TLocalDownloadMethod;
  }): TTorrentDownloadKey;
  downloadTorrentToDownloader(data: {
    torrent: ITorrent;
    downloaderId: string;
    addTorrentOptions: CAddTorrentOptions;
  }): TTorrentDownloadKey;
  getDownloadHistory(): ITorrentDownloadMetadata[];
  getDownloadHistoryById(downloadId: TTorrentDownloadKey): ITorrentDownloadMetadata;
  deleteDownloadHistoryById(downloadId: TTorrentDownloadKey): void;
  clearDownloadHistory(): void;

  // 2.4 用户信息 ( utils/userInfo )
  getSiteUserInfoResult(siteId: TSiteID): IUserInfo;
  setSiteLastUserInfo(userInfo: IUserInfo): void;
  getSiteUserInfo(siteId: TSiteID): Record<string, IUserInfo>;
  removeSiteUserInfo(data: { siteId: TSiteID; date: string }): void;

  // 2.5 社交信息 ( utils/socialInformation )
  getSocialInformation(data: { site: TSupportSocialSite; sid: string }): ISocialInformation;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>({});
