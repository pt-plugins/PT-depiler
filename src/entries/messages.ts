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
import { ExtensionStorageKey, ExtensionStorageSchema, IDownloaderMetadata, TSearchSnapshotKey } from "@/storage.ts";
import type { ISearchData } from "@/shared/storages/runtime.ts";

interface ProtocolMap {
  // 1. 与 chrome 相关的功能，需要在 service worker 中注册，主要供 offscreen, options 使用
  downloadFile(downloadOptions: chrome.downloads.DownloadOptions): number;
  getExtStorage<T extends ExtensionStorageKey>(key: T): ExtensionStorageSchema[T];
  setExtStorage<T extends ExtensionStorageKey>(key: T, value: ExtensionStorageSchema[T]): void;

  // 1.1 站点相关功能
  getSiteUserConfig(siteId: TSiteID): ISiteUserConfig;
  setSiteLastUserInfo(userInfo: IUserInfo): void;
  getSiteUserInfo(siteId: TSiteID): Record<string, IUserInfo>;
  removeSiteUserInfo(data: { siteId: TSiteID; date: string }): void;

  // 1.2 搜索快照相关功能
  getSearchResultSnapshotData(snapshotId: TSearchSnapshotKey): ISearchData;
  saveSearchResultSnapshotData(data: { snapshotId: TSearchSnapshotKey; data: ISearchData }): void;
  removeSearchResultSnapshotData(snapshotId: TSearchSnapshotKey): void;

  // 1.3 下载器相关功能
  getDownloaderConfig(downloaderId: string): IDownloaderMetadata;

  // 2. 在 offscreen 中注册，涉及页面解析等功能，主要供 options 使用

  // 2.1 站点相关功能
  getSiteSearchResult(data: {
    siteId: TSiteID;
    keyword: string;
    searchEntry?: IAdvancedSearchRequestConfig;
  }): ISearchResult;
  getSiteUserInfoResult(siteId: TSiteID): IUserInfo;

  // 2.2 种子下载相关功能
  getTorrentDownloadLink(torrent: ITorrent): string;
  downloadTorrentFile(torrent: ITorrent): number;
  sendTorrentToDownloader(data: {
    torrent: ITorrent;
    downloaderId: string;
    addTorrentOptions: CAddTorrentOptions;
  }): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>({});
