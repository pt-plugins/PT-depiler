<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { CAddTorrentOptions } from "@ptd/downloader";
import type { ICrossSeedCandidate } from "@ptd/crossSeed";

import type { IKeepUploadTask } from "@/shared/types.ts";
import { sendMessage } from "@/messages.ts";
import { formatSize } from "@/options/utils.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";

const showDialog = defineModel<boolean>({ default: false });
const emit = defineEmits<{ created: [] }>();

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const downloaderId = ref<string>("");
const scanning = ref(false);
const scanDone = ref(false);
const candidates = ref<ICrossSeedCandidate[]>([]);
const selected = ref<Set<string>>(new Set());
const creating = ref(false);
const pushing = ref(false);

const downloaderItems = computed(() =>
  Object.entries(metadataStore.downloaders)
    .filter(([, c]) => c.enabled && c.type)
    .map(([id, c]) => ({ title: c.name || id, value: id })),
);

// 每次打开时重置状态并默认选中第一个启用的下载器
watch(
  () => showDialog.value,
  (open) => {
    if (!open) return;
    downloaderId.value = downloaderItems.value[0]?.value ?? "";
    scanDone.value = false;
    candidates.value = [];
    selected.value = new Set();
  },
);

function candidateKey(c: ICrossSeedCandidate): string {
  return `${c.sourceInfoHash}|${c.siteId}|${c.torrentId}`;
}

/** 按勾选事件值显式设置/清除（而非翻转），保证多选行为确定 */
function toggleCandidate(c: ICrossSeedCandidate, checked: boolean) {
  const key = candidateKey(c);
  const next = new Set(selected.value);
  if (checked) {
    next.add(key);
  } else {
    next.delete(key);
  }
  selected.value = next;
}

function toggleSelectAllReady(checked: boolean) {
  const next = new Set<string>();
  if (checked) {
    for (const c of candidates.value) {
      if (c.status === "ready") next.add(candidateKey(c));
    }
  }
  selected.value = next;
}

const readyCount = computed(() => candidates.value.filter((c) => c.status === "ready").length);
const allReadySelected = computed(() => readyCount.value > 0 && readyCount.value === selectedCount.value);

const selectedCount = computed(
  () => candidates.value.filter((c) => c.status === "ready" && selected.value.has(candidateKey(c))).length,
);

const selectedCandidates = computed(() =>
  candidates.value.filter((c) => c.status === "ready" && selected.value.has(candidateKey(c))),
);

async function startScan() {
  if (!downloaderId.value) return;
  scanning.value = true;
  try {
    // 聚合扫描：按设置页「辅种方案开关」启用 IYUU/NexusPHP/Local 对应源
    candidates.value = await sendMessage("crossSeedScanForReseed", { downloaderId: downloaderId.value });
  } catch (e) {
    runtimeStore.showSnakebar(
      t("KeepUploadTask.iyuu.scanError", { reason: e instanceof Error ? e.message : String(e) }),
      {
        color: "error",
      },
    );
    candidates.value = [];
  } finally {
    scanning.value = false;
    scanDone.value = true;
  }
}

/** 构建下载器推送所需 options（与 keep-upload 发送链路一致：暂停/自动开始跟随下载器设置） */
function toAddTorrentOptions(sourceSavePath?: string): CAddTorrentOptions {
  const downloader = metadataStore.downloaders[downloaderId.value];
  return {
    localDownload: true,
    addAtPaused: !(downloader?.feature?.DefaultAutoStart ?? true),
    savePath: sourceSavePath || "",
  };
}

/**
 * 一键推送辅种（参照 iyuuplus-dev）：勾选候选直接 downloadTorrent 到所选下载器，不创建辅种任务。
 * 下载链接在发送时由站点适配器（site + torrent_id）构建，扫描阶段不预取。
 */
