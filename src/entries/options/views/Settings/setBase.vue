<script lang="ts" setup>
import { ref } from "vue";
import { lang, definedLangMetaData, supportTheme, useUIStore } from "@/shared/store/ui";

const uiStore = useUIStore();
const setTab = ref<string>("ui");
</script>

<template>
  <v-card>
    <v-tabs v-model="setTab" centered color="primary">
      <v-tab value="ui">
        <v-icon icon="mdi-cog" />
        {{ $t("setBase.tab.ui") }}
      </v-tab>
      <v-tab value="test"> test </v-tab>
    </v-tabs>

    <v-window v-model="setTab">
      <v-window-item value="ui">
        <v-container>
          <v-row>
            <v-col>
              <!-- 插件语言设置 -->
              <v-select
                v-model="lang"
                :label="$t('setBase.ui.changeLanguage')"
                :items="definedLangMetaData"
              />

              <!-- 明亮模式设置 -->
              <v-select
                v-model="uiStore.theme"
                :label="$t('setBase.ui.displayMode.index')"
                :items="supportTheme"
              >
                <template #selection="{ item }">
                  {{ $t("setBase.ui.displayMode." + item.raw) }}
                </template>

                <template #item="{ item, props }">
                  <v-list-item
                    v-bind="props"
                    :title="$t('setBase.ui.displayMode.' + item.raw)"
                  />
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <v-window-item value="test"> test2 </v-window-item>
    </v-window>
  </v-card>
</template>

<style scoped></style>
