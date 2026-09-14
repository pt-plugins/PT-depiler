<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

import type { CTorrent, TorrentClientMetaData } from "@ptd/downloader";
import type { ICrossSeedCandidate } from "@ptd/crossSeed";
import { sendMessage } from "@/messages.ts";
import { formatSize } from "@/options/utils.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";

const showDialog = defineModel<boolean>({ default: false });
const { torrent } = defineProps<{
  torrent: CTorrent | null;
}>();

const { t } = useI18n();
const runtimeStore = useRuntimeStore();

const loading = ref(false);
const error = ref("");
const candidates = ref<ICrossSeedCandidate[]>([]);
const selected = ref<Set<string>>(new Set());
const injecting = ref(false);
const metaData = ref<TorrentClientMetaData | null>(null);

const selectedCount = computed(
  () => candidates.value.filter((c) => c.status === "ready" && selected.value.has(reseedKey(c))).length,
);
const readyCount = computed(() => candidates.value.filter((c) => c.status === "ready").length);
const allReadySelected = computed(() => readyCount.value > 0 && readyCount.value === selectedCount.value);

function reseedKey(c: ICrossSeedCandidate): string {
  return `${c.siteId}|${c.torrentId}`;
}

/** 按勾选事件值显式设置/清除（而非翻转），保证多选行为确定 */
function toggleCandidate(c: ICrossSeedCandidate, checked?: boolean) {
  const key = reseedKey(c);
  const next = new Set(selected.value);
  if (checked ?? !next.has(key)) {
    next.add(key);
  } else {
    next.delete(key);
  }
  selected.value = next;
}

/** 全选/全不选可辅种候选 */
function toggleSelectAllReady(checked: boolean) {
  const next = new Set<string>();
  if (checked) {
    for (const c of candidates.value) {
      if (c.status === "ready") next.add(reseedKey(c));
    }
  }
  selected.value = next;
}

// 每次打开时重置并按该种子聚合扫描（源按设置页辅种方案开关）
watch(
  () => showDialog.value,
  async (open) => {
    if (!open || !torrent) return;
    loading.value = true;
    error.value = "";
    candidates.value = [];
    selected.value = new Set();
    try {
      metaData.value = (await sendMessage("getDownloaderMetaData", torrent.clientId)) ?? null;
      candidates.value = await sendMessage("crossSeedScanTorrents", {
        torrents: [
          {
            clientId: torrent.clientId,
            infoHash: torrent.infoHash,
            name: torrent.name,
            savePath: torrent.savePath,
            totalSize: torrent.totalSize,
          },
        ],
      });
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  },
);

// 把勾选候选直接推送到当前下载器（保存到原种子目录）
async function injectReseed() {
  if (!torrent) return;
  const chosen = candidates.value.filter((c) => c.status === "ready" && selected.value.has(reseedKey(c)));
  if (chosen.length === 0) return;

  injecting.value = true;
  try {
    for (const c of chosen) {
      const result = await sendMessage("downloadTorrent", {
        torrent: {
          site: c.siteId,
          // 懒加载链接：发送时由站点适配器按 site + torrent_id 构建下载链接
          id: c.torrentId,
          title: c.sourceName || c.siteName,
          link: "",
          url: "",
        },
        downloaderId: torrent.clientId,
        addTorrentOptions: {
          localDownload: true,
          addAtPaused: !(metaData.value?.feature?.DefaultAutoStart ?? true),
          savePath: torrent.savePath,
        },
      });
      if (result.downloadStatus === "failed") {
        throw new Error(result.errorMessage || c.siteName);
      }
    }
    runtimeStore.showSnakebar(t("MyClient.detail.reseedInjectSuccess"), { color: "success" });
    showDialog.value = false;
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    runtimeStore.showSnakebar(t("MyClient.detail.reseedInjectError", { reason }), { color: "error" });
  } finally {
    injecting.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="760">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-scan-helper</v-icon>
        <span>{{ t("MyClient.detail.reseedDialogTitle") }}</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" :title="t('common.dialog.close')" @click="showDialog = false" />
      </v-card-title>
      <v-divider />

      <v-card-text>
        <div v-if="loading" class="text-center py-6">
          <v-progress-circular indeterminate size="32" width="3" />
        </div>

        <v-alert v-else-if="error" type="error" variant="tonal">
          {{ t("MyClient.detail.reseedQueryError", { reason: error }) }}
        </v-alert>

        <v-alert v-else-if="candidates.length === 0" type="info" variant="tonal">
          {{ t("MyClient.detail.reseedNoResult") }}
        </v-alert>

        <template v-else>
          <v-table density="compact">
            <thead>
              <tr>
                <th style="width: 44px">
                  <v-checkbox
                    :model-value="allReadySelected"
                    :disabled="readyCount === 0"
                    density="compact"
                    hide-details
                    :title="t('MyClient.detail.reseedSelectAll')"
                    @update:model-value="(v) => toggleSelectAllReady(Boolean(v))"
                  />
                </th>
                <th>{{ t("MyClient.detail.reseedColumnSite") }}</th>
                <th>{{ t("MyClient.detail.reseedColumnTitle") }}</th>
                <th class="text-end">{{ t("MyClient.detail.reseedColumnSize") }}</th>
                <th class="text-center" style="width: 110px">{{ t("MyClient.detail.reseedColumnStatus") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in candidates" :key="reseedKey(c)">
                <td>
                  <v-checkbox
                    v-if="c.status === 'ready'"
                    :model-value="selected.has(reseedKey(c))"
                    density="compact"
                    hide-details
                    @update:model-value="(v) => toggleCandidate(c, Boolean(v))"
                  />
                </td>
                <td>
                  <div class="d-flex align-center ga-1">
                    <SiteFavicon :site-id="c.siteId" :size="16" />
                    <span class="text-body-small">{{ c.siteName }}</span>
                    <v-chip size="x-small" variant="tonal" class="ml-1">
                      {{ t(`common.source.${c.source}`) }}
                    </v-chip>
                  </div>
                </td>
                <td>
                  <span
                    class="text-body-small text-truncate d-inline-block"
                    style="max-width: 280px; vertical-align: middle"
                  >
                    {{ c.sourceName || c.siteName }}
                  </span>
                </td>
                <td class="text-end text-body-small">
                  {{ c.sourceSize ? formatSize(c.sourceSize) : "-" }}
                </td>
                <td class="text-center">
                  <v-chip v-if="c.status === 'ready'" size="x-small" color="success">
                    {{ t("MyClient.detail.reseedStatusReady") }}
                  </v-chip>
                  <v-tooltip v-else :text="c.error || ''">
                    <template #activator="{ props }">
                      <v-chip v-bind="props" size="x-small" color="error">
                        {{ t("MyClient.detail.reseedStatusError") }}
                      </v-chip>
                    </template>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-alert type="info" variant="tonal" density="compact" class="mt-2">
            {{ t("MyClient.detail.reseedInjectHint") }}
          </v-alert>
        </template>
      </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn variant="text" @click="showDialog = false">{{ t("common.dialog.close") }}</v-btn>
        <v-btn color="primary" :disabled="selectedCount === 0" :loading="injecting" @click="injectReseed">
          {{ t("MyClient.detail.reseedInject", { count: selectedCount }) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
