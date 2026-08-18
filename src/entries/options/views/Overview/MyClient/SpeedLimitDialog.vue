<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import type { CTorrent, TorrentSpeedLimit } from "@ptd/downloader";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const showDialog = defineModel<boolean>();
const { torrents } = defineProps<{
  torrents: CTorrent[];
}>();

const { t } = useI18n();
const runtimeStore = useRuntimeStore();

const uploadLimit = ref<number | null>(null);
const downloadLimit = ref<number | null>(null);

function dialogEnter() {
  // 初始化为当前种子的限速（qBittorrent raw 中有 up_limit/dl_limit 字段，其他客户端留空）
  const first = torrents[0];
  const raw = first?.raw as Record<string, any> | undefined;
  uploadLimit.value = typeof raw?.up_limit === "number" ? Math.round(raw.up_limit / 1024) : null;
  downloadLimit.value = typeof raw?.dl_limit === "number" ? Math.round(raw.dl_limit / 1024) : null;
}

async function confirmSetLimit() {
  const limits: TorrentSpeedLimit = {};
  if (uploadLimit.value !== null) limits.upload = uploadLimit.value;
  if (downloadLimit.value !== null) limits.download = downloadLimit.value;
  if (Object.keys(limits).length === 0) {
    runtimeStore.showSnakebar(t("MyClient.speedLimit.emptyLimit"), { color: "warning" });
    return;
  }

  const results = await Promise.allSettled(
    torrents.map((torrent) =>
      sendMessage("setClientTorrentSpeedLimit", {
        downloaderId: torrent.clientId,
        id: torrent.id,
        limits,
      }),
    ),
  );
  const succeeded = results.filter((r) => r.status === "fulfilled" && Boolean(r.value)).length;
  runtimeStore.showSnakebar(t("MyClient.speedLimit.success", { count: succeeded }), {
    color: succeeded > 0 ? "success" : "error",
  });
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="480" @after-enter="dialogEnter">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar :title="t('MyClient.speedLimit.title', { count: torrents.length })" color="blue-grey-darken-2">
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-alert type="info" variant="tonal" density="compact" class="mb-3">
          {{ t("MyClient.speedLimit.unitNote") }}
        </v-alert>

        <v-text-field
          v-model.number="uploadLimit"
          :label="t('MyClient.speedLimit.upload')"
          min="0"
          type="number"
          clearable
        />
        <v-text-field
          v-model.number="downloadLimit"
          :label="t('MyClient.speedLimit.download')"
          min="0"
          type="number"
          clearable
        />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="info" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          <span class="ml-1">{{ t("common.dialog.cancel") }}</span>
        </v-btn>
        <v-btn color="success" prepend-icon="mdi-check-circle-outline" variant="text" @click="confirmSetLimit">
          <span class="ml-1">{{ t("common.dialog.ok") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
