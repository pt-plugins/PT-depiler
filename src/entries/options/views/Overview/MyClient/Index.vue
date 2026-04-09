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

import NavButton from "@/options/components/NavButton.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";

const { t } = useI18n();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();
const configStore = useConfigStore();

// ── state ──────────────────────────────────────────────────────────────────
const loading = ref(false);
const torrents = ref<CTorrent[]>([]);
const tableSelected = ref<string[]>([]);
const searchText = ref("");

// which downloader chips are selected (empty = all)
const selectedDownloaderIds = ref<string[]>([]);

// delete dialog
const showDeleteDialog = ref(false);
const deleteWithData = ref(false);
const toDeleteTorrents = ref<CTorrent[]>([]);

// ── auto-refresh ───────────────────────────────────────────────────────────
/** Global refresh interval in seconds (0 = off). Not persisted intentionally. */
const globalRefreshInterval = ref(0);

/** Whether auto-refresh is currently running */
const autoRefreshRunning = ref(false);

/** Per-downloader setTimeout IDs */
const refreshTimers = new Map<string, number>();

/** Per-downloader consecutive failure counts */
const failCounts = new Map<string, number>();

/** Downloaders whose auto-refresh has been suspended due to ≥3 consecutive failures */
const suspendedDownloaders = ref(new Set<string>());

// ── computed ───────────────────────────────────────────────────────────────
const enabledDownloaders = computed(() => metadataStore.getEnabledDownloaders);

const activeDownloaderIds = computed(() =>
  selectedDownloaderIds.value.length > 0
    ? selectedDownloaderIds.value
    : enabledDownloaders.value.map((d) => d.id),
);

const filteredTorrents = computed(() => {
  if (!searchText.value) return torrents.value;
  const q = searchText.value.toLowerCase();
  return torrents.value.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.infoHash.toLowerCase().includes(q) ||
      (t.label ?? "").toLowerCase().includes(q) ||
      t.savePath.toLowerCase().includes(q),
  );
});

// ── table headers ─────────────────────────────────────────────────────────
const tableHeader = computed(
  () =>
    [
      { title: t("MyClient.table.client"), key: "clientId", align: "center", width: "120" },
      { title: t("MyClient.table.name"), key: "name", align: "start", minWidth: "20rem" },
      { title: t("MyClient.table.size"), key: "totalSize", align: "end", width: "110" },
      { title: t("MyClient.table.progress"), key: "progress", align: "end", width: "90" },
      { title: t("MyClient.table.status"), key: "state", align: "center", width: "110" },
      { title: t("MyClient.table.ratio"), key: "ratio", align: "end", width: "80" },
      { title: t("MyClient.table.upSpeed"), key: "uploadSpeed", align: "end", width: "100" },
      { title: t("MyClient.table.dlSpeed"), key: "downloadSpeed", align: "end", width: "100" },
      { title: t("MyClient.table.savePath"), key: "savePath", align: "start" },
      { title: t("MyClient.table.addedAt"), key: "dateAdded", align: "center", width: "160" },
      { title: t("common.action"), key: "action", align: "center", sortable: false, width: "120" },
    ] as DataTableHeader[],
);

// ── state chip display map ────────────────────────────────────────────────
const stateDisplay: Record<CTorrentState, { color: string; icon: string; label: string }> = {
  [CTorrentState.downloading]: { color: "blue", icon: "mdi-download", label: "MyClient.state.downloading" },
  [CTorrentState.seeding]: { color: "green", icon: "mdi-upload", label: "MyClient.state.seeding" },
  [CTorrentState.paused]: { color: "grey", icon: "mdi-pause", label: "MyClient.state.paused" },
  [CTorrentState.queued]: { color: "orange", icon: "mdi-clock-outline", label: "MyClient.state.queued" },
  [CTorrentState.checking]: { color: "cyan", icon: "mdi-refresh", label: "MyClient.state.checking" },
  [CTorrentState.error]: { color: "red", icon: "mdi-alert-circle", label: "MyClient.state.error" },
  [CTorrentState.unknown]: { color: "grey", icon: "mdi-help-circle", label: "MyClient.state.unknown" },
};

