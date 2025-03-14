import type { IAdvancedSearchRequestConfig, ISiteUserConfig, TSiteID } from "@ptd/site";
import { IStoredUserInfo } from "@/shared/storages/userinfo.ts";

export type TSolutionID = string;
export interface ISearchSolution {
  siteId: TSiteID;
  searchEntries: Record<string, IAdvancedSearchRequestConfig>;
}

export interface ISearchSolutionState {
  name: string;
  solutions: ISearchSolution[];
}

export interface ISitePiniaStorageSchema {
  sites: Record<TSiteID, ISiteUserConfig>;
  solutions: Record<TSolutionID, ISearchSolutionState>;

  /**
   * 此处仅存储站点最近一次的记录，如果需要获取历史记录，需要使用 storage 方法获取
   */
  lastUserInfo: Record<TSiteID, IStoredUserInfo>;
}
