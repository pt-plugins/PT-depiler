<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import type {
  CTorrent,
  CTorrentFile,
  CTorrentPeer,
  CTorrentTracker,
  CTrackerState,
  TorrentClientMetaData,
  TorrentFilePriority,
} from "@ptd/downloader";
import { sendMessage } from "@/messages.ts";
import { formatSize, formatDate } from "@/options/utils.ts";

import TorrentStateTd from "./TorrentStateTd.vue";

const showDialog = defineModel<boolean>();
const { torrent } = defineProps<{
  torrent: CTorrent | null;
}>();

const { t } = useI18n();

const activeTab = ref<string>("info");

// 下载器能力元数据（feature 声明）
const metaData = ref<TorrentClientMetaData | null>(null);

// 文件
const files = ref<CTorrentFile[]>([]);
const filesLoading = ref(false);
const filesLoaded = ref(false);

// peers
const peers = ref<CTorrentPeer[]>([]);
const peersLoading = ref(false);
const peersLoaded = ref(false);

// trackers
const trackers = ref<CTorrentTracker[]>([]);
const trackersLoading = ref(false);
const trackersLoaded = ref(false);
const trackerInput = ref("");

const priorityItems: Array<{ title: string; value: TorrentFilePriority }> = [
  { title: t("MyClient.detail.prioritySkip"), value: "skip" },
  { title: t("MyClient.detail.priorityLow"), value: "low" },
  { title: t("MyClient.detail.priorityNormal"), value: "normal" },
  { title: t("MyClient.detail.priorityHigh"), value: "high" },
  { title: t("MyClient.detail.priorityHighest"), value: "highest" },
];

const trackerStatusIcon: Record<CTrackerState, string> = {
  unknown: "mdi-help-circle-outline",
  working: "mdi-check-circle",
  updating: "mdi-sync",
  disabled: "mdi-cancel",
  error: "mdi-alert-circle",
};

function featureAllowed(feature: keyof NonNullable<TorrentClientMetaData["feature"]>): boolean {
  return metaData.value?.feature?.[feature]?.allowed ?? false;
}

async function loadMetaData() {
  if (!torrent || metaData.value) return;
  try {
    metaData.value = (await sendMessage("getDownloaderMetaData", torrent.clientId)) ?? null;
  } catch {
    metaData.value = null;
  }
}

async function loadFiles() {
  if (!torrent || filesLoaded.value) return;
  filesLoading.value = true;
  try {
    files.value = await sendMessage("getClientTorrentFiles", { downloaderId: torrent.clientId, torrent });
    filesLoaded.value = true;
  } catch {
    files.value = [];
  } finally {
    filesLoading.value = false;
  }
}

async function updateFilePriority(file: CTorrentFile, priority: TorrentFilePriority | null) {
  if (!torrent || !priority || priority === file.priority) return;
  try {
    const ok = await sendMessage("setClientTorrentFilePriority", {
      downloaderId: torrent.clientId,
      torrent,
      selections: [{ index: file.index, priority }],
    });
    if (ok) {
      file.priority = priority;
      file.wanted = priority !== "skip";
    }
  } catch {
    // 静默失败，优先级保持原值
  }
}

async function loadPeers() {
  if (!torrent || peersLoaded.value) return;
  peersLoading.value = true;
  try {
    peers.value = await sendMessage("getClientTorrentPeers", { downloaderId: torrent.clientId, torrent });
    peersLoaded.value = true;
  } catch {
    peers.value = [];
  } finally {
    peersLoading.value = false;
  }
}

async function loadTrackers() {
  if (!torrent || trackersLoaded.value) return;
  trackersLoading.value = true;
  try {
    trackers.value = await sendMessage("getClientTorrentTrackersDetail", {
      downloaderId: torrent.clientId,
      torrent,
    });
    trackersLoaded.value = true;
  } catch {
    trackers.value = [];
  } finally {
    trackersLoading.value = false;
  }
}

