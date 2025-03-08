<script setup lang="ts">
import { watch } from "vue";
import { filesize } from "filesize";
import { useRoute } from "vue-router";
import PQueue from "p-queue";

import { ISearchResultTorrent, TSearchSolutionKey, useRuntimeStore } from "@/options/stores/runtime.ts";
import { TSolutionID, useSiteStore } from "@/options/stores/site.ts";
import { ESearchResultParseStatus, IAdvancedSearchRequestConfig, TSiteID } from "@ptd/site";
import { sendMessage } from "@/messages";
import SiteFavicon from "@/options/components/SiteFavicon.vue";

const route = useRoute();
const runtimeStore = useRuntimeStore();
const siteStore = useSiteStore();
const queue = new PQueue({ concurrency: 1 }); // Use settingStore

const tableHeader = [
  {
    title: "站点",
    key: "site",
    align: "center",
  },
  {
    title: "名称",
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
    align: "center",
    width: 60,
  },
  {
    title: "下载",
    key: "leechers",
    align: "center",
    width: 60,
  },
  {
    title: "完成",
    key: "completed",
    align: "center",
    width: 60,
  },
  {
    title: "评论",
    key: "comments",
    align: "center",
    width: 60,
  },
  {
    title: "发布时间(~)",
    key: "time",
    align: "center",
    width: 130,
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
  for (const { siteId, searchEntries } of searchSolution.solutions) {
    for (const [solutionId, searchEntry] of Object.entries(searchEntries)) {
      const solutionKey = `${siteId}-${solutionId}` as TSearchSolutionKey;
      runtimeStore.search.searchPlanStatus[solutionKey] = ESearchResultParseStatus.waiting;

      // Search site by plan in queue
      await queue.add(async () => {
        runtimeStore.search.searchPlanStatus[solutionKey] = ESearchResultParseStatus.working;
        const { status: searchStatus, data: searchResult } = await sendMessage("getSiteSearchResult", {
          keyword: runtimeStore.search.searchKey,
          siteId,
          searchEntry,
        });
        runtimeStore.search.searchPlanStatus[solutionKey] = searchStatus;
        for (const item of searchResult) {
          const isDuplicate = runtimeStore.search.searchResult.some(
            (result) => result.site == item.site && result.id == item.id,
          );
          if (!isDuplicate) {
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
        搜索完成， 共找到 {{ runtimeStore.search.searchResult.length }} 个结果， 耗时：
        {{ runtimeStore.search.costTime / 1000 }} 秒。

        <!-- TODO 全局重新搜索按钮 -->
        <v-btn color="primary" @click="doSearch">重新搜索</v-btn>
      </template>
    </v-alert-title>
  </v-alert>
  <v-card>
    <v-data-table :headers="tableHeader" :items="runtimeStore.search.searchResult">
      <template #item.site="{ item }">
        <SiteFavicon v-model="item.site" />
        <a :href="'#'" target="_blank" rel="noopener noreferrer nofollow" class="captionText">{{ item.site }}</a>
      </template>
      <template #item.title="{ item }">
        {{ item.title }}
        <br />
        {{ item.subTitle ?? "" }}
      </template>
      <template #item.size="{ item }">
        {{ filesize(item.size) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped lang="scss"></style>