async function pushReseed() {
  const chosen = selectedCandidates.value;
  if (chosen.length === 0) return;
  pushing.value = true;
  let ok = 0;
  let fail = 0;
  let skipped = 0;
  let lastReason = "";
  try {
    for (const c of chosen) {
      // 跨扫描去重：已在决策表中记录为已推送的候选，跳过并提示
      if (c.injected) {
        skipped++;
        continue;
      }
      try {
        const result = await sendMessage("downloadTorrent", {
          torrent: {
            site: c.siteId,
            id: c.torrentId,
            title: c.sourceName || c.siteName,
            link: "",
            url: "",
          },
          downloaderId: downloaderId.value,
          addTorrentOptions: toAddTorrentOptions(c.sourceSavePath),
        });
        if (result.downloadStatus === "failed") {
          fail++;
          lastReason = result.errorMessage || c.siteName;
        } else {
          ok++;
          // 记录已推送（decision 持久化），下次扫描去重
          await sendMessage("reseedDecisionRecord", {
            siteId: c.siteId,
            torrentId: c.torrentId,
            infoHash: c.sourceInfoHash,
          });
        }
      } catch (e) {
        fail++;
        lastReason = e instanceof Error ? e.message : String(e);
      }
    }

    if (fail > 0 || skipped > 0) {
      runtimeStore.showSnakebar(t("KeepUploadTask.iyuu.pushPartial", { ok, fail, reason: lastReason, skipped }), {
        color: "warning",
      });
    } else {
      runtimeStore.showSnakebar(t("KeepUploadTask.iyuu.pushSuccess", { count: ok }), { color: "success" });
    }
    // 移除已推送的勾选，保留结果列表便于继续选择其他候选
    for (const c of chosen) {
      toggleCandidate(c, false);
    }
  } catch (e) {
    runtimeStore.showSnakebar(
      t("KeepUploadTask.iyuu.pushError", { reason: e instanceof Error ? e.message : String(e) }),
      {
        color: "error",
      },
    );
  } finally {
    pushing.value = false;
  }
}

