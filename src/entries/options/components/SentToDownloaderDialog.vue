<script setup lang="ts">
import { ref, computed, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { toMerged } from "es-toolkit";
import { type ITorrent } from "@ptd/site";
import {
  type CAddTorrentOptions,
  getDownloaderIcon as getDownloaderIconRaw,
  getDownloaderMetaData,
} from "@ptd/downloader";

import { sendMessage } from "@/messages.ts";
import { formatDate } from "@/options/utils.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import type { IDownloaderMetadata } from "@/shared/types.ts";

const showDialog = defineModel<boolean>();
const { torrentItems } = defineProps<{
  torrentItems: ITorrent[];
}>();
const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "done"): void;
}>();

const { t } = useI18n();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const isSending = ref(false);
const quickSendToClient = ref<boolean>(false);
const selectedDownloader = ref<IDownloaderMetadata | null>(null);
const selectedDownloaderMetadata = shallowRef();
const addTorrentOptions = ref<Required<Omit<CAddTorrentOptions, "localDownloadOption">>>({
  localDownload: true,
  addAtPaused: false,
  savePath: "",
  label: "",
  uploadSpeedLimit: 0,
  advanceAddTorrentOptions: {},
});

const suggestFolders = computed(() => selectedDownloader.value?.suggestFolders ?? []);
const suggestTags = computed(() => selectedDownloader.value?.suggestTags ?? []);

const downloaderTitle = (downloader: IDownloaderMetadata) => `${downloader.name} [${downloader.address}]`;
const getDownloaderIcon = (x: string) => chrome.runtime.getURL(getDownloaderIconRaw(x));

function restoreAddTorrentOptions(downloader?: IDownloaderMetadata) {
  addTorrentOptions.value.localDownload = true;
  addTorrentOptions.value.addAtPaused = !(downloader?.feature?.DefaultAutoStart ?? true);
  addTorrentOptions.value.savePath = "";
  addTorrentOptions.value.label = "";
  addTorrentOptions.value.advanceAddTorrentOptions = downloader?.advanceAddTorrentOptions ?? {};
}

watch(selectedDownloader, (value) => {
  if (value?.type) {
    getDownloaderMetaData(value.type).then((v) => (selectedDownloaderMetadata.value = v));
  } else {
    selectedDownloaderMetadata.value = null;
  }
});