async function addTracker() {
  if (!torrent || !trackerInput.value.trim()) return;
  const url = trackerInput.value.trim();
  try {
    const ok = await sendMessage("addClientTorrentTracker", { downloaderId: torrent.clientId, torrent, url });
    if (ok) {
      trackers.value = await sendMessage("getClientTorrentTrackersDetail", {
        downloaderId: torrent.clientId,
        torrent,
      });
      trackerInput.value = "";
    }
  } catch {
    // 静默失败
  }
}

async function removeTracker(tracker: CTorrentTracker) {
  if (!torrent) return;
  try {
    const ok = await sendMessage("removeClientTorrentTracker", {
      downloaderId: torrent.clientId,
      torrent,
      url: tracker.url,
    });
    if (ok) {
      trackers.value = await sendMessage("getClientTorrentTrackersDetail", {
        downloaderId: torrent.clientId,
        torrent,
      });
    }
  } catch {
    // 静默失败
  }
}

function resetDialog() {
  activeTab.value = "info";
  metaData.value = null;
  files.value = [];
  filesLoaded.value = false;
  peers.value = [];
  peersLoaded.value = false;
  trackers.value = [];
  trackersLoaded.value = false;
  trackerInput.value = "";
}

async function afterEnter() {
  await loadMetaData();
  // Tracker 列表最常被查看，随对话框打开预加载；文件/peers 在首次切换到对应 tab 时加载
  await loadTrackers();
}

