<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
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

const refreshTimerId = ref<number>(0);
const refreshIntervalSeconds = ref<number>(0);

async function doFlushClientStatus() {
  const status = (await sendMessage("getDownloaderStatus", client.id)) as TorrentClientStatus | null;
  if (status) {
    clientStatus.value = status;
  }

  // 如果开启自动刷新，重置并安排下一次刷新
  if (refreshIntervalSeconds.value > 0) {
    if (refreshTimerId.value > 0) {
      clearTimeout(refreshTimerId.value);
    }
    refreshTimerId.value = setTimeout(doFlushClientStatus, refreshIntervalSeconds.value * 1e3) as unknown as number;
  } else {
    refreshTimerId.value = 0;
  }
}

function flushClientStatus() {
  // 如果当前已经有定时器了，说明正在刷新中或者者设置了自动刷新，这时候点击按钮应该取消自动刷新而不是立即刷新一次
  if (refreshTimerId.value > 0) {
    clearTimeout(refreshTimerId.value);
    refreshTimerId.value = 0;
  } else {
    doFlushClientStatus();
  }
}

function saveFlushInterval() {
  const metadataStore = useMetadataStore();
  metadataStore.downloaders[client.id].autoFlushStatus = refreshIntervalSeconds.value;
  metadataStore.$save();
}

function formatSizeStatus(v: number | undefined): string {
  return typeof v != "undefined" ? (formatSize(v) as string) : "-";
}

onMounted(async () => {
  refreshIntervalSeconds.value = client.autoFlushStatus ?? 0;
  if (configStore.download.startupAutoFetchDownloaderStatus) {
    if (refreshIntervalSeconds.value > 0) {
      flushClientStatus();
    }
  }
});

onUnmounted(() => {
  if (refreshTimerId.value > 0) {
    clearTimeout(refreshTimerId.value);
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
            :icon="refreshTimerId > 0 ? 'mdi-sync mdi-spin' : 'mdi-play-outline'"
            variant="plain"
            @click="flushClientStatus"
          />
        </template>

        <v-card>
          <v-number-input
            v-model="refreshIntervalSeconds"
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
