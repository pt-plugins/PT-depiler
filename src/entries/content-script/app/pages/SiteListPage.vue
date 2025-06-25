<script setup lang="ts">
import { inject, ref, shallowRef } from "vue";
import { type ITorrent } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { doKeywordSearch, siteInstance } from "../utils.ts";

import AdvanceListModuleDialog from "@/content-script/app/components/AdvanceListModuleDialog.vue";
import SpeedDialBtn from "@/content-script/app/components/SpeedDialBtn.vue";

const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

async function parseListPage(showNoTorrentError = true) {
  const parsedResult = await siteInstance.value?.transformListPage(document);

  let errorMessage = "";
  if ((parsedResult?.torrents ?? []).length === 0) {
    errorMessage = "未解析到当前页面种子";
  }

  if (showNoTorrentError && errorMessage) {
    runtimeStore.showSnakebar(errorMessage, { color: "error" });
  }

  // 更新搜索状态，方便 SentToDownloaderDialog 中替换
  runtimeStore.search.searchPlanKey = "all";
  runtimeStore.search.searchKey = parsedResult?.keywords ?? "";

  return parsedResult!;
}

function handleLocalDownloadMulti() {
  parseListPage().then(({ torrents }) => {
    for (const torrent of torrents) {
      sendMessage("downloadTorrentToLocalFile", { torrent });
    }
  });
}

function handleLinkCopyMulti() {
  parseListPage().then(async ({ torrents }) => {
    const downloadUrls = [];
    for (const torrent of torrents) {
      const downloadUrl = await sendMessage("getTorrentDownloadLink", torrent);
      downloadUrls.push(downloadUrl);
    }

    try {
      await navigator.clipboard.writeText(downloadUrls.join("\n").trim());
      runtimeStore.showSnakebar("下载链接已复制到剪贴板", { color: "success" });
    } catch (e) {
      runtimeStore.showSnakebar("复制下载链接失败", { color: "error" });
    }
  });
}

const remoteDownloadDialogData = inject<{ show: boolean; torrents: ITorrent[] }>("remoteDownloadDialogData")!;

function handleRemoteDownloadMulti() {
  parseListPage().then(({ torrents }) => {
    if (torrents.length > 0) {
      remoteDownloadDialogData.torrents = torrents;
      remoteDownloadDialogData.show = true;
    }
  });
}

const parsedTorrents = shallowRef<ITorrent[]>([]);
const showAdvanceListModuleDialog = ref<boolean>(false);

function handleAdvanceListModule() {
  parseListPage().then(({ torrents }) => {
    if (torrents.length > 0) {
      parsedTorrents.value = torrents;
      showAdvanceListModuleDialog.value = true;
    }
  });
}

async function handleSearch() {
  let keywords = (await parseListPage()).keywords;

  doKeywordSearch(keywords);
}
</script>

<template>
  <SpeedDialBtn
    key="save"
    color="light-blue"
    icon="mdi-content-save-all"
    title="本地下载"
    @click="handleLocalDownloadMulti"
  />
  <SpeedDialBtn key="copy" color="light-blue" icon="mdi-content-copy" title="复制链接" @click="handleLinkCopyMulti" />
  <SpeedDialBtn
    key="download"
    :disabled="metadataStore.getEnabledDownloaders.length === 0"
    color="light-blue"
    icon="mdi-tray-arrow-down"
    title="推送到..."
    @click="handleRemoteDownloadMulti"
  />

  <SpeedDialBtn
    key="advance"
    color="indigo"
    icon="mdi-checkbox-multiple-marked"
    title="高级列表"
    @click="handleAdvanceListModule"
  />
  <SpeedDialBtn key="search" color="indigo" icon="mdi-home-search" title="快捷搜索" @click="handleSearch" />

  <AdvanceListModuleDialog v-model="showAdvanceListModuleDialog" :torrent-items="parsedTorrents" />
</template>

<style scoped lang="scss"></style>
