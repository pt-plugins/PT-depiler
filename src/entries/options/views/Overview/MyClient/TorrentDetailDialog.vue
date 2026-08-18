<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import type { CTorrent } from "@ptd/downloader";
import { sendMessage } from "@/messages.ts";
import { formatSize, formatDate } from "@/options/utils.ts";

import TorrentStateTd from "./TorrentStateTd.vue";

const showDialog = defineModel<boolean>();
const { torrent } = defineProps<{
  torrent: CTorrent | null;
}>();

const { t } = useI18n();

const trackers = ref<string[]>([]);
const trackersLoading = ref(false);
const trackersLoaded = ref(false);

async function loadTrackers() {
  if (!torrent || trackersLoaded.value) return;
  trackersLoading.value = true;
  try {
    trackers.value = await sendMessage("getClientTorrentTrackers", {
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

function resetDialog() {
  trackers.value = [];
  trackersLoaded.value = false;
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
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable @after-enter="loadTrackers" @after-leave="resetDialog">
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

      <v-card-text>
        <!-- 基本信息 -->
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
              <code class="text-caption">{{ torrent.infoHash }}</code>
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
                  <span class="text-grey text-caption ml-1">({{ formatTotal(torrent.totalUploaded) }})</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="red-darken-4" icon="mdi-chevron-down" />
                </template>
                <v-list-item-title>
                  {{ formatSpeed(torrent.downloadSpeed) }}
                  <span class="text-grey text-caption ml-1">({{ formatTotal(torrent.totalDownloaded) }})</span>
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
            <v-list-item-title class="text-caption">{{ torrent.savePath }}</v-list-item-title>
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

        <!-- Tracker 列表 -->
        <v-expansion-panels class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ t("MyClient.detail.trackers") }}
              <template #actions>
                <v-progress-circular v-if="trackersLoading" indeterminate size="18" width="2" class="ml-2" />
                <v-chip v-else-if="trackers.length > 0" size="small" color="info" class="ml-2">
                  {{ trackers.length }}
                </v-chip>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list v-if="trackers.length > 0" density="compact">
                <v-list-item v-for="(tracker, index) in trackers" :key="index">
                  <template #prepend>
                    <v-icon icon="mdi-radar" />
                  </template>
                  <v-list-item-title class="text-caption">{{ tracker }}</v-list-item-title>
                </v-list-item>
              </v-list>
              <v-alert v-else type="info" variant="tonal" density="compact">
                {{ t("MyClient.detail.noTrackers") }}
              </v-alert>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- 原始 JSON -->
          <v-expansion-panel>
            <v-expansion-panel-title>{{ t("MyClient.action.viewRaw") }}</v-expansion-panel-title>
            <v-expansion-panel-text>
              <pre class="text-body-2">{{ JSON.stringify(torrent, null, 2) }}</pre>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
