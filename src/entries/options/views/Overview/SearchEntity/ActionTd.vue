<script setup lang="ts">
import { computed, ref } from "vue";

import { sendMessage } from "@/messages.ts";
import type { ISearchResultTorrent } from "@/shared/types.ts";
import { buildTorrentCollectionKey, DEFAULT_COLLECTION_ID } from "@/shared/types.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import SentToDownloaderDialog from "@/options/components/SentToDownloaderDialog/Index.vue";
import CollectionAddDialog from "@/options/components/CollectionAddDialog.vue";

const { torrentItems, density = "default" } = defineProps<{
  torrentItems: ISearchResultTorrent[];
  density?: "compact" | "default";
}>();

const btnSize = computed(() => {
  return density === "compact" ? "small" : "default";
});

const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

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
    runtimeStore.showSnakebar("下载链接已复制到剪贴板", { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar("复制下载链接失败", { color: "error" });
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

// ===================== 收藏功能 =====================
// 仅当 torrentItems 只有一个种子时才显示收藏按钮（单行操作）
const singleTorrent = computed(() => (torrentItems.length === 1 ? torrentItems[0] : null));

const isCollected = computed(() => {
  if (!singleTorrent.value) return false;
  return metadataStore.isTorrentCollected(buildTorrentCollectionKey(singleTorrent.value));
});

const showCollectionDialog = ref(false);
const collectionDialogTorrent = ref<ISearchResultTorrent | null>(null);

async function handleCollect() {
  if (!singleTorrent.value) return;
  const hasCustom = metadataStore.getCustomCollections().length > 0;
  if (!hasCustom) {
    // 直接添加/移除 默认收藏夹
    if (isCollected.value) {
      await metadataStore.updateTorrentCollections(singleTorrent.value, []);
      runtimeStore.showSnakebar("已从收藏中移除", { color: "info" });
    } else {
      await metadataStore.addTorrentToCollections(singleTorrent.value, [DEFAULT_COLLECTION_ID]);
      runtimeStore.showSnakebar("已添加到默认收藏夹", { color: "success" });
    }
  } else {
    // 显示收藏夹选择对话框
    collectionDialogTorrent.value = singleTorrent.value;
    showCollectionDialog.value = true;
  }
}
</script>

<template>
  <v-btn-group :density="density" class="table-action" color="grey" variant="text">
    <v-btn
      v-if="metadataStore.defaultDownloader?.id"
      :disabled="torrentItems.length == 0"
      :size="btnSize"
      icon="mdi-download"
      title="发送到默认下载器"
      @click="() => sendToDownloader(true)"
    />

    <!-- 下载到服务器 -->
    <v-btn
      :disabled="torrentItems.length == 0"
      :size="btnSize"
      icon="mdi-cloud-download"
      title="发送到下载器"
      @click="() => sendToDownloader()"
    />
    <!-- 复制下载链接 -->
    <v-btn
      :disabled="torrentItems.length == 0"
      :loading="copyTorrentDownloadLinkBtnStatus"
      :size="btnSize"
      icon="mdi-content-copy"
      title="复制下载链接"
      @click="() => copyTorrentDownloadLink()"
    />
    <!-- 下载种子文件到本地 -->
    <v-btn
      :disabled="torrentItems.length == 0"
      :loading="localDlTorrentDownloadLinkBtnStatus"
      :size="btnSize"
      icon="mdi-content-save"
      title="下载种子文件到本地"
      @click="() => localDlTorrentDownloadLink()"
    />
    <!-- 收藏 -->
    <v-btn
      v-if="singleTorrent"
      :color="isCollected ? 'amber' : 'grey'"
      :icon="isCollected ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
      :size="btnSize"
      :title="isCollected ? '已收藏（点击管理收藏夹）' : '收藏种子'"
      @click="handleCollect"
    />
  </v-btn-group>

  <!-- 在点击发送到远程服务器时，弹出选择下载器及其他自定义选项 -->
  <SentToDownloaderDialog
    v-model="showDownloadClientDialog"
    :torrent-items="torrentItems"
    :is-default-send="isDefaultSend"
  />

  <!-- 收藏夹选择对话框 -->
  <CollectionAddDialog v-model="showCollectionDialog" :torrent="collectionDialogTorrent" />
</template>

<style scoped lang="scss"></style>
