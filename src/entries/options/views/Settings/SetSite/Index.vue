<script setup lang="ts">
import { type ISiteMetadata, type ISiteUserConfig, type TSiteID } from "@ptd/site";

import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync, refDebounced } from "@vueuse/core";
import { useConfigStore } from "@/options/stores/config.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import AddDialog from "./AddDialog.vue";
import EditDialog from "./EditDialog.vue";
import EditSearchEntryList from "./EditSearchEntryList.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";
import { sendMessage } from "@/messages.ts";
import searchQueryParser, { SearchParserOptions } from "search-query-parser";

const { t } = useI18n();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const tableHeader = [
  // site favicon
  { title: "", key: "userConfig.sortIndex", align: "center", width: 48, alwaysShow: true, filterable: false },
  { title: t("SetSite.common.name"), key: "name", align: "left", width: 120, alwaysShow: true, sortable: false },
  { title: "站点分类", key: "groups", align: "left", sortable: false },
  { title: t("SetSite.common.url"), key: "url", align: "start", sortable: false },
  { title: t("SetSite.common.isOffline"), key: "userConfig.isOffline", align: "center", width: 180, filterable: false },
  {
    title: t("SetSite.common.allowSearch"),
    key: "userConfig.allowSearch",
    align: "center",
    width: 180,
    filterable: false,
  },
  {
    title: t("SetSite.common.allowQueryUserInfo"),
    key: "userConfig.allowQueryUserInfo",
    align: "center",
    width: 180,
    filterable: false,
  },
  {
    title: t("common.action"),
    key: "action",
    sortable: false,
    filterable: false,
    alwaysShow: true,
  },
];

const tableWaitFilter = ref(""); // 搜索过滤词
const tableFilter = refDebounced(tableWaitFilter, 500); // 延迟搜索过滤词的生成
const tableSelected = ref<TSiteID[]>([]);

const searchQueryParserOptions: SearchParserOptions = {
  keywords: ["site"],
  tokenize: true,
  offsets: false,
  alwaysArray: true,
};

const tableParsedFilter = computed(() => searchQueryParser.parse(tableFilter.value, searchQueryParserOptions));

interface ISiteTableItem {
  id: TSiteID;
  metadata: ISiteMetadata;
  userConfig: ISiteUserConfig;
}

const sites = computedAsync<ISiteTableItem[]>(async () => {
  const sitesReturn = [];
  for (const [siteId, siteUserConfig] of Object.entries(metadataStore.sites)) {
    sitesReturn.push({
      id: siteId,
      metadata: await metadataStore.getSiteMetadata(siteId),
      userConfig: siteUserConfig,
    });
  }

  return sitesReturn;
});

function tableCustomFilter(value: any, query: string, item: any) {
  const rawItem = item.raw as ISiteTableItem;

  const itemTitle = [rawItem.metadata.name, rawItem.userConfig.merge?.name, ...rawItem.metadata.urls]
    .filter(Boolean)
    .join("|")
    .toLowerCase();

  // @ts-ignore
  const { site, text, exclude } = tableParsedFilter.value;
  if (site && !site.includes(rawItem.id)) return false;
  if (text && !text.map((x: string) => x.toLowerCase()).every((keyword: string) => itemTitle.includes(keyword)))
    return false;

  if (exclude) {
    const { site: exSite, text: exText } = exclude;
    if (exSite && exSite.includes(rawItem.id)) return false;
    if (exText) {
      const excludesText = (Array.isArray(exText) ? exText : [exText]).map((x) => x.toLowerCase());
      if (excludesText.some((keyword: string) => itemTitle.includes(keyword))) return false;
    }
  }

  return true;
}

const toEditId = ref<TSiteID | null>("");
function editSite(siteId: TSiteID) {
  toEditId.value = siteId;
  showEditDialog.value = true;
}

const toDeleteIds = ref<TSiteID[]>([]);
function deleteSite(siteId: TSiteID[]) {
  toDeleteIds.value = siteId;
  showDeleteDialog.value = true;
}

async function confirmDeleteSite(siteId: TSiteID) {
  await metadataStore.removeSite(siteId);
  const index = tableSelected.value.indexOf(siteId);
  if (index !== -1) {
    tableSelected.value.splice(index, 1);
  }
}

const isFaviconFlushing = ref(false);
async function flushSiteFavicon(siteId: TSiteID | TSiteID[]) {
  const siteIds = Array.isArray(siteId) ? siteId : [siteId];
  for (const id of siteIds) {
    await sendMessage("getSiteFavicon", { site: id, flush: true });
  }
  runtimeStore.showSnakebar(t("SetSite.index.flushFaviconFinish"), { color: "success" });
}
</script>

