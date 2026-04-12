<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { getDownloaderIcon, type TorrentClientStatus } from "@ptd/downloader";
import { sendMessage } from "@/messages.ts";
import { formatSize } from "@/options/utils.ts";

import { torrents, selectedDownloaderIds, suspendedDownloaders, useClientRefresh } from "./utils.ts";

const showDialog = defineModel<boolean>();

const { t } = useI18n();
const { enabledDownloaders, resumeDownloaderRefresh } = useClientRefresh();

const clientStatuses = ref<Record<string, TorrentClientStatus>>({});
const clientVersions = ref<Record<string, string>>({});
const clientLoading = ref<Record<string, boolean>>({});

/** Returns true when the downloader's torrents are included in the current filter. */
function isDownloaderActive(id: string) {
  return selectedDownloaderIds.value.length === 0 || selectedDownloaderIds.value.includes(id);
}

/** Toggle a downloader in/out of the torrent filter. */
function toggleDownloaderFilter(id: string) {
  const idx = selectedDownloaderIds.value.indexOf(id);
  if (idx >= 0) {
    selectedDownloaderIds.value.splice(idx, 1);
  } else {
    selectedDownloaderIds.value.push(id);
  }
}

function torrentCountFor(id: string) {
  return (torrents.value[id] ?? []).length;
}

function formatSizeOrDash(v: number | undefined): string {
  return typeof v !== "undefined" ? (formatSize(v) as string) : "-";
}

async function fetchStatusFor(id: string) {
  clientLoading.value[id] = true;
  try {
    // client version 只获取一次即可
    if (typeof clientVersions.value[id] === "undefined") {
      clientVersions.value[id] = (await sendMessage("getDownloaderVersion", id)) ?? "—";
    }

    const status = await sendMessage("getDownloaderStatus", id);
    if (status) clientStatuses.value[id] = status;
  } finally {
    clientLoading.value[id] = false;
  }
}

function suspendedDownloader(id: string) {
  suspendedDownloaders.value.add(id);
}

async function fetchAll() {
  await Promise.allSettled(enabledDownloaders.value.map((d) => fetchStatusFor(d.id)));
}

watch(showDialog, (v) => {
  if (v) fetchAll();
});
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("MyClient.clientStatusDialog.title") }}</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-refresh" :title="t('MyClient.refresh')" @click="fetchAll" />
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="d in enabledDownloaders"
            :key="d.id"
            :active="isDownloaderActive(d.id)"
            color="primary"
            rounded
            @click="toggleDownloaderFilter(d.id)"
          >
            <template #prepend>
              <v-avatar :image="getDownloaderIcon(d.type)" size="32" class="mr-2" />
            </template>

            <v-list-item-title class="font-weight-bold">
              {{ d.name }}
              <span v-if="clientVersions[d.id]" class="ml-2 text-caption text-grey">
                {{ clientVersions[d.id] }}
              </span>
              <v-icon
                v-if="suspendedDownloaders.has(d.id)"
                icon="mdi-alert-circle"
                color="error"
                size="x-small"
                class="ml-1"
              >
                <v-tooltip activator="parent" location="bottom">
                  {{ t("MyClient.autoRefresh.suspendedTip") }}
                </v-tooltip>
              </v-icon>
            </v-list-item-title>
            <v-list-item-subtitle>
              <a
                :href="d.address"
                class="text-primary text-decoration-underline text-caption"
                rel="noopener noreferrer nofollow"
                target="_blank"
                @click.stop
              >
                {{ d.address }}
              </a>
            </v-list-item-subtitle>

            <template #append>
              <v-progress-circular v-if="clientLoading[d.id]" indeterminate size="20" width="2" class="mr-4" />
              <template v-else>
                <div class="text-end text-caption mr-2">
                  <div class="d-flex align-center justify-end ga-1">
                    <v-icon color="green-darken-4" icon="mdi-chevron-up" size="small" />
                    <span class="text-no-wrap">
                      {{ formatSizeOrDash(clientStatuses[d.id]?.upSpeed) }}/s ({{
                        formatSizeOrDash(clientStatuses[d.id]?.upData)
                      }})
                    </span>
                  </div>
                  <div class="d-flex align-center justify-end ga-1">
                    <v-icon color="red-darken-4" icon="mdi-chevron-down" size="small" />
                    <span class="text-no-wrap">
                      {{ formatSizeOrDash(clientStatuses[d.id]?.dlSpeed) }}/s ({{
                        formatSizeOrDash(clientStatuses[d.id]?.dlData)
                      }})
                    </span>
                  </div>
                  <div class="text-grey">
                    {{ t("MyClient.clientStatusDialog.torrentCount", { count: torrentCountFor(d.id) }) }}
                  </div>
                </div>
              </template>

              <v-divider vertical class="mx-2" />
              <v-btn
                v-if="suspendedDownloaders.has(d.id)"
                :title="t('MyClient.autoRefresh.resumeDownloader')"
                icon="mdi-refresh"
                color="error"
                size="small"
                variant="text"
                @click.stop="resumeDownloaderRefresh(d.id)"
              />
              <v-btn
                v-else
                :title="t('MyClient.autoRefresh.stopDownloader')"
                color="amber"
                size="small"
                icon="mdi-stop"
                variant="text"
                @click.stop="() => suspendedDownloader(d.id)"
              />
              <v-btn
                :href="d.address"
                :title="t('MyClient.clientStatusDialog.openClient')"
                icon="mdi-open-in-new"
                rel="noopener noreferrer nofollow"
                size="small"
                target="_blank"
                variant="text"
                @click.stop
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
