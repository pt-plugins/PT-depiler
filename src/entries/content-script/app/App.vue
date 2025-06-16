<script setup lang="ts">
import { inject, onMounted, provide, useTemplateRef, ref, watch, shallowReactive } from "vue";
import { useDraggable } from "@vueuse/core";
import { getSite as createSiteInstance, type ITorrent } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { currentView, pageType, siteInstance, updatePageType } from "./utils.ts";

import SpeedDialBtn from "@/content-script/app/components/SpeedDialBtn.vue";
import SentToDownloaderDialog from "@/options/views/Overview/SearchEntity/SentToDownloaderDialog.vue";

const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const ptdIcon = chrome.runtime.getURL("icons/logo/64.png");
const ptdData = inject<{ siteId?: string }>("ptd_data", {});

const el = useTemplateRef<HTMLElement>("el");
provide("app", el);

const openSpeedDial = ref<boolean>(false);
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

// 从 configStore 中加载初始position配置（这里不需要判断 configStore.contextScript.enabled ）
watch(
  () => configStore.$ready,
  (ready) => {
    if (ready) {
      openSpeedDial.value = configStore.contentScript?.defaultOpenSpeedDial ?? false;
      let { x: storeX = -100, y: storeY = -100 } = configStore.contentScript?.position ?? {};
      let { clientWidth, clientHeight } = document.documentElement;

      x.value = storeX <= 0 || storeX > clientWidth - 50 ? clientWidth - 100 : storeX; // Default to right side
      y.value = storeY <= 0 || storeY > clientHeight - 50 ? clientHeight - 100 : storeY; // Default to bottom
    }
  },
);

const remoteDownloadDialogData = shallowReactive({
  show: false,
  torrents: [] as ITorrent[],
});
provide("remoteDownloadDialogData", remoteDownloadDialogData);

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
});

const isDragging = ref<boolean>(false);

function fixDraggingLink(link: string): string {
  if (!link.startsWith("http") && !link.startsWith("magnet:")) {
    return new URL(link, window.location.href).href; // 相对链接转换为绝对链接
  }
  return link;
}

document.addEventListener("dragstart", (e: any) => {
  if (e.target.tagName == "A") {
    let data = {
      link: e.target.getAttribute("href"),
      title: e.target.getAttribute("title") || e.target.innerText,
    };
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
  }
});

function onDrop(event: DragEvent) {
  const data = event.dataTransfer?.getData("text/plain");
  if (data) {
    try {
      const torrentData = { link: "" } as unknown as ITorrent;

      // 处理 JSON 数据
      if (data.startsWith("{")) {
        const { link, title } = JSON.parse(data) as unknown as ITorrent;

        if (title) {
          torrentData.title = title;
        }
        torrentData.link = link;
      } else {
        torrentData.link = data;
      }

      if (ptdData.siteId) {
        torrentData.site = ptdData.siteId;
      }

      if (torrentData.link && torrentData.link !== "") {
        torrentData.link = fixDraggingLink(torrentData.link);

        // 尽可能解析出 id ?
        const url = new URL(torrentData.link);
        for (const i of ["id", "tid", "torrent_id", "torrentId", "hash", "hash_id"]) {
          if (url.searchParams.has(i)) {
            torrentData.id = url.searchParams.get(i) || "";
            break;
          }
        }

        // 如果无法从 searchParams 中解出 id，则尝试从 pathname 中提取 id
        if (!torrentData.id && url.pathname) {
          for (const pathnameMatcher of [/\/(\d+)(?:\/|$)/]) {
            if (url.pathname.match(pathnameMatcher)) {
              torrentData.id = url.pathname.match(pathnameMatcher)?.[1] || "";
            }
          }
        }
      }

      console.debug("[PTD] Dropped data:", torrentData);
      remoteDownloadDialogData.torrents = [torrentData];
      remoteDownloadDialogData.show = true;
    } catch (e) {
      console.error("Failed to parse dropped data:", data);
    }
  }
  isDragging.value = false; // 重置拖拽状态
}

function openOptions() {
  sendMessage("openOptionsPage", "/");
}
</script>

<template>
  <v-theme-provider :theme="configStore.contentScript.applyTheme ? configStore.theme : ''">
    <div ref="el" :style="style" style="position: fixed; z-index: 9999999">
      <v-speed-dial v-model="openSpeedDial" :close-on-content-click="false">
        <template v-slot:activator="{ props: activatorProps }">
          <v-fab
            v-bind="activatorProps"
            color="amber"
            icon
            size="x-large"
            @click="updatePageType"
            @drop.prevent="onDrop"
            @dragover.prevent="isDragging = true"
            @dragenter.prevent="isDragging = true"
            @mouseleave.prevent="isDragging = false"
            @dragleave.prevent="isDragging = false"
          >
            <v-avatar :image="ptdIcon" rounded="0" :class="{ 'ptd-fab-loading': isDragging }" />
          </v-fab>
        </template>

        <!-- 这里根据 pageType 来决定显示哪些按钮 -->
        <component :is="currentView" :key="pageType" />

        <SpeedDialBtn key="home" color="amber" icon="mdi-home" title="打开PTD" @click="openOptions" />
      </v-speed-dial>
    </div>

    <v-snackbar-queue v-model="runtimeStore.uiGlobalSnakebar" closable :attach="true" />

    <SentToDownloaderDialog
      v-model="remoteDownloadDialogData.show"
      :content-class="['bg-white']"
      :torrent-items="remoteDownloadDialogData.torrents"
    />
  </v-theme-provider>
</template>

<style scoped lang="scss">
@keyframes onFABLoading {
  100% {
    transform: rotate(360deg);
  }
}

.ptd-fab-loading {
  animation: onFABLoading 1.9s linear infinite running;
}
</style>
