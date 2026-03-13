<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

import type { ITorrent } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import type { ITorrentInfoForVerification } from "@/messages.ts";
import type { IKeepUploadTask, IKeepUploadTaskItem, IKeepUploadTaskDownloadOptions } from "@/shared/types.ts";
import { formatSize } from "@/options/utils.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";

const showDialog = defineModel<boolean>();
const { torrentItems } = defineProps<{
  torrentItems: ITorrent[];
}>();

const { t } = useI18n();
const metadataStore = useMetadataStore();
const runtimeStore = useRuntimeStore();

interface IVerifiedItem {
  id: string; // Map key
  data: ITorrent;
  torrent: ITorrentInfoForVerification | null;
  loading: boolean;
  verified: boolean;
  status: string;
  error: boolean;
}

const verifiedItems = ref<Map<string, IVerifiedItem>>(new Map());
const verifiedItemsOrder = ref<string[]>([]); // 保持顺序
const baseTorrent = ref<ITorrentInfoForVerification | null>(null);
const verifiedCount = ref(0);
const creating = ref(false);

// 下载选项
const selectedDownloaderId = ref<string>("");
const savePath = ref("");

// 是否可以创建任务
const canCreateTask = computed(() => {
  return verifiedCount.value > 1 && selectedDownloaderId.value;
});

// 状态文本
const statusText = {
  downloading: t("SearchEntity.KeepUploadDialog.status.downloading"),
  waiting: t("SearchEntity.KeepUploadDialog.status.waiting"),
  downloaded: t("SearchEntity.KeepUploadDialog.status.downloaded"),
  success: t("SearchEntity.KeepUploadDialog.status.success"),
  failed: t("SearchEntity.KeepUploadDialog.status.failed"),
  downloadFailed: t("SearchEntity.KeepUploadDialog.status.downloadFailed"),
  missingFiles: t("SearchEntity.KeepUploadDialog.status.missingFiles"),
};

// 打开对话框时初始化
watch(showDialog, (val) => {
  if (val) {
    startVerification();
  }
});

function startVerification() {
  verifiedItems.value = new Map();
  verifiedItemsOrder.value = [];
  baseTorrent.value = null;
  verifiedCount.value = 0;
  selectedDownloaderId.value = metadataStore.defaultDownloader?.id || "";
  savePath.value = metadataStore.defaultDownloader?.folder || "";

  torrentItems.forEach((item) => {
    if (item.link) {
      const id = crypto.randomUUID();

      verifiedItems.value.set(id, {
        id,
        data: item,
        torrent: null,
        loading: true,
        verified: false,
        status: statusText.downloading,
        error: false,
      });
      verifiedItemsOrder.value.push(id);

      getTorrent(item, id)
        .then((result) => {
          verification(result, id);
        })
        .catch(() => {
          verification(null, id);
        });
    }
  });
}

async function getTorrent(torrent: ITorrent, id: string): Promise<ITorrentInfoForVerification | null> {
  try {
    const result = await sendMessage("getTorrentInfoForVerification", torrent);
    // 边界检查：确保项仍然存在
    const item = verifiedItems.value.get(id);
    if (!item) return null;
    item.status = statusText.waiting;
    return result;
  } catch (e) {
    // 边界检查：确保项仍然存在
    const item = verifiedItems.value.get(id);
    if (item) {
      item.status = statusText.downloadFailed;
      item.error = true;
    }
    throw e;
  }
}

