import { computed, ref } from "vue";

import type { CTorrent } from "@ptd/downloader";
import { sendMessage } from "@/messages.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { useRuntimeStore } from "@/options/stores/runtime.ts";
import { useI18n } from "vue-i18n";

// ── module-level shared state ─────────────────────────────────────────────

/** Loaded torrent list, shared between Index.vue and ClientStatusDialog.vue. */
export const torrents = ref<CTorrent[]>([]);

/** Which downloader IDs are selected in the torrent filter (empty = all). */
export const selectedDownloaderIds = ref<string[]>([]);

/** Downloaders whose auto-refresh has been suspended due to ≥3 consecutive failures. */
export const suspendedDownloaders = ref(new Set<string>());

/** Global auto-refresh interval in seconds (0 = off). */
export const globalRefreshInterval = ref(0);

/** Whether auto-refresh is currently running. */
export const autoRefreshRunning = ref(false);

// private – not reactive, managed by the composable only
const failCounts = new Map<string, number>();
const refreshTimers = new Map<string, number>();

// ── composable ────────────────────────────────────────────────────────────

/**
 * Composable providing auto-refresh logic for the MyClient page.
 * All state is module-level and shared across component instances.
 */
export function useClientRefresh() {
  const { t } = useI18n();
  const metadataStore = useMetadataStore();
  const runtimeStore = useRuntimeStore();

  const enabledDownloaders = computed(() => metadataStore.getEnabledDownloaders);

  const activeDownloaderIds = computed(() =>
    selectedDownloaderIds.value.length > 0
      ? selectedDownloaderIds.value
      : enabledDownloaders.value.map((d) => d.id),
  );

  function clearDownloaderTimer(id: string) {
    const tid = refreshTimers.get(id);
    if (tid) {
      clearTimeout(tid);
      refreshTimers.delete(id);
    }
  }

  async function loadSingleDownloader(id: string): Promise<void> {
    try {
      const result = await sendMessage("getClientTorrents", id);
      torrents.value = [...torrents.value.filter((t) => t.clientId !== id), ...result];
      failCounts.set(id, 0);
    } catch {
      const prev = failCounts.get(id) ?? 0;
      const next = prev + 1;
      failCounts.set(id, next);
      if (next >= 3) {
        suspendedDownloaders.value.add(id);
        clearDownloaderTimer(id);
        runtimeStore.showSnakebar(
          t("MyClient.autoRefresh.clientSuspended", { name: metadataStore.downloaders[id]?.name ?? id }),
          { color: "error", timeout: 8000 },
        );
      }
    }
  }

  function scheduleDownloaderRefresh(id: string) {
    if (!autoRefreshRunning.value) return;
    if (suspendedDownloaders.value.has(id)) return;
    if (globalRefreshInterval.value <= 0) return;

    clearDownloaderTimer(id);
    const tid = window.setTimeout(async () => {
      await loadSingleDownloader(id);
      scheduleDownloaderRefresh(id);
    }, globalRefreshInterval.value * 1000);
    refreshTimers.set(id, tid);
  }

  function stopAllTimers() {
    for (const id of refreshTimers.keys()) {
      clearDownloaderTimer(id);
    }
    autoRefreshRunning.value = false;
  }

  /** Reset failure-tracking and suspended state (call before a manual full reload). */
  function resetRefreshState() {
    suspendedDownloaders.value = new Set();
    failCounts.clear();
  }

  function resumeDownloaderRefresh(id: string) {
    suspendedDownloaders.value.delete(id);
    failCounts.set(id, 0);
    if (autoRefreshRunning.value) {
      scheduleDownloaderRefresh(id);
    }
  }

  function startAutoRefresh() {
    if (globalRefreshInterval.value <= 0) return;
    autoRefreshRunning.value = true;
    for (const id of activeDownloaderIds.value) {
      scheduleDownloaderRefresh(id);
    }
  }

  function stopAutoRefresh() {
    stopAllTimers();
    resetRefreshState();
  }

  function toggleAutoRefresh() {
    if (autoRefreshRunning.value) {
      stopAutoRefresh();
    } else {
      startAutoRefresh();
    }
  }

  return {
    enabledDownloaders,
    activeDownloaderIds,
    loadSingleDownloader,
    clearDownloaderTimer,
    scheduleDownloaderRefresh,
    stopAllTimers,
    resetRefreshState,
    resumeDownloaderRefresh,
    startAutoRefresh,
    stopAutoRefresh,
    toggleAutoRefresh,
  };
}
