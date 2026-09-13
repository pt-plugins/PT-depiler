<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { IYUUReseedCandidate } from "@ptd/iyuu";

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
const candidates = ref<IYUUReseedCandidate[]>([]);
const selected = ref<Set<string>>(new Set());
const creating = ref(false);

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

function candidateKey(c: IYUUReseedCandidate): string {
  return `${c.sourceInfoHash}|${c.siteId}|${c.torrentId}`;
}

function toggleCandidate(c: IYUUReseedCandidate) {
  const key = candidateKey(c);
  const next = new Set(selected.value);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  selected.value = next;
}

const selectedCount = computed(
  () => candidates.value.filter((c) => c.status === "ready" && selected.value.has(candidateKey(c))).length,
);

async function startScan() {
  if (!downloaderId.value) return;
  scanning.value = true;
  try {
    candidates.value = await sendMessage("iyuuScanForReseed", downloaderId.value);
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

// 把勾选的候选按来源资源（sourceInfoHash）分组，每组创建一个辅种任务
async function createTaskFromScan() {
  const chosen = candidates.value.filter((c) => c.status === "ready" && selected.value.has(candidateKey(c)));
  if (chosen.length === 0) return;

  creating.value = true;
  const downloader = metadataStore.downloaders[downloaderId.value];
  const groups = new Map<string, IYUUReseedCandidate[]>();
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
          title: c.sourceName || c.siteName,
          link: c.downloadUrl || "",
          url: c.downloadUrl || "",
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
                  <th style="width: 44px"></th>
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
                      style="max-width: 300px; vertical-align: middle"
                    >
                      {{ c.sourceName || c.siteName }}
                    </span>
                  </td>
                  <td class="text-end text-body-small">
                    {{ c.sourceSize ? formatSize(c.sourceSize) : "-" }}
                  </td>
                  <td class="text-center">
                    <v-chip v-if="c.status === 'ready'" size="x-small" color="success">
                      {{ t("KeepUploadTask.iyuu.statusReady") }}
                    </v-chip>
                    <v-tooltip v-else :text="c.error || ''">
                      <template #activator="{ props }">
                        <v-chip v-bind="props" size="x-small" color="error">
                          {{ t("KeepUploadTask.iyuu.statusError") }}
                        </v-chip>
                      </template>
                    </v-tooltip>
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
        <v-btn color="primary" :disabled="selectedCount === 0" :loading="creating" @click="createTaskFromScan">
          {{ t("KeepUploadTask.iyuu.createTask", { count: selectedCount }) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
