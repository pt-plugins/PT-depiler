<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import { tableCustomFilter } from "@/options/views/Overview/SearchEntity/utils/filter.ts";

const { t } = useI18n();

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
  <div class="d-flex align-center">
    <!-- "全部"选项 -->
    <div class="pa-1 ma-1 mr-1">
      <v-chip size="small" @click.stop="clearSiteFilter" value="">
        <v-icon start icon="mdi-web" />
        {{ t("SearchEntity.siteFilter.all") }}
      </v-chip>
    </div>
    <v-chip-group
      v-model="selectedSite"
      id="site-filter-chips"
      mandatory
      filter
      color="primary"
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
  </div>
</template>
