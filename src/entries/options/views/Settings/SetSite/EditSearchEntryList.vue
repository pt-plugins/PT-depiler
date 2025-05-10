<script setup lang="ts">
import { ISiteMetadata, ISiteUserConfig, TSiteID } from "@ptd/site";
import { useMetadataStore } from "@/options/stores/metadata.ts";
import { reactive, onMounted } from "vue";

const { item } = defineProps<{
  item: {
    id: TSiteID;
    metadata: ISiteMetadata;
    userConfig: ISiteUserConfig;
  };
}>();

const metadataStore = useMetadataStore();

const searchEntryEnabledStatus = reactive<Record<string, boolean>>({});

onMounted(() => {
  for (const [entryKey, entry] of Object.entries(item.metadata.searchEntry!)) {
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
    <v-list-item v-for="(searchEntry, entryKey) in item.metadata.searchEntry" :key="entryKey" :value="entryKey">
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
