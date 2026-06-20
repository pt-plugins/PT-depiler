<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
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
const expansionPanelOpen = ref<string>("path");
const newFolderInput = ref<string>("");

// [key (for i18n), value, example]
const pathReplaceMap: [string, string, string][] = [
  // 在 torrent 相关字段中，因为对应的 title subTitle 为对应 torrent 的字段，所以这里用 . 来分隔
  ["torrentTitle", "$torrent.title$", "/volume1/$torrent.title$ -> /volume1/TorrentTitle"],
  ["torrentSubTitle", "$torrent.subTitle$", "/volume1/$torrent.subTitle$ -> /volume1/TorrentSubTitle"],
  ["torrentSite", "$torrent.site$", "/volume1/$torrent.site$/music -> /volume1/opencd/music"],
  ["torrentSiteName", "$torrent.siteName$", "/volume1/$torrent.siteName$/music -> /volume1/OpenCD/music"],
  // 而在 search, date 等字段中，则是全局字段，所以用 : 来分隔
  ["searchKeyword", "$search:keyword$", "/volume1/$search:keyword$/music -> /volume1/keyword/music"],
  ["searchPlan", "$search:plan$", "/volume1/$search:plan$/music -> /volume1/all/music"],
  ["dateYear", "$date:YYYY$", "/volume1/$date:YYYY$/music -> /volume1/2019/music"],
  ["dateMonth", "$date:MM$", "/volume1/$date:MM$/music -> /volume1/10/music"],
  ["dateDay", "$date:DD$", "/volume1/$date:DD$/music -> /volume1/01/music"],
  ["custom", "<...>", "/volume1/<...>/music -> prompt for input 'test' -> /volume1/test/music"],
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

function normalizeList(values: string[]) {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))];
}

function setSuggestFolders(paths: string[]) {
  clientConfig.value!.suggestFolders = normalizeList(paths);
}

function addSuggestFolder(path: string = newFolderInput.value) {
  const nextPath = path.trim();
  if (!nextPath) return;

  const suggestFolders = clientConfig.value?.suggestFolders ?? [];
  if (suggestFolders.includes(nextPath)) {
    runtimeStore.showSnakebar(t("SetDownloader.PathAndTag.downloadPath.duplicate"), { color: "warning" });
    return;
  }

  setSuggestFolders([...suggestFolders, nextPath]);
  newFolderInput.value = "";
}

function updateSuggestFolder(index: number, value: string) {
  const suggestFolders = [...(clientConfig.value?.suggestFolders ?? [])];
  suggestFolders[index] = value;
  clientConfig.value!.suggestFolders = suggestFolders;
}

function normalizeSuggestFolders() {
  setSuggestFolders(clientConfig.value?.suggestFolders ?? []);
}

function removeSuggestFolder(index: number) {
  const suggestFolders = [...(clientConfig.value?.suggestFolders ?? [])];
  suggestFolders.splice(index, 1);
  setSuggestFolders(suggestFolders);
}

function moveSuggestFolder(index: number, offset: number) {
  const suggestFolders = [...(clientConfig.value?.suggestFolders ?? [])];
  const targetIndex = index + offset;
  if (targetIndex < 0 || targetIndex >= suggestFolders.length) return;

  const [folder] = suggestFolders.splice(index, 1);
  suggestFolders.splice(targetIndex, 0, folder);
  setSuggestFolders(suggestFolders);
}

function clearSuggestFolders() {
  clientConfig.value!.suggestFolders = [];
}

function appendPathKeyword(keyword: string) {
  newFolderInput.value += keyword;
}

const isLoadingClientFolders = ref<boolean>(false);
async function loadClientFolders() {
  isLoadingClientFolders.value = true;
  const client = await getDownloader(clientConfig.value!);
  try {
    const clientPaths = await client.getClientPaths();
    for (const path of clientPaths) {
      if ((clientConfig.value?.suggestFolders ?? []).includes(path)) continue; // 避免重复添加
      addSuggestFolder(path);
    }
  } catch (e) {
    runtimeStore.showSnakebar(t("SetDownloader.PathAndTag.downloadPath.autoImportFail"), { color: "error" });
  }

  isLoadingClientFolders.value = false;
}

const suggestTagInput = computed({
  get: () => (clientConfig.value?.suggestTags ?? []).join("\n"),
  set: (value) => {
    clientConfig.value!.suggestTags = value
      .split("\n")
      .map((v) => v.trim())
      .filter(Boolean);
  },
});

const isLoadingClientLabels = ref<boolean>(false);
async function loadClientLabels() {
  isLoadingClientLabels.value = true;
  const client = await getDownloader(clientConfig.value!);
  try {
    const clientLabels = await client.getClientLabels();
    for (const label of clientLabels) {
      if ((clientConfig.value?.suggestTags ?? []).includes(label)) continue; // 避免重复添加
      suggestTagInput.value += "\n" + label;
    }
  } catch (e) {
    runtimeStore.showSnakebar(t("SetDownloader.PathAndTag.tags.autoImportFail"), { color: "error" });
  }

  isLoadingClientLabels.value = false;
}

