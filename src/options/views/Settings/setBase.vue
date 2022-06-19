<script lang="ts" setup>
import {ref} from "vue";
import {lang, definedLangMetaData, useUIStore} from "@/shared/store/ui";

const uiStore = useUIStore();
const setTab = ref<string>("ui");
</script>

<template>
  <v-card>
    <v-tabs
      v-model="setTab" centered
      color="primary"
    >
      <v-tab value="ui">
        <v-icon icon="mdi-cog" />
        {{ $t('setBase.tab.ui') }}
      </v-tab>
      <v-tab value="test">
        test
      </v-tab>
    </v-tabs>

    <v-window v-model="setTab">
      <v-window-item value="ui">
        <v-container>
          <v-row>
            <v-col>
              <!-- 插件语言设置 -->
              <v-select
                v-model="lang" :label="$t('setBase.ui.changeLanguage')"
                :items="definedLangMetaData"
              />

              <!-- 明亮模式设置 -->
              <v-switch
                v-model="uiStore.isLightTheme"
                color="success"
                hide-details
              >
                <template #label>
                  {{ $t('setBase.ui.displayMode.index') }} {{ $t('setBase.ui.displayMode.' + uiStore.uiTheme) }}
                </template>
              </v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <v-window-item value="test">
        test2
      </v-window-item>
    </v-window>
  </v-card>
</template>

<style scoped></style>
