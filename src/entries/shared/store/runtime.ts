/**
 * 此处放置一些其他数据，这些数据一般具有以下特征：
 * 1. 不需要persist
 * 2. 不需要跨tab共享的
 * 3. 可以在不同component中共享的
 */

import { defineStore } from "pinia";

export const useRuntimeStore = defineStore("runtime", {
  state: () => ({
    lastSearchEntity: {
      plan: "default",  // 搜索方案
      search: "",  // 搜索字段
      isSearching: false, // 是否正在搜索
      timestamp: 0,  // 搜索完成时间戳
      data: [],  // 搜索结果
    }
  }),

  actions: {
  }
});
