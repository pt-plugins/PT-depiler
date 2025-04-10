<script setup lang="ts">
import { ref, watch } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import { getDownloader, getDownloaderMetaData, type TorrentClientMetaData } from "@ptd/downloader";
import type { IDownloaderMetadata } from "@/shared/storages/metadata.ts";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import { log } from "~/helper.ts";

const showDialog = defineModel<boolean>();
const { clientId } = defineProps<{
  clientId: string;
}>();

const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const clientConfig = ref<IDownloaderMetadata>();
const clientMetadata = ref<TorrentClientMetaData>();

const pathReplaceMap: Record<string, string> = {
  "$torrent.site$": "将被替换为当前站点id；\n例如：/volume1/$torrent.site$/music -> /volume1/opencd/music",
  "$torrent.siteName$": "将被替换为当前站点名称；\n例如：/volume1/$torrent.siteName$/music -> /volume1/OpenCD/music",
  "$date:YYYY$": "例如：/volume1/$date:YYYY$/music -> /volume1/2019/music",
  "$date:MM$": "例如：/volume1/$date:MM$/music -> /volume1/10/music",
  "$date:DD$": "例如：/volume1/$date:DD$/music -> /volume1/01/music",
};

watch(
  () => clientId,
  async (newValue) => {
    log("Edit clientId:", newValue);
    if (newValue) {
      clientConfig.value = { suggestFolders: [], suggestTags: [], ...metadataStore.downloaders[newValue] }; // 防止直接修改父组件的数据
      clientMetadata.value = await getDownloaderMetaData(clientConfig.value.type);
    }
  },
  { immediate: true },
);

const suggestFolderInput = ref<string>("");
function addSuggestFolder(input: string) {
  if (input !== "" && !clientConfig.value?.suggestFolders!.includes(input)) {
    clientConfig.value?.suggestFolders!.push(input);
  }
  if (suggestFolderInput.value == input) {
    suggestFolderInput.value = "";
  }
}

function addPathReplaceToSuggestFolder(key: string) {
  suggestFolderInput.value = suggestFolderInput.value + "/" + key;
}

function removeSuggestFolder(folder: string) {
  const folderId = clientConfig.value!.suggestFolders!.indexOf(folder);
  if (folderId > -1) {
    clientConfig.value?.suggestFolders!.splice(folderId, 1);
  }
}

const isLoadingClientFolders = ref<boolean>(false);
async function loadClientFolders() {
  isLoadingClientFolders.value = true;
  const client = await getDownloader(clientConfig.value!);
  try {
    const clientPaths = await client.getClientPaths();
    for (const path of clientPaths) {
      addSuggestFolder(path);
    }
  } catch (e) {
    runtimeStore.showSnakebar("获取下载器文件夹列表失败", { color: "error" });
  }

  isLoadingClientFolders.value = false;
}

const suggestTagInput = ref<string>("");
function addSuggestTag(input: string) {
  if (input !== "" && !clientConfig.value?.suggestTags!.includes(input)) {
    clientConfig.value?.suggestTags!.push(input);
  }
  if (suggestTagInput.value == input) {
    suggestTagInput.value = "";
  }
}

function removeSuggestTag(tag: string) {
  const tagId = clientConfig.value!.suggestTags!.indexOf(tag);
  if (tagId > -1) {
    clientConfig.value?.suggestTags!.splice(tagId, 1);
  }
}

const isLoadingClientLabels = ref<boolean>(false);
async function loadClientLabels() {
  isLoadingClientLabels.value = true;
  const client = await getDownloader(clientConfig.value!);
  try {
    const clientLabels = await client.getClientLabels();
    for (const label of clientLabels) {
      addSuggestTag(label);
    }
  } catch (e) {
    runtimeStore.showSnakebar("获取下载器标签列表失败", { color: "error" });
  }

  isLoadingClientLabels.value = false;
}

