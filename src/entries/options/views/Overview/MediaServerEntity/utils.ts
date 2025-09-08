import PQueue from "p-queue";
import { markRaw, ref } from "vue";
import { omit } from "es-toolkit";
import { type IMediaServerSearchOptions } from "@ptd/mediaServer";

import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { TMediaServerKey } from "@/shared/types.ts";
import { EResultParseStatus } from "@ptd/site";
const runtimeStore = useRuntimeStore();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

export const searchMediaServerIds = ref<TMediaServerKey[]>(
  metadataStore.getEnabledMediaServers.map((mediaServer) => mediaServer.id) ?? [],
);

export const searchQueue = new PQueue({ concurrency: 1 }); // 默认设置为 1，避免并发搜索

// 模块级别的 Set，用于跟踪已存在的搜索结果 ID，避免并发时的重复
const globalExistingIds = new Set<string>();

searchQueue.on("active", () => {
  runtimeStore.mediaServerSearch.isSearching = true;
  // 启动后，根据 configStore 的值，自动更新 searchQueue 的并发数
  if (searchQueue.concurrency != configStore.mediaServerEntity.queueConcurrency) {
    searchQueue.concurrency = configStore.mediaServerEntity.queueConcurrency;
    sendMessage("logger", { msg: `Search queue concurrency changed to: ${searchQueue.concurrency}` }).catch();
  }

  // 队列开始活跃时，更新全局 Set
  globalExistingIds.clear();
  runtimeStore.mediaServerSearch.searchResult.forEach((r) => globalExistingIds.add(r.url));
});

searchQueue.on("idle", () => {
  runtimeStore.mediaServerSearch.isSearching = false;

  // 队列空闲时，清空全局 Set
  globalExistingIds.clear();
});

export async function doSearch(option: { searchKey?: string; loadMore?: boolean } = {}) {
  const { searchKey = "", loadMore = false } = option;

  if (searchKey != runtimeStore.mediaServerSearch.searchKey) {
    runtimeStore.resetMediaServerSearchData();
  }

  runtimeStore.mediaServerSearch.searchKey = searchKey;

  for (const mediaServerId of searchMediaServerIds.value) {
    // noinspection ES6MissingAwait
    searchQueue.add(async () => {
      let searchOptions: IMediaServerSearchOptions = { limit: configStore.mediaServerEntity.searchLimit ?? 50 };
      if (loadMore) {
        searchOptions = runtimeStore.mediaServerSearch.searchStatus[mediaServerId]?.options ?? {};
        searchOptions.startIndex = (searchOptions.startIndex ?? 0) + (searchOptions.limit ?? 0);
      }

      const searchResult = await sendMessage("getMediaServerSearchResult", {
        mediaServerId,
        keywords: searchKey,
        options: searchOptions,
      });

      runtimeStore.mediaServerSearch.searchStatus[mediaServerId] = {
        ...omit(searchResult, ["items"]),
        canLoadMore: false,
      };

      if (searchResult.status !== EResultParseStatus.success) {
        const mediaServerDetail = metadataStore.mediaServers[mediaServerId];
        runtimeStore.showSnakebar(
          `媒体服务器 ${mediaServerDetail.name} [${mediaServerDetail.address}] 更新失败，请检查认证信息`,
          { color: "error" },
        );
        return;
      }

      for (const item of searchResult.items) {
        // 根据 url 去重
        const isDuplicate = globalExistingIds.has(item.url);
        if (!isDuplicate) {
          runtimeStore.mediaServerSearch.searchResult.push(markRaw(item));
          globalExistingIds.add(item.url);
          // 如果本次有成功添加的，则认为可以加载更多
          runtimeStore.mediaServerSearch.searchStatus[mediaServerId].canLoadMore = true;
        }
      }
    });
  }
}
