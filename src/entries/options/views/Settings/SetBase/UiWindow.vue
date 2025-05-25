<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { useConfigStore } from "@/options/stores/config.ts";
import { definedLangMetaData } from "@/options/plugins/i18n.ts";
import { supportTheme } from "@/shared/types.ts";

const { t } = useI18n();
const configStore = useConfigStore();
</script>

<template>
  <v-row>
    <v-col md="6">
      <!-- 插件语言设置 -->
      <v-select v-model="configStore.lang" :label="t('SetBase.ui.changeLanguage')" :items="definedLangMetaData" />

      <!-- 明亮模式设置 -->
      <v-select v-model="configStore.theme" :label="t('SetBase.ui.displayMode.index')" :items="supportTheme">
        <template #selection="{ item }">
          {{ t("SetBase.ui.displayMode." + item.raw) }}
        </template>

        <template #item="{ item, props }">
          <v-list-item v-bind="props" :title="t('SetBase.ui.displayMode.' + item.raw)" />
        </template>
      </v-select>

      <v-switch
        v-model="configStore.saveTableBehavior"
        color="success"
        hide-details
        label="记忆部分表格的 表头列展示、排序、分页 等信息"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
