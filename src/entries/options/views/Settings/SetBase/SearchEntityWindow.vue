<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { isEmpty } from "es-toolkit/compat";

import { useConfigStore } from "@/options/stores/config.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

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
    <v-col md="10" lg="8">
      <v-label>{{ t("route.Settings.SearchConfig.siteSearchConfig") }}</v-label>
      <v-number-input
        v-model="configStore.searchEntity.queueConcurrency"
        :label="t('route.Settings.SearchConfig.siteQueueConcurrency')"
        :max="25"
        :min="1"
        controlVariant="default"
        hide-details
      />
      <v-switch
        v-model="configStore.searchEntity.allowSingleSiteSearch"
        :disabled="isEmpty(metadataStore.sites)"
        :label="`是否允许单一站点搜索`"
        color="success"
        hide-details
      />
      <v-switch
        v-model="configStore.searchEntity.saveLastFilter"
        :label="t('route.Settings.SearchConfig.saveLastSearchFilter')"
        color="success"
        hide-details
        @update:model-value="(v) => clearLastFilter(v as boolean)"
      />
      <v-switch
        v-model="configStore.searchEntity.treatTTQueryAsImdbSearch"
        :label="`是否将 tt\\d{7,8} 的搜索词直接视为 IMDb 搜索`"
        color="success"
        hide-details
      >
        <template #append>
          <v-tooltip location="bottom" max-width="400">
            <template v-slot:activator="{ props }">
              <v-icon color="info" icon="mdi-help-circle" v-bind="props" />
            </template>
            关闭后，你需要使用 `imdb|tt12345678` 的格式来进行 IMDb 搜索。
          </v-tooltip>
        </template>
      </v-switch>
    </v-col>
  </v-row>

  <v-row>
    <v-col md="10" lg="8">
      <v-label>{{ t("route.Settings.SearchConfig.mediaServerSearchConfig") }}</v-label>
      <v-number-input
        v-model="configStore.mediaServerEntity.queueConcurrency"
        :label="t('route.Settings.SearchConfig.mediaQueueConcurrency')"
        :max="25"
        :min="1"
        controlVariant="default"
      />
      <v-number-input
        v-model="configStore.mediaServerEntity.searchLimit"
        :label="t('route.Settings.SearchConfig.mediaSearchLimit')"
        :max="500"
        :messages="t('route.Settings.SearchConfig.mediaSearchLimitMessage')"
        :min="1"
        :step="configStore.mediaServerEntity.searchLimit >= 100 ? 10 : 1"
        controlVariant="default"
      />
      <v-switch
        v-model="configStore.mediaServerEntity.autoSearchWhenMount"
        :label="t('route.Settings.SearchConfig.autoLoadInitialMediaWall')"
        color="success"
        hide-details
      />
      <v-switch
        v-model="configStore.mediaServerEntity.autoSearchMoreWhenScroll"
        :label="t('route.Settings.SearchConfig.autoLoadMoreMediaOnScroll')"
        color="success"
        hide-details
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
