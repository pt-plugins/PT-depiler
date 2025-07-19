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
import type { getFaviconMetadata } from "@ptd/site";
import type { IBackupData, IBackupFileInfo } from "@ptd/backupServer";

import type { TExtensionStorageKey, IExtensionStorageSchema } from "@/storage.ts";
import {
  ILoggerItem,
  IRestoreOptions,
  ITorrentDownloadMetadata,
  TTorrentDownloadKey,
  IDownloaderMetadata,
  ISearchData,
  TSearchSnapshotKey,
  TLocalDownloadMethod,
  TBackupFields,
  TTorrentDownloadStatus,
} from "@/shared/types.ts";

import { isDebug } from "~/helper.ts";

type TMessageMap = Record<string, (data: any) => any>;

export interface IDownloadTorrentToLocalFile {
  torrent: Partial<ITorrent>;
  localDownloadMethod?: TLocalDownloadMethod;
  downloadId?: TTorrentDownloadKey;
}

export interface IDownloadTorrentToClientOption {
  torrent: Partial<ITorrent>;
  downloaderId: string;
  addTorrentOptions: CAddTorrentOptions;
  downloadId?: TTorrentDownloadKey;
}

export interface IDownloadTorrentResult {
  downloadId: TTorrentDownloadKey;
  downloadStatus: TTorrentDownloadStatus;
}

interface ProtocolMap extends TMessageMap {
  // 1. 与 chrome 相关的功能，需要在 service worker 中注册，主要供 offscreen, options 使用
  ping<T extends any>(data?: T): T extends undefined ? "pong" : T;
  openOptionsPage(url?: string | { path: string; query?: Record<string, any> }): void;

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
  cleanupFlushUserInfoJob(): void;
  reDownloadTorrentToLocalFile(data: Required<IDownloadTorrentToLocalFile>): void;
  reDownloadTorrentToDownloader(data: Required<IDownloadTorrentToClientOption>): void;

  // 1.5 chrome.cookies
  getAllCookies(data: chrome.cookies.GetAllDetails): chrome.cookies.Cookie[];
  setCookie(data: chrome.cookies.SetDetails): void;
  getCookie(data: chrome.cookies.CookieDetails): chrome.cookies.Cookie | null;
  removeCookie(data: chrome.cookies.CookieDetails | chrome.cookies.SetDetails): chrome.cookies.CookieDetails;

  // 1.6 chrome.notifications
  showNotification(data: { options: chrome.notifications.NotificationOptions; timeout?: number }): void;

  // 1.7 chrome.contextMenus
  addContextMenu(data: chrome.contextMenus.CreateProperties): string;
  removeContextMenu(data: string): void;
  clearContextMenus(): void;

  // 2. 在 offscreen 中注册，涉及页面解析等功能，主要供 options 使用
  logger(data: ILoggerItem): void;
  getLogger(): ILoggerItem[];
  clearLogger(): void;

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
  downloadTorrentToLocalFile(data: IDownloadTorrentToLocalFile): IDownloadTorrentResult;
  downloadTorrentToDownloader(data: IDownloadTorrentToClientOption): IDownloadTorrentResult;
  getDownloadHistory(): ITorrentDownloadMetadata[];
  getDownloadHistoryById(downloadId: TTorrentDownloadKey): ITorrentDownloadMetadata;
  setDownloadHistoryStatus(data: { downloadId: TTorrentDownloadKey; status: TTorrentDownloadStatus }): void;
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
  restoreBackupData(data: { restoreData: IBackupData; restoreOptions?: IRestoreOptions }): boolean;
  getRemoteBackupData(data: { backupServerId: string; path: string; decryptKey?: string }): IBackupData;
}

// 全局消息处理函数映射
const messageMaps: Partial<ProtocolMap> = {};

/**
 * 为 sendMessage 和 onMessage 创建一个包装器
 * 如果 sendMessage 和 onMessage 对应的 type 是在同一个 tab 中创建的，则直接调用，不然传递给 chrome.{runtime, tab}.sendMessage
 * 有效避免 chrome 中 background 是 server worker + offscreen, 而 firefox 中是 background script
 * 而导致的 chrome.runtime.sendMessage 无响应的问题
 */
function createMessageWrapper<PM extends ProtocolMap>(original: {
  sendMessage: <K extends keyof PM>(type: K, data: Parameters<PM[K]>[0]) => Promise<ReturnType<PM[K]>>;
  onMessage: <K extends keyof PM>(
    type: K,
    handler: (message: { data: Parameters<PM[K]>[0] }) => void | Promise<ReturnType<PM[K]>>,
  ) => void;
}) {
  // 包装后的 onMessage：将异步处理函数存入 messageMaps
  const wrappedOnMessage = <K extends keyof PM>(
    type: K,
    handler: (message: { data: Parameters<PM[K]>[0] }) => void | Promise<ReturnType<PM[K]>>,
  ) => {
    // @ts-expect-error
    messageMaps[type] = handler;
    original.onMessage(type, handler);
  };

  // 包装后的 sendMessage：优先使用 messageMaps 中的异步处理函数
  const wrappedSendMessage = async <K extends keyof PM>(
    type: K,
    data: Parameters<PM[K]>[0],
  ): Promise<ReturnType<PM[K]>> => {
    // @ts-expect-error
    const localHandler = messageMaps[type] as PM[K] | undefined;

    if (__BROWSER__ == "firefox" && typeof data !== "undefined") {
      data = JSON.parse(JSON.stringify(data)); // 为 firefox 深拷贝数据，避免传递 proxy 出现的 DataCloneError
    }

    if (localHandler) {
      return await localHandler({ data }); // 执行本地异步处理
    }

    return await original.sendMessage(type, data); // 执行远程异步调用
  };

  return {
    sendMessage: wrappedSendMessage,
    onMessage: wrappedOnMessage,
  };
}

export const { sendMessage, onMessage } = createMessageWrapper(
  defineExtensionMessaging<ProtocolMap>({
    logger: __BROWSER__ == "firefox" || isDebug ? console : undefined,
  }),
);
