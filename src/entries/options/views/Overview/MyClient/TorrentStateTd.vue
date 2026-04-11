<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { type CTorrent, CTorrentState } from "@ptd/downloader";

const { item } = defineProps<{
  item: CTorrent;
}>();

const { t } = useI18n();

// ── state chip display map ────────────────────────────────────────────────
const stateDisplay: Record<CTorrentState, { color: string; icon: string; label: string }> = {
  [CTorrentState.downloading]: { color: "blue", icon: "mdi-download", label: "MyClient.state.downloading" },
  [CTorrentState.seeding]: { color: "green", icon: "mdi-upload", label: "MyClient.state.seeding" },
  [CTorrentState.paused]: { color: "grey", icon: "mdi-pause", label: "MyClient.state.paused" },
  [CTorrentState.queued]: { color: "orange", icon: "mdi-clock-outline", label: "MyClient.state.queued" },
  [CTorrentState.checking]: { color: "cyan", icon: "mdi-refresh", label: "MyClient.state.checking" },
  [CTorrentState.error]: { color: "red", icon: "mdi-alert-circle", label: "MyClient.state.error" },
  [CTorrentState.unknown]: { color: "grey", icon: "mdi-help-circle", label: "MyClient.state.unknown" },
};
</script>

<template>
  <v-chip
    :color="stateDisplay[item.state]?.color ?? 'grey'"
    :prepend-icon="stateDisplay[item.state]?.icon"
    size="small"
    label
  >
    {{ t(stateDisplay[item.state]?.label ?? "MyClient.state.unknown") }}
  </v-chip>
</template>

<style scoped lang="scss"></style>
