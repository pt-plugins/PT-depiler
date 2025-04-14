<script setup lang="ts">
/**
 * 因为 Vuetify 的限制，无法实现  indeterminate -> checked -> unchecked -> indeterminate 的循环切换，
 * 只能由 indeterminate -> checked <-> unchecked 之间切换，当 checked 是为 required，unchecked 时为 exclude，
 * 如果需要忽略，目前只能重置过滤词。
 * refs: https://github.com/vuetifyjs/vuetify/blob/0ca7e93ad011b358591da646fdbd6ebe83625d25/packages/vuetify/src/components/VCheckbox/VCheckboxBtn.tsx#L49-L53
 */
import { filesize } from "filesize";
import { useI18n } from "vue-i18n";
import { computed, reactive, ref, watch } from "vue";
import { uniq, flatten, uniqBy } from "es-toolkit";
import searchQueryParser from "search-query-parser";
import { format, startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear } from "date-fns";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { searchQueryParserOptions } from "./utils.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";

const showDialog = defineModel<boolean>();
const emit = defineEmits(["update:tableFilter", "update:modelValue"]);

const { t } = useI18n();
const runtimeStore = useRuntimeStore();

interface ITextValue {
  required: string[];
  exclude: string[];
}

interface IKeywordValue<T> extends ITextValue {
  all: T[];
}

interface IRangedValue {
  range: [number, number];
  ticks: number[];
  value: [number, number];
}

interface IAdvanceFilterDict {
  text: ITextValue;
  site: IKeywordValue<string>;
  tags: IKeywordValue<{ name: string; color: string }>;
  date: IRangedValue;
  size: IRangedValue;
  seeders: IRangedValue;
  leechers: IRangedValue;
  completed: IRangedValue;
}

type IAdvanceFilterDictKey = keyof IAdvanceFilterDict;

const advanceFilterFormat = {
  date: (value: number) => format(value, "yyyyMMdd'T'HHmmss"),
  size: (value: number) => filesize(value, { spacer: "" }),
};

const advanceFilterDict = reactive<IAdvanceFilterDict>({
  text: { required: [], exclude: [] },
  site: { all: [], required: [], exclude: [] },
  tags: { all: [], required: [], exclude: [] },
  date: { range: [0, 0], ticks: [], value: [0, 0] },
  size: { range: [0, 0], ticks: [], value: [0, 0] },
  seeders: { range: [0, 0], ticks: [], value: [0, 0] },
  leechers: { range: [0, 0], ticks: [], value: [0, 0] },
  completed: { range: [0, 0], ticks: [], value: [0, 0] },
});

function generateRange(data: (number | undefined)[]): [number, number] {
  const numData = data.filter((x) => !isNaN(x as unknown as number)) as number[];
  return [Math.min(...numData), Math.max(...numData)];
}

function getThisDateUnitRange(dateType: "day" | "week" | "month" | "quarter" | "year"): [number, number] {
  const [minDate, maxDate] = advanceFilterDict.date.range;

  const now = new Date();
  const start = {
    day: startOfDay(now),
    week: startOfWeek(now),
    month: startOfMonth(now),
    quarter: startOfQuarter(now),
    year: startOfYear(now),
  }[dateType];

  return [Math.max(minDate, start.getTime()), Math.min(maxDate, now.getTime())];
}

function isThisDateInRange(value: unknown): boolean {
  const valueTime = (value as Date).getTime();
  const [minDate, maxDate] = advanceFilterDict.date.range;
  return valueTime >= minDate && valueTime <= maxDate;
}

function generateRangeField(data: (number | undefined)[]): IRangedValue {
  const range = generateRange(data);
  return { range, ticks: Array.from(new Set(data)) as number[], value: range };
}

function setDateRangeByDatePicker(value: unknown[]) {
  const dateRange = value as Date[];
  advanceFilterDict.date.value = [dateRange[0].getTime(), dateRange[dateRange.length - 1].getTime()];
}

