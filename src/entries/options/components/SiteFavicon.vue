<script setup lang="ts">
import { NO_IMAGE, type TSiteID } from "@ptd/site";
import { asyncComputed } from "@vueuse/core";
import { getSiteFavicon } from "@/shared/adapters/site.ts";

const props = withDefaults(
  defineProps<{
    modelValue: TSiteID;
    size?: number;
  }>(),
  { size: 32 },
);

const siteFavicon = asyncComputed(() => {
  return getSiteFavicon(props.modelValue);
}, NO_IMAGE);
</script>

<template>
  <v-img :src="siteFavicon" :height="props.size" :width="props.size" />
</template>

<style scoped lang="scss"></style>
