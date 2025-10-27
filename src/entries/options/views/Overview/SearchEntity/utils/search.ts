import PQueue from "p-queue";
import { computed, markRaw } from "vue";
import { EResultParseStatus, ETorrentStatus, type IAdvanceKeywordSearchConfig, type TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import type { ISearchResultTorrent, TSearchSolutionKey } from "@/shared/types.ts";

import { tableCustomFilter } from "./filter.ts";

const runtimeStore = useRuntimeStore();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

const { advanceFilterDictRef, updateTableFilterValueFn, resetAdvanceFilterDictFn } = tableCustomFilter;

// 模块级别的 Set，用于跟踪已存在的搜索结果 ID，避免并发时的重复
const globalExistingIds = new Set<string>();

export const searchQueue = new PQueue({ concurrency: 1 }); // 默认设置为 1，避免并发搜索

searchQueue.on("active", () => {
  runtimeStore.search.isSearching = true;
  // 启动后，根据 configStore 的值，自动更新 searchQueue 的并发数
  if (searchQueue.concurrency != configStore.searchEntity.queueConcurrency) {
    searchQueue.concurrency = configStore.searchEntity.queueConcurrency;
    console.debug("Search queue concurrency changed to: ", searchQueue.concurrency);
  }
  // 队列开始活跃时，更新全局 Set
  globalExistingIds.clear();
  runtimeStore.search.searchResult.forEach((r) => globalExistingIds.add(r.uniqueId));
});

searchQueue.on("idle", () => {
  runtimeStore.search.isSearching = false;
  runtimeStore.search.endAt = Date.now();
  // 队列空闲时，清空全局 Set
  globalExistingIds.clear();
});

interface ISearchPlanStatusMap {
  success: number; // success, noResults
  error: number; // unknownError, parseError, needLogin
  queued: number; // waiting, working
}

export const defaultErrorSearchPlanStatus = [
  EResultParseStatus.parseError,
  EResultParseStatus.unknownError,
  EResultParseStatus.CFBlocked,
  EResultParseStatus.needLogin,
];

export const searchPlanStatus = computed<ISearchPlanStatusMap>(() => {
  const statusMap: ISearchPlanStatusMap = { success: 0, error: 0, queued: 0 };
  Object.values(runtimeStore.search.searchPlan ?? {}).forEach((plan) => {
    switch (plan.status) {
      case EResultParseStatus.success:
      case EResultParseStatus.noResults:
        statusMap.success++;
        break;
      case EResultParseStatus.unknownError:
      case EResultParseStatus.parseError:
      case EResultParseStatus.CFBlocked:
      case EResultParseStatus.needLogin:
        statusMap.error++;
        break;
      case EResultParseStatus.waiting:
      case EResultParseStatus.working:
        statusMap.queued++;
        break;
    }
  });
  return statusMap;
});

export async function raiseSearchPriority(solutionKey: TSearchSolutionKey) {
  const currentPriority = runtimeStore.search.searchPlan[solutionKey].queuePriority ?? 1;
  searchQueue.setPriority(solutionKey, currentPriority + 1);
}

export async function doSearchEntity(
  siteId: TSiteID,
  searchEntryName: string,
  searchEntry: IAdvanceKeywordSearchConfig,
  flush: boolean = false,
) {
  const solutionKey = `${siteId}|$|${searchEntryName}` as TSearchSolutionKey;
  let queuePriority = runtimeStore.search.searchPlan[solutionKey]?.queuePriority ?? 1;

  // 对重新搜索的，清除对应搜索方法的搜索结果
  if (flush) {
    const removedItems = runtimeStore.search.searchResult.filter((item) => item.solutionKey === solutionKey);
    runtimeStore.search.searchResult = runtimeStore.search.searchResult.filter(
      (item) => item.solutionKey != solutionKey,
    );
    // 同步更新全局 Set，移除被删除项目的 uniqueId
    removedItems.forEach((item) => globalExistingIds.delete(item.uniqueId));
    queuePriority -= 1; // 对重新搜索的，降低优先级
  }

  runtimeStore.search.searchPlan[solutionKey] = {
    siteId,
    searchEntryName,
    searchEntry,
    status: EResultParseStatus.waiting,
    queuePriority,
    count: 0,
  };

  // Search site by plan in queue
  console.log(`Add search ${solutionKey} to queue.`);
  runtimeStore.search.searchPlan[solutionKey].queueAt = Date.now();

  // noinspection ES6MissingAwait
  searchQueue.add(
    async () => {
      const startAt = (runtimeStore.search.searchPlan[solutionKey].startAt = Date.now());
      console.log(`search ${solutionKey} start at ${startAt}`);
      runtimeStore.search.searchPlan[solutionKey].status = EResultParseStatus.working;

      let searchKeyword = runtimeStore.search.searchKey ?? "";
      if (configStore.searchEntity.treatTTQueryAsImdbSearch && searchKeyword.match(/^tt\d{7,8}/)) {
        searchKeyword = "imdb|" + searchKeyword;
      }

      const { status: searchStatus, data: searchResult } = await sendMessage("getSiteSearchResult", {
        keyword: searchKeyword,
        siteId,
        searchEntry,
      });
      console.log(`success get search ${solutionKey} result, with code ${searchStatus}: `, searchResult);
      runtimeStore.search.searchPlan[solutionKey].status = searchStatus;

      // 优化：批量处理搜索结果，减少响应式更新次数
      const newItems: ISearchResultTorrent[] = [];

      for (const item of searchResult) {
        const itemUniqueId = `${item.site}-${item.id}`;
        if (!globalExistingIds.has(itemUniqueId)) {
          const searchResultItem = item as ISearchResultTorrent;
          searchResultItem.uniqueId = itemUniqueId;
          searchResultItem.solutionId = searchEntryName;
          searchResultItem.solutionKey = solutionKey;
          searchResultItem.status ??= ETorrentStatus.unknown; // 确保 status 字段有默认值，避免过滤器无法处理 undefined
          newItems.push(markRaw(searchResultItem)); // 使用 markRaw 冻结对象，避免 Vue 创建响应式代理，提升性能
          globalExistingIds.add(itemUniqueId);
        }
      }

      // 批量添加新项目，减少响应式更新
      if (newItems.length > 0) {
        runtimeStore.search.searchResult.push(...newItems);
      }

      // 更新计数状态
      const endAt = Date.now();
      runtimeStore.search.searchPlan[solutionKey].count = newItems.length;
      runtimeStore.search.searchPlan[solutionKey].endAt = endAt;
      runtimeStore.search.searchPlan[solutionKey].costTime = endAt - startAt;
      resetAdvanceFilterDictFn();
    },
    { priority: queuePriority, id: solutionKey },
  );
}

export async function doSearch(search: string, plan?: string, flush: boolean = true) {
  const searchKey = search ?? runtimeStore.search.searchKey ?? "";
  const searchPlanKey = plan ?? runtimeStore.search.searchPlanKey ?? "default";

  if (flush) {
    runtimeStore.resetSearchData();

    try {
      // 清除过滤器中的站点关键词，但保留其他过滤器
      advanceFilterDictRef.value.site.required = [];
      advanceFilterDictRef.value.site.exclude = [];
      updateTableFilterValueFn();
    } catch (e) {
      console.error("Failed to reset table filter site field: ", e);
    }
  }

  console.log("Start search with: ", searchKey, searchPlanKey, flush);

  runtimeStore.search.searchKey = searchKey;
  runtimeStore.search.searchPlanKey = searchPlanKey;

  // Expand search plan
  const searchSolution = await metadataStore.getSearchSolution(runtimeStore.search.searchPlanKey);

  if (!searchSolution) {
    runtimeStore.showSnakebar(`搜索方案 [${searchPlanKey}] 不存在`, { color: "error" });
    return;
  }

  runtimeStore.search.searchPlanKey = searchSolution.id; // 重写 searchPlanKey 为实际的 id
  console.log(`Expanded Search Plan for ${searchPlanKey}: `, searchSolution);

  if (searchSolution.solutions.length === 0) {
    runtimeStore.showSnakebar("请至少添加一个站点进行搜索", { color: "error" });
    return;
  }

  runtimeStore.search.startAt = Date.now();
  runtimeStore.search.isSearching = true;

  for (const { siteId, searchEntries } of searchSolution.solutions) {
    for (const [searchEntryName, searchEntry] of Object.entries(searchEntries)) {
      await doSearchEntity(siteId, searchEntryName, searchEntry);
    }
  }
}

export async function retrySearch(retryStatus: EResultParseStatus[] = defaultErrorSearchPlanStatus) {
  const shouldRetrySearchPlan = Object.values(runtimeStore.search.searchPlan).filter((plan) =>
    retryStatus.includes(plan.status),
  );
  if (shouldRetrySearchPlan.length === 0) {
    runtimeStore.showSnakebar("没有需要重试的搜索计划", { color: "info" });
    return;
  }
  console.log("Retrying search plans: ", shouldRetrySearchPlan);
  for (const plan of shouldRetrySearchPlan) {
    await doSearchEntity(plan.siteId, plan.searchEntryName, plan.searchEntry, true);
  }
}
