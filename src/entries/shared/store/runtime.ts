/**
 * 此处放置一些其他数据，这些数据一般具有以下特征：
 * 1. 不需要persist
 * 2. 不需要跨tab共享的
 * 3. 可以在不同component中共享的
 */

import { defineStore } from "pinia";
import { ISearchTorrent, storedSearchSolution } from "@/shared/store/site.ts";
import { useSessionStorage } from "@vueuse/core";
import { ESearchResultParseStatus } from "@ptd/site";

interface searchData {
  isSearching: boolean; // 是否正在搜索
  // 该搜索相关时间情况
  startAt: number;
  costTime: number; // 搜索耗时

  // 该搜索相关的搜索条件
  searchKey: string;
  searchPlanKey: string;
  searchPlan: Required<storedSearchSolution>; // 展开后的搜索方案

  // 该搜索相关的搜索结果
  searchPlanStatus: Record<string, ESearchResultParseStatus>;
  searchResult: ISearchTorrent[];
}

export const initialSearchData: () => searchData = () => ({
  isSearching: false,
  startAt: 0,
  costTime: 0,
  searchKey: "",
  searchPlanKey: "",
  searchPlan: {} as Required<storedSearchSolution>,
  searchPlanStatus: {},
  searchResult: [],
});

// 使用sessionStorage存储搜索结果，用来保持在单页面切换时候的恢复上一次搜索结果
export const searchData = useSessionStorage<searchData>(
  "PTD_SearchData",
  initialSearchData,
);

export const useRuntimeStore = defineStore("runtime", {
  state: () => ({}),

  actions: {},
});
