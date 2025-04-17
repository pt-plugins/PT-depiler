<script setup lang="ts">
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import { useLocale as useVuetifyLocal } from "vuetify";
import { useDevicePixelRatio } from "@vueuse/core";

import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import Navigation from "./views/Layout/Navigation.vue";
import Topbar from "./views/Layout/Topbar.vue";

import { vuetifyLangMap } from "@/options/plugins/vuetify.ts";

const { current: currentVuetifyLocal } = useVuetifyLocal();
const { locale: currentVueI18nLocal } = useI18n({ useScope: "global" });

const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();

watch(
  () => configStore.lang,
  (newLang) => {
    currentVueI18nLocal.value = newLang; // 修改 vue-i18n 的语言
    currentVuetifyLocal.value = vuetifyLangMap[newLang]; // 修改 vuetify 的语言
  },
  { immediate: true },
);

const { pixelRatio } = useDevicePixelRatio();
function setIgnoreWrongPixelRatio() {
  configStore.ignoreWrongPixelRatio = true;
  configStore.$save();
}
</script>

<template>
  <v-app id="ptd" :theme="configStore.uiTheme">
    <!-- 页面比例提示 -->
    <v-system-bar
      v-if="(pixelRatio > 1.1 || pixelRatio < 0.8) && !configStore.ignoreWrongPixelRatio"
      class="justify-center"
      color="purple-darken-2"
    >
      {{ $t("layout.header.wrongPixelRatioNotice") }}&nbsp;&nbsp;
      <v-icon class="ms-2" icon="mdi-close" @click="setIgnoreWrongPixelRatio" />
    </v-system-bar>

    <!-- 顶部工具条 -->
    <Topbar />

    <!-- 导航栏 -->
    <Navigation />

    <v-main id="ptd-main">
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </v-container>
    </v-main>
  </v-app>

  <v-snackbar-queue v-model="runtimeStore.uiGlobalSnakebar" closable></v-snackbar-queue>
</template>

<style scoped></style>
