<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { ITorrent } from "@ptd/site";

import { sendMessage } from "@/messages.ts";
import { getTorrentFavoriteKey, normalizeFavCategories, type ITorrentFavoriteItem } from "@/shared/types.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { formatSize } from "@/options/utils.ts";

const showDialog = defineModel<boolean>();

const { torrentItems } = defineProps<{
  torrentItems: ITorrent[];
}>();

const emits = defineEmits<{
  (e: "saved"): void;
}>();

const { t } = useI18n();
const runtimeStore = useRuntimeStore();

const favCategories = ref<string[]>([]); // 收藏分类（用户自设，类似文件夹，同一种子可入多个）
const favCategorySearch = ref<string>(""); // 分类输入框中的待提交内容
const comment = ref<string>(""); // 备注
const favCategoryOptions = ref<string[]>([]); // 已有分类，作为输入建议
const favorites = shallowRef<ITorrentFavoriteItem[]>([]); // 当前已收藏的条目，用于提示与回填
const saving = ref(false);

const favoriteMap = computed(() => new Map(favorites.value.map((x) => [x.key, x])));
const favoritedItems = computed(() =>
  torrentItems.filter((item) => favoriteMap.value.has(getTorrentFavoriteKey(item))),
);

/** 选中的种子全部已收藏时视为「编辑收藏」：回填其分类与备注，避免直接覆盖成空值 */
const isEdit = computed(() => torrentItems.length > 0 && favoritedItems.value.length === torrentItems.length);

const totalSize = computed(() => torrentItems.reduce((acc, item) => acc + (item.size ?? 0), 0));

function isFavorited(torrent: ITorrent) {
  return favoriteMap.value.has(getTorrentFavoriteKey(torrent));
}

watch(showDialog, async (show) => {
  if (!show) {
    return;
  }

  favorites.value = [];
  favCategories.value = [];
  favCategorySearch.value = "";
  comment.value = "";

  try {
    favorites.value = await sendMessage("getTorrentFavorites", undefined);
  } catch (e) {
    console.error("[PTD] Failed to load torrent favorites:", e);
  }

  favCategoryOptions.value = [...new Set(favorites.value.flatMap((x) => x.favCategories ?? []))];

  // 回填第一个种子的收藏信息（新建收藏时通常为空）
  const exist = torrentItems.length > 0 ? favoriteMap.value.get(getTorrentFavoriteKey(torrentItems[0]!)) : undefined;
  favCategories.value = [...(exist?.favCategories ?? [])];
  comment.value = exist?.comment ?? "";
});

/**
 * 成功提示按「新增 / 更新」区分：编辑已有收藏时不能再说「已收藏」，否则会被误认为重复收藏了一次
 */
function successMessage(count: number) {
  const updated = favoritedItems.value.length;
  const added = count - updated;

  if (updated === 0) {
    return t("MyCollection.dialog.saveSuccess", [added]);
  }
  if (added === 0) {
    return t("MyCollection.dialog.editSuccess", [updated]);
  }
  return t("MyCollection.dialog.saveAndEditSuccess", [added, updated]);
}

async function save() {
  saving.value = true;
  try {
    // 传入空数组 / 空字符串表示清空该项，缺省才表示保持原值；此处始终以输入框中的内容为准
    const count = await sendMessage("createTorrentFavorites", {
      torrents: torrentItems,
      favCategories: normalizeFavCategories([...favCategories.value, favCategorySearch.value]),
      comment: comment.value.trim(),
    });
    runtimeStore.showSnackbar(successMessage(count), { color: "success" });
    emits("saved");
    showDialog.value = false;
  } catch (e) {
    runtimeStore.showSnackbar(t("MyCollection.dialog.saveError"), { color: "error" });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="760" :persistent="saving" scrollable>
    <v-card>
      <v-card-title class="bg-amber-lighten-3">
        {{ isEdit ? t("MyCollection.dialog.editTitle") : t("MyCollection.dialog.title", [torrentItems.length]) }}
      </v-card-title>

      <v-card-text>
        <v-combobox
          v-model="favCategories"
          v-model:search="favCategorySearch"
          :items="favCategoryOptions"
          :label="t('MyCollection.dialog.favCategories')"
          :hint="t('MyCollection.dialog.favCategoriesHint')"
          chips
          clearable
          density="comfortable"
          multiple
          persistent-hint
        />
        <v-textarea
          v-model="comment"
          :label="t('MyCollection.dialog.comment')"
          auto-grow
          class="mt-4"
          clearable
          rows="2"
        />

        <v-alert
          v-if="favoritedItems.length > 0 && !isEdit"
          class="mt-4"
          density="compact"
          type="warning"
          variant="tonal"
        >
          {{ t("MyCollection.dialog.alreadyFavoritedNotice", [favoritedItems.length]) }}
        </v-alert>

        <v-list class="mt-2 overflow-y-auto" density="compact" max-height="240">
          <v-list-item
            v-for="torrent in torrentItems"
            :key="getTorrentFavoriteKey(torrent)"
            :subtitle="formatSize(torrent.size ?? 0)"
            :title="torrent.title"
          >
            <template #append>
              <v-chip v-if="isFavorited(torrent)" color="amber" size="small">
                {{ t("MyCollection.dialog.alreadyFavorited") }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <span class="ml-2 text-body-small text-grey">
          {{ t("MyCollection.dialog.totalSize", [formatSize(totalSize)]) }}
        </span>
        <v-spacer />
        <v-btn color="info" prepend-icon="mdi-close-circle" variant="text" @click="showDialog = false">
          {{ t("common.dialog.cancel") }}
        </v-btn>
        <v-btn :loading="saving" color="primary" prepend-icon="mdi-star" variant="text" @click="save">
          {{ t("common.dialog.ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
