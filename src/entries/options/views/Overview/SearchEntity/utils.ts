import PQueue from "p-queue";
import { computed, ref, watch } from "vue";
import { refDebounced } from "@vueuse/core";
import searchQueryParser, { type SearchParserOptions } from "search-query-parser";

import {
  EResultParseStatus,
  parseSizeString,
  parseValidTimeString,
  type IAdvanceKeywordSearchConfig,
  type TSiteID,
} from "@ptd/site";
import type { ISearchResultTorrent, TSearchSolutionKey } from "@/shared/storages/types/runtime.ts";
import { sendMessage } from "@/messages.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useConfigStore } from "@/options/stores/config.ts";

import { log, checkRange, dateFilterFormat } from "~/helper.ts";

export const searchQueryParserOptions: SearchParserOptions = {
  keywords: ["site", "tags"],
  // ranges项的exclude不做支持，FIXME 目前是静默忽视，需要给出提示信息
  ranges: ["date", "size", "seeders", "leechers", "completed"],
  tokenize: true,
  offsets: false,
  alwaysArray: true,
};

const runtimeStore = useRuntimeStore();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

export const tableWaitFilter = ref(metadataStore.lastSearchFilter ?? ""); // 搜索过滤词
export const tableFilter = refDebounced(tableWaitFilter, 500); // 延迟搜索过滤词的生成
const tableParsedFilter = computed(() => searchQueryParser.parse(tableFilter.value, searchQueryParserOptions));

export function tableCustomFilter(value: any, query: string, item: any) {
  const rawItem = item.raw as ISearchResultTorrent;
  const itemTitle = `${rawItem.title}|$|${rawItem.subTitle ?? ""}`.toLowerCase();
  const itemTags = (rawItem.tags ?? []).map((tag) => tag.name);

  // @ts-ignore
  const { site, tags, date, size, seeders, leechers, completed, text, exclude } = tableParsedFilter.value;

  if (site && !site.includes(rawItem.site)) return false;
  if (tags && !tags.every((tag: string) => itemTags.includes(tag))) return false;

  if (date && rawItem.time) {
    const startDateTimestamp = parseValidTimeString(date.from, dateFilterFormat) as number;
    const endDateTimestamp = parseValidTimeString(date.to, dateFilterFormat) as number;
    if (!checkRange({ from: startDateTimestamp, to: endDateTimestamp }, rawItem.time)) return false;
  } else if (date) {
    return false;
  }

  if (size && rawItem.size) {
    const startSize = size.from ? parseSizeString(size.from) : 0;
    const endSize = size.to ? parseSizeString(size.to) : Infinity;
    if (!checkRange({ from: startSize, to: endSize }, rawItem.size)) return false;
  } else if (size) {
    return false;
  }

  // @ts-ignore
  if (seeders && !isNaN(rawItem.seeders) && !checkRange(seeders, rawItem.seeders)) return false;
  // @ts-ignore
  if (leechers && !isNaN(rawItem.leechers) && !checkRange(leechers, rawItem.leechers)) return false;
  // @ts-ignore
  if (completed && !isNaN(rawItem.completed) && !checkRange(completed, rawItem.completed)) return false;

  if (text && !text.map((x: string) => x.toLowerCase()).every((keyword: string) => itemTitle.includes(keyword)))
    return false;

  if (exclude) {
    const { site: exSite, tags: exTags, text: exText } = exclude;
    if (exSite && exSite.includes(rawItem.site)) return false;
    if (exTags && exTags.some((tag: string) => itemTags.includes(tag))) return false;
    if (exText) {
      const excludesText = (Array.isArray(exText) ? exText : [exText]).map((x) => x.toLowerCase());
      if (excludesText.some((keyword: string) => itemTitle.includes(keyword))) return false;
    }
  }

  return true;
}

watch(tableFilter, (newValue) => {
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
    log("Search queue concurrency changed to: ", searchQueue.concurrency);
  }
});

searchQueue.on("idle", () => {
  runtimeStore.search.isSearching = false;
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
  log(`Add search ${searchEntryName} to queue.`);
  runtimeStore.search.searchPlan[solutionKey].queueAt = +new Date();

  // noinspection ES6MissingAwait
  searchQueue.add(
    async () => {
      const startAt = (runtimeStore.search.searchPlan[solutionKey].startAt = +new Date());
      log(`search ${searchEntryName} start at ${startAt}`);
      runtimeStore.search.searchPlan[solutionKey].status = EResultParseStatus.working;
      const { status: searchStatus, data: searchResult } = await sendMessage("getSiteSearchResult", {
        keyword: runtimeStore.search.searchKey,
        siteId,
        searchEntry,
      });
      log(`success get search ${searchEntryName} result, with code ${searchStatus}: `, searchResult);
      runtimeStore.search.searchPlan[solutionKey].status = searchStatus;
      for (const item of searchResult) {
        const itemUniqueId = `${item.site}-${item.id}`;
        const isDuplicate = runtimeStore.search.searchResult.some((result) => result.uniqueId == itemUniqueId);
        if (!isDuplicate) {
          (item as ISearchResultTorrent).uniqueId = itemUniqueId;
          (item as ISearchResultTorrent).solutionId = searchEntryName;
          (item as ISearchResultTorrent).solutionKey = solutionKey;
          runtimeStore.search.searchResult.push(item as ISearchResultTorrent);
        }
      }
      runtimeStore.search.searchPlan[solutionKey].count = runtimeStore.search.searchResult.filter(
        (item) => item.solutionKey == solutionKey,
      ).length;
      runtimeStore.search.searchPlan[solutionKey].costTime = +new Date() - startAt;
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

  log("Start search with: ", searchKey, searchPlanKey, flush);

  runtimeStore.search.searchKey = searchKey;
  runtimeStore.search.searchPlanKey = searchPlanKey;

  // Expand search plan
  const metadataStore = useMetadataStore();
  const searchSolution = await metadataStore.getSearchSolution(runtimeStore.search.searchPlanKey);

  if (!searchSolution) {
    runtimeStore.showSnakebar(`搜索方案 [${searchPlanKey}] 不存在`, { color: "error" });
    return;
  }

  runtimeStore.search.searchPlanKey = searchSolution.id; // 重写 searchPlanKey 为实际的 id
  log(`Expanded Search Plan for ${searchPlanKey}: `, searchSolution);

  if (searchSolution.solutions.length === 0) {
    runtimeStore.showSnakebar("请至少添加一个站点进行搜索", { color: "error" });
    return;
  }

  runtimeStore.search.startAt = +Date.now();
  runtimeStore.search.isSearching = true;

  for (const { siteId, searchEntries } of searchSolution.solutions) {
    for (const [searchEntryName, searchEntry] of Object.entries(searchEntries)) {
      await doSearchEntity(siteId, searchEntryName, searchEntry);
    }
  }

  // Wait for all search tasks to complete
  await searchQueue.onIdle();
}
