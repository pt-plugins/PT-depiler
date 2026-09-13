<script setup lang="ts">
/**
 * IYUU 辅种中心 设置窗口（P0）
 * - token 配置（存本地 storage，不进备份）
 * - 已持有站点：从本地已配置站点自动推导（metadata.sites ∩ IYUU 104 站），可手动增删
 * - 汇报持有站点 → sid_sha1（7 天有效，站点列表不变可复用）
 */
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { sendMessage } from "@/messages.ts";
import type { IIyuuStorageSchema, IIyuuSiteCacheEntry } from "@/shared/types.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { iyuuSiteToLocal } from "@ptd/iyuu";

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

async function deriveHeld() {
  deriving.value = true;
  try {
    const result = await sendMessage("iyuuDeriveHeldSites", undefined);
    heldSites.value = [...result.localIds, ...(heldSites.value ?? [])].filter(
      (id, index, arr) => !!id && arr.indexOf(id) === index,
    );
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

async function saveHeldSites() {
  await sendMessage("setIyuusConfig", { heldSites: heldSites.value });
  runtimeStore.showSnakebar(t("SetBase.iyuu.heldSaved"), { color: "success" });
}

async function report() {
  const held = heldSites.value ?? [];
  if (!held.length) {
    runtimeStore.showSnakebar(t("SetBase.iyuu.noHeldSites"), { color: "warning" });
    return;
  }
  reporting.value = true;
  try {
    if (!sitesCache.value.length) {
      sitesCache.value = await sendMessage("iyuuFetchSites", undefined);
    }
    // 经映射表反向：held(local id) → sid（精确，不经字符串匹配）
    const sidList: number[] = [];
    const unmatched: string[] = [];
    for (const site of sitesCache.value) {
      const local = iyuuSiteToLocal(site.site);
      if (local && held.includes(local)) {
        sidList.push(site.id);
      }
    }
    unmatched.push(...held.filter((id) => !sitesCache.value.some((s) => iyuuSiteToLocal(s.site) === id)));

    const sha1 = await sendMessage("iyuuReportExisting", sidList);
    sidSha1Preview.value = sha1.slice(0, 8);
    sidSha1ExpiredAt.value = Date.now() + 7 * 24 * 60 * 60 * 1000;
    runtimeStore.showSnakebar(
      unmatched.length
        ? t("SetBase.iyuu.reportDoneWithUnmatched", { sha1: sidSha1Preview.value, unmatched: unmatched.join(", ") })
        : t("SetBase.iyuu.reportDone", { sha1: sidSha1Preview.value }),
      { color: unmatched.length ? "warning" : "success" },
    );
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

    <!-- 持有站点推导与汇报 -->
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
          <v-btn :disabled="!heldSites?.length" variant="tonal" @click="saveHeldSites">
            {{ t("SetBase.iyuu.saveHeld") }}
          </v-btn>
        </div>

        <v-chip
          v-for="label in heldSites ?? []"
          :key="label"
          closable
          class="ma-1"
          @click:close="heldSites = (heldSites ?? []).filter((x) => x !== label)"
        >
          {{ metadataStore.siteNameMap[label] ?? label }}
        </v-chip>
        <v-alert v-if="!heldSites?.length" type="info" variant="tonal" density="compact" class="mt-2">
          {{ t("SetBase.iyuu.noHeldSites") }}
        </v-alert>

        <v-divider class="my-3" />

        <v-btn :loading="reporting" color="success" variant="tonal" @click="report">
          {{ t("SetBase.iyuu.report") }}
        </v-btn>
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
