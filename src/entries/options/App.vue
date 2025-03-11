<script setup lang="ts">
import { useDevicePixelRatio } from "@vueuse/core";
import Navigation from "./views/Layout/Navigation.vue";
import Topbar from "./views/Layout/Topbar.vue";
import { useUIStore } from "@/options/stores/ui.ts";

const uiStore = useUIStore();

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
</template>

<style scoped>
@import "tailwindcss";
</style>
