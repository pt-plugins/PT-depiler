<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { DataTableHeader } from "vuetify";

import { CTorrentState, type CTorrent, getDownloaderIcon } from "@ptd/downloader";
import { sendMessage } from "@/messages.ts";
import { formatSize, formatDate } from "@/options/utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useConfigStore } from "@/options/stores/config.ts";

import DeleteDialog from "./DeleteDialog.vue";
import PushToDownloaderDialog from "./PushToDownloaderDialog.vue";
import TorrentStateTd from "./TorrentStateTd.vue";
import ClientStatusDialog from "./ClientStatusDialog.vue";

import {
  torrents,
  autoRefreshRunning,
  globalRefreshInterval,
  useClientRefresh,
} from "./utils.ts";

const { t } = useI18n();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();
const configStore = useConfigStore();

const {
  activeDownloaderIds,
  loadSingleDownloader,
  scheduleDownloaderRefresh,
  stopAllTimers,
  resetRefreshState,
  startAutoRefresh,
  stopAutoRefresh,
  toggleAutoRefresh,
} = useClientRefresh();

// ── state ──────────────────────────────────────────────────────────────────
const loading = ref(false);

const tableSelected = ref<CTorrent[]>([]);
const searchText = ref("");

// delete dialog
const showDeleteDialog = ref(false);
const toDeleteTorrents = ref<CTorrent[]>([]);

// push to downloader dialog
const showPushToDownloaderDialog = ref(false);

// raw JSON dialog
const showRawDialog = ref(false);
const rawTorrent = ref<CTorrent | null>(null);

function openRawDialog(item: CTorrent) {
  rawTorrent.value = item;
  showRawDialog.value = true;
}

// client status dialog
const showClientStatusDialog = ref(false);

const totalUpSpeed = computed(() => torrents.value.reduce((acc, t) => acc + (t.uploadSpeed ?? 0), 0));
const totalDlSpeed = computed(() => torrents.value.reduce((acc, t) => acc + (t.downloadSpeed ?? 0), 0));

// ── computed ───────────────────────────────────────────────────────────────
const filteredTorrents = computed(() => {
  const active = activeDownloaderIds.value;
  const base = torrents.value.filter((t) => active.includes(t.clientId));
  if (!searchText.value) return base;
  const q = searchText.value.toLowerCase();
  return base.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.infoHash.toLowerCase().includes(q) ||
      (t.label ?? "").toLowerCase().includes(q) ||
      t.savePath.toLowerCase().includes(q),
  );
});

// ── table headers ─────────────────────────────────────────────────────────
const fullTableHeader = computed(
  () =>
    [
      { title: t("MyClient.table.client"), key: "clientId", align: "center", width: "120", props: { disabled: true } },
      { title: t("MyClient.table.name"), key: "name", align: "start", minWidth: "20rem", props: { disabled: true } },
      { title: t("MyClient.table.size"), key: "totalSize", align: "end", width: "110" },
      { title: t("MyClient.table.progress"), key: "progress", align: "end", width: "90" },
      { title: t("MyClient.table.status"), key: "state", align: "center", width: "110" },
      { title: t("MyClient.table.upSpeed"), key: "uploadSpeed", align: "end", width: "100" },
      { title: t("MyClient.table.dlSpeed"), key: "downloadSpeed", align: "end", width: "100" },
      { title: t("MyClient.table.totalUploaded"), key: "totalUploaded", align: "end", width: "100" },
      { title: t("MyClient.table.totalDownloaded"), key: "totalDownloaded", align: "end", width: "100" },
      { title: t("MyClient.table.ratio"), key: "ratio", align: "end", width: "60" },
      { title: t("MyClient.table.savePath"), key: "savePath", align: "start" },
      { title: t("MyClient.table.addedAt"), key: "dateAdded", align: "center", width: "160" },
      {
        title: t("common.action"),
        key: "action",
        align: "center",
        sortable: false,
        width: "120",
        props: { disabled: true },
      },
    ] as (DataTableHeader & { props?: any })[],
);

const tableHeader = computed(
  () =>
    fullTableHeader.value.filter(
      (item) => item?.props?.disabled || (configStore.tableBehavior["MyClient"] as any)?.columns?.includes(item.key),
    ) as DataTableHeader[],
);

