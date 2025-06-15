<script setup lang="ts">
import { onMounted, ref } from "vue";
import { range } from "es-toolkit";

import { EJobType } from "@/background/utils/alarms.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { formatDate } from "@/options/utils.ts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const configStore = useConfigStore();
const metadataStore = useMetadataStore();

const nextFlushUserInfoAt = ref<number>(0);

async function getNextFlushUserInfoAt() {
  const alarm = await chrome.alarms.get(EJobType.FlushUserInfo);
  if (alarm) {
    nextFlushUserInfoAt.value = alarm.scheduledTime;
  }
}

async function save() {
  if (configStore.userInfo.autoReflush.enabled) {
    // noinspection ES6MissingAwait
    getNextFlushUserInfoAt();
  } else {
    nextFlushUserInfoAt.value = 0;
  }
}

defineExpose({
  afterSave: save,
});

onMounted(async () => {
  // noinspection ES6MissingAwait
  getNextFlushUserInfoAt();
});
</script>

<template>
  <v-row>
    <v-col md="6">
      <v-number-input
        v-model="configStore.userInfo.queueConcurrency"
        :max="100"
        :min="1"
        :label="t('userInfo.queueConcurrency')"
      ></v-number-input>

      <!-- 自动刷新 -->
      <v-switch
        v-model="configStore.userInfo.autoReflush.enabled"
        :label="t('userInfo.enableAutoRefresh')"
        color="success"
        hide-details
      />
      <v-row v-if="configStore.userInfo.autoReflush.enabled" class="mt-1 ml-2 mb-2">
        <v-alert type="info" variant="outlined">
          <div class="d-inline-flex align-center text-no-wrap">
            {{ t("userInfo.autoRefresh.every") }}
            <v-select
              v-model="configStore.userInfo.autoReflush.interval"
              :items="range(1, 24)"
              :max="23"
              :min="1"
              class="mx-2"
              density="compact"
              hide-details
            />
            {{ t("userInfo.autoRefresh.hoursLabel") }}
            <p class="font-weight-bold">{{ $t("userInfo.autoRefresh.unrefreshedSite") }}</p>
            {{ t("userInfo.autoRefresh.ofSites") }}
          </div>
          <div class="d-inline-flex align-center text-no-wrap">
            {{ t("userInfo.autoRefresh.retryOnFail") }}
            <v-select
              v-model="configStore.userInfo.autoReflush.retry.max"
              :items="range(0, 6)"
              class="mx-2"
              density="compact"
              hide-details
            />
            {{ t("userInfo.autoRefresh.times") }}
            <v-select
              v-model="configStore.userInfo.autoReflush.retry.interval"
              :items="range(1, 11)"
              class="mx-2"
              density="compact"
              hide-details
            />
            {{ t("userInfo.autoRefresh.minutes") }}
          </div>
          <div class="d-flex align-center justify-end mt-1">
            {{ t("userInfo.autoRefresh.lastFlushTime") }} {{ formatDate(metadataStore.lastUserInfoAutoFlushAt) }} &nbsp;
            {{ t("userInfo.autoRefresh.nextFlushTime") }}
            {{ nextFlushUserInfoAt != 0 ? formatDate(nextFlushUserInfoAt) : "-" }}
            <v-btn
              class="ml-1"
              density="compact"
              icon="mdi-refresh"
              size="x-small"
              variant="text"
              @click="getNextFlushUserInfoAt"
            ></v-btn>
          </div>
        </v-alert>
      </v-row>

      <v-switch
        v-model="configStore.userInfo.showDeadSiteInOverview"
        :label="t('userInfo.showDeadSite')"
        color="success"
        hide-details
      />
      <v-switch
        v-model="configStore.userInfo.showPassedSiteInOverview"
        :label="t('userInfo.showPassedSite')"
        color="success"
        hide-details
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
