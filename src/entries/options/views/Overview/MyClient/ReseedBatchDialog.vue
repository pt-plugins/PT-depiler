<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

import type { CTorrent } from "@ptd/downloader";
import type { ICrossSeedCandidate } from "@ptd/crossSeed";
import { sendMessage } from "@/messages.ts";
import { formatSize } from "@/options/utils.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";

const showDialog = defineModel<boolean>({ default: false });
const { torrents } = defineProps<{
  torrents: CTorrent[];
}>();

const { t } = useI18n();
const runtimeStore = useRuntimeStore();

const loading = ref(false);
const error = ref("");
const candidates = ref<ICrossSeedCandidate[]>([]);
const selected = ref<Set<string>>(new Set());
const injecting = ref(false);

// 来源种子（infoHash → torrent），注入时定位目标下载器与保存目录
const sourceByHash = new Map<string, CTorrent>();
// 下载器 feature 缓存（clientId → DefaultAutoStart）
const autoStartCache = new Map<string, boolean>();

const selectedCount = computed(
  () => candidates.value.filter((c) => c.status === "ready" && selected.value.has(candidateKey(c))).length,
);

function candidateKey(c: ICrossSeedCandidate): string {
  return `${c.sourceInfoHash}|${c.siteId}|${c.torrentId}`;
}

function toggleCandidate(c: ICrossSeedCandidate) {
  const key = candidateKey(c);
  const next = new Set(selected.value);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  selected.value = next;
}

async function defaultAutoStart(clientId: string): Promise<boolean> {
  if (!autoStartCache.has(clientId)) {
    try {
      const meta = await sendMessage("getDownloaderMetaData", clientId);
      autoStartCache.set(clientId, meta?.feature?.DefaultAutoStart?.allowed ?? true);
    } catch {
      autoStartCache.set(clientId, true);
    }
  }
  return autoStartCache.get(clientId)!;
}

