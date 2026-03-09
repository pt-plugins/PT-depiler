<script setup lang="ts">
/**
 * 本文件仅作为右键菜单的链接跳转使用
 */

import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { getHostFromUrl, ITorrent } from "@ptd/site";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import SentToDownloaderDialog from "@/options/components/SentToDownloaderDialog/Index.vue";

const route = useRoute();
const router = useRouter();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();
const { t } = useI18n();

const showDialog = ref(false);
const torrentItems = ref<ITorrent[]>([]);

onMounted(() => {
  const link = route?.query?.link;

  if (!link || typeof link !== "string") {
    runtimeStore.showSnakebar(t("ContextMenuLinkPush.invalidLink"), { color: "error" });
    onCancel();
    return;
  }

  const torrent = { link } as ITorrent;

  // 尝试从 link 中解出site
  if (link.match(/https?:\/\/([^/]+)/)) {
    const host = getHostFromUrl(link);
    if (metadataStore.siteHostMap[host]) {
      torrent.site = metadataStore.siteHostMap[host];
    }
  }

  torrentItems.value = [torrent];
  runtimeStore.showSnakebar(t("ContextMenuLinkPush.keywordWarning"), { color: "warning" });
  showDialog.value = true;
});

function onDone() {
  router.push({
    name: "DownloadHistory",
  });
}

function onCancel() {
  window.close();
}
</script>

<template>
  <SentToDownloaderDialog v-model="showDialog" :torrent-items="torrentItems" @done="onDone" @cancel="onCancel" />
</template>

<style scoped lang="scss"></style>
