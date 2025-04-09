<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { type CAddTorrentOptions, getDownloaderIcon } from "@ptd/downloader";
import { ISearchResultTorrent } from "@/shared/storages/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { IDownloaderMetadata } from "@/shared/storages/metadata.ts";
import { sendMessage } from "@/messages.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { formatDate } from "@/options/utils.ts";

const showDialog = defineModel<boolean>();
const { torrentItems } = defineProps<{
  torrentItems: ISearchResultTorrent[];
}>();

const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();
const isSending = ref(false);
const selectedDownloader = ref<IDownloaderMetadata | null>(null);
const addTorrentOptions = reactive<CAddTorrentOptions>({
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
  restoreAddTorrentOptions();
  selectedDownloader.value = null;
});

async function sendToDownloader() {
  if (!selectedDownloader.value?.id) {
    runtimeStore.showSnakebar("请先选择下载器", { color: "error" });
    return;
  }

  isSending.value = true;
  try {
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

      // noinspection ES6MissingAwait
      sendMessage("sendTorrentToDownloader", {
        torrent,
        downloaderId: selectedDownloader.value?.id!,
        addTorrentOptions: realAddTorrentOptions as CAddTorrentOptions,
      });
    }
  } catch (error) {
    // 此处的错误不捕捉，因为我们不等待 sendTorrentToDownloader 完成
  } finally {
    isSending.value = false;
    showDialog.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" scrollable max-width="800" :persistent="isSending">
    <v-card>
      <v-card-title style="padding: 0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 为 {{ torrentItems.length }} 个种子选择下载器 </v-toolbar-title>
          <v-spacer />
          <!-- TODO 添加说明 -->
          <v-btn icon="mdi-help-circle-outline" variant="text" color="green" class="mr-2"></v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-container class="pb-0">
            <v-row>
              <v-autocomplete
                v-model="selectedDownloader"
                :items="metadataStore.getEnabledDownloaders"
                placeholder="选择下载器"
                clearable
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
                      <v-chip label color="indigo">{{ downloader.type }}</v-chip>
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-row>
            <v-row>
              <!-- FIXME 改为v-combobox 使得在添加 下载路径设置后 可以选择，并默认支持一些特殊的key -->
              <v-col cols="6" class="py-0 pl-0">
                <v-combobox
                  v-model="addTorrentOptions.savePath"
                  :items="suggestFolders"
                  label="保存路径"
                  persistent-hint
                  hint="不设置则为该下载服务器的默认路径"
                >
                </v-combobox>
              </v-col>
              <v-col cols="6" class="py-0 pr-0">
                <v-combobox
                  v-model="addTorrentOptions.label"
                  :items="suggestTags"
                  label="种子标签"
                  persistent-hint
                  hint="（如果该下载服务器支持）"
                ></v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <!-- FIXME 添加设置项，默认 disabled -->
                <v-switch
                  color="success"
                  v-model="addTorrentOptions.localDownload"
                  label="本地中转（如非必要请勿禁用）"
                  hide-details
                ></v-switch>
              </v-col>
              <v-col>
                <v-switch
                  color="success"
                  v-model="addTorrentOptions.addAtPaused"
                  label="添加时默认暂停"
                  hide-details
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
        <v-btn variant="text" color="info" :disabled="isSending" @click="showDialog = false">
          <v-icon icon="mdi-close-circle" />
          <span class="ml-1">{{ $t("common.dialog.cancel") }}</span>
        </v-btn>
        <v-btn
          variant="text"
          color="error"
          :disabled="!selectedDownloader"
          :loading="isSending"
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
