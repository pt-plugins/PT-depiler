<script setup lang="ts">
import { NO_IMAGE, type TSiteID } from "@ptd/site";
import { asyncComputed } from "@vueuse/core";
import { getSiteFavicon } from "@/shared/adapters/site.ts";

const props = defineProps<{
  modelValue: TSiteID;
}>();

const siteFavicon = asyncComputed(() => {
  return getSiteFavicon(props.modelValue);
}, NO_IMAGE);
</script>

<template>
  <v-img :src="siteFavicon" width="32" height="32" />
</template>

<style scoped lang="scss"></style>
