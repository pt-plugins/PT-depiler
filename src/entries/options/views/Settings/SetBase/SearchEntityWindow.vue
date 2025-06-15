<script setup lang="ts">
import { useConfigStore } from "@/options/stores/config.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

async function clearLastFilter(v: boolean) {
  if (!v) {
    await metadataStore.setLastSearchFilter("");
  }
}
</script>

<template>
  <v-row>
    <v-col md="6">
      <v-label>{{ t("route.Settings.SearchConfig.siteSearchConfig") }}</v-label>
      <v-number-input
        v-model="configStore.searchEntity.queueConcurrency"
        :max="100"
        :min="1"
        controlVariant="default"
        hide-details
        :label="t('route.Settings.SearchConfig.siteQueueConcurrency')"
      />
      <v-switch
        v-model="configStore.searchEntity.saveLastFilter"
        color="success"
        hide-details
        :label="t('route.Settings.SearchConfig.saveLastSearchFilter')"
        @update:model-value="(v) => clearLastFilter(v as boolean)"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col md="6">
      <v-label>{{ t("route.Settings.SearchConfig.mediaServerSearchConfig") }}</v-label>
      <v-number-input
        v-model="configStore.mediaServerEntity.queueConcurrency"
        :max="100"
        :min="1"
        controlVariant="default"
        :label="t('route.Settings.SearchConfig.mediaQueueConcurrency')"
      />
      <v-number-input
        v-model="configStore.mediaServerEntity.searchLimit"
        :max="500"
        :min="1"
        :step="configStore.mediaServerEntity.searchLimit >= 100 ? 10 : 1"
        controlVariant="default"
        :label="t('route.Settings.SearchConfig.mediaSearchLimit')"
        :messages="t('route.Settings.SearchConfig.mediaSearchLimitMessage')"
      />
      <v-switch
        v-model="configStore.mediaServerEntity.autoSearchWhenMount"
        color="success"
        hide-details
        :label="t('route.Settings.SearchConfig.autoLoadInitialMediaWall')"
      />
      <v-switch
        v-model="configStore.mediaServerEntity.autoSearchMoreWhenScroll"
        color="success"
        hide-details
        :label="t('route.Settings.SearchConfig.autoLoadMoreMediaOnScroll')"
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
