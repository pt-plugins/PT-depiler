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

searchQueue.addEventListener("active", () => {
  runtimeStore.mediaServerSearch.isSearching = true;
  // 启动后，根据 configStore 的值，自动更新 searchQueue 的并发数
  if (searchQueue.concurrency != configStore.mediaServerEntity.queueConcurrency) {
    searchQueue.concurrency = configStore.mediaServerEntity.queueConcurrency;
    sendMessage("logger", { msg: `Search queue concurrency changed to: ${searchQueue.concurrency}` }).catch();
  }
});

searchQueue.addEventListener("idle", () => {
  runtimeStore.mediaServerSearch.isSearching = false;
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
      // 请求真正发出前再校验一次：排队期间筛选可能已经变化，只向当前筛选出的服务器发送请求（#1599）
      if (!searchMediaServerIds.value.includes(mediaServerId)) {
        return;
      }

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
        // 只有认证类失败才提示检查认证信息，其余（超时/网络不可达/解析异常）展示真实原因（#1396）
        const failReason =
          searchResult.status === EResultParseStatus.needLogin
            ? "请检查认证信息"
            : (searchResult.errorMessage ?? "未知错误");
        runtimeStore.showSnackbar(
          `媒体服务器 ${mediaServerDetail.name} [${mediaServerDetail.address}] 更新失败：${failReason}`,
          {
            color: "error",
          },
        );
        return;
      }

      // 已存在的条目（同一 url）用新数据原位替换，保证收藏、观看状态等能随再次搜索刷新，而不是被当作重复丢弃
      for (const item of searchResult.items) {
        const existingIndex = runtimeStore.mediaServerSearch.searchResult.findIndex((r) => r.url === item.url);
        if (existingIndex !== -1) {
          runtimeStore.mediaServerSearch.searchResult[existingIndex] = markRaw(item);
        } else {
          runtimeStore.mediaServerSearch.searchResult.push(markRaw(item));
        }
      }

      // 如果本次有返回结果，则认为可以加载更多
      if (searchResult.items.length > 0) {
        runtimeStore.mediaServerSearch.searchStatus[mediaServerId].canLoadMore = true;
      }
    });
  }
}
