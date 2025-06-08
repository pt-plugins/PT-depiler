<script setup lang="ts">
import { ref, computed } from "vue";
import { ITorrent } from "@ptd/site";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";
import { formatDate, formatSize } from "@/options/utils.ts";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import SentToDownloaderDialog from "@/options/views/Overview/SearchEntity/SentToDownloaderDialog.vue";
import NavButton from "@/options/components/NavButton.vue";
import { useWindowSize } from "@vueuse/core";
import SimpleTorrentTitleTd from "@/content-script/app/components/SimpleTorrentTitleTd.vue";

const showDialog = defineModel<boolean>();

const { height: windowHeight } = useWindowSize();

const { torrentItems } = defineProps<{
  torrentItems: ITorrent[];
}>();

const runtimeStore = useRuntimeStore();

const tableHeaders = computed(
  () =>
    [
      { title: "分类", key: "category", align: "center", maxWidth: 60 },
      { title: "标题", key: "title", align: "start" },
      { title: "大小", key: "size", align: "end", minWidth: 60 },
      { title: "上传", key: "seeders", align: "end", minWidth: 40 },
      { title: "下载", key: "leechers", align: "end", minWidth: 40 },
      { title: "完成", key: "completed", align: "end", minWidth: 40 },
      { title: "发布于(≈)", key: "time", align: "center", minWidth: 80 },
    ] as DataTableHeader[],
);

const selectedTorrentIds = ref<ITorrent["id"][]>([]);
const selectedTorrents = computed(() => torrentItems.filter((x) => selectedTorrentIds.value.includes(x.id)));

function handleLocalDownloadMulti() {
  for (const torrent of selectedTorrents.value) {
    sendMessage("downloadTorrentToLocalFile", { torrent });
  }
}

async function handleLinkCopyMulti() {
  const downloadUrls = [];
  for (const torrent of selectedTorrents.value) {
    const downloadUrl = await sendMessage("getTorrentDownloadLink", torrent);
    downloadUrls.push(downloadUrl);
  }

  try {
    await navigator.clipboard.writeText(downloadUrls.join("\n").trim());
    runtimeStore.showSnakebar("下载链接已复制到剪贴板", { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar("复制下载链接失败", { color: "error" });
  }
}

const showRemoteDownloadMultiDialog = ref<boolean>(false);

function handleRemoteDownloadMulti() {
  showRemoteDownloadMultiDialog.value = true;
}

function enterDialog() {
  selectedTorrentIds.value = torrentItems.map((x) => x.id);
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="1200" scrollable @after-enter="enterDialog">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 为 {{ torrentItems.length }} 个种子自定义批量操作行为 </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-card-text class="overflow-y-hidden">
        <v-data-table-virtual
          v-model="selectedTorrentIds"
          class="search-entity-table table-stripe table-header-no-wrap table-no-ext-padding"
          show-select
          hover
          :height="windowHeight - 220"
          :headers="tableHeaders"
          :items="torrentItems"
          item-value="id"
        >
          <template #item.title="{ item }">
            <SimpleTorrentTitleTd :item="item" />
          </template>

          <!-- 种子大小 -->
          <template #item.size="{ item }">
            <span class="t_size text-no-wrap">{{ formatSize(item.size ?? 0) }}</span>
          </template>

          <template #item.time="{ item }">
            <span class="t_time text-no-wrap">
              {{ item.time ? formatDate(item.time) : "-" }}
            </span>
          </template>
        </v-data-table-virtual>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <NavButton icon="mdi-content-save-all" text="本地下载" color="light-blue" @click="handleLocalDownloadMulti" />

        <NavButton color="light-blue" icon="mdi-content-copy" text="复制链接" @click="handleLinkCopyMulti" />

        <NavButton
          key="remote_download_multi"
          color="light-blue"
          icon="mdi-tray-arrow-down"
          text="推送到..."
          @click="handleRemoteDownloadMulti"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <SentToDownloaderDialog
    v-model="showRemoteDownloadMultiDialog"
    :content-class="['bg-white']"
    :torrent-items="selectedTorrents"
  />
</template>

<style scoped lang="scss"></style>
