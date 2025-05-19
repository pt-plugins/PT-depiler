<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, shallowRef } from "vue";
import { isEmpty } from "es-toolkit/compat";
import { jsZipBlobToBackupData } from "@ptd/backupServer/utils.ts";
import type { IBackupData } from "@ptd/backupServer";

import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { sendMessage } from "@/messages.ts";
import { BackupFields, type TBackupFields } from "@/shared/storages/types/metadata.ts";
import type { IRestoreOptions } from "@/shared/types.ts";

const showDialog = defineModel<boolean>();
const { t } = useI18n();

type TRestoreMetaData = { type: "file" } | { type: "remote"; server: string; path: string };

const { restoreMetadata = { type: "file" } } = defineProps<{
  restoreMetadata?: TRestoreMetaData;
}>();

const currentStep = ref<TRestoreMetaData["type"] | "restore">("file");
const decryptKey = ref<string>("");
const showDecryptKey = ref<boolean>(false);
const isDecryptKeyValid = ref<boolean>(true);

const restoreData = shallowRef<IBackupData>();
const restoreOptions = ref<IRestoreOptions>({
  fields: [],
  expandCookieMinutes: 0,
  keepExistUserInfo: true,
});

const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();

function buildBackupOptions() {
  restoreOptions.value = {
    fields: [...Object.keys(restoreData.value?.manifest?.files ?? {})] as TBackupFields[],
    expandCookieMinutes: 0,
    keepExistUserInfo: true,
  };
  currentStep.value = "restore";
}

/**
 * 如果是本地的文件，我们直接在 options 中解析，如果是服务器的文件，我们则在 offscreen 中解析
 */

const backupFile = shallowRef<File>();
function loadLocalBackupFile() {
  jsZipBlobToBackupData(backupFile.value as Blob, decryptKey.value)
    .then((data) => {
      restoreData.value = data;
      isDecryptKeyValid.value = true;
      buildBackupOptions();
    })
    .catch((err) => {
      console.error(err);
      restoreData.value = undefined;
      isDecryptKeyValid.value = false;
      runtimeStore.showSnakebar(`加载失败: ${err}`, { color: "error" });
    });
}

const isLoadingRemoteBackupFile = ref<boolean>(false);
function loadRemoteBackupFile() {
  if (restoreMetadata.type === "remote") {
    isLoadingRemoteBackupFile.value = true;
    sendMessage("getRemoteBackupData", {
      backupServerId: restoreMetadata.server,
      path: restoreMetadata.path,
      decryptKey: decryptKey.value,
    })
      .then((data) => {
        restoreData.value = data;
        buildBackupOptions();
      })
      .catch((err) => {
        runtimeStore.showSnakebar(`加载失败: ${err}`, { color: "error" });
        console.error(err);
        isDecryptKeyValid.value = false;
      })
      .finally(() => {
        isLoadingRemoteBackupFile.value = false;
      });
  }
}

const isDoingRestore = ref<boolean>(false);
function doRestore() {
  isDoingRestore.value = true;
  sendMessage("restoreBackupData", { restoreData: restoreData.value!, restoreOptions: restoreOptions.value })
    .then(() => {
      runtimeStore.showSnakebar("恢复成功", { color: "success" });
      showDialog.value = false;
    })
    .catch((err) => {
      runtimeStore.showSnakebar(`恢复失败: ${err}`, { color: "error" });
      console.error(err);
    })
    .finally(() => {
      isDoingRestore.value = false;
    });
}

function convertIsoDurationToMinutes(duration: string): number {
  const regex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
  const match = duration.match(regex);

  if (!match) {
    throw new Error(`Invalid ISO 8601 duration format: ${duration}`);
  }

  const [, years, months, weeks, days, hours, minutes, seconds] = match;

  // 转换各时间单位为分钟
  const minutesFromYears = years ? parseInt(years, 10) * 365 * 24 * 60 : 0;
  const minutesFromMonths = months ? parseInt(months, 10) * 30 * 24 * 60 : 0; // 近似值，每月按30天计算
  const minutesFromWeeks = weeks ? parseInt(weeks, 10) * 7 * 24 * 60 : 0;
  const minutesFromDays = days ? parseInt(days, 10) * 24 * 60 : 0;
  const minutesFromHours = hours ? parseInt(hours, 10) * 60 : 0;
  const minutesFromMinutes = minutes ? parseInt(minutes, 10) : 0;
  const minutesFromSeconds = seconds ? parseInt(seconds, 10) / 60 : 0;

  // 计算总分钟数
  return (
    minutesFromYears +
    minutesFromMonths +
    minutesFromWeeks +
    minutesFromDays +
    minutesFromHours +
    minutesFromMinutes +
    minutesFromSeconds
  );
}

