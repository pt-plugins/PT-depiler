<script lang="ts" setup>
import {useUIStore} from "@/shared/store/ui";
import Navigation from "./components/Layout/Navigation.vue";
import Topbar from "./components/Layout/Topbar.vue";
import Footer from "./components/Layout/Footer.vue";

const uiStore = useUIStore();
</script>

<template>
  <template v-if="!uiStore.$ready">
    {{ $t('layout.init') }}
  </template>

  <v-app v-else id="ptpp-next" :theme="uiStore.uiTheme">
    <!-- 顶部工具条 -->
    <Topbar />

    <!-- 导航栏 -->
    <Navigation />

    <!-- 内容显示区域 -->
    <v-main id="ptpp-main">
      <router-view />
    </v-main>

    <!-- 页脚 -->
    <Footer />
  </v-app>
</template>

<style lang="scss">
a{
  text-decoration: none;
}
</style>
