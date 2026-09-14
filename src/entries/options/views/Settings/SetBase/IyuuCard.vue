<script setup lang="ts">
/**
 * 辅种方案配置卡片集合（非完整 window，作为「辅种」tab 的内容卡使用）
 * 1. IYUU - 基于特征码的索引工具：token 配置（存本地 storage，随 metadata 备份导出/恢复）
 *    + 站点表全量展示（映射行显示本地图标与名称）+ 已持有站点勾选即存 +「保存并汇报」获取 sid_sha1
 * 2. 本地文件树对比（LocalCrossSeed）：目标站勾选 + 匹配模式/搜索上限
 * 3. NexusPHP pieces-hash 直查：站点接口与 passkey 配置
 */
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { sendMessage } from "@/messages.ts";
import type { IIyuuStorageSchema, IIyuuSiteCacheEntry } from "@/shared/types.ts";
import { getDefinedSiteMetadata } from "@ptd/site";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useConfigStore } from "@/options/stores/config.ts";
import { iyuuSiteToLocal } from "@ptd/crossSeed";

import SiteFavicon from "@/options/components/SiteFavicon/Index.vue";
import NexusSiteDialog from "./NexusSiteDialog.vue";

interface ISiteRow {
  site: IIyuuSiteCacheEntry;
  /** 映射到的本地站点 id；未映射时为 undefined */
  local?: string;
}

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();
const configStore = useConfigStore();

// 各辅种方案开关（关闭时对应配置卡隐藏，见 ReseedWindow「辅种方案开关」）
const showLocal = computed(() => configStore.reseed?.enableLocal ?? false);
const showNexus = computed(() => configStore.reseed?.enableNexus ?? true);
const showIyuus = computed(() => configStore.reseed?.enableIyuus ?? true);

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

// ── NexusPHP pieces-hash 直查配置 ──────────────────────
const nexusInputs = ref<Record<string, { apiUrl: string; passkey: string; enabled: boolean }>>({});
const localSiteIds = computed(() => Object.keys(metadataStore.sites ?? {}));
const savingNexus = ref(false);
/** 已添加站点的 schema 映射（id → "NexusPHP" 等） */
const siteSchemaMap = ref<Record<string, string>>({});
/** 额外站点配置 dialog */
const showNexusDialog = ref(false);

async function loadSiteSchemaMap() {
  const ids = localSiteIds.value;
  const entries = await Promise.all(
    ids.map(async (id) => {
      try {
        return [id, (await getDefinedSiteMetadata(id)).schema ?? ""] as const;
      } catch {
        return [id, ""] as const;
      }
    }),
  );
  siteSchemaMap.value = Object.fromEntries(entries);
}

const nexusSiteOptions = computed(() => localSiteIds.value.map((id) => ({ title: nexusSiteName(id), value: id })));

/**
 * 展示行：schema 明确为 NexusPHP 的已添加站点 + 已手动配置（enabled）的额外站点。
 * 额外站点经 NexusSiteDialog 添加后写回 nexusSites，刷新后此处可见。
 */
const nexusRows = computed(() =>
  localSiteIds.value.filter((id) => siteSchemaMap.value[id] === "NexusPHP" || nexusInputs.value[id]?.enabled),
);

/** 默认接口地址：站点配置基址 + /api/pieces-hash（host 与完整 url 由站点定义拼接） */
function defaultNexusApiUrl(siteId: string): string {
  const base = metadataStore.sites[siteId]?.url ?? "";
  return `${String(base).replace(/\/+$/, "")}/api/pieces-hash`;
}

function nexusSiteName(siteId: string): string {
  return metadataStore.siteNameMap[siteId] ?? siteId;
}

function loadNexusInputs(config: IIyuuStorageSchema | undefined) {
  const nexusSites = config?.nexusSites ?? {};
  nexusInputs.value = Object.fromEntries(
    localSiteIds.value.map((id) => [
      id,
      {
        apiUrl: nexusSites[id]?.apiUrl ?? "",
        passkey: nexusSites[id]?.passkey ?? "",
        enabled: nexusSites[id]?.enabled ?? false,
      },
    ]),
  );
}

