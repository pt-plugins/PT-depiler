<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { throttle } from "es-toolkit";
import { computed, onMounted, reactive, ref, shallowRef } from "vue";

import { sendMessage } from "@/messages.ts";
import { formatDate } from "@/options/utils.ts";
import type { ITorrentDownloadMetadata, TTorrentDownloadKey } from "@/shared/storages/types/indexdb.ts";

import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SiteName from "@/options/components/SiteName.vue";
import TorrentTitleTd from "@/options/components/TorrentTitleTd.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";
import DownloaderLabel from "@/options/components/DownloaderLabel.vue"; // <-- 主要方法
import ReDownloadSelectDialog from "./ReDownloadSelectDialog.vue";
import AdvanceFilterGenerateDialog from "./AdvanceFilterGenerateDialog.vue";

import { downloadStatusMap, tableCustomFilterFn, tableWaitFilter, tableFilter } from "./utils.ts";

const { t } = useI18n();

const downloadHistory = ref<Record<TTorrentDownloadKey, ITorrentDownloadMetadata>>({});
const downloadHistoryList = computed(() => Object.values(downloadHistory.value));

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

const showAdvanceFilterDialog = ref<boolean>(false);

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

const showReDownloadSelectDialog = ref<boolean>(false);
const reDownloadTorrentListRef = shallowRef<ITorrentDownloadMetadata[]>([]);
function reDownloadTorrent(downloadHistoryIds: TTorrentDownloadKey[]) {
  const reDownloadTorrentList = [];
  for (const downloadHistoryId of downloadHistoryIds) {
    const history: ITorrentDownloadMetadata = downloadHistory.value[downloadHistoryId];
    if (history) {
      reDownloadTorrentList.push(history);
    }
  }
  reDownloadTorrentListRef.value = reDownloadTorrentList;
  showReDownloadSelectDialog.value = true;
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
  throttleLoadDownloadHistory();
});
</script>

<template>
  <v-alert :title="t('route.Overview.DownloadHistory')" type="info" />
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <!-- 按钮组 -->
        <v-btn color="green" prepend-icon="mdi-cached" @click="() => loadDownloadHistory()"> 刷新下载记录列表 </v-btn>

        <v-divider vertical class="mx-2" />

        <v-btn
          :disabled="tableSelected.length === 0"
          color="primary"
          prepend-icon="mdi-tray-arrow-down"
          @click="() => reDownloadTorrent(tableSelected)"
        >
          重新下载
        </v-btn>

        <v-btn
          :disabled="tableSelected.length === 0"
          color="error"
          class="ml-2"
          prepend-icon="mdi-minus"
          @click="deleteDownloadHistory(tableSelected)"
        >
          {{ t("common.remove") }}
        </v-btn>

        <v-spacer />

        <!-- 筛选框 -->
        <v-text-field
          v-model="tableWaitFilter"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          label="过滤下载记录"
          max-width="500"
          prepend-inner-icon="mdi-filter"
          single-line
          @click:prepend-inner="showAdvanceFilterDialog = true"
        />
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table-virtual
        v-model="tableSelected"
        :custom-filter="tableCustomFilterFn"
        :filter-keys="['id'] /* 对每个item值只检索一次 */"
        :headers="tableHeader"
        :height="'calc(100vh - 250px)'"
        :items="downloadHistoryList"
        :search="tableFilter"
        :sort-by="[{ key: 'id', order: 'desc' }]"
        class="table-stripe"
        fixed-header
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
          <DownloaderLabel :downloader="item.downloaderId" />
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
      </v-data-table-virtual>
    </v-card-text>
  </v-card>

  <ReDownloadSelectDialog
    v-model="showReDownloadSelectDialog"
    :torrent-items="reDownloadTorrentListRef"
    @re-download-complete="() => throttleLoadDownloadHistory()"
  />

  <AdvanceFilterGenerateDialog
    v-model="showAdvanceFilterDialog"
    :records="downloadHistoryList"
    @update:table-filter="(v) => (tableWaitFilter = v)"
  />

  <DeleteDialog
    v-model="showDeleteDialog"
    :to-delete-ids="toDeleteIds"
    @confirm-delete="confirmDeleteDownloadHistory"
  />
</template>

<style scoped lang="scss"></style>
