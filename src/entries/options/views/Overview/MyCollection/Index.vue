<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import { refDebounced } from "@vueuse/core";
import type { DataTableHeader } from "vuetify";

import { sendMessage } from "@/messages.ts";
import { formatDate, formatSize } from "@/options/utils.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useTableActionColumn } from "@/options/directives/useTableActionColumn.ts";
import type { ITorrentFavoriteItem, TTorrentFavoriteKey } from "@/shared/types.ts";

import ActionTd from "@/options/views/Overview/SearchEntity/ActionTd.vue";
import DeleteDialog from "@/options/components/DeleteDialog.vue";
import NavButton from "@/options/components/NavButton.vue";
import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import SiteName from "@/options/components/SiteName.vue";
import TorrentFavoriteDialog from "@/options/components/TorrentFavoriteDialog.vue";
import TorrentTitleTd from "@/options/components/TorrentTitleTd.vue";

const { t } = useI18n();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();

const favorites = ref<ITorrentFavoriteItem[]>([]);
const selectedKeys = ref<TTorrentFavoriteKey[]>([]);
const favCategoryFilter = ref<string | null>(null); // null 表示全部分类，"" 表示未分类
const loading = ref(false);

const tableWaitFilter = ref("");
const tableFilter = refDebounced(tableWaitFilter, 500); // 延迟搜索过滤词的生成

const tableHeader = computed(() =>
  useTableActionColumn([
    { title: t("common.site"), key: "site", align: "center", sortable: false, width: 90 },
    { title: t("MyCollection.table.title"), key: "title", align: "start", minWidth: "25rem" },
    { title: t("MyCollection.table.category"), key: "category", align: "center" },
    { title: t("MyCollection.table.favCategory"), key: "favCategory", align: "center" },
    { title: t("MyCollection.table.size"), key: "size", align: "end" },
    { title: t("MyCollection.table.time"), key: "time", align: "center" },
    { title: t("MyCollection.table.createdAt"), key: "createdAt", align: "center" },
    { title: t("common.action"), key: "action", align: "center", sortable: false },
  ] as DataTableHeader[]),
);

// 已有收藏分类（不含未分类），既用于筛选也用于表格中的分类 chip
const favCategories = computed(() => [...new Set(favorites.value.map((x) => x.favCategory ?? "").filter(Boolean))]);

const favCategoryFilterItems = computed(() => [
  { title: t("MyCollection.filterAll"), value: null },
  { title: t("MyCollection.table.unclassified"), value: "" },
  ...favCategories.value.map((category) => ({ title: category, value: category })),
]);

const filteredFavorites = computed(() => {
  if (favCategoryFilter.value === null) {
    return favorites.value;
  }
  return favorites.value.filter((x) => (x.favCategory ?? "") === favCategoryFilter.value);
});

const selectedFavorites = computed(() => filteredFavorites.value.filter((x) => selectedKeys.value.includes(x.key)));

async function loadFavorites() {
  loading.value = true;
  try {
    favorites.value = await sendMessage("getTorrentFavorites", undefined);
  } catch (e) {
    console.error("[PTD] Failed to load torrent favorites:", e);
    runtimeStore.showSnackbar(t("MyCollection.loadError"), { color: "error" });
    favorites.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadFavorites();
});

const showDeleteDialog = ref(false);
const toDeleteKeys = ref<TTorrentFavoriteKey[]>([]);

function tryToDelete(keys: TTorrentFavoriteKey[]) {
  toDeleteKeys.value = keys;
  showDeleteDialog.value = true;
}

async function confirmDelete(key: TTorrentFavoriteKey) {
  await sendMessage("deleteTorrentFavorites", [key]);
  favorites.value = favorites.value.filter((x) => x.key !== key);
}

function afterDelete() {
  selectedKeys.value = selectedKeys.value.filter((key) => favorites.value.some((x) => x.key === key));
  runtimeStore.showSnackbar(t("MyCollection.deleteSuccess"), { color: "success" });
}

async function clearAll() {
  if (!confirm(t("MyCollection.clearConfirm"))) {
    return;
  }

  await sendMessage(
    "deleteTorrentFavorites",
    favorites.value.map((x) => x.key),
  );
  favorites.value = [];
  selectedKeys.value = [];
  runtimeStore.showSnackbar(t("MyCollection.deleteSuccess"), { color: "success" });
}

const showEditDialog = ref(false);
const toEditFavorite = ref<ITorrentFavoriteItem | null>(null);

function editFavorite(favorite: ITorrentFavoriteItem) {
  toEditFavorite.value = favorite;
  showEditDialog.value = true;
}
</script>