<template>
  <v-alert :title="t('route.Settings.SetSite')" type="info" />
  <v-card class="set-site">
    <v-card-title>
      <v-row class="ma-0">
        <v-btn class="mr-2" color="success" prepend-icon="mdi-plus" @click="showAddDialog = true">
          {{ t("common.btn.add") }}
        </v-btn>
        <v-btn
          :disabled="tableSelected.length === 0"
          color="error"
          prepend-icon="mdi-minus"
          @click="deleteSite(tableSelected)"
        >
          {{ t("common.remove") }}
        </v-btn>
        <v-divider class="mx-3" inset vertical />
        <v-btn-group density="compact" size="small">
          <v-btn
            :disabled="tableSelected.length === 0"
            :loading="isFaviconFlushing"
            color="indigo"
            prepend-icon="mdi-face-recognition"
            @click="() => flushSiteFavicon(tableSelected)"
            >{{ t("SetSite.index.table.flushFavicon") }}</v-btn
          >
        </v-btn-group>

        <!-- TODO 一键导入站点 -->
        <v-spacer />
        <v-text-field
          v-model="tableWaitFilter"
          append-icon="mdi-magnify"
          density="compact"
          hide-details
          label="Search"
          single-line
        >
          <template #prepend-inner>
            <v-menu min-width="100">
              <template v-slot:activator="{ props }">
                <v-icon icon="mdi-filter" variant="plain" v-bind="props" />
              </template>
              <v-list class="pa-0">
                <v-list-item-subtitle class="ma-2">站点分类</v-list-item-subtitle>

                <v-list-item
                  v-for="(item, index) in metadataStore.getSitesGroupData"
                  :key="index"
                  :value="index"
                  :title="`${index} (${item.length})`"
                  @click="() => (tableWaitFilter = (tableWaitFilter + ` site:${item.join(',')}`).trim())"
                >
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-text-field>
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="tableSelected"
      :headers="tableHeader"
      :items="sites"
      :items-per-page="configStore.tableBehavior.SetSite.itemsPerPage"
      :custom-filter="tableCustomFilter"
      :filter-keys="['id'] /* 对每个item值只检索一次 */"
      :search="tableFilter"
      :sort-by="configStore.tableBehavior.SetSite.sortBy"
      class="table-stripe"
      item-value="id"
      multi-sort
      hover
      show-select
      @update:itemsPerPage="(v) => configStore.updateTableBehavior('SetSite', 'itemsPerPage', v)"
      @update:sortBy="(v) => configStore.updateTableBehavior('SetSite', 'sortBy', v)"
    >
      <template #item.userConfig.sortIndex="{ item }">
        <SiteFavicon :site-id="item.id" />
      </template>
      <template #item.name="{ item }">
        {{ item.userConfig?.merge?.name ?? item.metadata?.name }}
      </template>
      <template #item.groups="{ item }">
        {{ (item.userConfig.groups ?? []).join(", ") }}
      </template>
      <template #item.url="{ item }">
        <a :href="item.userConfig?.url ?? item.metadata?.urls?.[0]" target="_blank">
          {{ item.userConfig?.url ?? item.metadata?.urls?.[0] }}
        </a>
      </template>
      <template #item.userConfig.isOffline="{ item }">
        <v-switch
          v-model="item.userConfig.isOffline"
          :disabled="item.metadata.isDead"
          class="site-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatchSite(item.id, 'isOffline', v as boolean)"
        />
      </template>
      <template #item.userConfig.allowSearch="{ item }">
        <v-switch
          v-model="item.userConfig.allowSearch"
          :disabled="item.metadata.isDead || item.userConfig.isOffline || !Object.hasOwn(item.metadata, 'search')"
          class="site-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatchSite(item.id, 'allowSearch', v as boolean)"
        />
      </template>
      <template #item.userConfig.allowQueryUserInfo="{ item }">
        <v-switch
          v-model="item.userConfig.allowQueryUserInfo"
          :disabled="item.metadata.isDead || item.userConfig.isOffline || !Object.hasOwn(item.metadata, 'userInfo')"
          class="site-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatchSite(item.id, 'allowQueryUserInfo', v as boolean)"
        />
      </template>
      <template #item.action="{ item }">
        <v-btn-group class="table-action" density="compact" variant="plain">
          <!-- 站点信息编辑 -->
          <v-btn
            :disabled="item.metadata.isDead"
            :title="t('common.edit')"
            color="info"
            icon="mdi-pencil"
            size="small"
            @click="() => editSite(item.id)"
          />

          <!-- 默认站点搜索入口编辑（只有配置了 siteMetadata.searchEntry 的站点才支持该设置） -->
          <v-btn :disabled="item.metadata.isDead || !item.metadata.searchEntry" class="v-btn--icon" size="small">
            <v-icon icon="mdi-magnify"></v-icon>
            <v-menu :close-on-content-click="false" activator="parent">
              <EditSearchEntryList :item="item" />
            </v-menu>
          </v-btn>

          <v-btn
            :disabled="item.metadata.isDead"
            :loading="isFaviconFlushing"
            :title="t('SetSite.index.table.flushFavicon')"
            color="indigo"
            icon="mdi-face-recognition"
            size="small"
            @click="() => flushSiteFavicon(item.id)"
          ></v-btn>

          <v-btn
            :title="t('common.remove')"
            color="error"
            icon="mdi-delete"
            size="small"
            @click="() => deleteSite([item.id])"
          >
          </v-btn>
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <AddDialog v-model="showAddDialog" />
  <DeleteDialog
    v-model="showDeleteDialog"
    :to-delete-ids="toDeleteIds"
    @confirm-delete="confirmDeleteSite"
  ></DeleteDialog>
  <EditDialog v-model="showEditDialog" :site-id="toEditId!" />
</template>

<style scoped lang="scss">
.site-switch-btn {
  :deep(.v-selection-control) {
    justify-content: center;
  }
}
</style>
