<script setup lang="ts">
import { get } from "lodash-es";
import { expandStoreSiteConfig, useSiteStore } from "@/shared/store/site";
import { computed } from "vue";

const props = defineProps<{
  config: expandStoreSiteConfig,
  modelKey: keyof expandStoreSiteConfig["rewriteConfig"],
  defaultModelValue?: boolean,
  disableKey?: string,
  disableWhen?: boolean
}>();


const simplePatchSite = (new_value: any) => {
  const siteStore = useSiteStore();
  const {
    id,
    rewriteConfig = {}
  } = props.config;

  rewriteConfig[props.modelKey] = new_value;

  siteStore.patchSite({
    id,
    rewriteConfig
  });
};

const value = get(props.config.rewriteConfig, props.modelKey, props.defaultModelValue) ?? false;

const disable = computed(() =>
  props.config.metadata.isDead === true  // 站点已经关闭
  || (props.modelKey !== "isOffline" && props.config.rewriteConfig.isOffline === true)   // 站点已经离线
  || (props.modelKey == "allowQueryUserInfo" && props.config.metadata.schema === "AbstractBittorrentSite")
);
</script>

<template>
  <v-switch
    v-model="value"
    :disabled="disable || get(config, props.disableKey) === (props.disableWhen ?? false)"
    color="success"
    hide-details
    @update:model-value="simplePatchSite"
  />
</template>


<style scoped>

</style>
