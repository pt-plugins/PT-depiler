<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { type ITorrent, getHostFromUrl } from "@ptd/site";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import SentToDownloaderDialog from "@/options/components/SentToDownloaderDialog/Index.vue";

const showDialog = defineModel<boolean>();
const metadataStore = useMetadataStore();
const { t } = useI18n();

type TInputMode = "url" | "file";

const inputMode = ref<TInputMode>("url");
const urlInput = ref("");
const torrentFiles = ref<File[]>([]);

const showSentToDownloaderDialog = ref(false);
const pendingTorrentItems = ref<ITorrent[]>([]);

watch(showDialog, (val) => {
  if (val) {
    inputMode.value = "url";
    urlInput.value = "";
    torrentFiles.value = [];
  }
});

async function submit() {
  const torrentItems: ITorrent[] = [];

  if (inputMode.value === "url") {
    const lines = urlInput.value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    for (const link of lines) {
      const torrent = { link, title: link } as ITorrent;
      if (link.match(/^https?:\/\//)) {
        const host = getHostFromUrl(link);
        if (metadataStore.siteHostMap[host]) {
          torrent.site = metadataStore.siteHostMap[host];
        }
      }
      torrentItems.push(torrent);
    }
  } else {
    for (const file of torrentFiles.value) {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      const dataUri = `data:application/x-bittorrent;base64,${base64}`;
      torrentItems.push({
        link: dataUri,
        title: file.name.replace(/\.torrent$/i, ""),
        site: "",
        id: file.name,
      } as unknown as ITorrent);
    }
  }

  if (torrentItems.length === 0) return;

  pendingTorrentItems.value = torrentItems;
  showDialog.value = false;
  showSentToDownloaderDialog.value = true;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="560" scrollable>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("MyClient.pushToDownloader.title") }}</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>

      <v-card-text>
        <v-btn-toggle v-model="inputMode" class="mb-4" mandatory density="compact" variant="outlined">
          <v-btn value="url" prepend-icon="mdi-link-variant">{{ t("MyClient.pushToDownloader.modeUrl") }}</v-btn>
          <v-btn value="file" prepend-icon="mdi-file-upload">{{ t("MyClient.pushToDownloader.modeFile") }}</v-btn>
        </v-btn-toggle>

        <template v-if="inputMode === 'url'">
          <v-textarea
            v-model="urlInput"
            :label="t('MyClient.pushToDownloader.urlInputLabel')"
            :hint="t('MyClient.pushToDownloader.urlInputHint')"
            persistent-hint
            auto-grow
            rows="3"
            clearable
          />
        </template>

        <template v-else>
          <v-file-input
            v-model="torrentFiles"
            accept=".torrent"
            :label="t('MyClient.pushToDownloader.fileInputLabel')"
            :hint="t('MyClient.pushToDownloader.fileInputHint')"
            persistent-hint
            multiple
            show-size
            prepend-icon="mdi-file-document"
          />
        </template>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="info" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          <span class="ml-1">{{ t("common.dialog.cancel") }}</span>
        </v-btn>
        <v-btn
          :disabled="inputMode === 'url' ? !urlInput.trim() : torrentFiles.length === 0"
          color="success"
          prepend-icon="mdi-cloud-upload"
          variant="text"
          @click="submit"
        >
          <span class="ml-1">{{ t("common.dialog.ok") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <SentToDownloaderDialog v-model="showSentToDownloaderDialog" :torrent-items="pendingTorrentItems" />
</template>

<style scoped lang="scss"></style>
