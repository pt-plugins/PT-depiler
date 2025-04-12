<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { useUIStore } from "@/options/stores/ui";

import { definedLangMetaData } from "@/options/plugins/i18n.ts";
import { supportTheme } from "@/shared/storages/ui.ts";

const { t } = useI18n();

const uiStore = useUIStore();
</script>

<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col>
          <!-- 插件语言设置 -->
          <v-select v-model="uiStore.lang" :label="t('SetBase.ui.changeLanguage')" :items="definedLangMetaData" />

          <!-- 明亮模式设置 -->
          <v-select v-model="uiStore.theme" :label="t('SetBase.ui.displayMode.index')" :items="supportTheme">
            <template #selection="{ item }">
              {{ t("SetBase.ui.displayMode." + item.raw) }}
            </template>

            <template #item="{ item, props }">
              <v-list-item v-bind="props" :title="t('SetBase.ui.displayMode.' + item.raw)" />
            </template>
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn @click="() => uiStore.$save()">{{ $t("common.save") }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss"></style>