function onTabChange(value: string | null | undefined) {
  if (value === "files") {
    loadFiles();
  } else if (value === "peers") {
    loadPeers();
  }
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

function magnetLink(torrent: CTorrent): string {
  return `magnet:?xt=urn:btih:${torrent.infoHash}&dn=${encodeURIComponent(torrent.name)}`;
}

/** 格式化速度：0 / undefined 显示 "-"（避免 filesize(undefined) 抛错渲染为空） */
function formatSpeed(speed: number | undefined): string {
  return speed && speed > 0 ? `${formatSize(speed)}/s` : "-";
}

/** 格式化总量：undefined 显示 "-"，0 显示 "0 B" */
function formatTotal(total: number | undefined): string {
  return typeof total === "number" ? (formatSize(total) as string) : "-";
}

/** 格式化时间戳（秒）：undefined 显示 "-" */
function formatTimestamp(timestamp: number | undefined): string {
  return typeof timestamp === "number" && timestamp > 0 ? formatDate(timestamp * 1000) : "-";
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="900" scrollable @after-enter="afterEnter" @after-leave="resetDialog">
    <v-card v-if="torrent">
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("MyClient.detail.title") }}</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>

      <v-divider />

      <v-tabs v-model="activeTab" grow @update:model-value="onTabChange">
        <v-tab value="info">{{ t("MyClient.detail.title") }}</v-tab>
        <v-tab v-if="featureAllowed('FileList')" value="files">{{ t("MyClient.detail.fileTitle") }}</v-tab>
        <v-tab v-if="featureAllowed('PeerList')" value="peers">{{ t("MyClient.detail.peersTitle") }}</v-tab>
        <v-tab v-if="featureAllowed('TrackerList')" value="trackers">{{ t("MyClient.detail.trackers") }}</v-tab>
      </v-tabs>

      <v-tabs-window v-model="activeTab" class="border-t-thin">
        <!-- 基本信息 -->
        <v-tabs-window-item value="info">
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-file-document-outline" />
                </template>
                <v-list-item-title class="font-weight-bold">{{ torrent.name }}</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-key-variant" />
                </template>
                <v-list-item-title class="d-flex align-center ga-2">
                  <code class="text-body-small">{{ torrent.infoHash }}</code>
                  <v-btn
                    :title="t('MyClient.detail.copyHash')"
                    icon="mdi-content-copy"
                    size="x-small"
                    variant="text"
                    @click="copyToClipboard(torrent.infoHash)"
                  />
                  <v-btn
                    :title="t('MyClient.detail.copyMagnet')"
                    icon="mdi-magnet"
                    size="x-small"
                    variant="text"
                    @click="copyToClipboard(magnetLink(torrent))"
                  />
                </v-list-item-title>
              </v-list-item>

              <v-divider />

              <v-row class="ma-0">
                <v-col cols="6">
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-state-machine" />
                    </template>
                    <v-list-item-title>
                      <TorrentStateTd :item="torrent" />
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-progress-check" />
                    </template>
                    <v-list-item-title> {{ torrent.progress.toFixed(2) }}% </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-database" />
                    </template>
                    <v-list-item-title>
                      {{ formatSize(torrent.totalSize) }}
                    </v-list-item-title>
                  </v-list-item>
                </v-col>
                <v-col cols="6">
                  <v-list-item>
                    <template #prepend>
                      <v-icon color="green-darken-4" icon="mdi-chevron-up" />
                    </template>
                    <v-list-item-title>
                      {{ formatSpeed(torrent.uploadSpeed) }}
                      <span class="text-grey text-body-small ml-1">({{ formatTotal(torrent.totalUploaded) }})</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon color="red-darken-4" icon="mdi-chevron-down" />
                    </template>
                    <v-list-item-title>
                      {{ formatSpeed(torrent.downloadSpeed) }}
                      <span class="text-grey text-body-small ml-1">({{ formatTotal(torrent.totalDownloaded) }})</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-chart-line" />
                    </template>
                    <v-list-item-title>
                      <span :class="torrent.ratio >= 1 ? 'text-green' : 'text-red'">
                        {{ torrent.ratio.toFixed(2) }}
                      </span>
                    </v-list-item-title>
                  </v-list-item>
                </v-col>
              </v-row>

              <v-divider />

              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-folder" />
                </template>
                <v-list-item-title class="text-body-small">{{ torrent.savePath }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-label-outline" />
                </template>
                <v-list-item-title>{{ torrent.label || "-" }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-calendar-plus" />
                </template>
                <v-list-item-title>{{ formatDate(torrent.dateAdded * 1000) }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-expansion-panels class="mt-4">
              <v-expansion-panel>
                <v-expansion-panel-title>{{ t("MyClient.action.viewRaw") }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <pre class="text-body-medium">{{ JSON.stringify(torrent, null, 2) }}</pre>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-tabs-window-item>

        <!-- 文件管理 -->
        <v-tabs-window-item value="files">
          <v-card-text>
            <div v-if="filesLoading" class="text-center py-4">
              <v-progress-circular indeterminate size="28" width="2" />
            </div>
            <v-table v-else-if="files.length > 0" density="compact">
              <thead>
                <tr>
                  <th>{{ t("MyClient.detail.fileColumnName") }}</th>
                  <th class="text-end">{{ t("MyClient.detail.fileColumnSize") }}</th>
                  <th class="text-end">{{ t("MyClient.detail.fileColumnProgress") }}</th>
                  <th class="text-end" style="width: 150px">{{ t("MyClient.detail.fileColumnPriority") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="file in files" :key="file.index">
                  <td class="text-body-small">{{ file.path }}</td>
                  <td class="text-end text-body-small">{{ formatSize(file.size) }}</td>
                  <td class="text-end text-body-small">{{ file.progress.toFixed(1) }}%</td>
                  <td class="text-end">
                    <v-select
                      v-if="featureAllowed('FilePriority')"
                      :model-value="file.priority"
                      :items="priorityItems"
                      density="compact"
                      hide-details
                      variant="outlined"
                      @update:model-value="(value) => updateFilePriority(file, value)"
                    />
                    <span v-else class="text-body-small">{{ file.priority }}</span>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-alert v-else type="info" variant="tonal" density="compact">
              {{ t("MyClient.detail.noFiles") }}
            </v-alert>
          </v-card-text>
        </v-tabs-window-item>

        <!-- Peers -->
        <v-tabs-window-item value="peers">
          <v-card-text>
            <div v-if="peersLoading" class="text-center py-4">
              <v-progress-circular indeterminate size="28" width="2" />
            </div>
            <v-table v-else-if="peers.length > 0" density="compact">
              <thead>
                <tr>
                  <th>{{ t("MyClient.detail.peersColumnIp") }}</th>
                  <th>{{ t("MyClient.detail.peersColumnClient") }}</th>
                  <th class="text-end">{{ t("MyClient.detail.peersColumnProgress") }}</th>
                  <th class="text-end">{{ t("MyClient.detail.peersColumnDownloadSpeed") }}</th>
                  <th class="text-end">{{ t("MyClient.detail.peersColumnUploadSpeed") }}</th>
                  <th class="text-center">{{ t("MyClient.detail.peersColumnEncrypted") }}</th>
                  <th class="text-center">{{ t("MyClient.detail.peersColumnCountry") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(peer, index) in peers" :key="`${peer.ip}-${index}`">
                  <td class="text-body-small">{{ peer.ip }}</td>
                  <td class="text-body-small">{{ peer.client || "-" }}</td>
                  <td class="text-end text-body-small">{{ peer.progress.toFixed(1) }}%</td>
                  <td class="text-end text-body-small">{{ formatSize(peer.downloadSpeed) }}/s</td>
                  <td class="text-end text-body-small">{{ formatSize(peer.uploadSpeed) }}/s</td>
                  <td class="text-center">
                    <v-icon v-if="peer.encrypted" icon="mdi-lock" size="small" />
                    <span v-else>-</span>
                  </td>
                  <td class="text-center text-body-small">{{ peer.country || "-" }}</td>
                </tr>
              </tbody>
            </v-table>
            <v-alert v-else type="info" variant="tonal" density="compact">
              {{ t("MyClient.detail.noPeers") }}
            </v-alert>
          </v-card-text>
        </v-tabs-window-item>

        <!-- Tracker 管理 -->
        <v-tabs-window-item value="trackers">
          <v-card-text>
            <v-row class="mb-2" align="center">
              <v-col>
                <v-text-field
                  v-model="trackerInput"
                  :label="t('MyClient.detail.addTrackerTitle')"
                  density="compact"
                  hide-details
                  variant="outlined"
                  @keyup.enter="addTracker"
                />
              </v-col>
              <v-col class="col-auto" style="flex: none">
                <v-btn :disabled="!trackerInput.trim()" color="primary" variant="tonal" @click="addTracker">
                  {{ t("MyClient.detail.addTrackerTitle") }}
                </v-btn>
              </v-col>
            </v-row>

            <div v-if="trackersLoading" class="text-center py-4">
              <v-progress-circular indeterminate size="28" width="2" />
            </div>
            <v-table v-else-if="trackers.length > 0" density="compact">
              <thead>
                <tr>
                  <th>{{ t("MyClient.detail.trackerColumnUrl") }}</th>
                  <th class="text-center" style="width: 80px">{{ t("MyClient.detail.trackerColumnTier") }}</th>
                  <th class="text-center" style="width: 90px">{{ t("MyClient.detail.trackerColumnStatus") }}</th>
                  <th class="text-end" style="width: 90px">{{ t("MyClient.detail.trackerColumnSeeds") }}</th>
                  <th class="text-end" style="width: 90px">{{ t("MyClient.detail.trackerColumnLeeches") }}</th>
                  <th style="width: 140px">{{ t("MyClient.detail.trackerColumnLastAnnounce") }}</th>
                  <th v-if="featureAllowed('TrackerManage')" class="text-center" style="width: 70px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tracker in trackers" :key="tracker.url">
                  <td class="text-body-small">{{ tracker.url }}</td>
                  <td class="text-center text-body-small">{{ tracker.tier }}</td>
                  <td class="text-center">
                    <v-icon :icon="trackerStatusIcon[tracker.status]" size="small" />
                  </td>
                  <td class="text-end text-body-small">{{ tracker.seeds ?? "-" }}</td>
                  <td class="text-end text-body-small">{{ tracker.leeches ?? "-" }}</td>
                  <td class="text-body-small">{{ formatTimestamp(tracker.lastAnnounce) }}</td>
                  <td v-if="featureAllowed('TrackerManage')" class="text-center">
                    <v-btn
                      :title="t('MyClient.detail.removeTracker')"
                      icon="mdi-delete"
                      size="x-small"
                      variant="text"
                      @click="removeTracker(tracker)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-alert v-else type="info" variant="tonal" density="compact">
              {{ t("MyClient.detail.noTrackers") }}
            </v-alert>
          </v-card-text>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
