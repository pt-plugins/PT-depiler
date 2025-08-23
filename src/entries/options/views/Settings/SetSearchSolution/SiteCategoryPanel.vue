<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import type { ISearchCategories, TSiteID } from "@ptd/site";

import {
  generateSiteSearchSolution,
  getSiteMetaCategory,
  isDefaultCategory,
  radioDefault,
  type TSelectCategory,
} from "./utils.ts";

const props = defineProps<{
  siteId: TSiteID;
}>();

const emit = defineEmits(["update:solution"]);

const { t } = useI18n();

const selectCategory = ref<TSelectCategory>({});
const siteMetaCategory = shallowRef<ISearchCategories[]>([]);

function resetSelectCategory() {
  for (const category of siteMetaCategory.value) {
    selectCategory.value[category.key] = category.cross ? [] : radioDefault;
  }
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

async function generateSolution() {
  const searchSolution = generateSiteSearchSolution(props.siteId, selectCategory.value!);

  emit("update:solution", searchSolution);

  // 重置本 expansion panel 的数据
  resetSelectCategory();
}

onMounted(async () => {
  siteMetaCategory.value = await getSiteMetaCategory(props.siteId);
  resetSelectCategory();
});
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
                <v-row v-if="category.cross && category.cross.mode" no-gutters>
                  <v-col cols="12">
                    <v-checkbox
                      :indeterminate="
                        (selectCategory[category.key] as any[])?.length > 0 && checkBtnIndeterminate(category)
                      "
                      :model-value="!checkBtnIndeterminate(category)"
                      hide-details
                      @update:model-value="(e) => clickAllBtn(category, e as boolean)"
                    >
                      <template #label>
                        <p class="font-weight-bold">
                          {{ t("common.checkbox.all") }}
                        </p>
                        <p v-if="!checkBtnIndeterminate(category)" class="text-red-lighten-1">
                          &nbsp;{{ t("setSite.spDialog.selectAllNotice") }}
                        </p>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <!-- 多选类别选项 -->
                  <template v-if="category.cross && category.cross.mode">
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
                        <v-radio :label="'站点默认'" :value="radioDefault"></v-radio>
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
          {{ t("setSite.spDialog.noDefNotice") }}
        </div>
      </v-col>
      <v-col align-self="center">
        <v-row justify="end">
          <v-btn color="red" icon="mdi-cached" variant="text" @click="() => resetSelectCategory()" />
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
