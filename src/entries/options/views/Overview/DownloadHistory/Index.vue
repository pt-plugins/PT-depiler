<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { onMounted, ref, shallowRef } from "vue";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";

import { sendMessage } from "@/messages.ts";
import { formatDate } from "@/options/utils.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import type { ITorrentDownloadMetadata, TTorrentDownloadKey } from "@/shared/types.ts";

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
const configStore = useConfigStore();

const { tableFilterRef, tableWaitFilterRef, tableFilterFn } = tableCustomFilter;

const tableHeader = [
  { title: "№", key: "id", align: "center", width: 50 },
  { title: t("DownloadHistory.table.site"), key: "siteId", align: "center", width: 90 },
  { title: t("DownloadHistory.table.title"), key: "title", align: "start", minWidth: 600, maxWidth: "32vw" },
  { title: t("DownloadHistory.table.downloader"), key: "downloaderId", minWidth: 200, align: "start" },
  { title: t("DownloadHistory.table.downloadAt"), key: "downloadAt", align: "center" },
  { title: t("DownloadHistory.table.status"), key: "downloadStatus" },
  { title: t("common.action"), key: "action", align: "center", width: 90, minWidth: 90, sortable: false },
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
  return await sendMessage("deleteDownloadHistoryById", downloadHistoryId);
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
          :text="t('DownloadHistory.refresh')"
          @click="() => throttleLoadDownloadHistory()"
        />

        <v-divider vertical class="mx-2" />

        <NavButton
          :disabled="tableSelected.length === 0"
          color="primary"
          icon="mdi-tray-arrow-down"
          :text="t('DownloadHistory.reDownload')"
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
          :label="t('DownloadHistory.filterPlaceholder')"
          max-width="500"
          prepend-inner-icon="mdi-filter"
          single-line
          @click:prepend-inner="showAdvanceFilterDialog = true"
        />
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        v-model="tableSelected"
        :custom-filter="tableFilterFn"
        :filter-keys="['id'] /* 对每个item值只检索一次 */"
        :headers="tableHeader"
        :items="downloadHistoryList"
        :items-per-page="configStore.tableBehavior.DownloadHistory.itemsPerPage"
        :multi-sort="configStore.enableTableMultiSort"
        :search="tableFilterRef"
        :sort-by="configStore.tableBehavior.DownloadHistory.sortBy"
        class="table-stripe table-header-no-wrap"
        hover
        item-value="id"
        show-select
        @update:itemsPerPage="(v) => configStore.updateTableBehavior('DownloadHistory', 'itemsPerPage', v)"
        @update:sortBy="(v) => configStore.updateTableBehavior('DownloadHistory', 'sortBy', v)"
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
      </v-data-table>
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
