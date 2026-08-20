<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import type { CTorrent } from "@ptd/downloader";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const showDialog = defineModel<boolean>();
const { torrents, suggestLabels } = defineProps<{
  torrents: CTorrent[];
  suggestLabels?: string[];
}>();

const { t } = useI18n();
const runtimeStore = useRuntimeStore();

const labelInput = ref<string>("");

function dialogEnter() {
  // 初始化为当前种子的标签（如果有的话）
  const first = torrents[0];
  labelInput.value = first?.label ?? "";
}

async function confirmSetLabel() {
  const label = labelInput.value.trim();
  if (!label) {
    runtimeStore.showSnakebar(t("MyClient.label.emptyLabel"), { color: "warning" });
    return;
  }

  const results = await Promise.allSettled(
    torrents.map((torrent) =>
      sendMessage("setClientTorrentLabel", {
        downloaderId: torrent.clientId,
        id: torrent.id,
        label,
      }),
    ),
  );
  const succeeded = results.filter((r) => r.status === "fulfilled" && Boolean(r.value)).length;
  runtimeStore.showSnakebar(t("MyClient.label.success", { count: succeeded }), {
    color: succeeded > 0 ? "success" : "error",
  });
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="480" @after-enter="dialogEnter">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar :title="t('MyClient.label.title', { count: torrents.length })" color="blue-grey-darken-2">
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-combobox v-model="labelInput" :items="suggestLabels ?? []" :label="t('MyClient.label.input')" clearable />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="info" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          <span class="ml-1">{{ t("common.dialog.cancel") }}</span>
        </v-btn>
        <v-btn color="success" prepend-icon="mdi-check-circle-outline" variant="text" @click="confirmSetLabel">
          <span class="ml-1">{{ t("common.dialog.ok") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
