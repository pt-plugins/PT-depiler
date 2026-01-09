<script setup lang="ts">
import { inject } from "vue";

import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import type { IRemoteDownloadDialogData } from "../types.ts";
import { copyTextToClipboard, doKeywordSearch, siteInstance } from "../utils.ts";

import SpeedDialBtn from "../components/SpeedDialBtn.vue";

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

const remoteDownloadDialogData = inject<IRemoteDownloadDialogData>("remoteDownloadDialogData")!;

function handleLinkCopy() {
  parseDetailPage().then(async (torrent) => {
    const downloadUrl = await sendMessage("getTorrentDownloadLink", torrent);

    const copied = await copyTextToClipboard(downloadUrl);
    runtimeStore.showSnakebar(copied ? "下载链接已复制到剪贴板" : "复制下载链接失败", {
      color: copied ? "success" : "error",
    });
  });
}

function handleRemoteDownload(isDefaultSend = false) {
  parseDetailPage().then((torrent) => {
    remoteDownloadDialogData.torrents = [torrent];
    remoteDownloadDialogData.isDefaultSend = isDefaultSend;
    remoteDownloadDialogData.show = true;
  });
}

function handleSearch() {
  parseDetailPage().then((torrent) => {
    doKeywordSearch(torrent.title || "");
  });
}
</script>

<template>
  <SpeedDialBtn key="copy" color="light-blue" icon="mdi-content-copy" title="复制链接" @click="handleLinkCopy" />
  <SpeedDialBtn
    key="download"
    :disabled="metadataStore.getEnabledDownloaders.length === 0"
    color="light-blue"
    icon="mdi-cloud-download"
    title="推送到..."
    @click="() => handleRemoteDownload()"
  />
  <SpeedDialBtn
    key="download_default"
    v-if="metadataStore.defaultDownloader?.id"
    :disabled="metadataStore.getEnabledDownloaders.length === 0"
    color="light-blue"
    icon="mdi-download"
    title="推送到默认下载器"
    @click="handleRemoteDownload(true)"
  />
  <SpeedDialBtn key="search" color="indigo" icon="mdi-home-search" title="快捷搜索" @click="handleSearch" />
</template>

<style scoped lang="scss"></style>
