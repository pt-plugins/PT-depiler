<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";
import { nanoid } from "nanoid";
import { getMediaServerDefaultConfig, getMediaServerMetaData, entityList, getMediaServerIcon } from "@ptd/mediaServer";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { IMediaServerMetadata, TDownloaderKey, TMediaServerKey } from "@/shared/storages/types/metadata.ts";

import Editor from "./Editor.vue";

const showDialog = defineModel<boolean>();

const { t } = useI18n();
const metadataStore = useMetadataStore();

const currentStep = ref<0 | 1>(0);
const selectedMediaServerType = ref<TMediaServerKey | null>(null);
const storedMediaServerConfig = ref<Partial<IMediaServerMetadata>>({});
const isMediaServerConfigValid = ref<boolean>(false);

function resetDialog() {
  currentStep.value = 0;
  selectedMediaServerType.value = null;
  storedMediaServerConfig.value = {};
  isMediaServerConfigValid.value = false;
}

const allMediaServerMetaData = computedAsync(async () => {
  const mediaServerMetaData: Record<TMediaServerKey, IMediaServerMetadata & { type: TMediaServerKey }> = {};
  for (const type of entityList) {
    mediaServerMetaData[type] = { type, ...(await getMediaServerMetaData(type)) };
  }
  return mediaServerMetaData;
}, {});

async function updateStoredMediaServerConfigByDefault(e: TDownloaderKey) {
  storedMediaServerConfig.value = {
    ...(await getMediaServerDefaultConfig(e)),
    enabled: true,
    id: nanoid(),
  };
  console.log("storedDownloaderConfig", storedMediaServerConfig.value);
}

async function saveStoredMediaServerConfig() {
  await metadataStore.addMediaServer(storedMediaServerConfig.value as IMediaServerMetadata);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable @after-leave="resetDialog">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>添加媒体服务器</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-window v-model="currentStep">
          <v-window-item :key="0">
            <v-autocomplete
              v-model="selectedMediaServerType"
              :filter-keys="['type']"
              :hint="
                allMediaServerMetaData[selectedMediaServerType!]?.description ?? t('SetDownloader.add.NoneSelectNotice')
              "
              :items="Object.values(allMediaServerMetaData)"
              :multiple="false"
              :placeholder="t('SetDownloader.add.selectPlaceholder')"
              item-title="type"
              item-value="type"
              persistent-hint
              @update:model-value="(e) => updateStoredMediaServerConfigByDefault(e)"
            >
              <template #selection="{ item: { raw: downloader } }">
                <v-list-item :prepend-avatar="getMediaServerIcon(downloader.type)" :title="downloader.type" />
              </template>
              <template #item="{ props, item: { raw: downloader } }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="getMediaServerIcon(downloader.type)"
                  :title="downloader.type"
                >
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-window-item>
          <v-window-item :key="1">
            <Editor
              v-if="storedMediaServerConfig.type"
              v-model="storedMediaServerConfig as IMediaServerMetadata"
              @update:config-valid="(e) => (isMediaServerConfigValid = e)"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
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
          :disabled="selectedMediaServerType == null"
          color="blue-darken-1"
          variant="text"
          @click="currentStep++"
        >
          {{ t("common.dialog.next") }}
          <v-icon icon="mdi-chevron-right" />
        </v-btn>
        <v-btn
          v-if="currentStep === 1"
          :disabled="!isMediaServerConfigValid"
          color="success"
          variant="text"
          @click="saveStoredMediaServerConfig"
        >
          <v-icon icon="mdi-check-circle-outline" />
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
