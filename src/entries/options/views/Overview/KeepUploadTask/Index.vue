<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import type { IKeepUploadTask } from "@/shared/types.ts";
import { sendMessage } from "@/messages.ts";
import { formatSize, formatDate } from "@/options/utils.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const tasks = ref<IKeepUploadTask[]>([]);
const selectedTasks = ref<IKeepUploadTask[]>([]);
const expanded = ref<string[]>([]);
const loading = ref(false);
const tableKey = ref(0); // 用于强制刷新表格

const headers = [
  { title: t("KeepUploadTask.table.site"), key: "site", align: "center" as const, sortable: false },
  { title: t("KeepUploadTask.table.title"), key: "title", align: "start" as const },
  { title: t("KeepUploadTask.table.size"), key: "size", align: "end" as const },
  { title: t("KeepUploadTask.table.count"), key: "count", align: "center" as const },
  { title: t("KeepUploadTask.table.time"), key: "time", align: "center" as const },
  { title: t("common.action"), key: "action", align: "center" as const, sortable: false },
];

async function loadTasks() {
  loading.value = true;
  try {
    tasks.value = await sendMessage("getKeepUploadTasks", undefined);
  } catch (e) {
    console.error("Failed to load keep upload tasks:", e);
    tasks.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadTasks();
});