// 每次打开时重置并按所选种子 hash 批量查询（每批 100）
watch(
  () => showDialog.value,
  async (open) => {
    if (!open) return;
    loading.value = true;
    error.value = "";
    candidates.value = [];
    selected.value = new Set();
    sourceByHash.clear();
    autoStartCache.clear();

    const hashes: string[] = [];
    for (const t of torrents) {
      if (!t.infoHash || sourceByHash.has(t.infoHash)) continue;
      sourceByHash.set(t.infoHash, t);
      hashes.push(t.infoHash);
    }

    try {
      const hits: Array<{ sid: number; torrent_id: number; info_hash: string }> = [];
      for (let i = 0; i < hashes.length; i += 100) {
        const resp = await sendMessage("iyuuQueryReseed", hashes.slice(i, i + 100));
        for (const [hash, item] of Object.entries(resp)) {
          for (const h of item.torrent ?? []) {
            hits.push({ sid: h.sid, torrent_id: h.torrent_id, info_hash: hash });
          }
        }
      }
      // 消息传输经 JSON 序列化，Map 会退化为普通对象，这里必须传 Record
      const sources: Record<string, { name: string; savePath: string; size: number }> = {};
      for (const [hash, t] of sourceByHash.entries()) {
        sources[hash] = { name: t.name, savePath: t.savePath, size: t.totalSize };
      }
      candidates.value = await sendMessage("iyuuResolveHits", { hits, sources });
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  },
);

// 把勾选候选注入到各自来源种子的下载器（保存到来源目录）
async function injectReseed() {
  const chosen = candidates.value.filter((c) => c.status === "ready" && selected.value.has(candidateKey(c)));
  if (chosen.length === 0) return;

  injecting.value = true;
  let ok = 0;
  let fail = 0;
  let lastReason = "";
  try {
    for (const c of chosen) {
      const src = sourceByHash.get(c.sourceInfoHash);
      if (!src) {
        fail++;
        lastReason = "missing source torrent";
        continue;
      }
      try {
        const result = await sendMessage("downloadTorrent", {
          torrent: {
            site: c.siteId,
            title: c.sourceName || c.siteName,
            link: c.downloadUrl || "",
            url: c.downloadUrl || "",
          },
          downloaderId: src.clientId,
          addTorrentOptions: {
            localDownload: true,
            addAtPaused: !(await defaultAutoStart(src.clientId)),
            savePath: src.savePath,
          },
        });
        if (result.downloadStatus === "failed") {
          fail++;
          lastReason = result.errorMessage || c.siteName;
        } else {
          ok++;
        }
      } catch (e) {
        fail++;
        lastReason = e instanceof Error ? e.message : String(e);
      }
    }

    if (fail > 0) {
      runtimeStore.showSnakebar(t("MyClient.iyuuScan.injectPartial", { ok, fail, reason: lastReason }), {
        color: "warning",
      });
    } else {
      runtimeStore.showSnakebar(t("MyClient.iyuuScan.injectSuccess", { count: ok }), { color: "success" });
    }
    showDialog.value = false;
  } catch (e) {
    runtimeStore.showSnakebar(
      t("MyClient.iyuuScan.injectError", { reason: e instanceof Error ? e.message : String(e) }),
      {
        color: "error",
      },
    );
  } finally {
    injecting.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="860">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-scan-helper</v-icon>
        <span>{{ t("MyClient.iyuuScan.dialogTitle", { count: torrents.length }) }}</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" :title="t('common.dialog.close')" @click="showDialog = false" />
      </v-card-title>
      <v-divider />

      <v-card-text>
        <div v-if="loading" class="text-center py-6">
          <v-progress-circular indeterminate size="32" width="3" />
          <div class="text-body-small text-grey mt-2">{{ t("MyClient.iyuuScan.scanning") }}</div>
        </div>

        <v-alert v-else-if="error" type="error" variant="tonal">
          {{ t("MyClient.iyuuScan.queryError", { reason: error }) }}
        </v-alert>

        <v-alert v-else-if="candidates.length === 0" type="info" variant="tonal">
          {{ t("MyClient.iyuuScan.noResult") }}
        </v-alert>

        <template v-else>
          <v-table density="compact">
            <thead>
              <tr>
                <th style="width: 44px"></th>
                <th>{{ t("MyClient.iyuuScan.columnSite") }}</th>
                <th>{{ t("MyClient.iyuuScan.columnTitle") }}</th>
                <th class="text-end">{{ t("MyClient.iyuuScan.columnSize") }}</th>
                <th class="text-center" style="width: 110px">{{ t("MyClient.iyuuScan.columnStatus") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in candidates" :key="candidateKey(c)">
                <td>
                  <v-checkbox
                    v-if="c.status === 'ready'"
                    :model-value="selected.has(candidateKey(c))"
                    density="compact"
                    hide-details
                    @update:model-value="toggleCandidate(c)"
                  />
                </td>
                <td>
                  <div class="d-flex align-center ga-1">
                    <SiteFavicon :site-id="c.siteId" :size="16" />
                    <span class="text-body-small">{{ c.siteName }}</span>
                  </div>
                </td>
                <td>
                  <span
                    class="text-body-small text-truncate d-inline-block"
                    style="max-width: 320px; vertical-align: middle"
                  >
                    {{ c.sourceName || c.siteName }}
                  </span>
                </td>
                <td class="text-end text-body-small">
                  {{ c.sourceSize ? formatSize(c.sourceSize) : "-" }}
                </td>
                <td class="text-center">
                  <v-chip v-if="c.status === 'ready'" size="x-small" color="success">
                    {{ t("MyClient.iyuuScan.statusReady") }}
                  </v-chip>
                  <v-tooltip v-else :text="c.error || ''">
                    <template #activator="{ props }">
                      <v-chip v-bind="props" size="x-small" color="error">
                        {{ t("MyClient.iyuuScan.statusError") }}
                      </v-chip>
                    </template>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-alert type="info" variant="tonal" density="compact" class="mt-2">
            {{ t("MyClient.iyuuScan.injectHint") }}
          </v-alert>
        </template>
      </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn variant="text" @click="showDialog = false">{{ t("common.dialog.close") }}</v-btn>
        <v-btn color="primary" :disabled="selectedCount === 0" :loading="injecting" @click="injectReseed">
          {{ t("MyClient.iyuuScan.inject", { count: selectedCount }) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
