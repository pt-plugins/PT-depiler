<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { throttle } from "es-toolkit";
import { type CAddTorrentOptions, getDownloaderIcon } from "@ptd/downloader";

import { useMetadataStore } from "@/options/stores/metadata.ts";

import { sendMessage } from "@/messages.ts";
import { formatDate } from "@/options/utils.ts";

import type { TDownloaderKey } from "@/shared/storages/types/metadata.ts";
import type { ITorrentDownloadMetadata, TTorrentDownloadKey } from "@/shared/storages/types/indexdb.ts";

import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SiteName from "@/options/components/SiteName.vue";
import TorrentTitleTd from "@/options/components/TorrentTitleTd.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";

const { t } = useI18n();
const metadataStore = useMetadataStore();

const downloadHistory = ref<Record<TTorrentDownloadKey, ITorrentDownloadMetadata>>({});
const downloadHistoryList = computed(() => Object.values(downloadHistory.value));

const downloaderConfig = (downloaderId: TDownloaderKey) =>
  computed(() => {
    return metadataStore.downloaders[downloaderId];
  });

const downloaderIcon = (downloaderId: TDownloaderKey) =>
  computed(() => {
    return getDownloaderIcon(downloaderConfig(downloaderId).value.type);
  });

const tableHeader = [
  { title: "№", key: "id", align: "center", width: 50, filterable: false },
  { title: "站点", key: "siteId", align: "center", width: 90 },
  { title: "种子", key: "title", align: "start", filterable: false },
  { title: "下载服务器", key: "downloaderId", align: "start" },
  { title: "下载时间", key: "downloadAt", align: "center", filterable: false },
  { title: "下载状态", key: "downloadStatus" },
  { title: "操作", key: "action", align: "center", width: 90, minWidth: 90, sortable: false, alwaysShow: true },
];
const tableSelected = ref<TTorrentDownloadKey[]>([]);

const downloadStatusMap: Record<
  ITorrentDownloadMetadata["downloadStatus"],
  { title: string; icon: string; color: string }
> = {
  downloading: { title: "下载中", icon: "mdi-download", color: "blue" },
  pending: { title: "等待中", icon: "mdi-clock", color: "orange" },
  completed: { title: "已完成", icon: "mdi-check", color: "green" },
  failed: { title: "错误", icon: "mdi-alert", color: "red" },
};

// 使用 setTimeout 监听下载状态变化
const watchingMap = reactive<Record<TTorrentDownloadKey, number>>({});
function watchDownloadHistory(downloadHistoryId: TTorrentDownloadKey) {
  watchingMap[downloadHistoryId] = setTimeout(async () => {
    const history = await sendMessage("getDownloadHistoryById", downloadHistoryId);
    downloadHistory.value[downloadHistoryId] = history;
    if (history.downloadStatus == "downloading" || history.downloadStatus == "pending") {
      watchDownloadHistory(downloadHistoryId);
    } else {
      delete watchingMap[downloadHistoryId];
    }
  }, 1e3) as unknown as number;
}

function loadDownloadHistory() {
  // 首先清除所有的下载状态监听
  for (const key of Object.keys(watchingMap)) {
    clearTimeout(watchingMap[key as unknown as number]);
    delete watchingMap[key as unknown as number];
  }

  sendMessage("getDownloadHistory", undefined).then((history: ITorrentDownloadMetadata[]) => {
    downloadHistory.value = {}; // 清空目前的下载记录
    history.forEach((item) => {
      downloadHistory.value[item.id!] = item;
      if (item.downloadStatus == "downloading" || item.downloadStatus == "pending") {
        watchDownloadHistory(item.id!);
      }
    });
  });
}

const throttleLoadDownloadHistory = throttle(loadDownloadHistory, 1e3);

const isReDownloading = ref<boolean>(false);
function reDownloadTorrent(downloadHistoryIds: TTorrentDownloadKey[]) {
  isReDownloading.value = true;
  const promises = [];
  for (const downloadHistoryId of downloadHistoryIds) {
    const history: ITorrentDownloadMetadata = downloadHistory.value[downloadHistoryId];
    if (history) {
      const historyTorrent = history.torrent;
      if (history.downloaderId === "local") {
        promises.push(sendMessage("downloadTorrentToLocalFile", historyTorrent));
      } else {
        promises.push(
          sendMessage("downloadTorrentToDownloader", {
            torrent: historyTorrent,
            downloaderId: history.downloaderId,
            addTorrentOptions: (history.addTorrentOptions ?? {}) as CAddTorrentOptions,
          }),
        );
      }
    }
  }
  Promise.all(promises).then(() => {
    isReDownloading.value = false;
    throttleLoadDownloadHistory();
  });
}

