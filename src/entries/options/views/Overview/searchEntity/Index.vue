<script setup lang="ts">
import { watch } from "vue";
import { filesize } from "filesize";
import { useRoute } from "vue-router";
import PQueue from "p-queue";

import { ISearchResultTorrent, TSearchSolutionKey, useRuntimeStore } from "@/options/stores/runtime.ts";
import { useSiteStore } from "@/options/stores/site.ts";
import { ESearchResultParseStatus, IAdvancedSearchRequestConfig, TSiteID } from "@ptd/site";
import { sendMessage } from "@/messages";
import { format } from "date-fns";
import { useUIStore } from "@/options/stores/ui.ts";
import SiteIcon from "@/options/views/Overview/searchEntity/SiteIcon.vue";

const route = useRoute();
const uiStore = useUIStore();
const siteStore = useSiteStore();
const runtimeStore = useRuntimeStore();

const queue = new PQueue({ concurrency: 1 }); // Use settingStore

const tableHeader = [
  {
    title: "站点",
    key: "site",
    align: "center",
  },
  {
    title: "标题",
    key: "title",
    align: "start",
  },
  {
    title: "分类/入口",
    key: "category",
    align: "center",
    width: 150,
  },
  {
    title: "大小",
    key: "size",
    align: "end",
    width: 100,
  },
  {
    title: "上传",
    key: "seeders",
    align: "end",
    width: 90,
  },
  {
    title: "下载",
    key: "leechers",
    align: "end",
    width: 90,
  },
  {
    title: "完成",
    key: "completed",
    align: "end",
    width: 90,
  },
  {
    title: "评论",
    key: "comments",
    align: "end",
    width: 90,
  },
  {
    title: "发布于(≈)",
    key: "time",
    align: "center",
    width: 150,
  },
  {
    title: "操作",
    key: "action",
    align: "center",
  },
];

watch(
  () => route.query,
  (newParams, oldParams) => {
    if (
      newParams.flush &&
      ((newParams.search && newParams.search != oldParams.search) ||
        (newParams.plan && newParams.plan != oldParams.plan))
    ) {
      doSearch(Boolean(newParams.flush));
    }
  },
);

async function doSearchEntry(siteId: TSiteID, solutionId: TSolutionID, searchEntry: IAdvancedSearchRequestConfig) {
  const keywords = runtimeStore.search.searchKey ?? "";
  const solutionKey = `${siteId}-${solutionId}` as TSearchSolutionKey;
  runtimeStore.search.searchPlanStatus[solutionKey] = ESearchResultParseStatus.working;
  sendMessage("getSiteSearchResult", { keywords, siteId, searchEntry }).then(
    ({ status: searchStatus, data: searchResult }) => {
      console.log(solutionKey, searchResult);
      runtimeStore.search.searchPlanStatus[solutionKey] = searchStatus;
      for (const item of searchResult) {
        (item as ISearchResultTorrent).solutionId = solutionKey;
        runtimeStore.search.searchResult.push(item as ISearchResultTorrent);
      }
    },
  );
}

async function doSearch(flush = true) {
  // Reset search data
  if (flush) {
    runtimeStore.resetSearchData();
  }

  runtimeStore.search.isSearching = true;
  runtimeStore.search.searchKey = (route.query.search as string) || "";
  runtimeStore.search.searchPlanKey = (route.query.plan as string) || "default";

  // Expand search plan
  const searchSolution = await siteStore.getSearchSolution(runtimeStore.search.searchPlanKey);
  console.log("Expand Search Plan: ", searchSolution);
  for (const { siteId, searchEntries } of searchSolution.solutions) {
    for (const [solutionId, searchEntry] of Object.entries(searchEntries)) {
      const solutionKey = `${siteId}-${solutionId}` as TSearchSolutionKey;
      runtimeStore.search.searchPlanStatus[solutionKey] = ESearchResultParseStatus.waiting;

      // Search site by plan in queue
      console.log(`Add search ${solutionId} to queue.`);
      await queue.add(async () => {
        console.log(`search ${solutionId} start.`);
        runtimeStore.search.searchPlanStatus[solutionKey] = ESearchResultParseStatus.working;
        const { status: searchStatus, data: searchResult } = await sendMessage("getSiteSearchResult", {
          keyword: runtimeStore.search.searchKey,
          siteId,
          searchEntry,
        });
        console.log(`success get search ${solutionId} result, with code ${searchStatus}: `, searchResult);
        runtimeStore.search.searchPlanStatus[solutionKey] = searchStatus;
        for (const item of searchResult) {
          const isDuplicate = runtimeStore.search.searchResult.some(
            (result) => result.site == item.site && result.id == item.id,
          );
          if (!isDuplicate) {
            // 补充一些参数
            (item as ISearchResultTorrent).solutionId = solutionKey;
            runtimeStore.search.searchResult.push(item as ISearchResultTorrent);
          }
        }
      });
    }
  }

  // Wait for all search tasks to complete
  await queue.onIdle();
  runtimeStore.search.isSearching = false;
  runtimeStore.search.costTime = +new Date() - runtimeStore.search.startAt;
}
</script>

<template>
  <v-alert type="info">
    <v-alert-title>
      搜索结果：
      <template v-if="runtimeStore.search.isSearching"> 正在搜索中..... </template>
      <template v-else>
        搜索完成， 共找到 {{ runtimeStore.search.searchResult.length }} 条结果， 耗时：
        {{ runtimeStore.search.costTime / 1000 }} 秒。

        <!-- TODO 全局重新搜索按钮 -->
        <v-btn color="primary" size="small" @click="doSearch">重新搜索</v-btn>
      </template>
    </v-alert-title>
  </v-alert>
  <v-card>
    <v-card-title>Title</v-card-title>
    <v-data-table
      class="search-entity-table"
      :headers="tableHeader"
      :items="runtimeStore.search.searchResult"
      :items-per-page="uiStore.tableBehavior.searchEntity.itemsPerPage"
      show-select
      multi-sort
      :sort-by="uiStore.tableBehavior.searchEntity.sortBy"
      @update:itemsPerPage="(v) => uiStore.updateTableBehavior('searchEntity', 'itemsPerPage', v)"
      @update:sortBy="(v) => uiStore.updateTableBehavior('searchEntity', 'sortBy', v)"
    >
      <template #item.site="{ item }">
        <SiteIcon :site-id="item.site"></SiteIcon>
      </template>
      <template #item.title="{ item }">
        {{ item.title }}
        <br />
        {{ item.subTitle ?? "" }}
      </template>
      <template #item.size="{ item }">
        {{ filesize(item.size ?? 0) }}
      </template>
      <template #item.time="{ item }">
        {{ format(item.time ?? 0, "yyyy-MM-dd HH:mm") }}
      </template>
      <template #item.action="{ item }"> </template>
    </v-data-table>
  </v-card>
</template>

<style scoped lang="scss"></style>
