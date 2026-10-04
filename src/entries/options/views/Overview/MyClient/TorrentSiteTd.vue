<script setup lang="ts">
import { useI18n } from "vue-i18n";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import SiteName from "@/options/components/SiteName.vue";

import type { TMyClientTorrent } from "./torrentSite.ts";

// 站点判定在 loadSingleDownloader 中统一完成，并写回种子的 site / siteType，
// 该组件只负责展示（siteType 为 undefined 表示判定尚未完成）
const { item } = defineProps<{
  item: TMyClientTorrent;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="d-flex flex-column align-center">
    <template v-if="item.site">
      <SiteFavicon :site-id="item.site" :size="24" />
      <SiteName :site-id="item.site" />
    </template>
    <template v-else-if="item.siteType === 'public'">
      <v-icon :title="t('MyClient.sitePublicTip')" color="blue-grey" icon="mdi-web" size="22" />
      <span class="text-body-small text-blue-grey">{{ t("MyClient.sitePublic") }}</span>
    </template>
    <template v-else-if="item.siteType === 'unmatched'">
      <v-icon :title="t('MyClient.siteUnmatchedTip')" color="amber-darken-3" icon="mdi-web" size="22" />
      <span class="text-body-small text-amber-darken-3">{{ t("MyClient.siteUnmatched") }}</span>
    </template>
    <v-progress-circular v-else color="grey" indeterminate size="18" width="2" />
  </div>
</template>

<style scoped lang="scss"></style>