async function saveNexusConfig() {
  savingNexus.value = true;
  try {
    const nexusSites: NonNullable<IIyuuStorageSchema["nexusSites"]> = {};
    for (const id of localSiteIds.value) {
      const v = nexusInputs.value[id];
      if (!v.apiUrl && !v.passkey && !v.enabled) continue;
      nexusSites[id] = { apiUrl: v.apiUrl || undefined, passkey: v.passkey || undefined, enabled: v.enabled };
    }
    await sendMessage("setIyuusConfig", { nexusSites });
    runtimeStore.showSnakebar(t("SetBase.iyuu.nexusSaved"), { color: "success" });
  } catch (e) {
    runtimeStore.showSnakebar(e instanceof Error ? e.message : String(e), { color: "error" });
  } finally {
    savingNexus.value = false;
  }
}

async function loadConfig() {
  const config = await sendMessage("getIyuusConfig", undefined);
  token.value = config?.token ?? "";
  heldSites.value = config?.heldSites ?? [];
  sidSha1Preview.value = config?.sidSha1 ? config.sidSha1.slice(0, 8) : "";
  sidSha1ExpiredAt.value = config?.sidSha1ExpiresAt;
  loadNexusInputs(config);
  loadLocalConfig(config);
  await loadSiteSchemaMap();
}

// ── LocalCrossSeed 本地对比配置 ─────────────────────────
const localSites = ref<IIyuuStorageSchema["localSites"]>([]);
const localMatchMode = ref<NonNullable<IIyuuStorageSchema["localMatchMode"]>>("strict");
const localSearchLimit = ref(10);

function loadLocalConfig(config: IIyuuStorageSchema | undefined) {
  localSites.value = config?.localSites ?? [];
  localMatchMode.value = config?.localMatchMode ?? "strict";
  localSearchLimit.value = config?.localSearchLimit ?? 10;
}

function isLocalTarget(local?: string): boolean {
  return !!local && (localSites.value ?? []).includes(local);
}

/** 勾选本地对比目标站（自动保存 meta.iyuu.localSites） */
async function toggleLocalTarget(row: ISiteRow, checked: boolean) {
  if (!row.local) return;
  const next = new Set(localSites.value ?? []);
  if (checked) {
    next.add(row.local);
  } else {
    next.delete(row.local);
  }
  localSites.value = [...next];
  await sendMessage("setIyuusConfig", { localSites: localSites.value });
}

