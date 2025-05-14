import {
  ISearchCategories,
  ISearchEntryRequestConfig,
  ISiteUserConfig,
  IUserInfo,
  TSiteHost,
  TSiteID as TSiteKey,
} from "@ptd/site";
import type { TSelectSearchCategoryValue } from "@ptd/site";
import type { CAddTorrentOptions, DownloaderBaseConfig } from "@ptd/downloader";
import { IMediaServerBaseConfig } from "@ptd/mediaServer";

export interface ISearchSolution {
  id: string;
  siteId: TSiteKey;
  selectedCategories?: Record<ISearchCategories["key"], TSelectSearchCategoryValue>;
  searchEntries: Record<string, ISearchEntryRequestConfig>;
}

export type TSolutionKey = string;
export interface ISearchSolutionMetadata {
  id: TSolutionKey;
  name: string;
  sort: number;
  enabled: boolean;
  isDefault: boolean;
  createdAt: number;
  solutions: ISearchSolution[];
}

export type TSearchSnapshotKey = string;
export interface ISearchSnapshotMetadata {
  id: TSearchSnapshotKey;
  name: string; // [搜索方案] 搜索词 (搜索时间)
  createdAt: number;
  recordCount: number; // 记录数
}

export interface IStoredUserInfo extends IUserInfo {}

export type TDownloaderKey = string;

export interface IDownloaderMetadata extends DownloaderBaseConfig {
  id: TDownloaderKey;
  enabled: boolean;

  suggestFolders?: string[];
  suggestTags?: string[];

  [key: string]: any; // 其他配置项
}

export type TMediaServerKey = string;
export interface IMediaServerMetadata extends IMediaServerBaseConfig {
  id: TMediaServerKey;
  enabled: boolean;
  [key: string]: any; // 其他配置项
}

export interface IMetadataPiniaStorageSchema {
  // 站点配置(用户配置)
  sites: Record<TSiteKey, ISiteUserConfig>;

  // 搜索方案配置
  solutions: Record<TSolutionKey, ISearchSolutionMetadata>;

  // 默认搜索方案
  defaultSolutionId: TSolutionKey | "default";

  /**
   * 搜索快照配置（元信息）
   * 具体快照内容需要通过 getSearchResultSnapshotData() 方法获取
   */
  snapshots: Record<TSearchSnapshotKey, ISearchSnapshotMetadata>;

  // 下载器配置
  downloaders: Record<TDownloaderKey, IDownloaderMetadata>;

  // 媒体服务器配置
  mediaServers: Record<TMediaServerKey, IMediaServerMetadata>;

  // 上一次搜索时在结果页面的筛选词，需要启用 configStore.searchEntity.saveLastFilter
  lastSearchFilter?: string;

  /**
   * 此处仅存储站点最近一次的记录，如果需要获取历史记录，需要使用 storage 方法获取
   */
  lastUserInfo: Record<TSiteKey, IStoredUserInfo>;

  lastDownloader?: {
    id?: TDownloaderKey;
    options?: Omit<CAddTorrentOptions, "localDownloadOption">;
  };

  // 上一次自动刷新的时间戳
  lastUserInfoAutoFlushAt: number;

  siteHostMap: Record<TSiteHost, TSiteKey>; // 站点 host 映射表
}
