<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { EResultParseStatus, ETorrentStatus } from "@ptd/site";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { formatDate, formatSize, formatTimeAgo } from "@/options/utils.ts";
import type { ISearchResultTorrent } from "@/shared/types.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import TorrentTitleTd from "@/options/components/TorrentTitleTd.vue";
import TorrentProcessTd from "./TorrentProcessTd.vue";
import ActionTd from "./ActionTd.vue";
import SearchStatusDialog from "./SearchStatusDialog.vue";
import SaveSnapshotDialog from "./SaveSnapshotDialog.vue";
import AdvanceFilterGenerateDialog from "./AdvanceFilterGenerateDialog.vue";

import { doSearch, searchQueue, tableCustomFilter } from "./utils.ts"; // <-- 主要方法在这个文件中！！！

const { t } = useI18n();
const route = useRoute();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

const showAdvanceFilterGenerateDialog = ref<boolean>(false);
const showSearchStatusDialog = ref<boolean>(false);
const showSaveSnapshotDialog = ref<boolean>(false);

const fullTableHeader = [
  { title: t("SearchEntity.index.table.site"), key: "site", align: "center", width: 90, props: { disabled: true } },
  {
    title: t("SearchEntity.index.table.title"),
    key: "title",
    align: "start",
    minWidth: 600,
    maxWidth: "32vw",
    props: { disabled: true },
  },
  { title: t("SearchEntity.index.table.category"), key: "category", align: "center", width: 90 },
  { title: t("SearchEntity.index.table.size"), key: "size", align: "end" },
  { title: t("SearchEntity.index.table.seeders"), key: "seeders", align: "end", width: 90, minWidth: 90 },
  { title: t("SearchEntity.index.table.leechers"), key: "leechers", align: "end", width: 90, minWidth: 90 },
  { title: t("SearchEntity.index.table.completed"), key: "completed", align: "end", width: 90, minWidth: 90 },
  { title: t("SearchEntity.index.table.comments"), key: "comments", align: "end", width: 90, minWidth: 90 },
  { title: t("SearchEntity.index.table.time"), key: "time", align: "center" },
  {
    title: t("common.action"),
    key: "action",
    align: "center",
    width: 125,
    minWidth: 125,
    sortable: false,
    props: { disabled: true },
  },
] as (DataTableHeader & { props?: any })[];

const tableHeader = computed(() => {
  return fullTableHeader.filter(
    (item) => item?.props?.disabled || configStore.tableBehavior.SearchEntity.columns!.includes(item.key!),
  ) as DataTableHeader[];
});

const { tableFilterRef, tableWaitFilterRef, tableFilterFn } = tableCustomFilter;

const tableSelected = ref<Array<ISearchResultTorrent["uniqueId"]>>([]);