// 把勾选的候选按来源资源（sourceInfoHash）分组，每组创建一个辅种任务
async function createTaskFromScan() {
  const chosen = selectedCandidates.value;
  if (chosen.length === 0) return;

  creating.value = true;
  const downloader = metadataStore.downloaders[downloaderId.value];
  const groups = new Map<string, ICrossSeedCandidate[]>();
  for (const c of chosen) {
    const key = c.sourceInfoHash || "none";
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }

  try {
    for (const cands of groups.values()) {
      const first = cands[0];
      const task: IKeepUploadTask = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        time: Date.now(),
        title: first.sourceName || first.siteName,
        size: first.sourceSize || 0,
        downloadOptions: {
          downloaderId: downloaderId.value,
          savePath: first.sourceSavePath || undefined,
          clientName: downloader?.name || downloaderId.value,
        },
        items: cands.map((c) => ({
          site: c.siteId,
          // 懒加载链接：任务项携带站点种子 id，发送时由站点适配器构建真实下载链接
          id: c.torrentId,
          title: c.sourceName || c.siteName,
          link: "",
          url: "",
          size: c.sourceSize || 0,
        })),
      };
      await sendMessage("createKeepUploadTask", task);
    }
    runtimeStore.showSnakebar(t("KeepUploadTask.iyuu.createSuccess", { count: groups.size }), { color: "success" });
    showDialog.value = false;
    emit("created");
  } catch (e) {
    runtimeStore.showSnakebar(t("KeepUploadTask.iyuu.createError"), { color: "error" });
  } finally {
    creating.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="860">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-scan-helper</v-icon>
        <span>{{ t("KeepUploadTask.iyuu.scan") }}</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" :title="t('common.dialog.close')" @click="showDialog = false" />
      </v-card-title>
      <v-divider />

      <v-card-text>
        <!-- 下载器选择 -->
        <v-row v-if="!scanDone && !scanning" align="center" class="pa-2">
          <v-col cols="7">
            <v-select
              v-model="downloaderId"
              :items="downloaderItems"
              item-title="title"
              item-value="value"
              :label="t('KeepUploadTask.iyuu.chooseDownloader')"
              density="compact"
              variant="outlined"
              hide-details
            />
          </v-col>
          <v-col class="col-auto" style="flex: none">
            <v-btn color="primary" :disabled="!downloaderId" @click="startScan">
              <v-icon class="mr-2">mdi-play</v-icon>
              {{ t("KeepUploadTask.iyuu.startScan") }}
            </v-btn>
          </v-col>
        </v-row>

        <div v-if="scanning" class="text-center py-6">
          <v-progress-circular indeterminate size="32" width="3" />
          <div class="text-body-small text-grey mt-2">{{ t("KeepUploadTask.iyuu.scanning") }}</div>
        </div>

        <template v-if="scanDone && !scanning">
          <v-alert v-if="candidates.length === 0" type="info" variant="tonal">
            {{ t("KeepUploadTask.iyuu.noResult") }}
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
                      :title="t('KeepUploadTask.iyuu.selectAll')"
                      @update:model-value="(v) => toggleSelectAllReady(Boolean(v))"
                    />
                  </th>
                  <th>{{ t("KeepUploadTask.iyuu.columnSite") }}</th>
                  <th>{{ t("KeepUploadTask.iyuu.columnTitle") }}</th>
                  <th class="text-end">{{ t("KeepUploadTask.iyuu.columnSize") }}</th>
                  <th class="text-center" style="width: 110px">{{ t("KeepUploadTask.iyuu.columnStatus") }}</th>
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
                      style="max-width: 300px; vertical-align: middle"
                    >
                      {{ c.sourceName || c.siteName }}
                    </span>
                  </td>
                  <td class="text-end text-body-small">
                    {{ c.sourceSize ? formatSize(c.sourceSize) : "-" }}
                  </td>
                  <td class="text-center">
                    <div class="d-flex justify-center align-center ga-1">
                      <v-chip v-if="c.status === 'ready'" size="x-small" color="success">
                        {{ t("KeepUploadTask.iyuu.statusReady") }}
                      </v-chip>
                      <v-chip
                        v-if="c.status === 'ready' && typeof c.progress === 'number' && c.progress < 100"
                        size="x-small"
                        color="amber"
                        :title="t('KeepUploadTask.iyuu.statusPartial')"
                      >
                        {{ c.progress }}%
                      </v-chip>
                      <v-chip v-if="c.status === 'ready' && c.injected" size="x-small" color="grey">
                        {{ t("KeepUploadTask.iyuu.statusInjected") }}
                      </v-chip>
                      <v-tooltip v-if="c.status !== 'ready'" :text="c.error || ''">
                        <template #activator="{ props }">
                          <v-chip v-bind="props" size="x-small" color="error">
                            {{ t("KeepUploadTask.iyuu.statusError") }}
                          </v-chip>
                        </template>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-alert type="info" variant="tonal" density="compact" class="mt-2">
              {{ t("KeepUploadTask.iyuu.groupHint") }}
            </v-alert>
          </template>
        </template>
      </v-card-text>

      <v-card-actions v-if="scanDone && !scanning">
        <v-spacer />
        <v-btn variant="text" @click="showDialog = false">{{ t("common.dialog.close") }}</v-btn>

        <v-btn color="primary" :disabled="selectedCount === 0" :loading="pushing" @click="pushReseed">
          <v-icon class="mr-2">mdi-send</v-icon>
          {{ t("KeepUploadTask.iyuu.push", { count: selectedCount }) }}
        </v-btn>

        <v-btn variant="tonal" :disabled="selectedCount === 0" :loading="creating" @click="createTaskFromScan">
          {{ t("KeepUploadTask.iyuu.createTask", { count: selectedCount }) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