function saveClientConfig() {
  metadataStore.addDownloader(clientConfig.value as IDownloaderMetadata);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" width="1000" scrollable>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar
          color="blue-grey darken-2"
          :title="`为下载器 [${clientConfig?.name ?? clientId}] 设置预设的下载路径和标签`"
        >
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false"> </v-btn>
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel value="path" :disabled="clientMetadata?.feature?.CustomPath?.allowed === false">
            <v-expansion-panel-title>
              下载路径
              <v-spacer />
              <v-chip :color="clientConfig!.suggestFolders!.length > 0 ? 'info' : ''" size="small">
                +{{ clientConfig!.suggestFolders!.length }}
              </v-chip>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-subheader v-if="clientConfig!.suggestFolders!.length > 0">
                  已添加的预设路径（支持拖拽排序）
                </v-list-subheader>
                <vue-draggable v-model="clientConfig!.suggestFolders!">
                  <v-list-item
                    v-for="item in clientConfig!.suggestFolders"
                    :key="item"
                    :title="item"
                    class="list-item-half-spacer"
                  >
                    <template #prepend>
                      <v-icon color="amber" icon="mdi-folder" size="large"></v-icon>
                    </template>
                    <template #append>
                      <v-btn
                        icon="mdi-delete"
                        variant="text"
                        color="error"
                        size="small"
                        @click="removeSuggestFolder(item)"
                      ></v-btn>
                    </template>
                  </v-list-item>
                </vue-draggable>
                <v-list-item>
                  <v-text-field v-model="suggestFolderInput" label="添加预设下载路径" clearable>
                    <template #append>
                      <v-btn
                        icon="mdi-keyboard-return"
                        variant="text"
                        @click="addSuggestFolder(suggestFolderInput)"
                      ></v-btn>
                    </template>
                    <template #prepend>
                      <v-btn
                        icon="mdi-import"
                        variant="text"
                        title="一键导入下载器中已有的文件夹列表"
                        :loading="isLoadingClientFolders"
                        @click="loadClientFolders"
                      ></v-btn>
                    </template>
                    <template #details>
                      <v-chip
                        v-for="(note, key) in pathReplaceMap"
                        :key="key"
                        @click="addPathReplaceToSuggestFolder(key)"
                        size="small"
                        class="mr-1"
                        :title="note"
                      >
                        {{ key }}
                      </v-chip>
                    </template>
                  </v-text-field>
                </v-list-item>
              </v-list>
              <v-alert variant="outlined" color="info" closable>
                <span>下载路径中可包含以下关键字：</span>
                <v-table density="compact">
                  <tbody>
                    <tr v-for="(note, key) in pathReplaceMap" :key="key">
                      <td>{{ key }}</td>
                      <td>
                        <pre>{{ note }}</pre>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-alert>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel value="tag">
            <v-expansion-panel-title>
              标签
              <v-spacer />
              <v-chip :color="clientConfig!.suggestTags!.length > 0 ? 'info' : ''" size="small">
                +{{ clientConfig!.suggestTags!.length }}
              </v-chip>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-subheader v-if="clientConfig!.suggestTags!.length > 0">
                  已添加的预设标签（支持拖拽排序）
                </v-list-subheader>
                <vue-draggable v-model="clientConfig!.suggestTags!">
                  <v-list-item
                    v-for="item in clientConfig!.suggestTags"
                    :key="item"
                    :title="item"
                    class="list-item-half-spacer"
                  >
                    <template #prepend>
                      <v-icon color="amber" icon="mdi-tag" size="large"></v-icon>
                    </template>
                    <template #append>
                      <v-btn
                        icon="mdi-delete"
                        variant="text"
                        color="error"
                        size="small"
                        @click="removeSuggestTag(item)"
                      ></v-btn>
                    </template>
                  </v-list-item>
                </vue-draggable>
                <v-list-item>
                  <v-text-field v-model="suggestTagInput" label="添加预设标签" clearable>
                    <template #append>
                      <v-btn icon="mdi-keyboard-return" variant="text" @click="addSuggestTag(suggestTagInput)"></v-btn>
                    </template>
                    <template #prepend>
                      <v-btn
                        icon="mdi-import"
                        variant="text"
                        title="一键导入下载器中已有的标签"
                        :loading="isLoadingClientLabels"
                        @click="loadClientLabels"
                      ></v-btn>
                    </template>
                  </v-text-field>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="success" @click="saveClientConfig">
          <v-icon icon="mdi-check-circle-outline" />
          {{ $t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
