import {
  ISearchCategories,
  ISearchEntryRequestConfig,
  ISiteUserConfig,
  IUserInfo,
  TSiteID as TSiteKey,
} from "@ptd/site";
import { TSelectSearchCategoryValue } from "@ptd/site";
import { DownloaderBaseConfig } from "@ptd/downloader";

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
}

export interface IMetadataPiniaStorageSchema {
  sites: Record<TSiteKey, ISiteUserConfig>; // 站点配置(用户配置)
  solutions: Record<TSolutionKey, ISearchSolutionMetadata>; // 搜索方案配置
  snapshots: Record<TSearchSnapshotKey, ISearchSnapshotMetadata>; // 搜索快照配置（元信息）
  downloaders: Record<TDownloaderKey, IDownloaderMetadata>; // 下载器配置

  /**
   * 此处仅存储站点最近一次的记录，如果需要获取历史记录，需要使用 storage 方法获取
   */
  lastUserInfo: Record<TSiteKey, IStoredUserInfo>;
}
