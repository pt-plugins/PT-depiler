<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { getDownloaderIcon } from "@ptd/downloader";

import { useMetadataStore } from "@/options/stores/metadata.ts";
import type { TDownloaderKey } from "@/shared/types.ts";

const { downloader } = defineProps<{
  downloader: TDownloaderKey;
}>();

const { t } = useI18n();
const metadataStore = useMetadataStore();

const downloaderConfig = metadataStore.downloaders[downloader];

const downloaderIcon = computed(() => {
  return downloader === "local"
    ? { color: "amber", icon: "mdi-folder-download", size: 40 }
    : downloaderConfig
      ? { image: getDownloaderIcon(downloaderConfig.type) }
      : { icon: "mdi-cloud-remove", color: "grey", size: 40 };
});
</script>

<template>
  <slot :config="downloaderConfig" :icon="downloaderIcon">
    <div class="downloader_label">
      <div class="pa-0 downloader_icon">
        <v-avatar v-bind="downloaderIcon"></v-avatar>
      </div>
      <div class="downloader_info align-self-center">
        <span class="font-weight-bold">
          <template v-if="downloader === 'local'">{{ t("downloaderLabel.localDownload") }}</template>
          <template v-else-if="downloaderConfig">{{ downloaderConfig.name }}</template>
          <template v-else>
            <span class="text-decoration-line-through text-no-wrap">[{{ downloader }}]</span>
          </template>
        </span>
        <template v-if="downloaderConfig">
          <br />
          <a :href="downloaderConfig.address" class="text-caption" target="_blank">
            [{{ downloaderConfig.address }}]
          </a>
        </template>
      </div>
    </div>
  </slot>
</template>

<style scoped lang="scss">
.downloader_label {
  display: grid;
  grid-column-gap: 4px;
  grid-row-gap: 4px;
  justify-content: left;

  .downloader_icon {
    grid-area: 1 / 1 / 2 / 2;
  }
  .downloader_info {
    grid-area: 1 / 2 / 2 / 3;
  }
}
</style>
