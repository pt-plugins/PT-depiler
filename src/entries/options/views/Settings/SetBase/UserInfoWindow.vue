<script setup lang="ts">
import { onMounted, ref } from "vue";
import { range } from "es-toolkit";
import { useI18n } from "vue-i18n";
import { sendMessage } from "@/messages.ts";
import { EJobType } from "@/background/utils/alarms.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { formatDate } from "@/options/utils.ts";

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
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
  await configStore.$save();
  await sendMessage("setFlushUserInfoJob", undefined);
  runtimeStore.showSnakebar("保存成功", { color: "success" });
  if (configStore.userInfo.autoReflush.enabled) {
    // noinspection ES6MissingAwait
    getNextFlushUserInfoAt();
  } else {
    nextFlushUserInfoAt.value = 0;
  }
}

onMounted(async () => {
  // noinspection ES6MissingAwait
  getNextFlushUserInfoAt();
});
</script>

<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col md="6">
          <v-number-input
            v-model="configStore.userInfo.queueConcurrency"
            :max="100"
            :min="1"
            label="请求队列长度"
          ></v-number-input>

          <!-- 自动刷新 -->
          <v-switch
            v-model="configStore.userInfo.autoReflush.enabled"
            :label="`是否启用后台定时刷新？`"
            color="success"
            hide-details
          />
          <v-row v-if="configStore.userInfo.autoReflush.enabled" class="mt-1 ml-2">
            <v-alert type="info" variant="outlined">
              <div class="d-inline-flex align-center text-no-wrap">
                每隔
                <v-select
                  v-model="configStore.userInfo.autoReflush.interval"
                  :items="range(1, 24)"
                  :max="23"
                  :min="1"
                  class="mx-2"
                  density="compact"
                  hide-details
                />
                小时，自动刷新一次当天
                <p class="font-weight-bold">未刷新过</p>
                的站点
              </div>
              <div class="d-inline-flex align-center text-no-wrap">
                如果刷新失败，则重试
                <v-select
                  v-model="configStore.userInfo.autoReflush.retry.max"
                  :items="range(0, 6)"
                  class="mx-2"
                  density="compact"
                  hide-details
                />
                次，每次间隔
                <v-select
                  v-model="configStore.userInfo.autoReflush.retry.interval"
                  :items="range(1, 11)"
                  class="mx-2"
                  density="compact"
                  hide-details
                />
                分钟。
              </div>
              <div class="d-flex align-center justify-end mt-1">
                最近一次刷新时间: {{ formatDate(metadataStore.lastUserInfoAutoFlushAt) }} &nbsp; 下一次刷新时间:
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
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-row class="ml-2 my-1">
        <v-btn color="green" prepend-icon="mdi-check-circle-outline" variant="elevated" @click="save">
          {{ t("common.save") }}
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss"></style>