// ── per-downloader helpers ────────────────────────────────────────────────
/** Fetch torrents for a single downloader and merge into `torrents`. */
async function loadSingleDownloader(id: string): Promise<void> {
  try {
    const result = await sendMessage("getClientTorrents", id);
    // Replace only the entries belonging to this client
    torrents.value = [...torrents.value.filter((t) => t.clientId !== id), ...result];
    failCounts.set(id, 0);
  } catch {
    const prev = failCounts.get(id) ?? 0;
    const next = prev + 1;
    failCounts.set(id, next);
    if (next >= 3) {
      suspendedDownloaders.value = new Set([...suspendedDownloaders.value, id]);
      clearDownloaderTimer(id);
      runtimeStore.showSnakebar(
        t("MyClient.autoRefresh.clientSuspended", { name: clientName(id) }),
        { color: "error", timeout: 8000 },
      );
    }
  }
}

function clearDownloaderTimer(id: string) {
  const tid = refreshTimers.get(id);
  if (tid) {
    clearTimeout(tid);
    refreshTimers.delete(id);
  }
}

/** Schedule the next auto-refresh tick for a downloader. */
function scheduleDownloaderRefresh(id: string) {
  if (!autoRefreshRunning.value) return;
  if (suspendedDownloaders.value.has(id)) return;
  if (globalRefreshInterval.value <= 0) return;

  clearDownloaderTimer(id);
  const tid = setTimeout(async () => {
    await loadSingleDownloader(id);
    scheduleDownloaderRefresh(id);
  }, globalRefreshInterval.value * 1000) as unknown as number;
  refreshTimers.set(id, tid);
}

function stopAllTimers() {
  for (const id of refreshTimers.keys()) {
    clearDownloaderTimer(id);
  }
  autoRefreshRunning.value = false;
}

// ── data loading ──────────────────────────────────────────────────────────
/** Manual full refresh: fetch all active downloaders, reset error state. */
async function loadTorrents() {
  loading.value = true;
  tableSelected.value = [];
  // Reset failure state for all previously suspended downloaders
  suspendedDownloaders.value = new Set();
  failCounts.clear();
  try {
    const results = await Promise.allSettled(
      activeDownloaderIds.value.map((id) => sendMessage("getClientTorrents", id)),
    );
    torrents.value = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  } finally {
    loading.value = false;
    // Restart per-downloader timers if auto-refresh is running
    if (autoRefreshRunning.value) {
      for (const id of activeDownloaderIds.value) {
        scheduleDownloaderRefresh(id);
      }
    }
  }
}

/** Start auto-refresh for all active downloaders. */
function startAutoRefresh() {
  if (globalRefreshInterval.value <= 0) return;
  autoRefreshRunning.value = true;
  for (const id of activeDownloaderIds.value) {
    scheduleDownloaderRefresh(id);
  }
}

/** Stop all auto-refresh timers and clear suspended state. */
function stopAutoRefresh() {
  stopAllTimers();
  suspendedDownloaders.value = new Set();
  failCounts.clear();
}

/** Toggle auto-refresh on/off. */
function toggleAutoRefresh() {
  if (autoRefreshRunning.value) {
    stopAutoRefresh();
  } else {
    startAutoRefresh();
  }
}

/** Resume a specific suspended downloader. */
function resumeDownloaderRefresh(id: string) {
  suspendedDownloaders.value = new Set([...suspendedDownloaders.value].filter((x) => x !== id));
  failCounts.set(id, 0);
  if (autoRefreshRunning.value) {
    scheduleDownloaderRefresh(id);
  }
}

onMounted(loadTorrents);

onUnmounted(() => {
  stopAllTimers();
});

// ── actions ───────────────────────────────────────────────────────────────
async function pauseTorrent(torrent: CTorrent) {
  try {
    await sendMessage("pauseClientTorrent", { downloaderId: torrent.clientId, id: torrent.id });
    runtimeStore.showSnakebar(t("MyClient.action.pauseSuccess"), { color: "success" });
    await loadSingleDownloader(torrent.clientId);
  } catch {
    runtimeStore.showSnakebar(t("MyClient.action.pauseError"), { color: "error" });
  }
}

async function resumeTorrent(torrent: CTorrent) {
  try {
    await sendMessage("resumeClientTorrent", { downloaderId: torrent.clientId, id: torrent.id });
    runtimeStore.showSnakebar(t("MyClient.action.resumeSuccess"), { color: "success" });
    await loadSingleDownloader(torrent.clientId);
  } catch {
    runtimeStore.showSnakebar(t("MyClient.action.resumeError"), { color: "error" });
  }
}