// ── data loading ──────────────────────────────────────────────────────────
/** Manual full refresh: fetch all active downloaders, reset error state. */
async function loadTorrents() {
  loading.value = true;
  tableSelected.value = [];
  resetRefreshState();
  try {
    const results = await Promise.allSettled(
      activeDownloaderIds.value.map((id) => sendMessage("getClientTorrents", id)),
    );
    torrents.value = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  } finally {
    loading.value = false;
    if (autoRefreshRunning.value) {
      for (const id of activeDownloaderIds.value) {
        scheduleDownloaderRefresh(id);
      }
    }
  }
}

onMounted(() => {
  if (configStore.download.initDownloaderTorrentOnEnter) {
    loadTorrents();
  }
});

onUnmounted(() => {
  stopAllTimers();
});

// ── actions ───────────────────────────────────────────────────────────────
async function pauseTorrents(torrents: CTorrent[]) {
  if (torrents.length === 0) return;
  const results = await Promise.allSettled(
    torrents.map((t) => sendMessage("pauseClientTorrent", { downloaderId: t.clientId, id: t.id })),
  );
  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  runtimeStore.showSnakebar(t("MyClient.action.pauseSelectedSuccess", { count: succeeded }), { color: "success" });
  const affectedIds = [...new Set(torrents.map((t) => t.clientId))];
  await Promise.allSettled(affectedIds.map(loadSingleDownloader));
}

async function resumeTorrents(torrents: CTorrent[]) {
  if (torrents.length === 0) return;
  const results = await Promise.allSettled(
    torrents.map((t) => sendMessage("resumeClientTorrent", { downloaderId: t.clientId, id: t.id })),
  );
  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  runtimeStore.showSnakebar(t("MyClient.action.resumeSelectedSuccess", { count: succeeded }), { color: "success" });
  const affectedIds = [...new Set(torrents.map((t) => t.clientId))];
  await Promise.allSettled(affectedIds.map(loadSingleDownloader));
}

function openDeleteDialog(torrentList: CTorrent[]) {
  toDeleteTorrents.value = torrentList;
  showDeleteDialog.value = true;
}

// Called per-item by DeleteDialog
async function confirmDeleteTorrent(torrentKey_: string, removeData: boolean): Promise<void> {
  const torrent = toDeleteTorrents.value.find((t) => torrentKey(t) === torrentKey_);
  if (!torrent) return;
  await sendMessage("deleteClientTorrent", {
    downloaderId: torrent.clientId,
    id: torrent.id,
    removeData,
  });
}

function clientName(clientId: string) {
  return metadataStore.downloaders[clientId]?.name ?? clientId;
}

function clientIcon(clientId: string) {
  const type = metadataStore.downloaders[clientId]?.type;
  return type ? getDownloaderIcon(type) : undefined;
}

function torrentKey(torrent: CTorrent) {
  return String(torrent.id) + torrent.clientId;
}
</script>

