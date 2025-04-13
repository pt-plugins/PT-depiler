<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

import { getDownloaderIcon } from "@ptd/downloader";

import { useMetadataStore } from "@/options/stores/metadata.ts";

import { sendMessage } from "@/messages.ts";
import { formatDate } from "@/options/utils.ts";

import type { TDownloaderKey } from "@/shared/storages/types/metadata.ts";
import type { ITorrentDownloadMetadata, TTorrentDownloadKey } from "@/shared/storages/types/indexdb.ts";

import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SiteName from "@/options/components/SiteName.vue";
import TorrentTitleTd from "@/options/components/TorrentTitleTd.vue";

const { t } = useI18n();
const metadataStore = useMetadataStore();

const downloadHistory = reactive<Record<TTorrentDownloadKey, ITorrentDownloadMetadata>>({});
const downloadHistoryList = computed(() => Object.values(downloadHistory));

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
    downloadHistory[downloadHistoryId] = history;
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
    history.forEach((item) => {
      downloadHistory[item.id!] = item;
      if (item.downloadStatus == "downloading" || item.downloadStatus == "pending") {
        watchDownloadHistory(item.id!);
      }
    });
  });
}

onMounted(() => {
  loadDownloadHistory();
});

const toDeleteIds = ref<TTorrentDownloadKey[]>([]);
function deleteDownloadHistory(downloadHistoryIds: TTorrentDownloadKey[]) {
  // TODO
}
</script>

<template>
  <v-alert :title="t('route.Overview.DownloadHistory')" type="info" />
  <v-card>
    <v-card-title>
      <!-- TODO -->
      <v-btn>刷新状态</v-btn>
      <v-btn>删除</v-btn>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="tableHeader"
        :items="downloadHistoryList"
        :items-per-page="50"
        :sort-by="[{ key: 'id', order: 'desc' }]"
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
            <v-icon class="ml-1" icon="mdi-folder-download" size="40" color="amber" />
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
            <v-btn
              :title="t('common.remove')"
              color="error"
              icon="mdi-delete"
              size="small"
              @click="() => deleteDownloadHistory([item.id])"
            />
          </v-btn-group>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