function openDeleteDialog(torrentList: CTorrent[], withData = false) {
  toDeleteTorrents.value = torrentList;
  deleteWithData.value = withData;
  showDeleteDialog.value = true;
}

function openDeleteSelected(withData = false) {
  const selected = torrents.value.filter((t) => tableSelected.value.includes(torrentKey(t)));
  openDeleteDialog(selected, withData);
}

// Called per-item by DeleteDialog
async function confirmDeleteTorrent(torrentKey_: string): Promise<void> {
  const torrent = toDeleteTorrents.value.find((t) => torrentKey(t) === torrentKey_);
  if (!torrent) return;
  await sendMessage("deleteClientTorrent", {
    downloaderId: torrent.clientId,
    id: torrent.id,
    removeData: deleteWithData.value,
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
  <v-alert :title="t('route.Overview.MyClient')" type="info" />

  <v-card>
    <v-card-title>
      <v-row class="ma-0" align="center">
        <!-- downloader filter chips -->
        <v-chip-group v-model="selectedDownloaderIds" multiple class="mr-2" column>
          <v-chip
            v-for="d in enabledDownloaders"
            :key="d.id"
            :value="d.id"
            filter
            variant="outlined"
            size="small"
            :color="suspendedDownloaders.has(d.id) ? 'error' : undefined"
          >
            <v-avatar :image="clientIcon(d.id)" start size="18" />
            {{ d.name }}
            <v-tooltip v-if="suspendedDownloaders.has(d.id)" activator="parent" location="bottom">
              {{ t("MyClient.autoRefresh.suspendedTip") }}
            </v-tooltip>
            <v-icon
              v-if="suspendedDownloaders.has(d.id)"
              end
              icon="mdi-alert-circle"
              color="error"
              size="x-small"
              @click.stop="resumeDownloaderRefresh(d.id)"
            />
          </v-chip>
        </v-chip-group>

        <v-divider vertical class="mx-2" />

        <NavButton color="green" icon="mdi-cached" :text="t('MyClient.refresh')" @click="loadTorrents" />

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

        <NavButton
          :disabled="tableSelected.length === 0"
          color="error"
          icon="mdi-delete"
          :text="t('MyClient.deleteSelected')"
          @click="openDeleteSelected(false)"
        />

        <NavButton
          :disabled="tableSelected.length === 0"
          color="error"
          icon="mdi-delete-forever"
          :text="t('MyClient.deleteSelectedWithData')"
          @click="openDeleteSelected(true)"
        />

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
        :loading="loading"
        :items-per-page="configStore.tableBehavior['MyClient']?.itemsPerPage ?? 25"
        :multi-sort="configStore.enableTableMultiSort"
        :sort-by="configStore.tableBehavior['MyClient']?.sortBy"
        :item-value="(item: CTorrent) => torrentKey(item)"
        class="table-stripe table-header-no-wrap"
        hover
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
          <v-chip
            :color="stateDisplay[item.state]?.color ?? 'grey'"
            :prepend-icon="stateDisplay[item.state]?.icon"
            size="small"
            label
          >
            {{ t(stateDisplay[item.state]?.label ?? 'MyClient.state.unknown') }}
          </v-chip>
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
              @click="pauseTorrent(item)"
            />
            <v-btn
              v-else-if="item.state === CTorrentState.paused || item.state === CTorrentState.error"
              :title="t('MyClient.action.resume')"
              color="success"
              icon="mdi-play"
              size="small"
              @click="resumeTorrent(item)"
            />

            <v-btn
              :title="t('MyClient.action.delete')"
              color="error"
              icon="mdi-delete"
              size="small"
              @click="openDeleteDialog([item], false)"
            />
            <v-btn
              :title="t('MyClient.action.deleteWithData')"
              color="error"
              icon="mdi-delete-forever"
              size="small"
              @click="openDeleteDialog([item], true)"
            />
          </v-btn-group>
        </template>

        <template #no-data>
          <v-alert type="info" variant="tonal">{{ t("MyClient.emptyNotice") }}</v-alert>
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
</template>

<style scoped lang="scss"></style>

