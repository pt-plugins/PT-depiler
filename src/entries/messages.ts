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
import type { ISocialInformation, TSupportSocialSite$1 } from "@ptd/social";
import type { IMediaServerId, IMediaServerSearchOptions, IMediaServerSearchResult } from "@ptd/mediaServer";
import type {
  TExtensionStorageKey,
  IExtensionStorageSchema,
  IDownloaderMetadata,
  ISearchData,
  TSearchSnapshotKey,
  TLocalDownloadMethod,
  TBackupFields,
} from "@/storage.ts";
import type { ITorrentDownloadMetadata, TTorrentDownloadKey } from "@/shared/storages/types/indexdb.ts";
import type { getFaviconMetadata } from "@ptd/site";
import { IBackupFileInfo } from "@ptd/backupServer";
import { isDebug } from "~/helper.ts";

interface ProtocolMap {
  // 1. 与 chrome 相关的功能，需要在 service worker 中注册，主要供 offscreen, options 使用
  ping<T extends any>(data?: T): T extends undefined ? "pong" : T;

  // 1.1 chrome.downloads
  downloadFile(downloadOptions: chrome.downloads.DownloadOptions): number;

  // 1.2 chrome.storage
  getExtStorage<T extends TExtensionStorageKey>(key: T): IExtensionStorageSchema[T];
  setExtStorage<T extends TExtensionStorageKey>(data: { key: T; value: IExtensionStorageSchema[T] }): void;

  // 1.3 chrome.declarativeNetRequest
  updateDNRSessionRules(data: { rule: chrome.declarativeNetRequest.Rule; extOnly?: boolean }): void;
  removeDNRSessionRuleById(data: chrome.declarativeNetRequest.Rule["id"]): void;

  // 1.4 chrome.alarms
  setFlushUserInfoJob(): void;

  // 1.5 chrome.cookies
  getCookiesByDomain(data: string): chrome.cookies.Cookie[];
  setCookie(data: chrome.cookies.SetDetails): void;

  // 2. 在 offscreen 中注册，涉及页面解析等功能，主要供 options 使用

  // 2.1 站点基础 ( utils/site )
  getSiteUserConfig(data: { siteId: TSiteID; flush?: boolean }): ISiteUserConfig;
  getSiteFavicon(data: { site: TSiteID | getFaviconMetadata; flush?: boolean }): string;
  clearSiteFaviconCache(): void;

  // 2.2 站点搜索、搜索快照 ( utils/search )
  getSiteSearchResult(data: {
    siteId: TSiteID;
    keyword?: string;
    searchEntry?: IAdvancedSearchRequestConfig;
  }): ISearchResult;
  getMediaServerSearchResult(data: {
    mediaServerId: IMediaServerId;
    keywords?: string;
    options?: IMediaServerSearchOptions;
  }): IMediaServerSearchResult;
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
  cancelUserInfoQueue(): void;
  getSiteUserInfo(siteId: TSiteID): Record<string, IUserInfo>;
  removeSiteUserInfo(data: { siteId: TSiteID; date: string }): void;

  // 2.5 社交信息 ( utils/socialInformation )
  getSocialInformation(data: { site: TSupportSocialSite$1; sid: string }): ISocialInformation;
  clearSocialInformationCache(): void;

  // 2.6 备份/恢复 ( utils/backup )
  exportBackupData(data: { backupServerId: string | "local"; backupFields: TBackupFields[] }): boolean;
  getBackupHistory(data: string): IBackupFileInfo[];
  deleteBackupHistory(data: { backupServerId: string; path: string }): boolean;
}

type TMessageMap = Record<string, (data: any) => any>;

// 全局消息处理函数映射
export const messageMaps: Partial<TMessageMap> = {};

function createMessageWrapper<PM extends TMessageMap>(original: {
  sendMessage: <K extends keyof PM>(type: K, data: Parameters<PM[K]>[0]) => Promise<ReturnType<PM[K]>>;
  onMessage: <K extends keyof PM>(type: K, handler: PM[K]) => void;
}) {
  // 包装后的 onMessage：将异步处理函数存入 messageMaps
  const wrappedOnMessage = <K extends keyof PM>(type: K, handler: PM[K]) => {
    // @ts-ignore
    messageMaps[type] = handler;
    original.onMessage(type, handler);
  };

  // 包装后的 sendMessage：优先使用 messageMaps 中的异步处理函数
  const wrappedSendMessage = async <K extends keyof PM>(
    type: K,
    data: Parameters<PM[K]>[0],
  ): Promise<ReturnType<PM[K]>> => {
    // @ts-ignore
    const localHandler = messageMaps[type] as PM[K] | undefined;

    if (localHandler) {
      // 执行本地异步处理
      return await localHandler({ data });
    }

    // 执行远程异步调用
    return await original.sendMessage(type, data);
  };

  return {
    sendMessage: wrappedSendMessage,
    onMessage: wrappedOnMessage,
  };
}

// 使用示例
export const { sendMessage, onMessage } = createMessageWrapper(
  defineExtensionMessaging<TMessageMap>({
    logger: __BROWSER__ == "firefox" || isDebug ? console : undefined,
  }),
);
