<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { refManualReset } from "@vueuse/core";

import type { TorrentClientStatus } from "@ptd/downloader";

import { formatSize } from "@/options/utils.ts";
import { sendMessage } from "@/messages.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import type { IDownloaderMetadata } from "@/shared/types/storages/metadata.ts";

const { client } = defineProps<{
  client: IDownloaderMetadata;
}>();

const { t } = useI18n();
const configStore = useConfigStore();

const clientStatus = refManualReset<TorrentClientStatus>(() => ({
  upSpeed: 0,
  dlSpeed: 0,
  upData: 0,
  dlData: 0,
}));

const inFlushed = ref<number>(0);
const flushInterval = ref<number>(0);

async function doFlushClientStatus() {
  const status = (await sendMessage("getDownloaderStatus", client.id)) as TorrentClientStatus | null;
  if (status) {
    clientStatus.value = status;
  }

  // 如果开启自动刷新，重置并安排下一次刷新
  if (flushInterval.value > 0) {
    if (inFlushed.value > 0) {
      clearTimeout(inFlushed.value);
    }
    inFlushed.value = setTimeout(doFlushClientStatus, flushInterval.value * 1e3) as unknown as number;
  } else {
    inFlushed.value = 0;
  }
}

function flushClientStatus() {
  // 手动触发：取消已有定时器并立即刷新一次
  if (inFlushed.value > 0) {
    clearTimeout(inFlushed.value);
    inFlushed.value = 0;
  } else {
    doFlushClientStatus();
  }
}

function saveFlushInterval() {
  const metadataStore = useMetadataStore();
  metadataStore.downloaders[client.id].autoFlushStatus = flushInterval.value;
  metadataStore.$save();
}

function formatSizeStatus(v: number | undefined): string {
  return typeof v != "undefined" ? (formatSize(v) as string) : "-";
}

onMounted(async () => {
  if (configStore.download.startupAutoFetchDownloaderStatus) {
    flushInterval.value = client.autoFlushStatus ?? 0;
    if (flushInterval.value > 0) {
      flushClientStatus();
    }
  }
});
</script>

<template>
  <div class="client_status_grid">
    <div class="upload_status">
      <span class="text-no-wrap">
        {{ formatSizeStatus(clientStatus.upSpeed) + "/s" }}
        &nbsp;
        {{ "(" + formatSizeStatus(clientStatus.upData) + ")" }}
      </span>
      <v-icon color="green-darken-4" icon="mdi-chevron-up" size="small"></v-icon>
    </div>
    <div class="download_status">
      <span class="text-no-wrap">
        {{ formatSizeStatus(clientStatus.dlSpeed) + "/s" }}
        &nbsp;
        {{ "(" + formatSizeStatus(clientStatus.dlData) + ")" }}
      </span>
      <v-icon color="red-darken-4" icon="mdi-chevron-down" size="small"></v-icon>
    </div>
    <div class="flush_status">
      <v-menu open-on-hover :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :icon="inFlushed > 0 ? 'mdi-sync mdi-spin' : 'mdi-play-outline'"
            variant="plain"
            @click="flushClientStatus"
          />
        </template>

        <v-card>
          <v-number-input
            v-model="flushInterval"
            width="150px"
            controlVariant="stacked"
            :label="t('SetDownloader.ClientStatusSpan.flushInterval')"
            :min="0"
            :max="60"
            hide-details
            @update:model-value="saveFlushInterval"
          />
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<style scoped lang="scss">
.client_status_grid {
  display: inline-grid;
}

.upload_status {
  text-align: right;
  grid-area: 1 / 1 / 2 / 2;
}
.download_status {
  text-align: right;
  grid-area: 2 / 1 / 3 / 2;
}
.flush_status {
  grid-area: 1 / 2 / 3 / 3;
}
</style>