const resetCount = ref<number>(0);
function resetFilter() {
  resetCount.value = +new Date(); // 更新重置计数，触发 vue 更新 site 和 tags 的 v-checkbox ，防止因为 :key 的问题导致无法重置
  const searchResult = runtimeStore.search.searchResult;

  advanceFilterDict.text = { required: [], exclude: [] };

  advanceFilterDict.site = { all: uniq(searchResult.map((x) => x.site)), required: [], exclude: [] };
  advanceFilterDict.tags = {
    all: uniqBy(
      flatten(searchResult.filter((x) => x.tags && x.tags.length > 0).map((x) => x.tags)),
      (x) => x!.name,
    ) as { name: string; color: string }[],
    required: [],
    exclude: [],
  };

  advanceFilterDict.date = generateRangeField(searchResult.map((x) => x.time));
  advanceFilterDict.size = generateRangeField(searchResult.map((x) => x.size));
  advanceFilterDict.seeders = generateRangeField(searchResult.map((x) => x.seeders));
  advanceFilterDict.leechers = generateRangeField(searchResult.map((x) => x.leechers));
  advanceFilterDict.completed = generateRangeField(searchResult.map((x) => x.completed));
}

watch(showDialog, resetFilter);

const stringifyFilter = computed(() => {
  const filters: any = { exclude: {} };

  (["text", "site", "tags"] as IAdvanceFilterDictKey[]).forEach((key) => {
    // @ts-ignore
    if (advanceFilterDict[key].required.length > 0) filters[key] = advanceFilterDict[key].required;
    // @ts-ignore
    if (advanceFilterDict[key].exclude.length > 0) filters.exclude[key] = advanceFilterDict[key].exclude;
  });

  (["date", "size", "seeders", "leechers", "completed"] as IAdvanceFilterDictKey[]).forEach((key) => {
    if (
      // @ts-ignore
      advanceFilterDict[key].value[0] !== advanceFilterDict[key].range[0] ||
      // @ts-ignore
      advanceFilterDict[key].value[1] !== advanceFilterDict[key].range[1]
    ) {
      // @ts-ignore
      const valueFormat = advanceFilterFormat[key] ?? ((x) => x);
      // @ts-ignore
      filters[key] = {
        // @ts-ignore
        from: valueFormat(advanceFilterDict[key].value[0]),
        // @ts-ignore
        to: valueFormat(advanceFilterDict[key].value[1]),
      };
    }
  });

  return searchQueryParser.stringify(filters, searchQueryParserOptions);
});

function toggleState(field: "site" | "tags", value: string) {
  const state = advanceFilterDict[field].required.includes(value);
  if (state) {
    advanceFilterDict[field].exclude.push(value);
  } else {
    advanceFilterDict[field].exclude = advanceFilterDict[field].exclude.filter((x) => x !== value);
  }
}

