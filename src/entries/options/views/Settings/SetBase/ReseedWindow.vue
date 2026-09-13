<script setup lang="ts">
/**
 * 设置页「辅种」tab：全局辅种配置 + 各辅种方案接入（IYUU 中心 / NexusPHP 直查…）。
 * 原「IYUU 辅种」窗口内容经 <IyuuWindow /> 内嵌保留。
 */
import { watch } from "vue";
import { useI18n } from "vue-i18n";

import { useConfigStore } from "@/options/stores/config.ts";

import IyuuWindow from "./IyuuWindow.vue";

const { t } = useI18n();
const configStore = useConfigStore();

// 配置即改即存（本 tab 无全局保存按钮，usesGlobalSave=false）
watch(
  () => [configStore.reseed.enabled, configStore.reseed.showKeepUploadTask],
  () => {
    configStore.$save();
  },
);
</script>

<template>
  <div>
    <!-- 全局辅种配置 -->
    <v-card class="mb-4">
      <v-card-title>{{ t("SetBase.reseed.globalTitle") }}</v-card-title>
      <v-card-text>
        <v-switch
          v-model="configStore.reseed.enabled"
          :label="t('SetBase.reseed.enabledLabel')"
          :hint="t('SetBase.reseed.enabledHint')"
          persistent-hint
          color="green"
          hide-details
          class="mb-2"
        />
        <v-switch
          v-model="configStore.reseed.showKeepUploadTask"
          :label="t('SetBase.reseed.showKeepUploadTaskLabel')"
          :hint="t('SetBase.reseed.showKeepUploadTaskHint')"
          persistent-hint
          color="primary"
          hide-details
        />
      </v-card-text>
    </v-card>

    <!-- 各辅种方案接入 -->
    <IyuuWindow />
  </div>
</template>

<style scoped lang="scss"></style>
