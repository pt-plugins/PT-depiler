<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { TSiteID } from "@ptd/site";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";

interface Props {
  allSites: TSiteID[];
}

const { allSites } = defineProps<Props>();

const selectedSiteId = defineModel<TSiteID | null>("modelValue", { default: null });

const { t } = useI18n();

// 直接使用站点 ID 值，避免索引映射的竞态条件
const chipGroupValue = computed({
  get: () => {
    return selectedSiteId.value || "__ALL__"; // 使用特殊值表示"全部"
  },
  set: (value: string) => {
    selectedSiteId.value = value === "__ALL__" ? null : (value as TSiteID);
  },
});
</script>

<template>
  <v-chip-group v-model="chipGroupValue" id="site-filter-chips" mandatory selected-class="text-primary">
    <!-- "全部"选项 -->
    <v-chip value="__ALL__" size="small" class="mr-1 mb-1">
      <v-icon start icon="mdi-web" />
      {{ t("SearchEntity.siteFilter.all") }}
    </v-chip>

    <!-- 各站点选项 -->
    <v-chip v-for="siteId in allSites" :key="siteId" :value="siteId" size="small" class="mr-1 mb-1">
      <SiteFavicon :site-id="siteId" :size="14" class="mr-1" />
      <SiteName :site-id="siteId" tag="span" />
    </v-chip>
  </v-chip-group>
</template>