function updateTableFilter() {
  emit("update:tableFilter", stringifyFilter.value);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey darken-2">
          <v-toolbar-title> 生成高级过滤词 </v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
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
            <v-col v-for="site in advanceFilterDict.site.all" :key="`${resetCount}_${site}`" class="pa-0" :cols="3">
              <v-checkbox
                v-model="advanceFilterDict.site.required"
                :label="site"
                :value="site"
                density="compact"
                hide-details
                indeterminate
                @click.stop="() => toggleState('site', site)"
              >
                <template #label>
                  <SiteFavicon :site-id="site" :size="16" class="mr-2" />
                  <SiteName :class="['text-decoration-none', 'text-black']" :site-id="site" />
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row><v-label>标签</v-label></v-row>
          <v-row>
            <v-col v-for="tag in advanceFilterDict.tags.all" :key="`${resetCount}_${tag.name}`" :cols="2" class="pa-0">
              <v-checkbox
                v-model="advanceFilterDict.tags.required"
                :value="tag.name"
                density="compact"
                hide-details
                indeterminate
                @click.stop="() => toggleState('tags', tag.name)"
              >
                <template #label>
                  <v-chip :color="tag.color" class="mr-1" label size="small" variant="tonal">
                    {{ tag.name }}
                  </v-chip>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-row class="pr-4">
                <v-label>日期</v-label>
                <v-spacer />
                <v-chip
                  v-for="dateUnit in ['day', 'week', 'month', 'quarter', 'year'] as const"
                  :key="dateUnit"
                  size="x-small"
                  class="mr-1"
                  @click="() => (advanceFilterDict.date.value = getThisDateUnitRange(dateUnit))"
                >
                  {{ t(`SearchEntity.AdvanceFilterGenerateDialog.date.${dateUnit}`) }}
                </v-chip>
                <v-chip size="x-small">
                  {{ t("SearchEntity.AdvanceFilterGenerateDialog.date.custom") }}
                  <v-menu activator="parent" location="top" :close-on-content-click="false">
                    <v-date-picker
                      :allowed-dates="isThisDateInRange"
                      :max="new Date(advanceFilterDict.date.range[1])"
                      :min="new Date(advanceFilterDict.date.range[0])"
                      hide-header
                      multiple="range"
                      show-adjacent-months
                      @update:model-value="(v) => setDateRangeByDatePicker(v)"
                    ></v-date-picker>
                  </v-menu>
                </v-chip>
              </v-row>
              <v-row>
                <v-range-slider
                  v-model="advanceFilterDict.date.value"
                  :max="advanceFilterDict.date.range[1]"
                  :min="advanceFilterDict.date.range[0]"
                  :step="60 * 1000"
                  :thumb-label="true"
                  :ticks="advanceFilterDict.date.ticks"
                  class="px-6"
                  hide-details
                  show-ticks="always"
                  tick-size="4"
                >
                  <template #tick-label></template>
                  <template #thumb-label="{ modelValue }">
                    <span class="text-no-wrap">{{ format(modelValue ?? 0, "yyyy-MM-dd HH:mm") }}</span>
                  </template>
                </v-range-slider>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row><v-label>种子大小</v-label></v-row>
              <v-row>
                <v-range-slider
                  v-model="advanceFilterDict.size.value"
                  :max="advanceFilterDict.size.range[1]"
                  :min="advanceFilterDict.size.range[0]"
                  :step="1024 ** 3"
                  :thumb-label="true"
                  :ticks="advanceFilterDict.size.ticks"
                  class="px-6"
                  hide-details
                  show-ticks="always"
                  tick-size="4"
                >
                  <template #tick-label></template>
                  <template #thumb-label="{ modelValue }">
                    <span class="text-no-wrap">{{ filesize(modelValue ?? 0) }}</span>
                  </template>
                </v-range-slider>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-row><v-label>上传人数</v-label></v-row>
              <v-row>
                <v-range-slider
                  v-model="advanceFilterDict.seeders.value"
                  :max="advanceFilterDict.seeders.range[1]"
                  :min="advanceFilterDict.seeders.range[0]"
                  :thumb-label="true"
                  :ticks="advanceFilterDict.seeders.ticks"
                  class="px-6"
                  hide-details
                  show-ticks="always"
                  step="1"
                  tick-size="4"
                >
                  <template #tick-label></template>
                </v-range-slider>
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-row><v-label>下载人数</v-label></v-row>
              <v-row>
                <v-range-slider
                  v-model="advanceFilterDict.leechers.value"
                  :max="advanceFilterDict.leechers.range[1]"
                  :min="advanceFilterDict.leechers.range[0]"
                  :thumb-label="true"
                  :ticks="advanceFilterDict.leechers.ticks"
                  class="px-6"
                  hide-details
                  show-ticks="always"
                  step="1"
                  tick-size="4"
                >
                  <template #tick-label></template>
                </v-range-slider>
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-row><v-label>完成人数</v-label></v-row>
              <v-row>
                <v-range-slider
                  v-model="advanceFilterDict.completed.value"
                  :max="advanceFilterDict.completed.range[1]"
                  :min="advanceFilterDict.completed.range[0]"
                  :thumb-label="true"
                  :ticks="advanceFilterDict.completed.ticks"
                  class="px-6"
                  hide-details
                  show-ticks="always"
                  step="1"
                  tick-size="4"
                >
                  <template #tick-label></template>
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
