<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { addDays, startOfDay } from "date-fns";

import { formatDate } from "@/options/utils.ts";
import { tableCustomFilter } from "@/options/views/Overview/DownloadHistory/utils.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import DownloaderLabel from "@/options/components/DownloaderLabel.vue";
import { setDateRangeByDatePicker, getThisDateUnitRange } from "@/options/directives/useAdvanceFilter.ts";

const showDialog = defineModel<boolean>();

const { t } = useI18n();

const {
  tableWaitFilterRef,
  advanceFilterDictRef,
  stringifyFilterFn,
  resetCountRef,
  resetAdvanceFilterDictFn,
  toggleKeywordStateFn,
} = tableCustomFilter;

function updateTableFilter() {
  tableWaitFilterRef.value = stringifyFilterFn();
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" width="800" @after-enter="resetAdvanceFilterDictFn">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 生成高级过滤词 </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text class="overflow-y-auto">
        <v-container>
          <v-row><v-label>关键词</v-label> </v-row>
          <v-row>
            <v-col>
              <v-combobox
                v-model="advanceFilterDictRef.text.required"
                chips
                hide-details
                label="必要项"
                multiple
              ></v-combobox>
            </v-col>
            <v-col>
              <v-combobox
                v-model="advanceFilterDictRef.text.exclude"
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
              v-for="site in advanceFilterDictRef.siteId.all"
              :key="`${resetCountRef}_${site}`"
              class="pa-0"
              sm="3"
              :cols="6"
            >
              <v-checkbox
                v-model="advanceFilterDictRef.siteId.required"
                :label="site"
                :value="site"
                density="compact"
                hide-details
                indeterminate
                @click.stop="() => toggleKeywordStateFn('siteId', site)"
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
              v-for="downloader in advanceFilterDictRef.downloaderId.all"
              :key="`${resetCountRef}_${downloader}`"
              sm="6"
              :cols="12"
              class="pa-0"
            >
              <v-checkbox
                v-model="advanceFilterDictRef.downloaderId.required"
                :value="downloader"
                density="compact"
                hide-details
                indeterminate
                @click.stop="() => toggleKeywordStateFn('downloaderId', downloader)"
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
                      (advanceFilterDictRef.downloadAt.value = getThisDateUnitRange(
                        dateUnit,
                        advanceFilterDictRef.downloadAt.range,
                      ))
                  "
                >
                  {{ t(`SearchEntity.AdvanceFilterGenerateDialog.date.${dateUnit}`) }}
                </v-chip>
                <v-chip size="x-small">
                  {{ t("SearchEntity.AdvanceFilterGenerateDialog.date.custom") }}
                  <v-menu activator="parent" location="top" :close-on-content-click="false">
                    <v-date-picker
                      :max="addDays(new Date(advanceFilterDictRef.downloadAt.range[1]), 1)"
                      :min="startOfDay(new Date(advanceFilterDictRef.downloadAt.range[0]))"
                      hide-header
                      multiple="range"
                      show-adjacent-months
                      @update:model-value="(v) => (advanceFilterDictRef.downloadAt.value = setDateRangeByDatePicker(v))"
                    ></v-date-picker>
                  </v-menu>
                </v-chip>
              </v-row>
              <v-row>
                <v-range-slider
                  v-model="advanceFilterDictRef.downloadAt.value"
                  :max="advanceFilterDictRef.downloadAt.range[1]"
                  :min="advanceFilterDictRef.downloadAt.range[0]"
                  :step="60 * 1000"
                  :thumb-label="true"
                  :ticks="advanceFilterDictRef.downloadAt.ticks"
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
        <v-btn variant="text" @click="resetAdvanceFilterDictFn">重置搜索词</v-btn>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">取消</v-btn>
        <v-btn color="primary" variant="text" @click="updateTableFilter">生成</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
