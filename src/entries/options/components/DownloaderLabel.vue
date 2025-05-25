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
    <v-container>
      <v-row>
        <div class="pa-0">
          <template v-if="downloaderIcon.icon">
            <v-icon v-bind="downloaderIcon"></v-icon>
          </template>
          <template v-else>
            <v-avatar v-bind="downloaderIcon"></v-avatar>
          </template>
        </div>
        <v-col class="pa-0 ml-2 align-self-center">
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
        </v-col>
      </v-row>
    </v-container>
  </slot>
</template>

<style scoped lang="scss"></style>
