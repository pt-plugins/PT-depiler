<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { type ITorrent } from "@ptd/site";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { siteInstance } from "../utils.ts";
import { sendMessage } from "@/messages.ts";
import SentToDownloaderDialog from "@/options/views/Overview/SearchEntity/SentToDownloaderDialog.vue";
import AdvanceListModuleDialog from "@/content-script/app/components/AdvanceListModuleDialog.vue";
import SpeedDialBtn from "@/content-script/app/components/SpeedDialBtn.vue";

const runtimeStore = useRuntimeStore();

async function parseListPage() {
  const parsedResult = await siteInstance.value?.transformListPage(document);

  let errorMessage = "";
  if ((parsedResult?.torrents ?? []).length === 0) {
    errorMessage = "未解析到当前页面种子";
  }

  if (errorMessage) {
    runtimeStore.showSnakebar(errorMessage, { color: "error" });
  } else {
    // 更新搜索状态，方便 SentToDownloaderDialog 中替换
    runtimeStore.search.searchPlanKey = "all";
    runtimeStore.search.searchKey = parsedResult?.keywords ?? "";
  }

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

const parsedTorrents = shallowRef<ITorrent[]>([]);

const showRemoteDownloadMultiDialog = ref<boolean>(false);

function handleRemoteDownloadMulti() {
  parseListPage().then(({ torrents }) => {
    if (torrents.length > 0) {
      parsedTorrents.value = torrents;
      showRemoteDownloadMultiDialog.value = true;
    }
  });
}

const showAdvanceListModuleDialog = ref<boolean>(false);

function handleAdvanceListModule() {
  parseListPage().then(({ torrents }) => {
    if (torrents.length > 0) {
      parsedTorrents.value = torrents;
      showAdvanceListModuleDialog.value = true;
    }
  });
}
</script>

<template>
  <SpeedDialBtn
    color="light-blue"
    icon="mdi-content-save-all"
    title="本地下载本页全部种子"
    @click="handleLocalDownloadMulti"
  />

  <SpeedDialBtn color="light-blue" icon="mdi-content-copy" title="复制本页全部种子链接" @click="handleLinkCopyMulti" />

  <SpeedDialBtn
    color="light-blue"
    icon="mdi-tray-arrow-down"
    title="推送本页全部种子到"
    @click="handleRemoteDownloadMulti"
  />

  <SpeedDialBtn color="indigo" icon="mdi-checkbox-multiple-marked" title="高级列表" @click="handleAdvanceListModule" />

  <SentToDownloaderDialog
    v-model="showRemoteDownloadMultiDialog"
    :content-class="['bg-white']"
    :torrent-items="parsedTorrents"
  />

  <AdvanceListModuleDialog v-model="showAdvanceListModuleDialog" :torrent-items="parsedTorrents" />
</template>

<style scoped lang="scss"></style>
