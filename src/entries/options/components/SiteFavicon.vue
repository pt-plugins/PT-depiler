<script setup lang="ts">
import { NO_IMAGE, type TSiteID } from "@ptd/site";
import { computedAsync } from "@vueuse/core";
import { getSiteFavicon } from "@/shared/adapters/site.ts";

const props = withDefaults(
  defineProps<{
    siteId: TSiteID;
    size?: number;
  }>(),
  { size: 32 },
);

const siteFavicon = computedAsync(() => getSiteFavicon(props.siteId), NO_IMAGE);
</script>

<template>
  <slot :favicon="siteFavicon">
    <v-img :height="props.size" :src="siteFavicon" :width="props.size" aspect-ratio="1/1" />
  </slot>
</template>

<style scoped lang="scss"></style>
