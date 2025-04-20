<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { useConfigStore } from "@/options/stores/config.ts";

import { definedLangMetaData } from "@/options/plugins/i18n.ts";
import { supportTheme } from "@/shared/storages/types/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const { t } = useI18n();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();

async function save() {
  await configStore.$save();
  runtimeStore.showSnakebar("保存成功", { color: "success" });
}
</script>

<template>
  <v-card>
    <v-card-text>
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
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-row class="ml-2 my-1">
        <v-btn color="green" variant="elevated" prepend-icon="mdi-check-circle-outline" @click="save">
          {{ t("common.save") }}
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss"></style>