function verification(torrent: ITorrentInfoForVerification | null, id: string) {
  // 边界检查：确保项仍然存在
  const item = verifiedItems.value.get(id);
  if (!item) return;

  const isFirstItem = verifiedItemsOrder.value[0] === id;

  if (isFirstItem) {
    // 第一个种子作为基准种子
    if (!baseTorrent.value) {
      baseTorrent.value = torrent;
      item.loading = false;

      if (torrent) {
        item.torrent = torrent;
        item.verified = true;
        item.status = statusText.downloaded;
        verifiedCount.value++;
      } else {
        item.verified = false;
        item.status = statusText.failed;
      }
    }
  } else {
    // 等待基准种子下载完成
    const baseItem = verifiedItems.value.get(verifiedItemsOrder.value[0]);
    if (baseItem?.loading) {
      setTimeout(() => verification(torrent, id), 200);
      return;
    }

    const result: Partial<IVerifiedItem> = {
      loading: false,
    };

    if (!baseItem?.verified) {
      result.status = statusText.failed;
    }

    if (!torrent || !baseItem?.verified) {
      Object.assign(item, result);
      return;
    }

    const baseTorrentInfo = baseTorrent.value!;
    const torrentInfo = torrent;

    // 首先检查 infoHash 是否相同
    if (torrentInfo.infoHash && baseTorrentInfo.infoHash && torrentInfo.infoHash === baseTorrentInfo.infoHash) {
      // infoHash 完全相同，说明是同一个种子
      result.verified = true;
    } else {
      // infoHash 不同，检查名称和总大小是否相同
      if (torrentInfo.name === baseTorrentInfo.name && torrentInfo.length === baseTorrentInfo.length) {
        // 检查文件数量是否相同
        if (torrentInfo.files?.length === baseTorrentInfo.files?.length) {
          // 检查所有文件是否都能匹配（不要求顺序一致）
          result.verified = torrentInfo.files.every((file) => {
            return baseTorrentInfo.files.some(
              (sourceFile) => file.path === sourceFile.path && file.length === sourceFile.length,
            );
          });
        } else {
          // 文件数量不同，检查是否缺少文件
          const allFilesFound = torrentInfo.files.every((file) => {
            return baseTorrentInfo.files.some(
              (sourceFile) => file.path === sourceFile.path && file.length === sourceFile.length,
            );
          });
          if (allFilesFound) {
            result.status = statusText.missingFiles;
          }
        }
      }
    }

    result.torrent = torrent;
    if (result.verified) {
      verifiedCount.value++;
    }

    if (!result.status) {
      result.status = result.verified ? statusText.success : statusText.failed;
    }

    Object.assign(item, result);
  }
}

function addToVerified(id: string) {
  if (confirm(t("SearchEntity.KeepUploadDialog.addToKeepUploadConfirm"))) {
    const item = verifiedItems.value.get(id);
    if (item) {
      item.verified = true;
      verifiedCount.value++;
    }
  }
}

function removeVerifiedItem(id: string) {
  const item = verifiedItems.value.get(id);
  if (!item) return;
  if (item.verified) {
    verifiedCount.value--;
  }
  verifiedItems.value.delete(id);
  verifiedItemsOrder.value = verifiedItemsOrder.value.filter((itemId) => itemId !== id);
}

function reDownload(id: string) {
  const item = verifiedItems.value.get(id);
  if (!item) return;
  item.loading = true;
  item.status = statusText.downloading;

  getTorrent(item.data, id)
    .then((result) => {
      verification(result, id);
    })
    .catch(() => {
      verification(null, id);
    });
}

function closeDialog() {
  showDialog.value = false;
}

// 获取种子文件数量
function getFileCount(item: IVerifiedItem): number | string {
  return item.torrent?.files?.length ?? "N/A";
}

