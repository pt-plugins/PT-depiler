import type {
  ISearchCategories,
  ISearchEntryRequestConfig,
  ISiteUserConfig,
  IUserInfo,
  TSiteHost,
  TSiteID as TSiteKey,
} from "@ptd/site";
import type { TSelectSearchCategoryValue } from "@ptd/site";
import type { CAddTorrentOptions, DownloaderBaseConfig } from "@ptd/downloader";
import type { IMediaServerBaseConfig } from "@ptd/mediaServer";
import type { IBackupConfig } from "@ptd/backupServer";

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

  sortIndex?: number; // 排序索引，默认值取 100

  [key: string]: any; // 其他配置项
}

export type TMediaServerKey = string;
export interface IMediaServerMetadata extends IMediaServerBaseConfig {
  id: TMediaServerKey;
  enabled: boolean;
  [key: string]: any; // 其他配置项
}

export const BackupFields = [
  "cookies", // 备份已添加站点的Cookie
  "config", // 备份插件基本配置
  "metadata", // 备份插件元数据（站点、搜索方案、下载器、媒体服务器等配置）
  "userInfo", // 备份插件历史获取的用户信息
  "searchResultSnapshot", // 备份搜索结果快照
  "downloadHistory", // 备份下载历史
] as const;
export type TBackupFields = (typeof BackupFields)[number];

export type TBackupServerKey = string;
export interface IBackupServerMetadata extends IBackupConfig {
  id: TBackupServerKey;
  enabled: boolean; // 此处仅影响自动备份
  backupFields: TBackupFields[]; // 备份的字段

  lastBackupAt?: number; // 上次备份时间
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

  // 备份服务器配置
  backupServers: Record<TBackupServerKey, IBackupServerMetadata>;

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

  // 站点 host 映射表
  siteHostMap: Record<TSiteHost, TSiteKey>;
}
