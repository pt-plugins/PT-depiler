<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { useSiteStore } from "@/options/stores/site.ts";
import { TSiteID } from "@ptd/site";

const siteStore = useSiteStore();

const props = withDefaults(
  defineProps<{
    siteId: TSiteID;
    class?: string[] | string;
  }>(),
  {
    class: ["text-caption", "text-decoration-none", "text-grey", "text-no-wrap"],
  },
);

const siteUrl = computedAsync(() => siteStore.getSiteUrl(props.siteId), "#");
const siteName = computedAsync(() => siteStore.getSiteMergedMetadata(props.siteId, "name", props.siteId));
</script>

<template>
  <a :href="siteUrl" target="_blank" rel="noopener noreferrer nofollow" :class="props.class">
    {{ siteName }}
  </a>
</template>

<style scoped lang="scss"></style>
