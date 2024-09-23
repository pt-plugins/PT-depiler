<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";
import { REPO_URL } from "@/shared/constants.ts";
import {
  entityList,
  getDownloaderMetaData,
  getDownloaderIcon,
  getDownloaderDefaultConfig,
  DownloaderBaseConfig,
  TorrentClientMetaData,
} from "@ptd/downloader";
import { useDownloaderStore } from "@/shared/store/downloader.ts";
import Editor from "./Editor.vue";

const componentProps = defineProps<{
  modelValue: boolean;
}>();

const showDialog = useVModel(componentProps);

const currentStep = ref<0 | 1>(0);
const selectedClientType = ref<string | null>(null);
const isClientConfigValid = ref<boolean>(false); // 新增时默认配置不合法

watch(showDialog, () => {
  currentStep.value = 0;
  selectedClientType.value = null;
  isClientConfigValid.value = false;
});

const clientConfig = ref<DownloaderBaseConfig>();
const clientMetaData = reactive<Record<string, TorrentClientMetaData>>({});

async function updateSelectedClientType(selectClientType: string) {
  if (!clientMetaData[selectClientType]) {
    clientMetaData[selectClientType] = await getDownloaderMetaData(selectClientType);
  }
  clientConfig.value = await getDownloaderDefaultConfig(selectClientType);
}

function saveClient() {
  const downloaderStore = useDownloaderStore();
  downloaderStore.addClient(clientConfig.value!);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey darken-2">
          <v-toolbar-title>{{ $t("setDownloader.add.title") }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            icon="mdi-help-circle"
            color="success"
            :href="`${REPO_URL}/wiki/config-download-client`"
            target="_blank"
            rel="noopener noreferrer nofollow"
          />
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <!-- TODO want: v-stepper -->
        <v-window v-model="currentStep">
          <v-window-item :key="0">
            <v-autocomplete
              v-model="selectedClientType"
              :items="entityList"
              :hint="
                clientMetaData[selectedClientType!]?.description ??
                $t('setDownloader.add.NoneSelectNotice')
              "
              persistent-hint
              @update:model-value="updateSelectedClientType"
            >
              <template #item="{ props, item }">
                <v-list-item
                  :prepend-avatar="getDownloaderIcon(item.raw)"
                  v-bind="props"
                  :title="item.raw"
                />
              </template>
            </v-autocomplete>
          </v-window-item>
          <v-window-item :key="1">
            <Editor
              v-model="clientConfig"
              v-model:is-config-valid="isClientConfigValid"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          v-show="currentStep === 0"
          flat
          color="grey--text text--darken-1"
          :href="`${REPO_URL}/tree/master/src/packages/downloader`"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <v-icon icon="mdi-help-circle" />
          <span class="ml-1">{{ $t("setDownloader.add.newType") }}</span>
        </v-btn>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          {{ $t("common.dialog.cancel") }}
        </v-btn>
        <v-btn
          v-if="currentStep === 1"
          color="blue-darken-1"
          variant="text"
          @click="currentStep--"
        >
          <v-icon icon="mdi-chevron-left" />
          {{ $t("common.dialog.prev") }}
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
          variant="text"
          color="success"
          :disabled="!isClientConfigValid"
          @click="saveClient"
        >
          <v-icon icon="mdi-check-circle-outline" />
          {{ $t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
