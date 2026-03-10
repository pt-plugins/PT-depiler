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
      <v-switch
        v-model="configStore.download.startupAutoFetchDownloaderStatus"
        :label="t('SetBase.download.startupAutoFetchDownloaderStatus')"
        color="success"
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
        :label="t('SetBase.download.useQuickSendToClient')"
      />
      <v-alert type="info" variant="tonal" v-html="t('SetBase.download.quickSendToClientNote')" />

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