const showDeleteDialog = ref<boolean>(false);
const toDeleteIds = ref<TTorrentDownloadKey[]>([]);
async function deleteDownloadHistory(downloadHistoryIds: TTorrentDownloadKey[]) {
  toDeleteIds.value = downloadHistoryIds;
  showDeleteDialog.value = true;
}

async function confirmDeleteDownloadHistory(downloadHistoryId: TTorrentDownloadKey) {
  await sendMessage("deleteDownloadHistoryById", downloadHistoryId);
  const index = tableSelected.value.indexOf(downloadHistoryId);
  if (index !== -1) {
    tableSelected.value.splice(index, 1);
  }

  throttleLoadDownloadHistory();
}

onMounted(() => {
  loadDownloadHistory();
});
</script>

<template>
  <v-alert :title="t('route.Overview.DownloadHistory')" type="info" />
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <!-- TODO -->
        <v-btn color="green" prepend-icon="mdi-cached" @click="() => loadDownloadHistory()">刷新下载记录列表 </v-btn>

        <v-divider vertical class="mx-2" />

        <v-btn
          :disabled="tableSelected.length === 0"
          :loading="isReDownloading"
          color="primary"
          prepend-icon="mdi-tray-arrow-down"
          @click="() => reDownloadTorrent(tableSelected)"
        >
          重新下载
        </v-btn>

        <v-divider vertical class="mx-2" />

        <v-btn
          :disabled="tableSelected.length === 0"
          color="error"
          prepend-icon="mdi-minus"
          @click="deleteDownloadHistory(tableSelected)"
        >
          {{ t("common.remove") }}
        </v-btn>
        <v-btn
          :disabled="downloadHistoryList.length === 0"
          class="ml-2"
          color="error"
          prepend-icon="mdi-close"
          @click="deleteDownloadHistory(tableSelected)"
        >
          清空
        </v-btn>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        v-model="tableSelected"
        :headers="tableHeader"
        :items="downloadHistoryList"
        :items-per-page="50"
        :sort-by="[{ key: 'id', order: 'desc' }]"
        class="table-stripe"
        item-value="id"
        show-select
      >
        <template #item.siteId="{ item }">
          <div class="d-flex flex-column align-center">
            <SiteFavicon :site-id="item.siteId" :size="18" />
            <SiteName :site-id="item.siteId" />
          </div>
        </template>

        <template #item.title="{ item }">
          <TorrentTitleTd v-if="item.torrent" :item="item.torrent" />
        </template>

        <template #item.downloaderId="{ item }">
          <template v-if="item.downloaderId === 'local'">
            <v-icon class="ml-1" color="amber" icon="mdi-folder-download" size="40" />
            <span class="ml-3 font-weight-bold">本地下载</span>
          </template>
          <template v-else>
            <v-container>
              <v-row>
                <v-col class="pa-0">
                  <v-avatar :image="downloaderIcon(item.downloaderId).value" />
                </v-col>
                <v-col class="pa-0 ml-2">
                  <span class="font-weight-bold">{{ downloaderConfig(item.downloaderId).value.name }}</span>
                  <br />
                  <a :href="downloaderConfig(item.downloaderId).value.address" class="text-caption" target="_blank">
                    [{{ downloaderConfig(item.downloaderId).value.address }}]
                  </a>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </template>

        <template #item.downloadAt="{ item }">
          <span class="t_downloadAt text-no-wrap">{{ formatDate(item.downloadAt ?? 0) }}</span>
        </template>

        <template #item.downloadStatus="{ item }">
          <v-chip
            :prepend-icon="downloadStatusMap[item.downloadStatus].icon"
            :color="downloadStatusMap[item.downloadStatus].color"
          >
            {{ downloadStatusMap[item.downloadStatus].title }}
          </v-chip>
        </template>

        <template #item.action="{ item }">
          <v-btn-group class="table-action" density="compact" variant="plain">
            <v-btn color="primary" icon="mdi-tray-arrow-down" size="small" @click="() => reDownloadTorrent([item.id!])">
            </v-btn>

            <v-btn
              :title="t('common.remove')"
              color="error"
              icon="mdi-delete"
              size="small"
              @click="() => deleteDownloadHistory([item.id!])"
            />
          </v-btn-group>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <DeleteDialog
    v-model="showDeleteDialog"
    :to-delete-ids="toDeleteIds"
    @confirm-delete="confirmDeleteDownloadHistory"
  />
</template>

<style scoped lang="scss"></style>
