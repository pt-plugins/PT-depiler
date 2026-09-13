<script setup lang="ts">
/**
 * IYUU 辅种中心 设置窗口（P0）
 * - token 配置（存本地 storage，随 metadata 备份导出/恢复）
 * - 站点表：拉取后全量展示 IYUU 返回信息；映射到本地站点的行显示本地图标与名称
 * - 已持有站点：勾选即自动保存（无需手动保存清单），最后「保存并汇报」获取 sid_sha1（7 天有效）
 */
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { sendMessage } from "@/messages.ts";
import type { IIyuuStorageSchema, IIyuuSiteCacheEntry } from "@/shared/types.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { iyuuSiteToLocal } from "@ptd/iyuu";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";

interface ISiteRow {
  site: IIyuuSiteCacheEntry;
  /** 映射到的本地站点 id；未映射时为 undefined */
  local?: string;
}

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const token = ref("");
const sitesCache = ref<IIyuuSiteCacheEntry[]>([]);
const heldSites = ref<IIyuuStorageSchema["heldSites"]>([]);
const sidSha1Preview = ref("");
const sidSha1ExpiredAt = ref<number | undefined>(undefined);
const deriving = ref(false);
const reporting = ref(false);
const loadingSites = ref(false);

/** 站点表行（预解析映射关系，模板直接消费） */
const siteRows = computed<ISiteRow[]>(() =>
  sitesCache.value.map((site) => ({ site, local: iyuuSiteToLocal(site.site) })),
);

const heldCount = computed(() => heldSites.value?.length ?? 0);

async function loadConfig() {
  const config = await sendMessage("getIyuusConfig", undefined);
  token.value = config?.token ?? "";
  heldSites.value = config?.heldSites ?? [];
  sidSha1Preview.value = config?.sidSha1 ? config.sidSha1.slice(0, 8) : "";
  sidSha1ExpiredAt.value = config?.sidSha1ExpiresAt;
}

async function saveToken() {
  await sendMessage("setIyuusConfig", { token: token.value.trim() });
  runtimeStore.showSnakebar(t("SetBase.iyuu.tokenSaved"), { color: "success" });
}

