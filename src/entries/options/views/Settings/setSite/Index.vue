<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { computedAsync } from "@vueuse/core";

import { useSiteStore, siteFavicons } from "@/shared/store/site.ts";
import { ISearchParamsMap, type SiteID } from "@ptd/site";
import { getSiteFavicon, ISiteRuntimeConfig } from "@/shared/adapters/site.ts";

import AddDialog from "@/options/views/Settings/setSite/AddDialog.vue";
import DeleteDialog from "@/options/views/Settings/setSite/DeleteDialog.vue";
import SearchParamsDialog from "@/options/views/Settings/setSite/SearchParamsDialog.vue";
import ExpandInfo from "@/options/views/Settings/setSite/ExpandInfo.vue";
import TypeAndSchemaChip from "@/options/views/Settings/setSite/TypeAndSchemaChip.vue";
import EditDialog from "@/options/views/Settings/setSite/EditDialog.vue";

const { t } = useI18n();
const siteStore = useSiteStore();

const showAddDialog = ref<boolean>(false);
const showEditDialog = ref<boolean>(false);
const showSearchParamsDialog = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const sites = computedAsync(async () => await siteStore.getSites(), []);

const siteTableSearch = ref("");
const siteTableSelected = ref<string[]>([]);
const siteTableSort = reactive([
  { key: "sortIndex", order: "desc" },
  { key: "isOffline", order: "asc" },
  { key: "allowSearch", order: "desc" },
  { key: "allowQueryUserInfo", order: "desc" },
]); // FIXME move to ui store
const siteTableHeader = [
  {
    title: "", // site favicon
    key: "sortIndex",
    align: "center",
    filterable: false,
    width: 48,
  },
  {
    title: t("setSite.common.name"),
    key: "name",
    align: "center",
    width: 120,
  },
  {
    title: t("setSite.common.type"),
    key: "type",
    filterable: false,
    align: "center",
    width: 100,
  },
  {
    title: t("setSite.common.url"),
    key: "url",
    align: "start",
  },
  {
    title: t("setSite.common.tags"),
    key: "tags",
    align: "start",
    sortable: false,
    width: 150,
  },
  {
    title: t("setSite.common.isOffline"),
    key: "isOffline",
    align: "start",
    filterable: false,
    width: 120,
  },
  {
    title: t("setSite.common.allowSearch"),
    key: "allowSearch",
    align: "center",
    filterable: false,
    width: 110,
  },
  {
    title: t("setSite.common.allowQueryUserInfo"),
    key: "allowQueryUserInfo",
    align: "center",
    filterable: false,
    width: 120,
  },
  {
    title: t("setSite.common.showMessageCount"),
    key: "showMessageCount",
    align: "center",
    filterable: false,
    width: 120,
  },
  {
    title: t("common.action"),
    key: "action",
    filterable: false,
    sortable: false,
  },
];

const siteConfig = ref<ISiteRuntimeConfig>();
function editSite(site: ISiteRuntimeConfig) {
  siteConfig.value = site;
  showEditDialog.value = true;
}

function editSearchEntity(site: ISiteRuntimeConfig) {
  siteConfig.value = site;
  showSearchParamsDialog.value = true;
}

const toDeleteIds = ref<string[]>([]);
function deleteSite(siteId: SiteID | SiteID[]) {
  if (typeof siteId === "string") {
    siteId = [siteId];
  }
  toDeleteIds.value = siteId;
  showDeleteDialog.value = true;
}

function lightSiteSearchEntityBtn(sp: ISearchParamsMap): boolean {
  for (const spV of Object.values(sp)) {
    if (Array.isArray(spV) && spV.length > 0) {
      return true;
    } else if (typeof spV === "string" && spV.length > 0) {
      return true;
    }
  }

  return false;
}
</script>

