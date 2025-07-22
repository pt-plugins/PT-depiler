<script setup lang="ts">
import JSZip from "jszip";
import { nanoid } from "nanoid";
import { ref, shallowRef, watch } from "vue";
import { useThrottledRefHistory } from "@vueuse/core";
import { useI18n } from "vue-i18n";

import { useConfigStore } from "@/options/stores/config.ts";
import type { IPtppDumpUserInfo } from "@/shared/types.ts";

import RestorePtppUserDataDialog from "./RestorePtppUserDataDialog.vue";

import { REPO_NAME } from "~/helper.ts";

const { t } = useI18n();
const configStore = useConfigStore();

const showEncryptionKey = ref<boolean>(false);
const encryptionKey = shallowRef<string>(configStore.backup.encryptionKey);
const { history, undo: undoEncryptionKey } = useThrottledRefHistory(encryptionKey, { throttle: 50 });
watch(encryptionKey, (newValue) => {
  configStore.backup.encryptionKey = newValue; // 将 encryptionKey 同步回 configStore
});

const showRestorePtppUserDataDialog = ref<boolean>(false);
const ptppUserDataFile = shallowRef<File>();
const parsedPtppUserData = shallowRef<IPtppDumpUserInfo>();
async function loadPTPPBackupFile() {
  if (ptppUserDataFile.value instanceof File) {
    let ptppUserDataFileRawContent;
    if (ptppUserDataFile.value.name.match(/^PT-Plugin-Plus-Backup-.+\.zip$/)) {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(ptppUserDataFile.value);
      ptppUserDataFileRawContent = await zipContent.file("userdatas.json")?.async("string");
    } else if (ptppUserDataFile.value.name == "userdatas.json") {
      ptppUserDataFileRawContent = await ptppUserDataFile.value.text();
    }

    try {
      if (!ptppUserDataFileRawContent || !ptppUserDataFileRawContent.startsWith("{")) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error("Invalid file format");
      }
      parsedPtppUserData.value = JSON.parse(ptppUserDataFileRawContent);
      console.log(parsedPtppUserData.value);
      showRestorePtppUserDataDialog.value = true;
    } catch (e) {
      alert(t("ptppSettings.invalidFileFormat"));
    } finally {
      ptppUserDataFile.value = undefined; // 清空 File
    }
  }
}

function randomEncryptionKey() {
  encryptionKey.value = nanoid();
}
</script>

<template>
  <v-row>
    <v-col md="10" lg="8">
      <v-label class="my-2">{{ t("ptppSettings.basicConfig") }}</v-label>
      <v-alert class="mb-2" type="info" variant="tonal">
        {{ t("ptppSettings.saveKeyNotice") }}
      </v-alert>
      <v-text-field
        v-model="encryptionKey"
        :append-inner-icon="showEncryptionKey ? 'mdi-eye' : 'mdi-eye-off'"
        :label="t('ptppSettings.encryptionKeyLabel')"
        :type="showEncryptionKey ? 'text' : 'password'"
        hide-details
        @click:append-inner="showEncryptionKey = !showEncryptionKey"
      >
        <template #append>
          <v-btn
            :disabled="history.length <= 1"
            color="green"
            variant="text"
            icon
            :title="t('ptppSettings.undoKeyTitle')"
            @click="undoEncryptionKey"
          >
            <v-badge v-if="history.length > 1" :content="history.length - 1" :max="9" floating>
              <v-icon color="green" icon="mdi-arrow-left" />
            </v-badge>
            <v-icon v-else icon="mdi-arrow-left" />
          </v-btn>
          <v-btn
            color="warning"
            icon="mdi-key"
            variant="text"
            :title="t('ptppSettings.randomGenTitle')"
            @click="randomEncryptionKey"
          />
        </template>
      </v-text-field>
    </v-col>
  </v-row>

  <v-row>
    <v-col md="10" lg="8">
      <v-label class="my-2">{{ t("ptppSettings.importConfigTitle") }}</v-label>
      <v-alert class="mb-2" type="warning" variant="tonal">
        <span class="font-weight-bold">
          {{ t("ptppSettings.importConfigInfoLine1", { repoName: REPO_NAME }) }}<br />
          {{ t("ptppSettings.importConfigInfoPrep") }}<br />
        </span>
        1. {{ t("ptppSettings.importStep1", { repoName: REPO_NAME }) }}<br />
        2. {{ t("ptppSettings.importStep2", { repoName: REPO_NAME }) }}<br />
        3. <span class="font-weight-bold" v-html="t('ptppSettings.importStep3')"></span><br />
        4. {{ t("ptppSettings.importStep4") }}<br />
      </v-alert>
      <v-file-input
        v-model="ptppUserDataFile"
        accept="application/zip, application/json"
        show-size
        :label="t('ptppSettings.selectBackupFile')"
        @update:model-value="loadPTPPBackupFile"
      />
    </v-col>
  </v-row>

  <RestorePtppUserDataDialog v-model="showRestorePtppUserDataDialog" :ptpp-user-data="parsedPtppUserData!" />
</template>

<style scoped lang="scss"></style>
