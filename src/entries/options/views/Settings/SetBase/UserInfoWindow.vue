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
    <v-col md="10" lg="8">
      <v-label>用户数据刷新</v-label>

      <v-number-input
        v-model="configStore.userInfo.queueConcurrency"
        :max="25"
        :min="1"
        :label="t('userInfo.queueConcurrency')"
      ></v-number-input>

      <v-switch
        v-model="configStore.userInfo.alwaysPickLastUserInfo"
        :label="t('userInfo.alwaysPickLastUserInfo')"
        color="success"
        hide-details
      />

      <!-- 自动刷新 -->
      <v-switch
        v-model="configStore.userInfo.autoReflush.enabled"
        :label="t('userInfo.enableAutoRefresh')"
        color="success"
        hide-details
      />
      <v-row v-if="configStore.userInfo.autoReflush.enabled" class="mt-1 ml-2 mb-2">
        <v-alert type="info" variant="outlined">
          <div class="d-inline-flex align-center text-no-wrap mb-1">
            • 每日最早刷新时间
            <v-text-field
              :model-value="configStore.userInfo.autoReflush.afterTime"
              class="mx-2"
              density="compact"
              hide-details
              readonly
            >
              <v-dialog activator="parent" width="auto">
                <v-time-picker v-model="configStore.userInfo.autoReflush.afterTime" format="24hr"></v-time-picker>
              </v-dialog>
            </v-text-field>
          </div>
          <br />
          <div class="d-inline-flex align-center text-no-wrap">
            • {{ t("userInfo.autoRefresh.every") }}
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
            <p class="font-weight-bold">{{ t("userInfo.autoRefresh.unrefreshedSite") }}</p>
            {{ t("userInfo.autoRefresh.ofSites") }}
          </div>
          <br />
          <div class="d-inline-flex align-center text-no-wrap">
            • {{ t("userInfo.autoRefresh.retryOnFail") }}
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

      <!-- 自动延长cookies -->
      <v-switch
        v-model="configStore.autoExtendCookies.enabled"
        :label="t('userInfo.autoExtendCookies.enabled')"
        color="success"
        hide-details
      />
      <v-row v-if="configStore.autoExtendCookies.enabled" class="mt-1 ml-2 mb-2">
        <v-alert type="info" variant="outlined">
          <div class="d-inline-flex align-center text-no-wrap mb-2">
            {{ t("userInfo.autoExtendCookies.triggerThreshold") }}:
            <v-select
              v-model="configStore.autoExtendCookies.triggerThreshold"
              :items="range(1, 4)"
              :max="3"
              :min="1"
              class="mx-2"
              density="compact"
              hide-details
            />
            {{ t("userInfo.autoExtendCookies.weeks") }}
          </div>
          <div class="d-inline-flex align-center text-no-wrap mb-2">
            {{ t("userInfo.autoExtendCookies.extensionDuration") }}:
            <v-select
              v-model="configStore.autoExtendCookies.extensionDuration"
              :items="range(1, 13)"
              :max="12"
              :min="1"
              class="mx-2"
              density="compact"
              hide-details
            />
            {{ t("userInfo.autoExtendCookies.months") }}
          </div>
        </v-alert>
      </v-row>

      <v-label>用户信息展示</v-label>

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
