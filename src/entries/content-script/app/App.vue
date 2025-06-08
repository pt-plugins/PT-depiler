<script setup lang="ts">
import { inject, onMounted, provide, useTemplateRef, watch } from "vue";
import { useDraggable } from "@vueuse/core";
import { getSite as createSiteInstance } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { currentView, pageType, siteInstance, updatePageType } from "./utils.ts";
import SpeedDialBtn from "@/content-script/app/components/SpeedDialBtn.vue";

const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const el = useTemplateRef<HTMLElement>("el");
provide("app", el);

const { x, y, style } = useDraggable(el, {
  preventDefault: true,
  initialValue: { x: -100, y: -100 }, // Default position off-screen
  onEnd: ({ x, y }) => {
    configStore.updateContentScriptPosition(x, y);
  },
});

// 监听窗口大小变化，更新位置
window.addEventListener("resize", () => {
  const { clientWidth, clientHeight } = document.documentElement;
  if (x.value > clientWidth - 50 || x.value < 0) {
    x.value = clientWidth - 100; // 确保不会超出右边界
  }
  if (y.value > clientHeight - 50 || y.value < 0) {
    y.value = clientHeight - 100; // 确保不会超出下边界
  }
});

const ptdData = inject<{ siteId?: string }>("ptd_data", {});
const ptdIcon = chrome.runtime.getURL("icons/logo/64.png");

// 从 configStore 中加载初始position配置（这里不需要判断 configStore.contextScript.enabled ）
watch(
  () => configStore.$ready,
  (ready) => {
    if (ready) {
      let { x: storeX = -100, y: storeY = -100 } = configStore.contentScript?.position ?? {};
      let { clientWidth, clientHeight } = document.documentElement;

      x.value = storeX <= 0 || storeX > clientWidth - 50 ? clientWidth - 100 : storeX; // Default to right side
      y.value = storeY <= 0 || storeY > clientHeight - 50 ? clientHeight - 100 : storeY; // Default to bottom
    }
  },
);

onMounted(async () => {
  const siteId = ptdData.siteId;
  if (siteId) {
    const siteConfig = await metadataStore.getSiteUserConfig(siteId);
    siteInstance.value = await createSiteInstance(siteId, siteConfig);
    console.debug(`[PTD] mounted with site: ${siteId} successfully!`);
  } else {
    // TODO public site like douban, imdb, etc.
  }

  updatePageType();
  window.addEventListener("hashchange", (e) => {
    updatePageType();
  });
});

function openOptions() {
  sendMessage("openOptionsPage", "/");
}
</script>

<template>
  <v-theme-provider :theme="configStore.contentScript.applyTheme ? configStore.theme : ''">
    <div ref="el" :style="style" style="position: fixed">
      <v-speed-dial :close-on-content-click="false">
        <template v-slot:activator="{ props: activatorProps }">
          <v-fab v-bind="activatorProps" color="amber" icon size="x-large">
            <v-avatar :image="ptdIcon" rounded="0" />
          </v-fab>
        </template>

        <!-- 这里根据 pageType 来决定显示哪些按钮 -->
        <component :is="currentView" :key="pageType" />

        <SpeedDialBtn color="amber" icon="mdi-home" title="打开PT-Depiler页面" @click="openOptions" />
      </v-speed-dial>
    </div>

    <v-snackbar-queue v-model="runtimeStore.uiGlobalSnakebar" closable :attach="true" />
  </v-theme-provider>
</template>
