<script setup lang="ts">
import SiteFavicon from "@/options/components/SiteFavicon.vue";
import { TSiteID } from "@ptd/site";
import { asyncComputed } from "@vueuse/core";
import { useSiteStore } from "@/options/stores/site.ts";

const siteStore = useSiteStore();

const props = defineProps<{
  siteId: TSiteID;
}>();

const siteConfig = siteStore.sites[props.siteId];

const siteUrl = asyncComputed(async () => {
  if (siteConfig.url) {
    return siteConfig.url;
  }
  const siteMetadata = await siteStore.getSiteMetadata(props.siteId);
  return siteMetadata.urls?.[0] ?? "#";
}, "#");

const siteName = asyncComputed(async () => {
  if (siteConfig.merge?.name) {
    return siteConfig.merge.name;
  }
  const siteMetadata = await siteStore.getSiteMetadata(props.siteId);
  return siteMetadata.name ?? props.siteId;
}, props.siteId);
</script>

<template>
  <div class="d-flex flex-column align-center">
    <SiteFavicon v-model="props.siteId" :size="18" />
    <a
      :href="siteUrl"
      target="_blank"
      rel="noopener noreferrer nofollow"
      class="text-caption text-decoration-none text-blue-grey-lighten-1"
    >
      {{ siteName }}
    </a>
  </div>
</template>

<style scoped lang="scss"></style>
