<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { useConfigStore } from "@/options/stores/config.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { LocalDownloadMethod } from "@/shared/types.ts";

const { t } = useI18n();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

async function clearLastDownloader(v: boolean) {
  if (!v) {
    await metadataStore.setLastDownloader({});
  }
}
</script>

<template>
  <v-row>
    <v-col md="6">
      <v-switch
        v-model="configStore.download.saveDownloadHistory"
        color="success"
        false-icon="mdi-alert-octagon"
        hide-details
        label="是否保存下载历史（如非必要请勿关闭此功能）"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="6">
      <v-label>本地下载</v-label>
      <v-select
        v-model="configStore.download.localDownloadMethod"
        label="本地下载方式"
        :items="
          LocalDownloadMethod.map((item) => ({
            title: t(`SetBase.download.localDownloadMethod.${item}`),
            value: item,
          }))
        "
        :hint="t(`SetBase.download.localDownloadMethod.${configStore.download.localDownloadMethod}Tip`)"
        persistent-hint
      />
      <v-switch
        v-model="configStore.download.ignoreSiteDownloadIntervalWhenLocalDownload"
        color="success"
        hide-details
        label="本地下载时忽略站点下载间隔限制"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="6">
      <v-label>下载服务器推送</v-label>
      <v-switch
        v-model="configStore.download.saveLastDownloader"
        color="success"
        hide-details
        label="保存上一次使用的下载服务器设置"
        @update:model-value="(v) => clearLastDownloader(v as unknown as boolean)"
      />
      <v-switch
        v-model="configStore.download.allowDirectSendToClient"
        color="warning"
        hide-details
        label="是否允许直接将链接（而不是种子文件）发送到下载服务器（如非必要请勿启用）"
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
