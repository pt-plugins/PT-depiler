<script setup lang="ts">
/**
 * 额外站点配置 Dialog（NexusPHP pieces-hash 直查）：
 * 选择已添加站点 → 配置接口地址（留空用默认）/passkey → 保存时验证接口存在（非 HTTP 404）→ 写回 nexusSites。
 */
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { sendMessage } from "@/messages.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";

const { t } = useI18n();
const runtimeStore = useRuntimeStore();
const metadataStore = useMetadataStore();

const showDialog = defineModel<boolean>({ default: false });
const emit = defineEmits<{ saved: [] }>();

const { siteOptions } = defineProps<{
  siteOptions: Array<{ title: string; value: string }>;
}>();

const siteId = ref("");
const apiUrl = ref("");
const passkey = ref("");
const saving = ref(false);

/** 默认接口地址：站点配置基址 + /api/pieces-hash */
function defaultApiUrl(target: string): string {
  const base = target ? (metadataStore.sites[target]?.url ?? "") : "";
  return `${String(base).replace(/\/+$/, "")}/api/pieces-hash`;
}

watch(
  () => showDialog.value,
  (open) => {
    if (!open) return;
    siteId.value = siteOptions[0]?.value ?? "";
    apiUrl.value = "";
    passkey.value = "";
  },
);

watch(siteId, (id) => {
  // 切换站点时若接口地址为空，自动带出该站默认地址
  if (id && !apiUrl.value.trim()) {
    apiUrl.value = defaultApiUrl(id);
  }
});

async function saveExtraSite() {
  if (!siteId.value) {
    runtimeStore.showSnakebar(t("SetBase.iyuu.nexusDialogChooseSite"), { color: "warning" });
    return;
  }
  const targetApi = apiUrl.value.trim() || defaultApiUrl(siteId.value);
  const targetPasskey = passkey.value.trim();
  if (!targetPasskey) {
    runtimeStore.showSnakebar(t("SetBase.iyuu.nexusDialogPasskeyRequired"), { color: "warning" });
    return;
  }

  saving.value = true;
  try {
    // 保存前验证接口存在（非 HTTP 404 即视为可达）
    const verify = await sendMessage("nexusValidateApi", { apiUrl: targetApi, passkey: targetPasskey });
    if (!verify.ok) {
      runtimeStore.showSnakebar(
        t("SetBase.iyuu.nexusVerifyFailed", { reason: verify.error ?? String(verify.status ?? "") }),
        {
          color: "error",
        },
      );
      return;
    }

    // 合并写回：保留已有 nexusSites 配置
    const config = await sendMessage("getIyuusConfig", undefined);
    const next = { ...(config?.nexusSites ?? {}) };
    next[siteId.value] = { apiUrl: targetApi, passkey: targetPasskey, enabled: true };
    await sendMessage("setIyuusConfig", { nexusSites: next });

    runtimeStore.showSnakebar(t("SetBase.iyuu.nexusVerifyOk", { status: verify.status ?? "" }), { color: "success" });
    showDialog.value = false;
    emit("saved");
  } catch (e) {
    runtimeStore.showSnakebar(e instanceof Error ? e.message : String(e), { color: "error" });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="520">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-plus-circle</v-icon>
        <span>{{ t("SetBase.iyuu.nexusDialogTitle") }}</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" :title="t('common.dialog.close')" @click="showDialog = false" />
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-alert type="info" variant="tonal" density="compact" class="mb-3">
          {{ t("SetBase.iyuu.nexusDialogHint") }}
        </v-alert>

        <v-select
          v-model="siteId"
          :items="siteOptions"
          item-title="title"
          item-value="value"
          :label="t('SetBase.iyuu.nexusDialogSiteLabel')"
          density="compact"
          variant="outlined"
          hide-details
          class="mb-3"
        />

        <v-text-field
          v-model="apiUrl"
          :label="t('SetBase.iyuu.nexusDialogApiLabel')"
          :hint="t('SetBase.iyuu.nexusDialogApiHint')"
          persistent-hint
          density="compact"
          variant="outlined"
          class="mb-3"
        />

        <v-text-field
          v-model="passkey"
          :label="t('SetBase.iyuu.nexusDialogPasskeyLabel')"
          density="compact"
          variant="outlined"
          hide-details
          autocomplete="off"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="showDialog = false">{{ t("common.dialog.close") }}</v-btn>
        <v-btn color="primary" :loading="saving" :disabled="!siteId" @click="saveExtraSite">
          <v-icon class="mr-2">mdi-check</v-icon>
          {{ t("SetBase.iyuu.nexusDialogSave") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
