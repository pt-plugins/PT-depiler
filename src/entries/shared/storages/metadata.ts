import {
  ISearchCategories,
  ISearchEntryRequestConfig,
  ISiteUserConfig,
  IUserInfo,
  TSiteID as TSiteKey,
} from "@ptd/site";
import { TSelectSearchCategoryValue } from "@ptd/site";

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

export interface IMetadataPiniaStorageSchema {
  sites: Record<TSiteKey, ISiteUserConfig>;
  solutions: Record<TSolutionKey, ISearchSolutionMetadata>;
  snapshots: Record<TSearchSnapshotKey, ISearchSnapshotMetadata>;

  /**
   * 此处仅存储站点最近一次的记录，如果需要获取历史记录，需要使用 storage 方法获取
   */
  lastUserInfo: Record<TSiteKey, IStoredUserInfo>;
}
