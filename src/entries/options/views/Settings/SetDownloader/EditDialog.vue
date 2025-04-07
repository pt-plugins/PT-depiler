<script setup lang="ts">
import { ref, watch } from "vue";
import type { IDownloaderMetadata } from "@/shared/storages/metadata.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import Editor from "./Editor.vue";

const showDialog = defineModel<boolean>();
const props = defineProps<{
  clientConfig: IDownloaderMetadata & { valid?: boolean };
}>();
const clientConfig = ref<IDownloaderMetadata & { valid?: boolean }>();
const metadataStore = useMetadataStore();

watch(
  () => props.clientConfig,
  (newValue) => {
    console.log("clientConfig", newValue);
    if (newValue?.id) {
      clientConfig.value = { ...newValue, valid: true }; // 防止直接修改父组件的数据
    }
  },
  { immediate: true, deep: true },
);

function editClientConfig() {
  metadataStore.addDownloader(clientConfig.value as IDownloaderMetadata);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey darken-2">
          <v-toolbar-title>{{ $t("setDownloader.edit.title") }}</v-toolbar-title>
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
          {{ $t("common.dialog.cancel") }}
        </v-btn>

        <v-btn variant="text" color="success" @click="editClientConfig">
          <v-icon icon="mdi-check-circle-outline" />
          {{ $t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