// 创建辅种任务
async function createKeepUploadTask() {
  if (!canCreateTask.value || !selectedDownloaderId.value) return;

  const verifiedList = Array.from(verifiedItems.value.values()).filter((item) => item.verified);
  if (verifiedList.length === 0) {
    runtimeStore.showSnakebar(t("SearchEntity.KeepUploadDialog.noVerifiedItem"), { color: "error" });
    return;
  }

  creating.value = true;

  try {
    const downloader = metadataStore.downloaders[selectedDownloaderId.value];
    const downloadOptions: IKeepUploadTaskDownloadOptions = {
      downloaderId: selectedDownloaderId.value,
      savePath: savePath.value || undefined,
      clientName: downloader?.name || selectedDownloaderId.value,
    };

    const task: IKeepUploadTask = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      time: Date.now(),
      title: verifiedList[0].data.title || "Unknown",
      size: verifiedList[0].data.size || 0,
      downloadOptions,
      items: verifiedList.map((item) => ({
        site: item.data.site,
        title: item.data.title || "",
        subTitle: item.data.subTitle,
        link: item.data.url || "", // ITorrent.url = 详情页链接
        url: item.data.link || "", // ITorrent.link = 下载链接
        size: item.data.size || 0,
        seeders: item.data.seeders,
        leechers: item.data.leechers,
      })) as IKeepUploadTaskItem[],
    };

    await sendMessage("createKeepUploadTask", task);
    runtimeStore.showSnakebar(t("SearchEntity.KeepUploadDialog.createSuccess"), { color: "success" });
    closeDialog();
  } catch (e) {
    runtimeStore.showSnakebar(t("SearchEntity.KeepUploadDialog.createError"), { color: "error" });
  } finally {
    creating.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" persistent scrollable max-width="1024">
    <v-card>
      <v-toolbar dark color="blue-grey-darken-2">
        <v-toolbar-title>{{ t("SearchEntity.KeepUploadDialog.title") }}</v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          variant="text"
          color="success"
          href="https://github.com/pt-plugins/PT-Plugin-Plus/wiki/keep-upload-task"
          target="_blank"
          rel="noopener noreferrer nofollow"
          :title="t('common.howToUse')"
        >
          <v-icon>mdi-help</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text style="max-height: 80vh">
        <v-list lines="two" density="compact">
          <template v-for="(id, index) in verifiedItemsOrder" :key="id">
            <v-list-subheader v-if="index === 0">
              {{ t("SearchEntity.KeepUploadDialog.baseTorrent") }}
            </v-list-subheader>
            <v-list-subheader v-if="index === 1">
              {{ t("SearchEntity.KeepUploadDialog.otherTorrent") }}
            </v-list-subheader>
            <v-list-item v-if="verifiedItems.get(id)">
              <template #prepend>
                <v-avatar size="18">
                  <SiteFavicon :site-id="verifiedItems.get(id)!.data.site" :size="18" />
                </v-avatar>
              </template>

              <v-list-item-title class="list-item">
                <a :href="verifiedItems.get(id)!.data.link" target="_blank" rel="noopener noreferrer nofollow">
                  {{ verifiedItems.get(id)!.data.title }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ t("SearchEntity.KeepUploadDialog.size") }}{{ formatSize(verifiedItems.get(id)!.data.size ?? 0) }},
                {{ t("SearchEntity.KeepUploadDialog.fileCount") }}{{ getFileCount(verifiedItems.get(id)!) }},
                {{ t("SearchEntity.KeepUploadDialog.status.label") }}{{ verifiedItems.get(id)!.status }}
              </v-list-item-subtitle>

              <template #append>
                <div class="d-flex ga-1">
                  <v-btn
                    v-if="
                      verifiedItems.get(verifiedItemsOrder[0])?.verified &&
                      !verifiedItems.get(id)!.loading &&
                      !verifiedItems.get(id)!.verified &&
                      index > 0
                    "
                    icon
                    variant="text"
                    :title="t('SearchEntity.KeepUploadDialog.addToKeepUpload')"
                    @click.stop="addToVerified(id)"
                  >
                    <v-icon color="info">mdi-plus</v-icon>
                  </v-btn>

                  <v-btn
                    v-if="
                      verifiedItems.get(verifiedItemsOrder[0])?.verified &&
                      !verifiedItems.get(id)!.loading &&
                      !verifiedItems.get(id)!.torrent &&
                      index > 0
                    "
                    icon
                    variant="text"
                    :title="t('SearchEntity.KeepUploadDialog.redownload')"
                    @click.stop="reDownload(id)"
                  >
                    <v-icon color="green">mdi-sync</v-icon>
                  </v-btn>

                  <v-btn
                    icon
                    variant="text"
                    :loading="verifiedItems.get(id)!.loading"
                    :title="verifiedItems.get(id)!.status"
                  >
                    <v-icon v-if="verifiedItems.get(id)!.verified" color="success">mdi-check-all</v-icon>
                    <v-icon
                      v-else
                      color="error"
                      :title="t('SearchEntity.KeepUploadDialog.removeFromKeepUpload')"
                      @click.stop="removeVerifiedItem(id)"
                    >
                      mdi-close
                    </v-icon>
                  </v-btn>
                </div>
              </template>
            </v-list-item>
            <v-divider v-if="index > 0" inset />
          </template>
        </v-list>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <template v-if="verifiedCount > 1">
          <v-select
            v-model="selectedDownloaderId"
            :items="metadataStore.getSortedEnabledDownloaders"
            item-title="name"
            item-value="id"
            density="compact"
            hide-details
            :label="t('SearchEntity.KeepUploadDialog.setSavePath')"
            style="max-width: 200px"
          />
          <v-text-field
            v-model="savePath"
            density="compact"
            hide-details
            :label="t('KeepUploadTask.savePath')"
            style="max-width: 200px"
          />
          <v-btn
            variant="text"
            color="info"
            :loading="creating"
            :disabled="!canCreateTask"
            @click="createKeepUploadTask"
          >
            <v-icon class="mr-1">mdi-content-save</v-icon>
            {{ t("SearchEntity.KeepUploadDialog.create") }}
          </v-btn>
        </template>
        <v-spacer />
        <v-btn color="error" variant="text" @click="closeDialog">
          {{ t("common.dialog.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.list-item {
  a {
    color: #000;
    text-decoration: none;
  }

  a:hover {
    color: #008c00;
  }
}
</style>
