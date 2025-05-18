<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { BackupFields, IBackupServerMetadata } from "@/shared/storages/types/metadata.ts";
import {
  entityList,
  getBackupServerDefaultConfig,
  getBackupServerIcon,
  getBackupServerMetaData,
  type IBackupMetadata,
} from "@ptd/backupServer";
import { REPO_URL } from "~/helper.ts";
import { computedAsync } from "@vueuse/core";
import { nanoid } from "nanoid";
import Editor from "@/options/views/Settings/SetBackup/Editor.vue";
import { useMetadataStore } from "@/options/stores/metadata.ts";

const showDialog = defineModel<boolean>();

const { t } = useI18n();
const metadataStore = useMetadataStore();

const currentStep = ref<0 | 1>(0);
const selectedBackupServerType = ref<IBackupServerMetadata["type"] | null>(null);
const storedBackupServerConfig = ref<IBackupServerMetadata>({} as IBackupServerMetadata);
const isBackupServerConfigValid = ref<boolean>(false);

const allBackupServerMetaData = computedAsync(async () => {
  const clientMetaData: Record<string, IBackupMetadata<any> & { type: string }> = {};
  for (const type of entityList) {
    clientMetaData[type] = { type, ...(await getBackupServerMetaData(type)) };
  }
  return clientMetaData;
}, {});

async function updateStoredDownloaderConfigByDefault(type: IBackupServerMetadata["type"]) {
  storedBackupServerConfig.value = {
    ...(await getBackupServerDefaultConfig(type)),
    enabled: true,
    id: nanoid(),
    backupFields: [...BackupFields],
  } as IBackupServerMetadata;
  console.log("storedBackupServerConfig", storedBackupServerConfig.value);
}

async function saveStoredBackupServerConfig() {
  await metadataStore.addBackupServer(storedBackupServerConfig.value as IBackupServerMetadata);
  showDialog.value = false;
}

function resetDialog() {
  currentStep.value = 0;
  selectedBackupServerType.value = null;
  storedBackupServerConfig.value = {} as IBackupServerMetadata;
  isBackupServerConfigValid.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable @after-leave="resetDialog">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 添加备份服务器 </v-toolbar-title>
          <v-spacer />
          <v-btn
            :href="`${REPO_URL}/wiki/config-backup-server`"
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
          <!-- 选取可添加的备份服务器类型 -->
          <v-window-item :key="0">
            <v-autocomplete
              v-model="selectedBackupServerType"
              :items="Object.values(allBackupServerMetaData)"
              item-value="type"
              item-title="type"
              :multiple="false"
              persistent-hint
              :hint="
                allBackupServerMetaData[selectedBackupServerType!]?.description ??
                t('SetDownloader.add.NoneSelectNotice')
              "
              @update:model-value="(e) => updateStoredDownloaderConfigByDefault(e)"
            >
              <template #selection="{ item: { raw: backupServer } }">
                <v-list-item :prepend-avatar="getBackupServerIcon(backupServer.type)" :title="backupServer.type" />
              </template>
              <template #item="{ props, item: { raw: backupServer } }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="getBackupServerIcon(backupServer.type)"
                  :title="backupServer.type"
                >
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-window-item>
          <v-window-item :key="1">
            <Editor
              v-if="storedBackupServerConfig.type"
              v-model="storedBackupServerConfig"
              @update:config-valid="(v) => (isBackupServerConfigValid = v)"
            />
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn
          v-show="currentStep === 0"
          :href="`${REPO_URL}/tree/master/src/packages/backupServer`"
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
          :disabled="selectedBackupServerType == null"
          color="blue-darken-1"
          variant="text"
          @click="currentStep++"
        >
          {{ t("common.dialog.next") }}
          <v-icon icon="mdi-chevron-right" />
        </v-btn>
        <v-btn
          v-if="currentStep === 1"
          :disabled="!isBackupServerConfigValid"
          color="success"
          variant="text"
          @click="saveStoredBackupServerConfig"
        >
          <v-icon icon="mdi-check-circle-outline" />
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