async function sendToDownloader() {
  if (!selectedDownloader.value?.id) {
    runtimeStore.showSnakebar("请先选择下载器", { color: "error" });
    return;
  }

  // 保存此次选择记录
  if (configStore.download.saveLastDownloader) {
    // noinspection ES6MissingAwait
    metadataStore.setLastDownloader({
      id: selectedDownloader.value.id,
      options: addTorrentOptions.value,
    });
  }

  isSending.value = true;
  const promises = [];

  const customReplace = {
    savePath: undefined,
    label: undefined,
  } as Record<string, string | undefined>;

  for (const torrent of torrentItems) {
    const realAddTorrentOptions: Partial<CAddTorrentOptions> = { ...addTorrentOptions.value };

    const nowDate = new Date();
    const replaceMap: Record<string, string> = {
      "torrent.site": torrent.site,
      "torrent.siteName": await metadataStore.getSiteName(torrent.site),
      "torrent.category": (torrent.category as string) ?? "",
      "search:keyword": runtimeStore.search.searchKey,
      "search:plan": metadataStore.getSearchSolutionName(runtimeStore.search.searchPlanKey),
      "date:YYYY": formatDate(nowDate, "yyyy") as string,
      "date:MM": formatDate(nowDate, "MM") as string,
      "date:DD": formatDate(nowDate, "dd") as string,
    };

    for (const key of ["savePath", "label"] as (keyof typeof realAddTorrentOptions)[]) {
      if (realAddTorrentOptions[key]) {
        if (realAddTorrentOptions[key] === "") {
          delete realAddTorrentOptions[key];
        } else {
          for (const [replaceKey, value] of Object.entries(replaceMap)) {
            // @ts-ignore
            realAddTorrentOptions[key] = (realAddTorrentOptions[key]! as string).replace(`$${replaceKey}$`, value);
          }

          // 处理自定义输入
          if ((realAddTorrentOptions[key] as string).includes("<...>")) {
            // 如果之前已经输入过，则直接使用之前的输入
            if (typeof customReplace[key] !== "string") {
              // 此处允许空字符 ""， 但不允许用户取消（即取消动态替换操作则认为取消推送任务）
              const userInput = prompt(`请输入替换 ${key} 中的 <...> 的内容：`);
              if (userInput !== null) {
                customReplace[key] = userInput.trim();
              } else {
                // 用户取消输入，则跳过该任务
                runtimeStore.showSnakebar(`因取消输入 ${key} 中的 <...> 的内容而停止推送`, { color: "warning" });
                isSending.value = false;
                return;
              }
            }

            // @ts-ignore
            realAddTorrentOptions[key] = (realAddTorrentOptions[key] as string).replace("<...>", customReplace[key]!);
          }
        }
      }
    }

    promises.push(
      sendMessage("downloadTorrent", {
        torrent,
        downloaderId: selectedDownloader.value?.id!,
        addTorrentOptions: realAddTorrentOptions as CAddTorrentOptions,
      }).catch((x) => {
        runtimeStore.showSnakebar(`[${torrent.title}] 发送到下载器失败！错误信息： ${x}`, { color: "error" });
      }),
    );
  }

  Promise.all(promises)
    .then((status) => {
      if (status.length > 0) {
        const pendingCount = status.filter((x) => x?.downloadStatus === "pending").length;
        const failedCount = status.filter((x) => x?.downloadStatus === "failed").length;
        const color = failedCount > 0 ? "warning" : "success";

        runtimeStore.showSnakebar(
          `成功发送 ${status.length - failedCount} 个任务到下载器` +
            (pendingCount > 0 ? `（${pendingCount}在下载队列中）` : "") +
            (failedCount > 0 ? `，有 ${failedCount} 个任务发送失败` : ""),
          { color },
        );
      } else {
        runtimeStore.showSnakebar("似乎并没有任务发送到下载器", { color: "warning" });
      }
    })
    .catch((x) => {
      runtimeStore.showSnakebar("有任务发送到下载器失败，请在下载历史页面重试", { color: "error" });
    })
    .finally(() => {
      isSending.value = false;
      showDialog.value = false;
      emit("done");
    });
}

function quickSendToDownloader(downloader: IDownloaderMetadata, path: string = "", label?: string) {
  selectedDownloader.value = downloader;

  // 设置下载推送选项
  addTorrentOptions.value.localDownload = true;
  addTorrentOptions.value.addAtPaused = !(downloader.feature?.DefaultAutoStart ?? true);
  addTorrentOptions.value.advanceAddTorrentOptions = downloader.advanceAddTorrentOptions ?? {};

  if (path) {
    addTorrentOptions.value.savePath = path;
  }
  if (label) {
    addTorrentOptions.value.label = label;
  }

  return sendToDownloader();
}

function dialogEnter() {
  restoreAddTorrentOptions(); // 先重置所有选项，然后如果需要则从uiStore中获取历史情况
  quickSendToClient.value = configStore.download.useQuickSendToClient;

  // 如果不是快速发送到客户端模式，则尝试设置默认下载器
  if (!quickSendToClient.value) {
    const lastDownloaderId = metadataStore.lastDownloader?.id;
    selectedDownloader.value = lastDownloaderId // 如果有上次选择的下载器，则直接使用
      ? metadataStore.downloaders[lastDownloaderId]
      : metadataStore.getEnabledDownloaders.length === 1 // 如果只有一个启用的下载器，则直接使用
        ? metadataStore.getEnabledDownloaders[0]
        : null;

    // 将上一次的下载器选项通过 toMerged 合并到当前选项中，而不是直接覆盖
    addTorrentOptions.value = toMerged(
      addTorrentOptions.value,
      metadataStore.lastDownloader?.options ?? {},
    ) as Required<Omit<CAddTorrentOptions, "localDownloadOption">>;
  }
}

