<script setup lang="ts">
import { inject, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { type ITorrent } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import type { IRemoteDownloadDialogData } from "../types.ts";
import { copyTextToClipboard, doKeywordSearch, siteInstance, wrapperConfirmFn } from "../utils.ts";

import AdvanceListModuleDialog from "../components/AdvanceListModuleDialog.vue";
import SpeedDialBtn from "../components/SpeedDialBtn.vue";

const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();
const { t } = useI18n();

async function parseListPage(showNoTorrentError = true) {
  // 使用克隆的文档，避免污染原始文档
  const parsedResult = await siteInstance.value?.transformListPage(document.cloneNode(true) as Document);

  let errorMessage = "";
  if ((parsedResult?.torrents ?? []).length === 0) {
    errorMessage = t("contentScript.noTorrentParsed");
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
        runtimeStore.showSnakebar(copied ? t("contentScript.copyLinkSuccess") : t("contentScript.copyLinkFailed"), {
          color: copied ? "success" : "error",
        });
      } catch (e) {
        runtimeStore.showSnakebar(t("contentScript.copyLinkFailed"), { color: "error" });
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
</script>

<template>
  <SpeedDialBtn
    key="save"
    :loading="localDownloadMultiStatus"
    color="light-blue"
    icon="mdi-content-save-all"
    :title="t('downloaderLabel.localDownload')"
    @click="wrapperConfirmFn(handleLocalDownloadMulti)"
  />
  <SpeedDialBtn
    key="copy"
    :loading="linkCopyMultiStatus"
    color="light-blue"
    icon="mdi-content-copy"
    :title="t('contentScript.copyLink')"
    @click="wrapperConfirmFn(handleLinkCopyMulti)"
  />
  <SpeedDialBtn
    key="download"
    :disabled="metadataStore.getEnabledDownloaders.length === 0"
    color="light-blue"
    icon="mdi-cloud-download"
    :title="t('contentScript.pushTo')"
    @click="() => handleRemoteDownloadMulti()"
  />
  <SpeedDialBtn
    key="download_default"
    v-if="metadataStore.defaultDownloader?.id"
    :disabled="metadataStore.getEnabledDownloaders.length === 0"
    color="light-blue"
    icon="mdi-download"
    :title="t('contentScript.pushToDefault')"
    @click="() => handleRemoteDownloadMulti(true)"
  />

  <SpeedDialBtn
    key="advance"
    color="indigo"
    icon="mdi-checkbox-multiple-marked"
    :title="t('contentScript.advanceList')"
    @click="handleAdvanceListModule"
  />
  <SpeedDialBtn key="search" color="indigo" icon="mdi-home-search" :title="t('contentScript.quickSearch')" @click="handleSearch" />

  <AdvanceListModuleDialog v-model="showAdvanceListModuleDialog" :torrent-items="parsedTorrents" />
</template>

<style scoped lang="scss"></style>
