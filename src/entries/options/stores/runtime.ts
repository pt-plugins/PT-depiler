/**
 * 此处放置一些其他数据，这些数据一般具有以下特征：
 * 1. 不需要persist
 * 2. 不需要跨tab共享的
 * 3. 可以在不同component中共享的
 */

import { defineStore } from "pinia";
import type { IRuntimePiniaStorageSchema, ISearchData } from "@/shared/storages/runtime.ts";

export const initialSearchData: () => ISearchData = () => ({
  isSearching: false,
  startAt: 0,
  searchKey: "",
  searchPlanKey: "default",
  searchPlan: {},
  searchResult: [],
});

export const resetUiGlobalSnakebar = () => ({
  show: false,
  text: "",
  color: "success",
});

export const useRuntimeStore = defineStore("runtime", {
  persist: true,
  persistWebExt: false,
  state: () =>
    ({
      search: initialSearchData(),
      userInfo: {
        isFlush: false,
        flushPlan: {},
      },
      uiGlobalSnakebar: resetUiGlobalSnakebar(),
    }) as IRuntimePiniaStorageSchema,

  getters: {
    searchCostTime(state) {
      return Object.values(state.search.searchPlan).reduce((acc, cur) => acc + (cur.costTime ?? 0), 0);
    },
  },

  actions: {
    resetSearchData() {
      this.search = initialSearchData();
    },

    showSnakebar(text: string, options: Omit<IRuntimePiniaStorageSchema["uiGlobalSnakebar"], "show" | "text"> = {}) {
      // @ts-ignore
      this.uiGlobalSnakebar = { show: true, text, ...options };
      if (options.timeout) {
        setTimeout(() => {
          this.uiGlobalSnakebar = resetUiGlobalSnakebar();
        }, Number(options.timeout));
      }
    },
  },
});
