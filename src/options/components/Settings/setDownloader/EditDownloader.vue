<script lang="ts" setup>
import {inject, type Ref} from "vue";
import Editor from "./Editor.vue";
import {useDownloaderStore} from "@/shared/store/downloader";
import type {BittorrentClientBaseConfig} from "@ptpp/downloader";

const showEditDownloaderModal = inject<Ref<boolean>>("showEditDownloaderModal")!;
const clientConfig = inject("clientConfig") as Ref<BittorrentClientBaseConfig>;

function patchClient() {
  const store = useDownloaderStore();
  store.patchClient(clientConfig.value);
  showEditDownloaderModal.value = false;
}
</script>

<template>
  <v-dialog v-model="showEditDownloaderModal">
    <v-card width="800">
      <v-toolbar color="blue-grey darken-2">
        <v-toolbar-title>{{ $t("setDownloader.edit.title") }}</v-toolbar-title>
      </v-toolbar>
      <v-card-content>
        <v-container>
          <Editor />
        </v-container>
      </v-card-content>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          variant="text"
          @click="showEditDownloaderModal = false"
        >
          <v-icon icon="mdi-close-circle" />
          {{ $t("layout.dialog.cancel") }}
        </v-btn>

        <v-btn
          variant="text"
          color="success"
          @click="patchClient"
        >
          <v-icon icon="mdi-check-circle-outline" />
          {{ $t("layout.dialog.complete") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
