<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { TSiteID, ISiteUserConfig } from "@ptd/site";
import type { ISiteMetadataIndexEntry } from "@ptd/site/metadataIndex";

import { useMetadataStore } from "@/options/stores/metadata.ts";

const { item } = defineProps<{
  item: {
    id: TSiteID;
    metadata: ISiteMetadataIndexEntry;
    userConfig: ISiteUserConfig;
  };
}>();

const metadataStore = useMetadataStore();

const searchEntryEnabledStatus = reactive<Record<string, boolean>>({});

onMounted(() => {
  // 索引里的 searchEntries 只保留了 name / enabled 两个标量（每个入口自己的搜索参数可能含函数）
  for (const [entryKey, entry] of Object.entries(item.metadata.searchEntries ?? {})) {
    let entryEnabledStatus = false;
    if (typeof item.userConfig.merge?.searchEntry?.[entryKey]?.enabled === "boolean") {
      entryEnabledStatus = item.userConfig.merge.searchEntry[entryKey].enabled;
    } else {
      entryEnabledStatus = entry.enabled ?? true;
    }

    searchEntryEnabledStatus[entryKey] = entryEnabledStatus;
  }
});
</script>

<template>
  <v-list>
    <v-list-item v-for="(searchEntry, entryKey) in item.metadata.searchEntries" :key="entryKey" :value="entryKey">
      <v-list-item-title>
        <v-switch
          v-model="searchEntryEnabledStatus[entryKey]"
          :label="searchEntry.name"
          class="mx-3"
          color="success"
          hide-details
          @update:model-value="
            (v) => metadataStore.simplePatch('sites', item.id, `merge.searchEntry.${entryKey}.enabled`, v as boolean)
          "
        ></v-switch>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style scoped lang="scss"></style>
