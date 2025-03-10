<script setup lang="ts">
import { ESearchResultParseStatus } from "@ptd/site";

import { watch, ref, computed } from "vue";
import { filesize } from "filesize";
import { useRoute } from "vue-router";
import PQueue from "p-queue";
import { format } from "date-fns";
import { refDebounced } from "@vueuse/core";

import { useSiteStore } from "@/options/stores/site.ts";
import { useUIStore } from "@/options/stores/ui.ts";

import { sendMessage } from "@/messages";
import { tableCustomFilter } from "./utils.ts";
import { type ISearchResultTorrent, type TSearchSolutionKey, useRuntimeStore } from "@/options/stores/runtime.ts";

import AdvanceFilterGenerateDialog from "./AdvanceFilterGenerateDialog.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SiteName from "@/options/components/SiteName.vue";

const route = useRoute();
const uiStore = useUIStore();
const siteStore = useSiteStore();
const runtimeStore = useRuntimeStore();

const queue = new PQueue({ concurrency: 1 }); // Use settingStore

const showAdvanceFilterGenerateDialog = ref<boolean>(false);

const fullTableHeader = [
  { title: "站点", key: "site", align: "center", width: 90, alwaysShow: true },
  { title: "标题", key: "title", align: "start", maxWidth: "35vw", alwaysShow: true },
  { title: "分类/入口", key: "category", align: "center", width: 150, minWidth: 150 },
  { title: "大小", key: "size", align: "end" },
  { title: "上传", key: "seeders", align: "end", width: 90, minWidth: 90 },
  { title: "下载", key: "leechers", align: "end", width: 90, minWidth: 90 },
  { title: "完成", key: "completed", align: "end", width: 90, minWidth: 90 },
  { title: "评论", key: "comments", align: "end", width: 90, minWidth: 90 },
  { title: "发布于(≈)", key: "time", align: "center" },
  { title: "操作", key: "action", align: "center", width: 130, minWidth: 130, alwaysShow: true },
];

const tableHeader = computed(() => {
  return fullTableHeader.filter(
    (item) => item.alwaysShow || uiStore.tableBehavior.searchEntity.columns!.includes(item.key),
  );
});

const tableWaitFilter = ref("");
const tableFilter = refDebounced(tableWaitFilter, 500); // 延迟搜索过滤词的生成
const tableSelected = ref<Array<ISearchResultTorrent["uniqueId"]>>([]);

watch(
  () => route.query,
  (newParams, oldParams) => {
    if (
      (newParams.search && newParams.search != oldParams.search) ||
      (newParams.plan && newParams.plan != oldParams.plan)
    ) {
      doSearch();
    }
  },
);

