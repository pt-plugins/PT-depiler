<script setup lang="ts">
import { useDevicePixelRatio } from "@vueuse/core";
import { useUIStore } from "@/shared/store/ui";
import Navigation from "./components/Layout/Navigation.vue";
import Topbar from "./components/Layout/Topbar.vue";
import Footer from "./components/Layout/Footer.vue";

const uiStore = useUIStore();

const { pixelRatio } = useDevicePixelRatio();

function setIgnoreWrongPixelRatio() {
  uiStore.ignoreWrongPixelRatio = true;
  uiStore.$save();
}
</script>

<template>
  <template v-if="!uiStore.$ready">
    {{ $t('layout.init') }}
  </template>
  <router-view v-else  v-slot="{ Component, route }">
    <v-app id="ptd" :theme="uiStore.uiTheme">
      <v-system-bar
        v-if="(pixelRatio > 1 || pixelRatio < 0.8) && !uiStore.ignoreWrongPixelRatio"
        color="purple-darken-2" class="justify-center"
      >
        {{ $t('layout.header.wrongPixelRatioNotice') }}&nbsp;&nbsp;
        <v-icon icon="mdi-close" class="ms-2" @click="setIgnoreWrongPixelRatio" />
      </v-system-bar>

      <Topbar />

      <!-- 导航栏 -->
      <Navigation />

      <v-main>
        <v-container fluid>
          <keep-alive v-if="route.meta.keepAlive">
            <component :is="Component" />
          </keep-alive>
          <component :is="Component" v-else />
        </v-container>
      </v-main>

      <!-- 页脚 -->
      <Footer />

    </v-app>
  </router-view>


</template>

<style scoped>

</style>
