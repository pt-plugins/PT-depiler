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
        :label="t('SetBase.download.saveDownloadHistory')"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="6">
      <v-label>{{ t("SetBase.download.localDownloadTitle") }}</v-label>
      <v-select
        v-model="configStore.download.localDownloadMethod"
        :label="t('SetBase.download.localDownloadMethod')"
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
        :label="t('SetBase.download.localDownloadIgnoreInterval')"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="6">
      <v-label>{{ t("SetBase.download.pushDownloadServerTitle") }}</v-label>
      <v-switch
        v-model="configStore.download.saveLastDownloader"
        color="success"
        hide-details
        :label="t('SetBase.download.saveLastDownloader')"
        @update:model-value="(v) => clearLastDownloader(v as unknown as boolean)"
      />
      <v-switch
        v-model="configStore.download.allowDirectSendToClient"
        color="warning"
        hide-details
        :label="t('SetBase.download.allowDirectSendToClient')"
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
