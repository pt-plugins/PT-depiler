<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify/framework";

import { useConfigStore } from "@/options/stores/config.ts";
import { formatSize } from "@/options/utils.ts";
import { tableCustomFilter } from "./utils/filter.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";

const { selectedTorrentsInfo } = defineProps<{
  selectedTorrentsInfo: { count: number; totalSize: number };
}>();

const { t } = useI18n();
const configStore = useConfigStore();
const display = useDisplay();

const { advanceFilterDictRef, updateTableFilterValueFn } = tableCustomFilter;

const selectedSite = ref<string>("");

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
          v-model="selectedSite"
          id="site-filter-chips"
          mandatory
          filter
          color="primary"
          variant="outlined"
          :mobile="false"
          @update:model-value="updateQuickSiteFilter"
        >
          <!-- 各站点选项 -->
          <v-chip
            v-for="siteId in advanceFilterDictRef.site.all"
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
