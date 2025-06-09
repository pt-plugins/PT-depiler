<script setup lang="ts">
import { ref, shallowRef } from "vue";
import type { ITorrent } from "@ptd/site";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { doKeywordSearch, siteInstance } from "@/content-script/app/utils.ts";

import SpeedDialBtn from "@/content-script/app/components/SpeedDialBtn.vue";
import SentToDownloaderDialog from "@/options/views/Overview/SearchEntity/SentToDownloaderDialog.vue";

const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

async function parseDetailPage() {
  const parsedResult = await siteInstance.value?.transformDetailPage(document);

  if (typeof parsedResult?.link === "undefined") {
    runtimeStore.showSnakebar("无法解析当前页面种子链接", { color: "error" });
    throw new Error("无法解析当前页面种子链接");
  }

  // 更新搜索状态，方便 SentToDownloaderDialog 中替换
  runtimeStore.search.searchPlanKey = "all";
  runtimeStore.search.searchKey = parsedResult?.title ?? "";

  return parsedResult!;
}

const parsedTorrent = shallowRef<ITorrent[]>([]);
const showRemoteDownloadDialog = ref<boolean>(false);

function handleRemoteDownload() {
  parseDetailPage().then((torrent) => {
    parsedTorrent.value = [torrent];
    showRemoteDownloadDialog.value = true;
  });
}

function handleSearch() {
  parseDetailPage().then((torrent) => {
    doKeywordSearch(torrent.title || "");
  });
}
</script>

<template>
  <SpeedDialBtn
    color="light-blue"
    icon="mdi-tray-arrow-down"
    title="推送到..."
    :disabled="metadataStore.getEnabledDownloaders.length === 0"
    @click="handleRemoteDownload"
  />
  <SpeedDialBtn color="indigo" icon="mdi-home-search" title="快捷搜索" @click="handleSearch" />

  <SentToDownloaderDialog
    v-model="showRemoteDownloadDialog"
    :content-class="['bg-white']"
    :torrent-items="parsedTorrent"
  />
</template>

<style scoped lang="scss"></style>
