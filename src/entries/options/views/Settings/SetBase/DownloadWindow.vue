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
    <v-col md="10" lg="8">
      <v-switch
        v-model="configStore.download.saveDownloadHistory"
        :label="t('SetBase.download.saveDownloadHistory')"
        color="success"
        false-icon="mdi-alert-octagon"
        hide-details
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="10" lg="8">
      <v-label>{{ t("SetBase.download.localDownloadTitle") }}</v-label>
      <v-select
        v-model="configStore.download.localDownloadMethod"
        :label="t('SetBase.download.localDownloadMethod')"
        :items="
          LocalDownloadMethod.map((item) => ({
            title: t(`SetBase.download.localDownloadMethodOptions.${item}`),
            value: item,
          }))
        "
        :hint="t(`SetBase.download.localDownloadMethodOptions.${configStore.download.localDownloadMethod}Tip`)"
        persistent-hint
      />
      <v-switch
        v-model="configStore.download.ignoreSiteDownloadIntervalWhenLocalDownload"
        color="success"
        hide-details
        :label="t('SetBase.download.localDownloadIgnoreInterval')"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="10" lg="8">
      <v-label>{{ t("SetBase.download.pushDownloadServerTitle") }}</v-label>
      <v-switch
        v-model="configStore.download.useQuickSendToClient"
        color="success"
        hide-details
        label="默认使用快速推送"
      />
      <v-alert type="info" variant="tonal">
        启用快速推送后，插件会在推送下载任务时，做以下默认操作：<br />
        1. 展平 下载器和下载目录 选项供直接点击推送。<br />
        2. 鼠标移到选项时，则会暂开标签列表，点击时会额外添加标签信息。<br />
        3. 均采用本地中转模式推送种子，且 `是否自动开始下载`
        等基本设置项和下载器专有配置项值由下载器设置和站点设置决定。<br />
      </v-alert>

      <v-switch
        v-model="configStore.download.saveLastDownloader"
        :label="t('SetBase.download.saveLastDownloader')"
        color="success"
        hide-details
        @update:model-value="(v) => clearLastDownloader(v as unknown as boolean)"
      />
      <v-switch
        v-model="configStore.download.allowDirectSendToClient"
        :label="t('SetBase.download.allowDirectSendToClient')"
        color="warning"
        hide-details
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
