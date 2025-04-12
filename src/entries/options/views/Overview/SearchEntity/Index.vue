<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { refDebounced } from "@vueuse/core";
import { ETorrentStatus } from "@ptd/site";

import { type ISearchResultTorrent } from "@/shared/storages/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useUIStore } from "@/options/stores/ui.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import { log } from "~/helper.ts";
import { formatDate, formatSize } from "@/options/utils.ts";
import { doSearch, searchQueue, tableCustomFilter } from "./utils.ts"; // <-- 主要方法在这个文件中！！！

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import TorrentTitleTd from "./TorrentTitleTd.vue";
import TorrentProcessTd from "./TorrentProcessTd.vue";
import ActionTd from "./ActionTd.vue";
import SearchStatusDialog from "./SearchStatusDialog.vue";
import SaveSnapshotDialog from "./SaveSnapshotDialog.vue";
import AdvanceFilterGenerateDialog from "./AdvanceFilterGenerateDialog.vue";

const route = useRoute();
const uiStore = useUIStore();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

const showAdvanceFilterGenerateDialog = ref<boolean>(false);
const showSearchStatusDialog = ref<boolean>(false);
const showSaveSnapshotDialog = ref<boolean>(false);

const fullTableHeader = [
  { title: "站点", key: "site", align: "center", width: 90, alwaysShow: true },
  { title: "标题", key: "title", align: "start", minWidth: 600, maxWidth: "32vw", alwaysShow: true },
  { title: "分类", key: "category", align: "center", width: 90 },
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
    if (newParams.snapshot) {
      metadataStore.getSearchSnapshotData(newParams.snapshot as string).then((data) => {
        data && (runtimeStore.search = data);
      });
    } else {
      if (
        newParams.flush ||
        (newParams.search && newParams.search != oldParams?.search) ||
        (newParams.plan && newParams.plan != oldParams?.plan)
      ) {
        doSearch((newParams.search as string) ?? "", (newParams.plan as string) ?? "default", true);
      }
    }
  },
  { immediate: true, deep: true },
);

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
          使用方案 [{{ metadataStore.getSearchSolutionName(runtimeStore.search.searchPlanKey) }}] 搜索关键词 [{{
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
          <v-btn
            icon="mdi-camera-plus"
            color="cyan"
            :disabled="runtimeStore.search.isSearching || runtimeStore.search.searchResult.length === 0"
            @click="showSaveSnapshotDialog = true"
          ></v-btn>
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
      id="ptd-search-entity-table"
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
      hover
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
        <TorrentTitleTd :item="item" />
      </template>

      <!-- 种子大小，下载情况 -->
      <template #item.size="{ item }">
        <v-container no-gutters>
          <v-row>
            <v-col class="pa-0">
              <span class="t_size text-no-wrap">{{ formatSize(item.size ?? 0) }}</span>
            </v-col>
          </v-row>
          <v-row v-if="item.status !== ETorrentStatus.unknown">
            <v-col class="pa-0">
              <TorrentProcessTd :torrent="item"></TorrentProcessTd>
            </v-col>
          </v-row>
        </v-container>
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
  <SaveSnapshotDialog v-model="showSaveSnapshotDialog"></SaveSnapshotDialog>
</template>

<style scoped lang="scss">
.v-theme--dark {
  #ptd-search-entity-table {
    :deep(tr.v-data-table__tr:nth-child(even)) {
      background-color: #2a2a2a;
    }
  }
}

#ptd-search-entity-table {
  :deep(tr.v-data-table__tr:nth-child(even)) {
    background-color: #f1f1f1;
  }

  :deep(td.v-data-table__td) {
    padding: 0 8px;
  }
}
</style>
