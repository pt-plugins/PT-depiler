<script setup lang="ts">
import type { TDownloaderKey } from "@/shared/storages/types/metadata.ts";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { computed } from "vue";
import { getDownloaderIcon } from "@ptd/downloader";

const { downloader } = defineProps<{
  downloader: TDownloaderKey;
}>();

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
            <template v-if="downloader === 'local'">本地下载</template>
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
