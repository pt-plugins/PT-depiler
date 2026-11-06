<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { type DataTableHeader } from "vuetify";
import {
  EResultParseStatus,
  ETorrentStatus,
  getTorrentVolumeFactors,
  normalizeTorrentPromotion,
  promotionToTags,
} from "@ptd/site";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useTableActionColumn } from "@/options/directives/useTableActionColumn.ts";
import { formatDate, formatSize, formatTimeAgo } from "@/options/utils.ts";
import type { ISearchResultTorrent } from "@/shared/types.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import TorrentTitleTd from "@/options/components/TorrentTitleTd.vue";

import ActionTd from "./ActionTd.vue";
import TorrentProcessTd from "./TorrentProcessTd.vue";
import QuickFilterNotice from "./QuickFilterNotice.vue";
import SearchStatusDialog from "./SearchStatusDialog.vue";
import SaveSnapshotDialog from "./SaveSnapshotDialog.vue";
import AdvanceFilterGenerateDialog from "./AdvanceFilterGenerateDialog.vue";

// 主要助手方法
import { tableCustomFilter } from "./utils/filter";
import { doSearch, retrySearch, searchPlanStatus, searchQueue } from "./utils/search";

const { t } = useI18n();
const route = useRoute();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

/**
 * 只对「搜索快照」在加载时做一次归一（数据是 sendMessage 回来的普通对象，尚未进入 Pinia store）。
 *
 * 注意：不要在 setup 里对 runtimeStore.search.searchResult 做实时归一 —— runtime store 用
 * sessionStorage 持久化，且每次 mutation 都会触发整份 state 的序列化；逐条改种子会引发
 * N 次全量写入（devtools 里表现为单次 135s 的 RunTask + 大量 setItem）。
 * 实时搜索结果在 offscreen（getSiteSearchResult）阶段已经归一过了，无需重复计算。
 */
function normalizeSnapshotPromotions(items: ISearchResultTorrent[] = []) {
  items.forEach((item) => normalizeTorrentPromotion(item));
}

const showAdvanceFilterGenerateDialog = ref<boolean>(false);
const showSearchStatusDialog = ref<boolean>(false);
const showSaveSnapshotDialog = ref<boolean>(false);

/** 优惠信息的展示形式：tags（默认，仅标签）/ factor / both / none（不显示），见 SetBase → 搜索 */
const promotionDisplay = computed<"tags" | "factor" | "both" | "none">(() => {
  const value = configStore.searchEntifyControl.promotionDisplay;
  return value === "factor" || value === "both" || value === "none" ? value : "tags";
});
const showPromoColumn = computed(() => promotionDisplay.value === "factor" || promotionDisplay.value === "both");

const titleColumnWidth = ref("36rem");

const fullTableHeader = computed(
  () =>
    [
      { title: t("common.site"), key: "site", align: "center", width: 124, props: { disabled: true } },
      {
        title: t("SearchEntity.index.table.title"),
        key: "title",
        align: "start",
        // 标题列宽度 = 容器剩余空间（见 otherColumnsWidth），下限 24rem。
        // 必须配合 table-layout: fixed 才成立，否则 nowrap 标题的 min-content 会顶开列宽。
        // 超出部分单行省略（完整标题见 title 提示），行高由内容决定，不设固定值。
        width: titleColumnWidth.value,
        props: { disabled: true },
      },
      { title: t("SearchEntity.index.table.category"), key: "category", align: "center", width: 104 },
      ...(showPromoColumn.value
        ? [
            {
              title: t("SearchEntity.index.table.downloadVolumeFactor"),
              key: "downloadVolumeFactor",
              align: "center",
              width: 104,
              sortRaw: promoSortRaw,
            },
          ]
        : []),
      { title: t("SearchEntity.index.table.size"), key: "size", align: "end", width: 128 },
      { title: t("SearchEntity.index.table.seeders"), key: "seeders", align: "end", width: 88 },
      { title: t("SearchEntity.index.table.leechers"), key: "leechers", align: "end", width: 88 },
      { title: t("SearchEntity.index.table.completed"), key: "completed", align: "end", width: 88 },
      { title: t("SearchEntity.index.table.comments"), key: "comments", align: "end", width: 88 },
      { title: t("SearchEntity.index.table.time"), key: "time", align: "center", width: 122 },
      {
        title: t("common.action"),
        key: "action",
        align: "center",
        // 操作列固定为窄宽：按钮组是紧凑密度的图标按钮（约 20px 一个，最多 5 个 ≈ 100px），
        // 定宽后不再参与表格剩余空间的分配，也不会随窗口宽度被拉宽或压扁。
        width: 148,
        sortable: false,
        props: { disabled: true },
      },
    ] as (DataTableHeader & { props?: any })[],
);

