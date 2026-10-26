<script setup lang="ts">
/**
 * 因为 Vuetify 的限制，无法实现  indeterminate -> checked -> unchecked -> indeterminate 的循环切换，
 * 只能由 indeterminate -> checked <-> unchecked 之间切换，当 checked 是为 required，unchecked 时为 exclude，
 * 如果需要忽略，目前只能重置过滤词。
 * refs: https://github.com/vuetifyjs/vuetify/blob/0ca7e93ad011b358591da646fdbd6ebe83625d25/packages/vuetify/src/components/VCheckbox/VCheckboxBtn.tsx#L49-L53
 */
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { addDays, startOfDay } from "date-fns";
import { ETorrentStatus, getTorrentVolumeFactors, preDefinedTorrentTagNameSet, sortTorrentTags } from "@ptd/site";

import { formatDate, formatSize } from "@/options/utils.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { tableCustomFilter } from "@/options/views/Overview/SearchEntity/utils/filter.ts";
import { setDateRangeByDatePicker, getThisDateUnitRange } from "@/options/directives/useAdvanceFilter.ts";

import SiteName from "@/options/components/SiteName.vue";
import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";

const showDialog = defineModel<boolean>();

const { t } = useI18n();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();

const {
  advanceItemPropsRef,
  advanceFilterDictRef,
  reBuildFilterCountRef,
  toggleKeywordStateFn,
  reBuildAdvanceFilter,
  updateTableFilterValueFn,
} = tableCustomFilter;

// 种子状态选项 - 使用 i18n 支持
const statusOptions = [
  { value: ETorrentStatus.unknown, label: t("torrent.status.unknown"), icon: "mdi-help-circle", color: "grey" },
  { value: ETorrentStatus.downloading, label: t("torrent.status.downloading"), icon: "mdi-arrow-down", color: "info" },
  { value: ETorrentStatus.seeding, label: t("torrent.status.seeding"), icon: "mdi-arrow-up", color: "success" },
  { value: ETorrentStatus.inactive, label: t("torrent.status.inactive"), icon: "mdi-wifi-strength-off", color: "grey" },
  { value: ETorrentStatus.completed, label: t("torrent.status.completed"), icon: "mdi-check", color: "grey" },
];

const torrentTags = computed(() => sortTorrentTags(advanceItemPropsRef.value.tags));

const showHiddenTags = ref(false);

const filteredTorrentTags = computed(() => {
  const hiddenNames = configStore.searchEntifyControl.hiddenTagNames || [];
  return torrentTags.value.filter((tag) => showHiddenTags.value || !hiddenNames.includes(tag.name));
});

/**
 * 列表渲染上限：种子/标签数量很大时，一次性挂载成百上千个 v-checkbox（还有 favicon / SiteName 组件）
 * 会让 v-dialog 打开卡住数秒。首屏只渲染一部分，其余用「显示全部」展开。
 */
const MAX_SITE_OPTIONS = 60;
const MAX_TAG_OPTIONS = 80;

const showAllSites = ref(false);
const showAllTags = ref(false);

const siteOptions = computed<string[]>(() => advanceItemPropsRef.value.site ?? []);
const displayedSites = computed(() =>
  showAllSites.value ? siteOptions.value : siteOptions.value.slice(0, MAX_SITE_OPTIONS),
);
const displayedTorrentTags = computed(() =>
  showAllTags.value ? filteredTorrentTags.value : filteredTorrentTags.value.slice(0, MAX_TAG_OPTIONS),
);

/** 结果里确实存在优惠（免费/折扣）或非正常上传倍率时，才显示对应的滑块 */
const hasPromoData = ref(false);
const hasUploadData = ref(false);

/** 「仅 tags」模式下不显示优惠相关的滑块（与原行为一致） */
const showPromoFilters = computed(() => configStore.searchEntifyControl.promotionDisplay !== "tags");

function updateTableFilter() {
  updateTableFilterValueFn();
  showDialog.value = false;
}

