<script setup lang="ts">
import { watch, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { refDebounced } from "@vueuse/core";
import { UseElementSize } from "@vueuse/components";

import { useSiteStore } from "@/options/stores/site.ts";
import { useUIStore } from "@/options/stores/ui.ts";
import { type ISearchResultTorrent, useRuntimeStore } from "@/options/stores/runtime.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import ActionTd from "./ActionTd.vue";
import SearchStatusDialog from "./SearchStatusDialog.vue";
import AdvanceFilterGenerateDialog from "./AdvanceFilterGenerateDialog.vue";

import { log } from "~/helper.ts";
import { formatDate, formatSize } from "@/options/utils.ts";
import { tableCustomFilter, doSearch, searchQueue } from "./utils.ts"; // <-- 主要方法在这个文件中！！！

const route = useRoute();
const uiStore = useUIStore();
const siteStore = useSiteStore();
const runtimeStore = useRuntimeStore();

const showAdvanceFilterGenerateDialog = ref<boolean>(false);
const showSearchStatusDialog = ref<boolean>(false);

const fullTableHeader = [
  { title: "站点", key: "site", align: "center", width: 90, alwaysShow: true },
  { title: "标题", key: "title", align: "start", minWidth: 600, maxWidth: "32vw", alwaysShow: true },
  { title: "分类/入口", key: "category", align: "center", width: 150, minWidth: 150 },
  { title: "大小", key: "size", align: "end" },
  { title: "上传", key: "seeders", align: "end", width: 90, minWidth: 90 },
  { title: "下载", key: "leechers", align: "end", width: 90, minWidth: 90 },
  { title: "完成", key: "completed", align: "end", width: 90, minWidth: 90 },
  { title: "评论", key: "comments", align: "end", width: 90, minWidth: 90 },
  { title: "发布于(≈)", key: "time", align: "center" },
  { title: "操作", key: "action", align: "center", width: 125, minWidth: 125, sortable: false, alwaysShow: true },
];

const tableHeader = computed(() => {
  return fullTableHeader.filter(
    (item) => item.alwaysShow || uiStore.tableBehavior.SearchEntity.columns!.includes(item.key),
  );
});

const tableWaitFilter = ref("");
const tableFilter = refDebounced(tableWaitFilter, 500); // 延迟搜索过滤词的生成
const tableSelected = ref<Array<ISearchResultTorrent["uniqueId"]>>([]);

watch(
  () => route.query,
  (newParams, oldParams) => {
    console.log("route.query", newParams, oldParams);
    if (
      newParams.flush ||
      (newParams.search && newParams.search != oldParams?.search) ||
      (newParams.plan && newParams.plan != oldParams?.plan)
    ) {
      doSearch((newParams.search as string) ?? "", (newParams.plan as string) ?? "default", true);
    }
  },
  { immediate: true, deep: true },
);

// TODO 通过 watch uiStore的设置，动态调整 队列长度

const isSearchingParsed = ref<boolean>(searchQueue.isPaused);

function pauseSearchQueue() {
  log("pauseSearchQueue", searchQueue);
  searchQueue.pause();
  isSearchingParsed.value = true;
}

function startSearchQueue() {
  log("startSearchQueue", searchQueue);
  searchQueue.start();
  isSearchingParsed.value = false;
}

function cancelSearchQueue() {
  log("cancelSearchQueue", searchQueue);
  searchQueue.clear();
  runtimeStore.search.isSearching = false;
}
</script>

<template>
  <v-alert type="info">
    <v-alert-title>
      <template v-if="runtimeStore.search.startAt === 0">请输入搜索关键词开始搜索</template>
      <template v-else>
        <v-btn color="primary" size="small" @click="showSearchStatusDialog = true" class="mr-2">搜索情况</v-btn>
        <template v-if="runtimeStore.search.isSearching">
          <template v-if="isSearchingParsed">搜索暂停中...</template>
          <template v-else>搜索中...</template>
        </template>
        <template v-else>
          使用方案 [{{ siteStore.getSearchSolutionName(runtimeStore.search.searchPlanKey) }}] 搜索关键词 [{{
            runtimeStore.search.searchKey
          }}] 完成， 共找到 {{ runtimeStore.search.searchResult.length }} 条结果， 耗时：
          {{ runtimeStore.searchCostTime / 1000 }} 秒。
        </template>
      </template>
    </v-alert-title>
  </v-alert>
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-btn-group size="small" variant="text">
          <v-btn
            v-show="isSearchingParsed"
            @click="() => startSearchQueue()"
            icon="mdi-play"
            color="success"
            title="开始搜索队列"
          ></v-btn>
          <v-btn
            v-show="!isSearchingParsed"
            @click="() => pauseSearchQueue()"
            icon="mdi-pause"
            color="success"
            title="暂停搜索队列"
          ></v-btn>

          <v-btn
            v-show="runtimeStore.search.isSearching"
            icon="mdi-cancel"
            color="red"
            title="取消当前等待的搜索"
            @click="cancelSearchQueue"
          ></v-btn>
          <v-btn
            v-show="!runtimeStore.search.isSearching"
            icon="mdi-cached"
            color="red"
            title="重新搜索"
            :disabled="isSearchingParsed"
            @click="() => doSearch(null as unknown as string, null as unknown as string, true)"
          ></v-btn>

          <!-- TODO 创建搜索快照 -->
          <v-btn icon="mdi-camera-plus" color="cyan" :disabled="true || runtimeStore.search.isSearching"></v-btn>
        </v-btn-group>

        <v-divider vertical class="mx-2" />

        <ActionTd :torrent-ids="tableSelected" />

        <v-divider vertical class="mx-2" />

        <v-combobox
          multiple
          chips
          v-model="uiStore.tableBehavior.SearchEntity.columns"
          :items="fullTableHeader.map((item) => item.key)"
          max-width="220"
          density="compact"
          hide-details
          class="table-header-filter-clear"
          prepend-inner-icon="mdi-filter-cog"
        >
          <template #chip="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ fullTableHeader.find((x) => x.key == item.title)?.title }}</span>
            </v-chip>
            <span v-if="index === 1" class="grey--text caption">
              (+{{ uiStore.tableBehavior.SearchEntity.columns!.length - 1 }} others)
            </span>
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item>
              <v-checkbox
                v-model="uiStore.tableBehavior.SearchEntity.columns"
                density="compact"
                hide-details
                :value="item.title"
                :disabled="fullTableHeader.find((x) => x.key == item.title)?.alwaysShow"
                :label="fullTableHeader.find((x) => x.key == item.title)?.title"
              ></v-checkbox>
            </v-list-item>
          </template>
        </v-combobox>

        <v-spacer />
        <v-text-field
          v-model="tableWaitFilter"
          append-icon="mdi-magnify"
          prepend-inner-icon="mdi-filter"
          label="过滤搜索结果"
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
      :items-per-page="uiStore.tableBehavior.SearchEntity.itemsPerPage"
      item-value="uniqueId"
      :search="tableFilter"
      :custom-filter="tableCustomFilter"
      :filter-keys="['uniqueId'] /* 对每个item值只检索一次 */"
      show-select
      multi-sort
      :sort-by="uiStore.tableBehavior.SearchEntity.sortBy"
      @update:itemsPerPage="(v) => uiStore.updateTableBehavior('SearchEntity', 'itemsPerPage', v)"
      @update:sortBy="(v) => uiStore.updateTableBehavior('SearchEntity', 'sortBy', v)"
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
        <use-element-size v-slot="{ width }">
          <v-container class="t_main">
            <v-row>
              <a
                :href="item.url"
                class="t_title text-decoration-none text-subtitle-1 text-black text-truncate"
                :title="item.title"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                {{ item.title }}
              </a>
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
                  // 防止标签导致的副标题溢出，这里假定每个 tag 的 width 为 40px 并额外增加 40px （用于消除 padding）
                  'max-width': item.tags ? `${width - 40 * (item.tags.length + 1)}px` : false,
                }"
              >
                {{ item.subTitle }}
              </span>
            </v-row>
          </v-container>
        </use-element-size>
      </template>

      <!-- 种子大小 -->
      <template #item.size="{ item }">
        <span class="t_size text-no-wrap">{{ formatSize(item.size ?? 0) }}</span>
      </template>

      <!-- 上传人数 -->
      <template #item.seeders="{ item }">
        <span class="t_seeders text-no-wrap">{{ item.seeders }}</span>
      </template>

      <!-- 下载人数 -->
      <template #item.leechers="{ item }">
        <span class="t_leechers text-no-wrap">{{ item.leechers }}</span>
      </template>

      <!-- 完成人数 -->
      <template #item.completed="{ item }">
        <span class="t_completed text-no-wrap">{{ item.completed }}</span>
      </template>

      <!-- 评论人数 -->
      <template #item.comments="{ item }">
        <span class="t_comments text-no-wrap">{{ item.comments }}</span>
      </template>

      <!-- 发布日期 -->
      <template #item.time="{ item }">
        <span class="t_time text-no-wrap">{{ formatDate(item.time ?? 0) }}</span>
      </template>

      <!-- 其他操作 -->
      <template #item.action="{ item }">
        <ActionTd :torrent-ids="[item.uniqueId]" density="compact" />
      </template>
    </v-data-table>
  </v-card>

  <AdvanceFilterGenerateDialog
    v-model="showAdvanceFilterGenerateDialog"
    @update:table-filter="(v) => (tableWaitFilter = v)"
  />
  <SearchStatusDialog v-model="showSearchStatusDialog"></SearchStatusDialog>
</template>

<style scoped lang="scss"></style>
