<script setup lang="ts">
import { computed, ref } from "vue";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { sendMessage } from "@/messages.ts";

import SentToDownloaderDialog from "@/options/components/SentToDownloaderDialog.vue";

const props = withDefaults(
  defineProps<{
    torrentIds: string[];
    density?: "compact" | "default";
  }>(),
  { density: "default" },
);

const btnSize = computed(() => {
  return props.density === "compact" ? "small" : "default";
});

const runtimeStore = useRuntimeStore();

const torrentItems = computed(() => {
  return runtimeStore.search.searchResult.filter((x) => props.torrentIds.includes(x.uniqueId));
});

async function getTorrentDownloadLinks() {
  const downloadUrls = [];

  for (const torrent of torrentItems.value) {
    const downloadUrl = await sendMessage("getTorrentDownloadLink", torrent);
    sendMessage("logger", { msg: `torrent ${torrent} download link: ${downloadUrl}` }).catch();
    downloadUrls.push({ torrent, downloadUrl });
  }

  return downloadUrls;
}

const copyTorrentDownloadLinkBtnStatus = ref(false);
async function copyTorrentDownloadLink() {
  copyTorrentDownloadLinkBtnStatus.value = true;
  const downloadUrls = await getTorrentDownloadLinks();
  try {
    await navigator.clipboard.writeText(
      downloadUrls
        .map((x) => x.downloadUrl)
        .join("\n")
        .trim(),
    );
    runtimeStore.showSnakebar("下载链接已复制到剪贴板", { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar("复制下载链接失败", { color: "error" });
  }

  copyTorrentDownloadLinkBtnStatus.value = false;
}

const localDlTorrentDownloadLinkBtnStatus = ref(false);
async function localDlTorrentDownloadLink() {
  localDlTorrentDownloadLinkBtnStatus.value = true;
  await Promise.allSettled(torrentItems.value.map((torrent) => sendMessage("downloadTorrentToLocalFile", { torrent })));
  localDlTorrentDownloadLinkBtnStatus.value = false;
}

const showDownloadClientDialog = ref(false);
function sendToDownloader() {
  showDownloadClientDialog.value = true;
}

function noop() {
  // do nothing
}
</script>

<template>
  <v-btn-group :density="props.density" class="table-action" color="grey" variant="text">
    <!-- 下载到服务器 -->
    <v-btn
      :disabled="props.torrentIds.length == 0"
      :size="btnSize"
      icon="mdi-cloud-download"
      @click="() => sendToDownloader()"
    />
    <!-- 复制下载链接 -->
    <v-btn
      :disabled="props.torrentIds.length == 0"
      :loading="copyTorrentDownloadLinkBtnStatus"
      :size="btnSize"
      icon="mdi-content-copy"
      title="复制下载链接"
      @click="() => copyTorrentDownloadLink()"
    />
    <!-- 下载种子文件到本地 -->
    <v-btn
      :disabled="props.torrentIds.length == 0"
      :loading="localDlTorrentDownloadLinkBtnStatus"
      :size="btnSize"
      icon="mdi-content-save"
      title="下载种子文件到本地"
      @click="() => localDlTorrentDownloadLink()"
    />
  </v-btn-group>

  <!-- 在点击发送到远程服务器时，弹出选择下载器及其他自定义选项 -->
  <SentToDownloaderDialog v-model="showDownloadClientDialog" :torrent-items="torrentItems"></SentToDownloaderDialog>
</template>

<style scoped lang="scss"></style>
