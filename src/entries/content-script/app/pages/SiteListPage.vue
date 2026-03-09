<script setup lang="ts">
import { inject, ref, shallowRef } from "vue";
import { type ITorrent } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import type { IRemoteDownloadDialogData } from "../types.ts";
import { copyTextToClipboard, doKeywordSearch, siteInstance, wrapperConfirmFn } from "../utils.ts";

import AdvanceListModuleDialog from "../components/AdvanceListModuleDialog.vue";
import SpeedDialBtn from "../components/SpeedDialBtn.vue";
import CollectionAddDialog from "@/options/components/CollectionAddDialog.vue";

import { DEFAULT_COLLECTION_ID, buildTorrentCollectionKey } from "@/shared/types.ts";

const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

async function parseListPage(showNoTorrentError = true) {
  // 使用克隆的文档，避免污染原始文档
  const parsedResult = await siteInstance.value?.transformListPage(document.cloneNode(true) as Document);

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

const localDownloadMultiStatus = ref<boolean>(false);
function handleLocalDownloadMulti() {
  localDownloadMultiStatus.value = true;
  parseListPage()
    .then(({ torrents }) => {
      for (const torrent of torrents) {
        sendMessage("downloadTorrent", { torrent, downloaderId: "local" });
      }
    })
    .finally(() => {
      localDownloadMultiStatus.value = false;
    });
}

const linkCopyMultiStatus = ref<boolean>(false);
function handleLinkCopyMulti() {
  linkCopyMultiStatus.value = true;
  parseListPage()
    .then(async ({ torrents }) => {
      const downloadUrls = [] as string[];

      try {
        for (const torrent of torrents) {
          const downloadUrl = await sendMessage("getTorrentDownloadLink", torrent);
          downloadUrls.push(downloadUrl);
        }

        const copied = await copyTextToClipboard(downloadUrls.join("\n").trim());
        runtimeStore.showSnakebar(copied ? "下载链接已复制到剪贴板" : "复制下载链接失败", {
          color: copied ? "success" : "error",
        });
      } catch (e) {
        runtimeStore.showSnakebar("复制下载链接失败", { color: "error" });
      }
    })
    .finally(() => {
      linkCopyMultiStatus.value = false;
    });
}

const remoteDownloadDialogData = inject<IRemoteDownloadDialogData>("remoteDownloadDialogData")!;

function handleRemoteDownloadMulti(isDefaultSend = false) {
  parseListPage().then(({ torrents }) => {
    if (torrents.length > 0) {
      remoteDownloadDialogData.torrents = torrents;
      remoteDownloadDialogData.isDefaultSend = isDefaultSend;
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

// ===================== 收藏功能 =====================
const showCollectionDialog = ref(false);
// 当页面只有一个种子时，直接用该种子作为收藏对象；
// 当页面有多个种子时，使用 collectionBatchTorrents 批量添加。
const collectionDialogTorrent = ref<ITorrent | null>(null);
const collectionBatchTorrents = shallowRef<ITorrent[]>([]);

async function handleCollectAll() {
  const { torrents } = await parseListPage().catch(() => ({ torrents: [] as ITorrent[] }));
  if (torrents.length === 0) return;

  const hasCustom = metadataStore.getCustomCollections().length > 0;

  if (!hasCustom) {
    // 直接批量添加到默认收藏夹
    for (const torrent of torrents) {
      await metadataStore.addTorrentToCollections(torrent, [DEFAULT_COLLECTION_ID]);
    }
    runtimeStore.showSnakebar(`已将 ${torrents.length} 个种子添加到默认收藏夹`, { color: "success" });
  } else {
    // 若只有一个种子，用单种子对话框；多个种子时用第一个代理（仅选择收藏夹）
    collectionBatchTorrents.value = torrents;
    collectionDialogTorrent.value = torrents[0] ?? null;
    showCollectionDialog.value = true;
  }
}

async function onCollectionSaved() {
  // 批量模式：将所有解析到的种子同步到与第一个种子相同的收藏夹
  const key0 = collectionDialogTorrent.value ? buildTorrentCollectionKey(collectionDialogTorrent.value) : null;
  if (!key0 || collectionBatchTorrents.value.length <= 1) return;

  const selectedIds = metadataStore.getTorrentCollectionIds(key0);
  for (const torrent of collectionBatchTorrents.value.slice(1)) {
    await metadataStore.updateTorrentCollections(torrent, selectedIds);
  }
}
</script>

<template>
  <SpeedDialBtn
    key="save"
    :loading="localDownloadMultiStatus"
    color="light-blue"
    icon="mdi-content-save-all"
    title="本地下载"
    @click="wrapperConfirmFn(handleLocalDownloadMulti)"
  />
  <SpeedDialBtn
    key="copy"
    :loading="linkCopyMultiStatus"
    color="light-blue"
    icon="mdi-content-copy"
    title="复制链接"
    @click="wrapperConfirmFn(handleLinkCopyMulti)"
  />
  <SpeedDialBtn
    key="download"
    :disabled="metadataStore.getEnabledDownloaders.length === 0"
    color="light-blue"
    icon="mdi-cloud-download"
    title="推送到..."
    @click="() => handleRemoteDownloadMulti()"
  />
  <SpeedDialBtn
    key="download_default"
    v-if="metadataStore.defaultDownloader?.id"
    :disabled="metadataStore.getEnabledDownloaders.length === 0"
    color="light-blue"
    icon="mdi-download"
    title="推送到默认下载器"
    @click="() => handleRemoteDownloadMulti(true)"
  />

  <SpeedDialBtn
    key="advance"
    color="indigo"
    icon="mdi-checkbox-multiple-marked"
    title="高级列表"
    @click="handleAdvanceListModule"
  />
  <SpeedDialBtn key="search" color="indigo" icon="mdi-home-search" title="快捷搜索" @click="handleSearch" />
  <SpeedDialBtn
    key="collect"
    color="amber"
    icon="mdi-bookmark-multiple-outline"
    title="收藏当前页种子"
    @click="wrapperConfirmFn(handleCollectAll)"
  />

  <AdvanceListModuleDialog v-model="showAdvanceListModuleDialog" :torrent-items="parsedTorrents" />
  <CollectionAddDialog v-model="showCollectionDialog" :torrent="collectionDialogTorrent" @saved="onCollectionSaved" />
</template>

<style scoped lang="scss"></style>
