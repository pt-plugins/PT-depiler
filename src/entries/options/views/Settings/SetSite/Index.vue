<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import type { TSiteID } from "@ptd/site";
import type { DataTableHeader } from "vuetify/lib/components/VDataTable/types";

import { sendMessage } from "@/messages.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useTableCustomFilter } from "@/options/directives/useAdvanceFilter.ts";

import AddDialog from "./AddDialog.vue";
import EditDialog from "./EditDialog.vue";
import EditSearchEntryList from "./EditSearchEntryList.vue";
import OneClickImportDialog from "./OneClickImportDialog.vue";
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";
import NavButton from "@/options/components/NavButton.vue";

import { allAddedSiteInfo, type ISiteTableItem } from "@/options/views/Settings/SetSite/utils.ts"; // <-- 数据来源

const { t } = useI18n();

const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);
const showOneClickImportDialog = ref<boolean>(false);

const tableHeader = computed(() => {
  const baseHeaders = [
    // site favicon
    { title: "№", key: "userConfig.sortIndex", align: "center" },
    { title: t("SetSite.common.name"), key: "name", align: "left", sortable: false },
    {
      title: t("SetSite.common.groups"),
      key: "groups",
      align: "left",
      sortable: false,
      minWidth: "8rem",
    },
    { title: t("SetSite.common.url"), key: "url", align: "start", sortable: false },
    { title: t("SetSite.common.isOffline"), key: "userConfig.isOffline", align: "center" },
    { title: t("SetSite.common.allowSearch"), key: "userConfig.allowSearch", align: "center" },
    {
      title: t("SetSite.common.allowQueryUserInfo"),
      key: "userConfig.allowQueryUserInfo",
      align: "center",
    },
  ];
  if (configStore.contentScript.enabled && configStore.contentScript.allowExceptionSites) {
    baseHeaders.push({
      title: t("SetSite.common.allowContentScript"),
      key: "userConfig.allowContentScript",
      align: "center",
    });
  }

  return [...baseHeaders, { title: t("common.action"), key: "action", sortable: false }] as DataTableHeader[];
});

const booleanUserConfigKeywords = ["isOffline", "allowSearch", "allowQueryUserInfo"];

const {
  tableWaitFilterRef,
  tableFilterRef,
  tableFilterFn,
  advanceFilterDictRef,
  toggleKeywordStateFn,
  resetAdvanceFilterDictFn,
  updateTableFilterValueFn,
} = useTableCustomFilter<ISiteTableItem>({
  parseOptions: {
    keywords: ["id", ...booleanUserConfigKeywords.map((x) => `userConfig.${x}`), "userConfig.groups"],
  },
  titleFields: ["metadata.name", "metadata.urls", "userConfig.merge.name", "userConfig.url"],
  format: {
    ...Object.fromEntries(booleanUserConfigKeywords.map((x) => [`userConfig.${x}`, "boolean"])),
  },
});

