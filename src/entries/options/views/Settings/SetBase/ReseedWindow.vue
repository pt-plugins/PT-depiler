<script setup lang="ts">
/**
 * 设置页「辅种」tab：全局辅种配置 + 各辅种命中源接入。
 * 卡片顺序：全局辅种配置 → 本地文件树对比（LocalCrossSeed）→ NexusPHP pieces-hash 直查 → IYUU。
 * 三种辅种方案分别由 IyuuCard 内的三张卡渲染；本组件提供全局与各源开关。
 */
import { watch } from "vue";
import { useI18n } from "vue-i18n";

import { useConfigStore } from "@/options/stores/config.ts";

import IyuuCard from "./IyuuCard.vue";

const { t } = useI18n();
const configStore = useConfigStore();

// 配置即改即存（本 tab 无全局保存按钮，usesGlobalSave=false）
watch(
  () => [
    configStore.reseed.enabled,
    configStore.reseed.showKeepUploadTask,
    configStore.reseed.enableIyuus,
    configStore.reseed.enableNexus,
    configStore.reseed.enableLocal,
  ],
  () => {
    configStore.$save();
  },
);
</script>

<template>
  <div>
    <!-- 1. 全局辅种配置 -->
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
          class="mb-2"
        />

        <v-divider class="my-3" />

        <div class="text-body-medium mb-2">{{ t("SetBase.reseed.sourcesTitle") }}</div>
        <v-switch
          v-model="configStore.reseed.enableLocal"
          :label="t('SetBase.reseed.enableLocalLabel')"
          :hint="t('SetBase.reseed.enableLocalHint')"
          persistent-hint
          color="primary"
          hide-details
          class="mb-2"
        />
        <v-switch
          v-model="configStore.reseed.enableNexus"
          :label="t('SetBase.reseed.enableNexusLabel')"
          :hint="t('SetBase.reseed.enableNexusHint')"
          persistent-hint
          color="primary"
          hide-details
          class="mb-2"
        />
        <v-switch
          v-model="configStore.reseed.enableIyuus"
          :label="t('SetBase.reseed.enableIyuusLabel')"
          :hint="t('SetBase.reseed.enableIyuusHint')"
          persistent-hint
          color="primary"
          hide-details
        />
      </v-card-text>
    </v-card>

    <!-- 2~4. 本地文件树对比 / NexusPHP 直查 / IYUU（顺序由 IyuuCard 内部决定） -->
    <IyuuCard />
  </div>
</template>

<style scoped lang="scss"></style>
