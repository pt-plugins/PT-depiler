<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { ITorrent } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import SentToDownloaderDialog from "@/options/components/SentToDownloaderDialog/Index.vue";
import TorrentFavoriteDialog from "@/options/components/TorrentFavoriteDialog.vue";
import KeepUploadDialog from "./KeepUploadDialog.vue";

const {
  torrentItems,
  density = "default",
  showKeepUploadBtn = true,
  favoriteBtnTitle,
} = defineProps<{
  torrentItems: ITorrent[];
  density?: "compact" | "default";
  showKeepUploadBtn?: boolean;
  /** 收藏按钮的提示文案（例如收藏列表页中它承担的是「编辑收藏」），缺省使用通用文案 */
  favoriteBtnTitle?: string;
}>();

const btnSize = computed(() => {
  return density === "compact" ? "small" : "default";
});

const { t } = useI18n();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

const emits = defineEmits<{
  (e: "favoriteSaved"): void;
}>();

async function getTorrentDownloadLinks() {
  const downloadUrls = [];

  for (const torrent of torrentItems) {
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
    runtimeStore.showSnackbar(t("SearchEntity.ActionTd.copyLinkSuccess"), { color: "success" });
  } catch (e) {
    runtimeStore.showSnackbar(t("SearchEntity.ActionTd.copyLinkFailed"), { color: "error" });
  }

  copyTorrentDownloadLinkBtnStatus.value = false;
}

const localDlTorrentDownloadLinkBtnStatus = ref(false);
async function localDlTorrentDownloadLink() {
  localDlTorrentDownloadLinkBtnStatus.value = true;
  await Promise.allSettled(
    torrentItems.map((torrent) => sendMessage("downloadTorrent", { torrent, downloaderId: "local" })),
  );
  localDlTorrentDownloadLinkBtnStatus.value = false;
}

const showDownloadClientDialog = ref(false);
const isDefaultSend = ref(false);

function sendToDownloader(defaultDownload = false) {
  isDefaultSend.value = defaultDownload;
  showDownloadClientDialog.value = true;
}

const showKeepUploadDialog = ref(false);

function openKeepUploadDialog() {
  showKeepUploadDialog.value = true;
}

const showFavoriteDialog = ref(false);
</script>

<template>
  <v-btn-group :density="density" class="table-action" color="grey" variant="text">
    <v-btn
      v-if="metadataStore.defaultDownloader?.id"
      :disabled="torrentItems.length == 0"
      :size="btnSize"
      icon="mdi-download"
      :title="t('SearchEntity.ActionTd.sendToDefault')"
      @click="() => sendToDownloader(true)"
    />

    <!-- 下载到服务器 -->
    <v-btn
      :disabled="torrentItems.length == 0"
      :size="btnSize"
      icon="mdi-cloud-download"
      :title="t('SearchEntity.ActionTd.sendToDownloader')"
      @click="() => sendToDownloader()"
    />
    <!-- 复制下载链接 -->
    <v-btn
      :disabled="torrentItems.length == 0"
      :loading="copyTorrentDownloadLinkBtnStatus"
      :size="btnSize"
      icon="mdi-content-copy"
      :title="t('SearchEntity.ActionTd.copyLink')"
      @click="() => copyTorrentDownloadLink()"
    />
    <!-- 下载种子文件到本地 -->
    <v-btn
      :disabled="torrentItems.length == 0"
      :loading="localDlTorrentDownloadLinkBtnStatus"
      :size="btnSize"
      icon="mdi-content-save"
      :title="t('SearchEntity.ActionTd.localDownload')"
      @click="() => localDlTorrentDownloadLink()"
    />
    <!-- 辅种检测 -->
    <v-btn
      v-if="showKeepUploadBtn"
      :disabled="torrentItems.length < 2"
      :size="btnSize"
      icon="mdi-merge"
      :title="t('SearchEntity.KeepUploadDialog.keepUpload')"
      @click="openKeepUploadDialog"
    />
    <!-- 收藏 -->
    <v-btn
      :disabled="torrentItems.length == 0"
      :size="btnSize"
      icon="mdi-star-plus"
      :title="favoriteBtnTitle ?? t('SearchEntity.ActionTd.favorite')"
      @click="showFavoriteDialog = true"
    />
    <!-- 调用方可追加与上方同组的按钮（如收藏列表页的删除） -->
    <slot name="append" />
  </v-btn-group>

  <!-- 在点击发送到远程服务器时，弹出选择下载器及其他自定义选项 -->
  <SentToDownloaderDialog
    v-model="showDownloadClientDialog"
    :torrent-items="torrentItems"
    :is-default-send="isDefaultSend"
  />

  <!-- 辅种检测对话框 -->
  <KeepUploadDialog v-if="showKeepUploadBtn" v-model="showKeepUploadDialog" :torrent-items="torrentItems" />

  <!-- 收藏对话框 -->
  <TorrentFavoriteDialog v-model="showFavoriteDialog" :torrent-items="torrentItems" @saved="emits('favoriteSaved')" />
</template>

<style scoped lang="scss"></style>