async function deleteTask(task: IKeepUploadTask) {
  if (!confirm(t("KeepUploadTask.deleteConfirm"))) return;

  try {
    await sendMessage("deleteKeepUploadTask", task.id);
    tasks.value = tasks.value.filter((t) => t.id !== task.id);
    runtimeStore.showSnakebar(t("KeepUploadTask.deleteSuccess"), { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar(t("KeepUploadTask.deleteError"), { color: "error" });
  }
}

async function deleteSelectedTasks() {
  if (selectedTasks.value.length === 0) return;
  if (!confirm(t("KeepUploadTask.deleteSelectedConfirm", { count: selectedTasks.value.length }))) return;

  try {
    for (const task of selectedTasks.value) {
      await sendMessage("deleteKeepUploadTask", task.id);
    }
    tasks.value = tasks.value.filter((t) => !selectedTasks.value.includes(t));
    selectedTasks.value = [];
    runtimeStore.showSnakebar(t("KeepUploadTask.deleteSuccess"), { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar(t("KeepUploadTask.deleteError"), { color: "error" });
  }
}

async function clearAllTasks() {
  if (!confirm(t("KeepUploadTask.clearConfirm"))) return;

  try {
    await sendMessage("clearKeepUploadTasks", undefined);
    tasks.value = [];
    runtimeStore.showSnakebar(t("KeepUploadTask.clearSuccess"), { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar(t("KeepUploadTask.clearError"), { color: "error" });
  }
}

// 发送种子到下载器
async function sendTorrentsToDownloader(task: IKeepUploadTask, items: IKeepUploadTask["items"]) {
  if (items.length === 0) return;

  const downloader = metadataStore.downloaders[task.downloadOptions.downloaderId];
  if (!downloader) {
    runtimeStore.showSnakebar("下载器不存在", { color: "error" });
    return;
  }

  try {
    for (const item of items) {
      await sendMessage("downloadTorrent", {
        torrent: {
          site: item.site,
          title: item.title,
          subTitle: item.subTitle,
          link: item.url,
          url: item.url,
          size: item.size,
        },
        downloaderId: task.downloadOptions.downloaderId,
        addTorrentOptions: {
          localDownload: true,
          addAtPaused: true,
          savePath: task.downloadOptions.savePath || "",
          ...task.downloadOptions.addTorrentOptions,
        },
      });
    }
    runtimeStore.showSnakebar(t("KeepUploadTask.sendSingleSuccess"), { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar(t("KeepUploadTask.sendSingleError"), { color: "error" });
  }
}

// 设为基准种子（移动到第一位并更新存储）
async function setAsBaseTorrent(task: IKeepUploadTask, itemIndex: number) {
  if (itemIndex === 0) {
    return;
  }

  // 将选中的种子移动到第一位
  const item = task.items.splice(itemIndex, 1)[0];
  task.items.unshift(item);

  // 更新任务存储
  try {
    await sendMessage("updateKeepUploadTask", task);
    // 强制刷新表格
    tableKey.value++;
    runtimeStore.showSnakebar(t("KeepUploadTask.setBaseSuccess"), { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar(t("KeepUploadTask.setBaseError"), { color: "error" });
  }
}

// 发送基准种子到下载器
function sendBaseTorrent(task: IKeepUploadTask) {
  const items = task.items.slice(0, 1);
  sendTorrentsToDownloader(task, items);
}

// 发送其他种子到下载器
function sendOtherTorrents(task: IKeepUploadTask) {
  if (task.items.length <= 1) return;
  if (!confirm(t("KeepUploadTask.sendConfirm", { count: task.items.length - 1 }))) return;
  const items = task.items.slice(1);
  sendTorrentsToDownloader(task, items);
}

// 发送所有种子到下载器
function sendAllTorrents(task: IKeepUploadTask) {
  if (!confirm(t("KeepUploadTask.sendConfirm", { count: task.items.length }))) return;
  const items = task.items.slice(0);
  sendTorrentsToDownloader(task, items);
}

// 复制下载链接
async function copyLinksToClipboard(task: IKeepUploadTask) {
  const urls = task.items.map((item) => item.url).join("\n");
  try {
    await navigator.clipboard.writeText(urls);
    runtimeStore.showSnakebar(t("KeepUploadTask.copySuccess", { count: task.items.length }), { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar(t("KeepUploadTask.copyError"), { color: "error" });
  }
}
</script>

<template>
  <v-alert type="info">
    {{ t("KeepUploadTask.title") }}
  </v-alert>

  <v-card>
    <v-card-title>
      <v-btn color="error" :disabled="selectedTasks.length === 0" class="mr-2" @click="deleteSelectedTasks">
        <v-icon class="mr-2">mdi-delete</v-icon>
        {{ t("common.remove") }}
      </v-btn>

      <v-btn color="error" :disabled="tasks.length === 0" @click="clearAllTasks">
        <v-icon class="mr-2">mdi-delete-sweep</v-icon>
        {{ t("KeepUploadTask.clearAll") }}
      </v-btn>

      <v-btn
        color="info"
        href="https://github.com/pt-plugins/PT-Plugin-Plus/wiki/keep-upload-task"
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="ml-2"
      >
        <v-icon class="mr-2">mdi-help</v-icon>
        {{ t("common.howToUse") }}
      </v-btn>
    </v-card-title>

    <v-data-table
      :key="tableKey"
      v-model="selectedTasks"
      v-model:expanded="expanded"
      :headers="headers"
      :items="tasks"
      :loading="loading"
      item-value="id"
      show-select
      show-expand
      class="elevation-1"
    >
      <template #item.site="{ item }">
        <div class="d-flex flex-column align-center">
          <SiteFavicon :site-id="item.items[0]?.site" :size="18" />
        </div>
      </template>

      <template #item.title="{ item }">
        <div>
          <a :href="item.items[0]?.link" target="_blank" rel="noopener noreferrer nofollow">
            {{ item.title }}
          </a>
          <div class="text-caption text-grey">
            {{ t("KeepUploadTask.savePath") }}{{ item.downloadOptions?.clientName }} ->
            {{ item.downloadOptions?.savePath || t("KeepUploadTask.defaultPath") }}
          </div>
          <div class="text-caption">{{ t("KeepUploadTask.torrentCount") }}{{ item.items.length }}</div>
        </div>
      </template>

      <template #item.size="{ item }">
        {{ formatSize(item.size) }}
      </template>

      <template #item.count="{ item }">
        {{ item.items.length }}
      </template>

      <template #item.time="{ item }">
        {{ formatDate(item.time) }}
      </template>

      <template #item.action="{ item }">
        <v-btn
          icon
          variant="text"
          color="primary"
          :title="t('KeepUploadTask.sendBaseTorrent')"
          @click="sendBaseTorrent(item)"
        >
          <v-icon>mdi-numeric-1-circle</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          color="info"
          :title="t('KeepUploadTask.sendOtherTorrents')"
          @click="sendOtherTorrents(item)"
        >
          <v-icon>mdi-numeric-2-circle</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          color="success"
          :title="t('KeepUploadTask.sendAllTorrents')"
          @click="sendAllTorrents(item)"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          color="info"
          :title="t('KeepUploadTask.copyLinks')"
          @click="copyLinksToClipboard(item)"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
        <v-btn icon variant="text" color="error" :title="t('common.remove')" @click="deleteTask(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template #expanded-row="{ item }">
        <tr>
          <td :colspan="headers.length + 1" class="pa-0">
            <v-list density="compact" class="ml-10">
              <v-list-item v-for="(subItem, index) in item.items" :key="index">
                <template #prepend>
                  <SiteFavicon :site-id="subItem.site" :size="16" />
                </template>
                <v-list-item-title>
                  <a :href="subItem.link" target="_blank" rel="noopener noreferrer nofollow">
                    {{ subItem.title }}
                  </a>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatSize(subItem.size) }}, {{ t("KeepUploadTask.seeders") }}{{ subItem.seeders ?? "-" }},
                  {{ t("KeepUploadTask.leechers") }}{{ subItem.leechers ?? "-" }}
                </v-list-item-subtitle>
                <template #append>
                  <v-btn
                    icon
                    variant="text"
                    color="primary"
                    size="small"
                    :title="t('KeepUploadTask.setAsBaseTorrent')"
                    @click="setAsBaseTorrent(item, index)"
                  >
                    <v-icon>mdi-arrow-up-bold</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </td>
        </tr>
      </template>

      <template #no-data>
        <v-alert type="info" variant="tonal">
          {{ t("KeepUploadTask.emptyNotice") }}
        </v-alert>
      </template>
    </v-data-table>
  </v-card>

  <v-alert type="warning" class="mt-4">
    <div>
      {{ t("KeepUploadTask.warning.title") }}
      <ul>
        <li>{{ t("KeepUploadTask.warning.item1") }}</li>
        <li>{{ t("KeepUploadTask.warning.item2") }}</li>
        <li>{{ t("KeepUploadTask.warning.item3") }}</li>
      </ul>
    </div>
  </v-alert>
</template>

<style scoped lang="scss">
a {
  color: #000;
  text-decoration: none;
}

a:hover {
  color: #008c00;
}
</style>