/**
 * 除标题列之外、当前实际启用的所有列宽之和（px）。
 *
 * 从 fullTableHeader 推导而不是写死：用户在列选择器里取消勾选某一列（或切换优惠列）时，
 * 剩余空间会变大，标题列必须跟着变宽，否则表格会缩在一边。
 * 48 是复选框选择列（show-select）的实测宽度。
 */
const otherColumnsWidth = computed(() => {
  const enabledColumns = configStore.tableBehavior.SearchEntity.columns ?? [];
  let width = 48;
  for (const header of fullTableHeader.value) {
    if (header.key === "title") continue;
    // 只统计实际会渲染出来的列：props.disabled 的列（站点/操作）恒定显示，
    // 其余列要用户勾选过才渲染，否则会多算宽度、把标题列算窄。
    if (!header?.props?.disabled && !enabledColumns.includes(header.key!)) continue;
    if (typeof header.width === "number") width += header.width;
  }
  return width;
});

let titleResizeObserver: ResizeObserver | undefined;

function updateTitleColumnWidth() {
  const wrapper = document.querySelector<HTMLElement>("#ptd-search-entity-table .v-table__wrapper");
  if (!wrapper) return;
  const available = wrapper.clientWidth - otherColumnsWidth.value;
  titleColumnWidth.value = `${Math.max(384, available)}px`;
}

// 优惠列开关会改变「其余列」的总和，需要重算
watch(otherColumnsWidth, updateTitleColumnWidth);

onMounted(() => {
  updateTitleColumnWidth();
  const wrapper = document.querySelector<HTMLElement>("#ptd-search-entity-table .v-table__wrapper");
  if (wrapper && typeof ResizeObserver !== "undefined") {
    titleResizeObserver = new ResizeObserver(updateTitleColumnWidth);
    titleResizeObserver.observe(wrapper);
  }
});

onBeforeUnmount(() => titleResizeObserver?.disconnect());

const tableHeader = computed(() => {
  return useTableActionColumn(
    fullTableHeader.value.filter(
      (item) => item?.props?.disabled || configStore.tableBehavior.SearchEntity.columns!.includes(item.key!),
    ) as DataTableHeader[],
  );
});

/**
 * 优惠信息展示形式与列配置同步：切到 factor / both 时自动勾选「优惠」列，
 * 切回 tags 时取消（顺带清理旧版本残留在列配置里的 key）。
 * 只监听模式变化，这样用户在 factor 模式下仍可在列选择器里手动取消该列。
 */
watch(
  showPromoColumn,
  (enabled, oldEnabled) => {
    if (enabled === oldEnabled) return;

    const columns = configStore.tableBehavior.SearchEntity.columns ?? [];
    const hasPromoColumn = columns.includes("downloadVolumeFactor");
    if (enabled && !hasPromoColumn) {
      configStore.updateTableBehavior("SearchEntity", "columns", [...columns, "downloadVolumeFactor"]);
    } else if (!enabled && hasPromoColumn) {
      configStore.updateTableBehavior(
        "SearchEntity",
        "columns",
        columns.filter((key) => key !== "downloadVolumeFactor"),
      );
    }
  },
  { immediate: true },
);

const { tableFilterRef, tableWaitFilterRef, tableFilterFn, buildAdvanceItemPropsFn, buildFilterDictFn } =
  tableCustomFilter;

// 使用 shallowRef 优化：种子对象数组不需要深度响应式，提升性能
const tableSelectedRaw = shallowRef<ISearchResultTorrent[]>([]);

