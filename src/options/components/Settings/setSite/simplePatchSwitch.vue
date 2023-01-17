<script setup lang="ts">
import { get } from "lodash-es";
import { useSiteStore } from "@/shared/store/site";
import { computed } from "vue";
import { type ISiteMetadata } from "@ptpp/site";

const props = defineProps<{
  config: ISiteMetadata,
  modelKey: keyof ISiteMetadata
}>();


const simplePatchSite = (new_value: any) => {
  const siteStore = useSiteStore();
};

const value = get(props.config, props.modelKey);

const disable = computed(() =>
  props.config.isOffline === true &&
  (props.modelKey !== "isOffline") // 站点已经关闭
  || (props.modelKey == "allowSearch" && props.config.schema === "AbstractBittorrentSite")
);
</script>

<template>
  <v-switch
    v-model="value"
    :disabled="disable"
    color="success"
    hide-details
    @update:model-value="simplePatchSite"
  />
</template>


<style scoped>

</style>
