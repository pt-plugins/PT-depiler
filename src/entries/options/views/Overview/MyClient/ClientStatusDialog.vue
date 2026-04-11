<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import type { CTorrent, TorrentClientStatus } from "@ptd/downloader";
import { getDownloaderIcon } from "@ptd/downloader";
import { sendMessage } from "@/messages.ts";
import { formatSize } from "@/options/utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

const props = defineProps<{
  torrents: CTorrent[];
}>();

const showDialog = defineModel<boolean>();

const { t } = useI18n();
const metadataStore = useMetadataStore();

const enabledDownloaders = computed(() => metadataStore.getEnabledDownloaders);

const clientStatuses = ref<Record<string, TorrentClientStatus>>({});
const clientVersions = ref<Record<string, string>>({});
const clientLoading = ref<Record<string, boolean>>({});

function torrentCountFor(id: string) {
  return props.torrents.filter((t) => t.clientId === id).length;
}

function formatSizeOrDash(v: number | undefined): string {
  return typeof v !== "undefined" ? (formatSize(v) as string) : "-";
}

async function fetchStatusFor(id: string) {
  clientLoading.value[id] = true;
  try {
    const [status, version] = await Promise.all([
      (sendMessage("getDownloaderStatus", id) as Promise<TorrentClientStatus | null>).catch(() => null),
      (sendMessage("getDownloaderVersion", id) as Promise<string>).catch(() => "—"),
    ]);
    if (status) clientStatuses.value[id] = status;
    clientVersions.value[id] = version ?? "—";
  } finally {
    clientLoading.value[id] = false;
  }
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
          <v-list-item v-for="d in enabledDownloaders" :key="d.id">
            <template #prepend>
              <v-avatar :image="getDownloaderIcon(d.type)" size="32" class="mr-2" />
            </template>

            <v-list-item-title class="font-weight-bold">{{ d.name }}</v-list-item-title>
            <v-list-item-subtitle>
              <a
                :href="d.address"
                class="text-primary text-decoration-underline text-caption"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                {{ d.address }}
              </a>
              <span v-if="clientVersions[d.id]" class="ml-2 text-caption text-grey">
                {{ clientVersions[d.id] }}
              </span>
            </v-list-item-subtitle>

            <template #append>
              <v-progress-circular v-if="clientLoading[d.id]" indeterminate size="20" width="2" class="mr-4" />
              <template v-else>
                <div class="text-end text-caption mr-2">
                  <div class="d-flex align-center justify-end ga-1">
                    <v-icon color="green-darken-4" icon="mdi-chevron-up" size="small" />
                    <span class="text-no-wrap">
                      {{ formatSizeOrDash(clientStatuses[d.id]?.upSpeed) }}/s
                      ({{ formatSizeOrDash(clientStatuses[d.id]?.upData) }})
                    </span>
                  </div>
                  <div class="d-flex align-center justify-end ga-1">
                    <v-icon color="red-darken-4" icon="mdi-chevron-down" size="small" />
                    <span class="text-no-wrap">
                      {{ formatSizeOrDash(clientStatuses[d.id]?.dlSpeed) }}/s
                      ({{ formatSizeOrDash(clientStatuses[d.id]?.dlData) }})
                    </span>
                  </div>
                  <div class="text-grey">
                    {{ t("MyClient.clientStatusDialog.torrentCount", { count: torrentCountFor(d.id) }) }}
                  </div>
                </div>
              </template>
              <v-divider vertical class="mx-2" />
              <v-btn
                :href="d.address"
                :title="t('MyClient.clientStatusDialog.openClient')"
                icon="mdi-open-in-new"
                rel="noopener noreferrer nofollow"
                size="small"
                target="_blank"
                variant="text"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
