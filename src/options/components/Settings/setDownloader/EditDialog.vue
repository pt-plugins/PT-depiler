<script lang="ts" setup>
import { ref } from "vue";
import { useVModels } from "@vueuse/core";
import { useDownloaderStore } from "@/shared/store/downloader";
import type { BittorrentClientBaseConfig } from "@ptpp/downloader";
import Editor from "./Editor.vue";

const componentProps = defineProps<{
  modelValue: boolean,
  clientConfig: BittorrentClientBaseConfig
}>();

const {
  modelValue: showDialog,
  clientConfig
} = useVModels(componentProps);
const isClientConfigValid = ref<boolean>(true);  // // 修改时默认配置合法

function patchClient () {
  const downloaderStore = useDownloaderStore();
  downloaderStore.patchClient(clientConfig.value!);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey darken-2">
          <v-toolbar-title>{{ $t('setDownloader.edit.title') }}</v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <Editor v-model="clientConfig" v-model:isConfigValid="isClientConfigValid" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          variant="text"
          @click="showDialog = false"
        >
          <v-icon icon="mdi-close-circle" />
          {{ $t("common.dialog.cancel") }}
        </v-btn>

        <v-btn
          variant="text"
          color="success"
          :disabled="!isClientConfigValid"
          @click="patchClient"
        >
          <v-icon icon="mdi-check-circle-outline" />
          {{ $t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
