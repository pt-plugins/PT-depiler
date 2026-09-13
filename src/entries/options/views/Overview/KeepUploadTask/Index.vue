<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import type { CAddTorrentOptions } from "@ptd/downloader";
import type { IYUUReseedCandidate } from "@ptd/iyuu";

import type { IKeepUploadTask, TKeepUploadTaskKey } from "@/shared/types.ts";
import { sendMessage } from "@/messages.ts";
import { formatSize, formatDate } from "@/options/utils.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const tasks = ref<IKeepUploadTask[]>([]);
// v-data-table 设置了 item-value="id"，因此 v-model 中保存的是任务ID（TKeepUploadTaskKey）而非任务对象
const selectedTasks = ref<TKeepUploadTaskKey[]>([]);
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
    for (const taskId of selectedTasks.value) {
      await sendMessage("deleteKeepUploadTask", taskId);
    }
    tasks.value = tasks.value.filter((t) => !selectedTasks.value.includes(t.id));
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
      const now = new Date();
      const replacements: Record<string, string> = {
        "torrent.title": item.title,
        "torrent.subTitle": item.subTitle ?? "",
        "torrent.category": String(item.category ?? ""),
        "torrent.site": item.site,
        "torrent.siteName": await metadataStore.getSiteName(item.site),
        "date:YYYY": formatDate(now, "yyyy"),
        "date:MM": formatDate(now, "MM"),
        "date:DD": formatDate(now, "dd"),
      };
      const addTorrentOptions: CAddTorrentOptions = {
        localDownload: true,
        // 与普通下载保持一致：是否暂停由下载器的“自动开始”设置决定。
        addAtPaused: !(downloader.feature?.DefaultAutoStart ?? true),
        savePath: task.downloadOptions.savePath || "",
        ...task.downloadOptions.addTorrentOptions,
      };

      for (const key of ["savePath", "label"] as const) {
        if (!addTorrentOptions[key]) continue;
        for (const [templateKey, value] of Object.entries(replacements)) {
          addTorrentOptions[key] = addTorrentOptions[key]!.replaceAll(`$${templateKey}$`, value);
        }
      }

      const result = await sendMessage("downloadTorrent", {
        torrent: {
          site: item.site,
          title: item.title,
          subTitle: item.subTitle,
          link: item.url,
          // item.link 是详情页；下载链接为空时，后台需要它来动态解析真实下载地址。
          url: item.link,
          size: item.size,
        },
        downloaderId: task.downloadOptions.downloaderId,
        addTorrentOptions,
      });
      if (result.downloadStatus === "failed") {
        throw new Error(result.errorMessage || item.title);
      }
    }
    runtimeStore.showSnakebar(t("KeepUploadTask.sendSingleSuccess"), { color: "success" });
  } catch (e) {
    const rawReason = e instanceof Error ? e.message : String(e);
    const reason = rawReason.trim() === "Fails." ? t("KeepUploadTask.qBittorrentLegacyFails") : rawReason;
    runtimeStore.showSnakebar(t("KeepUploadTask.sendSingleErrorWithReason", { reason }), { color: "error" });
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

// ── IYUU 批量扫描 ─────────────────────────────────────

const scanDialog = ref(false);
const scanDownloaderId = ref<string>("");
const scanning = ref(false);
const scanDone = ref(false);
const scanCandidates = ref<IYUUReseedCandidate[]>([]);
const scanSelected = ref<Set<string>>(new Set());
const creating = ref(false);

const scanDownloaderItems = computed(() =>
  Object.entries(metadataStore.downloaders)
    .filter(([, c]) => c.enabled && c.type)
    .map(([id, c]) => ({ title: c.name || id, value: id })),
);

function openScanDialog() {
  scanDownloaderId.value = scanDownloaderItems.value[0]?.value ?? "";
  scanDone.value = false;
  scanCandidates.value = [];
  scanSelected.value = new Set();
  scanDialog.value = true;
}

function candidateKey(c: IYUUReseedCandidate): string {
  return `${c.sourceInfoHash}|${c.siteId}|${c.torrentId}`;
}

function toggleCandidate(c: IYUUReseedCandidate) {
  const key = candidateKey(c);
  const next = new Set(scanSelected.value);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  scanSelected.value = next;
}

const selectedCount = computed(
  () => scanCandidates.value.filter((c) => c.status === "ready" && scanSelected.value.has(candidateKey(c))).length,
);

async function startScan() {
  if (!scanDownloaderId.value) return;
  scanning.value = true;
  try {
    scanCandidates.value = await sendMessage("iyuuScanForReseed", scanDownloaderId.value);
  } catch (e) {
    runtimeStore.showSnakebar(
      t("KeepUploadTask.iyuuScanError", { reason: e instanceof Error ? e.message : String(e) }),
      {
        color: "error",
      },
    );
    scanCandidates.value = [];
  } finally {
    scanning.value = false;
    scanDone.value = true;
  }
}

// 把勾选的候选按来源资源（sourceInfoHash）分组，每组创建一个辅种任务
async function createTaskFromScan() {
  const chosen = scanCandidates.value.filter((c) => c.status === "ready" && scanSelected.value.has(candidateKey(c)));
  if (chosen.length === 0) return;

  creating.value = true;
  const downloader = metadataStore.downloaders[scanDownloaderId.value];
  const groups = new Map<string, IYUUReseedCandidate[]>();
  for (const c of chosen) {
    const key = c.sourceInfoHash || "none";
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }

  try {
    for (const cands of groups.values()) {
      const first = cands[0];
      const task: IKeepUploadTask = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        time: Date.now(),
        title: first.sourceName || first.siteName,
        size: first.sourceSize || 0,
        downloadOptions: {
          downloaderId: scanDownloaderId.value,
          savePath: first.sourceSavePath || undefined,
          clientName: downloader?.name || scanDownloaderId.value,
        },
        items: cands.map((c) => ({
          site: c.siteId,
          title: c.sourceName || c.siteName,
          link: c.downloadUrl || "",
          url: c.downloadUrl || "",
          size: c.sourceSize || 0,
        })),
      };
      await sendMessage("createKeepUploadTask", task);
    }
    runtimeStore.showSnakebar(t("KeepUploadTask.iyuuCreateSuccess", { count: groups.size }), { color: "success" });
    scanDialog.value = false;
    await loadTasks();
  } catch (e) {
    runtimeStore.showSnakebar(t("KeepUploadTask.iyuuCreateError"), { color: "error" });
  } finally {
    creating.value = false;
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

      <v-btn color="primary" class="ml-2" @click="openScanDialog">
        <v-icon class="mr-2">mdi-scan-helper</v-icon>
        {{ t("KeepUploadTask.iyuuScan") }}
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
          <a
            :href="item.items[0]?.link"
            target="_blank"
            class="text-decoration-none text-high-emphasis text-body-large text-truncate"
            rel="noopener noreferrer nofollow"
          >
            {{ item.title }}
          </a>
          <div class="text-body-small text-grey">
            {{ t("KeepUploadTask.savePath") }}{{ item.downloadOptions?.clientName }} ->
            {{ item.downloadOptions?.savePath || t("KeepUploadTask.defaultPath") }}
          </div>
          <div class="text-body-small">{{ t("KeepUploadTask.torrentCount") }}{{ item.items.length }}</div>
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

  <!-- IYUU 批量扫描 -->
  <v-dialog v-model="scanDialog" max-width="860">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-scan-helper</v-icon>
        <span>{{ t("KeepUploadTask.iyuuScan") }}</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" :title="t('common.dialog.close')" @click="scanDialog = false" />
      </v-card-title>
      <v-divider />

      <v-card-text>
        <!-- 下载器选择 -->
        <v-row v-if="!scanDone && !scanning" align="center" class="pa-2">
          <v-col cols="7">
            <v-select
              v-model="scanDownloaderId"
              :items="scanDownloaderItems"
              item-title="title"
              item-value="value"
              :label="t('KeepUploadTask.iyuuChooseDownloader')"
              density="compact"
              variant="outlined"
              hide-details
            />
          </v-col>
          <v-col class="col-auto" style="flex: none">
            <v-btn color="primary" :disabled="!scanDownloaderId" @click="startScan">
              <v-icon class="mr-2">mdi-play</v-icon>
              {{ t("KeepUploadTask.iyuuStartScan") }}
            </v-btn>
          </v-col>
        </v-row>

        <div v-if="scanning" class="text-center py-6">
          <v-progress-circular indeterminate size="32" width="3" />
          <div class="text-body-small text-grey mt-2">{{ t("KeepUploadTask.iyuuScanning") }}</div>
        </div>

        <template v-if="scanDone && !scanning">
          <v-alert v-if="scanCandidates.length === 0" type="info" variant="tonal">
            {{ t("KeepUploadTask.iyuuNoResult") }}
          </v-alert>
          <template v-else>
            <v-table density="compact">
              <thead>
                <tr>
                  <th style="width: 44px"></th>
                  <th>{{ t("KeepUploadTask.iyuuColumnSite") }}</th>
                  <th>{{ t("KeepUploadTask.iyuuColumnTitle") }}</th>
                  <th class="text-end">{{ t("KeepUploadTask.iyuuColumnSize") }}</th>
                  <th class="text-center" style="width: 110px">{{ t("KeepUploadTask.iyuuColumnStatus") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in scanCandidates" :key="candidateKey(c)">
                  <td>
                    <v-checkbox
                      v-if="c.status === 'ready'"
                      :model-value="scanSelected.has(candidateKey(c))"
                      density="compact"
                      hide-details
                      @update:model-value="toggleCandidate(c)"
                    />
                  </td>
                  <td>
                    <div class="d-flex align-center ga-1">
                      <SiteFavicon :site-id="c.siteId" :size="16" />
                      <span class="text-body-small">{{ c.siteName }}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      class="text-body-small text-truncate d-inline-block"
                      style="max-width: 300px; vertical-align: middle"
                    >
                      {{ c.sourceName || c.siteName }}
                    </span>
                  </td>
                  <td class="text-end text-body-small">
                    {{ c.sourceSize ? formatSize(c.sourceSize) : "-" }}
                  </td>
                  <td class="text-center">
                    <v-chip v-if="c.status === 'ready'" size="x-small" color="success">
                      {{ t("KeepUploadTask.iyuuStatusReady") }}
                    </v-chip>
                    <v-tooltip v-else :text="c.error || ''">
                      <template #activator="{ props }">
                        <v-chip v-bind="props" size="x-small" color="error">
                          {{ t("KeepUploadTask.iyuuStatusError") }}
                        </v-chip>
                      </template>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-alert type="info" variant="tonal" density="compact" class="mt-2">
              {{ t("KeepUploadTask.iyuuGroupHint") }}
            </v-alert>
          </template>
        </template>
      </v-card-text>

      <v-card-actions v-if="scanDone && !scanning">
        <v-spacer />
        <v-btn variant="text" @click="scanDialog = false">{{ t("common.dialog.close") }}</v-btn>
        <v-btn color="primary" :disabled="selectedCount === 0" :loading="creating" @click="createTaskFromScan">
          {{ t("KeepUploadTask.iyuuCreateTask", { count: selectedCount }) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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

<style scoped lang="scss"></style>