async function saveLocalConfig() {
  await sendMessage("setIyuusConfig", {
    localMatchMode: localMatchMode.value,
    localSearchLimit: localSearchLimit.value,
  });
  runtimeStore.showSnakebar(t("SetBase.iyuu.localSaved"), { color: "success" });
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

/** 未拉取站点表时也可删减已保存的持有站点（chips） */
async function removeHeld(id: string) {
  heldSites.value = (heldSites.value ?? []).filter((x) => x !== id);
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
    <v-alert v-if="!showLocal && !showNexus && !showIyuus" type="info" variant="tonal">
      {{ t("SetBase.reseed.sourcesDisabledHint") }}
    </v-alert>

    <!-- 2. LocalCrossSeed 本地文件树对比（开关关闭时隐藏） -->
    <v-card v-if="showLocal" class="mb-4">
      <v-card-title>{{ t("SetBase.iyuu.localTitle") }}</v-card-title>
      <v-card-text>
        <v-alert type="info" variant="tonal" density="compact" class="mb-3">
          {{ t("SetBase.iyuu.localHint") }}
        </v-alert>

        <v-row class="mb-2" align="center">
          <v-col cols="5">
            <v-select
              v-model="localMatchMode"
              :items="[
                { title: t('SetBase.iyuu.localMatchModeStrict'), value: 'strict' },
                { title: t('SetBase.iyuu.localMatchModeFlexible'), value: 'flexible' },
                { title: t('SetBase.iyuu.localMatchModePartial'), value: 'partial' },
              ]"
              :label="t('SetBase.iyuu.localMatchModeLabel')"
              density="compact"
              variant="outlined"
              hide-details
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model.number="localSearchLimit"
              :label="t('SetBase.iyuu.localSearchLimitLabel')"
              type="number"
              min="1"
              max="100"
              density="compact"
              variant="outlined"
              hide-details
            />
          </v-col>
          <v-col class="col-auto" style="flex: none">
            <v-btn color="primary" variant="tonal" @click="saveLocalConfig">
              {{ t("SetBase.iyuu.localSave") }}
            </v-btn>
          </v-col>
        </v-row>

        <v-table v-if="siteRows.length" density="compact">
          <thead>
            <tr>
              <th style="width: 56px"></th>
              <th>{{ t("SetBase.iyuu.columnSite") }}</th>
              <th>{{ t("SetBase.iyuu.columnNote") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in siteRows" :key="row.site.id">
              <td>
                <v-checkbox
                  :model-value="isLocalTarget(row.local)"
                  :disabled="!row.local"
                  density="compact"
                  hide-details
                  @update:model-value="(v) => toggleLocalTarget(row, Boolean(v))"
                />
              </td>
              <td>
                <div class="d-flex align-center ga-2" style="min-width: 0">
                  <SiteFavicon v-if="row.local" :site-id="row.local" :size="20" />
                  <v-icon v-else icon="mdi-vector-square" size="small" class="text-grey" />
                  <span class="text-body-medium text-truncate d-inline-block" style="vertical-align: middle">
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
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" variant="tonal" density="compact">
          {{ t("SetBase.iyuu.localNoSites") }}
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- 3. NexusPHP pieces-hash 直查（开关关闭时隐藏） -->
    <v-card v-if="showNexus" class="mb-4">
      <v-card-title>{{ t("SetBase.iyuu.nexusTitle") }}</v-card-title>
      <v-card-text>
        <v-alert type="info" variant="tonal" density="compact" class="mb-3">
          {{ t("SetBase.iyuu.nexusHint") }}
        </v-alert>

        <v-alert type="warning" variant="tonal" density="compact" class="mb-3">
          {{ t("SetBase.iyuu.nexusWarn") }}
        </v-alert>

        <div class="d-flex align-center mb-2">
          <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="showNexusDialog = true">
            {{ t("SetBase.iyuu.nexusAddExtra") }}
          </v-btn>
          <span class="text-body-small text-grey ml-2">
            {{ t("SetBase.iyuu.nexusRowsHint", { count: nexusRows.length, total: localSiteIds.length }) }}
          </span>
        </div>

        <v-table v-if="nexusRows.length" density="compact">
          <thead>
            <tr>
              <th>{{ t("SetBase.iyuu.nexusSiteColumn") }}</th>
              <th>{{ t("SetBase.iyuu.nexusUrlColumn") }}</th>
              <th>{{ t("SetBase.iyuu.nexusPasskeyColumn") }}</th>
              <th style="width: 80px">{{ t("SetBase.iyuu.nexusEnabledColumn") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="siteId in nexusRows" :key="siteId">
              <td>
                <div class="d-flex align-center ga-2">
                  <SiteFavicon :site-id="siteId" :size="20" />
                  <span class="text-body-medium">{{ nexusSiteName(siteId) }}</span>
                </div>
              </td>
              <td>
                <v-text-field
                  v-model="nexusInputs[siteId].apiUrl"
                  :placeholder="defaultNexusApiUrl(siteId)"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </td>
              <td>
                <v-text-field
                  v-model="nexusInputs[siteId].passkey"
                  :placeholder="t('SetBase.iyuu.nexusPasskeyPlaceholder')"
                  density="compact"
                  variant="outlined"
                  hide-details
                  autocomplete="off"
                />
              </td>
              <td>
                <v-tooltip
                  :disabled="!!nexusInputs[siteId].passkey.trim()"
                  :text="t('SetBase.iyuu.nexusEnabledRequiresPasskey')"
                >
                  <template #activator="{ props }">
                    <v-checkbox
                      v-bind="props"
                      v-model="nexusInputs[siteId].enabled"
                      :disabled="!nexusInputs[siteId].passkey.trim()"
                      density="compact"
                      hide-details
                    />
                  </template>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" variant="tonal" density="compact">
          {{ t("SetBase.iyuu.nexusNoNexusSites") }}
        </v-alert>

        <div class="d-flex align-center ga-2 mt-3">
          <v-btn :loading="savingNexus" color="primary" variant="tonal" @click="saveNexusConfig">
            {{ t("SetBase.iyuu.nexusSave") }}
          </v-btn>
          <span class="text-body-small text-grey">{{ t("SetBase.iyuu.nexusSavedHint") }}</span>
        </div>
      </v-card-text>
    </v-card>

    <!-- 4. IYUU - 基于特征码的索引工具（含 Token 与已持有站点；开关关闭时隐藏） -->
    <v-card v-if="showIyuus" class="mb-4">
      <v-card-title>{{ t("SetBase.reseed.iyuuCardTitle") }}</v-card-title>
      <v-card-text>
        <div class="text-subtitle-2 mb-2">{{ t("SetBase.iyuu.tokenTitle") }}</div>
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

        <v-divider class="my-4" />

        <div class="text-subtitle-2 mb-2">{{ t("SetBase.iyuu.heldTitle") }}</div>
        <v-alert type="info" variant="tonal" density="compact" class="mb-3">
          {{ t("SetBase.iyuu.heldHint") }}
        </v-alert>

        <div class="d-flex align-center ga-2 mb-3">
          <v-btn :loading="loadingSites" variant="tonal" @click="fetchSites">
            {{ t("SetBase.iyuu.fetchSites") }}
          </v-btn>
          <v-btn :loading="deriving" color="primary" variant="tonal" @click="deriveHeld">
            {{ t("SetBase.iyuu.deriveHeld") }}
          </v-btn>
          <v-btn :loading="reporting" color="success" variant="tonal" @click="report">
            {{ t("SetBase.iyuu.report") }}
          </v-btn>

          <v-spacer />

          <span v-if="sidSha1Preview" class="text-body-small text-grey">
            <v-icon icon="mdi-key-outline" size="small" class="mr-1" />
            sid_sha1: <code>{{ sidSha1Preview }}…</code>
            <span v-if="sidSha1ExpiredAt" class="text-grey text-body-small ml-2">
              ({{ t("SetBase.iyuu.expiresAt") }} {{ new Date(sidSha1ExpiredAt).toLocaleString() }})
            </span>
          </span>
        </div>

        <!-- 未拉取站点表：展示已保存的持有站点（可删减），并提示可拉取完整站点表 -->
        <template v-if="!sitesCache.length && !loadingSites">
          <div v-if="(heldSites?.length ?? 0) > 0" class="d-flex flex-wrap ga-1 mb-2">
            <v-chip v-for="id in heldSites" :key="id" closable class="ma-1" @click:close="removeHeld(id)">
              <SiteFavicon :site-id="id" :size="16" />
              <span class="ml-1">{{ metadataStore.siteNameMap[id] ?? id }}</span>
            </v-chip>
          </div>
          <v-alert type="info" variant="tonal" density="compact" class="mb-2">
            {{ t("SetBase.iyuu.fetchHint") }}
          </v-alert>
        </template>

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
                <div class="d-flex align-center ga-2" style="min-width: 0">
                  <SiteFavicon v-if="row.local" :site-id="row.local" :size="20" />
                  <v-icon v-else icon="mdi-vector-square" size="small" class="text-grey" />
                  <span class="text-body-medium text-truncate d-inline-block" style="vertical-align: middle">
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
      </v-card-text>
    </v-card>

    <NexusSiteDialog v-model="showNexusDialog" :site-options="nexusSiteOptions" @saved="loadConfig" />
  </v-container>
</template>

<style scoped lang="scss"></style>
