<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";

import { sendMessage } from "@/messages.ts";
import type { BridgeState, BridgeStatus } from "@/shared/types.ts";

const { t } = useI18n();

const extensionId = chrome.runtime.id;

function detectBrowserFamily(): string {
  if (__BROWSER__ === "firefox") return "firefox";
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "edge";
  if (ua.includes("Chromium/")) return "chromium";
  return "chrome";
}

const browserFamily = detectBrowserFamily();
const setupCommand = computed(() => {
  if (browserFamily === "firefox") {
    return "ptd install --browser firefox";
  }
  return `ptd install --browser ${browserFamily} --extension-id ${extensionId}`;
});

const status = shallowRef<BridgeStatus>({
  permissionGranted: false,
  enabled: true,
  state: "no-permission",
  connected: false,
});

const loading = ref(false);
const testLoading = ref(false);
const permissionLoading = ref(false);

async function refreshStatus() {
  try {
    status.value = await sendMessage("nativeBridgeGetStatus", undefined);
  } catch (e: any) {
    console.debug("[PTD] Failed to get bridge status:", e);
  }
}

async function grantPermission() {
  permissionLoading.value = true;
  try {
    const granted = await chrome.permissions.request({ permissions: ["nativeMessaging"] });
    if (granted) {
      await refreshStatus();
    } else {
      console.debug("[PTD]", t("SetNativeBridge.permission.grantFailed"));
    }
  } catch (e: any) {
    console.debug("[PTD] Permission request error:", e);
  } finally {
    permissionLoading.value = false;
  }
}

async function revokePermission() {
  permissionLoading.value = true;
  try {
    await chrome.permissions.remove({ permissions: ["nativeMessaging"] });
    await refreshStatus();
  } catch (e: any) {
    console.debug("[PTD] Permission revoke error:", e);
  } finally {
    permissionLoading.value = false;
  }
}

async function toggleEnabled(newValue: boolean) {
  loading.value = true;
  try {
    status.value = await sendMessage("nativeBridgeSetEnabled", newValue);
  } catch (e: any) {
    console.debug("[PTD] Failed to set enabled:", e);
  } finally {
    loading.value = false;
  }
}

async function waitForSettledState(maxMs = 5000, intervalMs = 500) {
  const transientStates: BridgeState[] = ["connecting", "retrying"];
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    await new Promise((r) => setTimeout(r, intervalMs));
    await refreshStatus();
    if (!transientStates.includes(status.value.state)) {
      return;
    }
  }
}

async function testConnection() {
  testLoading.value = true;
  try {
    status.value = await sendMessage("nativeBridgeReconnect", undefined);
    if (status.value.state === "connecting") {
      await waitForSettledState();
    }
  } catch (e: any) {
    console.debug("[PTD] Reconnect failed:", e);
  } finally {
    testLoading.value = false;
  }
}

const stateColor: Record<BridgeState, string> = {
  "no-permission": "grey",
  disabled: "grey",
  connecting: "orange",
  connected: "green",
  retrying: "orange",
  error: "red",
};

onMounted(() => {
  refreshStatus();
});
</script>

<template>
  <v-row>
    <v-col md="10" lg="8">
      <!-- Permission Section -->
      <v-label class="my-2">{{ t("SetNativeBridge.permission.title") }}</v-label>
      <v-card variant="tonal" class="mb-4 pa-4">
        <div class="d-flex align-center ga-3">
          <v-chip
            :color="status.permissionGranted ? 'green' : 'grey'"
            :prepend-icon="status.permissionGranted ? 'mdi-check-circle' : 'mdi-close-circle'"
            variant="elevated"
            size="small"
          >
            {{
              status.permissionGranted
                ? t("SetNativeBridge.permission.granted")
                : t("SetNativeBridge.permission.notGranted")
            }}
          </v-chip>

          <v-btn
            v-if="!status.permissionGranted"
            color="primary"
            variant="elevated"
            size="small"
            :loading="permissionLoading"
            @click="grantPermission"
          >
            {{ t("SetNativeBridge.permission.grant") }}
          </v-btn>
          <v-btn
            v-else
            color="warning"
            variant="text"
            size="small"
            :loading="permissionLoading"
            @click="revokePermission"
          >
            {{ t("SetNativeBridge.permission.revoke") }}
          </v-btn>
        </div>
      </v-card>

      <!-- Bridge Control Section -->
      <v-label class="my-2">{{ t("SetNativeBridge.bridge.title") }}</v-label>
      <v-card variant="tonal" class="mb-4 pa-4" :disabled="!status.permissionGranted">
        <v-switch
          :model-value="status.enabled"
          :label="t('SetNativeBridge.bridge.enabled')"
          :loading="loading"
          :disabled="!status.permissionGranted"
          color="primary"
          hide-details
          class="mb-3"
          @update:model-value="toggleEnabled($event as boolean)"
        />

        <div class="d-flex align-center ga-3">
          <v-chip :color="stateColor[status.state]" variant="elevated" size="small">
            {{ t(`SetNativeBridge.bridge.status.${status.state}`) }}
          </v-chip>

          <v-btn
            color="primary"
            variant="text"
            size="small"
            prepend-icon="mdi-connection"
            :loading="testLoading"
            :disabled="!status.permissionGranted || !status.enabled"
            @click="testConnection"
          >
            {{ t("SetNativeBridge.bridge.testConnection") }}
          </v-btn>
        </div>

        <v-alert v-if="status.lastError" type="error" variant="tonal" density="compact" class="mt-3">
          {{ status.lastError }}
        </v-alert>

        <v-alert
          v-if="
            status.permissionGranted && status.enabled && status.state !== 'connected' && status.state !== 'connecting'
          "
          type="warning"
          variant="tonal"
          density="compact"
          class="mt-3"
        >
          {{ t("SetNativeBridge.info.setupCommand") }}
          <code class="d-block my-2 pa-2 bg-surface rounded">{{ setupCommand }}</code>
          {{ t("SetNativeBridge.info.setupHint") }}
        </v-alert>
      </v-card>

      <!-- Info Section -->
      <v-label class="my-2">{{ t("SetNativeBridge.info.title") }}</v-label>
      <v-alert type="info" variant="tonal">
        {{ t("SetNativeBridge.info.description") }}
        <br /><br />
        <i18n-t keypath="SetNativeBridge.info.cliRequired" tag="span" class="font-weight-bold">
          <a href="https://github.com/pt-plugins/ptd-cli" target="_blank" rel="noopener">
            {{ t("SetNativeBridge.info.cliLink") }}
          </a>
        </i18n-t>
      </v-alert>
      <v-alert type="warning" variant="tonal" class="mt-2">
        {{ t("SetNativeBridge.info.privacy") }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
