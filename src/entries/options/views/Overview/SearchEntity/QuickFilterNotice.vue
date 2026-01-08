<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify/framework";

import { useConfigStore } from "@/options/stores/config.ts";
import { formatSize } from "@/options/utils.ts";
import type { ISearchResultTorrent } from "@/shared/types/storages/runtime.ts";

import { tableCustomFilter } from "./utils/filter.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";

const { selectedTorrents } = defineProps<{
  selectedTorrents: ISearchResultTorrent[];
}>();

const { t } = useI18n();
const configStore = useConfigStore();
const display = useDisplay();

const { advanceFilterDictRef, advanceItemPropsRef, updateTableFilterValueFn } = tableCustomFilter;

const selectedSite = ref<string>("");

// 优化后的选中种子信息计算：直接基于选中对象计算
const selectedTorrentsInfo = computed(() => {
  const selectedObjects = selectedTorrents;
  const count = selectedObjects.length;

  // 如果没有选中任何项，直接返回
  if (count === 0) {
    return { count: 0, totalSize: 0 };
  }

  // 直接计算选中对象的总大小，避免遍历查找
  const totalSize = selectedObjects.reduce((sum, torrent) => sum + (torrent.size || 0), 0);

  return {
    count,
    totalSize,
  };
});

function clearSiteFilter() {
  selectedSite.value = ""; // 清除站点过滤器
  advanceFilterDictRef.value.site.required = [];
  advanceFilterDictRef.value.site.exclude = [];
  updateTableFilterValueFn();
}

function updateQuickSiteFilter() {
  advanceFilterDictRef.value.site.required = [selectedSite.value];
  advanceFilterDictRef.value.site.exclude = [];
  updateTableFilterValueFn();
}
</script>

<template>
  <v-alert class="px-2 py-1 mb-0" color="info" density="compact" variant="tonal">
    <div class="d-flex align-center">
      <!-- 站点筛选器 -->
      <template v-if="configStore.searchEntity.quickSiteFilter">
        <!-- "全部"选项 -->
        <v-chip
          class="limit_width"
          size="small"
          @click.stop="clearSiteFilter"
          variant="outlined"
          prepend-icon="mdi-web"
        >
          {{ display.smAndDown.value ? "" : t("SearchEntity.siteFilter.all") }}
        </v-chip>

        <!-- 分站点选项 -->
        <v-chip-group
          id="site-filter-chips"
          v-model="selectedSite"
          :mobile="false"
          color="primary"
          filter
          mandatory
          show-arrows="always"
          variant="outlined"
          @update:model-value="updateQuickSiteFilter"
        >
          <!-- 各站点选项 -->
          <v-chip
            v-for="siteId in advanceItemPropsRef.site"
            :key="siteId"
            :value="siteId"
            size="small"
            class="mr-1 mb-1"
          >
            <SiteFavicon :site-id="siteId" :size="14" class="mr-1" />
            <SiteName :site-id="siteId" tag="span" />
          </v-chip>
        </v-chip-group>
      </template>

      <v-spacer />

      <!-- 选中种子信息条 -->
      <v-divider vertical inset class="mx-2" />
      <v-chip class="my-2 limit_width" color="primary" size="small" variant="outlined">
        <v-icon icon="mdi-checkbox-marked-circle" start />
        {{
          display.smAndDown.value
            ? selectedTorrentsInfo.count
            : t("SearchEntity.index.selectedTorrents", [selectedTorrentsInfo.count])
        }}
        <v-divider class="mx-2" vertical />
        <v-icon icon="mdi-harddisk" start />
        {{ formatSize(selectedTorrentsInfo.totalSize) }}
      </v-chip>
    </div>
  </v-alert>
</template>

<style>
.limit_width {
  min-width: fit-content;
}
</style>
