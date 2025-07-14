<script setup lang="ts">
import { buildInPtGenApi } from "@ptd/social";

import { useConfigStore } from "@/options/stores/config.ts";

import { useI18n } from "vue-i18n";

const { t } = useI18n();
const configStore = useConfigStore();
</script>

<template>
  <v-row>
    <v-col md="6">
      <v-label>{{ t("socialConfig.basicConfig") }}</v-label>
      <v-number-input
        v-model="configStore.socialSiteInformation.cacheDay"
        :label="t('socialConfig.cacheValidityDays')"
        :min="3"
        :messages="t('socialConfig.cacheShortWarning')"
      />
      <v-number-input
        v-model="configStore.socialSiteInformation.timeout"
        :label="t('socialConfig.requestTimeoutMs')"
        hide-details
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="6">
      <v-label>{{ t("socialConfig.ptgenConfig") }}</v-label>
      <v-switch
        v-model="configStore.socialSiteInformation.preferPtGen"
        :label="t('socialConfig.preferPtgenLabel')"
        color="success"
        hide-details
      />
      <v-combobox
        v-if="configStore.socialSiteInformation.preferPtGen"
        v-model="configStore.socialSiteInformation.ptGenEndpoint"
        :items="buildInPtGenApi"
        :return-object="false"
        item-title="provider"
        item-value="url"
        :label="t('socialConfig.ptgenApiAddress')"
        :messages="t('socialConfig.ptgenApiMessages')"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="6">
      <v-label>{{ t("socialConfig.mediaRatingConfig") }}</v-label>
      <v-text-field
        v-model="configStore.socialSiteInformation.socialSite!.anidb.client"
        :label="t('socialConfig.anidbClientId')"
        clearable
        :messages="t('socialConfig.anidbClientMessages')"
      >
        <template #prepend>
          <v-avatar image="/icons/social/anidb.png" />
        </template>
      </v-text-field>

      <v-text-field
        v-model="configStore.socialSiteInformation.socialSite!.bangumi.apikey"
        :label="t('socialConfig.bangumiApiKey')"
        clearable
        :messages="t('socialConfig.bangumiApiMessages')"
      >
        <template #prepend>
          <v-avatar image="/icons/social/bangumi.png" />
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
