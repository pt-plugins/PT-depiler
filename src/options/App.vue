<script lang="ts" setup>
import { useStore } from "@/options/store";
import browser from "webextension-polyfill";
import { provide, ref } from "vue";
import Navigation from "./components/Layout/Navigation.vue";
import Topbar from "./components/Layout/Topbar.vue";
import Footer from "./components/Layout/Footer.vue";

const store = useStore();

// 从浏览器中加载数据
browser.storage.local
  .get("PTPP-v2-Data")
  .then((initPersistData: { "PTPP-v2-Data"?: any }) => {
    if (initPersistData["PTPP-v2-Data"]) {
      // 如果有值，则使用persist data替换整个store
      store.$patch(initPersistData["PTPP-v2-Data"]);
    }

    // 将插件加载状态标记为完成
    store.isReady = true;

    // 当store出现任何变更的时候，更新浏览器数据，这样我们就不用在每个action中写方法了
    store.$subscribe((mutation, state) => {
      console.log("Store subscribe ", mutation, state);
      browser.storage.local.set({
        "PTPP-v2-Data": JSON.parse(JSON.stringify(state)),
      });
    });
  });

const theme = ref<"light" | "dark">("light");
const toggleTheme = () =>  (theme.value = theme.value === "light" ? "dark" : "light");
provide("toggleTheme", toggleTheme);
</script>

<template>
  <v-app id="ptpp-next" :theme="theme">
    <template v-if="!store.isReady">
      Not Ready
    </template>

    <template v-else>
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
    </template>
  </v-app>
</template>

<style lang="scss">

</style>
