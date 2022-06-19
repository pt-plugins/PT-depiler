<script lang="ts" setup>
import {useUIStore} from "@/shared/store/ui";
import Navigation from "./components/Layout/Navigation.vue";
import Topbar from "./components/Layout/Topbar.vue";
import Footer from "./components/Layout/Footer.vue";

const uiStore = useUIStore();
</script>

<template>
  <v-app id="ptpp-next" :theme="uiStore.uiTheme">
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

</style>
