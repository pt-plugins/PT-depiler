import type { EResultParseStatus, ITorrent, TSiteID } from "@ptd/site";
import type { TSolutionID } from "@/shared/storages/site.ts";
import type { VSnackbar } from "vuetify/components";

export type TSearchSolutionKey = `${TSiteID}|$|${TSolutionID}`;

export interface ISearchResultTorrent extends ITorrent {
  uniqueId: string; // 每个种子的uniqueId，由 `${site}-${id}` 组成
  solutionId: TSolutionID; // 对应搜索方案的id
  solutionKey: TSearchSolutionKey; // 对应搜索方案的key，由 `${site}-${solutionId}` 组成
}

export interface ISearchPlanStatus {
  siteId: TSiteID;
  searchEntryName: string;
  searchEntry: Record<string, any>;
  status: EResultParseStatus;
  queueAt?: number;
  queuePriority?: number;
  startAt?: number;
  costTime?: number;
  count?: number;
}

export interface ISearchData {
  isSearching: boolean; // 是否正在搜索
  // 该搜索相关时间情况
  startAt: number;

  // 该搜索相关的搜索条件
  searchKey: string;
  searchPlanKey: string;

  // 该搜索相关的搜索结果
  searchPlan: Record<TSearchSolutionKey, ISearchPlanStatus>;
  searchResult: ISearchResultTorrent[];
}

export interface IRuntimePiniaStorageSchema {
  search: ISearchData;
  userInfo: {
    isFlush: boolean;
    flushPlan: Record<TSiteID, { isFlush: boolean }>;
  };
  uiGlobalSnakebar: {
    show: boolean;
  } & Partial<VSnackbar>;
}
