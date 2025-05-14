import type { VNodeProps } from "vue";
import type { VSnackbar } from "vuetify/components";
import type { EResultParseStatus, ITorrent, TSiteID } from "@ptd/site";
import type { IMediaServerItem, IMediaServerSearchResult } from "@ptd/mediaServer";

import type { TMediaServerKey, TSearchSnapshotKey, TSolutionKey } from "./metadata";

export type TSearchSolutionKey = `${TSiteID}|$|${TSolutionKey}`;

export interface ISearchResultTorrent extends ITorrent {
  uniqueId: string; // 每个种子的uniqueId，由 `${site}-${id}` 组成
  solutionId: TSolutionKey; // 对应搜索方案的id
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
  snapshot?: TSearchSnapshotKey; // 是否是一个搜索快照
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

export type SnackbarMessageOptions = Partial<
  Omit<
    VSnackbar["$props"],
    | "modelValue"
    | "onUpdate:modelValue"
    | "activator"
    | "activatorProps"
    | "closeDelay"
    | "openDelay"
    | "openOnClick"
    | "openOnFocus"
    | "openOnHover"
    | "$children"
    | "v-slots"
    | `v-slot:${string}`
    | keyof VNodeProps
  >
>;

export interface IRuntimePiniaStorageSchema {
  search: ISearchData;
  userInfo: {
    flushPlan: Record<TSiteID, boolean>;
  };
  mediaServerSearch: {
    isSearching: boolean; // 是否正在搜索
    searchKey: string;
    searchStatus: Record<TMediaServerKey, Omit<IMediaServerSearchResult, "items"> & { canLoadMore?: boolean }>; // 搜索状态
    searchResult: IMediaServerItem[];
  };
  uiGlobalSnakebar: SnackbarMessageOptions[]; // https://vuetifyjs.com/en/components/snackbar-queue/#props-model-value
}