function dialogLeave() {
  restoreAddTorrentOptions(); // 先重置所有选项，然后从uiStore中获取历史情况
  emit("cancel");
}
</script>

<template>
  <v-dialog
    v-model="showDialog"
    :persistent="isSending"
    max-width="800"
    scrollable
    @after-enter="dialogEnter"
    @after-leave="dialogLeave"
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar color="blue-grey-darken-2">
          <v-toolbar-title> 为 {{ torrentItems.length }} 个种子选择下载器 </v-toolbar-title>
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>

      <v-card-text>
        <v-form>
          <!-- 快速下载选项 -->
          <v-container v-if="quickSendToClient" class="pa-0">
            <v-list v-if="metadataStore.getEnabledDownloaders.length > 0">
              <template v-for="downloader in metadataStore.getSortedEnabledDownloaders" :key="downloader.id">
                <v-list-item
                  v-for="path in ['', ...(downloader.suggestFolders ?? [])]"
                  :key="path"
                  :prepend-avatar="getDownloaderIcon(downloader.type)"
                  :subtitle="path"
                  :title="downloaderTitle(downloader)"
                  @click.stop="() => quickSendToDownloader(downloader, path)"
                >
                  <v-menu activator="parent" open-on-hover location="end">
                    <v-list density="compact">
                      <v-list-item
                        v-for="tag in downloader.suggestTags"
                        :key="tag"
                        :title="tag"
                        @click.stop="() => quickSendToDownloader(downloader, path, tag)"
                      />
                    </v-list>
                  </v-menu>
                </v-list-item>
              </template>
            </v-list>
            <v-alert v-else type="warning" variant="tonal"> 没有可用的下载器，请先在设置中添加下载器。 </v-alert>
          </v-container>

          <!-- 普通下载选项 -->
          <v-container v-else class="pb-0">
            <v-row>
              <v-autocomplete
                v-model="selectedDownloader"
                :filter-keys="['raw.name', 'raw.address', 'raw.username']"
                :items="metadataStore.getSortedEnabledDownloaders"
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
                  :disabled="!configStore.download.allowDirectSendToClient"
                  hide-details
                  label="本地中转"
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
            <v-row>
              <v-col class="pa-0">
                <v-expansion-panels
                  :disabled="!((selectedDownloaderMetadata?.advanceAddTorrentOptions ?? []).length > 0)"
                >
                  <v-expansion-panel title="高级设置">
                    <v-expansion-panel-text>
                      <v-switch
                        v-for="opt in selectedDownloaderMetadata.advanceAddTorrentOptions"
                        :key="opt.key"
                        v-model="addTorrentOptions.advanceAddTorrentOptions![opt.key]"
                        color="success"
                        :label="opt.name"
                        :messages="opt.description"
                        :hide-details="!opt.description"
                      />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn icon="mdi-cards" @click="quickSendToClient = !quickSendToClient" />

        <v-spacer />
        <v-btn
          :disabled="isSending"
          color="info"
          prepend-icon="mdi-close-circle"
          variant="text"
          @click="showDialog = false"
        >
          <span class="ml-1">{{ t("common.dialog.cancel") }}</span>
        </v-btn>
        <v-btn
          :disabled="!selectedDownloader || quickSendToClient"
          :loading="isSending"
          color="error"
          variant="text"
          @click="sendToDownloader"
        >
          <v-icon icon="mdi-check-circle-outline" />
          <span class="ml-1">{{ t("common.dialog.ok") }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
