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
import type {
  TExtensionStorageKey,
  IExtensionStorageSchema,
  IDownloaderMetadata,
  ISearchData,
  TSearchSnapshotKey,
} from "@/storage.ts";
import { ITorrentDownloadMetadata, TTorrentDownloadKey } from "@/shared/storages/types/indexdb.ts";
import type { ISocialInformation, TSupportSocialSite } from "@ptd/social";

interface ProtocolMap {
  // 1. 与 chrome 相关的功能，需要在 service worker 中注册，主要供 offscreen, options 使用
  downloadFile(downloadOptions: chrome.downloads.DownloadOptions): number;
  getExtStorage<T extends TExtensionStorageKey>(key: T): IExtensionStorageSchema[T];
  setExtStorage<T extends TExtensionStorageKey>(key: T, value: IExtensionStorageSchema[T]): void;

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
  downloadTorrentToLocalFile(torrent: ITorrent): TTorrentDownloadKey;
  downloadTorrentToDownloader(data: {
    torrent: ITorrent;
    downloaderId: string;
    addTorrentOptions: CAddTorrentOptions;
  }): TTorrentDownloadKey;

  // 2.3 IndexDB 相关功能封装
  getSocialInformation(data: { site: TSupportSocialSite; sid: string }): ISocialInformation;
  getDownloadHistory(): ITorrentDownloadMetadata[];
  getDownloadHistoryById(downloadId: TTorrentDownloadKey): ITorrentDownloadMetadata;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>({});
