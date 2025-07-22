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
    <v-col md="10" lg="8">
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
      <v-switch
        v-model="configStore.searchEntity.treatTTQueryAsImdbSearch"
        color="success"
        hide-details
        :label="`是否将 tt\\d{7,8} 的搜索词直接视为 IMDb 搜索`"
      >
        <template #append>
          <v-tooltip max-width="400" location="bottom">
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
