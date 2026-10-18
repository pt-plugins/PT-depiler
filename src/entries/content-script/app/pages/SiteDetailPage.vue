<script setup lang="ts">
import { computed, inject, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { type ITorrent } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import type { IRemoteDownloadDialogData } from "../types.ts";
import { copyTextToClipboard, doKeywordSearch, siteInstance, type IPtdData } from "../utils.ts";

import SpeedDialBtn from "../components/SpeedDialBtn.vue";
import TorrentFavoriteDialog from "@/options/components/TorrentFavoriteDialog.vue";

const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();
const { t } = useI18n();

const ptdData = inject<IPtdData>("ptd_data", {});
const enabledDownloadersBySite = computed(() => {
  return metadataStore.getEnabledDownloadersBySite(ptdData.siteId ?? "");
});

async function parseDetailPage() {
  const parsedResult = await siteInstance.value?.transformDetailPage(document);

  if (typeof parsedResult?.link === "undefined") {
    runtimeStore.showSnackbar(t("contentScript.cannotParseDetailLink"), { color: "error" });
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
    runtimeStore.showSnackbar(copied ? t("contentScript.copyLinkSuccess") : t("contentScript.copyLinkFailed"), {
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

// 收藏当前详情页种子
const favoriteTorrents = shallowRef<ITorrent[]>([]);
const showFavoriteDialog = ref<boolean>(false);

function handleFavorite() {
  parseDetailPage().then((torrent) => {
    favoriteTorrents.value = [torrent];
    showFavoriteDialog.value = true;
  });
}
</script>

<template>
  <SpeedDialBtn
    key="copy"
    color="light-blue"
    icon="mdi-content-copy"
    :title="t('contentScript.copyLink')"
    @click="handleLinkCopy"
  />
  <SpeedDialBtn
    key="download"
    :disabled="enabledDownloadersBySite.length === 0"
    color="light-blue"
    icon="mdi-cloud-download"
    :title="t('contentScript.pushTo')"
    @click="() => handleRemoteDownload()"
  />
  <SpeedDialBtn
    key="download_default"
    v-if="metadataStore.defaultDownloader?.id"
    :disabled="enabledDownloadersBySite.length === 0"
    color="light-blue"
    icon="mdi-download"
    :title="t('contentScript.pushToDefault')"
    @click="handleRemoteDownload(true)"
  />
  <SpeedDialBtn
    key="favorite"
    color="amber"
    icon="mdi-star-plus"
    :title="t('contentScript.favoriteTorrent')"
    @click="handleFavorite"
  />
  <SpeedDialBtn
    key="search"
    color="indigo"
    icon="mdi-home-search"
    :title="t('contentScript.quickSearch')"
    @click="handleSearch"
  />

  <TorrentFavoriteDialog v-model="showFavoriteDialog" :torrent-items="favoriteTorrents" />
</template>

<style scoped lang="scss"></style>
