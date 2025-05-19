<script setup lang="ts">
import { nanoid } from "nanoid";
import { useConfigStore } from "@/options/stores/config.ts";
import { ref, shallowRef, watch } from "vue";
import { useThrottledRefHistory } from "@vueuse/core";
import { REPO_NAME } from "~/helper.ts";
import JSZip from "jszip";
import RestorePtppUserDataDialog from "@/options/views/Settings/SetBase/RestorePtppUserDataDialog.vue";
import type { IPtppDumpUserInfo } from "@/shared/types.ts";

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
      alert("文件格式错误，请检查是否按正确步骤（关闭备份加密功能）导出备份。");
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
    <v-col md="6">
      <v-label class="my-2">基本配置</v-label>
      <v-alert class="mb-2" type="info" variant="tonal">
        注意：密钥仅保存在当前浏览器，不会备份，请妥善保存；加密后如密钥丢失将无法恢复数据。留空表示不做加密。
      </v-alert>
      <v-text-field
        v-model="encryptionKey"
        :append-inner-icon="showEncryptionKey ? 'mdi-eye' : 'mdi-eye-off'"
        :label="`备份文件加密、解密密钥`"
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
            title="恢复上一个密钥"
            @click="undoEncryptionKey"
          >
            <v-badge v-if="history.length > 1" :content="history.length - 1" :max="9" floating>
              <v-icon color="green" icon="mdi-arrow-left" />
            </v-badge>
            <v-icon v-else icon="mdi-arrow-left" />
          </v-btn>
          <v-btn color="warning" icon="mdi-key" variant="text" title="随机生成" @click="randomEncryptionKey" />
        </template>
      </v-text-field>
    </v-col>
  </v-row>

  <v-row>
    <v-col md="6">
      <v-label class="my-2">PT-Plugin-Plus 配置导入</v-label>
      <v-alert class="mb-2" type="warning" variant="tonal">
        <span class="font-weight-bold">
          {{ REPO_NAME }} 只能导入原 PT-Plugin-Plus 的用户历史数据信息，其他配置文件不支持导入。<br />
          在导入之前，请做好以下准备：<br />
        </span>
        1. 请先备份好当前 {{ REPO_NAME }} 的配置文件。 <br />
        2. 在 {{ REPO_NAME }} 的站点设置中添加需要恢复的站点。（如果没有添加站点，对应的用户历史数据会被忽略）<br />
        3. 在 PT-Plugin-Plus 中，<span class="font-weight-bold">关闭备份加密功能</span>，并导出本地备份文件。
        其应该是一个名为 <code>PT-Plugin-Plus-Backup-yyyy-MM-DD_hh-mm-ss.zip</code> 的 zip 压缩文件。 <br />
        4. 将压缩包 或者 从压缩包中解压出的 <code>userdatas.json</code> 文件，上传到下面的输入框中。 <br />
      </v-alert>
      <v-file-input
        v-model="ptppUserDataFile"
        accept="application/zip, application/json"
        show-size
        label="选择 PTPP 备份文件"
        @update:model-value="loadPTPPBackupFile"
      />
    </v-col>
  </v-row>

  <RestorePtppUserDataDialog v-model="showRestorePtppUserDataDialog" :ptpp-user-data="parsedPtppUserData!" />
</template>

<style scoped lang="scss"></style>