const tableSelected = ref<TSiteID[]>([]);

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
  return await metadataStore.removeSite(siteId);
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
        <NavButton :text="t('common.btn.add')" color="success" icon="mdi-plus" @click="showAddDialog = true" />

        <NavButton
          :disabled="tableSelected.length === 0"
          :text="t('common.remove')"
          color="error"
          icon="mdi-minus"
          @click="deleteSite(tableSelected)"
        />

        <v-divider class="mx-2" inset vertical />

        <NavButton
          color="info"
          icon="mdi-crosshairs-gps"
          :text="t('SetSite.index.oneClickImport')"
          @click="() => (showOneClickImportDialog = true)"
        />

        <v-divider class="mx-2" inset vertical />

        <NavButton
          :disabled="tableSelected.length === 0"
          :loading="isFaviconFlushing"
          :text="t('SetSite.index.table.flushFavicon')"
          color="indigo"
          icon="mdi-face-recognition"
          @click="() => flushSiteFavicon(tableSelected)"
        />

        <v-spacer />
        <v-text-field
          v-model="tableWaitFilterRef"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          label="Search"
          max-width="500"
          single-line
          @click:clear="resetAdvanceFilterDictFn"
        >
          <template #prepend-inner>
            <v-menu min-width="100">
              <template v-slot:activator="{ props }">
                <v-icon icon="mdi-filter" v-bind="props" variant="plain" @click="resetAdvanceFilterDictFn" />
              </template>
              <v-list class="pa-0">
                <v-list-item v-for="keyword in booleanUserConfigKeywords" :key="keyword">
                  <v-checkbox
                    v-model="advanceFilterDictRef[`userConfig.${keyword}`].required"
                    :label="t(`SetSite.common.${keyword}`)"
                    density="compact"
                    hide-details
                    indeterminate
                    true-value="1"
                    @click.stop="(v: any) => toggleKeywordStateFn(`userConfig.${keyword}`, '1')"
                    @update:model-value="() => updateTableFilterValueFn()"
                  ></v-checkbox>
                </v-list-item>

                <v-divider />

                <v-list-item-subtitle class="ma-2">{{ t("SetSite.common.groups") }}</v-list-item-subtitle>
                <v-list-item
                  v-for="(item, index) in metadataStore.getSitesGroupData"
                  :key="index"
                  :value="index"
                  class="pr-6"
                >
                  <v-checkbox
                    v-model="advanceFilterDictRef[`userConfig.groups`].required"
                    :label="`${index} (${item.length})`"
                    :value="index"
                    density="compact"
                    hide-details
                    indeterminate
                    @click.stop="(v: any) => toggleKeywordStateFn(`userConfig.groups`, index)"
                    @update:model-value="() => updateTableFilterValueFn()"
                  ></v-checkbox>
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
      :items="allAddedSiteInfo"
      :items-per-page="configStore.tableBehavior.SetSite.itemsPerPage"
      :custom-filter="tableFilterFn"
      :filter-keys="['id'] /* 对每个item值只检索一次 */"
      :search="tableFilterRef"
      :sort-by="configStore.tableBehavior.SetSite.sortBy"
      class="table-stripe table-header-no-wrap"
      item-value="id"
      :multi-sort="configStore.enableTableMultiSort"
      hover
      show-select
      @update:itemsPerPage="(v) => configStore.updateTableBehavior('SetSite', 'itemsPerPage', v)"
      @update:sortBy="(v) => configStore.updateTableBehavior('SetSite', 'sortBy', v)"
    >
      <template #item.userConfig.sortIndex="{ item }">
        <div class="d-flex">
          <SiteFavicon :site-id="item.id" />
        </div>
      </template>
      <template #item.name="{ item }">
        <span>
          {{ item.userConfig?.merge?.name ?? item.metadata?.name }}
          <v-tooltip max-width="400" v-if="item.metadata.description" activator="parent">
            <span v-if="typeof item.metadata.description === 'string'">{{ item.metadata.description }}</span>
            <ul v-else>
              <li v-for="(text, index) in item.metadata.description" :key="index">{{ text }}</li>
            </ul>
          </v-tooltip>
        </span>
      </template>
      <template #item.groups="{ item }">
        {{ (item.userConfig.groups ?? []).join(", ") }}
      </template>
      <template #item.url="{ item }">
        <a
          :href="item.userConfig?.url ?? item.metadata?.urls?.[0]"
          class="text-primary font-weight-medium text-decoration-underline"
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          {{ item.userConfig?.url ?? item.metadata?.urls?.[0] }}
          <v-icon icon="mdi-open-in-new" size="x-small"></v-icon>
        </a>
      </template>
      <template #item.userConfig.isOffline="{ item }">
        <v-switch
          v-model="item.userConfig.isOffline"
          :disabled="item.metadata.isDead"
          class="table-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatch('sites', item.id, 'isOffline', v as boolean)"
        />
      </template>
      <template #item.userConfig.allowSearch="{ item }">
        <v-switch
          v-model="item.userConfig.allowSearch"
          :disabled="item.metadata.isDead || item.userConfig.isOffline || !Object.hasOwn(item.metadata, 'search')"
          class="table-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatch('sites', item.id, 'allowSearch', v as boolean)"
        />
      </template>
      <template #item.userConfig.allowQueryUserInfo="{ item }">
        <v-switch
          v-model="item.userConfig.allowQueryUserInfo"
          :disabled="item.metadata.isDead || item.userConfig.isOffline || !Object.hasOwn(item.metadata, 'userInfo')"
          class="table-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatch('sites', item.id, 'allowQueryUserInfo', v as boolean)"
        />
      </template>
      <template #item.userConfig.allowContentScript="{ item }">
        <v-switch
          v-model="item.userConfig.allowContentScript"
          :disabled="item.metadata.isDead || item.userConfig.isOffline"
          class="table-switch-btn"
          color="success"
          hide-details
          @update:model-value="(v) => metadataStore.simplePatch('sites', item.id, 'allowContentScript', v as boolean)"
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
          <v-btn
            :title="('SetSite.index.table.searchEntries')"
            :disabled="item.metadata.isDead || !item.metadata.searchEntry"
            class="v-btn--icon"
            size="small"
          >
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
  <DeleteDialog v-model="showDeleteDialog" :to-delete-ids="toDeleteIds" :confirm-delete="confirmDeleteSite" />
  <EditDialog v-model="showEditDialog" :site-id="toEditId!" />
  <OneClickImportDialog v-model="showOneClickImportDialog" />
</template>

<style scoped lang="scss"></style>
