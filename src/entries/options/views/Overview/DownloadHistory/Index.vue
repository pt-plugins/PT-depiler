<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { onMounted, ref, shallowRef } from "vue";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";

import { sendMessage } from "@/messages.ts";
import { formatDate } from "@/options/utils.ts";
import type { ITorrentDownloadMetadata, TTorrentDownloadKey } from "@/shared/storages/types/indexdb.ts";

import SiteFavicon from "@/options/components/SiteFavicon.vue";
import SiteName from "@/options/components/SiteName.vue";
import TorrentTitleTd from "@/options/components/TorrentTitleTd.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";
import DownloaderLabel from "@/options/components/DownloaderLabel.vue";
import NavButton from "@/options/components/NavButton.vue";
import ReDownloadSelectDialog from "./ReDownloadSelectDialog.vue";
import AdvanceFilterGenerateDialog from "./AdvanceFilterGenerateDialog.vue";

import {
  downloadHistory,
  downloadHistoryList,
  downloadStatusMap,
  tableCustomFilter,
  throttleLoadDownloadHistory,
} from "./utils.ts"; // <-- 主要方法

const { t } = useI18n();
const { tableFilterRef, tableWaitFilterRef, tableFilterFn } = tableCustomFilter;

const tableHeader = [
  { title: "№", key: "id", align: "center", width: 50 },
  { title: "站点", key: "siteId", align: "center", width: 90 },
  { title: "种子", key: "title", align: "start", minWidth: 600, maxWidth: "32vw" },
  { title: "下载服务器", key: "downloaderId", minWidth: 200, align: "start" },
  { title: "下载时间", key: "downloadAt", align: "center" },
  { title: "下载状态", key: "downloadStatus" },
  { title: "操作", key: "action", align: "center", width: 90, minWidth: 90, sortable: false },
] as DataTableHeader[];
const tableSelected = ref<TTorrentDownloadKey[]>([]);

const showAdvanceFilterDialog = ref<boolean>(false);

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
        <NavButton
          color="green"
          icon="mdi-cached"
          text="刷新下载记录列表"
          @click="() => throttleLoadDownloadHistory()"
        />

        <v-divider vertical class="mx-2" />

        <NavButton
          :disabled="tableSelected.length === 0"
          color="primary"
          icon="mdi-tray-arrow-down"
          text="重新下载"
          @click="() => reDownloadTorrent(tableSelected)"
        />

        <NavButton
          :disabled="tableSelected.length === 0"
          :text="t('common.remove')"
          color="error"
          icon="mdi-minus"
          @click="deleteDownloadHistory(tableSelected)"
        />

        <v-spacer />

        <!-- 筛选框 -->
        <v-text-field
          v-model="tableWaitFilterRef"
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
        :custom-filter="tableFilterFn"
        :filter-keys="['id'] /* 对每个item值只检索一次 */"
        :headers="tableHeader"
        :height="'calc(100vh - 250px)'"
        :items="downloadHistoryList"
        :search="tableFilterRef"
        :sort-by="[{ key: 'id', order: 'desc' }]"
        class="table-stripe table-header-no-wrap"
        fixed-header
        hover
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
            <v-btn
              color="primary"
              icon="mdi-tray-arrow-down"
              size="small"
              @click="() => reDownloadTorrent([item.id!])"
            />

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
    @update:table-filter="(v) => (tableWaitFilterRef = v)"
  />

  <DeleteDialog
    v-model="showDeleteDialog"
    :to-delete-ids="toDeleteIds"
    :confirm-delete="confirmDeleteDownloadHistory"
    @all-delete="() => throttleLoadDownloadHistory()"
  />
</template>

<style scoped lang="scss"></style>