function enterDialog() {
  reBuildAdvanceFilter();
  // 每次打开都从「收合」状态开始
  showAllSites.value = false;
  showAllTags.value = false;

  // 单次线性扫描结果集判断是否需要优惠/上传倍率筛选，成本远低于直接构建 props
  let hasDownloadPromo = false;
  let hasUploadPromo = false;
  for (const item of runtimeStore.search.searchResult) {
    // 旧快照可能只有 tags 而没有 factor，用 getTorrentVolumeFactors 兜底反推
    const { downloadVolumeFactor: download, uploadVolumeFactor: upload } = getTorrentVolumeFactors(item);
    if (Number.isFinite(download) && (download as number) < 1) hasDownloadPromo = true;
    if (Number.isFinite(upload) && upload !== 1) hasUploadPromo = true;
    if (hasDownloadPromo && hasUploadPromo) break;
  }

  hasPromoData.value = hasDownloadPromo;
  hasUploadData.value = hasUploadPromo;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" scrollable @after-enter="enterDialog">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title>{{ t("common.AdvanceFilterGenerateDialog.title") }}</v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-container class="pa-0">
          <v-row gap="0">
            <v-label>{{ t("common.AdvanceFilterGenerateDialog.keywords") }}</v-label>
          </v-row>
          <v-row class="mt-0">
            <v-col cols="12" md="6">
              <v-combobox
                v-model="advanceFilterDictRef.text.required"
                chips
                hide-details
                :label="t('common.AdvanceFilterGenerateDialog.required')"
                multiple
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-combobox
                v-model="advanceFilterDictRef.text.exclude"
                chips
                hide-details
                :label="t('common.AdvanceFilterGenerateDialog.exclude')"
                multiple
              ></v-combobox>
            </v-col>
          </v-row>

          <v-row gap="0" class="align-center">
            <v-label>{{ t("common.AdvanceFilterGenerateDialog.site") }}</v-label>
            <v-spacer />
            <v-btn
              v-if="siteOptions.length > MAX_SITE_OPTIONS"
              color="info"
              size="x-small"
              variant="text"
              @click="showAllSites = !showAllSites"
            >
              {{
                showAllSites
                  ? t("common.AdvanceFilterGenerateDialog.collapse")
                  : t("common.AdvanceFilterGenerateDialog.showAll", [siteOptions.length])
              }}
            </v-btn>
          </v-row>
          <v-row gap="0">
            <v-col
              v-for="site in displayedSites"
              :key="`${reBuildFilterCountRef}_${site}`"
              class="pa-0"
              cols="6"
              md="3"
              sm="4"
            >
              <v-checkbox
                v-model="advanceFilterDictRef.site.required"
                :label="site"
                :value="site"
                density="compact"
                hide-details
                indeterminate
                @click.stop="() => toggleKeywordStateFn('site', site)"
              >
                <template #label>
                  <SiteFavicon :site-id="site" :size="16" class="mr-2" />
                  <SiteName :class="['text-decoration-none']" :site-id="site" tag="span" />
                </template>
              </v-checkbox>
            </v-col>
          </v-row>

          <template v-if="configStore.searchEntifyControl.showTorrentTag">
            <v-row gap="0" class="align-center">
              <v-label>{{ t("SearchEntity.AdvanceFilterGenerateDialog.tags") }}</v-label>
              <v-spacer />
              <v-btn
                v-if="filteredTorrentTags.length > MAX_TAG_OPTIONS"
                color="info"
                size="x-small"
                variant="text"
                @click="showAllTags = !showAllTags"
              >
                {{
                  showAllTags
                    ? t("common.AdvanceFilterGenerateDialog.collapse")
                    : t("common.AdvanceFilterGenerateDialog.showAll", [filteredTorrentTags.length])
                }}
              </v-btn>
              <v-btn
                v-if="configStore.searchEntifyControl.hiddenTagNames?.length"
                variant="text"
                size="x-small"
                color="info"
                @click="showHiddenTags = !showHiddenTags"
              >
                {{
                  showHiddenTags
                    ? t("SearchEntity.AdvanceFilterGenerateDialog.hideHiddenTags")
                    : t("SearchEntity.AdvanceFilterGenerateDialog.showHiddenTags")
                }}
              </v-btn>
            </v-row>
            <v-row gap="0">
              <v-col
                v-for="tag in displayedTorrentTags"
                :key="`${reBuildFilterCountRef}_${tag.name}`"
                class="pa-0"
                cols="4"
                md="2"
                sm="3"
              >
                <v-checkbox
                  v-model="advanceFilterDictRef.tags.required"
                  :value="tag.name"
                  density="compact"
                  hide-details
                  indeterminate
                  @click.stop="() => toggleKeywordStateFn('tags', tag.name)"
                >
                  <template #label>
                    <v-chip
                      :color="tag.color"
                      :prepend-icon="preDefinedTorrentTagNameSet.includes(tag.name) ? 'mdi-pin mdi-rotate-45' : ''"
                      class="mr-1"
                      label
                      size="small"
                      variant="tonal"
                    >
                      {{ tag.name }}
                    </v-chip>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
          </template>
          <v-row gap="0"
            ><v-label>{{ t("SearchEntity.AdvanceFilterGenerateDialog.status") }}</v-label></v-row
          >
          <v-row gap="0">
            <v-col
              v-for="status in statusOptions"
              :key="`${reBuildFilterCountRef}_${status.value}`"
              class="pa-0"
              cols="6"
              md="3"
              sm="4"
            >
              <v-checkbox
                v-model="advanceFilterDictRef.status.required"
                :value="status.value"
                density="compact"
                hide-details
                indeterminate
                @click.stop="() => toggleKeywordStateFn('status', status.value)"
              >
                <template #label>
                  <v-icon :color="status.color" :icon="status.icon" size="small" class="mr-2" />
                  <span>{{ status.label }}</span>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row gap="0">
            <v-col cols="12" md="6">
              <v-row gap="0" class="pr-4">
                <v-label>{{ t("common.AdvanceFilterGenerateDialog.date") }}</v-label>
                <v-spacer />
                <v-chip
                  v-for="dateUnit in ['day', 'week', 'month', 'quarter', 'year'] as const"
                  :key="dateUnit"
                  size="x-small"
                  class="mr-1"
                  @click="
                    () => (advanceFilterDictRef.time = getThisDateUnitRange(dateUnit, advanceItemPropsRef.time.range))
                  "
                >
                  {{ t(`common.AdvanceFilterGenerateDialog.dateUnit.${dateUnit}`) }}
                </v-chip>
                <v-chip size="x-small">
                  {{ t("common.AdvanceFilterGenerateDialog.dateUnit.custom") }}
                  <v-menu activator="parent" location="top" :close-on-content-click="false">
                    <v-date-picker
                      :max="addDays(new Date(advanceItemPropsRef.time.range[1]), 1)"
                      :min="startOfDay(new Date(advanceItemPropsRef.time.range[0]))"
                      hide-header
                      multiple="range"
                      show-adjacent-months
                      @update:model-value="(v) => (advanceFilterDictRef.time = setDateRangeByDatePicker(v))"
                    ></v-date-picker>
                  </v-menu>
                </v-chip>
              </v-row>
              <v-row gap="0">
                <v-range-slider
                  v-model="advanceFilterDictRef.time"
                  :max="advanceItemPropsRef.time.range[1]"
                  :min="advanceItemPropsRef.time.range[0]"
                  :step="60 * 1000"
                  :thumb-label="true"
                  :ticks="advanceItemPropsRef.time.ticks"
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
            <v-col cols="12" md="6">
              <v-row gap="0"
                ><v-label>{{ t("SearchEntity.AdvanceFilterGenerateDialog.size") }}</v-label></v-row
              >
              <v-row gap="0">
                <v-range-slider
                  v-model="advanceFilterDictRef.size"
                  :max="advanceItemPropsRef.size.range[1]"
                  :min="advanceItemPropsRef.size.range[0]"
                  :step="1024 ** 3"
                  :thumb-label="true"
                  :ticks="advanceItemPropsRef.size.ticks"
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
          <v-row gap="0">
            <v-col cols="12" md="4">
              <v-row
                ><v-label>{{ t("SearchEntity.AdvanceFilterGenerateDialog.seeders") }}</v-label></v-row
              >
              <v-row gap="0">
                <v-range-slider
                  v-model="advanceFilterDictRef.seeders"
                  :max="advanceItemPropsRef.seeders.range[1]"
                  :min="advanceItemPropsRef.seeders.range[0]"
                  :thumb-label="true"
                  :ticks="advanceItemPropsRef.seeders.ticks"
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
            <v-col cols="12" md="4">
              <v-row
                ><v-label>{{ t("SearchEntity.AdvanceFilterGenerateDialog.leechers") }}</v-label></v-row
              >
              <v-row gap="0">
                <v-range-slider
                  v-model="advanceFilterDictRef.leechers"
                  :max="advanceItemPropsRef.leechers.range[1]"
                  :min="advanceItemPropsRef.leechers.range[0]"
                  :thumb-label="true"
                  :ticks="advanceItemPropsRef.leechers.ticks"
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
            <v-col cols="12" md="4">
              <v-row
                ><v-label>{{ t("SearchEntity.AdvanceFilterGenerateDialog.completed") }}</v-label></v-row
              >
              <v-row gap="0">
                <v-range-slider
                  v-model="advanceFilterDictRef.completed"
                  :max="advanceItemPropsRef.completed.range[1]"
                  :min="advanceItemPropsRef.completed.range[0]"
                  :thumb-label="true"
                  :ticks="advanceItemPropsRef.completed.ticks"
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

          <!-- 优惠筛选：上传计费比例（倍率） + 下载计费比例（0% = 免费，100% = 正常） -->
          <v-row v-if="showPromoFilters && (hasPromoData || hasUploadData)" gap="0">
            <v-col v-if="hasUploadData" :cols="12" :md="hasPromoData ? 6 : 12">
              <v-row gap="0">
                <v-label>{{ t("common.AdvanceFilterGenerateDialog.promoUpload") }}</v-label>
              </v-row>
              <v-row gap="0">
                <v-range-slider
                  v-model="advanceFilterDictRef.uploadVolumeFactor"
                  :max="3"
                  :min="0"
                  :step="0.5"
                  :thumb-label="true"
                  :ticks="[0, 1, 2, 3]"
                  class="px-6"
                  hide-details
                  show-ticks="always"
                  tick-size="4"
                >
                  <template #tick-label></template>
                  <template #thumb-label="{ modelValue }">
                    <span class="text-no-wrap">×{{ modelValue ?? 0 }}</span>
                  </template>
                </v-range-slider>
              </v-row>
            </v-col>
            <v-col v-if="hasPromoData" :cols="12" :md="hasUploadData ? 6 : 12">
              <v-row gap="0">
                <v-label>{{ t("common.AdvanceFilterGenerateDialog.promo") }}</v-label>
              </v-row>
              <v-row gap="0">
                <v-range-slider
                  v-model="advanceFilterDictRef.downloadVolumeFactor"
                  :max="1"
                  :min="0"
                  :step="0.05"
                  :thumb-label="true"
                  :ticks="[0, 0.25, 0.5, 0.75, 1]"
                  class="px-6"
                  hide-details
                  show-ticks="always"
                  tick-size="4"
                >
                  <template #tick-label></template>
                  <template #thumb-label="{ modelValue }">
                    <span class="text-no-wrap">{{ Math.round((modelValue ?? 0) * 100) }}%</span>
                  </template>
                </v-range-slider>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn variant="text" @click="() => reBuildAdvanceFilter(true)">{{
          t("common.AdvanceFilterGenerateDialog.reset")
        }}</v-btn>
        <v-spacer />
        <v-btn color="error" variant="text" @click="showDialog = false">{{ t("common.dialog.cancel") }}</v-btn>
        <v-btn color="primary" variant="text" @click="updateTableFilter">{{
          t("common.AdvanceFilterGenerateDialog.generate")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
