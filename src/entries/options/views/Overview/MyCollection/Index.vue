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
import TorrentTitleTd from "@/options/components/TorrentTitleTd.vue";

const { t } = useI18n();
const configStore = useConfigStore();
const runtimeStore = useRuntimeStore();

const favorites = ref<ITorrentFavoriteItem[]>([]);
const selectedKeys = ref<TTorrentFavoriteKey[]>([]);
const favCategoryFilter = ref<string[]>([]); // 空数组表示全部分类，"" 表示未分类，其余为分类名（可多选）
const loading = ref(false);

const tableWaitFilter = ref("");
const tableFilter = refDebounced(tableWaitFilter, 500); // 延迟搜索过滤词的生成

const tableHeader = computed(() =>
  useTableActionColumn([
    { title: t("common.site"), key: "site", align: "center", sortable: false, width: 80 },
    // 与搜索结果页一致：标题列限宽（长标题截断），其余列给固定宽度，避免标题被挤成一两行文字
    { title: t("MyCollection.table.title"), key: "title", align: "start", minWidth: "18rem", maxWidth: "30vw" },
    { title: t("MyCollection.table.category"), key: "category", align: "center", width: 90 },
    { title: t("MyCollection.table.favCategories"), key: "favCategories", align: "center", width: 140 },
    { title: t("MyCollection.table.size"), key: "size", align: "end", width: 100 },
    { title: t("MyCollection.table.time"), key: "time", align: "center", width: 150 },
    { title: t("MyCollection.table.createdAt"), key: "createdAt", align: "center", width: 160 },
    { title: t("common.action"), key: "action", align: "center", width: 150, minWidth: 150, sortable: false },
  ] as DataTableHeader[]),
);

// 已有收藏分类（不含未分类），既用于筛选也用于表格中的分类 chip
const favCategories = computed(() => [...new Set(favorites.value.flatMap((x) => x.favCategories ?? []))]);

// 未分类 / 各分类的收藏数量（展示在下拉项右侧）
const favCategoryCounts = computed(() => {
  const counts = new Map<string, number>([["", 0]]);
  for (const favorite of favorites.value) {
    const categories = favorite.favCategories ?? [];
    if (categories.length === 0) {
      counts.set("", (counts.get("") ?? 0) + 1);
    }
    for (const category of categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return counts;
});

const favCategoryFilterItems = computed(() => [
  { title: t("MyCollection.table.unclassified"), value: "", count: favCategoryCounts.value.get("") ?? 0 },
  { type: "divider" }, // 未分类与用户分类之间用横线分隔
  ...favCategories.value.map((category) => ({
    title: category,
    value: category,
    count: favCategoryCounts.value.get(category) ?? 0,
  })),
]);

// 空数组表示全部分类；"" 表示未分类；其余为分类名（可多选，命中任一即展示）
const filteredFavorites = computed(() => {
  const filters = favCategoryFilter.value;
  if (filters.length === 0) {
    return favorites.value;
  }
  return favorites.value.filter((favorite) => {
    const categories = favorite.favCategories ?? [];
    return filters.some((filter) => (filter === "" ? categories.length === 0 : categories.includes(filter)));
  });
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

        <!-- 集中下载收藏的种子（例如等到站免时批量推送到下载器）；星标可批量为选中的收藏改分类/备注 -->
        <ActionTd :torrent-items="selectedFavorites" @favorite-saved="loadFavorites" />

        <v-spacer />

        <v-select
          v-model="favCategoryFilter"
          :items="favCategoryFilterItems"
          :label="t('MyCollection.table.favCategories')"
          :placeholder="t('MyCollection.filterAll')"
          chips
          clearable
          closable-chips
          class="table-header-filter-clear"
          density="compact"
          hide-details
          max-width="240"
          multiple
          persistent-placeholder
          prepend-inner-icon="mdi-folder-outline"
        >
          <!-- 自定义下拉项：右侧显示该分类的收藏数量（而非默认的选中勾选框） -->
          <template #item="{ props, item }">
            <v-list-item v-bind="props" role="option">
              <template #prepend="{ isSelected }">
                <v-checkbox-btn :model-value="isSelected" tabindex="-1" @click.prevent />
              </template>
              <template #append>
                <span class="text-grey text-body-small">{{ item.count }}</span>
              </template>
            </v-list-item>
          </template>
        </v-select>

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
        <!-- 备注：与正文同号展示（不加 text-body-small），否则太不显眼 -->
        <div v-if="item.comment" class="text-grey" :title="item.comment">
          <v-icon icon="mdi-comment-text-outline" size="x-small" />
          {{ item.comment }}
        </div>
      </template>

      <template #item.favCategories="{ item }">
        <template v-if="(item.favCategories ?? []).length > 0">
          <v-chip
            v-for="category in item.favCategories"
            :key="category"
            class="ma-1"
            color="amber"
            size="small"
            variant="tonal"
            @click="favCategoryFilter = [category]"
          >
            {{ category }}
          </v-chip>
        </template>
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
        <!-- 行内「操作」与「编辑收藏」是同一套动作：星标即编辑该收藏的分类与备注，删除与其同组以保证格式一致 -->
        <ActionTd
          :favorite-btn-title="t('MyCollection.table.action.edit')"
          :torrent-items="[item]"
          density="compact"
          :show-keep-upload-btn="false"
          @favorite-saved="loadFavorites"
        >
          <template #append>
            <v-btn
              color="error"
              :size="'small'"
              icon="mdi-delete"
              :title="t('common.remove')"
              @click="tryToDelete([item.key])"
            />
          </template>
        </ActionTd>
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
</template>

<style scoped lang="scss"></style>
