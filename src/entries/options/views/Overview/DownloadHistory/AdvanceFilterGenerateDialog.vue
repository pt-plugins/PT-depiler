<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { uniq } from "es-toolkit";
import { addDays, startOfDay } from "date-fns";

import { formatDate } from "@/options/utils.ts";
import type { ITorrentDownloadMetadata } from "@/shared/storages/types/indexdb.ts";
import {
  generateRangeField,
  getThisDateUnitRange,
  setDateRangeByDatePicker,
} from "@/options/directives/useAdvanceFilter.ts";
import { tableCustomFilter } from "@/options/views/Overview/DownloadHistory/utils.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import DownloaderLabel from "@/options/components/DownloaderLabel.vue";

const showDialog = defineModel<boolean>();
const { records } = defineProps<{
  records: ITorrentDownloadMetadata[];
}>();
const emit = defineEmits(["update:tableFilter"]);

const { t } = useI18n();

const { advanceFilterDictRef: advanceFilterDict, stringifyFilterFn } = tableCustomFilter;

const resetCount = ref<number>(0);
function resetFilter() {
  resetCount.value = +new Date(); // 更新重置计数，触发 vue 更新 site 和 tags 的 v-checkbox ，防止因为 :key 的问题导致无法重置

  advanceFilterDict.value.text = { required: [], exclude: [] };
  advanceFilterDict.value.siteId = { all: uniq(records.map((x) => x.siteId)), required: [], exclude: [] };
  advanceFilterDict.value.downloaderId = { all: uniq(records.map((x) => x.downloaderId)), required: [], exclude: [] };
  advanceFilterDict.value.downloadStatus = {
    all: uniq(records.map((x) => x.downloadStatus)),
    required: [],
    exclude: [],
  };
  advanceFilterDict.value.downloadAt = generateRangeField(records.map((x) => x.downloadAt));
}

function toggleState(field: "siteId" | "downloaderId" | "downloadStatus", value: string) {
  const state = advanceFilterDict.value[field].required.includes(value);
  if (state) {
    advanceFilterDict.value[field].exclude!.push(value);
  } else {
    advanceFilterDict.value[field].exclude! = advanceFilterDict.value[field].exclude!.filter((x) => x !== value);
  }
}

function updateTableFilter() {
  emit("update:tableFilter", stringifyFilterFn());
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" width="800" @after-enter="resetFilter">
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 生成高级过滤词 </v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text class="overflow-y-auto">
        <v-container>
          <v-row><v-label>关键词</v-label> </v-row>
          <v-row>
            <v-col>
              <v-combobox
                v-model="advanceFilterDict.text.required"
                chips
                hide-details
                label="必要项"
                multiple
              ></v-combobox>
            </v-col>
            <v-col>
              <v-combobox
                v-model="advanceFilterDict.text.exclude"
                chips
                hide-details
                label="排除项"
                multiple
              ></v-combobox>
            </v-col>
          </v-row>
          <v-row><v-label>站点</v-label></v-row>
          <v-row>
            <v-col
              v-for="site in advanceFilterDict.siteId.all"
              :key="`${resetCount}_${site}`"
              class="pa-0"
              sm="3"
              :cols="6"
            >
              <v-checkbox
                v-model="advanceFilterDict.siteId.required"
                :label="site"
                :value="site"
                density="compact"
                hide-details
                indeterminate
                @click.stop="() => toggleState('siteId', site)"
              >
                <template #label>
                  <SiteFavicon :site-id="site" :size="16" class="mr-2" />
                  <SiteName :class="['text-decoration-none', 'text-black']" :site-id="site" tag="span" />
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row><v-label>下载器</v-label></v-row>
          <v-row>
            <v-col
              v-for="downloader in advanceFilterDict.downloaderId.all"
              :key="`${resetCount}_${downloader}`"
              sm="6"
              :cols="12"
              class="pa-0"
            >
              <v-checkbox
                v-model="advanceFilterDict.downloaderId.required"
                :value="downloader"
                density="compact"
                hide-details
                indeterminate
                @click.stop="() => toggleState('downloaderId', downloader)"
              >
                <template #label>
                  <DownloaderLabel :downloader="downloader" />
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
          <!-- TODO 下载状态 -->
          <v-row>
            <v-col cols="12">
              <v-row class="pr-4">
                <v-label>日期</v-label>
                <v-spacer />
                <v-chip
                  v-for="dateUnit in ['day', 'week', 'month', 'quarter', 'year'] as const"
                  :key="dateUnit"
                  size="x-small"
                  class="mr-1"
                  @click="
                    () =>
                      (advanceFilterDict.downloadAt.value = getThisDateUnitRange(
                        dateUnit,
                        advanceFilterDict.downloadAt.range,
                      ))
                  "
                >
                  {{ t(`SearchEntity.AdvanceFilterGenerateDialog.date.${dateUnit}`) }}
                </v-chip>
                <v-chip size="x-small">
                  {{ t("SearchEntity.AdvanceFilterGenerateDialog.date.custom") }}
                  <v-menu activator="parent" location="top" :close-on-content-click="false">
                    <v-date-picker
                      :max="addDays(new Date(advanceFilterDict.downloadAt.range[1]), 1)"
                      :min="startOfDay(new Date(advanceFilterDict.downloadAt.range[0]))"
                      hide-header
                      multiple="range"
                      show-adjacent-months
                      @update:model-value="(v) => (advanceFilterDict.downloadAt.value = setDateRangeByDatePicker(v))"
                    ></v-date-picker>
                  </v-menu>
                </v-chip>
              </v-row>
              <v-row>
                <v-range-slider
                  v-model="advanceFilterDict.downloadAt.value"
                  :max="advanceFilterDict.downloadAt.range[1]"
                  :min="advanceFilterDict.downloadAt.range[0]"
                  :step="60 * 1000"
                  :thumb-label="true"
                  :ticks="advanceFilterDict.downloadAt.ticks"
                  class="px-6"
                  hide-details
                  show-ticks="always"
                  tick-size="4"
                >
                  <template #tick-label></template>
                  <template #thumb-label="{ modelValue }">
                    <span class="text-no-wrap">{{ formatDate(modelValue ?? 0, "yyyy-MM-dd HH:mm") }}</span>
                  </template>
                </v-range-slider>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text" @click="resetFilter">重置搜索词</v-btn>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">取消</v-btn>
        <v-btn color="primary" variant="text" @click="updateTableFilter">生成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
