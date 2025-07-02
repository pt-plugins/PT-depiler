/**
 * 此处放置一些其他数据，这些数据一般具有以下特征：
 * 1. 不需要persist
 * 2. 不需要跨tab共享的
 * 3. 可以在不同component中共享的
 */

import { defineStore } from "pinia";
import type { IRuntimePiniaStorageSchema, ISearchData, SnackbarMessageOptions } from "@/shared/types.ts";

const initialSearchData: () => ISearchData = () => ({
  isSearching: false,
  startAt: 0,
  endAt: 0,
  searchKey: "",
  searchPlanKey: "default",
  searchPlan: {},
  searchResult: [],
});

const initialMediaServerSearchData = () => ({
  isSearching: false,
  searchKey: "",
  searchStatus: {},
  searchResult: [],
});

export const useRuntimeStore = defineStore("runtime", {
  persist: {
    storage: sessionStorage,
    key: "__ptd_runtime_store", // 由于 runtimeStore 可能会在 content-script 中注册，所以此处需要使用一个独特的 key
  },
  persistWebExt: false,
  state: (): IRuntimePiniaStorageSchema => ({
    search: initialSearchData(),
    userInfo: {
      flushPlan: {},
    },
    mediaServerSearch: initialMediaServerSearchData(),
    uiGlobalSnakebar: [],
  }),

  getters: {
    searchCostTime(state) {
      if (!state.search.startAt) {
        return 0;
      }

      // 如果搜索正在进行，则使用当前时间作为结束时间；否则使用记录的结束时间
      const endTime = state.search.isSearching ? Date.now() : state.search.endAt;

      // 如果 endTime 无效（例如搜索刚结束但 endAt 未写入），则使用 startAt 作为备用，使返回值为0
      return (endTime || state.search.startAt) - state.search.startAt;
    },

    isUserInfoFlush(state) {
      return Object.values(state.userInfo.flushPlan).some((v) => v);
    },
  },

  actions: {
    resetSearchData() {
      this.search = initialSearchData();
    },

    resetMediaServerSearchData() {
      this.mediaServerSearch = initialMediaServerSearchData();
    },

    showSnakebar(text: string, options: SnackbarMessageOptions = {}) {
      // @ts-ignore
      this.uiGlobalSnakebar.push({ text, ...options });
    },
  },
});
