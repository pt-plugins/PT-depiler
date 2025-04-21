<script setup lang="ts">
import { ref } from "vue";
import { nanoid } from "nanoid";
import { computedAsync } from "@vueuse/core";
import { cloneDeep, toMerged } from "es-toolkit";
import { isEmpty, set } from "es-toolkit/compat";

import { useMetadataStore } from "@/options/stores/metadata.ts";

import { log } from "~/helper.ts";

import type { ISearchSolution } from "@/storage.ts";
import type { IAdvancedSearchRequestConfig, ISearchCategories, TSelectSearchCategoryValue, TSiteID } from "@ptd/site";

const props = defineProps<{
  siteId: TSiteID;
}>();

const emit = defineEmits(["update:solution"]);

const metadataStore = useMetadataStore();

const selectCategory = ref<Record<ISearchCategories["key"], TSelectSearchCategoryValue | symbol>>({});
const siteMetaCategory = computedAsync(async () => {
  return getSiteMetaCategory();
}, []);

const radioDefault = Symbol("default");

async function getSiteMetaCategory() {
  const siteMetaCategory = await metadataStore.getSiteMergedMetadata(props.siteId, "category");
  for (const category of siteMetaCategory!) {
    selectCategory.value[category.key] = category.cross ? [] : radioDefault;
  }
  return siteMetaCategory;
}

const showPanel = ref<any[]>([]);

function checkBtnIndeterminate(category: ISearchCategories): boolean {
  const field = selectCategory.value[category.key];
  if (Array.isArray(field)) {
    return field.length !== category.options.length;
  }
  return false;
}

function clickAllBtn(field: ISearchCategories, toggle: boolean) {
  let fieldSp: any = [];
  if (toggle) {
    fieldSp = toggle ? field.options.map((sp) => sp.value) : [];
  }

  selectCategory.value[field.key] = fieldSp;
}

function isDefaultCategory(field: TSelectSearchCategoryValue | symbol) {
  return Array.isArray(field) ? field.length === 0 : field === radioDefault;
}

async function generateSolution() {
  let id = nanoid(); // 通过这种panel生成的solution，其 entries 只有一个值，所以可以直接将id作为entries的id
  const searchSolution: ISearchSolution = {
    id,
    siteId: props.siteId,
    selectedCategories: {},
    searchEntries: {},
  };

  // 将selectCategory按照siteMetaCategory的顺序转换为searchEntries，并合并成一个规则，合并方法参照ISearchCategories的说明
  let entriesConfig: IAdvancedSearchRequestConfig = {};
  for (const category of siteMetaCategory.value!) {
    const field = cloneDeep(selectCategory.value[category.key]);

    // 跳过默认值（未设置）
    if (isDefaultCategory(field)) {
      continue;
    }

    searchSolution.selectedCategories![category.key] = field as TSelectSearchCategoryValue;

    if (category.generateRequestConfig) {
      entriesConfig = toMerged(entriesConfig, category.generateRequestConfig(field as TSelectSearchCategoryValue));
    } else {
      const updatePath = `requestConfig.${category.keyPath ?? "params"}`;
      let fieldKey = category.key;
      if (category.cross) {
        if (category.cross.key) {
          fieldKey = category.cross.key;
        }
        if (category.cross.mode === "append") {
          for (const option of field as (string | number)[]) {
            set(entriesConfig, `${updatePath}.${fieldKey}${option}`, 1);
          }
        } else if (category.cross.mode === "appendQuote") {
          for (const option of field as (string | number)[]) {
            set(entriesConfig, `${updatePath}.${fieldKey}[${option}]`, 1);
          }
        } else if (category.cross.mode === "comma") {
          set(entriesConfig, `${updatePath}.${fieldKey}`, (field as (string | number)[]).join(","));
        } else {
          // category.cross.mode === "brackets"
          set(entriesConfig, `${updatePath}.${fieldKey}`, field);
        }
      } else {
        set(entriesConfig, `${updatePath}.${fieldKey}`, field);
      }
    }
  }

  if (!isEmpty(entriesConfig)) {
    searchSolution.searchEntries![id] = entriesConfig;
  } else {
    searchSolution.id = "default";
    searchSolution.searchEntries = {};
  }

  log("generateSolution", searchSolution);
  emit("update:solution", searchSolution);

  // 重置本 expansion panel 的数据
  await getSiteMetaCategory();
}
</script>

<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-col class="v-col-category-select">
        <v-expansion-panels v-if="siteMetaCategory!.length > 0" v-model="showPanel" multiple>
          <v-expansion-panel v-for="category in siteMetaCategory" :key="category.key">
            <v-expansion-panel-title>
              {{ category.name }}
              <span class="ml-1 text-grey-darken-1">{{ category.notes ?? "" }}</span>
              <v-spacer />
              <v-chip :color="isDefaultCategory(selectCategory[category.key]) ? '' : 'info'" label>
                {{ category.key }}
              </v-chip>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-container class="pa-0">
                <!-- 如果该类别支持多选，则显示全选按钮 -->
                <v-row v-if="category.cross?.mode" no-gutters>
                  <v-col cols="12">
                    <v-checkbox
                      :indeterminate="selectCategory[category.key]?.length > 0 && checkBtnIndeterminate(category)"
                      :model-value="!checkBtnIndeterminate(category)"
                      hide-details
                      @update:model-value="(e) => clickAllBtn(category, e as boolean)"
                    >
                      <template #label>
                        <p class="font-weight-bold">
                          {{ $t("common.checkbox.all") }}
                        </p>
                        <p v-if="!checkBtnIndeterminate(category)" class="text-red-lighten-1">
                          &nbsp;{{ $t("setSite.spDialog.selectAllNotice") }}
                        </p>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <!-- 多选类别选项 -->
                  <template v-if="category.cross?.mode">
                    <v-col
                      v-for="options in category.options"
                      :key="options.value"
                      class="py-0"
                      cols="12"
                      lg="2"
                      md="4"
                      sm="6"
                    >
                      <v-checkbox
                        v-model="selectCategory[category.key]"
                        :label="options.name"
                        :value="options.value"
                        hide-details
                      />
                    </v-col>
                  </template>
                  <!-- 单选类别选项 -->
                  <template v-else>
                    <v-radio-group
                      v-model="selectCategory[category.key]"
                      class="justify-space-between"
                      hide-details
                      inline
                    >
                      <!-- 增加一个代表默认的值，说明该类别什么都不选（尊重站点默认）。（不然的话，只能全部重置才能取消选择） -->
                      <v-col class="py-0" cols="12" lg="2" md="4" sm="6">
                        <v-radio :label="'default'" :value="radioDefault"></v-radio>
                      </v-col>
                      <v-col v-for="options in category.options" class="py-0" cols="12" lg="2" md="4" sm="6">
                        <v-radio :key="options.value" :label="options.name" :value="options.value" />
                      </v-col>
                    </v-radio-group>
                  </template>
                </v-row>
              </v-container>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <div v-else>
          {{ $t("setSite.spDialog.noDefNotice") }}
        </div>
      </v-col>
      <v-col align-self="center">
        <v-row justify="end">
          <v-btn color="red" icon="mdi-cached" variant="text" @click="() => getSiteMetaCategory()" />
        </v-row>
        <v-row justify="end">
          <v-btn color="blue" icon="mdi-arrow-right-bold" variant="text" @click="() => generateSolution()" />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.v-col-category-select {
  max-width: calc(100% - 48px);
  flex-basis: calc(100% - 48px);
}
</style>
