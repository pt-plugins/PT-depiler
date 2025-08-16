import PQueue from "p-queue";
import { computed, watch } from "vue";
import { EResultParseStatus, type IAdvanceKeywordSearchConfig, ITorrentTag, type TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useTableCustomFilter } from "@/options/directives/useAdvanceFilter.ts";
import type { ISearchResultTorrent, TSearchSolutionKey } from "@/shared/types.ts";

const runtimeStore = useRuntimeStore();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

export const tableCustomFilter = useTableCustomFilter({
  parseOptions: {
    keywords: ["site", "tags"],
    ranges: ["time", "size", "seeders", "leechers", "completed"],
  },
  titleFields: ["title", "subTitle"],
  initialSearchValue: metadataStore.lastSearchFilter,
  initialItems: computed(() => runtimeStore.search.searchResult),
  format: {
    tags: {
      parse: (value: ITorrentTag) => (value ?? {}).name,
    },
    time: "date",
    size: "size",
  },
});

watch(tableCustomFilter.tableFilterRef, (newValue) => {
  if (configStore.searchEntity.saveLastFilter) {
    // noinspection JSIgnoredPromiseFromCall
    metadataStore.setLastSearchFilter(newValue);
  }
});

export const searchQueue = new PQueue({ concurrency: 1 }); // 默认设置为 1，避免并发搜索

searchQueue.on("active", () => {
  runtimeStore.search.isSearching = true;
  // 启动后，根据 configStore 的值，自动更新 searchQueue 的并发数
  if (searchQueue.concurrency != configStore.searchEntity.queueConcurrency) {
    searchQueue.concurrency = configStore.searchEntity.queueConcurrency;
    console.log("Search queue concurrency changed to: ", searchQueue.concurrency);
  }
});

searchQueue.on("idle", () => {
  runtimeStore.search.isSearching = false;
  runtimeStore.search.endAt = Date.now();
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
    runtimeStore.search.searchResult = runtimeStore.search.searchResult.filter(
      (item) => item.solutionKey != solutionKey,
    );
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
      const existingIds = new Set(runtimeStore.search.searchResult.map((r) => r.uniqueId));

      for (const item of searchResult) {
        const itemUniqueId = `${item.site}-${item.id}`;
        if (!existingIds.has(itemUniqueId)) {
          (item as ISearchResultTorrent).uniqueId = itemUniqueId;
          (item as ISearchResultTorrent).solutionId = searchEntryName;
          (item as ISearchResultTorrent).solutionKey = solutionKey;
          newItems.push(item as ISearchResultTorrent);
          existingIds.add(itemUniqueId);
        }
      }

      // 批量添加新项目，减少响应式更新
      if (newItems.length > 0) {
        runtimeStore.search.searchResult.push(...newItems);
      }
      runtimeStore.search.searchPlan[solutionKey].count = runtimeStore.search.searchResult.filter(
        (item) => item.solutionKey == solutionKey,
      ).length;
      const endAt = Date.now();
      runtimeStore.search.searchPlan[solutionKey].endAt = endAt;
      runtimeStore.search.searchPlan[solutionKey].costTime = endAt - startAt;
    },
    { priority: queuePriority, id: solutionKey },
  );
}

export async function doSearch(search: string, plan?: string, flush: boolean = true) {
  const searchKey = search ?? runtimeStore.search.searchKey ?? "";
  const searchPlanKey = plan ?? runtimeStore.search.searchPlanKey ?? "default";

  // Reset search data
  if (flush) {
    runtimeStore.resetSearchData();
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
