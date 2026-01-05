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

import type { IDownloaderMetadata } from "@/shared/types.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import Editor from "./Editor.vue";

import { REPO_URL } from "~/helper.ts";

const showDialog = defineModel<boolean>();

const { t } = useI18n();
const metadataStore = useMetadataStore();

const currentStep = ref<0 | 1>(0);
const selectedClientType = ref<string | null>(null);
const storedDownloaderConfig = ref<Partial<IDownloaderMetadata>>({});
const isDownloaderConfigValid = ref<boolean>(false);

function resetDialog() {
  currentStep.value = 0;
  selectedClientType.value = null;
  storedDownloaderConfig.value = {};
  isDownloaderConfigValid.value = false;
}

const allTorrentClientMetaData = computedAsync(async () => {
  const clientMetaData: Record<string, TorrentClientMetaData & { type: string }> = {};
  for (const type of entityList) {
    clientMetaData[type] = { type, ...(await getDownloaderMetaData(type)) };
  }
  return clientMetaData;
}, {});

async function updateStoredDownloaderConfigByDefault(type: string) {
  storedDownloaderConfig.value = {
    valid: false,
    ...(await getDownloaderDefaultConfig(type)),
    enabled: true,
    id: nanoid(),
    advanceAddTorrentOptions: {},
    sortIndex: 100,
  };
  console.log("storedDownloaderConfig", storedDownloaderConfig.value);
}

async function saveStoredDownloaderConfig() {
  await metadataStore.addDownloader(storedDownloaderConfig.value as IDownloaderMetadata);

  // 如果只有一个下载器，则将这个下载器设为默认下载器
  if (metadataStore.getDownloaders.length === 1) {
    metadataStore.defaultDownloader = { id: storedDownloaderConfig.value.id!, folder: "", tags: "" };
    metadataStore.$save();
  }

  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable @after-leave="resetDialog">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("SetDownloader.add.title") }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            :title="t('layout.header.wiki')"
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
          <!-- 选取可添加的客户端 -->
          <v-window-item :value="0">
            <v-autocomplete
              v-model="selectedClientType"
              :filter-keys="['raw.type']"
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
          <v-window-item :value="1">
            <Editor
              v-if="storedDownloaderConfig.type"
              v-model="storedDownloaderConfig as IDownloaderMetadata"
              @update:config-valid="(v) => (isDownloaderConfigValid = v)"
            />
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
        <v-btn color="error" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn
          v-if="currentStep === 1"
          color="blue-darken-1"
          prepend-icon="mdi-chevron-left"
          variant="text"
          @click="currentStep--"
        >
          {{ t("common.dialog.prev") }}
        </v-btn>
        <v-btn
          v-if="currentStep === 0"
          :disabled="selectedClientType == null"
          append-icon="mdi-chevron-right"
          color="blue-darken-1"
          variant="text"
          @click="currentStep++"
        >
          {{ t("common.dialog.next") }}
        </v-btn>
        <v-btn
          v-if="currentStep === 1"
          :disabled="!isDownloaderConfigValid"
          color="success"
          prepend-icon="mdi-check-circle-outline"
          variant="text"
          @click="saveStoredDownloaderConfig"
        >
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
