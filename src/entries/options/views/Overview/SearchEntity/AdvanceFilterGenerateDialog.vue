<script setup lang="ts">
/**
 * 因为 Vuetify 的限制，无法实现  indeterminate -> checked -> unchecked -> indeterminate 的循环切换，
 * 只能由 indeterminate -> checked <-> unchecked 之间切换，当 checked 是为 required，unchecked 时为 exclude，
 * 如果需要忽略，目前只能重置过滤词。
 * refs: https://github.com/vuetifyjs/vuetify/blob/0ca7e93ad011b358591da646fdbd6ebe83625d25/packages/vuetify/src/components/VCheckbox/VCheckboxBtn.tsx#L49-L53
 */
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { uniq, flatten, uniqBy } from "es-toolkit";
import { addDays, startOfDay } from "date-fns";

import { formatDate, formatSize } from "@/options/utils.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import { tableCustomFilter } from "@/options/views/Overview/SearchEntity/utils.ts";
import { generateRangeField } from "@/options/directives/useAdvanceFilter.ts";

const showDialog = defineModel<boolean>();
const emit = defineEmits(["update:tableFilter"]);

const { t } = useI18n();
const runtimeStore = useRuntimeStore();

const { advanceFilterDictRef, stringifyFilterFn } = tableCustomFilter;

const resetCount = ref<number>(0);
function resetFilter() {
  resetCount.value = +new Date(); // 更新重置计数，触发 vue 更新 site 和 tags 的 v-checkbox ，防止因为 :key 的问题导致无法重置
  const searchResult = runtimeStore.search.searchResult;

  advanceFilterDictRef.value.text = { required: [], exclude: [] };

  advanceFilterDictRef.value.site = { all: uniq(searchResult.map((x) => x.site)), required: [], exclude: [] };
  advanceFilterDictRef.value.tags = {
    all: uniqBy(
      flatten(searchResult.filter((x) => x.tags && x.tags.length > 0).map((x) => x.tags)),
      (x) => x!.name,
    ) as { name: string; color: string }[],
    required: [],
    exclude: [],
  };

  advanceFilterDictRef.value.time = generateRangeField(searchResult.map((x) => x.time));
  advanceFilterDictRef.value.size = generateRangeField(searchResult.map((x) => x.size));
  advanceFilterDictRef.value.seeders = generateRangeField(searchResult.map((x) => x.seeders));
  advanceFilterDictRef.value.leechers = generateRangeField(searchResult.map((x) => x.leechers));
  advanceFilterDictRef.value.completed = generateRangeField(searchResult.map((x) => x.completed));
}

function toggleState(field: "site" | "tags", value: string) {
  const state = advanceFilterDictRef.value[field].required!.includes(value);
  if (state) {
    advanceFilterDictRef.value[field].exclude!.push(value);
  } else {
    advanceFilterDictRef.value[field].exclude! = advanceFilterDictRef.value[field].exclude!.filter((x) => x !== value);
  }
}

function updateTableFilter() {
  emit("update:tableFilter", stringifyFilterFn());
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable @after-enter="resetFilter">
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey-darken-2">
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
            <v-col v-for="site in advanceFilterDictRef.site.all" :key="`${resetCount}_${site}`" class="pa-0" :cols="3">
              <v-checkbox
                v-model="advanceFilterDictRef.site.required"
                :label="site"
                :value="site"
                density="compact"
                hide-details
                indeterminate
                @click.stop="() => toggleState('site', site)"
              >
                <template #label>
                  <SiteFavicon :site-id="site" :size="16" class="mr-2" />
                  <SiteName :class="['text-decoration-none', 'text-black']" :site-id="site" tag="span" />
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row><v-label>标签</v-label></v-row>
          <v-row>
            <v-col
              v-for="tag in advanceFilterDictRef.tags.all"
              :key="`${resetCount}_${tag.name}`"
              :cols="2"
              class="pa-0"
            >
              <v-checkbox
                v-model="advanceFilterDictRef.tags.required"
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
                  @click="
                    () =>
                      (advanceFilterDictRef.time.value = getThisDateUnitRange(
                        dateUnit,
                        advanceFilterDictRef.date.range,
                      ))
                  "
                >
                  {{ t(`SearchEntity.AdvanceFilterGenerateDialog.date.${dateUnit}`) }}
                </v-chip>
                <v-chip size="x-small">
                  {{ t("SearchEntity.AdvanceFilterGenerateDialog.date.custom") }}
                  <v-menu activator="parent" location="top" :close-on-content-click="false">
                    <v-date-picker
                      :max="addDays(new Date(advanceFilterDictRef.time.range[1]), 1)"
                      :min="startOfDay(new Date(advanceFilterDictRef.time.range[0]))"
                      hide-header
                      multiple="range"
                      show-adjacent-months
                      @update:model-value="(v) => (advanceFilterDictRef.time.value = setDateRangeByDatePicker(v))"
                    ></v-date-picker>
                  </v-menu>
                </v-chip>
              </v-row>
              <v-row>
                <v-range-slider
                  v-model="advanceFilterDictRef.time.value"
                  :max="advanceFilterDictRef.time.range[1]"
                  :min="advanceFilterDictRef.time.range[0]"
                  :step="60 * 1000"
                  :thumb-label="true"
                  :ticks="advanceFilterDictRef.time.ticks"
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
            <v-col cols="6">
              <v-row><v-label>种子大小</v-label></v-row>
              <v-row>
                <v-range-slider
                  v-model="advanceFilterDictRef.size.value"
                  :max="advanceFilterDictRef.size.range[1]"
                  :min="advanceFilterDictRef.size.range[0]"
                  :step="1024 ** 3"
                  :thumb-label="true"
                  :ticks="advanceFilterDictRef.size.ticks"
                  class="px-6"
                  hide-details
                  show-ticks="always"
                  tick-size="4"
                >
                  <template #tick-label></template>
                  <template #thumb-label="{ modelValue }">
                    <span class="text-no-wrap">{{ formatSize(modelValue ?? 0) }}</span>
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
                  v-model="advanceFilterDictRef.seeders.value"
                  :max="advanceFilterDictRef.seeders.range[1]"
                  :min="advanceFilterDictRef.seeders.range[0]"
                  :thumb-label="true"
                  :ticks="advanceFilterDictRef.seeders.ticks"
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
                  v-model="advanceFilterDictRef.leechers.value"
                  :max="advanceFilterDictRef.leechers.range[1]"
                  :min="advanceFilterDictRef.leechers.range[0]"
                  :thumb-label="true"
                  :ticks="advanceFilterDictRef.leechers.ticks"
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
                  v-model="advanceFilterDictRef.completed.value"
                  :max="advanceFilterDictRef.completed.range[1]"
                  :min="advanceFilterDictRef.completed.range[0]"
                  :thumb-label="true"
                  :ticks="advanceFilterDictRef.completed.ticks"
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
