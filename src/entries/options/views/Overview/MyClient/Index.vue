<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import type { DataTableHeader } from "vuetify";

import {
  CTorrentState,
  getDownloaderIcon,
  getDownloaderMetaData,
  type CTorrent,
  type TorrentClientMetaData,
  type TorrentQueueDirection,
} from "@ptd/downloader";
import { sendMessage } from "@/messages.ts";
import { formatSize, formatDate } from "@/options/utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useConfigStore } from "@/options/stores/config.ts";

import DeleteDialog from "./DeleteDialog.vue";
import PushToDownloaderDialog from "./PushToDownloaderDialog.vue";
import TorrentStateTd from "./TorrentStateTd.vue";
import ClientStatusDialog from "./ClientStatusDialog.vue";
import TorrentDetailDialog from "./TorrentDetailDialog.vue";
import SpeedLimitDialog from "./SpeedLimitDialog.vue";
import LabelDialog from "./LabelDialog.vue";
import RecheckConfirmDialog from "./RecheckConfirmDialog.vue";

import {
  torrents,
  selectedDownloaderIds,
  autoRefreshRunning,
  globalRefreshInterval,
  useClientRefresh,
} from "./utils.ts";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();
const configStore = useConfigStore();

const {
  activeDownloaderIds,
  loadSingleDownloader,
  scheduleDownloaderRefresh,
  stopAllTimers,
  resetRefreshState,
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

// detail dialog
const showDetailDialog = ref(false);
const detailTorrent = ref<CTorrent | null>(null);

// speed limit dialog
const showSpeedLimitDialog = ref(false);

// label dialog
const showLabelDialog = ref(false);

// recheck confirm dialog
const showRecheckDialog = ref(false);
const toRecheckTorrents = ref<CTorrent[]>([]);

// client status dialog
const showClientStatusDialog = ref(false);

const totalUpSpeed = computed(() => allTorrents.value.reduce((acc, t) => acc + (t.uploadSpeed ?? 0), 0));
const totalDlSpeed = computed(() => allTorrents.value.reduce((acc, t) => acc + (t.downloadSpeed ?? 0), 0));

// ── computed ───────────────────────────────────────────────────────────────
const allTorrents = computed(() => Object.values(torrents.value).flat());

const filteredTorrents = computed(() => {
  const active = activeDownloaderIds.value;
  const base = active.flatMap((id) => torrents.value[id] ?? []);
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

// 当前选中种子的下载器类型对应的能力元数据（用于显示可用操作）
const clientMetaMap = ref<Record<string, TorrentClientMetaData>>({});

async function ensureClientMeta(clientId: string) {
  const type = metadataStore.downloaders[clientId]?.type;
  if (type && !clientMetaMap.value[type]) {
    clientMetaMap.value[type] = await getDownloaderMetaData(type);
  }
}

/** 判断某个 feature 在该下载器上是否可用 */
function isFeatureAllowed(clientId: string, feature: keyof TorrentClientMetaData["feature"]): boolean {
  const type = metadataStore.downloaders[clientId]?.type;
  return clientMetaMap.value[type]?.feature?.[feature]?.allowed !== false;
}

// 在表格渲染时按需加载选中/可见种子的客户端能力元数据
async function loadVisibleClientMeta() {
  const ids = new Set(allTorrents.value.map((t) => t.clientId));
  await Promise.all([...ids].map(ensureClientMeta));
}

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
    await Promise.allSettled(activeDownloaderIds.value.map((id) => loadSingleDownloader(id)));
  } finally {
    loading.value = false;
    await loadVisibleClientMeta();
    if (autoRefreshRunning.value) {
      for (const id of activeDownloaderIds.value) {
        scheduleDownloaderRefresh(id);
      }
    }
  }
}

onMounted(() => {
  // 支持从 SetDownloader 等页面通过 ?downloader=<id> 预选单个下载服务器
  const queryDownloaderId = route.query.downloader as string | undefined;
  if (queryDownloaderId && metadataStore.downloaders[queryDownloaderId]) {
    selectedDownloaderIds.value = [queryDownloaderId];
    // 预选是一次性导航行为，清除 URL query 避免刷新页面后重复预选
    void router.replace({ path: "/my-client" });
    loadTorrents();
  } else if (configStore.download.initDownloaderTorrentOnEnter) {
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
  const succeeded = results.filter((r) => r.status === "fulfilled" && Boolean(r.value)).length;
  runtimeStore.showSnakebar(t("MyClient.action.pauseSelectedSuccess", { count: succeeded }), { color: "success" });
  const affectedIds = [...new Set(torrents.map((t) => t.clientId))];
  await Promise.allSettled(affectedIds.map(loadSingleDownloader));
}

async function resumeTorrents(torrents: CTorrent[]) {
  if (torrents.length === 0) return;
  const results = await Promise.allSettled(
    torrents.map((t) => sendMessage("resumeClientTorrent", { downloaderId: t.clientId, id: t.id })),
  );
  const succeeded = results.filter((r) => r.status === "fulfilled" && Boolean(r.value)).length;
  runtimeStore.showSnakebar(t("MyClient.action.resumeSelectedSuccess", { count: succeeded }), { color: "success" });
  const affectedIds = [...new Set(torrents.map((t) => t.clientId))];
  await Promise.allSettled(affectedIds.map(loadSingleDownloader));
}

function openDeleteDialog(torrentList: CTorrent[]) {
  toDeleteTorrents.value = torrentList;
  showDeleteDialog.value = true;
}

function openDetailDialog(item: CTorrent) {
  detailTorrent.value = item;
  showDetailDialog.value = true;
}

function openRecheckDialog(torrentList: CTorrent[]) {
  if (torrentList.length === 0) return;
  toRecheckTorrents.value = torrentList;
  showRecheckDialog.value = true;
}

async function recheckTorrents() {
  const torrentList = toRecheckTorrents.value;
  if (torrentList.length === 0) return;
  const results = await Promise.allSettled(
    torrentList.map((t) => sendMessage("recheckClientTorrent", { downloaderId: t.clientId, id: t.id })),
  );
  const succeeded = results.filter((r) => r.status === "fulfilled" && Boolean(r.value)).length;
  runtimeStore.showSnakebar(t("MyClient.action.recheckSelectedSuccess", { count: succeeded }), {
    color: succeeded > 0 ? "success" : "error",
  });
  const affectedIds = [...new Set(torrentList.map((t) => t.clientId))];
  await Promise.allSettled(affectedIds.map(loadSingleDownloader));
}

async function moveTorrentsInQueue(torrentList: CTorrent[], direction: TorrentQueueDirection) {
  if (torrentList.length === 0) return;
  const results = await Promise.allSettled(
    torrentList.map((t) => sendMessage("moveClientTorrentInQueue", { downloaderId: t.clientId, id: t.id, direction })),
  );
  const succeeded = results.filter((r) => r.status === "fulfilled" && Boolean(r.value)).length;
  runtimeStore.showSnakebar(t("MyClient.action.moveQueueSuccess", { count: succeeded }), {
    color: succeeded > 0 ? "success" : "error",
  });
  const affectedIds = [...new Set(torrentList.map((t) => t.clientId))];
  await Promise.allSettled(affectedIds.map(loadSingleDownloader));
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

/** 清除下载器预选筛选（恢复显示全部下载器） */
function clearDownloaderFilter() {
  selectedDownloaderIds.value = [];
  void loadTorrents();
}

function torrentKey(torrent: CTorrent) {
  return `${torrent.clientId}:${String(torrent.id)}`;
}
</script>

<template>
  <v-alert :title="t('route.Overview.MyClient')" type="info">
    <template #append>
      <v-chip
        v-if="selectedDownloaderIds.length === 1"
        :prepend-avatar="clientIcon(selectedDownloaderIds[0])"
        class="mr-2"
        closable
        color="primary"
        label
        size="small"
        @click:close="clearDownloaderFilter"
      >
        {{ clientName(selectedDownloaderIds[0]) }}
      </v-chip>

      <v-btn
        :title="t('MyClient.clientStatusDialog.openBtn')"
        class="mr-2 status-btn"
        color="primary"
        size="small"
        @click="showClientStatusDialog = true"
      >
        <v-icon class="mr-1" icon="mdi-database-outline" size="x-small" />
        {{ allTorrents.length }}
        <v-icon class="mr-1" color="green-darken-4" icon="mdi-chevron-up" size="x-small" />
        {{ formatSize(totalUpSpeed) }}/s
        <v-icon class="mr-1" color="red-darken-4" icon="mdi-chevron-down" size="x-small" />
        {{ formatSize(totalDlSpeed) }}/s
      </v-btn>
    </template>
  </v-alert>

  <v-card>
    <v-card-title>
      <v-row gap="0" class="align-center ma-0">
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

        <v-btn
          :disabled="tableSelected.length === 0"
          :title="t('MyClient.recheckSelected')"
          color="cyan"
          icon="mdi-refresh"
          variant="text"
          @click="() => openRecheckDialog(tableSelected)"
        />

        <v-btn
          :disabled="tableSelected.length === 0"
          :title="t('MyClient.speedLimit.batchBtn')"
          color="amber"
          icon="mdi-speedometer"
          variant="text"
          @click="showSpeedLimitDialog = true"
        />

        <v-btn
          :disabled="tableSelected.length === 0"
          :title="t('MyClient.label.batchBtn')"
          color="purple"
          icon="mdi-label"
          variant="text"
          @click="showLabelDialog = true"
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
            <span v-if="index === 1" class="text-grey text-body-small">
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
        class="table-stripe table-header-no-wrap table-td-p4"
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
            <span class="text-body-small text-no-wrap mt-1">{{ clientName(item.clientId) }}</span>
          </div>
        </template>

        <!-- name column -->
        <template #item.name="{ item }">
          <div>
            <span class="font-weight-medium">{{ item.name }}</span>
            <div v-if="item.label" class="text-body-small text-grey">
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
            <span class="text-body-small">{{ item.progress.toFixed(0) }}%</span>
          </v-progress-circular>
        </template>

        <!-- state column -->
        <template #item.state="{ item }">
          <TorrentStateTd :item="item" />
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

        <!-- ratio column -->
        <template #item.ratio="{ item }">
          <span :class="item.ratio >= 1 ? 'text-green' : 'text-red'">
            {{ item.ratio.toFixed(2) }}
          </span>
        </template>

        <!-- save path -->
        <template #item.savePath="{ item }">
          <span class="text-body-small text-no-wrap">{{ item.savePath }}</span>
        </template>

        <!-- date added -->
        <template #item.dateAdded="{ item }">
          <span class="text-no-wrap text-body-small">{{ formatDate(item.dateAdded * 1000) }}</span>
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

            <!-- 重新校验 -->
            <v-btn
              v-if="isFeatureAllowed(item.clientId, 'Recheck')"
              :title="t('MyClient.action.recheck')"
              color="cyan"
              icon="mdi-refresh"
              size="small"
              @click="() => openRecheckDialog([item])"
            />

            <!-- 队列调整 -->
            <v-menu location="bottom">
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-if="isFeatureAllowed(item.clientId, 'Queue')"
                  v-bind="menuProps"
                  :title="t('MyClient.action.queue')"
                  color="orange"
                  icon="mdi-swap-vertical"
                  size="small"
                />
              </template>
              <v-list density="compact">
                <v-list-item
                  :title="t('MyClient.action.queueTop')"
                  prepend-icon="mdi-chevron-double-up"
                  @click="() => moveTorrentsInQueue([item], 'top')"
                />
                <v-list-item
                  :title="t('MyClient.action.queueUp')"
                  prepend-icon="mdi-chevron-up"
                  @click="() => moveTorrentsInQueue([item], 'up')"
                />
                <v-list-item
                  :title="t('MyClient.action.queueDown')"
                  prepend-icon="mdi-chevron-down"
                  @click="() => moveTorrentsInQueue([item], 'down')"
                />
                <v-list-item
                  :title="t('MyClient.action.queueBottom')"
                  prepend-icon="mdi-chevron-double-down"
                  @click="() => moveTorrentsInQueue([item], 'bottom')"
                />
              </v-list>
            </v-menu>

            <!-- 详情 -->
            <v-btn
              :title="t('MyClient.action.detail')"
              color="grey"
              icon="mdi-file-eye-outline"
              size="small"
              @click="() => openDetailDialog(item)"
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

  <TorrentDetailDialog v-model="showDetailDialog" :torrent="detailTorrent" />

  <SpeedLimitDialog v-model="showSpeedLimitDialog" :torrents="tableSelected" />

  <LabelDialog v-model="showLabelDialog" :torrents="tableSelected" />

  <RecheckConfirmDialog
    v-model="showRecheckDialog"
    :torrent-count="toRecheckTorrents.length"
    :confirm-fn="recheckTorrents"
  />
</template>

<style scoped lang="scss">
.table-td-p4 :deep(.v-data-table__td) {
  padding: 0 4px;
}
</style>