<template>
  <v-alert :title="t('route.Overview.MyClient')" type="info">
    <template #append>
      <v-btn
        :title="t('MyClient.clientStatusDialog.openBtn')"
        class="mr-2 status-btn"
        color="primary"
        size="small"
        @click="showClientStatusDialog = true"
      >
        <v-icon class="mr-1" icon="mdi-database-outline" size="x-small" />
        {{ torrents.length }}
        <v-icon class="mr-1" color="green-darken-4" icon="mdi-chevron-up" size="x-small" />
        {{ formatSize(totalUpSpeed) }}/s
        <v-icon class="mr-1" color="red-darken-4" icon="mdi-chevron-down" size="x-small" />
        {{ formatSize(totalDlSpeed) }}/s
      </v-btn>
    </template>
  </v-alert>

  <v-card>
    <v-card-title>
      <v-row class="ma-0" align="center">
        <v-btn
          :title="t('MyClient.pushToDownloader.navBtn')"
          color="primary"
          icon="mdi-cloud-upload"
          variant="text"
          @click="showPushToDownloaderDialog = true"
        />

        <v-divider vertical class="mx-2" />

        <v-btn
          :disabled="tableSelected.length === 0"
          :title="t('MyClient.resumeSelected')"
          color="success"
          icon="mdi-play"
          variant="text"
          @click="() => resumeTorrents(tableSelected)"
        />

        <v-btn
          :disabled="tableSelected.length === 0"
          :title="t('MyClient.pauseSelected')"
          color="warning"
          icon="mdi-pause"
          variant="text"
          @click="() => pauseTorrents(tableSelected)"
        />

        <v-btn
          :disabled="tableSelected.length === 0"
          :title="t('MyClient.deleteSelected')"
          color="error"
          icon="mdi-delete"
          variant="text"
          @click="() => openDeleteDialog(tableSelected)"
        />

        <v-divider vertical class="mx-2" />

        <v-btn :title="t('MyClient.refresh')" color="green" icon="mdi-cached" variant="text" @click="loadTorrents" />

        <!-- auto-refresh controls -->
        <v-menu :close-on-content-click="false" location="bottom">
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              :color="autoRefreshRunning ? 'blue' : 'grey'"
              :icon="autoRefreshRunning ? 'mdi-timer' : 'mdi-timer-off-outline'"
              :title="t('MyClient.autoRefresh.btnTitle')"
              class="ml-1"
              variant="text"
            />
          </template>
          <v-card min-width="240" class="pa-2">
            <v-card-subtitle class="pa-1">{{ t("MyClient.autoRefresh.intervalLabel") }}</v-card-subtitle>
            <v-number-input
              v-model="globalRefreshInterval"
              :label="t('MyClient.autoRefresh.intervalUnit')"
              :min="0"
              :max="3600"
              control-variant="stacked"
              hide-details
              density="compact"
              class="ma-1"
            />
            <v-card-actions class="pa-1 pt-2">
              <v-btn
                :color="autoRefreshRunning ? 'error' : 'success'"
                :prepend-icon="autoRefreshRunning ? 'mdi-stop' : 'mdi-play'"
                :disabled="!autoRefreshRunning && globalRefreshInterval <= 0"
                block
                variant="tonal"
                @click="toggleAutoRefresh"
              >
                {{ autoRefreshRunning ? t("MyClient.autoRefresh.stop") : t("MyClient.autoRefresh.start") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <v-divider vertical class="mx-2" />

        <!-- column selector -->
        <v-combobox
          v-model="(configStore.tableBehavior['MyClient'] as any).columns"
          :items="fullTableHeader"
          :return-object="false"
          chips
          class="table-header-filter-clear ml-1"
          density="compact"
          hide-details
          item-value="key"
          max-width="200"
          multiple
          prepend-inner-icon="mdi-filter-cog"
          :title="t('MyClient.columnSelector')"
          @update:model-value="(v) => configStore.updateTableBehavior('MyClient', 'columns', v)"
        >
          <template #chip="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ item.title }}</span>
            </v-chip>
            <span v-if="index === 1" class="grey--text caption">
              (+{{ (configStore.tableBehavior["MyClient"] as any).columns!.length - 1 }})
            </span>
          </template>
        </v-combobox>

        <v-spacer />

        <v-text-field
          v-model="searchText"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          :label="t('MyClient.searchPlaceholder')"
          max-width="400"
          single-line
        />
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-data-table
        v-model="tableSelected"
        :headers="tableHeader"
        :items="filteredTorrents"
        :items-per-page="configStore.tableBehavior['MyClient']?.itemsPerPage ?? 25"
        :loading="loading"
        :multi-sort="configStore.enableTableMultiSort"
        :sort-by="configStore.tableBehavior['MyClient']?.sortBy"
        class="table-stripe table-header-no-wrap"
        hover
        return-object
        show-select
        @update:itemsPerPage="(v) => configStore.updateTableBehavior('MyClient', 'itemsPerPage', v)"
        @update:sortBy="(v) => configStore.updateTableBehavior('MyClient', 'sortBy', v)"
      >
        <!-- client column -->
        <template #item.clientId="{ item }">
          <div class="d-flex flex-column align-center">
            <v-avatar :image="clientIcon(item.clientId)" size="22" />
            <span class="text-caption text-no-wrap mt-1">{{ clientName(item.clientId) }}</span>
          </div>
        </template>

        <!-- name column -->
        <template #item.name="{ item }">
          <div>
            <span class="font-weight-medium">{{ item.name }}</span>
            <div v-if="item.label" class="text-caption text-grey">
              <v-icon size="x-small" icon="mdi-label-outline" /> {{ item.label }}
            </div>
          </div>
        </template>

        <!-- size column -->
        <template #item.totalSize="{ item }">
          <span class="text-no-wrap">{{ formatSize(item.totalSize) }}</span>
        </template>

        <!-- progress column -->
        <template #item.progress="{ item }">
          <v-progress-circular
            :model-value="item.progress"
            :size="36"
            :width="3"
            :color="item.isCompleted ? 'green' : 'blue'"
          >
            <span class="text-caption">{{ item.progress.toFixed(0) }}%</span>
          </v-progress-circular>
        </template>

        <!-- state column -->
        <template #item.state="{ item }">
          <TorrentStateTd :item="item" />
        </template>

        <!-- ratio column -->
        <template #item.ratio="{ item }">
          <span :class="item.ratio >= 1 ? 'text-green' : 'text-red'">
            {{ item.ratio.toFixed(2) }}
          </span>
        </template>

        <!-- upload speed -->
        <template #item.uploadSpeed="{ item }">
          <span v-if="item.uploadSpeed > 0" class="text-no-wrap text-green-darken-2">
            {{ formatSize(item.uploadSpeed) }}/s
          </span>
          <span v-else class="text-grey">-</span>
        </template>

        <!-- download speed -->
        <template #item.downloadSpeed="{ item }">
          <span v-if="item.downloadSpeed > 0" class="text-no-wrap text-blue-darken-2">
            {{ formatSize(item.downloadSpeed) }}/s
          </span>
          <span v-else class="text-grey">-</span>
        </template>

        <!-- total uploaded -->
        <template #item.totalUploaded="{ item }">
          <span class="text-no-wrap text-green-darken-2">{{ formatSize(item.totalUploaded) }}</span>
        </template>

        <!-- total downloaded -->
        <template #item.totalDownloaded="{ item }">
          <span class="text-no-wrap text-blue-darken-2">{{ formatSize(item.totalDownloaded) }}</span>
        </template>

        <!-- save path -->
        <template #item.savePath="{ item }">
          <span class="text-caption text-no-wrap">{{ item.savePath }}</span>
        </template>

        <!-- date added -->
        <template #item.dateAdded="{ item }">
          <span class="text-no-wrap text-caption">{{ formatDate(item.dateAdded * 1000) }}</span>
        </template>

        <!-- actions -->
        <template #item.action="{ item }">
          <v-btn-group class="table-action" density="compact" variant="plain">
            <v-btn
              v-if="item.state === CTorrentState.downloading || item.state === CTorrentState.seeding"
              :title="t('MyClient.action.pause')"
              color="warning"
              icon="mdi-pause"
              size="small"
              @click="() => pauseTorrents([item])"
            />
            <v-btn
              v-else-if="item.state === CTorrentState.paused || item.state === CTorrentState.error"
              :title="t('MyClient.action.resume')"
              color="success"
              icon="mdi-play"
              size="small"
              @click="() => resumeTorrents([item])"
            />

            <v-btn
              :title="t('MyClient.action.viewRaw')"
              color="grey"
              icon="mdi-code-json"
              size="small"
              @click="() => openRawDialog(item)"
            />

            <v-btn
              :title="t('MyClient.action.delete')"
              color="error"
              icon="mdi-delete"
              size="small"
              @click="() => openDeleteDialog([item])"
            />
          </v-btn-group>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <DeleteDialog
    v-model="showDeleteDialog"
    :to-delete-ids="toDeleteTorrents.map((t) => torrentKey(t))"
    :confirm-delete="confirmDeleteTorrent"
    @all-delete="loadTorrents"
  />

  <PushToDownloaderDialog v-model="showPushToDownloaderDialog" />

  <ClientStatusDialog v-model="showClientStatusDialog" />

  <!-- Raw JSON dialog -->
  <v-dialog v-model="showRawDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("MyClient.action.viewRaw") }}</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showRawDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-card-text class="pa-2">
        <pre class="text-body-2 raw-json-pre">{{ rawTorrent ? JSON.stringify(rawTorrent, null, 2) : "" }}</pre>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.raw-json-pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