function resetDialog() {
  currentStep.value = restoreMetadata.type;
  decryptKey.value = configStore.backup.encryptionKey ?? "";

  restoreData.value = undefined;
  if (restoreMetadata.type === "file") {
    backupFile.value = undefined;
  } else if (restoreMetadata.type == "remote") {
    loadRemoteBackupFile();
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" :persistent="isDoingRestore" max-width="800" scrollable @after-enter="resetDialog">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 从备份文件中恢复 </v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-window v-model="currentStep">
          <v-window-item value="file" eager>
            <v-file-input
              v-model="backupFile"
              accept="application/zip"
              label="选择备份文件"
              placeholder="选择备份文件"
              show-size
              @update:model-value="loadLocalBackupFile"
            />
            <v-text-field
              v-model="decryptKey"
              :append-icon="showDecryptKey ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showDecryptKey ? 'text' : 'password'"
              label="解密密钥"
              @click:append="showDecryptKey = !showDecryptKey"
            />
            <v-btn
              v-if="!isDecryptKeyValid"
              :disabled="!backupFile"
              prepend-icon="mdi-cached"
              block
              color="warning"
              text="重试"
              @click="loadLocalBackupFile"
            />
          </v-window-item>
          <v-window-item value="remote" eager>
            <v-text-field
              v-model="decryptKey"
              :append-icon="showDecryptKey ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showDecryptKey ? 'text' : 'password'"
              label="解密密钥"
              @click:append="showDecryptKey = !showDecryptKey"
            />
            <v-btn
              v-if="!isDecryptKeyValid"
              :loading="isLoadingRemoteBackupFile"
              prepend-icon="mdi-cached"
              block
              color="warning"
              text="重试"
              @click="loadRemoteBackupFile"
            />
          </v-window-item>
          <v-window-item value="restore">
            <v-label>恢复选项</v-label>
            <v-row no-gutters>
              <v-col v-for="backupField in BackupFields" :key="backupField" cols="12" md="4">
                <v-switch
                  v-model="restoreOptions.fields"
                  :label="backupField"
                  :value="backupField"
                  color="success"
                  :disabled="!restoreData?.manifest?.files?.[backupField]"
                  hide-details
                />
              </v-col>
            </v-row>

            <v-number-input
              v-model="restoreOptions.expandCookieMinutes"
              label="尝试延长Cookies期限（单位：分钟）"
              :disabled="!restoreOptions.fields?.includes('cookies')"
              persistent-hint
              :min="0"
              :step="1"
            >
              <template #details>
                <v-chip
                  v-for="minutes in ['PT30M', 'PT1H', 'PT12H', 'P1D', 'P1W', 'P1M', 'P6M', 'P1Y']"
                  :key="minutes"
                  class="mr-1"
                  size="small"
                  @click="() => (restoreOptions.expandCookieMinutes = convertIsoDurationToMinutes(minutes))"
                >
                  {{ minutes }}
                </v-chip>
              </template>
            </v-number-input>

            <v-switch v-model="restoreOptions.keepExistUserInfo" color="success" label="保留本地已获取过的用户信息" />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="isDoingRestore"
          color="error"
          prepend-icon="mdi-close-circle"
          variant="text"
          @click="showDialog = false"
        >
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn
          v-if="currentStep == 'restore'"
          color="blue-darken-1"
          prepend-icon="mdi-chevron-left"
          variant="text"
          @click="currentStep = restoreMetadata.type"
        >
          {{ t("common.dialog.prev") }}
        </v-btn>
        <v-btn
          v-if="currentStep != 'restore'"
          :disabled="isEmpty(restoreData)"
          append-icon="mdi-chevron-right"
          color="blue-darken-1"
          variant="text"
          @click="currentStep = 'restore'"
        >
          {{ t("common.dialog.next") }}
        </v-btn>
        <v-btn
          v-if="currentStep == 'restore'"
          :loading="isDoingRestore"
          color="success"
          prepend-icon="mdi-import"
          variant="text"
          @click="doRestore"
        >
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
