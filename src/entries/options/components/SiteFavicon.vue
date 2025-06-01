<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { NO_IMAGE, type TSiteID } from "@ptd/site";

import { sendMessage } from "@/messages.ts";

const { siteId, size = 32 } = defineProps<{
  siteId: TSiteID;
  size?: number;
}>();

const siteFavicon = computedAsync(async () => await sendMessage("getSiteFavicon", { site: siteId }), NO_IMAGE);
</script>

<template>
  <v-img :height="size" :src="siteFavicon" :width="size" aspect-ratio="1/1" />
</template>

<style scoped lang="scss"></style>
