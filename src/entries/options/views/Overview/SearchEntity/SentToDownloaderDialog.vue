<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { type CAddTorrentOptions, getDownloaderIcon } from "@ptd/downloader";
import { type ISearchResultTorrent } from "@/shared/storages/types/runtime.ts";
import { type IDownloaderMetadata } from "@/shared/storages/types/metadata.ts";

import { useUIStore } from "@/options/stores/ui.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import { sendMessage } from "@/messages.ts";
import { formatDate } from "@/options/utils.ts";

const showDialog = defineModel<boolean>();
const { torrentItems } = defineProps<{
  torrentItems: ISearchResultTorrent[];
}>();

const uiStore = useUIStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();
const isSending = ref(false);
const selectedDownloader = ref<IDownloaderMetadata | null>(null);
const addTorrentOptions = reactive<Required<Omit<CAddTorrentOptions, "localDownloadOption">>>({
  localDownload: true,
  addAtPaused: false,
  savePath: "",
  label: "",
});

const suggestFolders = computed(() => selectedDownloader.value?.suggestFolders ?? []);
const suggestTags = computed(() => selectedDownloader.value?.suggestTags ?? []);

const downloaderTitle = (downloader: IDownloaderMetadata) => `${downloader.name} [${downloader.address}]`;

function restoreAddTorrentOptions() {
  addTorrentOptions.localDownload = true;
  addTorrentOptions.addAtPaused = false;
  addTorrentOptions.savePath = "";
  addTorrentOptions.label = "";
}

watch(showDialog, () => {
  restoreAddTorrentOptions(); // 先重置所有选项，然后从uiStore中获取历史情况

  const lastDownloaderId = uiStore.lastDownloader.id;
  selectedDownloader.value = lastDownloaderId ? metadataStore.downloaders[lastDownloaderId] : null;
  addTorrentOptions.savePath = uiStore.lastDownloader.savePath ?? "";
  addTorrentOptions.label = uiStore.lastDownloader.label ?? "";
});

async function sendToDownloader() {
  if (!selectedDownloader.value?.id) {
    runtimeStore.showSnakebar("请先选择下载器", { color: "error" });
    return;
  }

  uiStore.lastDownloader = {
    id: selectedDownloader.value.id,
    savePath: addTorrentOptions.savePath,
    label: addTorrentOptions.label,
  };

  isSending.value = true;
  const promises = [];

  for (const torrent of torrentItems) {
    const realAddTorrentOptions: Partial<CAddTorrentOptions> = { ...addTorrentOptions };
    if (realAddTorrentOptions.savePath) {
      if (realAddTorrentOptions.savePath === "") {
        delete realAddTorrentOptions.savePath;
      } else {
        const nowDate = new Date();
        const replaceMap: Record<string, string> = {
          "torrent.site": torrent.site,
          "torrent.siteName": await metadataStore.getSiteName(torrent.site),
          "torrent.category": (torrent.category as string) ?? "",
          "date:YYYY": formatDate(nowDate, "yyyy") as string,
          "date:MM": formatDate(nowDate, "MM") as string,
          "date:DD": formatDate(nowDate, "dd") as string,
        };

        for (const [key, value] of Object.entries(replaceMap)) {
          realAddTorrentOptions.savePath = realAddTorrentOptions.savePath.replace(`$${key}$`, value);
        }
      }
    }
    if (realAddTorrentOptions.label === "") {
      delete realAddTorrentOptions.label;
    }

    promises.push(
      sendMessage("downloadTorrentToDownloader", {
        torrent,
        downloaderId: selectedDownloader.value?.id!,
        addTorrentOptions: realAddTorrentOptions as CAddTorrentOptions,
      }).catch((x) => {
        runtimeStore.showSnakebar(`[${torrent.title}] 发送到下载器失败！错误信息： ${x}`, { color: "error" });
      }),
    );
  }

  Promise.all(promises)
    .then(() => {
      runtimeStore.showSnakebar("发送到下载器成功", { color: "success" });
    })
    .catch((x) => {
      runtimeStore.showSnakebar("有任务发送到下载器失败，请在下载历史页面重试", { color: "error" });
    })
    .finally(() => {
      isSending.value = false;
      showDialog.value = false;
    });
}
</script>

<template>
  <v-dialog v-model="showDialog" :persistent="isSending" max-width="800" scrollable>
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 为 {{ torrentItems.length }} 个种子选择下载器 </v-toolbar-title>
          <v-spacer />
          <!-- TODO 添加说明 -->
          <v-btn class="mr-2" color="green" icon="mdi-help-circle-outline" variant="text"></v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-container class="pb-0">
            <v-row>
              <v-autocomplete
                v-model="selectedDownloader"
                :items="metadataStore.getEnabledDownloaders"
                clearable
                placeholder="选择下载器"
                @update:model-value="restoreAddTorrentOptions"
              >
                <template #selection="{ item: { raw: downloader } }">
                  <v-list-item
                    :prepend-avatar="getDownloaderIcon(downloader.type)"
                    :title="downloaderTitle(downloader)"
                  />
                </template>
                <template #item="{ props, item: { raw: downloader } }">
                  <v-list-item
                    v-bind="props"
                    :prepend-avatar="getDownloaderIcon(downloader.type)"
                    :title="downloaderTitle(downloader)"
                  >
                    <template #append>
                      <v-chip color="indigo" label>{{ downloader.type }}</v-chip>
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-row>
            <v-row>
              <!-- FIXME 改为v-combobox 使得在添加 下载路径设置后 可以选择，并默认支持一些特殊的key -->
              <v-col class="py-0 pl-0" cols="6">
                <v-combobox
                  v-model="addTorrentOptions.savePath"
                  :items="suggestFolders"
                  hint="不设置则为该下载服务器的默认路径"
                  label="保存路径"
                  persistent-hint
                >
                </v-combobox>
              </v-col>
              <v-col class="py-0 pr-0" cols="6">
                <v-combobox
                  v-model="addTorrentOptions.label"
                  :items="suggestTags"
                  hint="（如果该下载服务器支持）"
                  label="种子标签"
                  persistent-hint
                ></v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <!-- FIXME 添加设置项，默认 disabled -->
                <v-switch
                  v-model="addTorrentOptions.localDownload"
                  color="success"
                  disabled
                  hide-details
                  label="本地中转（如非必要请勿禁用）"
                ></v-switch>
              </v-col>
              <v-col>
                <v-switch
                  v-model="addTorrentOptions.addAtPaused"
                  color="success"
                  hide-details
                  label="添加时默认暂停"
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <!-- TODO 说明 -->
        <v-spacer />
        <v-btn :disabled="isSending" color="info" variant="text" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          <span class="ml-1">{{ $t("common.dialog.cancel") }}</span>
        </v-btn>
        <v-btn
          :disabled="!selectedDownloader"
          :loading="isSending"
          color="error"
          variant="text"
          @click="sendToDownloader"
        >
          <v-icon icon="mdi-check-circle-outline" />
          <span class="ml-1">{{ $t("common.dialog.ok") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
