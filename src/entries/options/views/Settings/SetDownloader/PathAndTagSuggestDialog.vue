<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { getDownloader, getDownloaderMetaData, type TorrentClientMetaData } from "@ptd/downloader";
import { PATH_TEMPLATE_VARIABLES } from "@ptd/downloader/utils/pathTemplate.ts";

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

// 说明表格里每一列的内容：[i18n key 后缀, 示例]
// 变量名统一取自 @ptd/downloader 的 PATH_TEMPLATE_VARIABLES（这里用 Record 的键集让 TS 强制对齐，
// 少写一个变量、或上游改名都会直接编译报错）
const PATH_TEMPLATE_DOCS: Record<(typeof PATH_TEMPLATE_VARIABLES)[number], [string, string]> = {
  // 在 torrent 相关字段中，因为对应的 title subTitle 为对应 torrent 的字段，所以这里用 . 来分隔
  "torrent.title": ["torrentTitle", "/volume1/$torrent.title$ -> /volume1/TorrentTitle"],
  "torrent.subTitle": ["torrentSubTitle", "/volume1/$torrent.subTitle$ -> /volume1/TorrentSubTitle"],
  "torrent.category": ["torrentCategory", "/volume1/$torrent.category$/music -> /volume1/Movie/music"],
  "torrent.site": ["torrentSite", "/volume1/$torrent.site$/music -> /volume1/opencd/music"],
  "torrent.siteName": ["torrentSiteName", "/volume1/$torrent.siteName$/music -> /volume1/OpenCD/music"],
  // 而在 search, date 等字段中，则是全局字段，所以用 : 来分隔
  "search:keyword": ["searchKeyword", "/volume1/$search:keyword$/music -> /volume1/keyword/music"],
  "search:plan": ["searchPlan", "/volume1/$search:plan$/music -> /volume1/all/music"],
  "date:YYYY": ["dateYear", "/volume1/$date:YYYY$/music -> /volume1/2019/music"],
  "date:MM": ["dateMonth", "/volume1/$date:MM$/music -> /volume1/10/music"],
  "date:DD": ["dateDay", "/volume1/$date:DD$/music -> /volume1/01/music"],
};

// [key (for i18n), value, example]
const pathReplaceMap: [string, string, string][] = [
  ...PATH_TEMPLATE_VARIABLES.map((variable) => {
    const [key, example] = PATH_TEMPLATE_DOCS[variable];
    return [key, `$${variable}$`, example] as [string, string, string];
  }),
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

const suggestFolderInput = computed({
  get: () => (clientConfig.value?.suggestFolders ?? []).join("\n"),
  set: (value) => {
    clientConfig.value!.suggestFolders = value
      .split("\n")
      .map((v) => v.trim())
      .filter(Boolean);
  },
});

const isLoadingClientFolders = ref<boolean>(false);
async function loadClientFolders() {
  isLoadingClientFolders.value = true;
  const client = await getDownloader(clientConfig.value!);
  try {
    const clientPaths = await client.getClientPaths();
    for (const path of clientPaths) {
      if ((clientConfig.value?.suggestFolders ?? []).includes(path)) continue; // 避免重复添加
      suggestFolderInput.value += "\n" + path;
    }
  } catch (e) {
    runtimeStore.showSnackbar(t("SetDownloader.PathAndTag.downloadPath.autoImportFail"), { color: "error" });
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
    runtimeStore.showSnackbar(t("SetDownloader.PathAndTag.tags.autoImportFail"), { color: "error" });
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

              <v-textarea
                v-model="suggestFolderInput"
                :label="t('SetDownloader.PathAndTag.downloadPath.addInputLabel')"
                class="mt-2"
              >
                <template #append>
                  <div class="d-flex flex-column">
                    <v-btn
                      :loading="isLoadingClientFolders"
                      :title="t('SetDownloader.PathAndTag.downloadPath.autoImport')"
                      color="primary"
                      icon="mdi-import"
                      variant="text"
                      @click="loadClientFolders"
                    />
                    <v-btn
                      :title="t('SetDownloader.PathAndTag.downloadPath.clear')"
                      color="red"
                      icon="$clear"
                      variant="text"
                      @click="suggestFolderInput = ''"
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
                      @click="() => (suggestFolderInput += '/' + pathReplace[1])"
                    >
                      {{ pathReplace[1] }}
                    </v-chip>
                  </v-chip-group>
                </template>
              </v-textarea>
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

<style scoped lang="scss"></style>