<template>
  <v-alert type="info" :title="$t('route.Settings.setSite')" />
  <v-card>
    <v-card-title>
      <v-row class="ma-0">
        <v-btn
          color="success"
          prepend-icon="mdi-plus"
          class="mr-2"
          @click="showAddDialog = true"
        >
          {{ $t("common.btn.add") }}
        </v-btn>
        <v-btn
          :disabled="siteTableSelected.length === 0"
          color="error"
          prepend-icon="mdi-minus"
          @click="deleteSite(siteTableSelected)"
        >
          {{ $t("common.remove") }}
        </v-btn>
        <v-divider class="mx-3" inset vertical />
        <!-- TODO 一键导入站点 -->
        <v-spacer />
        <v-text-field
          v-model="siteTableSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          density="compact"
          hide-details
        />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="siteTableSelected"
      :headers="siteTableHeader"
      :items="sites"
      :items-per-page="50"
      item-value="id"
      :sort-by="siteTableSort"
      multi-sort
      :search="siteTableSearch"
      show-select
    >
      <template #item.sortIndex="{ item }">
        <v-btn
          icon
          flat
          :loading="siteFavicons[item.id] === false"
          @click="getSiteFavicon(item.id, true)"
        >
          <v-avatar :image="siteFavicons[item.id] || ''" />
        </v-btn>
      </template>
      <template #item.name="{ item }">
        <ExpandInfo :main="item.name" :expand="item.aka" :open="false">
          <template #default="{ data, field }">
            <span :title="field === 'main' ? item.description ?? '' : ''">{{
              data
            }}</span>
          </template>
        </ExpandInfo>
      </template>
      <template #item.type="{ item }">
        <TypeAndSchemaChip :site="item" />
      </template>
      <template #item.url="{ item }">
        <ExpandInfo
          :main="item.url"
          :expand="item.legacyUrls"
          :open="item.legacyUrls?.includes(item.activateUrl)"
        >
          <template #default="{ data, field }">
            <a
              v-if="data.startsWith('http')"
              :href="
                field === 'main' || item.activateUrl === data
                  ? item.entryPoint ?? data
                  : data /* 存在entryPoint时，替换和url或activateUrl相同的地址为entryPoint */
              "
              target="_blank"
              rel="noopener noreferrer nofollow"
              :class="[item.activateUrl === data && 'font-weight-bold']"
              >{{ data }}</a
            >
            <template v-else>
              {{ data }}
            </template>
          </template>
        </ExpandInfo>
      </template>
      <template #item.tags="{ item }">
        <v-chip
          v-for="tag in item.tags?.slice(0, 4) /* 只显示前4个tag */"
          :key="tag"
          class="mr-1 mb-1"
          label
          size="x-small"
          :title="tag"
        >
          {{ tag }}
        </v-chip>
      </template>
      <template #item.isOffline="{ item }">
        <v-switch
          v-model="item.isOffline"
          color="success"
          hide-details
          @update:model-value="
            (v) => siteStore.simplePatchSite(item.id, 'isOffline', v)
          "
        />
      </template>
      <template #item.allowSearch="{ item }">
        <v-switch
          v-model="item.allowSearch"
          color="success"
          hide-details
          :disabled="item.isOffline || !Object.hasOwn(item, 'search')"
          @update:model-value="
            (v) => siteStore.simplePatchSite(item.id, 'allowSearch', v)
          "
        />
      </template>
      <template #item.allowQueryUserInfo="{ item }">
        <v-switch
          v-model="item.allowQueryUserInfo"
          color="success"
          hide-details
          :disabled="item.isOffline || !Object.hasOwn(item, 'userInfo')"
          @update:model-value="
            (v) => siteStore.simplePatchSite(item.id, 'allowQueryUserInfo', v)
          "
        />
      </template>
      <template #item.showMessageCount="{ item }">
        <v-switch
          v-model="item.showMessageCount"
          color="success"
          hide-details
          :disabled="
            item.isOffline ||
            !Object.hasOwn(item, 'userInfo') ||
            item.allowQueryUserInfo === false
          "
          @update:model-value="
            (v) => siteStore.simplePatchSite(item.id, 'showMessageCount', v)
          "
        />
      </template>
      <template #item.action="{ item }">
        <v-btn-group variant="plain">
          <v-btn
            size="small"
            icon="mdi-pencil"
            :title="$t('common.edit')"
            color="info"
            @click="editSite(item)"
          />
          <v-btn
            size="small"
            icon="mdi-magnify"
            title="search entity"
            :color="lightSiteSearchEntityBtn(item.defaultSearchParams) ? 'warning' : ''"
            @click="editSearchEntity(item)"
          />
          <!-- userinfo -->
          <v-btn
            size="small"
            icon="mdi-delete"
            color="error"
            :title="$t('common.remove')"
            @click="deleteSite(item.id)"
          />
        </v-btn-group>
      </template>
    </v-data-table>
  </v-card>

  <AddDialog v-model="showAddDialog" />
  <EditDialog v-model="showEditDialog" v-model:site-config="siteConfig" />
  <SearchParamsDialog
    v-model="showSearchParamsDialog"
    v-model:site-config="siteConfig"
  />
  <DeleteDialog v-model="showDeleteDialog" :to-delete-ids="toDeleteIds" />

  <v-alert color="grey">
    <template v-for="i in $tm('setSite.index.settingNote')" :key="i">
      {{ $rt(i) }} <br />
    </template>
  </v-alert>
</template>

<style scoped></style>
