<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { IBackupServerMetadata, TBackupServerKey } from "@/shared/storages/types/metadata.ts";

import Editor from "./Editor.vue";

const showDialog = defineModel<boolean>();
const { clientId } = defineProps<{
  clientId: TBackupServerKey;
}>();
const clientConfig = ref<IBackupServerMetadata>();

const { t } = useI18n();
const metadataStore = useMetadataStore();

function dialogEnter() {
  if (clientId) {
    clientConfig.value = { ...metadataStore.backupServers[clientId] }; // 防止直接修改父组件的数据
  }
}

function editClientConfig() {
  metadataStore.addBackupServer(clientConfig.value as IBackupServerMetadata);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable @after-enter="dialogEnter">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("SetDownloader.edit.title") }}</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <Editor v-model="clientConfig" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          {{ t("common.dialog.cancel") }}
        </v-btn>

        <v-btn color="success" variant="text" @click="editClientConfig">
          <v-icon icon="mdi-check-circle-outline" />
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
