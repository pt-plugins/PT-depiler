<script setup lang="ts">
import { nanoid } from "nanoid";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import {
  entityList,
  getDownloaderDefaultConfig,
  getDownloaderIcon,
  getDownloaderMetaData,
  type TorrentClientMetaData,
} from "@ptd/downloader";
import type { IDownloaderMetadata, TDownloaderKey } from "@/shared/storages/types/metadata.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { REPO_URL } from "~/helper.ts";

import Editor from "./Editor.vue";

const showDialog = defineModel<boolean>();

const { t } = useI18n();
const metadataStore = useMetadataStore();

const currentStep = ref<0 | 1>(0);
const selectedClientType = ref<TDownloaderKey | null>(null);
const storedDownloaderConfig = ref<Partial<IDownloaderMetadata> & { valid?: boolean }>({ valid: false });

function resetDialog() {
  currentStep.value = 0;
  selectedClientType.value = null;
  storedDownloaderConfig.value = { valid: false };
}

const allTorrentClientMetaData = computedAsync(async () => {
  const clientMetaData: Record<TDownloaderKey, TorrentClientMetaData & { type: TDownloaderKey }> = {};
  for (const type of entityList) {
    clientMetaData[type] = { type, ...(await getDownloaderMetaData(type)) };
  }
  return clientMetaData;
}, {});

async function updateStoredDownloaderConfigByDefault(e: TDownloaderKey) {
  storedDownloaderConfig.value = {
    valid: false,
    ...(await getDownloaderDefaultConfig(e)),
    enabled: true,
    id: nanoid(),
  };
  console.log("storedDownloaderConfig", storedDownloaderConfig.value);
}

async function saveStoredDownloaderConfig() {
  await metadataStore.addDownloader(storedDownloaderConfig.value as IDownloaderMetadata);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable @after-leave="resetDialog">
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("SetDownloader.add.title") }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            :href="`${REPO_URL}/wiki/config-download-client`"
            color="success"
            icon="mdi-help-circle"
            rel="noopener noreferrer nofollow"
            target="_blank"
          />
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-window v-model="currentStep">
          <!-- 选取可添加的站点 -->
          <v-window-item :key="0">
            <v-autocomplete
              v-model="selectedClientType"
              :filter-keys="['type']"
              :hint="
                allTorrentClientMetaData[selectedClientType!]?.description ?? t('SetDownloader.add.NoneSelectNotice')
              "
              :items="Object.values(allTorrentClientMetaData)"
              :multiple="false"
              :placeholder="t('SetDownloader.add.selectPlaceholder')"
              item-title="type"
              item-value="type"
              persistent-hint
              @update:model-value="(e) => updateStoredDownloaderConfigByDefault(e)"
            >
              <template #selection="{ item: { raw: downloader } }">
                <v-list-item :prepend-avatar="getDownloaderIcon(downloader.type)" :title="downloader.type" />
              </template>
              <template #item="{ props, item: { raw: downloader } }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="getDownloaderIcon(downloader.type)"
                  :title="downloader.type"
                >
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-window-item>
          <v-window-item :key="1">
            <Editor v-if="storedDownloaderConfig.type" v-model="storedDownloaderConfig" />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          v-show="currentStep === 0"
          :href="`${REPO_URL}/tree/master/src/packages/downloader`"
          color="grey-darken-1"
          flat
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          <v-icon icon="mdi-help-circle" />
          <span class="ml-1">{{ t("SetDownloader.add.newType") }}</span>
        </v-btn>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn v-if="currentStep === 1" color="blue-darken-1" variant="text" @click="currentStep--">
          <v-icon icon="mdi-chevron-left" />
          {{ t("common.dialog.prev") }}
        </v-btn>
        <v-btn
          v-if="currentStep === 0"
          :disabled="selectedClientType == null"
          color="blue-darken-1"
          variant="text"
          @click="currentStep++"
        >
          {{ $t("common.dialog.next") }}
          <v-icon icon="mdi-chevron-right" />
        </v-btn>
        <v-btn
          v-if="currentStep === 1"
          :disabled="!storedDownloaderConfig.valid"
          color="success"
          variant="text"
          @click="saveStoredDownloaderConfig"
        >
          <v-icon icon="mdi-check-circle-outline" />
          {{ $t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
