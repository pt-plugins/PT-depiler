<script setup lang="ts">
import { useDevicePixelRatio } from "@vueuse/core";

import { useUIStore } from "@/options/stores/ui.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import Navigation from "./views/Layout/Navigation.vue";
import Topbar from "./views/Layout/Topbar.vue";

const uiStore = useUIStore();
const runtimeStore = useRuntimeStore();

const { pixelRatio } = useDevicePixelRatio();
function setIgnoreWrongPixelRatio() {
  uiStore.ignoreWrongPixelRatio = true;
  uiStore.$save();
}
</script>

<template>
  <v-app id="ptd" :theme="uiStore.uiTheme">
    <!-- 页面比例提示 -->
    <v-system-bar
      v-if="(pixelRatio > 1.1 || pixelRatio < 0.8) && !uiStore.ignoreWrongPixelRatio"
      color="purple-darken-2"
      class="justify-center"
    >
      {{ $t("layout.header.wrongPixelRatioNotice") }}&nbsp;&nbsp;
      <v-icon icon="mdi-close" class="ms-2" @click="setIgnoreWrongPixelRatio" />
    </v-system-bar>

    <!-- 顶部工具条 -->
    <Topbar />

    <!-- 导航栏 -->
    <Navigation />

    <v-main id="ptd-main">
      <v-container fluid>
        <router-view v-slot="{ Component, route }">
          <keep-alive v-if="route.meta.keepAlive">
            <component :is="Component" />
          </keep-alive>
          <component :is="Component" v-else />
        </router-view>
      </v-container>
    </v-main>
  </v-app>

  <v-snackbar v-model="runtimeStore.uiGlobalSnakebar.show" v-bind="runtimeStore.uiGlobalSnakebar"></v-snackbar>
</template>

<style scoped>
@import "tailwindcss";

:deep(.v-combobox.table-header-filter-clear input[size="1"][type="text"]) {
  display: none;
}
</style>