watch(
  () => route.query,
  (newParams, oldParams) => {
    if (newParams.snapshot) {
      metadataStore.getSearchSnapshotData(newParams.snapshot as string).then((data) => {
        if (data) {
          // 在进入 Pinia store 之前对普通对象做一次归一，避免逐条 mutation 触发 sessionStorage 全量写入
          normalizeSnapshotPromotions(data.searchResult);
          runtimeStore.search = { ...data, snapshot: newParams.snapshot as string };
        }
        // 如果启用了快速站点筛选，则重置一下筛选器，以防止快速站点筛选中无站点数据
        if (configStore.searchEntity.quickSiteFilter) {
          buildAdvanceItemPropsFn();
        }
      });
    } else {
      if (
        newParams.flush ||
        (newParams.search && newParams.search != oldParams?.search) ||
        (newParams.plan && newParams.plan != oldParams?.plan)
      ) {
        // 清理已选择项 （ #622 ）
        tableSelectedRaw.value = [];
        // doSearch 会自动处理过滤器重置
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
      // @ts-ignore
      runtimeStore.search.searchPlan[key]!.statusMsg = "i18n.userCancel";
    }
  }

  runtimeStore.search.isSearching = false;
}

const tableNonBooleanControlKey = ["maxTagCountBeforeGroup", "hiddenTagNames", "promotionDisplay"];

// 过滤出表格控制中非布尔类型的键
const filteredTableBooleanControlKeys = computed(() => {
  return Object.keys(configStore.searchEntifyControl).filter(
    (key) => tableNonBooleanControlKey.indexOf(key) === -1,
  ) as (keyof typeof configStore.searchEntifyControl)[];
});

const hiddenTagNamesText = computed({
  get: () => configStore.searchEntifyControl.hiddenTagNames.join("\n"),
  set: (val: string) => {
    configStore.searchEntifyControl.hiddenTagNames = val
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  },
});

// 相同大小种子分组色条（ #1411 ），len 为 8，按 size 升序循环，保证相邻分组不同色
const sizeGroupPalette = ["#F44336", "#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#00BCD4", "#8BC34A", "#795548"];

// sizeKey 以表格中实际展示的大小文本为准：web 解析出的 1.02 GiB 与 API 给出的 bytes 只要展示一致就会同组
const getSizeKey = (size?: number) => (size ? String(formatSize(size)) : "");

const sizeGroupColors = computed(() => {
  const colors = new Map<string, string>();
  const sortBy = configStore.tableBehavior.SearchEntity.sortBy;

  // 仅在开启开关且当前按大小排序时生效
  if (!configStore.searchEntifyControl.highlightSameSizeTorrent || !sortBy?.some((item) => item.key === "size")) {
    return colors;
  }

  const groups = new Map<string, { size: number; count: number }>();
  for (const item of runtimeStore.search.searchResult) {
    if (!item.size) continue;
    const key = getSizeKey(item.size);
    const group = groups.get(key);
    if (group) {
      group.count++;
    } else {
      groups.set(key, { size: item.size, count: 1 });
    }
  }

  // 按 size 升序编号（仅在 count > 1 时才画出色条）
  [...groups.entries()]
    .sort(([, a], [, b]) => a.size - b.size)
    .forEach(([key, { count }], index) => {
      if (count > 1) colors.set(key, sizeGroupPalette[index % sizeGroupPalette.length]!);
    });

  return colors;
});

function sizeGroupRowProps({ item }: { item: ISearchResultTorrent }) {
  const color = sizeGroupColors.value.get(getSizeKey(item.size));
  return color ? { style: { "--ptd-size-group-color": color } } : {};
}

/**
 * 缓存每个种子的量系数：promoSortRaw 在排序时会被调用 O(n log n) 次，
 * 若每次都从 tags 反推（每条标签要跑一遍预定义正则），上万条结果时会直接把界面卡死。
 */
const volumeFactorCache = new WeakMap<ISearchResultTorrent, ReturnType<typeof getTorrentVolumeFactors>>();

function getCachedVolumeFactors(item: ISearchResultTorrent) {
  let factors = volumeFactorCache.get(item);
  if (!factors) {
    factors = getTorrentVolumeFactors(item);
    volumeFactorCache.set(item, factors);
  }
  return factors;
}

/**
 * 优惠列的排序：下载系数升序（免费在前），同系数时上传倍数高的在前。
 * 只有上传倍率、没有下载折扣的种子按「正常下载」参与排序（不能当成未知排到最后）。
 */
function promoSortRaw(a: ISearchResultTorrent, b: ISearchResultTorrent): number {
  const factorsA = getCachedVolumeFactors(a);
  const factorsB = getCachedVolumeFactors(b);

  const downloadA =
    factorsA.downloadVolumeFactor ??
    (factorsA.uploadVolumeFactor !== undefined && factorsA.uploadVolumeFactor !== 1 ? 1 : Number.POSITIVE_INFINITY);
  const downloadB =
    factorsB.downloadVolumeFactor ??
    (factorsB.uploadVolumeFactor !== undefined && factorsB.uploadVolumeFactor !== 1 ? 1 : Number.POSITIVE_INFINITY);

  if (downloadA !== downloadB) return downloadA - downloadB;

  return (factorsB.uploadVolumeFactor ?? 1) - (factorsA.uploadVolumeFactor ?? 1);
}

/**
 * 优惠列展示：与标签使用同一套「因子 → 标签」规则（promotionToTags）。
 * 这样只有上传倍率的种子（如 2xUp）也会显示出来，而不是被当成「无优惠」显示 -。
 */
function promoCellText(item: ISearchResultTorrent): string {
  const { downloadVolumeFactor, uploadVolumeFactor } = getCachedVolumeFactors(item);
  if (downloadVolumeFactor === undefined && uploadVolumeFactor === undefined) return "-";

  const text = promotionToTags(downloadVolumeFactor, uploadVolumeFactor)
    .map((tag) => tag.name)
    .join(" · ");
  return text || "-";
}
</script>

<template>
  <v-alert type="info">
    <v-alert-title>
      <template v-if="runtimeStore.search.startAt === 0">
        {{ t("SearchEntity.index.alert.enterKeyword") }}
      </template>
      <template v-else>
        <template v-if="runtimeStore.search.isSearching">
          <template v-if="isSearchingParsed">
            {{ t("SearchEntity.index.alert.paused") }}
          </template>
          <template v-else>
            <template v-if="runtimeStore.search.searchResult.length > 0">
              {{ t("SearchEntity.index.alert.plan") }}
              [{{ metadataStore.getSearchSolutionName(runtimeStore.search.searchPlanKey) }}]，
              {{ t("SearchEntity.index.alert.keyword") }}
              [{{ runtimeStore.search.searchKey }}]，
              {{ t("SearchEntity.index.alert.searchProgress", [runtimeStore.search.searchResult.length]) }}
            </template>
            <template v-else>
              {{ t("SearchEntity.index.alert.searching") }}
            </template>
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

        <v-spacer />

        <v-btn
          :title="t('SearchEntity.index.alert.searchStatus')"
          class="mr-2 status-btn"
          color="primary"
          size="small"
          @click="showSearchStatusDialog = true"
        >
          <template v-if="searchPlanStatus.success > 0">
            <v-icon class="mr-1" icon="mdi-check" size="x-small" />{{ searchPlanStatus.success }}
          </template>
          <template v-if="searchPlanStatus.error > 0">
            <v-icon class="mr-1" color="amber" icon="mdi-alert" size="x-small" />{{ searchPlanStatus.error }}
          </template>
          <template v-if="searchPlanStatus.queued > 0">
            <v-icon class="mr-1" color="blue-grey" icon="mdi-clock" size="x-small" />{{ searchPlanStatus.queued }}
          </template>
        </v-btn>
      </template>
    </v-alert-title>
  </v-alert>
  <v-card>
    <v-card-title>
      <v-row gap="0" class="ma-0">
        <!-- 不指定 size：Vuetify 4 下图标按钮为 (--v-btn-height + 12px) 的正方形（48 × 48），与 ActionTd 保持一致 -->
        <v-btn-group variant="text">
          <!-- 启动/暂停 搜索队列 -->
          <v-btn
            v-show="isSearchingParsed"
            :title="t('SearchEntity.index.action.start')"
            color="success"
            icon="mdi-play"
            @click="() => startSearchQueue()"
          />
          <v-btn
            v-show="!isSearchingParsed"
            :title="t('SearchEntity.index.action.pause')"
            color="success"
            icon="mdi-pause"
            @click="() => pauseSearchQueue()"
          />

          <!-- 取消/重试 搜索队列 -->
          <v-btn
            v-show="runtimeStore.search.isSearching"
            :title="t('SearchEntity.index.action.cancel')"
            color="red"
            icon="mdi-cancel"
            @click="cancelSearchQueue"
          />
          <v-btn
            v-show="!runtimeStore.search.isSearching"
            :disabled="isSearchingParsed"
            :title="t('SearchEntity.index.action.retry')"
            color="red"
            icon="mdi-sync"
            @click="() => doSearch(null as unknown as string, null as unknown as string, true)"
          />

          <!-- 重试失败的搜索 -->
          <v-btn
            :disabled="searchPlanStatus.error === 0"
            :title="t('SearchEntity.index.action.retryFailed')"
            color="amber"
            icon="mdi-sync-alert"
            @click="() => retrySearch()"
          />

          <v-divider vertical class="mx-2" />

          <!-- 创建搜索快照 -->
          <v-btn
            :disabled="runtimeStore.search.isSearching || runtimeStore.search.searchResult.length === 0"
            :title="t('SearchEntity.index.action.saveSnapshot')"
            color="cyan"
            icon="mdi-camera-plus"
            @click="showSaveSnapshotDialog = true"
          ></v-btn>
        </v-btn-group>

        <v-divider vertical class="mx-2" />

        <ActionTd :torrent-items="tableSelectedRaw" />

        <v-divider vertical class="mx-2" />

        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn-group variant="text">
              <v-btn
                :title="t('SearchEntity.index.action.displayPreferences')"
                color="blue"
                icon="mdi-cog"
                v-bind="props"
              />
            </v-btn-group>
          </template>
          <v-list>
            <v-list-item v-for="item in filteredTableBooleanControlKeys" :key="item" :value="item">
              <template v-slot:prepend>
                <v-list-item-action start class="ml-2">
                  <v-switch
                    v-model="configStore.searchEntifyControl[item]"
                    :label="`&nbsp;${t('SearchEntity.index.' + item)}`"
                    color="success"
                    density="compact"
                    hide-details
                    @click.stop
                    @update:model-value="() => configStore.$save()"
                  />
                </v-list-item-action>
              </template>
            </v-list-item>
            <v-list-item v-if="configStore.searchEntifyControl.showTorrentTag" class="mt-2">
              <v-textarea
                v-model="hiddenTagNamesText"
                :label="t('SetBase.searchEntity.hiddenTagNames')"
                hide-details
                clearable
                rows="5"
              />
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
            <span v-if="index === 1" class="text-grey text-body-small">
              (+{{ configStore.tableBehavior.SearchEntity.columns!.length - 1 }})
            </span>
          </template>
        </v-combobox>

        <v-spacer />
        <v-text-field
          v-model="tableWaitFilterRef"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          :label="t('SearchEntity.index.filterLabel')"
          max-width="500"
          prepend-inner-icon="mdi-filter"
          single-line
          @click:prepend-inner="showAdvanceFilterGenerateDialog = true"
          @update:model-value="(val) => buildFilterDictFn(val)"
        />
      </v-row>
    </v-card-title>

    <v-card-text class="pt-2 pb-0">
      <!-- 站点筛选器、已选种子等提示信息 -->
      <QuickFilterNotice :selected-torrents="tableSelectedRaw" />

      <v-data-table
        id="ptd-search-entity-table"
        v-model="tableSelectedRaw"
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
        :multi-sort="configStore.enableTableMultiSort"
        :row-props="sizeGroupRowProps"
        show-select
        return-object
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

        <!-- 优惠（下载量系数），默认隐藏，勾选后可按优惠排序 -->
        <template #item.downloadVolumeFactor="{ item }">
          <span class="text-no-wrap" :class="promoCellText(item) === '-' ? 'text-grey' : ''">
            {{ promoCellText(item) }}
          </span>
        </template>

        <!-- 种子大小，下载情况 -->
        <template #item.size="{ item }">
          <!-- Vuetify 4 的 v-container 已无 no-gutters 属性，v-row 间距也改用 flex gap，故用 pa-0 + gap="0" 还原紧凑布局 -->
          <v-container class="pa-0">
            <v-row gap="0">
              <v-col class="pa-0">
                <span class="t_size text-no-wrap">{{ formatSize(item.size ?? 0) }}</span>
              </v-col>
            </v-row>
            <v-row v-if="item.status && (item.status as ETorrentStatus) !== ETorrentStatus.unknown" gap="0">
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
          <ActionTd :torrent-items="[item]" density="compact" :show-keep-upload-btn="false" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <AdvanceFilterGenerateDialog v-model="showAdvanceFilterGenerateDialog" />
  <SearchStatusDialog v-model="showSearchStatusDialog" />
  <SaveSnapshotDialog v-model="showSaveSnapshotDialog" />
</template>

<style scoped lang="scss">
#ptd-search-entity-table {
  :deep(td.v-data-table__td) {
    padding: 0 8px;
  }

  /* 表格布局必须用 fixed，这是本组改动的基石。
     auto 布局下列宽由内容 min-content 与「剩余空间按比例摊分」共同决定：
     标题带 white-space: nowrap，min-content 等于整条标题宽度，宽屏时它又会独吞所有剩余空间，
     结果是无论表头写多少 width / minWidth 都约束不住。
     改成 fixed 后列宽严格按表头 width 计算，列宽之和 ≥ 容器时（窄屏）出现横向滚动，
     否则由标题列的 JS 计算值吸收剩余空间，不产生溢出。 */
  :deep(table) {
    width: 100%;
    table-layout: fixed;
  }

  /* 选择列（复选框）在 fixed 布局下必须给宽度，否则会被标题列挤成 0 */
  :deep(thead th:first-child) {
    width: 48px;
  }

  /* 标题内容容器的固有宽度归零。
     fixed 布局下列宽已由表头决定，但单元格内容仍会撑破格子（nowrap 长标题会溢出到相邻列）。
     width: 0 让容器的 max-content 不再参与计算，min-width: 100% 再把它撑满单元格，
     配合 .text-truncate 实现「按列宽单行省略」。 */
  :deep(td > .t_main) {
    width: 0;
    min-width: 100%;
  }

  /* 固定在行尾的操作列（「常规设置 → 表格过宽时固定操作列」）：
     横向滚动时它浮在内容之上，用一道向内的投影把「浮动层」和「滚动内容」区分开，
     否则相邻列的文字会紧贴按钮，看起来像被压住。 */
  :deep(.v-data-table-column--first-fixed-end) {
    box-shadow:
      inset 14px 0 14px -14px rgba(0, 0, 0, 0.45),
      -1px 0 0 rgba(var(--v-border-color), calc(var(--v-border-opacity) * 2.5));
  }

  /* 发布时间列：完整的「日期 + 时间」比较长，跟着列宽单行省略，
     完整时间仍可通过单元格的 title 提示查看。 */
  :deep(.t_time) {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* 操作列不换行，按钮按自身尺寸排列，避免在窄列里被 flex 压缩 */
  :deep(td .table-action) {
    justify-content: center;
    flex-wrap: nowrap;

    .v-btn {
      flex: 0 0 auto;
    }
  }

  /* 相同大小种子的分组色条（ #1411 ），颜色由 row-props 写入的 --ptd-size-group-color 提供 */
  :deep(td.v-data-table__td--select-row) {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 4px;
      bottom: 4px;
      left: 1px;
      width: 3px;
      border-radius: 2px;
      background-color: var(--ptd-size-group-color, transparent);
    }
  }
}
</style>
