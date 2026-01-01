<script setup lang="ts">
import { ref, computed, inject } from "vue";
import { useWindowSize } from "@vueuse/core";
import { ETorrentStatus, ITorrent } from "@ptd/site";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";

import { formatDate, formatSize } from "@/options/utils.ts";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import type { IRemoteDownloadDialogData } from "../types.ts";

import NavButton from "@/options/components/NavButton.vue";
import TorrentTitleTd from "@/options/components/TorrentTitleTd.vue";

const showDialog = defineModel<boolean>();

const { height: windowHeight } = useWindowSize();

const { torrentItems } = defineProps<{
  torrentItems: ITorrent[];
}>();

const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const tableHeaders = computed(
  () =>
    [
      { title: "分类", key: "category", align: "center", maxWidth: 60 },
      { title: "标题", key: "title", align: "start", maxWidth: 400 },
      { title: "大小", key: "size", align: "end", minWidth: 60 },
      { title: "上传", key: "seeders", align: "end", minWidth: 40 },
      { title: "下载", key: "leechers", align: "end", minWidth: 40 },
      { title: "完成", key: "completed", align: "end", minWidth: 40 },
      { title: "发布于(≈)", key: "time", align: "center", minWidth: 80 },
    ] as DataTableHeader[],
);

const selectedTorrentIds = ref<ITorrent["id"][]>([]);
const selectedTorrents = computed(() => torrentItems.filter((x) => selectedTorrentIds.value.includes(x.id)));
const hasSelectedTorrent = computed(() => selectedTorrentIds.value.length > 0);
const selectedTorrentsCount = computed(() => selectedTorrentIds.value.length);
const selectedTorrentsSize = computed(() =>
  selectedTorrents.value.reduce((acc, torrent) => acc + (torrent.size ?? 0), 0),
);

const localDownloadMultiStatus = ref<boolean>(false);
async function handleLocalDownloadMulti() {
  localDownloadMultiStatus.value = true;
  for (const torrent of selectedTorrents.value) {
    await sendMessage("downloadTorrent", { torrent, downloaderId: "local" });
  }
  localDownloadMultiStatus.value = false;
}

const linkCopyMultiStatus = ref<boolean>(false);
async function handleLinkCopyMulti() {
  linkCopyMultiStatus.value = true;
  const downloadUrls = [] as string[];

  try {
    for (const torrent of selectedTorrents.value) {
      const downloadUrl = await sendMessage("getTorrentDownloadLink", torrent);
      downloadUrls.push(downloadUrl);
    }

    await navigator.clipboard.writeText(downloadUrls.join("\n").trim());
    runtimeStore.showSnakebar("下载链接已复制到剪贴板", { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar("复制下载链接失败", { color: "error" });
  } finally {
    linkCopyMultiStatus.value = false;
  }
}

const remoteDownloadDialogData = inject<IRemoteDownloadDialogData>("remoteDownloadDialogData")!;

function handleRemoteDownloadMulti(isDefaultSend = false) {
  remoteDownloadDialogData.torrents = selectedTorrents.value;
  remoteDownloadDialogData.isDefaultSend = isDefaultSend;
  remoteDownloadDialogData.show = true;
}

function handleSelectSeeders() {
  selectedTorrentIds.value = torrentItems.filter((item) => item.seeders).map((x) => x.id);
}

function handleSelectNotSeeding() {
  selectedTorrentIds.value = torrentItems
    .filter(
      (item) =>
        item.status !== undefined && ![ETorrentStatus.seeding, ETorrentStatus.downloading].includes(item.status!),
    )
    .map((x) => x.id);
}

function enterDialog() {
  selectedTorrentIds.value = torrentItems.map((x) => x.id);
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="1200" scrollable @after-enter="enterDialog">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 为 {{ torrentItems.length }} 个种子自定义批量操作行为 </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-card-text class="overflow-y-hidden">
        <NavButton icon="mdi-inbox-arrow-up" text="勾选上传行" color="light-blue" @click="handleSelectSeeders" />
        <NavButton icon="mdi-download-off" text="勾选未下载过" color="light-blue" @click="handleSelectNotSeeding" />
        <v-data-table-virtual
          v-model="selectedTorrentIds"
          :headers="tableHeaders"
          :height="windowHeight - 256"
          :items="torrentItems"
          class="search-entity-table table-stripe table-header-no-wrap table-no-ext-padding"
          fixed-header
          hover
          item-value="id"
          show-select
        >
          <template #item.title="{ item }">
            <TorrentTitleTd :item="item" :show-social="false" />
          </template>

          <!-- 种子大小 -->
          <template #item.size="{ item }">
            <span class="t_size text-no-wrap">{{ formatSize(item.size ?? 0) }}</span>
          </template>

          <template #item.time="{ item }">
            <span class="t_time text-no-wrap">
              {{ item.time ? formatDate(item.time) : "-" }}
            </span>
          </template>
        </v-data-table-virtual>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <span v-show="hasSelectedTorrent"
          >已选中：{{ selectedTorrentsCount }} 个种子，总大小：{{ formatSize(selectedTorrentsSize) }}</span
        >

        <NavButton
          :disabled="!hasSelectedTorrent"
          :loading="localDownloadMultiStatus"
          color="light-blue"
          icon="mdi-content-save-all"
          text="本地下载"
          @click="handleLocalDownloadMulti"
        />

        <NavButton
          :disabled="!hasSelectedTorrent"
          :loading="linkCopyMultiStatus"
          color="light-blue"
          icon="mdi-content-copy"
          text="复制链接"
          @click="handleLinkCopyMulti"
        />

        <NavButton
          :disabled="!hasSelectedTorrent"
          key="remote_download_multi"
          color="light-blue"
          icon="mdi-cloud-download"
          text="推送到..."
          @click="() => handleRemoteDownloadMulti()"
        />

        <NavButton
          v-if="metadataStore.defaultDownloader?.id"
          key="remote_download_multi_default"
          :disabled="!hasSelectedTorrent"
          color="light-blue"
          icon="mdi-download"
          text="推送到默认下载器"
          @click="() => handleRemoteDownloadMulti(true)"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