async function doSearch(flush = true) {
  // Reset search data
  if (flush) {
    runtimeStore.resetSearchData();
  }

  runtimeStore.search.startAt = +Date.now();
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
          const itemUniqueId = `${item.site}-${item.id}`;
          const isDuplicate = runtimeStore.search.searchResult.some((result) => result.uniqueId == itemUniqueId);
          if (!isDuplicate) {
            (item as ISearchResultTorrent).uniqueId = itemUniqueId;
            (item as ISearchResultTorrent).solutionId = solutionId;
            (item as ISearchResultTorrent).solutionKey = solutionKey;
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
      <template v-if="runtimeStore.search.startAt === 0">请输入搜索关键词开始搜索</template>
      <template v-else>
        搜索结果：
        <template v-if="runtimeStore.search.isSearching"> 正在搜索中.....</template>
        <template v-else>
          搜索完成， 共找到 {{ runtimeStore.search.searchResult.length }} 条结果， 耗时：
          {{ runtimeStore.search.costTime / 1000 }} 秒。

          <!-- TODO 全局重新搜索按钮 -->
          <v-btn color="primary" size="small" @click="doSearch">重新搜索</v-btn>
        </template>
      </template>
    </v-alert-title>
  </v-alert>
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-spacer />
        <v-text-field
          v-model="tableWaitFilter"
          append-icon="mdi-magnify"
          prepend-inner-icon="mdi-filter"
          label="在搜索结果中进一步过滤"
          single-line
          density="compact"
          :disabled="runtimeStore.search.isSearching"
          hide-details
          max-width="500"
          @click:prepend-inner="showAdvanceFilterGenerateDialog = true"
        />
      </v-row>
    </v-card-title>
    <v-data-table
      v-model="tableSelected"
      class="search-entity-table"
      :headers="tableHeader"
      :items="runtimeStore.search.searchResult"
      :items-per-page="uiStore.tableBehavior.searchEntity.itemsPerPage"
      item-value="uniqueId"
      :search="tableFilter"
      :custom-filter="tableCustomFilter"
      :filter-keys="['uniqueId'] /* 对每个item值只检索一次 */"
      show-select
      multi-sort
      :sort-by="uiStore.tableBehavior.searchEntity.sortBy"
      @update:itemsPerPage="(v) => uiStore.updateTableBehavior('searchEntity', 'itemsPerPage', v)"
      @update:sortBy="(v) => uiStore.updateTableBehavior('searchEntity', 'sortBy', v)"
    >
      <!-- 站点图标 -->
      <template #item.site="{ item }">
        <div class="d-flex flex-column align-center">
          <SiteFavicon :site-id="item.site" :size="18" />
          <SiteName :site-id="item.site" />
        </div>
      </template>

      <!-- 主标题，副标题，优惠及标签 -->
      <template #item.title="{ item }">
        <v-container class="t_main">
          <v-row>
            <a
              :href="item.url"
              class="t_title text-decoration-none text-subtitle-1 text-black text-truncate"
              :title="item.title"
              target="_blank"
              rel="noopener noreferrer nofollow"
              >{{ item.title }}</a
            >
          </v-row>
          <v-row>
            <v-chip v-for="tag in item.tags" label size="x-small" class="mr-1" :color="tag.color">
              {{ tag.name }}
            </v-chip>
            <span
              v-if="item.subTitle"
              class="t_subTitle text-grey text-truncate"
              :title="item.subTitle"
              :style="{
                // 防止标签导致的副标题溢出，这里假定每个 tag 的 width 为 40px 并额外增加 80px
                'max-width': item.tags ? `calc(35vw - ${40 * (item.tags.length + 2)}px)` : false,
              }"
            >
              {{ item.subTitle }}
            </span>
          </v-row>
        </v-container>
      </template>

      <!-- 种子大小 -->
      <template #item.size="{ item }">
        <span class="t_size text-no-wrap"> {{ filesize(item.size ?? 0) }}</span>
      </template>

      <!-- 上传人数 -->
      <template #item.seeders="{ item }">
        <span class="t_seeders text-no-wrap"> {{ item.seeders }}</span>
      </template>

      <!-- 下载人数 -->
      <template #item.leechers="{ item }">
        <span class="t_leechers text-no-wrap"> {{ item.leechers }}</span>
      </template>

      <!-- 完成人数 -->
      <template #item.completed="{ item }">
        <span class="t_completed text-no-wrap"> {{ item.completed }}</span>
      </template>

      <!-- 评论人数 -->
      <template #item.comments="{ item }">
        <span class="t_comments text-no-wrap"> {{ item.comments }}</span>
      </template>

      <!-- 发布日期 -->
      <template #item.time="{ item }">
        <span class="t_time text-no-wrap">{{ format(item.time ?? 0, "yyyy-MM-dd HH:mm") }}</span>
      </template>

      <!-- 其他操作 -->
      <template #item.action="{ item }"></template>
    </v-data-table>
  </v-card>

  <AdvanceFilterGenerateDialog
    v-model="showAdvanceFilterGenerateDialog"
    @update:table-filter="(v) => (tableWaitFilter = v)"
  />
</template>

<style scoped lang="scss"></style>