async function fetchSites() {
  loadingSites.value = true;
  try {
    sitesCache.value = await sendMessage("iyuuFetchSites", undefined);
    runtimeStore.showSnakebar(t("SetBase.iyuu.sitesLoaded", { count: sitesCache.value.length }), { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar(e instanceof Error ? e.message : String(e), { color: "error" });
  } finally {
    loadingSites.value = false;
  }
}

function isHeld(local?: string): boolean {
  return !!local && (heldSites.value ?? []).includes(local);
}

/** 行显示名：映射站用本地站名，未映射站用 IYUU 昵称 */
function rowDisplayName(row: ISiteRow): string {
  return row.local ? (metadataStore.siteNameMap[row.local] ?? row.local) : row.site.nickname || row.site.site;
}

/** 勾选即自动保存持有清单（未映射行无本地 id，不可勾选） */
async function toggleHeld(row: ISiteRow, checked: boolean) {
  if (!row.local) return;
  const next = new Set(heldSites.value ?? []);
  if (checked) {
    next.add(row.local);
  } else {
    next.delete(row.local);
  }
  heldSites.value = [...next];
  try {
    await sendMessage("setIyuusConfig", { heldSites: heldSites.value });
  } catch (e) {
    runtimeStore.showSnakebar(e instanceof Error ? e.message : String(e), { color: "error" });
  }
}

/** 推导已持有站点：metadata.sites ∩ IYUU 站表 → 自动合并打勾并保存 */
async function deriveHeld() {
  deriving.value = true;
  try {
    const result = await sendMessage("iyuuDeriveHeldSites", undefined);
    const next = new Set([...(heldSites.value ?? []), ...result.localIds]);
    heldSites.value = [...next];
    await sendMessage("setIyuusConfig", { heldSites: heldSites.value });
    runtimeStore.showSnakebar(
      t("SetBase.iyuu.deriveDone", { count: result.localIds.length, unmatched: result.unmatched.length }),
      { color: "success" },
    );
  } catch (e) {
    runtimeStore.showSnakebar(e instanceof Error ? e.message : String(e), { color: "error" });
  } finally {
    deriving.value = false;
  }
}

/** 保存并汇报：先以当前勾选落盘，再反向映射 sid 列表 → sid_sha1 */
async function report() {
  const held = heldSites.value ?? [];
  if (!held.length) {
    runtimeStore.showSnakebar(t("SetBase.iyuu.noHeldSites"), { color: "warning" });
    return;
  }
  reporting.value = true;
  try {
    await sendMessage("setIyuusConfig", { heldSites: held });
    if (!sitesCache.value.length) {
      sitesCache.value = await sendMessage("iyuuFetchSites", undefined);
    }
    // 经映射表反向：held(local id) → sid（精确，不经字符串匹配）
    const sidList: number[] = [];
    for (const site of sitesCache.value) {
      const local = iyuuSiteToLocal(site.site);
      if (local && held.includes(local)) {
        sidList.push(site.id);
      }
    }

    const sha1 = await sendMessage("iyuuReportExisting", sidList);
    sidSha1Preview.value = sha1.slice(0, 8);
    sidSha1ExpiredAt.value = Date.now() + 7 * 24 * 60 * 60 * 1000;
    runtimeStore.showSnakebar(t("SetBase.iyuu.reportDone", { sha1: sidSha1Preview.value }), { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar(e instanceof Error ? e.message : String(e), { color: "error" });
  } finally {
    reporting.value = false;
  }
}

onMounted(loadConfig);
</script>

<template>
  <v-container fluid>
    <!-- Token -->
    <v-card class="mb-4">
      <v-card-title>{{ t("SetBase.iyuu.tokenTitle") }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="token"
          :label="t('SetBase.iyuu.tokenLabel')"
          :hint="t('SetBase.iyuu.tokenHint')"
          persistent-hint
          variant="outlined"
          autocomplete="off"
        />
        <v-btn color="primary" variant="tonal" :disabled="!token.trim()" @click="saveToken">
          {{ t("SetBase.iyuu.saveToken") }}
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- 已持有站点 -->
    <v-card>
      <v-card-title>{{ t("SetBase.iyuu.heldTitle") }}</v-card-title>
      <v-card-text>
        <v-alert type="info" variant="tonal" density="compact" class="mb-3">
          {{ t("SetBase.iyuu.heldHint") }}
        </v-alert>

        <div class="d-flex ga-2 mb-3">
          <v-btn :loading="loadingSites" variant="tonal" @click="fetchSites">
            {{ t("SetBase.iyuu.fetchSites") }}
          </v-btn>
          <v-btn :loading="deriving" color="primary" variant="tonal" @click="deriveHeld">
            {{ t("SetBase.iyuu.deriveHeld") }}
          </v-btn>
          <v-btn :loading="reporting" color="success" variant="tonal" @click="report">
            {{ t("SetBase.iyuu.report") }}
          </v-btn>
        </div>

        <v-alert v-if="!sitesCache.length && !loadingSites" type="info" variant="tonal" density="compact" class="mb-2">
          {{ t("SetBase.iyuu.fetchHint") }}
        </v-alert>

        <v-table v-if="sitesCache.length" density="compact">
          <thead>
            <tr>
              <th style="width: 48px"></th>
              <th>{{ t("SetBase.iyuu.columnSite") }}</th>
              <th>{{ t("SetBase.iyuu.columnNote") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in siteRows" :key="row.site.id">
              <td>
                <v-checkbox
                  :model-value="isHeld(row.local)"
                  :disabled="!row.local"
                  density="compact"
                  hide-details
                  @update:model-value="(v) => toggleHeld(row, Boolean(v))"
                />
              </td>
              <td>
                <div class="d-flex align-center ga-2">
                  <SiteFavicon v-if="row.local" :site-id="row.local" :size="20" />
                  <v-icon v-else icon="mdi-vector-square" size="small" class="text-grey" />
                  <span class="text-body-medium">
                    {{ rowDisplayName(row) }}
                    <span class="text-body-small text-grey ml-1">{{ row.site.site }}</span>
                  </span>
                </div>
              </td>
              <td>
                <v-chip v-if="row.local" size="x-small" color="primary" variant="tonal">
                  {{ row.local }}
                </v-chip>
                <v-chip v-else size="x-small" color="grey" variant="tonal">
                  {{ t("SetBase.iyuu.unmapped") }}
                </v-chip>
                <span class="text-body-small text-grey ml-2">{{ row.site.base_url }}</span>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-list-item v-if="sidSha1Preview" density="compact" class="mt-2">
          <template #prepend>
            <v-icon icon="mdi-key-outline" />
          </template>
          <v-list-item-title>
            sid_sha1: <code>{{ sidSha1Preview }}…</code>
            <span v-if="sidSha1ExpiredAt" class="text-grey text-body-small ml-2">
              ({{ t("SetBase.iyuu.expiresAt") }} {{ new Date(sidSha1ExpiredAt).toLocaleString() }})
            </span>
          </v-list-item-title>
        </v-list-item>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss"></style>
