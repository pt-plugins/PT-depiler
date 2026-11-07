<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify/framework";

import { getTorrentVolumeFactors } from "@ptd/site";

import { useConfigStore } from "@/options/stores/config.ts";
import { formatSize } from "@/options/utils.ts";
import type { ISearchResultTorrent } from "@/shared/types/storages/runtime.ts";

import { tableCustomFilter } from "./utils/filter.ts";

import FilterChips from "@/options/components/FilterChips.vue";
import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";

const { selectedTorrents } = defineProps<{
  selectedTorrents: ISearchResultTorrent[];
}>();

const { t } = useI18n();
const configStore = useConfigStore();
const display = useDisplay();

const { advanceFilterDictRef, advanceItemPropsRef, updateTableFilterValueFn } = tableCustomFilter;

const selectedSites = ref<string[]>([]);

/** 「不显示」模式下连计费体积也一起隐藏（它同样是优惠系数的折算结果） */
const showBillableSize = computed(() => configStore.searchEntifyControl.promotionDisplay !== "none");

// 优化后的选中种子信息计算：直接基于选中对象计算
const selectedTorrentsInfo = computed(() => {
  const selectedObjects = selectedTorrents;

  // 直接计算选中对象的总大小，避免遍历查找
  const totalSize = selectedObjects.reduce((sum, torrent) => sum + (torrent.size || 0), 0);

  // 计费体积：按下载量系数折算（系数未知时按 1 计，即与总大小一致）
  const billableSize = selectedObjects.reduce((sum, torrent) => {
    const { downloadVolumeFactor } = getTorrentVolumeFactors(torrent);
    return sum + (torrent.size || 0) * (downloadVolumeFactor ?? 1);
  }, 0);

  return {
    count: selectedObjects.length,
    totalSize,
    billableSize,
  };
});

/**
 * 站点筛选：多选时 required 里放多个站点，过滤逻辑对标量字段是「命中任一」的 OR 语义；
 * 全部取消时 required 为空数组，即不筛选。
 *
 * 优先使用事件回传的取值：v-model 与 @update:model-value 同时存在时，
 * 不能依赖两者内部的更新顺序（selectedSites 可能还是旧值）。
 */
function updateQuickSiteFilter(value?: string[]) {
  const sites = Array.isArray(value) ? value : selectedSites.value;
  advanceFilterDictRef.value.site.required = [...sites];
  advanceFilterDictRef.value.site.exclude = [];
  updateTableFilterValueFn();
}

/**
 * 以 advanceFilterDictRef 为准同步 chips 的选中态：
 * 高级筛选弹窗里改了站点、或重新搜索时过滤器被重置，chips 都要跟着刷新，
 * 否则会出现「chip 还亮着，但实际已经不筛了」的错位。
 */
watch(
  () => advanceFilterDictRef.value.site?.required as string[] | undefined,
  (required) => {
    selectedSites.value = [...(required ?? [])];
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <v-alert class="px-2 py-1 mb-0" color="info" density="compact" variant="tonal">
    <div class="d-flex align-center">
      <!-- 站点筛选器：可多选，再点一次已选中的站点即取消该站点；全部取消 = 不筛选 -->
      <FilterChips
        v-if="configStore.searchEntity.quickSiteFilter"
        v-model="selectedSites"
        :all-label="t('SearchEntity.siteFilter.all')"
        :items="advanceItemPropsRef.site"
        :solo-hint="t('SearchEntity.siteFilter.soloHint')"
        all-clears
        multiple
        solo-on-dblclick
        @update:model-value="updateQuickSiteFilter"
      >
        <!-- 各站点选项 -->
        <template #chip="{ item }">
          <SiteFavicon :site-id="item" :size="14" class="mr-1" />
          <SiteName :site-id="item" tag="span" />
        </template>
      </FilterChips>

      <v-spacer />

      <!-- 选中种子信息条 -->
      <v-divider vertical inset class="mx-2" />
      <v-chip class="my-2 chip_limit_width" color="primary" size="small" variant="outlined">
        <v-icon icon="mdi-checkbox-marked-circle" start />
        {{
          display.smAndDown.value
            ? selectedTorrentsInfo.count
            : t("SearchEntity.index.selectedTorrents", [selectedTorrentsInfo.count])
        }}
        <v-divider class="mx-2" vertical />
        <v-icon icon="mdi-harddisk" start />
        {{ formatSize(selectedTorrentsInfo.totalSize) }}
        <template v-if="showBillableSize && selectedTorrentsInfo.billableSize !== selectedTorrentsInfo.totalSize">
          <v-divider class="mx-2" vertical />
          <v-icon icon="mdi-download" start />
          <span :title="t('SearchEntity.index.billableSizeHint')">
            {{ t("SearchEntity.index.billableSize") }}: {{ formatSize(selectedTorrentsInfo.billableSize) }}
          </span>
        </template>
      </v-chip>
    </div>
  </v-alert>
</template>

<style lang="scss" scoped>
.chip_limit_width {
  min-width: fit-content;
}
</style>
