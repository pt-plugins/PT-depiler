<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import type { CTorrent } from "@ptd/downloader";
import { type TSiteID } from "@ptd/site";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import SiteName from "@/options/components/SiteName.vue";

import { getTorrentSiteMatch, type TTorrentSiteMatch } from "./torrentSite.ts";

const { item } = defineProps<{
  item: CTorrent;
}>();

const { t } = useI18n();

const match = ref<TTorrentSiteMatch | null>(null);
const resolved = ref(false);

const siteId = ref<TSiteID | undefined>(undefined);

async function resolveSite() {
  try {
    const result = await getTorrentSiteMatch(item);
    match.value = result;
    siteId.value = result.type === "site" ? result.siteId : undefined;
  } finally {
    resolved.value = true;
  }
}

onMounted(resolveSite);

// 自动刷新会整体替换种子列表，item 变化时重新识别（命中缓存时开销极小）
watch(
  () => [item.clientId, String(item.id), item.infoHash],
  () => resolveSite(),
);
</script>

<template>
  <div class="d-flex flex-column align-center">
    <template v-if="siteId">
      <SiteFavicon :site-id="siteId" :size="24" />
      <SiteName :site-id="siteId" />
    </template>
    <v-progress-circular v-else-if="!resolved" color="grey" indeterminate size="18" width="2" />
    <template v-else-if="match?.type === 'public'">
      <v-icon :title="t('MyClient.sitePublicTip')" color="blue-grey" icon="mdi-web" size="22" />
      <span class="text-body-small text-blue-grey">{{ t("MyClient.sitePublic") }}</span>
    </template>
    <template v-else>
      <v-icon :title="t('MyClient.siteUnmatchedTip')" color="amber-darken-3" icon="mdi-web" size="22" />
      <span class="text-body-small text-amber-darken-3">{{ t("MyClient.siteUnmatched") }}</span>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
