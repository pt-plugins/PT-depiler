<script setup lang="ts">
import { ref } from "vue";
import { nanoid } from "nanoid";
import { useI18n } from "vue-i18n";
import { isJSON } from "es-toolkit";
import type { TSiteID } from "@ptd/site";

import type { ISearchSolution } from "@/shared/types/storages/metadata.ts";
import { formValidateRules } from "@/options/utils.ts";

import {
  generateSiteSearchSolution,
  getCategoryName,
  getCategoryOptionName,
  getSiteMetaCategory,
  type TSelectCategory,
} from "./utils.ts";

import SiteName from "@/options/components/SiteName.vue";

const showDialog = defineModel<boolean>();

const { siteId, selectCategory, saveGeneratedSolution } = defineProps<{
  siteId: TSiteID;
  selectCategory: TSelectCategory;
  saveGeneratedSolution: (searchSolution: ISearchSolution) => void;
}>();

const { t } = useI18n();

const formValid = ref<boolean>(false);
const searchSolution = ref<ISearchSolution>({} as ISearchSolution);
const searchSolutionEntryRequestConfig = ref<string>("");

async function onEnter() {
  // 首先按照默认值生成一次基本情况
  searchSolution.value = await generateSiteSearchSolution(siteId, selectCategory);

  if (searchSolution.value.id === "default") {
    searchSolution.value.id = nanoid(); // 如果是默认id，则生成一个新的id
    searchSolution.value.name = ""; // 清空name
  } else {
    // 为这个 searchSolution 生成默认 name
    const siteMetaCategory = await getSiteMetaCategory(siteId);

    searchSolution.value.name = Object.entries(searchSolution.value.selectedCategories!)
      .map(([category, value]) => {
        return (
          getCategoryName(siteMetaCategory, category) + ": " + getCategoryOptionName(siteMetaCategory, category, value)
        );
      })
      .join(";");

    // 脱钩 selectedCategories，因为 name 已经包含了这些信息
    delete searchSolution.value.selectedCategories;
  }

  // 生成 requestConfig 的 JSON 字符串
  searchSolutionEntryRequestConfig.value = JSON.stringify(
    searchSolution.value.searchEntries?.[searchSolution.value.id]?.requestConfig ?? { params: {}, data: {} },
    null,
    2,
  );
}

function doSubmit() {
  if (!formValid.value) return;

  // 解析 requestConfig
  try {
    const requestConfig = JSON.parse(searchSolutionEntryRequestConfig.value);
    if (searchSolution.value.searchEntries && searchSolution.value.id) {
      searchSolution.value.searchEntries[searchSolution.value.id].requestConfig = requestConfig;
    }
  } catch (e) {
    console.error("请求配置 JSON 解析失败", e);
    return;
  }

  // 回调父组件
  saveGeneratedSolution(searchSolution.value);

  // 关闭对话框
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="800" @after-enter="onEnter">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="primary">
          <v-toolbar-title> 自定义搜索方案 [<SiteName :site-id="siteId" tag="span" class="" />] </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-form v-model="formValid" fast-fail validate-on="eager input">
          <v-text-field v-model="searchSolution.name" :rules="[formValidateRules.require()]" label="方案名称" />

          <v-textarea
            label="请求配置"
            v-model="searchSolutionEntryRequestConfig"
            hint="请按JSON格式配置请求参数"
            :rules="[formValidateRules.require(), (v) => isJSON(v) || '必须是合法的JSON格式']"
            persistent-hint
            auto-grow
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn
          :disabled="!formValid"
          color="success"
          prepend-icon="mdi-check-circle-outline"
          variant="text"
          @click="doSubmit"
        >
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