<template>
  <v-alert type="info" :title="t('route.Overview.MyCollection')">
    {{ t("MyCollection.alert") }}
  </v-alert>

  <v-card>
    <v-card-title>
      <v-row gap="0" class="ma-0">
        <NavButton
          :disabled="selectedKeys.length === 0"
          color="error"
          icon="mdi-delete"
          :text="t('common.remove')"
          @click="tryToDelete(selectedKeys)"
        />
        <NavButton
          :disabled="favorites.length === 0"
          color="error"
          icon="mdi-delete-sweep"
          :text="t('MyCollection.clearAll')"
          @click="clearAll"
        />

        <v-divider vertical class="mx-2" />

        <!-- 集中下载收藏的种子（例如等到站免时批量推送到下载器） -->
        <ActionTd :torrent-items="selectedFavorites" />

        <v-spacer />

        <v-select
          v-model="favCategoryFilter"
          :items="favCategoryFilterItems"
          class="table-header-filter-clear"
          density="compact"
          hide-details
          :label="t('MyCollection.table.favCategory')"
          max-width="200"
          prepend-inner-icon="mdi-folder-outline"
        />

        <v-text-field
          v-model="tableWaitFilter"
          append-icon="mdi-magnify"
          clearable
          density="compact"
          hide-details
          :label="t('MyCollection.filterLabel')"
          class="ml-2"
          max-width="400"
          single-line
        />
      </v-row>
    </v-card-title>

    <v-data-table
      v-model="selectedKeys"
      :headers="tableHeader"
      :items="filteredFavorites"
      :items-per-page="configStore.tableBehavior.MyCollection.itemsPerPage"
      :loading="loading"
      :multi-sort="configStore.enableTableMultiSort"
      :search="tableFilter"
      :sort-by="configStore.tableBehavior.MyCollection.sortBy"
      class="table-stripe table-header-no-wrap"
      hover
      item-value="key"
      show-select
      @update:itemsPerPage="(v) => configStore.updateTableBehavior('MyCollection', 'itemsPerPage', v)"
      @update:sortBy="(v) => configStore.updateTableBehavior('MyCollection', 'sortBy', v)"
    >
      <template #item.site="{ item }">
        <div class="d-flex flex-column align-center">
          <SiteFavicon :site-id="item.site" :size="18" />
          <SiteName :site-id="item.site" />
        </div>
      </template>

      <template #item.title="{ item }">
        <TorrentTitleTd :item="item" />
        <div v-if="item.comment" class="text-body-small text-grey" :title="item.comment">
          <v-icon icon="mdi-comment-text-outline" size="x-small" />
          {{ item.comment }}
        </div>
      </template>

      <template #item.favCategory="{ item }">
        <v-chip
          v-if="item.favCategory"
          color="amber"
          size="small"
          variant="tonal"
          @click="favCategoryFilter = item.favCategory"
        >
          {{ item.favCategory }}
        </v-chip>
        <span v-else class="text-grey">{{ t("MyCollection.table.unclassified") }}</span>
      </template>

      <template #item.size="{ item }">
        <span class="t_size text-no-wrap">{{ formatSize(item.size ?? 0) }}</span>
      </template>

      <template #item.time="{ item }">
        <span class="t_time text-no-wrap">{{ item.time ? formatDate(item.time) : "-" }}</span>
      </template>

      <template #item.createdAt="{ item }">
        <span class="text-no-wrap">{{ formatDate(item.createdAt) }}</span>
      </template>

      <template #item.action="{ item }">
        <ActionTd :torrent-items="[item]" density="compact" :show-keep-upload-btn="false" />
        <v-btn
          color="blue"
          icon="mdi-pencil"
          size="small"
          :title="t('common.edit')"
          variant="text"
          @click="editFavorite(item)"
        />
        <v-btn
          color="error"
          icon="mdi-delete"
          size="small"
          :title="t('common.remove')"
          variant="text"
          @click="tryToDelete([item.key])"
        />
      </template>

      <template #no-data>
        <v-alert type="info" variant="tonal">
          {{ t("MyCollection.emptyNotice") }}
        </v-alert>
      </template>
    </v-data-table>
  </v-card>

  <DeleteDialog
    v-model="showDeleteDialog"
    :confirm-delete="confirmDelete"
    :to-delete-ids="toDeleteKeys"
    @all-delete="afterDelete"
  />
  <TorrentFavoriteDialog
    v-model="showEditDialog"
    :edit-favorite="toEditFavorite"
    :torrent-items="toEditFavorite ? [toEditFavorite] : []"
    @saved="loadFavorites"
  />
</template>

<style scoped lang="scss"></style>