function saveClientConfig() {
  normalizeSuggestFolders();
  clientConfig.value!.suggestTags = normalizeList(clientConfig.value?.suggestTags ?? []);
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
            <v-btn icon="mdi-close" :title="t('common.dialog.close')" @click="showDialog = false" />
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

              <v-alert class="mt-2" density="compact" type="info" variant="tonal">
                {{ t("SetDownloader.PathAndTag.downloadPath.quickHint") }}
              </v-alert>

              <v-row class="mt-2" dense>
                <v-col cols="12" md="9">
                  <v-text-field
                    v-model="newFolderInput"
                    :label="t('SetDownloader.PathAndTag.downloadPath.addInputLabel')"
                    :placeholder="t('SetDownloader.PathAndTag.downloadPath.addPlaceholder')"
                    hide-details
                    @keydown.enter.prevent="addSuggestFolder()"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn block color="success" height="56" prepend-icon="mdi-plus" @click="addSuggestFolder()">
                    {{ t("SetDownloader.PathAndTag.downloadPath.add") }}
                  </v-btn>
                </v-col>
              </v-row>

              <v-chip-group class="mt-1">
                <v-chip
                  v-for="pathReplace in pathReplaceMap"
                  :key="pathReplace[1]"
                  :title="pathReplace[2]"
                  class="mr-1"
                  size="small"
                  @click="appendPathKeyword(pathReplace[1])"
                >
                  {{ pathReplace[1] }}
                </v-chip>
              </v-chip-group>

              <div class="d-flex align-center mt-3 mb-1">
                <div class="text-subtitle-2">
                  {{ t("SetDownloader.PathAndTag.downloadPath.addTitle") }}
                </div>
                <v-spacer />
                <v-btn
                  :loading="isLoadingClientFolders"
                  :title="t('SetDownloader.PathAndTag.downloadPath.autoImport')"
                  color="primary"
                  prepend-icon="mdi-import"
                  size="small"
                  variant="text"
                  @click="loadClientFolders"
                >
                  {{ t("SetDownloader.PathAndTag.downloadPath.autoImportShort") }}
                </v-btn>
                <v-btn
                  :disabled="(clientConfig?.suggestFolders ?? []).length === 0"
                  :title="t('SetDownloader.PathAndTag.downloadPath.clear')"
                  color="red"
                  icon="$clear"
                  size="small"
                  variant="text"
                  @click="clearSuggestFolders"
                />
              </div>

              <v-alert
                v-if="(clientConfig?.suggestFolders ?? []).length === 0"
                density="compact"
                type="warning"
                variant="tonal"
              >
                {{ t("SetDownloader.PathAndTag.downloadPath.empty") }}
              </v-alert>

              <div v-else class="save-path-list">
                <div
                  v-for="(path, index) in clientConfig?.suggestFolders ?? []"
                  :key="`${path}-${index}`"
                  class="save-path-row"
                >
                  <div class="save-path-index">
                    <v-chip v-if="index < 5" class="save-path-chip" color="info" label size="small">
                      {{ t("SetDownloader.PathAndTag.downloadPath.quickBadge") }} {{ index + 1 }}
                    </v-chip>
                    <v-chip v-else class="save-path-chip" label size="small">#{{ index + 1 }}</v-chip>
                  </div>

                  <v-text-field
                    :model-value="path"
                    class="save-path-input"
                    density="compact"
                    hide-details
                    :label="t('SetDownloader.PathAndTag.downloadPath.pathLabel')"
                    @blur="normalizeSuggestFolders"
                    @update:model-value="(value) => updateSuggestFolder(index, value)"
                  />

                  <div class="save-path-actions">
                    <v-btn
                      :disabled="index === 0"
                      :title="t('SetDownloader.PathAndTag.downloadPath.moveUp')"
                      icon="mdi-arrow-up"
                      size="small"
                      variant="text"
                      @click="moveSuggestFolder(index, -1)"
                    />
                    <v-btn
                      :disabled="index === (clientConfig?.suggestFolders ?? []).length - 1"
                      :title="t('SetDownloader.PathAndTag.downloadPath.moveDown')"
                      icon="mdi-arrow-down"
                      size="small"
                      variant="text"
                      @click="moveSuggestFolder(index, 1)"
                    />
                    <v-btn
                      :title="t('SetDownloader.PathAndTag.downloadPath.remove')"
                      color="error"
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      @click="removeSuggestFolder(index)"
                    />
                  </div>
                </div>
              </div>
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
              <v-textarea v-model="suggestTagInput" :label="t('SetDownloader.PathAndTag.tags.addInputLabel')">
                <template #append>
                  <div class="d-flex flex-column">
                    <v-btn
                      :loading="isLoadingClientLabels"
                      :title="t('SetDownloader.PathAndTag.tags.autoImport')"
                      color="primary"
                      icon="mdi-import"
                      variant="text"
                      @click="loadClientLabels"
                    />
                    <v-btn
                      :title="t('SetDownloader.PathAndTag.tags.clear')"
                      color="red"
                      icon="$clear"
                      variant="text"
                      @click="suggestTagInput = ''"
                    />
                  </div>
                </template>
                <template #details>
                  <v-chip-group>
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
                  </v-chip-group>
                </template>
              </v-textarea>
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

<style scoped lang="scss">
.save-path-list {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
}

.save-path-row {
  align-items: center;
  display: grid;
  gap: 12px;
  grid-template-columns: 92px minmax(0, 1fr) 112px;
}

.save-path-index {
  display: flex;
  justify-content: flex-start;
  min-width: 0;
}

.save-path-chip {
  width: 76px;
}

.save-path-input {
  min-width: 0;
}

.save-path-actions {
  display: flex;
  justify-content: flex-end;
  white-space: nowrap;
}

@media (max-width: 700px) {
  .save-path-row {
    align-items: stretch;
    grid-template-columns: 1fr;
  }

  .save-path-actions {
    justify-content: flex-start;
  }
}
</style>