watch(
  () => route.query,
  (newParams, oldParams) => {
    if (newParams.snapshot) {
      metadataStore.getSearchSnapshotData(newParams.snapshot as string).then((data) => {
        data && (runtimeStore.search = { ...data, snapshot: newParams.snapshot as string });
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
  console.log("pauseSearchQueue", searchQueue);
  searchQueue.pause();
  isSearchingParsed.value = true;
}

function startSearchQueue() {
  console.log("startSearchQueue", searchQueue);
  searchQueue.start();
  isSearchingParsed.value = false;
}

function cancelSearchQueue() {
  console.log("cancelSearchQueue", searchQueue);
  searchQueue.clear(); // 清空搜索队列
  // 将搜索队列中状态设置为跳过
  for (const key of Object.keys(runtimeStore.search.searchPlan)) {
    // @ts-ignore
    if (runtimeStore.search.searchPlan[key]!.status === EResultParseStatus.waiting) {
      // @ts-ignore
      runtimeStore.search.searchPlan[key]!.status = EResultParseStatus.passParse;
    }
  }

  runtimeStore.search.isSearching = false;
}
</script>

<template>
  <v-alert type="info">
    <v-alert-title>
      <template v-if="runtimeStore.search.startAt === 0">
        {{ t("SearchEntity.index.alert.enterKeyword") }}
      </template>
      <template v-else>
        <v-btn class="mr-2" color="primary" size="small" @click="showSearchStatusDialog = true">
          {{ t("SearchEntity.index.alert.statusButton") }}
        </v-btn>
        <template v-if="runtimeStore.search.isSearching">
          <template v-if="isSearchingParsed">
            {{ t("SearchEntity.index.alert.paused") }}
          </template>
          <template v-else>
            {{ t("SearchEntity.index.alert.searching") }}
          </template>
        </template>
        <template v-else>
          <template v-if="runtimeStore.search.snapshot">
            {{ t("SearchEntity.index.alert.snapshot") }}
            [{{ metadataStore.snapshots[runtimeStore.search.snapshot].name }}]，
          </template>
          <template v-else>
            {{ t("SearchEntity.index.alert.plan") }}
            [{{ metadataStore.getSearchSolutionName(runtimeStore.search.searchPlanKey) }}]，
          </template>
          {{ t("SearchEntity.index.alert.keyword") }}
          [{{ runtimeStore.search.searchKey }}]，
          {{ t("SearchEntity.index.alert.results", [runtimeStore.search.searchResult.length]) }}
          {{ t("SearchEntity.index.alert.duration", [(runtimeStore.searchCostTime / 1000).toFixed(1)]) }}
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
            color="success"
            icon="mdi-play"
            :title="t('SearchEntity.index.action.start')"
            @click="() => startSearchQueue()"
          ></v-btn>
          <v-btn
            v-show="!isSearchingParsed"
            color="success"
            icon="mdi-pause"
            :title="t('SearchEntity.index.action.pause')"
            @click="() => pauseSearchQueue()"
          ></v-btn>

          <v-btn
            v-show="runtimeStore.search.isSearching"
            color="red"
            icon="mdi-cancel"
            :title="t('SearchEntity.index.action.cancel')"
            @click="cancelSearchQueue"
          ></v-btn>
          <v-btn
            v-show="!runtimeStore.search.isSearching"
            :disabled="isSearchingParsed"
            color="red"
            icon="mdi-cached"
            :title="t('SearchEntity.index.action.retry')"
            @click="() => doSearch(null as unknown as string, null as unknown as string, true)"
          ></v-btn>

          <!-- 创建搜索快照 -->
          <v-btn
            :disabled="runtimeStore.search.isSearching || runtimeStore.search.searchResult.length === 0"
            color="cyan"
            icon="mdi-camera-plus"
            @click="showSaveSnapshotDialog = true"
          ></v-btn>
        </v-btn-group>

        <v-divider vertical class="mx-2" />

        <ActionTd :torrent-ids="tableSelected" />

        <v-divider vertical class="mx-2" />

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn-group size="small" variant="text">
              <v-btn color="blue" icon="mdi-cog" v-bind="props" />
            </v-btn-group>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in configStore.searchEntifyControl" :key="index" :value="index">
              <template v-slot:prepend>
                <v-list-item-action start class="ml-2">
                  <v-switch
                    v-model="configStore.searchEntifyControl[index]"
                    :label="`&nbsp;${t('SearchEntity.index.' + index)}`"
                    color="success"
                    density="compact"
                    hide-details
                    @click.stop
                    @update:model-value="() => configStore.$save()"
                  />
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-combobox
          v-model="configStore.tableBehavior.SearchEntity.columns"
          :items="fullTableHeader"
          :return-object="false"
          chips
          class="table-header-filter-clear ml-1"
          density="compact"
          hide-details
          item-value="key"
          max-width="180"
          multiple
          prepend-inner-icon="mdi-filter-cog"
          @update:model-value="(v) => configStore.updateTableBehavior('SearchEntity', 'columns', v)"
        >
          <template #chip="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ item.title }}</span>
            </v-chip>
            <span v-if="index === 1" class="grey--text caption">
              (+{{ configStore.tableBehavior.SearchEntity.columns!.length - 1 }})
            </span>
          </template>
        </v-combobox>

        <v-spacer />
        <v-text-field
          v-model="tableWaitFilterRef"
          :disabled="runtimeStore.search.searchResult.length === 0"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          :label="t('SearchEntity.index.filterLabel')"
          max-width="500"
          prepend-inner-icon="mdi-filter"
          single-line
          @click:prepend-inner="showAdvanceFilterGenerateDialog = true"
        />

        <!-- Multi-sort 帮助图标 -->
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn-group size="small" variant="text" v-bind="props">
              <v-btn icon="mdi-help-circle" color="info" :ripple="false" />
            </v-btn-group>
          </template>
          <div style="max-width: 300px; white-space: pre-wrap">{{ t("SearchEntity.index.help") }}</div>
        </v-tooltip>
      </v-row>
    </v-card-title>
    <v-data-table
      id="ptd-search-entity-table"
      v-model="tableSelected"
      :custom-filter="tableFilterFn"
      :filter-keys="['uniqueId'] /* 对每个item值只检索一次 */"
      :headers="tableHeader"
      :items="runtimeStore.search.searchResult"
      :items-per-page="configStore.tableBehavior.SearchEntity.itemsPerPage"
      :search="tableFilterRef"
      :sort-by="configStore.tableBehavior.SearchEntity.sortBy"
      class="search-entity-table table-stripe table-header-no-wrap"
      hover
      item-value="uniqueId"
      multi-sort
      show-select
      @update:itemsPerPage="(v) => configStore.updateTableBehavior('SearchEntity', 'itemsPerPage', v)"
      @update:sortBy="(v) => configStore.updateTableBehavior('SearchEntity', 'sortBy', v)"
    >
      <!-- 站点图标 -->
      <template #item.site="{ item }">
        <div class="d-flex flex-column align-center">
          <SiteFavicon :site-id="item.site" :size="configStore.searchEntifyControl.showSiteName ? 18 : 24" />
          <SiteName v-if="configStore.searchEntifyControl.showSiteName" :site-id="item.site" />
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
          <v-row v-if="item.status && (item.status as ETorrentStatus) !== ETorrentStatus.unknown">
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
        <span class="t_time text-no-wrap" :title="item.time ? (formatDate(item.time) as string) : '-'">
          {{
            item.time
              ? configStore.searchEntifyControl.uploadAtFormatAsAlive
                ? formatTimeAgo(item.time)
                : formatDate(item.time)
              : "-"
          }}
        </span>
      </template>

      <!-- 其他操作 -->
      <template #item.action="{ item }">
        <ActionTd :torrent-ids="[item.uniqueId]" density="compact" />
      </template>
    </v-data-table>
  </v-card>

  <AdvanceFilterGenerateDialog
    v-model="showAdvanceFilterGenerateDialog"
    @update:table-filter="(v) => (tableWaitFilterRef = v)"
  />
  <SearchStatusDialog v-model="showSearchStatusDialog"></SearchStatusDialog>
  <SaveSnapshotDialog v-model="showSaveSnapshotDialog"></SaveSnapshotDialog>
</template>

<style scoped lang="scss">
#ptd-search-entity-table {
  :deep(td.v-data-table__td) {
    padding: 0 8px;
  }
}
</style>
