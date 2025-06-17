<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { VueDraggable } from "vue-draggable-plus";
import { getDownloader, getDownloaderMetaData, type TorrentClientMetaData } from "@ptd/downloader";

import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { IDownloaderMetadata } from "@/shared/types.ts";

const showDialog = defineModel<boolean>();
const { clientId } = defineProps<{
  clientId: string;
}>();

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const clientConfig = ref<IDownloaderMetadata>();
const clientMetadata = ref<TorrentClientMetaData>();
const expansionPanelOpen = ref<string>("note");

const pathReplaceMap: [string, string, string][] = [
  // [key (for i18n), value, example]
  ["torrentSite", "$torrent.site$", "/volume1/$torrent.site$/music -> /volume1/opencd/music"],
  ["torrentSiteName", "$torrent.siteName$", "/volume1/$torrent.siteName$/music -> /volume1/OpenCD/music"],
  ["searchKeyword", "$search:keyword$", "/volume1/$search:keyword$/music -> /volume1/keyword/music"],
  ["searchPlan", "$search:plan$", "/volume1/$search:plan$/music -> /volume1/all/music"],
  ["dateYear", "$date:YYYY$", "/volume1/$date:YYYY$/music -> /volume1/2019/music"],
  ["dateMonth", "$date:MM$", "/volume1/$date:MM$/music -> /volume1/10/music"],
  ["dateDay", "$date:DD$", "/volume1/$date:DD$/music -> /volume1/01/music"],
];

watch(
  () => clientId,
  async (newValue) => {
    console.log("Edit clientId:", newValue);
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
    runtimeStore.showSnakebar(t("SetDownloader.PathAndTag.downloadPath.autoImportFail"), { color: "error" });
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
    runtimeStore.showSnakebar(t("SetDownloader.PathAndTag.tags.autoImportFail"), { color: "error" });
  }

  isLoadingClientLabels.value = false;
}

function saveClientConfig() {
  metadataStore.addDownloader(clientConfig.value as IDownloaderMetadata);
  showDialog.value = false;
}
</script>

<template>
  <v-dialog v-model="showDialog" scrollable width="1000">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar
          :title="t('SetDownloader.PathAndTag.title', [clientConfig?.name ?? clientId])"
          color="blue-grey-darken-2"
        >
          <template #append>
            <v-btn icon="mdi-close" @click="showDialog = false" />
          </template>
        </v-toolbar>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-expansion-panels v-model="expansionPanelOpen">
          <v-expansion-panel :disabled="clientMetadata?.feature?.CustomPath?.allowed === false" value="path">
            <v-expansion-panel-title>
              {{ t("SetDownloader.PathAndTag.downloadPath.title") }}
              <v-spacer />
              <v-chip :color="clientConfig!.suggestFolders!.length > 0 ? 'info' : ''" size="small">
                +{{ clientConfig!.suggestFolders!.length }}
              </v-chip>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-alert v-if="clientMetadata?.feature?.CustomPath.description" closable type="info" variant="outlined">
                {{ clientMetadata?.feature?.CustomPath.description }}
              </v-alert>

              <v-list density="compact">
                <v-list-subheader v-if="clientConfig!.suggestFolders!.length > 0">
                  {{ t("SetDownloader.PathAndTag.downloadPath.addTitle") }}
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
                        color="error"
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        @click="removeSuggestFolder(item)"
                      ></v-btn>
                    </template>
                  </v-list-item>
                </vue-draggable>
                <v-list-item class="px-0">
                  <v-text-field
                    v-model="suggestFolderInput"
                    :label="t('SetDownloader.PathAndTag.downloadPath.addInputLabel')"
                    clearable
                  >
                    <template #append>
                      <v-btn
                        icon="mdi-keyboard-return"
                        variant="text"
                        @click="addSuggestFolder(suggestFolderInput)"
                      ></v-btn>
                    </template>
                    <template #prepend>
                      <v-btn
                        :loading="isLoadingClientFolders"
                        :title="t('SetDownloader.PathAndTag.downloadPath.autoImport')"
                        icon="mdi-import"
                        variant="text"
                        @click="loadClientFolders"
                      ></v-btn>
                    </template>
                    <template #details>
                      <v-chip
                        v-for="pathReplace in pathReplaceMap"
                        :key="pathReplace[1]"
                        :title="pathReplace[2]"
                        class="mr-1"
                        size="small"
                        @click="() => (suggestFolderInput += '/' + pathReplace[1])"
                      >
                        {{ pathReplace[1] }}
                      </v-chip>
                    </template>
                  </v-text-field>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel value="tag">
            <v-expansion-panel-title>
              {{ t("SetDownloader.PathAndTag.tags.title") }}
              <v-spacer />
              <v-chip :color="clientConfig!.suggestTags!.length > 0 ? 'info' : ''" size="small">
                +{{ clientConfig!.suggestTags!.length }}
              </v-chip>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-subheader v-if="clientConfig!.suggestTags!.length > 0">
                  {{ t("SetDownloader.PathAndTag.tags.addTitle") }}
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
                        color="error"
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        @click="removeSuggestTag(item)"
                      ></v-btn>
                    </template>
                  </v-list-item>
                </vue-draggable>
                <v-list-item class="px-0">
                  <v-text-field
                    v-model="suggestTagInput"
                    :label="t('SetDownloader.PathAndTag.tags.addInputLabel')"
                    clearable
                  >
                    <template #append>
                      <v-btn icon="mdi-keyboard-return" variant="text" @click="addSuggestTag(suggestTagInput)" />
                    </template>
                    <template #prepend>
                      <v-btn
                        :loading="isLoadingClientLabels"
                        :title="t('SetDownloader.PathAndTag.tags.autoImport')"
                        icon="mdi-import"
                        variant="text"
                        @click="loadClientLabels"
                      ></v-btn>
                    </template>
                    <template #details>
                      <v-chip
                        v-for="pathReplace in pathReplaceMap"
                        :key="pathReplace[1]"
                        :title="pathReplace[2]"
                        class="mr-1"
                        size="small"
                        @click="() => (suggestTagInput += pathReplace[1])"
                      >
                        {{ pathReplace[1] }}
                      </v-chip>
                    </template>
                  </v-text-field>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel :title="t('SetDownloader.PathAndTag.note.title')" value="note">
            <v-expansion-panel-text>
              <v-alert class="mt-2" color="info" variant="outlined">
                <span>{{ t("SetDownloader.PathAndTag.note.index") }}</span>
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th>{{ t("SetDownloader.PathAndTag.note.table.keywords") }}</th>
                      <th>{{ t("SetDownloader.PathAndTag.note.table.note") }}</th>
                      <th>{{ t("SetDownloader.PathAndTag.note.table.example") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="pathReplace in pathReplaceMap" :key="pathReplace[1]">
                      <td>{{ pathReplace[1] }}</td>
                      <td>{{ t(`SetDownloader.PathAndTag.note.replaceNote.${pathReplace[0]}`) }}</td>
                      <td>
                        <pre>{{ pathReplace[2] }}</pre>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-alert>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="success" prepend-icon="mdi-check-circle-outline" variant="text" @click="saveClientConfig">
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
