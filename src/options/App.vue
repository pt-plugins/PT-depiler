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

  <router-view v-else v-slot="{ Component, route }">
    <v-app id="ptpp-next" :theme="uiStore.uiTheme">
      <!-- 顶部工具条 -->
      <Topbar />

      <!-- 导航栏 -->
      <Navigation />

      <!-- 内容显示区域 -->
      <v-main id="ptpp-main">
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

<style lang="scss">
a{
  text-decoration: none;
}
</style>
